import { Box, Typography, Checkbox, FormControlLabel, Chip, TextField, MenuItem, Divider } from '@mui/material';
import { ReceiptItem as ReceiptItemType, ReceiptItemProps } from '../types/types';

export const ReceiptItem = ({item,selected,onToggle,users,selectedUsers,onUserSelect,onShareChange,userShares,totalShares}: ReceiptItemProps) => {
  const getAvailablePortions = (currentUser: string) => {
    if (item.quantity === 1) {
      return [
        { value: 0.25, label: '¼ порции' },
        { value: 0.33, label: '⅓ порции' },
        { value: 0.5, label: '½ порции' },
        { value: 0.75, label: '¾ порции' },
        { value: 1, label: 'Всю порцию' }
      ];
    } else {
      const currentUserShare = userShares[currentUser] || 0;
      const remaining = item.quantity - (totalShares - currentUserShare);
      
      return [
        { value: 0, label: 'Не ел' },
        ...Array.from({ length: Math.min(remaining, item.quantity) }, (_, i) => ({
          value: i + 1,
          label: `${i + 1} порция`
        }))
      ];
    }
  };

  return (
    <Box border={1} borderColor="#e0e0e0" borderRadius={1} p={2} mb={2}>
      <FormControlLabel
        control={
          <Checkbox 
            checked={selected} 
            onChange={() => onToggle()}
          />
        }
        label={
          <Box width="100%">
            <Typography fontWeight="bold">
              {item.name} {item.quantity > 1 && `(x${item.quantity})`}
            </Typography>
            <Typography color="text.secondary">
              {item.price.toFixed(2)} ₽ × {item.quantity} = {(item.price * item.quantity).toFixed(2)} ₽
            </Typography>
            {selected && item.quantity > 1 && (
              <Typography variant="caption">
                Доступно: {item.quantity - totalShares} из {item.quantity} порций
              </Typography>
            )}
          </Box>
        }
      />

      {selected && (
        <Box mt={2}>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="subtitle2">Распределение:</Typography>
          
          {users.map(user => (
            <Box key={user} display="flex" alignItems="center" gap={1} mb={1}>
              <Chip
                label={user}
                onClick={() => onUserSelect(user)}
                color={selectedUsers.includes(user) ? 'primary' : 'default'}
              />
              
              {selectedUsers.includes(user) && (
                <TextField
                  select
                  size="small"
                  value={userShares[user] || 0}
                  onChange={(e) => {
                    const newValue = Number(e.target.value);
                    if (item.quantity === 1 || newValue === 0 || 
                        (totalShares - (userShares[user] || 0) + newValue <= item.quantity)) {
                      onShareChange(user, newValue);
                    }
                  }}
                  sx={{ width: 160 }}
                >
                  {getAvailablePortions(user).map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};
