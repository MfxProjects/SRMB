import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles/shared.css';
import './styles/themes/IvoryTheme.css';
import './styles/themes/GoldenLightTheme.css';

// Mount the complete React application inside the root element from index.html.
createRoot(document.getElementById('root')).render(<App />);
