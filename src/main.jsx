import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './lib/index.css'
import { Toaster } from './components/ui/sonner'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.Fragment>
    <App />
    <Toaster />
  </React.Fragment>
)