import React, { useState, useEffect } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Button, Space, Typography, Select, Spin } from 'antd';
import { getAccounts } from "../../services/libra";

const { Title } = Typography;
const { Option } = Select;

export default function SelectAccount() {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [selectedAccountAddress, setSelectedAccountAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const connectWallet = async () => {
    setIsLoading(true);

    const result = await getAccounts();
    if (result.length === 1 ) {
      setIsLoading(false);
      navigate(`/merchant/orders?account_address=${result[0].address}`)
      return;
    }

    if (result.length > 1) {
      setAccounts(result);
      setSelectedAccountAddress(result[0].address);
    }

    setIsLoading(false);
  };

  // eslint-disable-next-line
  useEffect(() => { connectWallet() }, []);

  const redirectToExtensionPage = () => {
    window.location.href = 'https://chrome.google.com/webstore/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd';
  };

  return (
      <Space size='large' direction='vertical' style={{ height: '480px', justifyContent: 'center' }}>
        {
          isLoading && 
          <div style={{ position: 'fixed', background: '#F7F7F7', height: '100vh', width: '100vw', top: '0', left: '0', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
            <Spin indicator={<LoadingOutlined style={{ fontSize: 32 }} spin />}/>
          </div>
        }
        {
          accounts.length === 0 && <>
            <Title level={4}>Please install the PolkadotJs extension before using the merchant dashboard.</Title>
            <Space size='large' style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button
                type='primary'
                size='large'
                shape='round'
                onClick={redirectToExtensionPage}
                target='blank'
              >
                Install PolkadotJs extension
              </Button>
            </Space>
          </>
        }
        {
          accounts.length > 0 && <>
            <Title level={4}>Please select your merchant wallet?</Title>
            <Select
              style={{ minWidth: '240px', width: '100%' }}
              value={selectedAccountAddress}
              onChange={(value) => setSelectedAccountAddress(value)}
            >
              { accounts.map(account => <Option key={account.address} value={account.address}>{account.meta.name}</Option>)}
            </Select>
            <Space size='large' style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button
                size='large'
                shape='round'
                onClick={() => navigate('/')}
              >
                Go back
              </Button>
              <Button
                type='primary'
                size='large'
                shape='round'
                onClick={() => navigate(`/merchant/orders?account_address=${selectedAccountAddress}`)}
              >
                Continue
              </Button>
            </Space>
          </>
        }
      </Space>
  )
};
