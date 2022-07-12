import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Space, Typography, Select } from 'antd';
import Loading from '../../components/Loading';
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


  useEffect(() => {
    connectWallet();
    // eslint-disable-next-line
  }, []);

  const redirectToExtensionPage = () => {
    window.location.href = 'https://chrome.google.com/webstore/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd';
  };

  return (
      <Space size='large' direction='vertical' style={{ width: '100%', alignItems: 'center', height: '480px', justifyContent: 'center' }}>
        <Loading isLoading={isLoading}/>
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
            <Title level={4}>Please select your merchant account?</Title>
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
