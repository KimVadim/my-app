import React, { useState, useMemo, useEffect } from 'react';
import { Col, Menu, Row, Select, Typography } from 'antd';
import type { MenuProps } from 'antd';
import { Line } from '@ant-design/charts';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store.ts';
import { getMonthPaymentData } from '../service/appServiceBackend.ts';
import { ExpensesTypes, PaymentTypes } from '../constants/appConstant.ts';
import { PaymentProgreesBar } from '../components/PaymentProgressBar.tsx';
import { CapsuleTabs, Divider } from 'antd-mobile'
import { SettingOutlined } from '@ant-design/icons';

const { Option } = Select;
type MenuItem = Required<MenuProps>['items'][number];
const menuItems: MenuItem[] = [
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
          { label: 'Склады', key: '/storage' },
        ],
      },
      {
        type: 'group',
        label: 'Отчеты',
        children: [
          { label: 'Отчеты', key: '/incomereport', disabled: true },
        ],
      },
    ],
  },
];

const { Text } = Typography;

export const IncomeReport: React.FC = () => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const [current, setCurrent] = useState('line');
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

  const ensureAllTypes = (PaymentTypes: any) => {
    return Array.from(new Set(filteredData.map((item) => item.month))).flatMap((month) =>
      PaymentTypes.map((type) => {
        const existing = filteredData.find((item) => item.month === month && item.type === type);
        return {
          month,
          type,
          value: Number(existing?.value ?? 0),
        };
      })
    );
  };

  const onClick: MenuProps['onClick'] = (e) => {
    setCurrent(e.key);
    if (e.key) navigate(e.key);
  };

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


  const createChartConfig = (data, types) => ({
    data: ensureAllTypes(types),
    xField: 'month',
    yField: 'value',
    seriesField: 'type',
    colorField: 'type',
    tooltip: false,
    xAxis: { label: { rotate: -45, offset: 10 } },
    yAxis: { label: { formatter: (value) => `${(value / 1000).toFixed(0)} KZT` } },
    point: {
      size: 10,
      shape: 'circle',
      style: ({ type }) => ({
        stroke: '#fff',
        lineWidth: 20,
        fillOpacity: 1,
        shadowBlur: 6,
        shadowColor: 'rgba(0,0,0,0.2)',
        ...(type === 'Аренда' && { fill: 'blue', size: 12 }),
        ...(type === 'Депозит' && { fill: 'green', size: 12 }),
      }),
    },
    label: {
      formatter: (datum: number) => (datum ? Math.trunc(datum / 1000) : ''),
      style: {
        fill: '#000',
        fontSize: 14,
        fontWeight: 700,
        stroke: '#fff',
        strokeWidth: 3,
        shadowColor: 'rgba(0,0,0,0.1)',
        shadowBlur: 3,
      },
      position: 'top',
      offsetY: -20,
      layout: [{ type: 'interval-hide-overlap' }],
    },
  });

  const chartConfig = {
    income: createChartConfig(filteredData, PaymentTypes),
    expenses: createChartConfig(filteredData, ExpensesTypes),
  };

  const SummaryRow: React.FC<{ label: string; value: number; type?: "success" | "warning" | "danger" }> = ({ label, value, type }) => (
    <Text type={type}>{`${label}: ${formatCurrency(value)}`}</Text>
  );
  return (
    <div style={{ padding: '24px' }}>
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
          <strong>Отчёт по доходам</strong>
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
      <div style={{ marginBottom: '7px', marginTop: '10px' }}>
        <Select
          placeholder="Фильтр по месяцу"
          style={{ width: 200 }}
          allowClear
          onChange={(value) => setSelectedMonth(value)}
          value={selectedMonth}
        >
          <Option key="last12months" value="last12months">
            Последние 12 мес.
          </Option>
          <Option key="last6months" value="last6months">
            Последние 6 мес.
          </Option>
          <Option key="last3months" value="last3months">
            Последние 3 мес.
          </Option>
        </Select>
      </div>

      <CapsuleTabs>
        <CapsuleTabs.Tab title='Доходы' key='fruits'>
          <div style={{ width: '100%' }}>
            <Line {...chartConfig.income} />
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
        </CapsuleTabs.Tab>
        <CapsuleTabs.Tab title='Расходы' key='vegetables' >
          <div style={{ width: '100%' }}>
            <Line {...chartConfig.expenses} />
            <div style={{ marginTop: '16px'}}>
              <SummaryRow label="Расходы" value={sums.expenses} type="danger" />
              <br/>
              <SummaryRow label="Комм. Алатау" value={sums.serviceAlatau} type="warning" />
              <br/>
              <SummaryRow label="Комм. Павленко" value={sums.servicePavlenko} type="warning" />
            </div>
          </div>

        </CapsuleTabs.Tab>
      </CapsuleTabs>
    </div>
  );
};