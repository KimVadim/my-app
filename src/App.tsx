import './App.css';
import React from 'react';
import HomePage from './components/HomePage.tsx';
import { ConfigProvider } from 'antd';

function App() {
  return (
    <ConfigProvider
      theme={{
        components: {
          Notification: {
            width: 280,
          },
        },
      }}
    >
      <HomePage/>
    </ConfigProvider>
  );
}

export default App;
