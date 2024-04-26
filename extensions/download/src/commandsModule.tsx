import OHIF from '@ohif/core';
import DownloadModal from './DownloadModal';
import React from 'react';
import { getDicomWebClientFromContext } from './utils';

const {
  utils: { Queue },
} = OHIF;

export function getCommands(context, servicesManager, extensionManager) {
  const queue = new Queue(1);
  const { UIModalService } = servicesManager.services;
  const actions = {
    downloadAndZipStudyOnActiveViewport({ servers, viewports, progress }) {
      const dicomWebClient = getDicomWebClientFromContext(context, servers);

      const { activeViewportIndex, viewportSpecificData } = viewports;
      const activeViewportSpecificData =
        viewportSpecificData[activeViewportIndex];

      const { StudyInstanceUID } = activeViewportSpecificData;

      // const WrappedDownloadModal = () => {
      //   return (
      //     // <DownloadModal
      //     //   dicomWebClient={dicomWebClient}
      //     //   StudyInstanceUID={StudyInstanceUID}
      //     //   onClose={UIModalService.hide}
      //     // />
      //     <>          <div className="download-study-modal-container">
      //       <p>Status: test</p>
      //       <p>test</p>
      //     </div></>

      //   );

      // };


      UIModalService.show({
        content: <DownloadModal
          dicomWebClient={dicomWebClient}
          StudyInstanceUID={StudyInstanceUID}
          onClose={UIModalService.hide}
        />,
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
      storeContexts: ['servers', 'viewports'],
    },
  };

  return {
    actions,
    definitions,
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
