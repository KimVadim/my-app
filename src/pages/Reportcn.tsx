import React, { useState, useMemo, useEffect } from 'react';
import { Col, Row, Typography } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store.ts';
import { getMonthPaymentData } from '../service/appServiceBackend.ts';
import { PaymentProgreesBar } from '../components/PaymentProgressBar.tsx';
import { Divider } from 'antd-mobile'

import {
  BarChart,
  Bar,
  XAxis,
  ResponsiveContainer,
  LabelList,
  Legend,
} from 'recharts'
import { MenuComp } from '../components/Menu.tsx';

const { Text } = Typography;

export const IncomeReportcn: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const [selectedMonth, setSelectedMonth] = useState<string | null>('last12months');
  const [isModalPayment, setIsModalPayment] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        await getMonthPaymentData(dispatch);
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      }
    };
    fetchData();
  }, [dispatch]);

  const monthPaymentData = useSelector((state: RootState) => state.monthPayment.monthPayments);
  const memoizedMonthPaymentData = useMemo(() => monthPaymentData, [monthPaymentData]);
  const getLastSixMonths = (countMonth: number) =>
  [...Array(countMonth)].map((_, i) => {
    const date = new Date();
    date.setDate(1);
    date.setMonth(date.getMonth() - i);

    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  });
  const filteredData = useMemo(() => {
    if (selectedMonth === 'last12months') {
      const lastSixMonths = getLastSixMonths(12);
      return memoizedMonthPaymentData.filter((item) => lastSixMonths.includes(item.month));
    } else if (selectedMonth === 'last6months') {
      const lastSixMonths = getLastSixMonths(6);
      return memoizedMonthPaymentData.filter((item) => lastSixMonths.includes(item.month));
    } else if (selectedMonth === 'last3months') {
      const lastSixMonths = getLastSixMonths(3);
      return memoizedMonthPaymentData.filter((item) => lastSixMonths.includes(item.month));
    } else if (selectedMonth) {
      return memoizedMonthPaymentData.filter((item) => item.month === selectedMonth);
    }
    return memoizedMonthPaymentData;
  }, [memoizedMonthPaymentData, selectedMonth]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'KZT',
      maximumFractionDigits: 0,
    }).format(value);

  const calcSum = (data, type: string) => data.filter((x) => x.type === type).reduce((sum, item) => sum + Number(item.value), 0);

  const sums = useMemo(() => ({
    payment: calcSum(filteredData, 'Аренда'),
    deposit: calcSum(filteredData, 'Депозит'),
    depositReturn: calcSum(filteredData, 'Депозит возврат'),
    expenses: calcSum(filteredData, 'Расход'),
    serviceAlatau: calcSum(filteredData, 'Комм. Алатау'),
    servicePavlenko: calcSum(filteredData, 'Комм. Павленко'),
    storage: calcSum(filteredData, 'Склад'),
  }), [filteredData])

  const SummaryRow: React.FC<{ label: string; value: number; type?: "success" | "warning" | "danger" }> = ({ label, value, type }) => (
    <Text type={type}>{`${label}: ${formatCurrency(value)}`}</Text>
  );

  const chartData = useMemo(() => {
    const grouped: Record<string, any> = {};

    filteredData.forEach((row) => {
      const { month, type, value } = row;

      if (!grouped[month]) {
        grouped[month] = { month };
      }

      grouped[month][type] =
        (grouped[month][type] || 0) + Number(value);
    });

    return Object.values(grouped).sort((a: any, b: any) =>
      a.month.localeCompare(b.month)
    );
  }, [filteredData]);

  return (
    <div style={{ padding: '24px' }}>
      <Row align="middle" gutter={15}>
        <Col flex="auto" style={{ maxWidth: '111px' }}>
          <MenuComp/>
        </Col>
        <Col>
          <strong>Отчёты по доходам</strong>
        </Col>
      </Row>
      <Row align="middle" gutter={15}>
        <Col flex="auto" style={{ maxWidth: '500px', marginTop: '10px' }}>
          <PaymentProgreesBar
            setIsPaymentModal={setIsModalPayment}
            isPaymentModal={isModalPayment}
          />
        </Col>
      </Row>
      <div style={{ width: '100%' }}>
        <div style={{ marginTop: '16px' }}>
          <Divider contentPosition='left' style={{
              color: '#1677ff',
              borderColor: '#98bff6ff',
          }}>Платежи</Divider>
          <SummaryRow label="Аренда" value={sums.payment} type="success" />
          <br/>
          <SummaryRow label="Склад" value={sums.storage} type="success" />
          <br/>
          <SummaryRow label="Итого" value={sums.payment + sums.storage} type="success" />
          <br/>
          <SummaryRow label="Расходы" value={sums.expenses} type="danger" />
          <br/>
          <SummaryRow label="Прибыль" value={(sums.payment + sums.storage) - sums.expenses} type="success" />
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={20}
            axisLine={false}
            tickFormatter={(value) => {
              const date = new Date(value + "-01")

              const year = date.getFullYear().toString().slice(2)
              const month = date
                .toLocaleString("ru-RU", { month: "short" })
                .slice(0, 3)

              return `${month} ${year}`
            }}
            angle={-90}
            tick={({ x, y, payload }) => {
              const date = new Date(payload.value + "-01")
              const year = date.getFullYear().toString().slice(2)
              const month = date.toLocaleString("ru-RU", { month: "short" }).slice(0, 3)
              return (
                <text
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={12}
                  fill="#1f2937"
                  transform={`rotate(-90, ${x}, ${y})`}
                >
                  {`${month} ${year}`}
                </text>
              )
            }}
          />
          <Legend
            verticalAlign="bottom"
            wrapperStyle={{ paddingTop: "25px" }}
            formatter={(value) => (
              <span style={{ color: "#1f2937", fontSize: 14 }}>
                {value}
              </span>
            )}
          />
          <Bar dataKey="Аренда" name="Аренда" fill="#98bff6">
            <LabelList
              position="top"
              fill="#1f2937"
              fontSize={10}
              formatter={(value) =>
                Math.round(Number(value) / 1000).toLocaleString("ru-RU")
              }
            />
          </Bar>

          <Bar dataKey="Склад" name="Склад" fill="#4f46e5">
            <LabelList
              position="top"
              fill="#1f2937"
              fontSize={10}
              formatter={(value) =>
                Math.round(Number(value) / 1000).toLocaleString("ru-RU")
              }
            />
          </Bar>

          <Bar dataKey="Расход" name="Расход" fill="#e0b1b3">
            <LabelList
              position="top"
              fill="#1f2937"
              fontSize={10}
              formatter={(value) =>
                Math.round(Number(value) / 1000).toLocaleString("ru-RU")
              }
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div style={{ width: '100%' }}>
        <div style={{ marginTop: '25px' }}>
          <Divider contentPosition='left' style={{
              color: '#1677ff',
              borderColor: '#98bff6ff',
          }}>Депозиты</Divider>
          <SummaryRow label="Депозиты" value={sums.deposit} type="warning" />
          <br/>
          <SummaryRow label="Депозит возврат" value={sums.depositReturn} type="danger" />
          <br/>
          <SummaryRow label="Разница" value={sums.deposit - sums.depositReturn} type="success" />
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={20}
            axisLine={false}
            tickFormatter={(value) => {
              const date = new Date(value + "-01")

              const year = date.getFullYear().toString().slice(2)
              const month = date
                .toLocaleString("ru-RU", { month: "short" })
                .slice(0, 3)

              return `${month} ${year}`
            }}
            angle={-90}
            tick={({ x, y, payload }) => {
              const date = new Date(payload.value + "-01")
              const year = date.getFullYear().toString().slice(2)
              const month = date.toLocaleString("ru-RU", { month: "short" }).slice(0, 3)
              return (
                <text
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={12}
                  fill="#1f2937"
                  transform={`rotate(-90, ${x}, ${y})`}
                >
                  {`${month} ${year}`}
                </text>
              )
            }}
          />
          <Legend
            verticalAlign="bottom"
            wrapperStyle={{ paddingTop: "30px" }}
            formatter={(value) => (
              <span style={{ color: "#1f2937", fontSize: 14 }}>
                {value}
              </span>
            )}
          />
          <Bar dataKey="Депозит" name="Депозит" fill="#98bff6">
            <LabelList
              position="top"
              fill="#1f2937"
              fontSize={10}
              formatter={(value) =>
                Math.round(Number(value) / 1000).toLocaleString("ru-RU")
              }
            />
          </Bar>

          <Bar dataKey="Депозит возврат" name="Депозит возврат" fill="#4f46e5">
            <LabelList
              position="top"
              fill="#1f2937"
              fontSize={10}
              formatter={(value) =>
                Math.round(Number(value) / 1000).toLocaleString("ru-RU")
              }
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div style={{ width: '100%' }}>
        <div style={{ marginTop: '30px' }}>
          <Divider contentPosition='left' style={{
              color: '#1677ff',
              borderColor: '#98bff6ff',
          }}>Коммунальные платежи</Divider>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={20}
            axisLine={false}
            tickFormatter={(value) => {
              const date = new Date(value + "-01")

              const year = date.getFullYear().toString().slice(2)
              const month = date
                .toLocaleString("ru-RU", { month: "short" })
                .slice(0, 3)

              return `${month} ${year}`
            }}
            angle={-90}
            tick={({ x, y, payload }) => {
              const date = new Date(payload.value + "-01")
              const year = date.getFullYear().toString().slice(2)
              const month = date.toLocaleString("ru-RU", { month: "short" }).slice(0, 3)
              return (
                <text
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={12}
                  fill="#1f2937"
                  transform={`rotate(-90, ${x}, ${y})`}
                >
                  {`${month} ${year}`}
                </text>
              )
            }}
          />
          <Legend
            verticalAlign="bottom"
            wrapperStyle={{ paddingTop: "25px" }}
            formatter={(value) => (
              <span style={{ color: "#1f2937", fontSize: 14 }}>
                {value}
              </span>
            )}
          />
          <Bar dataKey="Комм. Алатау" name="Комм. Алатау" fill="#98bff6">
            <LabelList
              position="top"
              fill="#1f2937"
              fontSize={10}
              formatter={(value) =>
                Math.round(Number(value) / 1000).toLocaleString("ru-RU")
              }
            />
          </Bar>

          <Bar dataKey="Комм. Павленко" name="Комм. Павленко" fill="#4f46e5">
            <LabelList
              position="top"
              fill="#1f2937"
              fontSize={10}
              formatter={(value) =>
                Math.round(Number(value) / 1000).toLocaleString("ru-RU")
              }
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

