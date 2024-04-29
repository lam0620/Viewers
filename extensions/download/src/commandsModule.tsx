import { OHIF, DicomMetadataStore } from '@ohif/core';
import DownloadModal from './DownloadModal';
import React from 'react';
import { getDicomWebClientFromContext } from './utils';
import * as cs from '@cornerstonejs/core';

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
      const studies = DicomMetadataStore.getStudyInstanceUIDs();
      const { activeViewportId, viewports } = viewportGridService.getState();

      const displaySetInstanceUID = viewports.get(activeViewportId).displaySetInstanceUIDs[0];

      const displaySet = displaySetService.getDisplaySetByUID(displaySetInstanceUID);
      const seriesInstanceUid = displaySet.SeriesInstanceUID;

      const dicomWebClient = getDicomWebClientFromContext(context, servers);
      //const { viewport } = _getActiveViewportsEnabledElement();

      // const { activeViewportIndex, viewportSpecificData } = viewports;
      // const activeViewportSpecificData =
      //   viewportSpecificData[activeViewportIndex];
      //const activeViewportSpecificData = viewports.get(activeViewportId);
      const studyInstanceUID = studies[0];

      const WrappedDownloadModal = () => {
        return (
          <DownloadModal
            dicomWebClient={dicomWebClient}
            studyInstanceUID={studyInstanceUID}
            seriesInstanceUID={seriesInstanceUid}
            onClose={UIModalService.hide}
          />
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
