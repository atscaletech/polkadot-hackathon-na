import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';
import routes from './routes';
import logo from './logo.svg';

import './App.less';

const { Header, Footer, Content } = Layout;

export default function App() {
  return (
    <Layout
      style={{
        minHeight: "100vh",
        background: "#F7F7F7",
      }}
    >
      <Header
        style={{
          background: "#F7F7F7"
        }}
      >
        <a className="logo" href='/'>
          <img width={96} src={logo} alt="Libra logo"/>
        </a>
      </Header>
      <Content 
        style={{
          maxWidth: "1280px",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <Routes>
          {routes.map(route => (
            <Route key={route.path} path={route.path} exact={route.exact} element={<route.element/>}/>
          ))}
        </Routes>
      </Content>
      <Footer
        style={{
          background: "#F7F7F7",
          textAlign: "center",
        }}
      >
      </Footer>
    </Layout>
  )
};