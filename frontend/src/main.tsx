import { StrictMode, useState, useCallback } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { Providers } from './app/providers'
import { router } from './app/router'
import { LoadingScreen } from './components/three/LoadingScreen'
import './styles/index.css'

function App() {
  const [loading, setLoading] = useState(true)
  const onDone = useCallback(() => setLoading(false), [])
  return (
    <>
      {loading && <LoadingScreen onDone={onDone} />}
      <Providers>
        <RouterProvider router={router} />
      </Providers>
    </>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
