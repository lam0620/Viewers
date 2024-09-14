import axios from "axios";

import Constants from './constants'

const DCM_API_ENDPOINT = Constants.DCM_API_ENDPOINT;
const INTEG_API_ENDPOINT = Constants.API_ENDPOINT;

let IS_AUTH = "true";
try { IS_AUTH = Constants.IS_AUTH; } catch(e) {}

// For Dev
if (IS_AUTH !== "true") {
  // 'X': No auth need
  axios.defaults.headers.common["x-api-version"] = `X`;
}

export const fetchOrder = async (accession_no) => {
  //return axios.get(`${INTEG_API_ENDPOINT}/orders/acn/${accession_no}`)
  return axios.get(`${INTEG_API_ENDPOINT}/orders?accession=${accession_no}`)
}

export const fetchRadiologists = async () => {
  return axios.get(`${INTEG_API_ENDPOINT}/doctors?type=R`)
}
export const fetchDoctorByUserId = async (userId) => {
return axios.get(`${INTEG_API_ENDPOINT}/doctors?user_id=${userId}`)
}

export const fetchReportByStudy = async (studyUid) => {
  return axios.get(`${INTEG_API_ENDPOINT}/reports?study_iuid=${studyUid}`)
}

export const createReport = async (data: { [key: string]: any }) => {
  return axios.post(`${INTEG_API_ENDPOINT}/reports`, data);
}

export const updateReport = async (id: string, data: { [key: string]: any }) => {
  return axios.put(`${INTEG_API_ENDPOINT}/reports/${id}`, data);
}
export const discardReport = async (id: string) => {
  return axios.delete(`${INTEG_API_ENDPOINT}/reports/${id}`);
}

export const fetchReportTemplates = async (modality) => {
  return axios.get(`${INTEG_API_ENDPOINT}/report-templates?modality=${modality}`)
}
export const createReportTemplate = async (data: { [key: string]: any }) => {
  return axios.post(`${INTEG_API_ENDPOINT}/report-templates`, data);
}
export const updateReportTemplate = async (id: string, data: { [key: string]: any }) => {
  return axios.put(`${INTEG_API_ENDPOINT}/report-templates/${id}`, data);
}


// UserContext use
export const getUserProfile = async () => {
  return axios.get(`${INTEG_API_ENDPOINT}/me`);
}

export const refreshAccessToken = async (data: {[key: string]: any}) => {
  return axios.post(`${INTEG_API_ENDPOINT}/auth/refresh-token`, data);
}


// dcm4chee api
export const fetchDicomMetadata = async (study_iuid) => {
  return axios.get(`${DCM_API_ENDPOINT}/rs/studies/${study_iuid}/metadata`)
}
