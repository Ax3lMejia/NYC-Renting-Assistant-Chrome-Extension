import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './globals.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App scrapedAddress={import.meta.env.DEV ? '425 46th St, Brooklyn, NY 11220' : null} />
  </React.StrictMode>,
)
