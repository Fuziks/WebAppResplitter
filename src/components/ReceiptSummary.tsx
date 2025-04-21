import { ParsedReceipt, UserSelection, Props} from '../types/types';
import { Box, Typography, Divider } from '@mui/material';


export default function ReceiptSummary({ receipt, selections }: Props) {
  const totalAmount = selections.reduce((sum, sel) => sum + sel.amount, 0);

  return (
    <Box sx={{ maxWidth: 600, margin: '0 auto', p: 2 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
        Итоговое распределение
      </Typography>
      
      <Box sx={{ 
        background: '#f5f5f5', 
        p: 2, 
        borderRadius: 2, 
        mb: 3 
      }}>
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
          Детали чека
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          {receipt.receiptNumber && (
            <Typography variant="body2">Номер чека: {receipt.receiptNumber}</Typography>
          )}
          {receipt.date && receipt.time && (
            <Typography variant="body2">
              Дата и время: {receipt.date} {receipt.time}
            </Typography>
          )}
          {receipt.waiter && (
            <Typography variant="body2">Официант: {receipt.waiter}</Typography>
          )}
        </Box>
        
        <Divider sx={{ my: 1 }} />
        
        <Box sx={{ mb: 1 }}>
          {receipt.items.map((item, index) => (
            <Box 
              key={index} 
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                mb: 1
              }}
            >
              <Typography variant="body2">
                {item.name} {item.quantity > 1 && `×${item.quantity}`}
              </Typography>
              <Typography variant="body2">
                {(item.price * item.quantity).toFixed(2)} ₽
              </Typography>
            </Box>
          ))}
        </Box>
        
        <Divider sx={{ my: 1 }} />
        
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          fontWeight: 'bold'
        }}>
          <Typography>Общая сумма:</Typography>
          <Typography>{receipt.total.toFixed(2)} ₽</Typography>
        </Box>
      </Box>

      <Box sx={{ 
        background: '#e8f5e9', 
        p: 2, 
        borderRadius: 2, 
        mb: 2 
      }}>
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
          Распределение
        </Typography>
        
        <Box sx={{ mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Всего распределено: {totalAmount.toFixed(2)} ₽ из {receipt.total.toFixed(2)} ₽
          </Typography>
        </Box>
        
        <Divider sx={{ my: 1 }} />
        
        {selections.map((selection, index) => (
          <Box 
            key={index} 
            sx={{ 
              background: 'white',
              p: 2,
              mb: 2,
              borderRadius: 2,
              boxShadow: 1
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              mb: 1
            }}>
              <Typography variant="subtitle1" fontWeight="bold">
                {selection.user}
              </Typography>
              <Typography variant="subtitle1" color="primary" fontWeight="bold">
                {selection.amount.toFixed(2)} ₽
              </Typography>
            </Box>
            
            {selection.phone && (
              <Typography variant="body2" sx={{ mb: 1 }}>
                Телефон: {selection.phone}
              </Typography>
            )}
            
            <Box sx={{ mt: 1 }}>
              {selection.items.map((item, i) => (
                <Box 
                  key={i} 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    mb: 0.5
                  }}
                >
                  <Typography variant="body2">
                    - {item.name}: {item.quantity} {item.quantity === 1 ? 'порция' : 'порции'}
                  </Typography>
                  <Typography variant="body2">
                    {item.total.toFixed(2)} ₽
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}