// 运行时配置
import { RuntimeConfig } from '@umijs/max';
import { App, ConfigProvider } from 'antd';
import { ClickToComponent } from 'click-to-react-component';

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState(): Promise<{ username: string }> {
  return { username: '@umijs/max' };
}

export function rootContainer(container: React.ReactNode) {
  return (
    <ConfigProvider>
      <App style={{ height: '100%' }}>
        {container}
        <ClickToComponent
          pathModifier={(defaultPath: string) => {
            if (!defaultPath) return defaultPath;

            const projectPath =
              '/Users/jakequc/Desktop/quick-demo/max-intl-react';

            const rightPath = defaultPath.includes(projectPath)
              ? defaultPath
              : `${projectPath}/${defaultPath}`;

            return rightPath;
          }}
        />
      </App>
    </ConfigProvider>
  );
}

export const locale: RuntimeConfig['locale'] = {
  textComponent: 'span',
  onError: () => {
    console.log('error handler...');
  },
  // locale: string
  // formats: CustomFormats
  // messages: Record<string, string> | Record<string, MessageFormatElement[]>
  // defaultLocale: string
  // timeZone?: string
  // textComponent?: React.ComponentType | keyof React.ReactHTML
  // wrapRichTextChunksInFragment?: boolean
  // defaultRichTextElements?: Record<string, FormatXMLElementFn<React.ReactNode>>
  // onError(err: string): void
};
