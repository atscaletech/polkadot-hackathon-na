import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Result, Button } from 'antd';

export default function CheckoutSuccess() {
  const navigate = useNavigate();
  return (
    <Result
      status="success"
      title="Your order is completed!"
      extra={[
        <Button type="primary" size='large' shape='round' key="continue_shopping" onClick={() => navigate('/shop')}>
          Continue shopping
        </Button>
      ]}
    />
  )
}