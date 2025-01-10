import { defineConfig } from '@umijs/max';
import { proxy } from './config';
import { routes } from './src/routes';

const isDev = process.env.NODE_ENV === 'development';

export default defineConfig({
  antd: {},
  model: {},
  access: {},
  initialState: {
    loading: '@/components/loading',
  },
  define: {
    'process.env': process.env,
  },
  layout: {
    title: 'k8le',
  },
  request: {},
  routes,
  // 如果打包出错，注释掉这行，mako 目前对 windows 支持不好
  mako: {},
  deadCode: {
    patterns: ['src/pages/**', 'src/components/**'],
  },
  hash: true,
  codeSplitting: {
    jsStrategy: 'granularChunks',
  },
  mock: {
    include: ['mock/**/*.mock.ts'],
  },
  proxy: proxy['dev'],
  jsMinifier: 'terser',
  cssMinifier: 'cssnano',
  devtool: isDev ? 'eval' : false,
  favicons: [
    'https://www.freepik.com/icon/telemedicine_4435585#fromView=search&page=1&position=65&uuid=fe8a9abf-83d2-4d84-9e4a-2a8aeb62ad57',
  ],
  npmClient: 'pnpm',
  locale: {
    // 默认使用 src/locales/zh-CN.ts 作为多语言文件
    antd: true, // 如果项目依赖中包含 `antd`，则默认为 true
    baseNavigator: true,
    baseSeparator: '-',
    default: 'zh-CN',
    title: false,
    useLocalStorage: true,
  },
  tailwindcss: {},
});
