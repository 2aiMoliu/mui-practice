import { readFile, writeFile } from 'node:fs/promises'

// The installed script is a tiny permanent stub: on every page load it fetches
// the real overlay bundle from Pages and runs it. Iterations therefore deploy
// on push + reload with no Tampermonkey reinstall. Bump @version only when the
// stub itself changes.
const header = `// ==UserScript==
// @name        UNIPA モダンリデザイン (mui-practice)
// @namespace   https://2aimoliu.github.io/mui-practice/
// @version     0.2.0
// @description mui-practice の MUI リデザイン3バリアントを、本物の UNIPA の上に重ねて表示します
// @match       https://unipa.i-u.ac.jp/*
// @run-at      document-idle
// @grant       none
// @updateURL   https://2aimoliu.github.io/mui-practice/unipa.user.js
// @downloadURL https://2aimoliu.github.io/mui-practice/unipa.user.js
// ==/UserScript==
`

const stub = `
(() => {
  if (window !== window.top) return
  const SRC = 'https://2aimoliu.github.io/mui-practice/overlay.js'
  const boot = () =>
    fetch(SRC + '?t=' + Date.now())
      .then((r) => r.text())
      .then((js) => (0, eval)(js))
      .catch(() => {})
  // LOGIN gate: a password box that is actually rendered. UNIPA keeps hidden
  // ones in the post-login DOM, and the login itself is an ajax postback, so
  // both the visibility test and the settle-watcher below are required.
  const isLogin = () =>
    [...document.querySelectorAll('input[type="password"]')].some((el) => el.getClientRects().length > 0)
  if (!isLogin()) return boot()
  const mo = new MutationObserver(() => {
    if (!isLogin()) {
      mo.disconnect()
      boot()
    }
  })
  mo.observe(document.documentElement, { childList: true, subtree: true })
})()
`

const js = await readFile('dist-userscript/overlay.js', 'utf8')
await writeFile('dist/overlay.js', js)
await writeFile('dist/unipa.user.js', header + stub)
console.log('wrote dist/overlay.js + dist/unipa.user.js (stub)')
