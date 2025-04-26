import { Col, Menu, MenuProps, Row, Spin, Table, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { menuItems } from "./Opportunity.tsx";
import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../store.ts";
import { useDispatch, useSelector } from "react-redux";
import { getExpenseData } from "../service/appServiceBackend.ts";
import { expenseMeta } from "./AllApplicationMeta.tsx";
import { ExpenseFieldData } from "../constants/appConstant.ts";

export const Expense: React.FC = () => {
    const [current, setCurrent] = useState('line');
    const navigate = useNavigate();
    const [loading, setLoading] = React.useState<boolean>(false);
    const dispatch: AppDispatch = useDispatch();
    
    useEffect(() => {
        try {
            getExpenseData(dispatch);
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
        }
    }, []);
    const expenseData = useSelector((state: RootState) => state.expense.expense);
    const onClick: MenuProps['onClick'] = (e) => {
        setCurrent(e.key);
        if (e.key) navigate(e.key);
    };
    
    return ( <div style={{ padding: '24px' }}>
        <Spin spinning={loading}>
        <Table
          rowKey="ID"
          scroll={{ x: 395 }}
          title={() => 
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
                    <strong>Расходы</strong>
                </Col>
            </Row>
          }
          columns={expenseMeta}
          dataSource={expenseData}
          expandable={{
            expandedRowRender: (record) => 
            <p style={{ margin: 0 }}>
                <Tag color={"#2db7f5"}>{record?.[ExpenseFieldData.PaymentType]}</Tag>
                {record?.[ExpenseFieldData.Comment]}
            </p>,
          }}
          size='middle'
          pagination={{
            position: ['bottomCenter'],
            pageSize: 27
          }}
        />
      </Spin>
    </div>)
}