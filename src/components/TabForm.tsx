import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TextField, Paper, Typography } from '@mui/material';
import { updateForm } from '../store/formSlice';

interface TabFormProps {
  tabIndex: number;
}

const TabForm: React.FC<TabFormProps> = ({ tabIndex }) => {
  const dispatch = useDispatch();
  const storedContent = useSelector((state: any) => state.forms.tabs[tabIndex].content);
  const [localContent, setLocalContent] = useState(storedContent);

  useEffect(() => {
    setLocalContent(storedContent);
  }, [storedContent]);

  const handleChange = (event: { target: { value: any; }; }) => {
    const newContent = event.target.value;
    setLocalContent(newContent);
    dispatch(updateForm({ tabIndex, content: newContent }));
  };

  return (
    <Paper sx={{ p: 2, mt: 2 }}>
      <Typography variant="body1" gutterBottom>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      </Typography>
      <TextField
        fullWidth
        multiline
        rows={4}
        value={localContent}
        onChange={handleChange}
        label={`Tab ${tabIndex + 1} Content`}
        variant="outlined"
      />
    </Paper>
  );
};

export default TabForm;