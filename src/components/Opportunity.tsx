import { Button, Spin, Table, message, Menu, Row, Col, Input } from "antd";
import React, { useEffect, useRef, useState } from 'react';
import { OpportunityModal } from "../../src/components/OpportunityModal.tsx";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store";
import { getSheetData } from "../service/appServiceBackend.ts";
import { ModalTitle, OpportunityFieldData } from "../constants/appConstant.ts";
import { opportunityMeta } from "./AllApplicationMeta.tsx";
import type { MenuProps } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import '../App.css';
import { useNavigate } from "react-router-dom";
import { Popup, ProgressBar } from "antd-mobile";
import { PaymentProgreesModal } from "./PaymentProgressModal.tsx";

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
  const [isModalPayment, setIsModalPayment] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState<any[]>([]);
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
  }, [dispatch]);
  const optyData = useSelector((state: RootState) => state.opportunity.opportunity);
  useEffect(() => {
    if (searchText) {
      const filtered = optyData.filter((item) =>
        item[OpportunityFieldData.ApartNum]?.toString().toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(optyData);
    }
  }, [searchText, optyData]);
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
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };
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
                <Input
                  placeholder="Поиск по номеру квартиры..."
                  value={searchText}
                  onChange={handleSearch}
                  style={{ width: 150 }}
                />
              </Col>
            </Row>
            <Row align="middle" gutter={15}>
              <Col flex="auto">
                <div onClick={() => setIsModalPayment(true)} style={{ cursor: 'pointer' }}>
                <ProgressBar
                  percent={(currentMonthPaymentsCount/27)*100}
                  text={`${Math.floor(((currentMonthPaymentsCount/27)*100) * 10) / 10}% плат. ${currentMonthPaymentsCount}/27`}
                  style={{
                    '--text-width': '120px',
                    '--fill-color': 'linear-gradient(to right, var(--adm-color-warning), var(--adm-color-success))',
                  }}
                />
                </div>
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
          </>
          }
          columns={opportunityMeta}
          dataSource={filteredData}
          size='middle'
          pagination={{
            position: ['bottomCenter'],
            pageSize: 15
          }}
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
          })}
        />
      </Spin>
      {/*isModalOpen && 
        <OpportunityModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen} 
          record={selectedRecord}
        />
      */}
      <Popup
        visible={isModalOpen}
        onMaskClick={() => {
          setIsModalOpen(false)
        }}
      >
        <div
          style={{ height: '55vh', overflowY: 'scroll', padding: '20px' }}
        >
          <OpportunityModal
            setIsModalOpen={setIsModalOpen} 
            record={selectedRecord}
          />
        </div>
      </Popup>
      {isModalPayment &&
        <PaymentProgreesModal
          setIsPaymentModal={setIsModalPayment}
          isPaymentModal={isModalPayment}
          payments={currentMonthPayments}
          paymentsCount={currentMonthPaymentsCount}
        />
      }
    </>
  );
}
