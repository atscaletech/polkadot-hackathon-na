import React from 'react';
import { Routes, Route, useLocation, matchPath } from 'react-router-dom';
import { Layout } from 'antd';
import routes from './routes';

import './App.css';

const { Header, Footer, Content } = Layout;

export default function App() {
  return (
    <Layout>
      <Header>Libra Wallet</Header>
      <Content>
        <Routes>
          {routes.map(route => (
            <Route key={route.path} path={route.path} exact={route.exact} element={<route.element/>}/>
          ))}
        </Routes>
      </Content>
      <Footer>Made by @Scale Technologies with <span role="img" aria-label='heart'>❤️</span></Footer>
    </Layout>
  )
};