import { useSearchParams } from "@hooks";
import { useTranslation } from 'react-i18next';
import ReactToPrint from 'react-to-print';
import React, { useState, useEffect, useRef } from 'react';
import { Button, ButtonEnums, Select, Typography, Icon } from '@ohif/ui';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { WordCount } from 'ckeditor5';

import './ReportComponent.css';
import PdfComponent from './PdfComponent';
import {
  ClassicEditor,
  AccessibilityHelp,
  Alignment,
  Autosave,
  Bold,
  Essentials,
  FontBackgroundColor,
  FontColor,
  FontFamily,
  FontSize,
  GeneralHtmlSupport,
  Heading,
  Indent,
  IndentBlock,
  Italic,
  Paragraph,
  SelectAll,
  SpecialCharacters,
  Underline,
  Undo
} from 'ckeditor5';

import 'ckeditor5/ckeditor5.css';
import './ReportComponent.css';
import Utils from '../utils';
import * as ReportUtils from '../reportUtils';
import Constants from '../constants'
import { fetchOrder, fetchRadiologists, createReport, updateReport } from '../services'

let nextId = 0;
const ReportComponent = ({ props }) => {
  const { t } = useTranslation('Report');
  // Create Document Component
  const editorContainerRef = useRef(null);
  const editorRef = useRef(null);
  const [isLayoutReady, setIsLayoutReady] = useState(false);
  const editorConfig = {
    toolbar: {
      items: [
        'undo', 'redo', '|', 'selectAll', '|', 'heading', '|', 'fontSize', 'fontFamily', 'fontColor', 'fontBackgroundColor', '|', 'bold', 'italic', 'underline', '|',
        'specialCharacters', '|', 'alignment', '|', 'indent', 'outdent', '|', 'accessibilityHelp'
      ],
      shouldNotGroupWhenFull: false
    },
    plugins: [
      AccessibilityHelp,
      Alignment,
      Autosave,
      Bold,
      Essentials,
      FontBackgroundColor,
      FontColor,
      FontFamily,
      FontSize,
      GeneralHtmlSupport,
      // Heading,
      Indent,
      IndentBlock,
      Italic,
      Paragraph,
      SelectAll,
      SpecialCharacters,
      Underline,
      Undo,
      WordCount
    ],
    // WordCount: {

    //   // Whether or not you want to show the Paragraphs Count
    //   showParagraphs: false,

    //   // Whether or not you want to show the Word Count
    //   showWordCount: false,

    //   // Whether or not you want to show the Char Count
    //   showCharCount: true,

    //   // Whether or not you want to count Spaces as Chars
    //   countSpacesAsChars: true,

    //   // Whether or not to include Html chars in the Char Count
    //   countHTML: true,

    //   // Maximum allowed Word Count, -1 is default for unlimited
    //   maxWordCount: 400,

    //   // Maximum allowed Char Count, -1 is default for unlimited
    //   maxCharCount: 10
    // },
    fontFamily: {
      supportAllValues: true
    },
    fontSize: {
      options: [10, 12, 14, 'default', 18, 20, 22],
      supportAllValues: true
    },

    htmlSupport: {
      allow: [
        {
          name: /^.*$/,
          styles: true,
          attributes: true,
          classes: true
        }
      ]
    },
    initialData:
      "",
    placeholder: 'Type or paste your content here!'
  };

  // Get query params
  const searchParams = useSearchParams();
  const accession_no = searchParams.get("acn")
  const study_iuid = searchParams.get("StudyInstanceUIDs")

  const componentRef = useRef<HTMLDivElement>(null);


  const emptyOrderData =
  {
    "accession_no": "",
    "req_phys_code": "",
    "req_phys_name": "",
    "clinical_diagnosis": "",
    "order_time": "",
    "modality_type": "",
    "is_insurance_applied": false,
    "patient": {
      "pid": "",
      "fullname": "",
      "gender": "",
      "dob": "",
      "tel": "",
      "address": "",
      "insurance_no": ""
    },
    "procedures":
      [{
        "proc_id": "",
        "study_iuid": "",
        "code": "",
        "name": "",
      }]
  }
  const emptyReportData = {
    "id": "",
    "accession_no": "",
    "study_iuid": "",
    "findings": "",
    "conclusion": "",
    "status": "",
    "radiologist": {
      "doctor_no": "",
      "fullname": "",
      "title": "",
      "sign": ""
    },
    "procedure": {
      "code": "",
      "name": ""
    }
  }
  const emptyError = {
    fatal: "",
    system: "", // disabled all
    findings: "",
    conclusion: "",
    radiologist: ""
  }
  const [orderData, setOrderData] = useState(emptyOrderData)
  const [reportData, setReportData] = useState(emptyReportData)

  const [radiologistList, setRadiologistList] = useState({});

  const [selectedRadiologist, setSelectedRadiologist] = useState({ value: "", label: t('-------- Select --------') });

  const [info, setInfo] = useState('');
  const [errors, setErrors] = useState(emptyError);

  const [showElement, setShowElement] = useState(true)

  // function _getQueryFilterValues(params) {
  //   const newParams = new URLSearchParams();
  //   for (const [key, value] of params) {
  //     newParams.set(key.toLowerCase(), value);
  //   }
  //   return newParams;
  // };

  useEffect(() => {

    // Get Order
    getOrder(accession_no);
    // Get list of radiologists
    getRadiologists();

    setIsLayoutReady(true);
    return () => setIsLayoutReady(false);
  }, []);

  const getOrder = async (accession) => {

    if (Utils.isEmpty(accession)) {
      setErrors({ ...errors, fatal: t('Incorrect data! Please close and open the report again') });
    }
    try {
      const response = await fetchOrder(accession);
      const response_data = response?.data;

      if (response_data.result.status == 'NG') {
        // let errors = {''};
        setErrors({ ...errors, fatal: response_data.result.msg });
      } else if (Utils.isObjectEmpty(response_data.data)) {
        // TODO Get data from image and set to

        setOrderData(emptyOrderData);
        setReportData(emptyReportData);
        setErrors({ ...errors, fatal: t('No applicable order found') });

      } else {
        response_data.data.procedures.map((procedure, index) => {
          // Get report of current studyInstanceUid
          if (procedure.study_iuid === study_iuid) {
            let report = procedure.report;
            report.procedure = {
              "id": procedure.proc_id, // procedure
              "code": procedure.code, // procedure_type
              "name": procedure.name// procedure_type
            }
            setReportData(report);

            // Check report exist
            if (report.id) {
              // Add current value to selectedRadiologist
              setSelectedRadiologist({ value: report.radiologist.id, label: report.radiologist.fullname });
            }
          }
        });
        setOrderData(response_data.data);
      }

    } catch (error: any) {
      console.log(error);
      setErrors({ ...errors, fatal: error });
    }
  }
  const getRadiologists = async () => {
    try {
      const response = await fetchRadiologists();
      const response_data = response?.data;

      if (response_data.result.status == 'NG') {
        setErrors({ ...errors, fatal: response_data.result.msg });
      } else if (Utils.isObjectEmpty(response_data.data)) {
        // Get data from image and set to
        //setRadiologistList(response_data.data);
        setErrors({ ...errors, fatal: t('There is no any radiologist. Please contact your administrator.') });
      } else {
        let newList = [];

        response_data.data.map(item => (newList.push({ value: item.id, label: item.fullname })));
        setRadiologistList(newList);
      }
    } catch (error: any) {
      console.log(error);
      setErrors({ ...errors, fatal: error });
    }
  }
  // const clearState = () => {
  //   setErrors({ ...emptyError });
  // };

  const onClose = (event) => {
    // Close the current tab
    window.close();
  };

  const onEditReport = (event) => {
    reportData.status = Constants.DRAFT
    // Update status
    setReportData(reportData);
  }
  const onApprove = (event) => {
    // Final status
    doReport(event, Constants.FINAL);
  };
  const onSave = (event) => {
    // Draft status
    doReport(event, Constants.DRAFT);

    //alert(state.workingItem.report);
    // Generate a HL7 msg
  };

  const doReport = async (event, status) => {
    // Validate first, if error, set error to state and show
    let isError = validate();

    // If no error (error = empty)
    if (!isError) {
      if (Utils.isEmpty(reportData.id)) {
        // Create a new report
        let data =
        {
          "accession_no": accession_no,
          "study_iuid": study_iuid,
          "findings": reportData.findings,
          "conclusion": reportData.conclusion,
          "status": status,
          "radiologist_id": reportData.radiologist.id,
          "procedure_id": reportData.procedure.id
        }

        // Create
        await onCreateReport(event, data);
      } else {
        // Update the report
        let data =
        {
          "findings": reportData.findings,
          "conclusion": reportData.conclusion,
          "status": status,
        }
        // Update
        await onUpdateReport(event, reportData.id, data);
      }
    }
    // Set number of time showing information message, 3s
    setTimeout(function () {
      setShowElement(false)
    }, 5000);
  }

  // const isDisabled = () => {
  //   // If no system error
  //   if (Utils.isEmpty(errors.system)) {
  //     return false;
  //   }
  //   return true;
  // }

  // const setEmptyError = () => {
  //   setErrors({ ...errors, system: "" });
  //   setErrors({ ...errors, findings: "" });
  //   setErrors({ ...errors, conclusion: "" });
  //   setErrors({ ...errors, radiologist: "" });
  // }
  const onCreateReport = async (event, data) => {
    event.preventDefault();

    setInfo('')
    console.log(data);

    try {
      // Call Rest API
      const response = await createReport(data);

      const response_data = response.data;

      if (response_data.result.status == 'NG') {
        setErrors({ ...errors, system: response_data.result.msg });

      } else {
        let info_msg = 'The report is saved as draft'
        if (data.status === Constants.FINAL)
          info_msg = 'The report is approved'

        setInfo(t(info_msg));
        // Set latest report
        setReportData(response_data.data);
      }
    } catch (error) {
      // handle error
      console.log(error);
      setErrors({ ...errors, system: error });
    }
  }

  const onUpdateReport = async (event, id, data) => {
    event.preventDefault();

    setInfo('')
    console.log(data);

    try {
      const response = await updateReport(id, data);

      const response_data = response.data;

      if (response_data.result.status == 'NG') {
        setErrors({ ...errors, system: response_data.result.msg });

      } else {
        let info_msg = 'The report is updated as draft'
        if (data.status === Constants.FINAL)
          info_msg = 'The report is re-approved'

        setInfo(t(info_msg));
        // Set latest report
        setReportData(response_data.data);
      }
    } catch (error) {
      // handle error
      console.log(error);
      setErrors({ ...errors, system: error });
    }
  }

  const validate = () => {
    setErrors(emptyError);
    let isError = false;

    const findings = reportData.findings;
    const conclusion = reportData.conclusion

    let item = t('Findings');

    // Check conclusion
    if (Utils.isEmpty(findings)) {
      setErrors({ ...errors, findings: t('{0} is required').replace('{0}', item) });
      isError = true;
    }
    if (Utils.isEmpty(conclusion)) {
      item = t('Conclusion');
      setErrors({ ...errors, conclusion: t('{0} is required').replace('{0}', item) });
      isError = true;
    }

    if (Utils.isEmpty(selectedRadiologist)) {
      item = t('Radiologist');
      setErrors({ ...errors, radiologist: t('{0} is required').replace('{0}', item) });
      isError = true;
    }

    return isError;
  };

  const onChangeFindings = (event, editor) => {//Update data when input finding
    const data = editor.getData();
    setReportData(reportData => ({ ...reportData, findings: data }));

  };
  const onChangeConclusion = (event, editor) => {
    const data = editor.getData();
    setReportData(reportData => ({ ...reportData, conclusion: data }));
  };

  const onChangeRadiologistHandler = (value) => {
    setSelectedRadiologist(value);
  };


  return (
    <>
      <div className='bg-secondary-dark z-20 border-black px-1 relative'>
        <div className='relative h-[48px] items-center'>

          <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform flex gap-2'>
            <ReactToPrint
              trigger={() => (
                <Button
                  type={ButtonEnums.type.primary}
                  size={ButtonEnums.size.medium}
                  disabled={!ReportUtils.isPrintEnabled(reportData.status)}
                  startIcon={
                    <svg xmlns="http://www.w3.org/2000/svg" style={{ fill: 'none' }} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-printer"><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><path d="M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6" /><rect x="6" y="14" width="12" height="8" rx="1" /></svg>
                  }
                >
                  {t('Print Preview')}
                </Button>
              )}
              content={() => componentRef.current}
            />
            {/* Icons: https://lucide.dev/icons */}
            <Button
              type={ButtonEnums.type.primary}
              size={ButtonEnums.size.medium}
              startIcon={
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style={{ fill: 'none' }} className="lucide lucide-square-check-big"><path d="m9 11 3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>
              }
              onClick={onApprove}
              className={'text-[13px]'}
              style={{ fill: 'none' }}
              disabled={!ReportUtils.isApproveEnabled(reportData.status, errors.fatal)}
            >
              {t('Approve')}
            </Button>
            <Button
              type={ButtonEnums.type.primary}
              size={ButtonEnums.size.medium}
              startIcon={
                <svg xmlns="http://www.w3.org/2000/svg" style={{ fill: 'none' }} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-pencil"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" /><path d="m15 5 4 4" /></svg>
              }
              onClick={onEditReport}
              className={'text-[13px]'}
              disabled={!ReportUtils.isEditEnabled(reportData.status)}
            >
              {t('Edit')}
            </Button>
            <Button
              type={ButtonEnums.type.primary}
              size={ButtonEnums.size.medium}
              startIcon={
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style={{ fill: 'none' }} className="lucide lucide-save"><path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" /><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7" /><path d="M7 3v4a1 1 0 0 0 1 1h7" /></svg>
              }
              onClick={onSave}
              className={'text-[13px]'}
              disabled={!ReportUtils.isSaveEnabled(reportData.status)}
            >
              {t('Save as Draft')}
            </Button>
            <Button
              type={ButtonEnums.type.primary}
              size={ButtonEnums.size.medium}
              startIcon={
                <svg xmlns="http://www.w3.org/2000/svg" style={{ fill: 'none' }} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-square-x"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><path d="m15 9-6 6" /><path d="m9 9 6 6" /></svg>
              }
              onClick={onClose}
              className={'text-[13px]'}
              style={{ fill: 'none' }}
            >
              {t('Close')}
            </Button>
          </div>
        </div>
      </div>
      <div className='relative flex h-screen w-full flex-row flex-nowrap items-stretch overflow-auto bg-black'
        style={{ height: 'calc(100vh - 52px' }}
      >
        {/* Left panel */}
        <div className='transition-all duration-300 ease-in-out bg-black border-r border-black justify-start box-content flex flex-col mr-1'
          style={{
            marginLeft: '0px',
            maxWidth: '448px',
            width: '448px',
            position: 'relative',
            // top: '0.2%',
            // height: '99.8%'
          }}
        >
          <div className="w-full text-white p-2 mt-2">
            <div className='text-blue-300' style={{ fontSize: '17px' }}>{t('Patient Information')}</div>
            <div className="flex flex-row">
              <div className="flex w-full flex-row">
                <div className="flex flex-row w-full">
                  <div className="flex flex-col p-2 text-right w-full">
                    <div className="mb-2 flex flex-row justify-between">
                      <div className="flex flex-col items-center">
                        <Typography
                          variant="subtitle"
                          className='font-semibold text-primary-light w-full text-right'>
                          {t('Patient Name')}
                        </Typography>

                      </div>
                      <div className="flex flex-col">
                        <Typography
                          variant="subtitle"
                          className='text-primary-light pl-0 text-left'>
                          {orderData.patient.fullname}
                        </Typography>
                      </div>
                    </div>
                    <div className="mb-2 flex flex-row justify-between">
                      <div className="flex flex-col items-center">
                        <Typography
                          variant="subtitle"
                          className='font-semibold text-primary-light w-full text-right'>
                          {t('PID')}
                        </Typography>
                      </div>
                      <div className="flex flex-col">
                        <Typography
                          variant="subtitle"
                          className='text-primary-light pl-0 text-left'>
                          {orderData.patient.pid}
                        </Typography>
                      </div>
                    </div>
                    <div className="mb-2 flex flex-row justify-between">
                      <div className="flex flex-col items-center">
                        <Typography
                          variant="subtitle"
                          className='font-semibold text-primary-light w-full text-right'>
                          {t('DOB')}
                        </Typography>
                      </div>
                      <div className="flex flex-col">
                        <Typography
                          variant="subtitle"
                          className='text-primary-light pl-0 text-left'>
                          {Utils.formatDate(orderData.patient.dob)}
                        </Typography>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full text-white p-2">
            <div className='text-blue-300' style={{ fontSize: '17px' }}>{t('Order Information')}</div>
            <div className="flex flex-row">
              <div className="flex w-full flex-row">
                <div className="flex flex-row w-full">
                  <div className="flex flex-col p-2 text-right w-full">
                    <div className="mb-2 flex flex-row justify-between">
                      <div className="flex flex-col items-center">
                        <Typography
                          variant="subtitle"
                          className='font-semibold text-primary-light w-full text-right'>
                          {t('ACN')}
                        </Typography>
                      </div>
                      <div className="flex flex-col">
                        <Typography
                          variant="subtitle"
                          className='text-primary-light pl-0 text-left'>
                          {orderData.accession_no}
                        </Typography>
                      </div>
                    </div>
                    <div className="mb-2 flex flex-row justify-between">
                      <div className="flex flex-col items-center">
                        <Typography
                          variant="subtitle"
                          className='font-semibold text-primary-light w-full text-right'>
                          {t('Procedure')}
                        </Typography>
                      </div>
                      <div className="flex flex-col">
                        <Typography
                          variant="subtitle"
                          className='text-primary-light pl-0 text-left'>
                          {orderData.procedures[0].name}
                        </Typography>
                      </div>
                    </div>
                    <div className="mb-2 flex flex-row justify-between">
                      <div className="flex flex-col items-center">
                        <Typography
                          variant="subtitle"
                          className='font-semibold text-primary-light w-full text-right'>
                          {t('Indication')}
                        </Typography>
                      </div>
                      <div className="flex flex-col">
                        <Typography
                          variant="subtitle"
                          className='text-primary-light pl-0 text-left'>
                          {orderData.clinical_diagnosis}
                        </Typography>
                      </div>
                    </div>

                    <div className="mb-2 flex flex-row justify-between">
                      <div className="flex flex-col items-center">
                        <Typography
                          variant="subtitle"
                          className='font-semibold text-primary-light w-full text-right'>
                          {t('Ordering Physician')}
                        </Typography>
                      </div>
                      <div className="flex flex-col">
                        <Typography
                          variant="subtitle"
                          className='text-primary-light pl-0 text-left'>
                          {orderData.req_phys_name}
                        </Typography>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
          <div className="w-full text-white p-2">
            <div className='text-blue-300' style={{ fontSize: '17px' }}>{t('Report Information')}</div>
            <div className="flex flex-row">
              <div className="flex w-full flex-row">
                <div className="flex flex-row w-full">
                  <div className="flex flex-col text-right w-full">
                    <div className="p-2 flex flex-row justify-between">
                      <div className="flex flex-col items-center">
                        <Typography
                          variant="subtitle"
                          className='font-semibold text-primary-light w-full text-right'>
                          {t('Radiologist')}
                        </Typography>
                      </div>

                      {reportData.id && (<div className="flex flex-col">
                        <Typography
                          variant="subtitle"
                          className='text-primary-light pl-0 text-left'>
                          {reportData.radiologist.title}. {reportData.radiologist.fullname}
                        </Typography>
                      </div>)}
                      {!reportData.id && (<div className="flex flex-col w-56">
                        <Select
                          isClearable={false}
                          onChange={onChangeRadiologistHandler}
                          options={radiologistList}
                          value={selectedRadiologist}
                        />

                      </div>)}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Right panel - Findigs/Conclusion*/}
        <div className="mr-2 main-container flex h-full flex-1 flex-col">
          <div className="flex flex-row w-full">
            <div className="flex flex-col text-left w-full">
              {!ReportUtils.isReportErrorEmpty(errors) && (<div role="alert">
                <div className="bg-red-500 text-white font-bold rounded-t px-4 py-2">
                  {t('Error')}
                </div>
                <div className="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
                  <ul className="list-disc">
                    {!Utils.isEmpty(errors.fatal) && (<li>{errors.fatal}</li>)}
                    {!Utils.isEmpty(errors.system) && (<li>{errors.system}</li>)}
                    {!Utils.isEmpty(errors.radiologist) && (<li>{errors.radiologist}</li>)}
                    {!Utils.isEmpty(errors.findings) && (<li>{errors.findings}</li>)}
                    {!Utils.isEmpty(errors.conclusion) && (<li>{errors.conclusion}</li>)}
                  </ul>
                </div>
              </div>)}
              {!Utils.isEmpty(info) && showElement && (<div className="flex items-center border border-t-0 border-blue-500 rounded bg-blue-500 px-4 py-3 text-white" role="alert">
                <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M12.432 0c1.34 0 2.01.912 2.01 1.957 0 1.305-1.164 2.512-2.679 2.512-1.269 0-2.009-.75-1.974-1.99C9.789 1.436 10.67 0 12.432 0zM8.309 20c-1.058 0-1.833-.652-1.093-3.524l1.214-5.092c.211-.814.246-1.141 0-1.141-.317 0-1.689.562-2.502 1.117l-.528-.88c2.572-2.186 5.531-3.467 6.801-3.467 1.057 0 1.233 1.273.705 3.23l-1.391 5.352c-.246.945-.141 1.271.106 1.271.317 0 1.357-.392 2.379-1.207l.6.814C12.098 19.02 9.365 20 8.309 20z" /></svg>
                <p>{info}</p>
              </div>
              )}

              {/* Show report text in label */}
              <div className="mt-2 p-2 flex flex-col">
                <div className="flex flex-row justify-between">
                  <div className='w-full text-blue-300' style={{ fontSize: '17px' }}>
                    {t('Findings')}
                  </div>
                </div>
                {ReportUtils.isFinalReport(reportData.status) && (
                  <div className="flex flex-col p-2">
                    <Typography
                      variant="subtitle"
                      className='text-primary-light pl-0 text-left'>
                      <div className="findings" dangerouslySetInnerHTML={{ __html: reportData.findings }} />
                    </Typography>
                  </div>
                )}
                {!ReportUtils.isFinalReport(reportData.status) && (
                  <div className="editor-container editor-container_classic-editor" ref={editorContainerRef}>
                    <div className="editor-container__editor">

                      {/* Show report input form */}
                      <div ref={editorRef}>{isLayoutReady &&
                        <CKEditor
                          editor={ClassicEditor}
                          config={editorConfig}
                          data={reportData.findings}
                          onChange={onChangeFindings}
                        />}
                      </div>
                    </div>
                  </div>
                )}

              </div>

              <div className="mb-2 p-2 flex flex-col">
                <div className="flex flex-row justify-between">
                  <div className='w-full text-blue-300' style={{ fontSize: '17px' }}>
                    {t('Conclusion')}
                  </div>
                </div>
                {ReportUtils.isFinalReport(reportData.status) && (
                  <div className="flex flex-col p-2">
                    <Typography
                      variant="subtitle"
                      className='text-primary-light pl-0 text-left'>
                      <div className="findings" dangerouslySetInnerHTML={{ __html: reportData.conclusion }} />
                    </Typography>
                  </div>
                )}
                {!ReportUtils.isFinalReport(reportData.status) && (
                  <div className="editor-container editor-container_classic-editor" ref={editorContainerRef}>
                    <div className="editor-container__editor">
                      <div ref={editorRef}>{isLayoutReady &&
                        <CKEditor
                          editor={ClassicEditor}
                          config={editorConfig}
                          data={reportData.conclusion}
                          onChange={onChangeConclusion}
                        />}</div>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>

          {ReportUtils.isFinalReport(reportData.status) && (<div style={{ display: 'none' }}>
            <PdfComponent
              ref={componentRef}
              orderData={orderData}
              reportData={reportData}
            />
          </div>
          )}
        </div>
      </div >
    </>
  );
};
ReportComponent.propTypes = {
};
export default ReportComponent;
