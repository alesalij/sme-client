import * as fs from "fs";
import * as path from "path";
import * as https from "https";
import * as tunnel from "tunnel";

const certDir = path.resolve(__dirname, "./resources/cacerts");

// Читаем сертификаты из директории
let ca: Buffer[] = [];
try {
  if (fs.existsSync(certDir)) {
    ca = fs
      .readdirSync(certDir)
      .filter((file) => file.endsWith(".cer"))
      .map((file) => fs.readFileSync(path.resolve(certDir, file)));
  }
} catch (error) {
  console.warn("Could not load CA certificates:", error);
}

// Конфигурация прокси
const httpProxyAgentConfig: tunnel.HttpOptions = {
  proxy: {
    host: "proxy.rccf.ru",
    port: 8080,
    proxyAuth: "svc_amlreports:ip9Sgub",
    headers: {},
  },
};

const httpsProxyAgentConfig: tunnel.HttpsOverHttpOptions = {
  ...httpProxyAgentConfig,
  ca,
  rejectUnauthorized: false,
};

export const httpAgent = tunnel.httpOverHttp(httpProxyAgentConfig);
export const httpsOverHttpAgent = tunnel.httpsOverHttp(httpsProxyAgentConfig);
export const httpsAgent = new https.Agent({
  ca,
  rejectUnauthorized: false,
});

// Дефолтный агент для HTTPS без прокси
export const defaultHttpsAgent = new https.Agent({
  rejectUnauthorized: false,
});
