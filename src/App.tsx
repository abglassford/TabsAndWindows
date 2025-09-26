import { Box, Button, Tab, Tabs } from '@mui/material';
import { updateForm } from '@store/formSlice';
import {
  windowOpened,
  windowClosed,
  validateWindows,
} from '../store/windowSlice';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { RootState } from '../store';
import TabForm from './components/TabForm';

interface WindowMessage {
  type: 'WINDOW_CLOSED' | 'WINDOW_READY' | 'HYDRATE_CONTENT';
  tabIndex: number;
  content?: string;
}

interface TabWindow extends Window {
  updateContent?: (content: string) => void;
  tabIndex?: number;
}

const App = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { tabIndex = 0 } = useParams();
  const currentTab = parseInt(String(tabIndex), 10) || 0;

  // Get content from Redux store
  const tabContent = useSelector(
    (state: RootState) => state.forms.tabs[currentTab]?.content || ''
  );
  const openWindows = useSelector(
    (state: RootState) => state.windows.openWindows
  );

  // Validate window state on initial load
  useEffect(() => {
    if (!window.opener) {
      dispatch(validateWindows());
    }
  }, [dispatch]);

  useEffect(() => {
    if (window.opener) {
      // Child window logic
      (window as TabWindow).tabIndex = currentTab;

      const handleMessage = (event: MessageEvent<WindowMessage>) => {
        if (event.data.type === 'HYDRATE_CONTENT' && event.data.content) {
          dispatch(
            updateForm({
              tabIndex: currentTab,
              content: event.data.content,
            })
          );
        }
      };

      window.addEventListener('message', handleMessage);

      // Signal ready to parent
      window.opener.postMessage(
        {
          type: 'WINDOW_READY',
          tabIndex: currentTab,
        },
        window.location.origin
      );

      const handleUnload = () => {
        window.opener?.postMessage(
          {
            type: 'WINDOW_CLOSED',
            tabIndex: currentTab,
          },
          window.location.origin
        );
      };

      window.addEventListener('unload', handleUnload);

      return () => {
        window.removeEventListener('message', handleMessage);
        window.removeEventListener('unload', handleUnload);
      };
    } else {
      // Parent window logic
      const handleMessage = (event: MessageEvent<WindowMessage>) => {
        if (event.origin !== window.location.origin) return;

        switch (event.data.type) {
          case 'WINDOW_CLOSED':
            dispatch(windowClosed(event.data.tabIndex));
            break;
          case 'WINDOW_READY':
            if (event.source && event.data.tabIndex === currentTab) {
              (event.source as Window).postMessage(
                {
                  type: 'HYDRATE_CONTENT',
                  tabIndex: event.data.tabIndex,
                  content: tabContent,
                },
                window.location.origin
              );
            }
            break;
        }
      };

      window.addEventListener('message', handleMessage);
      return () => window.removeEventListener('message', handleMessage);
    }
  }, [currentTab, dispatch, tabContent]);

  const handleTabChange = (_event: React.ChangeEvent<{}>, newValue: number) => {
    navigate(`/tab/${newValue}`);
  };

  const handleOpenWindow = (index: number) => {
    const url = `${window.location.origin}/tab/${index}`;
    const windowFeatures = [
      'width=800',
      'height=600',
      'left=200',
      'top=200',
      'menubar=no',
      'toolbar=no',
      'titlebar=no',
      'location=no',
      'directories=no',
      'status=no',
      'scrollbars=yes',
      'resizable=yes',
      'chrome=no',
      'dialog=yes',
    ].join(',');

    const newWindow = window.open(
      url,
      `Tab${index}`,
      windowFeatures
    ) as TabWindow;

    if (newWindow) {
      dispatch(
        windowOpened({
          tabIndex: index,
          content: tabContent,
        })
      );
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