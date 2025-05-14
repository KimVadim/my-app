import React, { useState } from 'react';
import { Button, Form, Input } from 'antd';
import { loginUser } from '../service/appServiceBackend.ts';
import { useNavigate } from 'react-router-dom';
import { setUser } from '../slices/userSlice.ts';
import { AppDispatch } from '../store.ts';
import { useDispatch } from 'react-redux';
import { Space } from 'antd-mobile';

type FieldType = {
  username?: string;
  password?: string;
};

const Login: React.FC = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  
  const handleSubmit = async () => {
    setError('');
    try {
      const response = loginUser(login, password)
        .then(() => {
          localStorage.setItem('token', response['access_token'])
          dispatch(setUser(login))
        })
        .then(() => navigate('/opty'));
    } catch (err) {
      setError('Неверный email или пароль');
    }
  };

  return (
    <Space justify='center' block>
    <Form
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{
        paddingTop: '75%'
      }}
      onFinish={handleSubmit}
    >
      <Form.Item<FieldType>
        label="Username."
        name="username"
        rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Input onChange={(e) => setLogin(e.target.value)} />
      </Form.Item>

      <Form.Item<FieldType>
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input.Password onChange={(e) => setPassword(e.target.value)} />
      </Form.Item>

      <Form.Item label={null}>
        <Button type="primary" htmlType="submit">
          Войти
        </Button>
      </Form.Item>
      {error && <p>{error}</p>}
    </Form>
    </Space>
  );
};

export default Login;