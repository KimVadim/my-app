import { Button, Spin, Table, Menu, Row, Col, Input, MenuProps } from "antd";
import React, { useEffect, useRef, useState } from 'react';
import { OpportunityModal } from "../../src/components/OpportunityModal.tsx";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store";
import { getSheetData } from "../service/appServiceBackend.ts";
import { ModalTitle, OpportunityFieldData } from "../constants/appConstant.ts";
import { opportunityMeta } from "./AllApplicationMeta.tsx";
import '../App.css';
import { useNavigate } from "react-router-dom";
import { ProgressBar, Toast } from "antd-mobile";
import { PaymentProgreesModal } from "./PaymentProgressModal.tsx";
import { SettingOutlined } from '@ant-design/icons';

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
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalPayment, setIsModalPayment] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [current, setCurrent] = useState('mail');
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const isCalledRef = useRef(false);
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const optyData = useSelector((state: RootState) => state.opportunity.opportunity);
  const quotesData = useSelector((state: RootState) => state.quote.quote);
  const currentMonthPayments = quotesData?.filter(item => {
    const payDate = new Date(item['Date/Time']);
    return payDate.getMonth() === currentMonth && payDate.getFullYear() === currentYear && ['Prod_1', 'Rent180'].includes(item['Product']);
  }) || [];
  const currentMonthPaymentsCount = currentMonthPayments.length;
  const optyActiveCount = optyData.filter(x => x[OpportunityFieldData.Stage] === 'Заключили').length;
  const optyAllCount = optyData.length;

  useEffect(() => {
    if (!isCalledRef.current) {
      getSheetData(dispatch);
      isCalledRef.current = true;
    }
  }, [dispatch]);
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

  const onClickMenu: MenuProps['onClick'] = (e) => {
    setCurrent(e.key);
    if (e.key) {
      navigate(e.key)
    }
  };
  const actions ={
    handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchText(e.target.value);
    },
    handleRowClick: (record: any) => {
      setSelectedRecord(record);
      setIsModalOpen(true);
    },
  };

  return (
    <>
      <Spin spinning={loading}>
        <Table
          rowKey="uid"
          scroll={{ x: 395 }}
          title={() => <>
            <Row align="middle" gutter={15}>
              <Col flex="auto" style={{ maxWidth: '111px' }}>
                <Menu
                  onClick={onClickMenu}
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
                  onChange={actions.handleSearch}
                  style={{ width: 150 }}
                />
              </Col>
            </Row>
            <Row align="middle" gutter={15}>
              <Col flex="auto">
                <div onClick={() => setIsModalPayment(true)} style={{ cursor: 'pointer' }}>
                <ProgressBar
                  percent={(currentMonthPaymentsCount/optyActiveCount)*100}
                  text={`${Math.floor(((currentMonthPaymentsCount/optyActiveCount)*100) * 10) / 10}% плат. ${currentMonthPaymentsCount}/${optyActiveCount}`}
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
                      Toast.show({content: 'Договора обновлены!', duration: 3000 });
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
            onClick: () => actions.handleRowClick(record),
          })}
        />
      </Spin>
      <OpportunityModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        record={selectedRecord}
      />
      <PaymentProgreesModal
        setIsPaymentModal={setIsModalPayment}
        isPaymentModal={isModalPayment}
        payments={currentMonthPayments}
        paymentsCount={currentMonthPaymentsCount}
        optyActiveCount={optyActiveCount}
        optyAllCount={optyAllCount}
      />
    </>
  );
}
