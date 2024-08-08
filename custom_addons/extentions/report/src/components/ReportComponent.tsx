import { useTranslation } from 'react-i18next';
import ReactToPrint from 'react-to-print';
import React, { useState, useEffect, useRef } from 'react';
import './ReportComponent.css';
import { Button, ButtonEnums, Select, Typography, Icon } from '@ohif/ui';
import { CKEditor } from '@ckeditor/ckeditor5-react';
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
import axios from 'axios';
import Utils from '../utils';
import Constants from '../constants'

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
      Undo
    ],
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
  const onApprove = (event) => {
    // Validate first, if error, set error to state and show
    let errors = validate();

    // If no error (error = empty)
    if (Utils.isObjectEmpty(errors)) {
      // Do Approve
    }
  };
  const onSave = (event) => {
    // Validate first, if error, set error to state and show
    let errors = validate();

    // If no error (error = empty)
    if (Utils.isObjectEmpty(errors)) {
      // Do Approve
    }
    //alert(state.workingItem.report);
    // Generate a HL7 msg
  };
  const onClose = (event) => {
    // Close the current tab
    window.close();
  };


  const validate = () => {
    let errors = {};
    let errorFindings = '';
    let errorImpression = '';
    var findingLabel = t('creation.label.finding');
    var impressionLabel = t('creation.label.impression');

    // Don't check required for Findings
    // if (len < 1) {
    //     var requiredMsg = this.t('creation.msg.required');
    //     error = requiredMsg.replace('{0}', findingLabel);
    // }
    if (!Utils.isEmpty(findings) && findings.length > 1024) {
      var maxLengthMsg = t('creation.msg.maxLength');
      maxLengthMsg = maxLengthMsg.replace('{0}', findingLabel);
      errorFindings = maxLengthMsg.replace('{1}', 1024);
    }

    // Check impression
    if (Utils.isEmpty(impression) || impression.length < 1) {
      var requiredMsg = t('creation.msg.required');
      errorImpression = requiredMsg.replace('{0}', impressionLabel);
    } else if (impression.length > 1024) {
      var maxLengthMsg = t('creation.msg.maxLength');
      var maxLengthMsg = maxLengthMsg.replace('{0}', impressionLabel);
      errorImpression = maxLengthMsg.replace('{1}', 1024);
    }

    return errors;
  };
  const componentRef = useRef<HTMLDivElement>(null);

  const [pid, setPid] = useState('');
  const [fullname, setFullname] = useState('');
  const [dob, setDOB] = useState('');
  const [ASSN, setASSN] = useState('');
  const [service, setService] = useState('');
  const [symptom, setSymptom] = useState('');
  const [doctor, setDoctor] = useState('');
  const [radiologist, setRadiologist] = useState('');
  const [radiologistList, setRadiologistList] = useState('');
  const [sex, setSex] = useState('');
  const [address, setAddress] = useState('');
  const [finding, setFinding] = useState('');
  const [conclusion, setConclusion] = useState('');
  const [finding1, setFinding1] = useState('');
  const [conclusion1, setConclusion1] = useState('');

  const [state, setState] = useState({
    workingItem: null,
  });

  useEffect(() => {
    // 578358 (not report yet), 530546 (has report)
    axios.get(Constants.INTEG_API_ENDPOINT + '/orders/acn/578358')
      .then(response => {
        const data = response.data.data;

        var workingItem = state.workingItem;

        setPid(data.patient.pid);
        setFullname(data.patient.fullname);
        setDOB(data.patient.dob);
        setASSN(data.accession_no);
        setSex(data.patient.gender)
        setAddress(data.patient.address);
        //Cause procedures is a array so get the first element
        const procedure = data.procedures[0];
        setService(procedure.name);
        setSymptom(data.clinical_diagnosis);
        setDoctor(data.req_phys_name); //bs chi dinh
        // Has report
        if (!Utils.isObjectEmpty(procedure.report)) {
          setFinding(procedure.report.findings);
          setConclusion(procedure.report.conclusion);
          //create finding1, conclusion1 to compare with null. Beacause if use finding,conclusion , onchange function run.
          setFinding1(procedure.report.findings);
          setConclusion1(procedure.report.conclusion);
          setRadiologist(procedure.report.radiologist.fullname);
        }
      })

    axios.get(Constants.INTEG_API_ENDPOINT + '/doctors/R')
      .then(response => {
        const data = response.data.data;
        setRadiologistList(data)
      })
    // fetch(Constants.INTEG_API_ENDPOINT + '/doctors/R')
    //   .then(response => response.json())
    //   .then(data => setRadiologist(data.data))
    //   .catch(error => console.error('Error fetching data:', error));

    setIsLayoutReady(true);
    return () => setIsLayoutReady(false);
  }, []);
  const onChangeFindings1 = (event, editor) => {//Update data when input finding
    const data = editor.getData();
    setFinding(data);
  };
  const onChangeImpression1 = (event, editor) => {
    const data = editor.getData();
    setConclusion(data);
  };

  const [selectedDoctor, setSelectedDoctor] = useState('');

  const handleSelectChange = (event) => {//Update radiologist in PDF
    setSelectedDoctor(event.target.value);
  };

  const formatDOB = (dob) => {//format DD/MM/YYYY
    if (dob.length === 8) {
      const year = dob.substring(0, 4);
      const month = dob.substring(4, 6);
      const day = dob.substring(6, 8);
      return `${day}/${month}/${year}`;
    } else if (dob.length === 6) {
      const year = dob.substring(0, 4);
      const month = dob.substring(4, 6);
      return `${month}/${year}`;
    } else if (dob.length === 4) {
      const year = dob.substring(0, 4);
      return `${year}`;
    } else {
      return '';
    }
  };
  const formattedDOB = formatDOB(dob);

  return (
    <>
      <div className='bg-secondary-dark z-20 border-black px-1 relative'>
        <div className='relative h-[48px] items-center'>

          <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform flex gap-2'>
            <ReactToPrint
              trigger={() => (
                <Button
                  type={ButtonEnums.type.primary}
                  size={ButtonEnums.size.medium}>
                  {t('Print')}
                </Button>
              )}
              content={() => componentRef.current}
            />
            <Button
              type={ButtonEnums.type.primary}
              size={ButtonEnums.size.medium}
              startIcon={
                <Icon
                  className="!h-[20px] !w-[20px] text-black"
                  name={'icon-approve'}
                />
              }
              onClick={onApprove}
              className={'text-[13px]'}
            >
              {t('Approve')}
            </Button>
            <Button
              type={ButtonEnums.type.primary}
              size={ButtonEnums.size.medium}
              startIcon={
                <Icon
                  className="!h-[20px] !w-[20px] text-black"
                  name={'icon-save'}
                />
              }
              onClick={onSave}
              className={'text-[13px]'}
            >
              {t('Save')}
            </Button>
            <Button
              type={ButtonEnums.type.primary}
              size={ButtonEnums.size.medium}
              startIcon={
                <Icon
                  className="!h-[20px] !w-[20px] text-black"
                  name={'icon-close'}
                />
              }
              onClick={onClose}
              className={'text-[13px]'}
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
        <div className='transition-all duration-300 ease-in-out bg-black border-black justify-start box-content flex flex-col mr-1'
          style={{
            marginLeft: '0px',
            maxWidth: '448px',
            width: '448px',
            position: 'relative',
            top: '0.2%',
            height: '99.8%'
          }}
        >
          <div className="w-full text-white mb-2">
            <div className='p-2 mb-2 border-b-2 border-black text-blue-300' style={{ fontSize: '17px' }}>{t('Patient Information')}</div>
            <div className="flex flex-row">
              <div className="flex w-full flex-row">
                <div className="flex flex-row w-full">
                  <div className="flex flex-col p-2 text-right w-full">
                    <div className="mb-2 flex flex-row justify-between">
                      <div className="flex flex-col items-center">
                        <Typography
                          variant="subtitle"
                          className='font-semibold text-primary-light w-full pr-6 text-right'>
                          {t('Patient Name')}
                        </Typography>
                      </div>
                      <div className="flex flex-col">
                        <Typography
                          variant="subtitle"
                          className='text-primary-light pr-6 pl-0 text-left'>
                          {fullname}
                        </Typography>
                      </div>
                    </div>
                    <div className="mb-2 flex flex-row justify-between">
                      <div className="flex flex-col items-center">
                        <Typography
                          variant="subtitle"
                          className='font-semibold text-primary-light w-full pr-6 text-right'>
                          {t('PID')}
                        </Typography>
                      </div>
                      <div className="flex flex-col">
                        <Typography
                          variant="subtitle"
                          className='text-primary-light pr-6 pl-0 text-left'>
                          {pid}
                        </Typography>
                      </div>
                    </div>
                    <div className="mb-2 flex flex-row justify-between">
                      <div className="flex flex-col items-center">
                        <Typography
                          variant="subtitle"
                          className='font-semibold text-primary-light w-full pr-6 text-right'>
                          {t('DOB')}
                        </Typography>
                      </div>
                      <div className="flex flex-col">
                        <Typography
                          variant="subtitle"
                          className='text-primary-light pr-6 pl-0 text-left'>
                          {formattedDOB}
                        </Typography>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full text-white mb-2">
            <div className='p-2 mb-2 border-b-2 border-black text-blue-300' style={{ fontSize: '17px' }}>{t('Order Information')}</div>
            <div className="flex flex-row">
              <div className="flex w-full flex-row">
                <div className="flex flex-row w-full">
                  <div className="flex flex-col p-2 text-right w-full">
                    <div className="mb-2 flex flex-row justify-between">
                      <div className="flex flex-col items-center">
                        <Typography
                          variant="subtitle"
                          className='font-semibold text-primary-light w-full pr-6 text-right'>
                          {t('ACN')}
                        </Typography>
                      </div>
                      <div className="flex flex-col">
                        <Typography
                          variant="subtitle"
                          className='text-primary-light pr-6 pl-0 text-left'>
                          {ASSN}
                        </Typography>
                      </div>
                    </div>
                    <div className="mb-2 flex flex-row justify-between">
                      <div className="flex flex-col items-center">
                        <Typography
                          variant="subtitle"
                          className='font-semibold text-primary-light w-full pr-6 text-right'>
                          {t('Procedure')}
                        </Typography>
                      </div>
                      <div className="flex flex-col">
                        <Typography
                          variant="subtitle"
                          className='text-primary-light pr-6 pl-0 text-left'>
                          {service}
                        </Typography>
                      </div>
                    </div>
                    <div className="mb-2 flex flex-row justify-between">
                      <div className="flex flex-col items-center">
                        <Typography
                          variant="subtitle"
                          className='font-semibold text-primary-light w-full pr-6 text-right'>
                          {t('Indication')}
                        </Typography>
                      </div>
                      <div className="flex flex-col">
                        <Typography
                          variant="subtitle"
                          className='text-primary-light pr-6 pl-0 text-left'>
                          {symptom}
                        </Typography>
                      </div>
                    </div>

                    <div className="mb-2 flex flex-row justify-between">
                      <div className="flex flex-col items-center">
                        <Typography
                          variant="subtitle"
                          className='font-semibold text-primary-light w-full pr-6 text-right'>
                          {t('Ordering Physician')}
                        </Typography>
                      </div>
                      <div className="flex flex-col">
                        <Typography
                          variant="subtitle"
                          className='text-primary-light pr-6 pl-0 text-left'>
                          {doctor}
                        </Typography>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
          <div className="w-full text-white mb-2">
            <div className='p-2 mb-2 border-b-2 border-black text-blue-300' style={{ fontSize: '17px' }}>{t('Report Information')}</div>
            <div className="flex flex-row">
              <div className="flex w-full flex-row">
                <div className="flex flex-row w-full">
                  <div className="flex flex-col p-2 text-right w-full">
                    <div className="mb-2 flex flex-row justify-between">
                      <div className="flex flex-col items-center">
                        <Typography
                          variant="subtitle"
                          className='font-semibold text-primary-light w-full pr-6 text-right'>
                          {t('Radiologist')}
                        </Typography>
                      </div>
                      <div className="flex flex-col">
                        {radiologist && (<Typography
                          variant="subtitle"
                          className='text-primary-light pr-6 pl-0 text-left'>
                          {radiologist}
                        </Typography>
                        )}
                        {!finding && (<Typography>
                          <select
                            style={{
                              backgroundColor: '#000', color: 'rgb(90, 204, 230)', fontSize: '15px', padding: '10px', borderRadius: '5px', border: '2px solid rgb(90, 204, 230)'
                            }}
                            value={selectedDoctor}
                            onChange={handleSelectChange}
                          >
                            {Array.isArray(radiologistList) && radiologistList.map(doctor => (
                              <option key={doctor.doctor_no} value={doctor.id}>
                                {doctor.fullname}
                              </option>
                            ))}
                          </select>
                        </Typography>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Right panel - Findigs/Impression*/}
        <div className="main-container flex h-full flex-1 flex-col">
          <div className="flex flex-row w-full">
            <div className="flex flex-col text-left w-full">

              {/* Show report text in label */}
              {finding1 && (
                <div className="mb-2 flex flex-col">
                  <div className="flex flex-row justify-between">
                    <div className='w-full p-2 mb-2 border-b-2 border-black text-blue-300' style={{ fontSize: '17px' }}>
                      {t('Findings')}
                    </div>

                  </div>
                  <div className="flex flex-col mt-2">
                    <Typography
                      variant="subtitle"
                      className='text-primary-light pr-6 pl-0 text-left'>
                      <div className="findings" dangerouslySetInnerHTML={{ __html: finding }} />
                    </Typography>
                  </div>
                </div>
              )}
              {conclusion1 && (
                <div className="mb-2 flex flex-col">
                  <div className="flex flex-row justify-between">
                    <div className='w-full p-2 mb-2 border-b-2 border-black text-blue-300' style={{ fontSize: '17px' }}>
                      {t('Impression')}
                    </div>
                  </div>
                  <div className="flex flex-col mt-2">
                    <Typography
                      variant="subtitle"
                      className='text-primary-light pr-6 pl-0 text-left'>
                      <div className="findings" dangerouslySetInnerHTML={{ __html: conclusion }} />
                    </Typography>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="w-full text-white text-[14px]" style={{ fontSize: '17px' }}>{finding1 === '' && t('Findings')}</div>
          <div className="editor-container editor-container_classic-editor" ref={editorContainerRef}>
            <div className="editor-container__editor">

              {/* Show report input form */}
              <div ref={editorRef}>{isLayoutReady && finding1 === '' &&
                <CKEditor
                  editor={ClassicEditor}
                  config={editorConfig}
                  data={finding}
                  onChange={onChangeFindings1}
                />}
              </div>
            </div>
          </div>
          <div className="w-full text-white text-[14px] mt-2" style={{ fontSize: '17px' }}>{conclusion1 === '' && t('Impression')}</div>
          <div className="editor-container editor-container_classic-editor" ref={editorContainerRef}>
            <div className="editor-container__editor">
              <div ref={editorRef}>{isLayoutReady && conclusion1 === '' &&
                <CKEditor
                  editor={ClassicEditor}
                  config={editorConfig}
                  data={conclusion}
                  onChange={onChangeImpression1}
                />}</div>
            </div>
          </div>
          <div style={{ display: 'none' }}>
            <PdfComponent
              ref={componentRef}
              statePID={53247234}
              stateName={fullname}
              stateDOB={formattedDOB}
              stateSex={sex}
              stateIndication={symptom}
              stateDoctorName={doctor}
              findings={finding}
              impression={conclusion}
              service={service}
              address={address}
              radiologist={selectedDoctor}
            />
          </div>
        </div>
      </div >
    </>
  );
};
ReportComponent.propTypes = {
};
export default ReportComponent;
