import { App, ConfigProvider } from 'antd';
import { ClickToComponent } from 'click-to-react-component';
import React from 'react';

type RootProps = {
  children: React.ReactNode;
};

export const RootWrapper: React.FC<RootProps> = ({ children }) => {
  return (
    <ConfigProvider theme={{}}>
      <App style={{ height: '100%' }}>
        {children}
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
};
