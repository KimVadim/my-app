import { Col, Menu, MenuProps, Row, Spin, Table, Tag, Input } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { menuItems } from "./Opportunity.tsx";
import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../store.ts";
import { useDispatch, useSelector } from "react-redux";
import { getExpenseData, getSheetData } from "../service/appServiceBackend.ts";
import { expenseMeta } from "./AllApplicationMeta.tsx";
import { ExpenseFieldData } from "../constants/appConstant.ts";
import { AddFloatButton } from "./AddFloatButton.tsx";
import { AddExpenseModal } from "./AddExpenseModal.tsx";

export const Expense: React.FC = () => {
  const [current, setCurrent] = useState("line");
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch: AppDispatch = useDispatch();
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
  }, [dispatch]);
  useEffect(() => {
    if (searchText) {
      const filtered = expenseData.filter((item) =>
        item[ExpenseFieldData.ApartNum]?.toString().toLowerCase().includes(searchText.toLowerCase())
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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
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
            <strong>Расходы</strong>
          </Col>
          <Col>
            <Input
              placeholder="Поиск по номеру квартиры..."
              value={searchText}
              onChange={handleSearch}
              style={{ width: 170 }}
            />
          </Col>
        </Row>
        <Table
          rowKey="ID"
          scroll={{ x: 395 }}
          columns={expenseMeta}
          dataSource={filteredData} // Используем отфильтрованные данные
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
          setIsAdExpense={setIsAddExpense}
        />
        {isAddExpense && <AddExpenseModal
          setIsAddExpense={setIsAddExpense} isAddExpense={isAddExpense} 
        />}
      </Spin>
    </div>
  );
};