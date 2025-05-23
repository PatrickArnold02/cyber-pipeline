import CASAuthentication from '../node_modules/node-cas-authentication/index.js';

const cas = new CASAuthentication({
  cas_url: process.env.CAS_URL || "https://testcas.cs.ksu.edu/login",
  service_url: process.env.CODESPACE_NAME ? `https://${process.env.CODESPACE_NAME}-${process.env.PORT || 3001}.app.github.dev` : process.env.CAS_SERVICE_URL,
  cas_version: '2.0',
  renew: false,
  is_dev_mode: process.env.CAS_DEV_MODE === 'true',
  dev_mode_user: process.env.CAS_DEV_USER,
  dev_mode_info: {},
  session_name: 'cas_user',
  session_info: 'cas_userinfo',
  destroy_session: true,
  return_to: process.env.CODESPACE_NAME ? `https://${process.env.CODESPACE_NAME}-${process.env.PORT || 3001}.app.github.dev${process.env.CAS_REDIRECT_URL}` : process.env.CAS_SERVICE_URL + process.env.CAS_REDIRECT_URL,
});

export default cas;