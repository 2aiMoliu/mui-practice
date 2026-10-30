import { useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import Showcase, { VARIANTS } from './showcase'

export default function App() {
  const [v, setV] = useState(() => {
    const q = Number(new URLSearchParams(window.location.search).get('v'))
    return q in VARIANTS ? q : 1
  })
  useEffect(() => {
    window.history.replaceState(null, '', `?v=${v}`)
    document.title = `UNIPA モダンリデザイン ・ ${VARIANTS[v]}`
  }, [v])

  return (
    <>
      <Showcase initial={v} onVariant={setV} />
      <Button
        component="a"
        href="unipa.user.js"
        variant="contained"
        size="small"
        sx={{ position: 'fixed', left: 16, bottom: 16, zIndex: 1200 }}
      >
        UNIPAオーバーレイ導入
      </Button>
    </>
  )
}
