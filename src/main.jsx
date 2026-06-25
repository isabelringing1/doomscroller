import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store.js'
import './index.css'
import App from './App.jsx'

function syncBrowserChromeInset() {
  const vv = window.visualViewport
  if (!vv) return
  const bottom = Math.max(0, window.innerHeight - vv.height - vv.offsetTop)
  document.documentElement.style.setProperty('--browser-ui-bottom', `${bottom}px`)
}

syncBrowserChromeInset()
window.visualViewport?.addEventListener('resize', syncBrowserChromeInset)
window.visualViewport?.addEventListener('scroll', syncBrowserChromeInset)
window.addEventListener('resize', syncBrowserChromeInset)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
