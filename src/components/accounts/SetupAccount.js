import React from 'react';
import {  useNavigate } from 'react-router-dom';
import { Card, Button } from 'antd';

export default function CreateAccount() {
  const navigate = useNavigate();

  const onCreateAccount = () => {
    navigate('/create-account');
  };

  const onImportExistingAccount = () => {
    navigate('/import-account');
  };

  return (
    <Card>
      <Button onClick={onCreateAccount}>Create a new account</Button>
      <span>or</span>
      <Button onClick={onImportExistingAccount}>Import existing account</Button>
    </Card>
  )
};
