import CASAuthentication from '../node_modules/node-cas-authentication/index.js';

const codespaceName = process.env.CODESPACE_NAME;
const port = process.env.PORT || 3000;
const casServiceUrl = `https://${codespaceName}-${port}.app.github.dev`

console.log('CAS_URL:', process.env.CAS_URL);
console.log('CAS_SERVICE_URL:', casServiceUrl);
console.log('CODESPACE_NAME:', codespaceName);
console.log('PORT:', port);

const cas = new CASAuthentication({
  cas_url: process.env.CAS_URL || "https://testcas.cs.ksu.edu/login",
  service_url: casServiceUrl || `https://${codespaceName}-${port}.github.dev`,
  cas_version: '3.0',
  renew: false,
  is_dev_mode: process.env.CAS_DEV_MODE === 'true',
  dev_mode_user: process.env.CAS_DEV_USER,
  dev_mode_info: {},
  session_name: 'cas_user',
  session_info: 'cas_userinfo',
  destroy_session: true,
  return_to: `${casServiceUrl}${process.env.CAS_REDIRECT_URL}`,
});

export default cas;