// Userscript entry: renders the showcase as a full-screen overlay on top of
// the real UNIPA portal (https://unipa.i-u.ac.jp). Built into a single
// .user.js by vite.userscript.config.ts + scripts/make-userscript.mjs.
import { useState } from 'react'
import Fab from '@mui/material/Fab'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { ThemeProvider } from '@mui/material/styles'
import { createRoot } from 'react-dom/client'
import Showcase from './showcase'
import { OVERLAY_Z, theme } from './theme'

// Dismissal lasts for the browser session, so navigating inside UNIPA
// (a full page load in JSF) does not bring the overlay back every time.
const HIDDEN_KEY = 'unipa-demo:overlay-hidden'

function OverlayApp() {
  const [hidden, setHidden] = useState(() => {
    try {
      return sessionStorage.getItem(HIDDEN_KEY) === '1'
    } catch {
      return false
    }
  })
  const toggle = () =>
    setHidden((h) => {
      try {
        sessionStorage.setItem(HIDDEN_KEY, h ? '0' : '1')
      } catch {
        // storage unavailable — dismissal is in-memory only
      }
      return !h
    })
  return (
    <ThemeProvider theme={theme}>
      <div
        id="mui-practice-overlay"
        style={{
          position: 'fixed',
          inset: 0,
          overflowY: 'auto',
          zIndex: OVERLAY_Z,
          display: hidden ? 'none' : 'block',
          background: theme.palette.background.default,
          color: theme.palette.text.primary,
          fontFamily: theme.typography.fontFamily,
        }}
      >
        <Showcase bare />
      </div>
      <Fab
        color="primary"
        size="small"
        onClick={toggle}
        aria-label={hidden ? 'オーバーレイを表示' : 'オーバーレイを隠す'}
        sx={{ position: 'fixed', top: 16, right: 16, zIndex: OVERLAY_Z + 90 }}
      >
        {hidden ? <VisibilityIcon /> : <VisibilityOffIcon />}
      </Fab>
    </ThemeProvider>
  )
}

// Top frame only (no duplicated overlays in portal iframes), and never the
// LOGIN screen — it carries a password field.
if (window === window.top && !document.querySelector('input[type="password"]')) {
  const host = document.createElement('div')
  document.body.appendChild(host)
  createRoot(host).render(<OverlayApp />)
}
