import axios from "axios";

const INTEG_API_ENDPOINT = process.env.INTEG_API_ENDPOINT;
const DCM_API_ENDPOINT = process.env.DCM_API_ENDPOINT;

export const fetchOrder = async (accession_no) => {
  return axios.get(`${INTEG_API_ENDPOINT}/orders/acn/${accession_no}`)
}

export const fetchRadiologists = async () => {
  return axios.get(`${INTEG_API_ENDPOINT}/doctors/R`)
}

export const createReport = async (data: { [key: string]: any }) => {
  return axios.post(`${INTEG_API_ENDPOINT}/reports`, data);
}

export const updateReport = async (id: string, data: { [key: string]: any }) => {
  return axios.put(`${INTEG_API_ENDPOINT}/reports/${id}`, data);
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

// dcm4chee api
export const fetchDicomMetadata = async (study_iuid) => {
  return axios.get(`${DCM_API_ENDPOINT}/rs/studies/${study_iuid}/metadata`)
}
