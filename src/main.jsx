import React from 'react'
import ReactDOM from 'react-dom/client'
import { NextUIProvider } from "@nextui-org/react";
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx'
import toast, { Toaster } from 'react-hot-toast';
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <React.StrictMode>
      <NextUIProvider>
        <main className="dark text-foreground bg-background">
          <Toaster />
          <App />
        </main>
      </NextUIProvider>
    </React.StrictMode>
  </BrowserRouter>
)
