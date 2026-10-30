import { readFile, writeFile } from 'node:fs/promises'

// Metadata for Tampermonkey/Violentmonkey. updateURL == downloadURL == the
// Pages artifact, so an installed script updates itself from this repo.
const header = `// ==UserScript==
// @name        UNIPA モダンリデザイン (mui-practice)
// @namespace   https://2aimoliu.github.io/mui-practice/
// @version     0.1.0
// @description mui-practice の MUI リデザイン3バリアントを、本物の UNIPA の上に重ねて表示します
// @match       https://unipa.i-u.ac.jp/*
// @run-at      document-idle
// @grant       none
// @updateURL   https://2aimoliu.github.io/mui-practice/unipa.user.js
// @downloadURL https://2aimoliu.github.io/mui-practice/unipa.user.js
// ==/UserScript==
`

const js = await readFile('dist-userscript/overlay.js', 'utf8')
await writeFile('dist/unipa.user.js', header + js)
console.log('wrote dist/unipa.user.js')
