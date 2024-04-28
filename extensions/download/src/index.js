import { getDicomWebClientFromConfig, getActiveServerFromConfig } from './utils';
import commandsModule from './commandsModule';
import { version } from '../package.json';
import toolbarModule from './toolbarModule';
import { id } from './id.js';

/**
 * Constants
 */

/**
 * Globals
 */

const sharedContext = {
  dicomWebClient: null,
};

const sharedServer = {
  server: null,
};

/**
 * Extension
 */
//const extension: Types.Extensions.Extension = {
const downloadStudyExtension = {
  /**
   * Only required property. Should be a unique value across all extensions.
   */
  id,
  version,

  /**
   * LIFECYCLE HOOKS
   */

  preRegistration({ appConfig, configuration }) {
    const dicomWebClient = getDicomWebClientFromConfig(appConfig);
    if (dicomWebClient) {
      sharedContext.dicomWebClient = dicomWebClient;
    }

    const server = getActiveServerFromConfig(appConfig);
    if (server) {
      sharedServer.server = server;
    }
  },

  /**
   * MODULE GETTERS
   */

  getCommandsModule({ servicesManager, extensionManager }) {
    return commandsModule(sharedContext, sharedServer, servicesManager, extensionManager);
  },

  //getToolbarModule() {
  //  return toolbarModule;
  //},
};

export default downloadStudyExtension;
