// Userscript entry: injects the MUI skin (src/unipa-skin.css) over the real
// UNIPA portal. Pure CSS wrap — adds no content, replaces no text, breaks no
// JSF behavior. Built into a single .user.js by vite.userscript.config.ts +
// scripts/make-userscript.mjs.
import skin from './unipa-skin.css?inline'

const STYLE_ID = 'mui-practice-skin'
const FAB_ID = 'mui-practice-toggle'
const HIDDEN_KEY = 'unipa-demo:skin-hidden'

// Top frame only — portal iframes re-run the script.
if (window === window.top && !document.getElementById(STYLE_ID)) {
  const style = document.createElement('style')
  style.id = STYLE_ID
  style.textContent = skin
  document.head.appendChild(style)

  // Tag text-only NEW badges so the skin can chip them. Adds one class;
  // the text itself is untouched.
  const markNew = () => {
    for (const el of document.querySelectorAll('span,div,td,p')) {
      if (el.childElementCount === 0) {
        const t = (el.textContent || '').trim()
        if (t === 'NEW' || t === 'NEW!') el.classList.add('mp-chip-new')
      }
    }
  }
  markNew()
  new MutationObserver(markNew).observe(document.body, { childList: true, subtree: true })

  // Session-persistent on/off, kept in sessionStorage so navigating inside
  // UNIPA (full page loads in JSF) does not reset it.
  if (sessionStorage.getItem(HIDDEN_KEY) === '1') style.disabled = true

  const fab = document.createElement('button')
  fab.id = FAB_ID
  fab.textContent = 'M'
  fab.title = 'mui-practice skin on/off'
  fab.setAttribute('aria-label', 'mui-practice skin on/off')
  fab.style.cssText = [
    'position:fixed', 'top:12px', 'right:12px', 'z-index:2147483647',
    'width:36px', 'height:36px', 'border-radius:50%', 'border:none',
    'background:#0a6b4a', 'color:#fff', 'font:700 14px/36px sans-serif',
    'text-align:center', 'cursor:pointer', 'box-shadow:0 2px 8px rgba(0,0,0,.3)',
    'opacity:.45',
  ].join(';')
  fab.addEventListener('mouseenter', () => (fab.style.opacity = '1'))
  fab.addEventListener('mouseleave', () => (fab.style.opacity = '.45'))
  fab.addEventListener('click', () => {
    style.disabled = !style.disabled
    fab.style.background = style.disabled ? '#9e9e9e' : '#0a6b4a'
    try {
      sessionStorage.setItem(HIDDEN_KEY, style.disabled ? '1' : '0')
    } catch {
      // storage unavailable — toggle is in-memory only
    }
  })
  document.body.appendChild(fab)
}
