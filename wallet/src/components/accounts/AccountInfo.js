import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Card, Divider, Typography } from 'antd';
import { getAccounts } from '../../services/keystore';
import { Keyring } from '@polkadot/keyring';

const { Title, Paragraph } = Typography;

export default function AccountInfo() {
  const navigate = useNavigate();
  const [account, setAccount] = useState(null);

  useEffect(() => {
    const accounts = getAccounts();

    if (accounts.length === 0) {
      navigate('/setup-account')
    } else {
      setAccount(accounts[0]);
    }
  }, []);

  return (
    <Card title="Account Detail">
      <Divider orientation='left'> Wallet address</Divider>
      <Paragraph strong ellipsis copyable code>{account}</Paragraph>
      <Divider orientation='left'> Wallet balance</Divider>
    </Card>
  )
};
