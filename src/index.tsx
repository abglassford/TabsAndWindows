import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { store } from '../store';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const root = createRoot(rootElement);

root.render(
  <Provider store={store}>
    <BrowserRouter>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/tab/:tabIndex" element={<App />} />
      </Routes>
    </BrowserRouter>
  </Provider>
);