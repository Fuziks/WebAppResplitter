import { AppBar, Toolbar, IconButton, Popover, TextField, Button, Typography, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';

export const Header = ({ onSearch, onAddItem }: {
  onSearch: (query: string) => void;
  onAddItem: (item: { name: string; price: number }) => void;
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [newItem, setNewItem] = useState({ name: '', price: 0 });

  return (
    <AppBar position="static" sx={{ mb: 2 }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h6">Меню</Typography>
        
        <Box display="flex" alignItems="center" gap={2}>
          <TextField 
            size="small"
            placeholder="Поиск..."
            onChange={(e) => onSearch(e.target.value)}
            sx={{ width: 200 }}
          />
          <IconButton color="inherit" onClick={(e) => setAnchorEl(e.currentTarget)}>
            <AddIcon />
          </IconButton>
        </Box>

        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <Box p={2} width={300}>
            <Typography variant="h6" gutterBottom>Добавить блюдо</Typography>
            <TextField
              label="Название"
              fullWidth
              sx={{ mb: 2 }}
              value={newItem.name}
              onChange={(e) => setNewItem({...newItem, name: e.target.value})}
            />
            <TextField
              label="Цена"
              type="number"
              fullWidth
              sx={{ mb: 2 }}
              value={newItem.price}
              onChange={(e) => setNewItem({...newItem, price: Number(e.target.value)})}
            />
            <Button 
              variant="contained" 
              fullWidth
              onClick={() => {
                onAddItem(newItem);
                setAnchorEl(null);
                setNewItem({ name: '', price: 0 });
              }}
            >
              Добавить
            </Button>
          </Box>
        </Popover>
      </Toolbar>
    </AppBar>
  );
};