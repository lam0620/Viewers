import Utils from './utils'

export const isFinalReport = (status) => {
  if (status == 'F' || status == 'C') {
    return true;
  }
  return false;
}

export const isReportErrorEmpty = (obj) => {
  console.log(obj)
  let isCorrect = (Object.keys(obj).length === 0 && obj.constructor === Object) ||
    (obj.system === "" && obj.findings === "" && obj.conclusion === "" && obj.radiologist === "");

  console.log(isCorrect)
  return isCorrect;
}

export const isSaveEnabled = (status) => {
  if (["F", "C"].includes(status)) {
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

export const isApproveEnabled = (status, error) => {
  if (Utils.isEmpty(error) && ["", "D"].includes(status)) {
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
