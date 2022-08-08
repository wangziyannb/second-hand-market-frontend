import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './components/App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter} from "react-router-dom";

// this is the React app root component, the next node is App component

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<BrowserRouter>
    <App/>
</BrowserRouter>);


reportWebVitals();
