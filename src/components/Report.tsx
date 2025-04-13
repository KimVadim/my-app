import React, { useState, useMemo } from 'react';
import { Col, Menu, Row, Select } from 'antd';
import type { MenuProps } from 'antd';
import { Pie, Column, Line } from '@ant-design/charts';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { menuItems } from './Opportunity.tsx';
const { Option } = Select;

const items: MenuProps['items'] = [
  { label: 'Колонки', key: 'column' },
  { label: 'Круговая диаграмма', key: 'pie' },
];

const groupedData = [
  { year: '01-2025', type: 'Аренда', value: 100000 },
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

  // Обеспечиваем наличие всех типов в данных
  const ensureAllTypes = () => {
    const allTypes = ['Аренда', 'Услуги'];
    const result: typeof groupedData = [];
    const uniqueYears = Array.from(new Set(filteredData.map((item) => item.year)));
    uniqueYears.forEach((year) => {
      allTypes.forEach((type) => {
        const existing = filteredData.find((item) => item.year === year && item.type === type);
        result.push(existing || { year, type, value: 0 });
      });
    });
    return result;
  };

  const finalData = ensureAllTypes();

  const computePieData = () => {
    const aggregated = filteredData.reduce((acc, curr) => {
      acc[curr.type] = (acc[curr.type] || 0) + curr.value;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(aggregated).map(([type, value]) => ({ type, value }));
  };

  const pieDataDynamic = useMemo(() => computePieData(), [filteredData]);

  const chartConfig: Record<string, any> = {
    column: {
      data: finalData,
      isGroup: true,
      xField: 'year',
      yField: 'value',
      seriesField: 'type',
      columnWidthRatio: 0.6,
      legend: { position: 'top' },
      tooltip: {
        showMarkers: false,
        formatter: (datum: any) => ({
          name: datum.type,
          value: datum.value ? new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(datum.value) : '0 ₽',
        }),
      },
      interactions: [{ type: 'element-active' }], // Изменено с element-highlight
      yAxis: {
        label: {
          formatter: (value: number) => new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(value),
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
    },
    pie: {
      data: pieDataDynamic,
      angleField: 'value',
      colorField: 'type',
      radius: 0.9,
      label: {
        formatter: (data: { type?: string; value?: number }) => {
          if (!data) return ''; // Возвращаем пустую строку, если данных нет
          const { type, value } = data;
          return `${type}: ${new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(value ?? 0)}`;
        },
        style: {
          fontSize: 14,
          textAlign: 'center',
        },
      },
      interactions: [{ type: 'element-active' }],
    },
  };

  const renderChart = () => {
    const chart = current === 'pie' ? <Pie {...chartConfig.pie} /> : <Column {...chartConfig.column} />;

    return (
      <motion.div
        key={current}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
      >
        {chart}
      </motion.div>
    );
  };

  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e.key);
    setCurrent(e.key);
    if (e.key) {
      navigate(e.key)
    }
  };

  const data = [
    { year: '1991', value: 3 },
    { year: '1992', value: 4 },
    { year: '1993', value: 3.5 },
    { year: '1994', value: 5 },
    { year: '1995', value: 4.9 },
    { year: '1996', value: 6 },
    { year: '1997', value: 7 },
    { year: '1998', value: 9 },
    { year: '1999', value: 13 },
  ];
  const config = {
    data,
    height: 400,
    xField: 'year',
    yField: 'value',
    point: {
      size: 5,
      shape: 'circle',
    },
    tooltip: {
      formatter: (data) => {
        return {
          name: '',
          value: String,
        };
      },
      customContent: (name, data) =>
        `<div>${data?.map((item) => {
          return `<div class="tooltip-chart" >
              <span class="tooltip-item-name">${item?.name}</span>
              <span class="tooltip-item-value">${item?.value}</span>
            </div>`;
        })}</div>`,
      showMarkers: Boolean,
      showContent: Boolean,
      position: 'right | left',
      showCrosshairs: Boolean,
    },
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

      <Line {...config} />
    </div>
  );
};