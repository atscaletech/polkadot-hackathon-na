import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Space, Typography } from 'antd';

const { Title } = Typography;

export default function Home() {
  const navigate = useNavigate();

  return (
      <Space size='large' direction='vertical' style={{ height: '480px', justifyContent: 'center' }}>
        <Title level={1}>Welcome to the Libra</Title>
        <Title level={4}>Can you tell us who you are?</Title>
        <Space size='large' style={{ justifyContent: 'center' }}>
          <Button size='large' type='primary' shape='round' onClick={() => navigate('/shop')}>I'm a shop buyer</Button>
          <span>or</span>
          <Button size='large' shape='round' onClick={() => navigate('/merchant/orders')}>I'm a merchant</Button>
        </Space>
      </Space>
  )
};
