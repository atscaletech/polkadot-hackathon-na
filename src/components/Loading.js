
import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

export default function Loading({ isLoading}) {
  return (
    <>
      {
        isLoading && 
        <div style={{ position: 'fixed', background: '#F7F7F7', height: '100vh', width: '100vw', top: '0', left: '0', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
          <Spin indicator={<LoadingOutlined style={{ fontSize: 32 }} spin />}/>
        </div>
      }
    </>
  )
}