import { Table, TableBody, TableCell, TableContainer, TablePagination, TableRow } from '@mui/material';
import { useState } from 'react';
import { ReceiptItem } from '../types/types';

export const MenuList = ({ items }: { items: ReceiptItem[] }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  return (
    <TableContainer>
      <Table>
        <TableBody>
          {items
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.price.toFixed(2)} ₽</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      <TablePagination
        rowsPerPageOptions={[8]}
        component="div"
        count={items.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        labelRowsPerPage="Позиций на странице:"
      />
    </TableContainer>
  );
};