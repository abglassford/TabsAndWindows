import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Menu,
  MenuItem,
  Box
} from '@mui/material';
import { windowOpened } from '../store/windowSlice';

interface JsonTableRow {
  id: string | number;
  [key: string]: string | number;
}

interface JsonTableProps {
  data: JsonTableRow[];
}

interface ContextMenuState {
  mouseX: number;
  mouseY: number;
  rowData: JsonTableRow | null;
}

const JsonTable: React.FC<JsonTableProps> = ({ data }) => {
  const dispatch = useDispatch();
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);

  const handleContextMenu = (event: React.MouseEvent, rowData: JsonTableRow) => {
    event.preventDefault();
    setContextMenu({
      mouseX: event.clientX,
      mouseY: event.clientY,
      rowData
    });
  };

  const handleOpenWindow = () => {
    if (!contextMenu?.rowData) return;

    const tabIndex = Number(contextMenu.rowData.id);
    
    console.log('Opening window with:', {
      tabIndex,
      rowData: contextMenu.rowData
    });

    const windowFeatures = [
      'width=600',
      'height=400',
      'menubar=no',
      'toolbar=no',
      'location=no',
      'status=no',
      'resizable=yes'
    ].join(',');

    const newWindow = window.open(
      `${window.location.origin}/json/${tabIndex}`,
      `JSON_${tabIndex}`,
      windowFeatures
    );

    if (newWindow) {
      dispatch(windowOpened({
        tabIndex,
        content: JSON.stringify(contextMenu.rowData, null, 2),
        rowData: contextMenu.rowData
      }));
    }

    setContextMenu(null);
  };

  if (!data.length) return null;

  const columns = Object.keys(data[0]);

  return (
    <Box sx={{ mt: 2 }}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map(column => (
                <TableCell key={column}>
                  {column.toUpperCase()}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map(row => (
              <TableRow
                key={row.id}
                onContextMenu={(e) => handleContextMenu(e, row)}
                sx={{ 
                  cursor: 'context-menu',
                  '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' }
                }}
              >
                {columns.map(column => (
                  <TableCell key={`${row.id}-${column}`}>
                    {row[column]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Menu
        open={contextMenu !== null}
        onClose={() => setContextMenu(null)}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        <MenuItem onClick={handleOpenWindow}>
          View JSON Data
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default JsonTable;