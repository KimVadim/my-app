import React, { useState } from 'react';
import { Button, Form, Input } from 'antd';
import { loginUser } from '../service/appServiceBackend.ts';
import { useNavigate } from 'react-router-dom';

type FieldType = {
  username?: string;
  password?: string;
};

const Login: React.FC = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError('');
    try {
      const response = loginUser(login, password)
        .then(() => localStorage.setItem('token', response['access_token']))
        .then(() => navigate('/opty'));
    } catch (err) {
      setError('Неверный email или пароль');
    }
  };

  return (
    <Form
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{
        maxWidth: 300,
        position: 'absolute',
        transform: 'translate(25%, 110%)'
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
  );
};

export default Login;