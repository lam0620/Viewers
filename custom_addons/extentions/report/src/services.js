import axios from "axios";

import Constants from './constants'

export const fetchOrder = async (accession_no) => {
  return axios.get(`${Constants.INTEG_API_ENDPOINT}/orders/acn/${accession_no}`)
  // .then(response => {
  //   const response_data = response.data;

  //   // var order_data = state.order_data;

  //   if (response_data.result.status == 'NG') {
  //     // let errors = {''};
  //     setErrors({ ...errors, system: response_data.result.msg });
  //   } else if (Utils.isObjectEmpty(response_data.data)) {
  //     // Get data from image and set to
  //     setOrderData(emptyOrderData);
  //     setReportData(emptyReportData);
  //     setErrors({ ...errors, system: response_data.result.msg });

  //   } else {
  //     response_data.data.procedures.map((procedure, index) => {
  //       // Get report of current studyInstanceUid
  //       if (procedure.study_iuid === study_iuid) {
  //         let report = procedure.report;
  //         report.procedure = {
  //           "id": procedure.proc_id, // procedure
  //           "code": procedure.code, // procedure_type
  //           "name": procedure.name// procedure_type
  //         }
  //         setReportData(report);

  //         // Check report exist
  //         if (report.id) {
  //           // Add current value to selectedRadiologist
  //           setSelectedRadiologist({ value: report.radiologist.id, label: report.radiologist.fullname });
  //         }
  //       }
  //     });
  //     setOrderData(response_data.data);
  //   }

  // })
  // .catch(function (error) {
  //   // handle error
  //   console.log(error);
  //   setErrors({ ...errors, system: error });
  // })
  // .finally(function () {
  //   // always executed
  // });
}

export const fetchRadiologists = async () => {
  return axios.get(`${Constants.INTEG_API_ENDPOINT}/doctors/R`)
}

export const createReport = async (data: { [key: string]: any }) => {
  return axios.post(`${Constants.INTEG_API_ENDPOINT}/reports`, data);
}

export const updateReport = async (id: string, data: { [key: string]: any }) => {
  return axios.put(`${Constants.INTEG_API_ENDPOINT}/reports/${id}`, data);
}
