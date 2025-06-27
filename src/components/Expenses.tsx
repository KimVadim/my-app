import { Col, Menu, MenuProps, Row, Spin, Table, Tag, Input } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { menuItems } from "./Opportunity.tsx";
import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../store.ts";
import { useDispatch, useSelector } from "react-redux";
import { getExpenseData, getSheetData } from "../service/appServiceBackend.ts";
import { expenseMeta } from "./AllApplicationMeta.tsx";
import { ExpenseFieldData, FieldPlaceholder, ModalTitle } from "../constants/appConstant.ts";
import { AddFloatButton } from "./AddFloatButton.tsx";
import { AddExpenseModal } from "./AddExpenseModal.tsx";

export const Expenses: React.FC = () => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const [current, setCurrent] = useState("line");
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const expenseData = useSelector((state: RootState) => state.expense.expense);
  const optyData = useSelector((state: RootState) => state.opportunity.opportunity);
  const [isAddExpense, setIsAddExpense] = useState(false);
  const isCalledRef = useRef(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await getExpenseData(dispatch);
        !optyData && getSheetData(dispatch);
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
      } finally {
        setLoading(false);
      }
    };
    if (!isCalledRef.current) {
      fetchData();
      isCalledRef.current = true;
    }
  }, [dispatch, optyData]);
  useEffect(() => {
    if (searchText) {
      const filtered = expenseData.filter((item) =>
        item[ExpenseFieldData.ApartNum]?.toString().toLowerCase().includes(searchText.toLowerCase()) |
        item[ExpenseFieldData.Comment]?.toString().toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(expenseData);
    }
  }, [searchText, expenseData]);

  const onClick: MenuProps["onClick"] = (e) => {
    setCurrent(e.key);
    if (e.key) navigate(e.key);
  };

  const actions = {
    handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchText(e.target.value);
    },
  };

  return (
    <div style={{ padding: 5, display: 'flex', justifyContent: 'center'}}>
      <Spin spinning={loading}>
        <Row align="middle" gutter={15} style={{ marginBottom: 16 }}>
          <Col flex="auto" style={{ maxWidth: "111px" }}>
            <Menu
              onClick={onClick}
              selectedKeys={[current]}
              mode="horizontal"
              items={menuItems}
            />
          </Col>
          <Col>
            <strong>{ModalTitle.Expenses}</strong>
          </Col>
          <Col>
            <Input
              placeholder={FieldPlaceholder.SearchApartNum}
              value={searchText}
              onChange={actions.handleSearch}
              style={{ width: 170 }}
            />
          </Col>
        </Row>
        <Table
          rowKey="ID"
          scroll={{ x: 395 }}
          columns={expenseMeta}
          dataSource={filteredData}
          expandable={{
            expandedRowRender: (record) => (
              <p style={{ margin: 0 }}>
                <Tag color={"green"}>{record?.[ExpenseFieldData.PaymentType]}</Tag>
                {record?.[ExpenseFieldData.Comment]}
              </p>
            ),
          }}
          size="middle"
          pagination={{
            position: ["bottomCenter"],
            pageSize: 20,
          }}
        />
        <AddFloatButton
          setIsAddExpense={setIsAddExpense}
        />
        {isAddExpense && <AddExpenseModal
          setIsAddExpense={setIsAddExpense} isAddExpense={isAddExpense}
        />}
      </Spin>
    </div>
  );
};