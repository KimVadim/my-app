import React, { useState, useMemo, useEffect } from 'react';
import { Col, Menu, Row, Select, Button } from 'antd';
import type { MenuProps } from 'antd';
import { Line } from '@ant-design/charts';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { menuItems } from './Opportunity.tsx';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store.ts';
import { getMonthPaymentData } from '../service/appServiceBackend.ts';
import { ItemsReport } from '../constants/dictionaries.ts';
import { PaymentTypes, ReportColors } from '../constants/appConstant.ts';

const { Option } = Select;

export const IncomeReport: React.FC = () => {
  const [current, setCurrent] = useState('line');
  const [selectedMonth, setSelectedMonth] = useState<string | null>('last6months');
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    try {
      getMonthPaymentData(dispatch);
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    }
  }, []);

  const monthPaymentData = useSelector((state: RootState) => state.monthPayment.monthPayments);

  // Функция для получения последних 6 месяцев
  const getLastSixMonths = () => {
    const months: string[] = [];
    const currentDate = new Date();
    for (let i = 0; i < 6; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const formattedMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      months.push(formattedMonth);
    }
    return months;
  };

  // Фильтрация данных
  const filteredData = useMemo(() => {
    if (selectedMonth === 'last6months') {
      const lastSixMonths = getLastSixMonths();
      return monthPaymentData.filter((item) => lastSixMonths.includes(item.month));
    } else if (selectedMonth) {
      return monthPaymentData.filter((item) => item.month === selectedMonth);
    }
    return monthPaymentData;
  }, [monthPaymentData, selectedMonth]);

  const months = Array.from(new Set(monthPaymentData.map((item) => item.month)));

  const ensureAllTypes = () => {
    const result: typeof monthPaymentData = [];
    const uniqueMonths = Array.from(new Set(filteredData.map((item) => item.month)));

    uniqueMonths.forEach((month) => {
      PaymentTypes.forEach((type) => {
        const existing = filteredData.find((item) => item.month === month && item.type === type);
        result.push({
          month,
          type,
          value: Number(existing?.value ?? 0),
        });
      });
    });

    return result;
  };

  const totalSum = useMemo(() =>
    filteredData.reduce((sum, item) => sum + Number(item.value), 0), [filteredData]);

  const completedData = ensureAllTypes();
  console.log(completedData)
  const chartConfig: Record<string, any> = {
    line: {
      data: completedData,
      xField: 'month',
      yField: 'value',
      seriesField: 'type',
      colorField: 'type',
      color: (type: string) => {
        const colorMap: Record<string, string> = {
          'Аренда': '#00A76F',
          'Депозит': '#FFC107',
          'Депозит возврат': '#FF5722',
        };
        return colorMap[type] || '#ccc';
      },
      point: {
        size: 1,
        shape: 'circle',
        style: (datum) => ({
          fill: (() => {
            const colorMap: Record<string, string> = {
              'Аренда': '#00A76F',
              'Депозит': '#FFC107',
              'Депозит возврат': '#FF5722',
            };
            return colorMap[datum.type] || '#ccc';
          })(),
          stroke: '#fff',
          lineWidth: 1,
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
          fontSize: 12,
          fontWeight: 700,
          stroke: '#fff',
          strokeWidth: 3,
          shadowColor: 'rgba(0,0,0,0.1)',
          shadowBlur: 3,
        },
        position: 'top',
        offsetY: -12,
        layout: [{ type: 'interval-hide-overlap' }],
      },
      tooltip: {
        customContent: (title, items) => {
          const month = title;
          const typesData = items.filter((item) => item.data.type !== 'Всего');
          const totalItem = items.find((item) => item.data.type === 'Всего');

          return `
            <div style="padding: 12px; background: #fff; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.15);">
              <div style="margin-bottom: 12px; font-size: 14px; font-weight: 600; color: #333;">${month}</div>
              ${typesData
                .map(
                  (item) => `
                <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 13px;">
                  <div style="display: flex; align-items: center;">
                    <span style="display: inline-block; width: 10px; height: 10px; background: ${item.color}; margin-right: 8px; border-radius: 50%;"></span>
                    ${item.name}
                  </div>
                  <div style="font-weight: 500;">${item.value}</div>
                </div>
              `
                )
                .join('')}
              <div style="display: flex; justify-content: space-between; margin-top: 8px; padding-top: 8px; border-top: 1px solid #eee; font-size: 14px; font-weight: 600;">
                <div>Всего:</div>
                <div>${totalItem?.value || '0'}</div>
              </div>
            </div>
          `;
        },
      },
    },
  };

  const chartMap: Record<string, React.JSX.Element> = {
    line: <Line {...chartConfig.line} />,
  };

  const renderChart = () => (
    <motion.div
      key={current}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      {chartMap[current]}
    </motion.div>
  );

  const onClick: MenuProps['onClick'] = (e) => {
    setCurrent(e.key);
    if (e.key) navigate(e.key);
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Доход');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'доход.xlsx');
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

      {renderChart()}

      <div style={{ marginTop: 16 }}>
        <strong>
          Итого:{' '}
          {new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'KZT',
          }).format(totalSum)}
        </strong>
      </div>

      <Button onClick={exportToExcel} style={{ marginTop: 16 }}>
        Экспорт в Excel
      </Button>
    </div>
  );
};