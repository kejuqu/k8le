export const localGoUrl = 'http://127.0.0.1:8079';
export const pyServerUrl = 'http://localhost:8080';
export const nestServerUrl = 'http://localhost:8081';

const getProxyConf = (targetUrl: string) => {
  return {
    // 暂时都是直接请求 serverUrl
    target: targetUrl,
    secure: false,
    toProxy: true,
    changeOrigin: true,
  };
};


const getProxyConfNest = (targetUrl: string) => {
  return {
    // 暂时都是直接请求 serverUrl
    target: targetUrl,
    secure: false,
    toProxy: true,
    changeOrigin: true,
    pathRewrite: {
      '^/api/nj': '',
    }
  };
};

export const proxy = {
  dev: {
    '/api/v1/': getProxyConf(pyServerUrl),
    '/api/nj/': getProxyConfNest(nestServerUrl),
  },
};
