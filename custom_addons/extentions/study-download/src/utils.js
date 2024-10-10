import OHIF from '@ohif/core';
import { api } from 'dicomweb-client';

const {
  utils: { isDicomUid, resolveObjectPath },
  DICOMWeb,
} = OHIF;

function validDicomUid(subject) {
  if (isDicomUid(subject)) {
    return subject;
  }
}

function getActiveServerFromServersStore(store) {
  const servers = resolveObjectPath(store, 'dataSources');
  if (Array.isArray(servers) && servers.length > 0) {
    return servers.find(server => resolveObjectPath(server, 'active') === true);
  }
}

function getDicomWebClientFromConfig(config) {
  //const servers = resolveObjectPath(config, 'servers.dicomWeb');
  const servers = resolveObjectPath(config, 'dataSources');
  if (Array.isArray(servers) && servers.length > 0) {
    const server = servers[0].configuration;
    return new api.DICOMwebClient({
      url: server.wadoRoot,
      headers: DICOMWeb.getAuthorizationHeader(server),
    });
  }
}

function getActiveServerFromConfig(config) {
  //const servers = resolveObjectPath(config, 'servers.dicomWeb');
  const servers = resolveObjectPath(config, 'dataSources');
  if (Array.isArray(servers) && servers.length > 0) {
    const server = servers[0].configuration;
    return server;
  }
}

function getDicomWebClientFromContext(context, store) {
  const activeServer = getActiveServerFromServersStore(store);
  if (activeServer) {
    return new api.DICOMwebClient({
      url: activeServer.wadoRoot,
      headers: DICOMWeb.getAuthorizationHeader(activeServer),
    });
  } else if (context.dicomWebClient instanceof api.DICOMwebClient) {
    return context.dicomWebClient;
  }
}

export {
  validDicomUid,
  getDicomWebClientFromConfig,
  getDicomWebClientFromContext,
  getActiveServerFromConfig,
};
