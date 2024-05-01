import { OHIF, DicomMetadataStore } from '@ohif/core';
import DownloadModal from './DownloadModal';
import React from 'react';
import { getDicomWebClientFromContext } from './utils';
//import * as cs from '@cornerstonejs/core';

const {
  utils: { Queue },
} = OHIF;

function commandsModule(context, servers, servicesManager, extensionManager) {
  const queue = new Queue(1);
  const { UIModalService, viewportGridService, displaySetService } = servicesManager.services;

  // const utilityModule = extensionManager.getModuleEntry(
  //   '@ohif/extension-cornerstone.utilityModule.common'
  // );

  // const { getEnabledElement } = utilityModule.exports;

  // function _getActiveViewportsEnabledElement() {
  //   const { activeViewportId } = viewportGridService.getState();
  //   const { element } = getEnabledElement(activeViewportId) || {};
  //   const enabledElement = cs.getEnabledElement(element);
  //   return enabledElement;
  // }

  const actions = {
    //downloadAndZipStudyOnActiveViewport({ servers, viewports, progress }) {
    downloadAndZipStudyOnActiveViewport({ servers, progress }) {
      //const studies = DicomMetadataStore.getStudyInstanceUIDs();
      //const studyInstanceUID = studies[0];
      const { activeViewportId, viewports } = viewportGridService.getState();

      const displaySetInstanceUIDs = viewports.get(activeViewportId).displaySetInstanceUIDs;
      // Make sure selected viewport has images
      let studyInstanceUid;
      let seriesInstanceUid;
      if (displaySetInstanceUIDs.length > 0) {
        const displaySet = displaySetService.getDisplaySetByUID(displaySetInstanceUIDs[0]);
        studyInstanceUid = displaySet.StudyInstanceUID;
        seriesInstanceUid = displaySet.SeriesInstanceUID;
      } else {
        return;
      }
      const dicomWebClient = getDicomWebClientFromContext(context, servers);
      //const { viewport } = _getActiveViewportsEnabledElement();

      // const { activeViewportIndex, viewportSpecificData } = viewports;
      // const activeViewportSpecificData =
      //   viewportSpecificData[activeViewportIndex];
      //const activeViewportSpecificData = viewports.get(activeViewportId);


      const WrappedDownloadModal = () => {
        return (
          <DownloadModal
            dicomWebClient={dicomWebClient}
            studyInstanceUID={studyInstanceUid}
            seriesInstanceUID={seriesInstanceUid}
            onClose={UIModalService.hide}
          />
        );

      };


      UIModalService.show({
        content: WrappedDownloadModal,
        title: `Download Study`,
        //fullscreen: false,
        //noScroll: true,
        shouldCloseOnEsc: false,
        closeButton: false,
        shouldCloseOnOverlayClick: false
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
