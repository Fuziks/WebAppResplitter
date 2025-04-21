import './styles.css';
import { ItemSelection } from './components/ItemSelection';
import { useTelegramWebApp } from './hooks/useTelegramWebApp';

export default function App() {
  const { webApp, receipt, isLoading, error, closeWebApp } = useTelegramWebApp();

  return (
    <div>
      <ItemSelection 
        webApp={webApp}
        receipt={receipt}
        isLoading={isLoading}
        error={error}
        closeWebApp={closeWebApp}
      />
    </div>
  );
}