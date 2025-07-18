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
import { Toast } from "antd-mobile";
import { SettingOutlined } from '@ant-design/icons';
import { PaymentProgreesBar } from "./PaymentProgressBar.tsx";

type MenuItem = Required<MenuProps>['items'][number];

export const menuItems: MenuItem[] = [
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
          { label: 'Расходы', key: '/expenses' },
        ],
      },
      {
        type: 'group',
        label: 'Отчеты',
        children: [
          { label: 'Доходы', key: '/incomereport' },
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
  const optyData = useSelector((state: RootState) => state.opportunity.opportunity);

  useEffect(() => {
    if (!isCalledRef.current) {
      getSheetData(dispatch);
      isCalledRef.current = true;
    }
  }, [dispatch]);
  useEffect(() => {
    if (searchText) {
      const filtered = optyData.filter((item) =>
        item[OpportunityFieldData.ApartNum]?.toString().toLowerCase().includes(searchText.toLowerCase()) |
        item[OpportunityFieldData.FullName]?.toString().toLowerCase().includes(searchText.toLowerCase())
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
              <PaymentProgreesBar
                setIsPaymentModal={setIsModalPayment}
                isPaymentModal={isModalPayment}
              />
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
    </>
  );
}
