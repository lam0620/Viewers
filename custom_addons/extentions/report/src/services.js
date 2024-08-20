import axios from "axios";

const INTEG_API_ENDPOINT = process.env.INTEG_API_ENDPOINT

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
