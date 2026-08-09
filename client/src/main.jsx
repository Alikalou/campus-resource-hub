//For now you don't need to understand this statement
import { StrictMode } from 'react'

//There are two things here, react dom which connects react to the browser's DOM, and react which essentialy provides the component definiton.
import { createRoot } from 'react-dom/client'

import { BrowserRouter } from "react-router";

import './index.css'

//The react app component
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>

  </StrictMode>,
)
