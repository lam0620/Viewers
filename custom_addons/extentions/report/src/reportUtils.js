import Utils from './utils'

export const isFinalReport = (status) => {
  if (status == 'F' || status == 'C') {
    return true;
  }
  return false;
}

export const isReportErrorEmpty = (obj) => {
  // console.log(obj)
  let isCorrect = (Object.keys(obj).length === 0 && obj.constructor === Object) ||
    (obj.fatal === "" && obj.system === "" && obj.findings === "" && obj.conclusion === "" && obj.radiologist === "");

  // console.log(isCorrect)
  return isCorrect;
}

export const initEmptyReportError = () => {
  let error = {};
  error.conclusion = "";
  error.findings = "";
  error.radiologist = "";
  error.fatal = "";
  error.system = "";

  return error;
}

export const isSaveEnabled = (status, fatalErr) => {
  if (!Utils.isEmpty(fatalErr) || ["F", "C"].includes(status)) {
    return false;
  }
  return true;
}

export const isPrintEnabled = (status) => {
  if (["F", "C"].includes(status)) {
    return true;
  }
  return false;
}

export const isApproveEnabled = (status, fatalErr) => {
  if (Utils.isEmpty(fatalErr) && ["", "D"].includes(status)) {
    return true;
  }
  return false;
}

export const isEditEnabled = (status) => {
  if (["F", "C"].includes(status)) {
    return true;
  }
  return false;
}

export const isEditorDisabled = (fatalErr) => {
  if (!Utils.isEmpty(fatalErr)) {
    return true;
  }
  return false;
}

export const getStatusFull = (status) => {
  let statusText = "Not yet";
  if (status === 'D') {
    statusText = 'Draft';
  } else if (status === 'F') {
    statusText = 'Final';
  } else if (status === 'C') {
    statusText = 'Final';
  }
  return statusText;
}

export const getStatusStyle = (status) => {
  let statusText = "text-gray-500";
  if (status === 'D') {
    statusText = 'text-blue-400';
  } else if (status === 'F') {
    statusText = 'text-green-500';
  } else if (status === 'C') {
    statusText = 'text-green-500';
  }
  return statusText;
}
