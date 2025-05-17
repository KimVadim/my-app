import React, { useState, useMemo, useEffect } from 'react';
import { Col, Menu, Row, Select } from 'antd';
import type { MenuProps } from 'antd';
import { Line } from '@ant-design/charts';
import { useNavigate } from 'react-router-dom';
import { menuItems } from './Opportunity.tsx';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store.ts';
import { getMonthPaymentData } from '../service/appServiceBackend.ts';
import { ItemsReport } from '../constants/dictionaries.ts';
import { PaymentTypes } from '../constants/appConstant.ts';

const { Option } = Select;

export const IncomeReport: React.FC = () => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const [current, setCurrent] = useState('line');
  const [selectedMonth, setSelectedMonth] = useState<string | null>('last6months');
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
  
  const ensureAllTypes = () => {
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
  
  const totalSum = useMemo(() => filteredData.reduce((sum, item) => sum + Number(item.value), 0), [filteredData]);
  const completedData = ensureAllTypes();
  const chartConfig: Record<string, any> = {
    line: {
      data: completedData,
      xField: 'month',
      yField: 'value',
      seriesField: 'type',
      colorField: 'type',
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
          lineWidth: 2,
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
      tooltip: {
        formatter: (datum: any) => {
          if (!['Аренда', 'Депозит'].includes(datum.type)) return null;
          return {
            name: datum.type,
            value: new Intl.NumberFormat('ru-RU', {
              style: 'currency',
              currency: 'KZT',
              maximumFractionDigits: 0,
            }).format(datum.value),
          };
        },
        domStyles: {
          'g2-tooltip': {
            background: '#fff',
            borderRadius: '4px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            padding: '8px 12px',
          },
          'g2-tooltip-title': {
            fontWeight: 'bold',
            marginBottom: '8px',
          },
          'g2-tooltip-list-item': {
            fontSize: '12px',
            color: '#333',
          },
        },
        showTitle: true,
        title: (title: string) => title,
        showMarkers: true,
        crosshairs: {
          type: 'x',
          line: {
            style: {
              stroke: '#000',
              lineWidth: 2,
              opacity: 0.5,
            },
          },
        },
      }
    },
  };

  const chartMap: Record<string, React.JSX.Element> = {
    line: <Line {...chartConfig.line} />,
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

      <Menu
        onClick={(e) => setCurrent(e.key)}
        selectedKeys={[current]}
        mode="horizontal"
        items={ItemsReport}
        style={{ marginBottom: 16 }}
      />

      <div style={{ marginBottom: 16 }}>
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

      {chartMap[current]}

      <div style={{ marginTop: 16 }}>
        <strong>
          Итого:{' '}
          {new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'KZT',
          }).format(totalSum)}
        </strong>
      </div>
    </div>
  );
};