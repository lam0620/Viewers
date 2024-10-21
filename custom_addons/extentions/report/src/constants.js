export default {
  DRAFT: 'D',
  FINAL: 'F',
  CORRECTED: 'C',

  PERMISSION_VIEW_REPORT : "view_report",
  PERMISSION_ADD_REPORT : "add_report",
  PERMISSION_EDIT_REPORT : "edit_report",
  PERMISSION_DELETE_REPORT : "delete_report",

  USER_MNG_URL: process.env.USER_MNG_URL,
  API_ENDPOINT: process.env.API_BASE_URL,
  LOGIN_URL: process.env.USER_MNG_URL + '/login',

  DCM_API_ENDPOINT: process.env.DCM_API_ENDPOINT,
  IS_AUTH: process.env.IS_AUTH,

}
