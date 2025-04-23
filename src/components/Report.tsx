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

  const chartConfig: Record<string, any> = {
    line: {
      data: completedData,
      xField: 'month',
      yField: 'value',
      seriesField: 'type',
      colorField: 'type',
      color: ['red', 'blue', 'green'],
      point: {
        size: 1,
        shape: 'circle',
        style: () => ({
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
        formatter: (datum: any) => ({
          name: datum.type, // Название серии (тип платежа)
          value: new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'KZT',
            maximumFractionDigits: 0,
          }).format(datum.value), // Форматируем значение
        }),
        // Кастомизация стилей tooltip
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
        // Дополнительные настройки
        showTitle: true, // Показывать заголовок (например, месяц)
        title: (title: string) => title, // Можно настроить заголовок, например, форматировать месяц
        showMarkers: true, // Показывать маркеры в tooltip
        //showCrosshairs: true, // Показывать перекрестие
        crosshairs: {
          type: 'x', // Перекрестие по оси X
          line: {
            style: {
              stroke: '#000',
              lineWidth: 1,
              opacity: 0.5,
            },
          },
        },
        customContent: (title: string, data: any[]) => {
          // Фильтруем данные, чтобы отображать только "Аренда" и "Депозит"
          const filteredData = data.filter((item) => item.name === 'Аренда' || item.name === 'Депозит');
          console.log(filteredData);
          // Если нет данных для "Аренда" или "Депозит", возвращаем сообщение
          if (filteredData.length === 0) {
            return `
              <div style="padding: 8px;">
                <div>Нет данных для Аренда или Депозит</div>
              </div>
            `;
          }
      
          // Формируем HTML для tooltip
          return `
            <div style="padding: 8px;">
              <h4>${title}</h4>
              <ul>
                ${filteredData
                  .map(
                    (item) =>
                      `<li>${item.name}: ${new Intl.NumberFormat('ru-RU', {
                        style: 'currency',
                        currency: 'KZT',
                        maximumFractionDigits: 0,
                      }).format(item.value)}</li>`
                  )
                  .join('')}
              </ul>
            </div>
          `;
        },
      }
    },
  };

  const chartMap: Record<string, React.JSX.Element> = {
    line: <Line {...chartConfig.line} />,
  };

  const onClick: MenuProps['onClick'] = (e) => {
    setCurrent(e.key);
    if (e.key) navigate(e.key);
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