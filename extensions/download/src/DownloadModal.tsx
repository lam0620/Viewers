import OHIF from '@ohif/core';
import React, { useState, useEffect } from 'react';
import downloadAndZip from './downloadAndZip';
import PropTypes from 'prop-types';
import { saveAs } from 'file-saver';

const DownloadModal = ({ dicomWebClient, studyInstanceUID, seriesInstanceUID, onClose }) => {
  const [status, setStatus] = useState({ notificationType: '', text: '' });
  const [size, setSize] = useState('');
  const [numberOfFiles, setNumberOfFiles] = useState('');

  const [checked, setChecked] = useState(false);
  const handleChange = () => {
    setChecked(!checked);
  };

  useEffect(() => {
    setStatus({
      notificationType: '',
      text: '',
    });
  }, []);

  const download = (type) => {
    if (type == 'study') {
      seriesInstanceUID = ''; // No download curret series
    }

    // Call downloadAndZip from downloadAndZip.tsx
    downloadAndZip(
      dicomWebClient,
      studyInstanceUID,
      seriesInstanceUID,
      (notificationType, text) => {
        setStatus({ notificationType: notificationType, text: text });
        if (notificationType === 'Downloading') setSize(text);
        if (notificationType === 'Zipping') setNumberOfFiles(text);
      }
    )
      .then(url => {
        OHIF.log.info('Files successfully compressed:', url);
        setStatus({
          notificationType: 'saving',
          text: `${studyInstanceUID}.zip`,
        });
        saveAs(url, `${studyInstanceUID}.zip`);
      })
      .then(() => {
        setStatus({
          notificationType: 'Saved successfully',
          text: '',
        });
      })
      .catch(error => {
        OHIF.log.error('Error downloading study...', error.message);
        setStatus({
          notificationType: 'Error',
          text: error.message,
        });
      });
  }
  //}, [studyInstanceUID, dicomWebClient]);

  let info;
  switch (status.notificationType) {
    case 'Downloading':
      info = 'Transferred: ' + status.text;
      break;
    case 'Zipping':
      info = 'DICOM files: ' + status.text;
      break;
    case 'Saved successfully':
      info = (
        <span>
          <p>{'Size: ' + size}</p>
          <p>{'DICOM images: ' + numberOfFiles}</p>
        </span>
      );
      break;
    case 'Error':
      info = (
        <span>
          <p>{status.text}</p>
        </span>
      );
      break;
    default:
      info = status.text;
  }
  return (
    <>
      <div className="mb-3 border-b-2 border-black"></div>
      <div className="download-study-modal-container mb-6">
        <p>Please choose download type:</p>
        <div className='ml-6'>
          <p>Download Study: download all images of this study. It may spend much time depends on the study's size!</p>
          <p>Download Current Series: download all images of selected series.</p>
        </div>
      </div>

      <div className="download-study-modal-container">
        <p>{status.notificationType}</p>
        <p>{info}</p>
      </div>

      <div className='flex flex-row justify-between mt-6'>
        <button onClick={onClose} className="box-content inline-flex flex-row items-center justify-center gap-[5px] justify center px-[10px] outline-none rounded leading-[1.2] font-sans text-center whitespace-nowrap font-400 bg-customblue-30 text-white transition duration-300 ease-in-out focus:outline-none hover:bg-customblue-50 active:bg-customblue-20 h-[32px] text-[14px] min-w-[32px]" data-cy="undefined-btn">
          Close</button>

        <div className='flex flex-row'>
          <button onClick={() => download('study')} className="box-content inline-flex flex-row items-center justify-center gap-[5px] justify center px-[10px] outline-none rounded leading-[1.2] font-sans text-center whitespace-nowrap font-semibold bg-primary-main text-white transition duration-300 ease-in-out focus:outline-none hover:bg-customblue-50 active:bg-customblue-20 h-[32px] text-[14px] min-w-[32px]" data-cy="undefined-btn">
            Download Study</button>
          <button onClick={() => download('series')} className="box-content inline-flex flex-row items-center justify-center gap-[5px] justify center px-[10px] outline-none rounded leading-[1.2] font-sans text-center whitespace-nowrap font-semibold bg-primary-main text-white transition duration-300 ease-in-out focus:outline-none hover:bg-customblue-80 active:bg-customblue-40 h-[32px] text-[14px] min-w-[32px] ml-2" data-cy="undefined-btn">
            Download Current Series</button>

        </div>
      </div>
    </>
  );
};

DownloadModal.propTypes = {
  dicomWebClient: PropTypes.object.isRequired,
  StudyInstanceUID: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default DownloadModal;
