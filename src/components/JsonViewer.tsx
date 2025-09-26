import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Paper, Typography } from '@mui/material';
import { RootState } from '../store';

interface JsonViewerProps {
  tabIndex: number;
}

const JsonViewer: React.FC<JsonViewerProps> = ({ tabIndex }) => {
  const rowData = useSelector((state: RootState) => 
    state.windows.openWindows[tabIndex]?.rowData
  );

  console.log('Current tabIndex:', tabIndex);
  console.log('Current rowData:', rowData);

  if (!rowData) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">
          No data available for tabIndex: {tabIndex}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 2,
          backgroundColor: '#f5f5f5',
          fontFamily: 'monospace'
        }}
      >
        <Typography variant="h6" gutterBottom>
          Row Data
        </Typography>
        <pre style={{ 
          margin: 0,
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word'
        }}>
          {JSON.stringify(rowData, null, 2)}
        </pre>
      </Paper>
    </Box>
  );
};

export default JsonViewer;
