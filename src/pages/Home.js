import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Space, Typography } from 'antd';
import { getDefaultMerchant } from "../services/api";

const { Title } = Typography;

export default function Home() {
  const navigate = useNavigate();
  const [merchant, setMerchant] = useState();

  const fetchMerchant = async () => {
    const result = await getDefaultMerchant();
    setMerchant(result);
  };

  useEffect(() => {
    fetchMerchant();
  }, []);

  return (
      <Space size='large' direction='vertical' style={{ width: '100%', height: '480px', justifyContent: 'center', alignItems: 'center' }}>
        <Title level={1}>Welcome to the Libra</Title>
        <Title level={4}>Can you tell us who you are?</Title>
        <Space size='large' style={{ justifyContent: 'center' }}>
          <Button
            loading={!merchant}
            disabled={!merchant}
            size='large'
            type='primary'
            shape='round'
            onClick={() => navigate(`/shop?merchant_address=${merchant}`)}
          >
            I'm a shop buyer
          </Button>
          <span>or</span>
          <Button size='large' shape='round' onClick={() => navigate('/merchant/orders')}>I'm a merchant</Button>
        </Space>
        <Space>
          <a href='shop/order-history'>View my order history</a>
        </Space>
      </Space>
  )
};
