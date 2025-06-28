import { Col, Menu, MenuProps, Row, Spin, Table, Tag } from "antd";
import React, { useState } from "react";
import { menuItems } from "./Opportunity.tsx";
import { useNavigate } from "react-router-dom";
import { RootState } from "../store.ts";
import { useSelector } from "react-redux";
import { paymentsMeta } from "./AllApplicationMeta.tsx";
import { ModalTitle, PaymentsFieldData } from "../constants/appConstant.ts";

export const Payments: React.FC = () => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState("line");
  const [loading, setLoading] = useState<boolean>(false);
  const paymentsData = useSelector((state: RootState) => state.quote.quote);

  const onClick: MenuProps["onClick"] = (e) => {
    setCurrent(e.key);
    if (e.key) navigate(e.key);
  };

  return (
    <div style={{ padding: 5, display: 'flex', justifyContent: 'center'}}>
      <Spin spinning={loading}>
        <Row align="middle" gutter={15} >
          <Col flex="auto" style={{ maxWidth: "111px" }}>
            <Menu
              onClick={onClick}
              selectedKeys={[current]}
              mode="horizontal"
              items={menuItems}
            />
          </Col>
          <Col>
            <strong>{ModalTitle.Payments}</strong>
          </Col>
        </Row>
        <Table
          rowKey="ID"
          scroll={{ x: 395 }}
          columns={paymentsMeta}
          dataSource={[...paymentsData].sort((a, b) => new Date(b[PaymentsFieldData.Created]).getTime() - new Date(a[PaymentsFieldData.Created]).getTime())}
          size="middle"
          pagination={{
            position: ["bottomCenter"],
            pageSize: 50,
          }}
        />
      </Spin>
    </div>
  );
};