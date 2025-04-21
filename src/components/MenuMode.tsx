import { useState } from 'react';
import { MenuList } from './MenuList';
import { ReceiptItem } from '../types/types';
import { Header } from './Header';

export const MenuMode = () => {
  const [items, setItems] = useState<ReceiptItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddItem = (newItem: { name: string; price: number }) => {
    setItems(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        name: newItem.name,
        price: newItem.price,
        quantity: 1
      }
    ]);
  };

  return (
    <>
      <Header 
        onSearch={setSearchQuery}
        onAddItem={handleAddItem}
      />
      <div style={{ padding: '0 16px' }}>
        <MenuList items={filteredItems} />
      </div>
    </>
  );
};
