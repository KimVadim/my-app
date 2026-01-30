import { Menu, MenuProps } from "antd";
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { SettingOutlined } from '@ant-design/icons';
import { useSelector } from "react-redux";
import { RootState } from "../store";

type MenuItem = Required<MenuProps>['items'][number];

export const MenuComp: React.FC = () => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState('mail');
  const login = useSelector((state: RootState) => state.user.login)?.toLowerCase() || '';;

  const menuItems: MenuItem[] = [
    {
      label: 'Меню',
      key: 'SubMenu',
      icon: <SettingOutlined />,
      children: [
        {
          type: 'group',
          label: 'Основные',
          children: [
            { label: 'Договора', key: '/opportunities' },
            { label: 'Платежи', key: '/payments' },
            { label: 'Контакты', key: '/contacts' },
            { label: 'Расходы', key: '/expenses', disabled: login === 'ttigay' ? true : false  },
            { label: 'Склады', key: '/storage', disabled: login === 'ttigay' ? true : false  },
          ],
        },
        {
          type: 'group',
          label: 'Отчеты',
          children: [
            { label: 'Отчеты', key: '/incomereport', disabled: login === 'ttigay' ? true : false },
            { label: 'Отчеты CN', key: '/incomereportcn',disabled: login === 'ttigay' ? true : false },
          ],
        },
      ],
    },
  ];

  const onClickMenu: MenuProps['onClick'] = (e) => {
    setCurrent(e.key);
    if (e.key) {
      navigate(e.key)
    }
  };

  return (
    <Menu
      onClick={onClickMenu}
      selectedKeys={[current]}
      mode="horizontal"
      items={menuItems}
    />
  );
}
