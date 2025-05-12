import { useEffect } from 'react';

const loadScript = (src: string) => {
  const script = document.createElement('script');
  script.src = src;
  script.async = true;
  document.body.appendChild(script);
};

export const LoadExternalScripts = () => {
  useEffect(() => {
    loadScript('https://unpkg.com/react@17/umd/react.production.min.js');
    loadScript('https://unpkg.com/react-dom@17/umd/react-dom.production.min.js');
    loadScript('https://unpkg.com/@ant-design/charts@1.0.5/dist/charts.min.js');
    loadScript('https://unpkg.com/@ant-design/charts@1.0.5/dist/charts_g6.min.js');

    return () => {
      // Можно удалить скрипты при размонтировании, если нужно
    };
  }, []);

  return null; // Этот компонент просто загружает скрипты
};
