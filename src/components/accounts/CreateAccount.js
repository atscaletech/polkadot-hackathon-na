import React, { Fragment, useEffect, useState } from 'react';
import { Card, Space, Button, Divider, Typography, Input } from 'antd';
import { mnemonicGenerate } from '@polkadot/util-crypto';
import { Keyring } from '@polkadot/keyring';
import { addAccount } from '../../services/keystore';
import { useNavigate } from "react-router-dom";

const {
  Paragraph,
  Title,
} = Typography;

export default function CreateAccount() {
  const navigate = useNavigate();

  const [mnemonic, setMnemonic] = useState('');
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setMnemonic(mnemonicGenerate(12));
  }, []);

  const onGenerateNew = () => {
    setMnemonic(mnemonicGenerate(12));
  };

  const onContinue = () => {
    if (step === 2) {
      console.log('On continue!');
      if (!name) {
        setErrorMessage('Name cannot empty!');
        return;
      }

      if (!password) {
        setErrorMessage('Password cannot empty!');
        return;
      }

      if (password !== rePassword) {
        setErrorMessage('Passwords not match!');
        return;
      }

      const keyring = new Keyring();
      const pair = keyring.addFromUri(mnemonic, { name }, 'ed25519');
      addAccount(pair.address, JSON.stringify(pair.toJson()));
      navigate('/')
      return;
    }
    setStep(step + 1);
  };

  return (
    <Card title="Create new account">
      {
        step === 1 && <Fragment>
          <Title level={3}>Your seed phrase</Title>
          <Paragraph>
            Please write down your wallet's mnemonic seed and keep it in a safe place. The mnemonic can be used to restore your wallet. Keep it carefully to not lose your assets.
          </Paragraph>
          <Divider orientation="left"></Divider>

          <Paragraph code strong copyable>
            { mnemonic }
          </Paragraph>
        
          <Divider orientation="left"></Divider>
        </Fragment>
      }

      {
        step === 2 && <Fragment>
          <Title level={3}>Setup your password</Title>
          <Paragraph>
            Please enter a strong password.
          </Paragraph>
          <Divider orientation="left"></Divider>
          <Space direction='vertical' style={ {"width": "100%"}}>
            <Input
              placeholder='Your descriptive name'
              value={name}
              onInput={(e) => setName(e.target.value)}
            />
            <Input.Password
              type='password'
              placeholder='Your strong password'
              value={password}
              onInput={(e) => setPassword(e.target.value)}
            />
            <Input.Password
              type='password'
              placeholder='Re enter your password'
              value={rePassword}
              onInput={(e) => setRePassword(e.target.value)}
            />
          </Space>
          <Divider orientation="left"></Divider>
        </Fragment>
      }
      <Paragraph strong type='danger'>{errorMessage}</Paragraph>
      <Space size="large" align='end'>
        { step === 1 && <Button shape='round' size='large' onClick={onGenerateNew}>Generate New</Button> }
        <Button type='primary' shape='round' size='large' onClick={onContinue}>Continue</Button>
      </Space>
    </Card>
  )
};
