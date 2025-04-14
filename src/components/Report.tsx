import React, { useState, useMemo } from 'react';
import { Col, Menu, Row, Select, Button } from 'antd';
import type { MenuProps } from 'antd';
import { Pie, Column, Line } from '@ant-design/charts';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { menuItems } from './Opportunity.tsx';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const { Option } = Select;

const items: MenuProps['items'] = [
  { label: 'Колонки', key: 'column' },
  { label: 'Круговая диаграмма', key: 'pie' },
  { label: 'Линия', key: 'line' },
];

const groupedData = [
  { year: '01-2025', type: 'Аренда', value: 10000 },
  { year: '01-2025', type: 'Услуги', value: 50000 },
  { year: '02-2025', type: 'Аренда', value: 110000 },
  { year: '02-2025', type: 'Услуги', value: 55000 },
  { year: '03-2025', type: 'Аренда', value: 120000 },
  { year: '03-2025', type: 'Услуги', value: 60000 },
  { year: '04-2025', type: 'Аренда', value: 130000 },
  { year: '04-2025', type: 'Услуги', value: 65000 },
];

export const IncomeReport: React.FC = () => {
  const [current, setCurrent] = useState('column');
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const navigate = useNavigate();

  const filteredData = selectedMonth
    ? groupedData.filter((item) => item.year === selectedMonth)
    : groupedData;

  const months = Array.from(new Set(groupedData.map((item) => item.year)));

  const ensureAllTypes = () => {
    const allTypes = ['Аренда', 'Услуги'];
    const result: typeof groupedData = [];
    const uniqueYears = Array.from(new Set(filteredData.map((item) => item.year)));
    uniqueYears.forEach((year) => {
      allTypes.forEach((type) => {
        const existing = filteredData.find((item) => item.year === year && item.type === type);
        result.push(existing ?? { year, type, value: 0 });
      });
    });
    return result;
  };

  const finalData = ensureAllTypes();
  console.log('Final Data:', JSON.stringify(finalData, null, 2));

  const computePieData = () => {
    const aggregated = filteredData.reduce((acc: Record<string, number>, curr) => {
      acc[curr.type] = (acc[curr.type] || 0) + curr.value;
      return acc;
    }, {});
    return Object.entries(aggregated).map(([type, value]) => ({ type, value }));
  };

  const pieDataDynamic = useMemo(() => computePieData(), [filteredData]);

  const totalSum = useMemo(() =>
    filteredData.reduce((sum, item) => sum + item.value, 0), [filteredData]);

  const COLORS = ['#5B8FF9', '#5AD8A6'];

  const chartConfig: Record<string, any> = {
    column: {
      data: finalData,
      isGroup: true,
      xField: 'year',
      yField: 'value',
      seriesField: 'type',
      columnWidthRatio: 0.6,
      legend: { position: 'top' },
      color: COLORS,
      colorField: 'type',
      tooltip: {
        showMarkers: false,
        formatter: (datum: any) => ({
          name: datum.type,
          value: datum.value ? new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'KZT' }).format(datum.value) : '0 KZT',
        }),
      },
      interactions: [{ type: 'element-active' }],
      yAxis: {
        label: {
          formatter: (value: number) => new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'KZT' }).format(value),
        },
      },
      state: {
        active: {
          style: {
            shadowBlur: 4,
            stroke: '#000',
            fill: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
      label: {
        position: 'top',
        layout: [
          { type: 'interval-adjust-position' },
          { type: 'adjust-color' },
        ],
        style: {
          fill: '#000',
          fontSize: 12,
          fontWeight: 500,
        },
        formatter: (datum: { value: number | string }) => {
          const value = Number(datum.value);
          return isNaN(value) ? '0 KZT' : new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'KZT',
            maximumFractionDigits: 0,
          }).format(value);
        },
      },
    },
    pie: {
      data: pieDataDynamic,
      angleField: 'value',
      colorField: 'type',
      color: COLORS,
      radius: 0.9,
      label: {
        formatter: (data: { type?: string; value?: number }) => {
          if (!data) return '';
          const { type, value } = data;
          return `${type}: ${new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'KZT' }).format(value ?? 0)}`;
        },
        style: {
          fontSize: 14,
          textAlign: 'center',
        },
      },
      interactions: [{ type: 'element-active' }],
    },
    line: {
      data: filteredData,
      xField: 'year',
      yField: 'value',
      seriesField: 'type',
      color: COLORS,
      colorField: 'type',
      point: {
        size: 5,
        shape: 'circle',
      },
      tooltip: {
        formatter: (datum) => ({
          name: datum.type,
          value: datum.value,
        }),
        showMarkers: true,
        showContent: true,
        position: 'right',
        showCrosshairs: true,
      },
    },
  };

  const chartMap: Record<string, JSX.Element> = {
    column: <Column {...chartConfig.column} />,
    pie: <Pie {...chartConfig.pie} />,
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
        items={items}
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
          {months.map((month) => (
            <Option key={month} value={month}>
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

      <Button disabled onClick={exportToExcel} style={{ marginTop: 16 }}>
        Экспорт в Excel
      </Button>
    </div>
  );
};
