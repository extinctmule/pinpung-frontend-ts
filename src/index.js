import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { setupRequestInterceptor } from './api/interceptors';
import GlobalStyle from './styles/GlobalStyles';
//import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';

setupRequestInterceptor();

const root = ReactDOM.createRoot(document.getElementById('root'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 데이터가 신선한 상태로 유지되는 시간 (5분)
      cacheTime: 30 * 60 * 1000, // 캐시가 유지되는 시간 (30분)
      refetchOnWindowFocus: false, // 윈도우 포커스 시 재요청 여부
    },
  },
});

root.render(
  // <React.StrictMode>
  <QueryClientProvider client={queryClient}>
    <GlobalStyle />
    <App />
  </QueryClientProvider>,
  // </React.StrictMode>,
);

//serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
