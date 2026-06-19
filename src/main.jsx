import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles/shared.css';

// Mount the complete React application inside the root element from index.html.
createRoot(document.getElementById('root')).render(<App />);
