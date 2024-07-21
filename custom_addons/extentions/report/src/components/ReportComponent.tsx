import { useTranslation } from 'react-i18next';

import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Button, ButtonEnums, Select, Typography, SwitchButton, Icon } from '@ohif/ui';

import { CKEditor } from '@ckeditor/ckeditor5-react';
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

import Utils from '../Utils';

const ReportInputForm = ({ props }) => {
  var currentDoctor = { label: 'ar', value: 'Arabic' };

  const { t } = useTranslation('Report');
  const [state, setState] = useState({
    radiologist: currentDoctor,

    workingItem: {
      report: {
        findings: 'aa',
        impression: 'bb',
        isHideOrderingDoctor: false,
        status: 'D', // F, C
      },
      patient: {
        name: 'Nguyen Van A',
        pid: '123456789',
        dob: '02/02/1980'
      },
      order: {
        accessionNumber: '123456',
        indication: 'Dau bung',
        procedure: {
          name: 'Chụp não'
        },
        orderingDoctor: {
          name: 'Dr. Nguyen THi B',
          id: ''
        },
      },

      radiologist: {
        name: ''
      },
    },
    hideOrderingDoctorText: t('No'),
  });

  const editorContainerRef = useRef(null);
  const editorRef = useRef(null);
  const [isLayoutReady, setIsLayoutReady] = useState(false);
  const radiologistList = [
    { value: 'ar', label: 'Arabic' },
    { value: 'am', label: 'Amharic' },
    { value: 'bg', label: 'Bulgarian Bulgarian Bulgarian Bulgarian Bulgarian Bulgarian' },
    { value: 'bn', label: 'Bengali' }
  ];

  useEffect(() => {
    setIsLayoutReady(true);

    return () => setIsLayoutReady(false);
  }, []);

  const editorConfig = {
    toolbar: {
      items: [
        'undo',
        'redo',
        '|',
        'selectAll',
        '|',
        'heading',
        '|',
        'fontSize',
        'fontFamily',
        'fontColor',
        'fontBackgroundColor',
        '|',
        'bold',
        'italic',
        'underline',
        '|',
        'specialCharacters',
        '|',
        'alignment',
        '|',
        'indent',
        'outdent',
        '|',
        'accessibilityHelp'
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

  const onRadiologistChangeHandler = value => {
    setState(state => ({ ...state, radiologist: value }));
  };

  const onChangeHideOrderingDoctor = (value) => {
    let workingItem = state.workingItem;
    workingItem.report.isHideOrderingDoctor = value;
    setState(state => ({ ...state, workingItem: workingItem }));

    if (value) {
      setState(state => ({ ...state, hideOrderingDoctorText: t('Yes') }));
    } else {
      setState(state => ({ ...state, hideOrderingDoctorText: t('No') }));
    }
  }
  /**
   * Update the current typing of finding into the state of component
   */
  const onChangeFindings = (event, editor) => {
    var data = editor.getData();
    setState(state => ({ ...state, findings: data }));
    let workingItem = state.workingItem;
    workingItem.report.findings = data;
    setState(state => ({ ...state, workingItem: workingItem }));

    alert(state.workingItem.report.findings);
  };

  /**
   * Update the current typing of impression into the state of component
   */
  const onChangeImpression = (event, editor) => {
    var data = editor.getData();
    setState(state => ({ ...state, findings: data }));
    let workingItem = state.workingItem;
    workingItem.report.impression = data;
    setState(state => ({ ...state, workingItem: workingItem }));
  };
  const onApprove = (event) => {
    // Validate first, if error, set error to state and show
    let errors = validate();

    // If no error (error = empty)
    if (Utils.isObjectEmpty(errors)) {
      // Do Approve
    }
    alert(state.workingItem.report.findings);
    // Generate a HL7 msg
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

    let report = state.workingItem.report;
    var findings = Utils.html2text(report.findings);
    var impression = Utils.html2text(report.impression);

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

  return (
    <>
      <div className='bg-secondary-dark z-20 border-black px-1 relative'>
        <div className='relative h-[48px] items-center'>
          <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform flex gap-2'>
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
      <div className='relative flex h-screen w-full flex-row flex-nowrap items-stretch overflow-hidden bg-black'
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
            <div className='p-2 mb-2 border-b-2 border-black text-blue-300'>{t('Patient Information')}</div>

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
                          {state.workingItem.patient.name}
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
                          {state.workingItem.patient.pid}
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
                          {state.workingItem.patient.dob}
                        </Typography>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
          <div className="w-full text-white mb-2">
            <div className='p-2 mb-2 border-b-2 border-black text-blue-300'>{t('Order Information')}</div>
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
                          {state.workingItem.order.accessionNumber}
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
                          {state.workingItem.order.procedure.name}
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
                          {state.workingItem.order.indication}
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
                          {state.workingItem.order.orderingDoctor.name}
                        </Typography>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
          <div className="w-full text-white mb-2">
            <div className='p-2 mb-2 border-b-2 border-black text-blue-300'>{t('Report Information')}</div>
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
                      <div className="w-72 flex flex-col">
                        <Select
                          isClearable={false}
                          onChange={onRadiologistChangeHandler}
                          options={radiologistList}
                          value={state.radiologist}
                        />
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
          <div className="w-1/2 text-white mt-2 mb-2 flex">
            <SwitchButton className='text-white'
              label={t('Hide Ordering Physician in report')}
              onChange={onChangeHideOrderingDoctor} />
            <div className='p-2 w-1/4'>{state.hideOrderingDoctorText}</div>
          </div>
          <div className="w-full text-white text-[14px]">{t('Findings')}</div>
          <div className="editor-container editor-container_classic-editor" ref={editorContainerRef}>
            <div className="editor-container__editor">
              <div ref={editorRef}>{isLayoutReady &&
                <CKEditor
                  editor={ClassicEditor}
                  config={editorConfig}
                  data={state.workingItem.report.findings}
                  onChange={onChangeFindings}
                />}</div>
            </div>
          </div>

          <div className="w-full text-white text-[14px] mt-2">{t('Impression')}</div>
          <div className="editor-container editor-container_classic-editor" ref={editorContainerRef}>
            <div className="editor-container__editor">
              <div ref={editorRef}>{isLayoutReady &&
                <CKEditor
                  editor={ClassicEditor}
                  config={editorConfig}
                  data={state.workingItem.report.impression}
                  onChange={onChangeImpression}
                />}</div>
            </div>
          </div>
        </div>
      </div >
    </>
  );
};

ReportInputForm.propTypes = {

};

export default ReportInputForm;
