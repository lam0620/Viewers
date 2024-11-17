export default {
  DRAFT: 'D',
  FINAL: 'F',
  CORRECTED: 'C',

  FONT_SIZE: '14',
  FONT_FAMILY: 'Arial',

  PERMISSION_VIEW_REPORT : "view_report",
  PERMISSION_ADD_REPORT : "add_report",
  PERMISSION_EDIT_REPORT : "edit_report",
  PERMISSION_DELETE_REPORT : "delete_report",

  USER_MNG_URL: process.env.USER_MNG_URL || 'http://localhost:3000',
  API_ENDPOINT: process.env.API_BASE_URL || 'http://localhost:8000/api',
  LOGIN_URL: process.env.USER_MNG_URL + '/login',

  DCM_API_ENDPOINT: process.env.DCM_API_ENDPOINT,
  IS_AUTH: process.env.IS_AUTH || 'true',

}
