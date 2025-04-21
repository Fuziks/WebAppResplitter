import {  Box, Typography, Checkbox, FormControlLabel, Chip,TextField,MenuItem,Divider,Tooltip} from '@mui/material';
import { ReceiptItem as ReceiptItemType, ReceiptItemProps } from '../types/types';


export const ReceiptItem = ({
  item,
  selected,
  onToggle,
  users,
  selectedUsers,
  onUserSelect,
  onShareChange,
  userShares,
  totalShares
}: ReceiptItemProps) => {
  const totalPrice = item.price * item.quantity;

  const handleContainerClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onToggle();
    }
  };

  return (
    <Box 
      border={1} 
      borderColor="#e0e0e0" 
      borderRadius={1} 
      p={2} 
      mb={2}
      bgcolor={selected ? '#f5f5f5' : 'white'}
      sx={{ 
        position: 'relative',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
        '&:hover': {
          backgroundColor: selected ? '#eeeeee' : '#fafafa'
        }
      }}
      onClick={handleContainerClick}
    >
      <FormControlLabel
        control={
          <Checkbox 
            checked={selected} 
            onChange={(e) => {
              e.stopPropagation();
              onToggle();
            }}
            onClick={(e) => e.stopPropagation()}
            sx={{ 
              position: 'absolute',
              top: 8,
              left: 8,
              pointerEvents: 'auto'
            }}
          />
        }
        label={
          <Box width="100%" pl={3}>
            <Typography variant="body1" fontWeight="bold">
              {item.name} {item.quantity > 1 && `(x${item.quantity})`}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {item.price.toFixed(2)} ₽ × {item.quantity} = {totalPrice.toFixed(2)} ₽
            </Typography>
          </Box>
        }
        sx={{ 
          width: '100%', 
          alignItems: 'flex-start', 
          m: 0,
          pointerEvents: 'none'
        }}
      />

      {selected && users.length > 0 && (
        <Box mt={2} ml={1} onClick={(e) => e.stopPropagation()}>
          <Divider sx={{ mb: 1 }} />
          
          <Typography variant="caption" color="text.secondary" display="block" mb={1}>
            Распределение порций между участниками:
          </Typography>
          
          {item.quantity > 1 && (
            <Typography variant="caption" color={totalShares > item.quantity ? 'error' : 'text.secondary'} display="block" mb={1}>
              Распределено: {totalShares} из {item.quantity} порций
            </Typography>
          )}
          
          <Box display="flex" flexDirection="column" gap={1}>
            {users.map(user => (
              <Box key={user} display="flex" alignItems="center" gap={1}>
                <Tooltip title={user}>
                  <Chip
                    label={user.length > 10 ? `${user.substring(0, 8)}...` : user}
                    onClick={(e) => {
                      e.stopPropagation();
                      onUserSelect(user);
                    }}
                    color={selectedUsers.includes(user) ? 'primary' : 'default'}
                    size="small"
                    sx={{ 
                      maxWidth: 100,
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      pointerEvents: 'auto'
                    }}
                  />
                </Tooltip>
                
                {selectedUsers.includes(user) && (
                  <TextField
                    select
                    size="small"
                    value={userShares[user] || 0}
                    onChange={(e) => {
                      onShareChange(user, Number(e.target.value));
                    }}
                    onClick={(e) => e.stopPropagation()}
                    sx={{ width: 120 }}
                  >
                    {item.quantity > 1 ? (
                      <>
                        <MenuItem value={0}>Не ел</MenuItem>
                        {Array.from({ length: item.quantity }, (_, i) => (
                          <MenuItem 
                            key={i+1} 
                            value={i+1}
                            disabled={
                              totalShares - (userShares[user] || 0) + (i+1) > item.quantity
                            }
                          >
                            {i+1} порция ({(((i+1)/item.quantity)*100).toFixed(0)}%)
                          </MenuItem>
                        ))}
                      </>
                    ) : (
                      <>
                        <MenuItem value={0}>Не ел</MenuItem>
                        <MenuItem value={0.25}>¼ (25%)</MenuItem>
                        <MenuItem value={0.33}>⅓ (33%)</MenuItem>
                        <MenuItem value={0.5}>½ (50%)</MenuItem>
                        <MenuItem value={0.75}>¾ (75%)</MenuItem>
                        <MenuItem value={1}>1 (100%)</MenuItem>
                      </>
                    )}
                  </TextField>
                )}
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};