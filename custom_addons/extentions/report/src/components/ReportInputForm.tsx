import { useTranslation } from 'react-i18next';

import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Button, ButtonEnums, Select, Typography, SwitchButton } from '@ohif/ui';

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
import './ReportInputForm.css';

const ReportInputForm = ({ onClose }) => {
  var currentDoctor = { label: 'ar', value: 'Arabic' };

  const { t } = useTranslation('Report');
  const [state, setState] = useState({
    readingDoctor: currentDoctor,
  });

  const editorContainerRef = useRef(null);
  const editorRef = useRef(null);
  const [isLayoutReady, setIsLayoutReady] = useState(false);
  const readingDoctorList = [
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
  const download = (type) => {

  }
  const onReadingDoctorChangeHandler = value => {
    setState(state => ({ ...state, readingDoctor: value }));
  };

  return (
    <>
      <div className='bg-secondary-dark z-20 border-black px-1 relative'>
        <div className='relative h-[48px] items-center'>
          <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform'>
            <button onClick={() => download('study')} className="box-content inline-flex flex-row items-center justify-center gap-[5px] justify center px-[10px] outline-none rounded leading-[1.2] font-sans text-center whitespace-nowrap font-semibold bg-primary-main text-white transition duration-300 ease-in-out focus:outline-none hover:bg-customblue-50 active:bg-customblue-20 h-[32px] text-[14px] min-w-[32px]" data-cy="undefined-btn">
              {t('Approve')}</button>
            <button onClick={() => download('series')} className="box-content inline-flex flex-row items-center justify-center gap-[5px] justify center px-[10px] outline-none rounded leading-[1.2] font-sans text-center whitespace-nowrap font-semibold bg-primary-main text-white transition duration-300 ease-in-out focus:outline-none hover:bg-customblue-80 active:bg-customblue-40 h-[32px] text-[14px] min-w-[32px] ml-2" data-cy="undefined-btn">
              {t('Save')}</button>
            <button onClick={() => download('series')} className="box-content inline-flex flex-row items-center justify-center gap-[5px] justify center px-[10px] outline-none rounded leading-[1.2] font-sans text-center whitespace-nowrap font-semibold bg-primary-main text-white transition duration-300 ease-in-out focus:outline-none hover:bg-customblue-80 active:bg-customblue-40 h-[32px] text-[14px] min-w-[32px] ml-2" data-cy="undefined-btn">
              {t('Close')}</button>

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
            <div className='p-2 mb-2 border-b-2 border-black text-blue-300'>{t('Patient Info')}</div>

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
                          Nguyen Van A
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
                          02/02/1988
                        </Typography>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
          <div className="w-full text-white mb-2">
            <div className='p-2 mb-2 border-b-2 border-black text-blue-300'>{t('Order Info')}</div>
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
                          123456789
                        </Typography>
                      </div>
                    </div>
                    <div className="mb-2 flex flex-row justify-between">
                      <div className="flex flex-col items-center">
                        <Typography
                          variant="subtitle"
                          className='font-semibold text-primary-light w-full pr-6 text-right'>
                          {t('Ordering physcian')}
                        </Typography>
                      </div>
                      <div className="flex flex-col">
                        <Typography
                          variant="subtitle"
                          className='text-primary-light pr-6 pl-0 text-left'>
                          Nguyen Van B
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
                          Đau bụng
                        </Typography>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
          <div className="w-full text-white mb-2">
            <div className='p-2 mb-2 border-b-2 border-black text-blue-300'>{t('Report Info')}</div>
            <div className="flex flex-row">
              <div className="flex w-full flex-row">
                <div className="flex flex-row w-full">
                  <div className="flex flex-col p-2 text-right w-full">
                    <div className="mb-2 flex flex-row justify-between">
                      <div className="flex flex-col items-center">
                        <Typography
                          variant="subtitle"
                          className='font-semibold text-primary-light w-full pr-6 text-right'>
                          {t('Reading Doctor')}
                        </Typography>
                      </div>
                      <div className="w-72 flex flex-col">
                        <Select
                          isClearable={false}
                          onChange={onReadingDoctorChangeHandler}
                          options={readingDoctorList}
                          value={state.readingDoctor}
                        />
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="main-container flex h-full flex-1 flex-col">
          <div className="w-1/2 text-white mt-2 mb-2 flex">
            <SwitchButton className='text-white' label="Hide Ordering physcian in report" />
            <div className='p-2 w-1/4'>No</div>
          </div>
          <div className="w-full text-white text-[14px]">{t('Findings')}</div>
          <div className="editor-container editor-container_classic-editor" ref={editorContainerRef}>
            <div className="editor-container__editor">
              <div ref={editorRef}>{isLayoutReady && <CKEditor editor={ClassicEditor} config={editorConfig} />}</div>
            </div>
          </div>

          <div className="w-full text-white text-[14px] mt-2">{t('Impression')}</div>
          <div className="editor-container editor-container_classic-editor" ref={editorContainerRef}>
            <div className="editor-container__editor">
              <div ref={editorRef}>{isLayoutReady && <CKEditor editor={ClassicEditor} config={editorConfig} />}</div>
            </div>
          </div>
        </div>
      </div >
    </>
  );
};

ReportInputForm.propTypes = {
  dicomWebClient: PropTypes.object.isRequired,
  StudyInstanceUID: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ReportInputForm;
