import { Button, Spin, Table, message, Menu, Row, Col } from "antd";
import React, { useEffect, useRef, useState } from 'react';
import { OpportunityModal } from "../../src/components/OpportunityModal.tsx";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store";
import { getSheetData } from "../service/appServiceBackend.ts";
import { ModalTitle } from "../constants/appConstant.ts";
import { opportunityMeta } from "./AllApplicationMeta.tsx";
import type { MenuProps } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import '../App.css';
import { useNavigate } from "react-router-dom";
import { ProgressBar } from "antd-mobile";

type MenuItem = Required<MenuProps>['items'][number];

export const menuItems: MenuItem[] = [
  {
    label: 'Меню',
    key: 'SubMenu',
    icon: <SettingOutlined />,
    children: [
      { label: 'Договора', key: '/opty' },
      { label: 'Расходы', key: '/expense' },
      {
        type: 'group',
        label: 'Отчеты',
        children: [
          { label: 'Отчет по доходам', key: '/incomereport' },
        ],
      },
    ],
  },
];

export const Opportunity: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const dispatch: AppDispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const success = () => {
    messageApi.open({
      type: 'success',
      content: 'Данные по договорам и платежам обновлены',
      duration: 3,
    });
  };
  
  const isCalledRef = useRef(false);

  useEffect(() => {  
    if (!isCalledRef.current) {
      getSheetData(dispatch);
      isCalledRef.current = true;
    }
  }, []);
  
  const optyData = useSelector((state: RootState) => state.opportunity.opportunity);
  const quotesData = useSelector((state: RootState) => state.quote.quote);
  const handleRowClick = (record: any) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  const [current, setCurrent] = useState('mail');

  const onClick: MenuProps['onClick'] = (e) => {
    setCurrent(e.key);
    if (e.key) {
      navigate(e.key)
    }
  };
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const currentMonthPayments = quotesData?.filter(item => {
    const payDate = new Date(item['Date/Time']);
    return payDate.getMonth() === currentMonth && payDate.getFullYear() === currentYear && item['Product'] === 'Prod_1';
  }) || [];
  const currentMonthPaymentsCount = currentMonthPayments.length;
  return (
    <>
      {contextHolder}
      <Spin spinning={loading}>
        <Table
          rowKey="uid"
          scroll={{ x: 395 }}
          title={() => <>
            <Row align="middle" gutter={15}>
              <Col flex="auto" style={{ maxWidth: '111px' }}>
                <Menu
                  onClick={onClick}
                  selectedKeys={[current]}
                  mode="horizontal"
                  items={menuItems}
                />
              </Col>
              <Col>
                <strong>{ModalTitle.AllOpportunity}</strong>
              </Col>
              <Col>
                <Button
                  type="primary"
                  onClick={() => {
                    setLoading(true);
                    getSheetData(dispatch).then(() => {
                      setLoading(false);
                      success();
                    });
                  }}
                >
                  Обновить
                </Button>
              </Col>
            </Row>
            <ProgressBar
              percent={50}
              text={`Платежей ${currentMonthPaymentsCount}/27`}
              style={{
                '--text-width': '110px',
              }}
            />
          </>
          }
          columns={opportunityMeta}
          dataSource={optyData}
          size='middle'
          pagination={{
            position: ['bottomCenter'],
            pageSize: 27
          }}
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
          })}
        />
      </Spin>
      {isModalOpen && 
        <OpportunityModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen} 
          record={selectedRecord}
        />
      }
    </>
  );
}
