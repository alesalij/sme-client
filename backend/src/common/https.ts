const fs = require("fs");
const path = require("path");
const https = require("https");
const tunnel = require("tunnel");

const certDir = path.resolve(__dirname, "./resources/cacerts");

/** @type {Buffer[]} */
const ca = fs
  .readdirSync(certDir)
  .filter((file) => file.endsWith(".cer"))
  .map((file) => fs.readFileSync(path.resolve(certDir, file)));

/** @type {HttpOptions} */
const httpProxyAgentConfig = {
  /** @type {ProxyOptions} */
  proxy: {
    host: "proxy.rccf.ru",
    port: 8080,
    proxyAuth: "svc_amlreports:ip9Sgub",
    headers: {},
  },
};
/** @type {HttpsOverHttpOptions} */
const httpsProxyAgentConfig = {
  ...httpProxyAgentConfig,
  ca,
  rejectUnauthorized: false, // to prevent the UNABLE_TO_GET_ISSUER_CERT_LOCALLY error
};

/** @type {Agent} */
export httpAgent = tunnel.httpOverHttp();
/** @type {Agent} */
export httpsOverHttpAgent = tunnel.httpsOverHttp(httpsProxyAgentConfig);
/** @type {Agent} */
export httpsAgent = new https.Agent({
  ca,
  rejectUnauthorized: false,
});
