import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { HashRouter } from 'react-router-dom';  // Change to HashRouter

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
        {/* <HashRouter>
      <div>
      <App />
         </div>
    </HashRouter> */}
  </React.StrictMode>,
)
