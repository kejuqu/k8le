import { Spin } from 'antd';
import { SpinProps } from 'antd/lib/spin';
import React from 'react';

const Loading: React.FC<SpinProps> = (props) => {
  return (
    <Spin
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      tip="Loading"
      spinning
      size="large"
      {...props}
    />
  );
};

export default Loading;
