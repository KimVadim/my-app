import React, { useState, useMemo, useEffect } from 'react';
import { Col, Menu, Row, Select, Typography } from 'antd';
import type { MenuProps } from 'antd';
import { Line } from '@ant-design/charts';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store.ts';
import { getMonthPaymentData } from '../service/appServiceBackend.ts';
import { ExpensesTypes, PaymentTypes } from '../constants/appConstant.ts';
import { PaymentProgreesBar } from './PaymentProgressBar.tsx';
import { CapsuleTabs } from 'antd-mobile'
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
        ],
      },
      {
        type: 'group',
        label: 'Отчеты',
        children: [
          { label: 'Отчеты', key: '/incomereport', disabled: true, },
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
  const [selectedMonth, setSelectedMonth] = useState<string | null>('last6months');
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
  const months = Array.from(new Set(memoizedMonthPaymentData.map((item) => item.month)));
  const getLastSixMonths = () =>
    [...Array(6)].map((_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    });

  const filteredData = useMemo(() => {
    if (selectedMonth === 'last6months') {
      const lastSixMonths = getLastSixMonths();
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
  const paymentSum = useMemo(() => filteredData.filter((x) => x.type === 'Аренда').reduce((sum, item) => sum + Number(item.value), 0), [filteredData]);
  const depositSum = useMemo(() => filteredData.filter((x) => x.type === 'Депозит').reduce((sum, item) => sum + Number(item.value), 0), [filteredData]);
  const depositReturnSum = useMemo(() => filteredData.filter((x) => x.type === 'Депозит возврат').reduce((sum, item) => sum + Number(item.value), 0), [filteredData]);
  const chartConfig: Record<string, any> = {
    line: {
      data: ensureAllTypes(PaymentTypes),
      xField: 'month',
      yField: 'value',
      seriesField: 'type',
      colorField: 'type',
      tooltip: false,
      xAxis: {
        label: {
          rotate: -45,
          offset: 10,
        },
      },
      yAxis: {
        label: {
          formatter: (value) => `${(value / 1000).toFixed(0)} KZT`,
        },
      },
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
          ...(type === 'Депозит' && { fill: 'green', size: 12 })
        }),
      },
      label: {
        formatter: (datum: number) => {
          if (!datum || datum === undefined) return '';
          return new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'KZT',
            maximumFractionDigits: 0,
          }).format(datum / 1000);
        },
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
    },
    lineExpenses: {
      data: ensureAllTypes(ExpensesTypes),
      xField: 'month',
      yField: 'value',
      seriesField: 'type',
      colorField: 'type',
      tooltip: false,
      xAxis: {
        label: {
          rotate: -45,
          offset: 10,
        },
      },
      yAxis: {
        label: {
          formatter: (value) => `${(value / 1000).toFixed(0)} KZT`,
        },
      },
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
          ...(type === 'Депозит' && { fill: 'green', size: 12 })
        }),
      },
      label: {
        formatter: (datum: number) => {
          if (!datum || datum === undefined) return '';
          return new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'KZT',
            maximumFractionDigits: 0,
          }).format(datum / 1000);
        },
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
    },
  };

  const chartMap: Record<string, React.JSX.Element> = {
    line: <Line {...chartConfig.line} />,
  };

  const chartMap2: Record<string, React.JSX.Element> = {
    line: <Line {...chartConfig.lineExpenses} />,
  };

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
          <Option key="last6months" value="last6months">
            Последние 6 мес.
          </Option>
          {months.map((month) => (
            <Option key={String(month)} value={String(month)}>
              {month}
            </Option>
          ))}
        </Select>
      </div>

      <CapsuleTabs>
        <CapsuleTabs.Tab title='Доходы' key='fruits'>
          {chartMap[current]}
          <div style={{ marginTop: '16px' }}>
            <Text type="success">{`Доходы: ${new Intl.NumberFormat('ru-RU', {
                style: 'currency',
                currency: 'KZT',
              }).format(paymentSum)}`}
            </Text>
            <br/><Text type="warning">{`Депозит: ${new Intl.NumberFormat('ru-RU', {
                style: 'currency',
                currency: 'KZT',
              }).format(depositSum)}`}
            </Text>
            <br/><Text type="danger">{`Депозит возврат: ${new Intl.NumberFormat('ru-RU', {
                style: 'currency',
                currency: 'KZT',
              }).format(depositReturnSum)}`}
            </Text>
          </div>
        </CapsuleTabs.Tab>
        <CapsuleTabs.Tab title='Расходы' key='vegetables'>
          {chartMap2[current]}
        </CapsuleTabs.Tab>
      </CapsuleTabs>

    </div>
  );
};
