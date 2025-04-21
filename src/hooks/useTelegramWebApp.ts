import { useState, useEffect } from 'react';
import { ParsedReceipt, TelegramWebApp, TelegramUser, UseTelegramWebAppResult } from '../types/types';


export const useTelegramWebApp = (): UseTelegramWebAppResult => {
  const [webApp, setWebApp] = useState<TelegramWebApp>();
  const [receipt, setReceipt] = useState<ParsedReceipt>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const closeWebApp = (data?: {
    receipt: ParsedReceipt;
    totals?: Array<{
      user: string;
      amount: number;
      phone?: string;
      items?: Array<{
        id: string;
        name: string;
        quantity: number;
        price: number;
        total: number;
      }>;
    }>;
  }) => {
    if (!webApp) return;
    
    try {
      if (data) {
        webApp.sendData(JSON.stringify(data));
      } else {
        webApp.sendData(JSON.stringify({ status: 'completed' }));
      }
    } catch (e) {
      console.error('Failed to send data:', e);
      webApp.showAlert('Failed to save results');
    } finally {
      webApp.close();
    }
  };

  useEffect(() => {
    const tgWebApp = (window as any).Telegram?.WebApp as TelegramWebApp | undefined;
    
    if (!tgWebApp) {
      setError('Telegram WebApp environment not detected');
      setIsLoading(false);
      return;
    }

    tgWebApp.expand();
    tgWebApp.ready();
    setWebApp(tgWebApp);

    const loadReceiptData = () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const receiptParam = urlParams.get('receipt');
        
        if (receiptParam) {
          const parsed = JSON.parse(receiptParam) as ParsedReceipt;
          setReceipt(parsed);
          setIsLoading(false);
          return;
        }

        const webAppData = tgWebApp.initDataUnsafe?.web_app_data?.data;
        if (webAppData) {
          const parsed = JSON.parse(webAppData) as ParsedReceipt;
          setReceipt(parsed);
        } else {
          setError('No receipt data provided');
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to parse receipt data');
      } finally {
        setIsLoading(false);
      }
    };

    loadReceiptData();

    return () => {

    };
  }, []);

  return { 
    webApp, 
    receipt, 
    isLoading, 
    error, 
    closeWebApp
  };
};