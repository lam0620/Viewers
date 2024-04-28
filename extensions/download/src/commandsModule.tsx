import { OHIF, DicomMetadataStore } from '@ohif/core';
import DownloadModal from './DownloadModal';
import React from 'react';
import { getDicomWebClientFromContext } from './utils';

const {
  utils: { Queue },
} = OHIF;

function commandsModule(context, servers, servicesManager, extensionManager) {
  const queue = new Queue(1);
  const { UIModalService, viewportGridService } = servicesManager.services;

  const actions = {
    //downloadAndZipStudyOnActiveViewport({ servers, viewports, progress }) {
    downloadAndZipStudyOnActiveViewport({ servers, progress }) {
      const studies = DicomMetadataStore.getStudyInstanceUIDs();
      const { activeViewportId, viewports } = viewportGridService.getState();

      const dicomWebClient = getDicomWebClientFromContext(context, servers);

      // const { activeViewportIndex, viewportSpecificData } = viewports;
      // const activeViewportSpecificData =
      //   viewportSpecificData[activeViewportIndex];
      //const activeViewportSpecificData = viewports.get(activeViewportId);
      const StudyInstanceUID = studies[0];

      const WrappedDownloadModal = () => {
        return (
          <DownloadModal
            dicomWebClient={dicomWebClient}
            StudyInstanceUID={StudyInstanceUID}
            onClose={UIModalService.hide}
          />
          // <>          <div className="download-study-modal-container">
          //   <p>Status: test</p>
          //   <p>test</p>
          // </div></>

        );

      };


      UIModalService.show({
        content: WrappedDownloadModal,
        title: `Download Study`,
        fullscreen: false,
        noScroll: true,
        shouldCloseOnEsc: false,
        closeButton: false,
      });
    },
  };

  const definitions = {
    downloadAndZipStudyOnActiveViewport: {
      commandFn: queue.bindSafe(
        actions.downloadAndZipStudyOnActiveViewport,
        e => error(e)
      ),
      //storeContexts: ['servers', 'viewports'],
      context: 'VIEWER', // optional
    },
  };

  return {
    actions,
    definitions,
    defaultContext: 'VIEWER',
  };
}

/**
 * Utils
 */

function error(e) {
  if (e.message === 'Queue limit reached') {
    OHIF.log.warn('A download is already in progress, please wait.');
  } else {
    OHIF.log.error(e);
  }
}

export default commandsModule;
