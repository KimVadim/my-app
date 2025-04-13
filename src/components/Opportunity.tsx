import { Button, Spin, Table, message, Menu, Row, Col } from "antd";
import React, { useEffect, useState } from 'react';
import { OpportunityModal } from "../../src/components/OpportunityModal.tsx";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store";
import { getSheetData } from "../service/appServiceBackend.ts";
import { ModalTitle } from "../constants/appConstant.ts";
import { opportunityMeta } from "./AllApplicationMeta.tsx";
import type { MenuProps } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import '../App.css';
import { Line } from '@ant-design/charts';

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
  {
    label: 'Меню',
    key: 'SubMenu',
    icon: <SettingOutlined />,
    children: [
      {
        type: 'group',
        label: 'Item 1',
        children: [
          { label: 'Option 1', key: 'setting:1' },
          { label: 'Option 2', key: 'setting:2' },
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

  const success = () => {
    messageApi.open({
      type: 'success',
      content: 'Данные по договорам и платежам обновлены',
      duration: 3,
    });
  };
  
  useEffect(() => {  
    getSheetData(dispatch);
  }, [dispatch]);
  
  const optyData = useSelector((state: RootState) => state.opportunity.opportunity)
  const handleRowClick = (record: any) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  const [current, setCurrent] = useState('mail');

  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e.key);
    setCurrent(e.key);
  };

  const data = [
    { year: '1991', value: 3 },
    { year: '1992', value: 4 },
    { year: '1993', value: 3.5 },
    { year: '1994', value: 5 },
    { year: '1995', value: 4.9 },
    { year: '1996', value: 6 },
    { year: '1997', value: 7 },
    { year: '1998', value: 9 },
    { year: '1999', value: 13 },
  ];
  const config = {
    data,
    height: 400,
    xField: 'year',
    yField: 'value',
    point: {
      size: 5,
      shape: 'circle',
    },
    tooltip: {
      formatter: (data) => {
        return {
          name: '',
          value: String,
        };
      },
      customContent: (name, data) =>
        `<div>${data?.map((item) => {
          return `<div class="tooltip-chart" >
              <span class="tooltip-item-name">${item?.name}</span>
              <span class="tooltip-item-value">${item?.value}</span>
            </div>`;
        })}</div>`,
      showMarkers: Boolean,
      showContent: Boolean,
      position: 'right | left',
      showCrosshairs: Boolean,
    },
  };

  return (
    <>
      {contextHolder}
      <Spin spinning={loading}>
        <Table
          rowKey="uid"
          scroll={{ x: 395 }}
          title={() => 
            <Row align="middle" gutter={15}>
              <Col flex="auto" style={{ maxWidth: '111px' }}>
                <Menu
                  onClick={onClick}
                  selectedKeys={[current]}
                  mode="horizontal"
                  items={items}
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
        <Line {...config} />
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
