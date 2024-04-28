import OHIF from '@ohif/core';
import React, { useState, useEffect } from 'react';
import _downloadAndZip from './downloadAndZip';
import PropTypes from 'prop-types';
import { saveAs } from 'file-saver';

const DownloadModal = ({ dicomWebClient, StudyInstanceUID, onClose }) => {
  const [status, setStatus] = useState({ notificationType: '', text: '' });
  const [size, setSize] = useState('');
  const [numberOfFiles, setNumberOfFiles] = useState('');

  useEffect(() => {
    setStatus({
      notificationType: '',
      text: '',
    });
    _downloadAndZip(
      dicomWebClient,
      StudyInstanceUID,
      (notificationType, text) => {
        setStatus({ notificationType: notificationType, text: text });
        if (notificationType === 'downloading') setSize(text);
        if (notificationType === 'zipping') setNumberOfFiles(text);
      }
    )
      .then(url => {
        OHIF.log.info('Files successfully compressed:', url);
        setStatus({
          notificationType: 'saving',
          text: `${StudyInstanceUID}.zip`,
        });
        saveAs(url, `${StudyInstanceUID}.zip`);
      })
      .then(() => {
        setStatus({
          notificationType: 'successfully saved',
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
  }, [StudyInstanceUID, dicomWebClient]);

  let info;
  switch (status.notificationType) {
    case 'downloading':
      info = 'Transferred: ' + status.text;
      break;
    case 'zipping':
      info = 'DICOM files: ' + status.text;
      break;
    case 'successfully saved':
      info = (
        <span>
          <p>{'Size: ' + size}</p>
          <p>{'DICOM images: ' + numberOfFiles}</p>
          <p>
            {/* <button type="button" className="btn btn-primary" onClick={onClose}>
              Ok
            </button> */}
            <br></br>
            <button onClick={onClose} className="box-content inline-flex flex-row items-center justify-center gap-[5px] justify center px-[10px] outline-none rounded leading-[1.2] font-sans text-center whitespace-nowrap font-semibold bg-primary-main text-white transition duration-300 ease-in-out focus:outline-none hover:bg-customblue-80 active:bg-customblue-40 h-[32px] text-[14px] min-w-[32px] ml-2" data-cy="undefined-btn">
              OK</button>
          </p>
        </span>
      );
      break;
    case 'Error':
      info = (
        <span>
          <p>{status.text}</p>
          <p>
            {/* <button type="button" className="btn btn-danger" onClick={onClose}>
              Ok
            </button> */}
            <br></br>
            <button onClick={onClose} className="box-content inline-flex flex-row items-center justify-center gap-[5px] justify center px-[10px] outline-none rounded leading-[1.2] font-sans text-center whitespace-nowrap font-semibold bg-primary-main text-white transition duration-300 ease-in-out focus:outline-none hover:bg-customblue-80 active:bg-customblue-40 h-[32px] text-[14px] min-w-[32px] ml-2" data-cy="undefined-btn">
              OK</button>
          </p>
        </span>
      );
      break;
    default:
      info = status.text;
  }
  return (
    <>
      <div className="mb-3 border-b-2 border-black"></div>
      <div className="download-study-modal-container">
        <p>Status: {status.notificationType}</p>
        <p>{info}</p>
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