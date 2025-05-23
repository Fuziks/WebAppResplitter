import { useState, useEffect } from 'react';
import { ReceiptItem } from './ReceiptItem';
import { TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Box, Typography, Pagination, Divider, Alert} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { ItemSelectionState, ItemSelectionProps } from '../types/types';
import '../styles.css';

export const ItemSelection = ({webApp,receipt,isLoading,error,closeWebApp}: ItemSelectionProps) => {
  const [users, setUsers] = useState<string[]>([]);
  const [selectedItems, setSelectedItems] = useState<Record<string, ItemSelectionState>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [newUserModalOpen, setNewUserModalOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [phoneModalOpen, setPhoneModalOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [distributionError, setDistributionError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  useEffect(() => {
    if (isLoading || !webApp) return;

    const tgUser = webApp.initDataUnsafe?.user;
    const defaultUser = tgUser?.username || 
      [tgUser?.first_name, tgUser?.last_name].filter(Boolean).join(' ');

    if (defaultUser) {
      setUsers([defaultUser]);
    }

    if (isFirstLoad) {
      setPhoneModalOpen(true);
      setIsFirstLoad(false);
    }
  }, [isLoading, webApp]);

  const formatPhoneNumber = (number: string) => {
    if (!number) return '';
    const clean = number.startsWith('+') 
      ? '+' + number.slice(1).replace(/\D/g, '')
      : number.replace(/\D/g, '');
    return clean;
  };

  const validatePhoneNumber = (number: string) => {
    const cleanNumber = formatPhoneNumber(number);
    const digitCount = cleanNumber.startsWith('+') 
      ? cleanNumber.length - 1 
      : cleanNumber.length;
    
    const isValidLength = digitCount >= 10 && digitCount <= 15;
    const isValidFormat = /^\+?\d+$/.test(cleanNumber);
    
    if (!isValidFormat) {
      setPhoneError('Номер должен содержать только цифры и может начинаться с +');
      return false;
    }
    
    if (!isValidLength) {
      setPhoneError(digitCount < 10 
        ? 'Номер должен содержать минимум 10 цифр' 
        : 'Номер должен содержать не более 15 цифр');
      return false;
    }
    
    setPhoneError('');
    setPhoneNumber(cleanNumber);
    return true;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const filteredValue = formatPhoneNumber(value);
    setPhoneNumber(filteredValue);
    validatePhoneNumber(filteredValue);
  };

  const toggleItem = (itemId: string) => {
    setSelectedItems(prev => {
      const newState = { ...prev };
      if (newState[itemId]) {
        delete newState[itemId];
      } else {
        newState[itemId] = { users: [], shares: {} };
      }
      return newState;
    });
    setDistributionError('');
  };

  const toggleUserForItem = (itemId: string, userId: string) => {
    setSelectedItems(prev => {
      const current = prev[itemId] || { users: [], shares: {} };
      const newUsers = current.users.includes(userId)
        ? current.users.filter(u => u !== userId)
        : [...current.users, userId];
      
      return {
        ...prev,
        [itemId]: {
          users: newUsers,
          shares: current.shares
        }
      };
    });
  };
  
  const updateUserShare = (itemId: string, userId: string, share: number) => {
    setSelectedItems(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        shares: {
          ...prev[itemId]?.shares,
          [userId]: share
        }
      }
    }));
  };

  const addUser = () => {
    if (newUserName && !users.includes(newUserName)) {
      setUsers(prev => [...prev, newUserName]);
      setNewUserName('');
      setNewUserModalOpen(false);
    }
  };

  const removeUser = (username: string) => {
    setUsers(prev => prev.filter(u => u !== username));
    setSelectedItems(prev => {
      const newState = { ...prev };
      for (const itemId in newState) {
        newState[itemId].users = newState[itemId].users.filter(u => u !== username);
        delete newState[itemId].shares[username];
        if (newState[itemId].users.length === 0) {
          delete newState[itemId];
        }
      }
      return newState;
    });
  };

  const checkDistribution = () => {
    if (!receipt) return true;
  
    for (const item of receipt.items) {
      const itemSelection = selectedItems[item.id];
      if (!itemSelection) continue;
      
      const totalShares = Object.values(itemSelection.shares).reduce((sum, share) => sum + share, 0);
      const maxAllowed = item.quantity === 1 ? 1 : item.quantity;
      
      if (totalShares > maxAllowed) {
        setDistributionError(`Для "${item.name}" распределено: ${totalShares} из ${maxAllowed}`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = () => {
    if (!receipt || !webApp) return;

    if (Object.keys(selectedItems).length === 0) {
      webApp.showAlert('Пожалуйста, выберите хотя бы одно блюдо');
      return;
    }

    if (!phoneNumber) {
      webApp.showAlert('Пожалуйста, укажите номер телефона для оплаты');
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      webApp.showAlert('Пожалуйста, введите корректный номер телефона');
      return;
    }

    if (!checkDistribution()) {
      return;
    }

    const userSelections = users.map(user => {
      const userItems = receipt.items
        .filter(item => {
          const itemSelection = selectedItems[item.id];
          return itemSelection?.users.includes(user);
        });
      
      const userAmount = userItems.reduce((sum, item) => {
        const share = selectedItems[item.id]?.shares[user] || 0;
        return sum + (item.price * share);
      }, 0);
      
      return {
        user,
        items: userItems.map(item => ({
          id: item.id,
          name: item.name,
          quantity: selectedItems[item.id]?.shares[user] || 0,
          price: item.price,
          total: item.price * (selectedItems[item.id]?.shares[user] || 0)
        })),
        amount: userAmount,
        phone: user === users[0] ? phoneNumber : undefined
      };
    });

    closeWebApp({
      receipt,
      totals: userSelections.map(sel => ({
        user: sel.user,
        amount: sel.amount,
        phone: sel.phone,
        items: sel.items
      }))
    });
  };

  if (isLoading) {
    return (
      <div className="container" style={{ textAlign: 'center' }}>
        <img 
          src="/images/sbercat.png" 
          alt="Загрузка..." 
          style={{ width: 100, height: 100, animation: 'pulse 1s infinite' }} 
        />
        <p>Загрузка чека...</p>
      </div>
    );
  }

  if (error || !receipt) {
    return (
      <div className="container">
        <h2 className="header">Ошибка</h2>
        <p>{error || 'Не удалось загрузить данные чека'}</p>
      </div>
    );
  }

  const filteredItems = receipt.items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const itemsPerPage = 8;
  const pageCount = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <div className="container">
      <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
        <img 
          src="/images/sbercat.png" 
          alt="Сберкот" 
          className="sbercat-header"
          style={{ width: 50, height: 50, marginRight: 10 }}
        />
        <Typography variant="h5" component="h1">
          Разделение счета
        </Typography>
      </Box>
      
      {phoneNumber && (
        <Box mb={2} p={1} bgcolor="#e3f2fd" borderRadius={1}>
          <Typography variant="body2">
            Номер для оплаты: <strong>{phoneNumber}</strong>
          </Typography>
        </Box>
      )}

      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <TextField
          label="Поиск блюд"
          variant="outlined"
          size="small"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => setNewUserModalOpen(true)}
        >
          Добавить
        </Button>
      </Box>

      <Box mb={2}>
        {users.map(user => (
          <Box 
            key={user} 
            display="flex" 
            alignItems="center" 
            justifyContent="space-between"
            p={1}
            bgcolor="#f5f5f5"
            borderRadius={1}
            mb={1}
          >
            <Typography>{user}</Typography>
            {users.length > 1 && (
              <IconButton size="small" onClick={() => removeUser(user)}>
                <CloseIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
        ))}
      </Box>

      {distributionError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {distributionError}
        </Alert>
      )}

      {pageCount > 1 && (
        <Box display="flex" justifyContent="center" mb={2}>
          <Pagination
            count={pageCount}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
          />
        </Box>
      )}

      <Typography variant="h6" align="center" gutterBottom sx={{ mb: 2 }}>
        Выберите блюда
      </Typography>
      
      <Box mb={2}>
  {paginatedItems.map((item) => {
    const totalSelected = Object.values(selectedItems[item.id]?.shares || {}).reduce((a, b) => a + b, 0);
    const remainingPortions = item.quantity - totalSelected;
    
    return (
      <ReceiptItem
        key={item.id}
        item={{
          ...item,
          name: `${item.name}${item.quantity > 1 ? ` (доступно ${remainingPortions}/${item.quantity})` : ''}`
        }}
        selected={!!selectedItems[item.id]}
        onToggle={() => toggleItem(item.id)}
        users={users}
        selectedUsers={selectedItems[item.id]?.users || []}
        onUserSelect={(userId) => toggleUserForItem(item.id, userId)}
        onShareChange={(userId, share) => {
          const currentUserShare = selectedItems[item.id]?.shares[userId] || 0;
          const newTotal = totalSelected - currentUserShare + share;
          
          if (newTotal <= item.quantity) {
            updateUserShare(item.id, userId, share);
          } else {
            webApp?.showAlert(`Нельзя выбрать больше ${remainingPortions + currentUserShare} порций`);
          }
        }}
        userShares={selectedItems[item.id]?.shares || {}}
        totalShares={totalSelected}
        isFractional={item.quantity === 1}
      />
    );
  })}
</Box>

      {pageCount > 1 && (
        <Box display="flex" justifyContent="center" mb={2}>
          <Pagination
            count={pageCount}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
          />
        </Box>
      )}

      <Button
        variant="contained"
        fullWidth
        onClick={handleSubmit}
        disabled={Object.keys(selectedItems).length === 0 || !phoneNumber || !!phoneError}
      >
        Подтвердить выбор
      </Button>

      <Dialog open={newUserModalOpen} onClose={() => setNewUserModalOpen(false)}>
        <DialogTitle>Добавить пользователя</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Имя пользователя"
            fullWidth
            value={newUserName}
            onChange={(e) => setNewUserName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addUser()}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewUserModalOpen(false)}>Отмена</Button>
          <Button onClick={addUser} variant="contained" disabled={!newUserName}>
            Добавить
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={phoneModalOpen} onClose={() => {}}>
        <DialogTitle>Ваш номер телефона</DialogTitle>
        <DialogContent>
          <Typography variant="body2" gutterBottom sx={{ mb: 2 }}>
            Пожалуйста, укажите ваш номер телефона для оплаты. Он будет виден другим участникам.
      <br />Номер должен содержать только цифры и может начинаться с +.
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Номер телефона"
            fullWidth
            value={phoneNumber}
            onChange={handlePhoneChange}
            placeholder="+79991234567"
            type="tel"
            error={!!phoneError}
            helperText={phoneError || "Введите от 10 до 15 цифр"}
            inputProps={{
              inputMode: 'tel',
              maxLength: 19,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              if (phoneNumber && !phoneError) {
                setPhoneModalOpen(false);
              }
            }} 
            variant="contained"
            disabled={!phoneNumber || !!phoneError}
          >
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};