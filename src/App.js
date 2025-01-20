import './App.css';
import './styles/responsive.css';
import Router from './shared/Router';

// if (process.env.NODE_ENV === 'development') {
//   // 개발 환경에서만 import
//   import('./mocks/browser').then(({ worker }) => {
//     worker.start({ onUnhandledRequest: 'bypass', quiet: false });
//   });
// }

function App() {
  return <Router />;
}

export default App;
