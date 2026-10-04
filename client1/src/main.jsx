import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// 1. Tailwind / Global resets first
import './index.css'

// 2. Component/App overrides second
import './App.css'
import App from './App.jsx'
import ThemeProvider from './components/ThemeProvider';
import { AuthProvider } from './context/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)
