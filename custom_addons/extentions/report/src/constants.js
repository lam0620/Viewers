export default {
  DRAFT: 'D',
  FINAL: 'F',
  CORRECTED: 'C',

  PERMISSION_VIEW_REPORT : "view_report",
  PERMISSION_ADD_REPORT : "add_report",
  PERMISSION_EDIT_REPORT : "edit_report",
  PERMISSION_DELETE_REPORT : "delete_report",

  LOGIN_URL: process.env.USER_MNG_URL + '/login',
  API_ENDPOINT: process.env.USER_MNG_URL + '/api',
  USER_MNG_URL: process.env.USER_MNG_URL,
  DCM_API_ENDPOINT: process.env.DCM_API_ENDPOINT,
  IS_AUTH: process.env.IS_AUTH
}
