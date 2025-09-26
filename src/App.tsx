import { Box, Button, Tab, Tabs } from '@mui/material';
import { updateForm } from '@store/formSlice';
import { windowOpened, windowClosed } from '../store/windowSlice';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { RootState } from '../store';
import TabForm from './components/TabForm';

interface TabWindow extends Window {
  updateContent?: (content: string) => void;
  tabIndex?: number;
}

const STORAGE_KEY = 'openWindows';

const App = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { tabIndex = 0 } = useParams();
  const currentTab = parseInt(String(tabIndex), 10) || 0;
  
  // Get content from Redux store
  const tabContent = useSelector((state: RootState) => 
    state.forms.tabs[currentTab]?.content || ''
  );
  const openWindows = useSelector((state: RootState) => state.windows.openWindows);

  // Restore window state on initial load
  useEffect(() => {
    const storedWindows = localStorage.getItem(STORAGE_KEY);
    if (storedWindows) {
      const windows = JSON.parse(storedWindows);
      Object.keys(windows).forEach(index => {
        if (windows[index]) {
          dispatch(windowOpened(parseInt(index, 10)));
        }
      });
    }
  }, [dispatch]);

  // Persist window state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(openWindows));
  }, [openWindows]);

  useEffect(() => {
    if (window.opener) {
      (window as TabWindow).tabIndex = currentTab;
      (window as TabWindow).updateContent = (content: string) => {
        dispatch(updateForm({ tabIndex: currentTab, content }));
      };

      // Handle window close
      const handleUnload = () => {
        window.opener?.postMessage({ 
          type: 'WINDOW_CLOSED', 
          tabIndex: currentTab 
        }, window.location.origin);
      };

      window.addEventListener('unload', handleUnload);
      return () => window.removeEventListener('unload', handleUnload);
    } else {
      // Main window: listen for child window messages
      const handleMessage = (event: MessageEvent) => {
        if (event.origin === window.location.origin && 
            event.data.type === 'WINDOW_CLOSED') {
          dispatch(windowClosed(event.data.tabIndex));
        }
      };

      // Check if windows are still open on main window load
      const checkOpenWindows = () => {
        Object.keys(openWindows).forEach(index => {
          const windowRef = window.open('', `Tab${index}`);
          if (!windowRef || windowRef.closed) {
            dispatch(windowClosed(parseInt(index, 10)));
          } else {
            windowRef.focus();
          }
        });
      };

      window.addEventListener('message', handleMessage);
      window.addEventListener('load', checkOpenWindows);
      
      return () => {
        window.removeEventListener('message', handleMessage);
        window.removeEventListener('load', checkOpenWindows);
      };
    }
  }, [currentTab, dispatch, openWindows]);

  const handleTabChange = (_event: React.ChangeEvent<{}>, newValue: number) => {
    navigate(`/tab/${newValue}`);
  };

  const handleOpenWindow = (index: number) => {
    const url = `${window.location.origin}/tab/${index}`;
    const windowFeatures = 'width=800,height=600,left=200,top=200';
    const newWindow = window.open(url, `Tab${index}`, windowFeatures) as TabWindow;
    
    if (newWindow) {
      dispatch(windowOpened(index));
      // Wait for the new window to load
      setTimeout(() => {
        if (newWindow.updateContent) {
          newWindow.updateContent(tabContent);
        }
      }, 1000);
    }
  };

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Tabs value={currentTab} onChange={handleTabChange}>
        {[...Array(5)].map((_, index) => (
          <Tab 
            key={index} 
            label={`Tab ${index + 1} ${openWindows[index] ? '(Opened)' : ''}`}
          />
        ))}
      </Tabs>
      {!window.opener && (
        <Button 
          variant="contained" 
          onClick={() => handleOpenWindow(currentTab)}
          sx={{ mt: 2 }}
          disabled={openWindows[currentTab]}
        >
          {openWindows[currentTab] ? 'Already Open' : 'Open in New Window'}
        </Button>
      )}
      <TabForm tabIndex={currentTab} />
    </Box>
  );
};

export default App;