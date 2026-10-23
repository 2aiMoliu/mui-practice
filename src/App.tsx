import { useEffect, useState } from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import VariantFamiliar from './VariantFamiliar'
import VariantToday from './VariantToday'
import VariantCommand from './VariantCommand'

const theme = createTheme({
  palette: {
    primary: { main: '#0a6b4a' },
    background: { default: '#f4f7f5' },
  },
  typography: {
    fontFamily: ['Roboto', '"Hiragino Kaku Gothic ProN"', '"Hiragino Sans"', 'Meiryo', 'system-ui', 'sans-serif'].join(', '),
  },
  components: {
    MuiButton: { styleOverrides: { root: { textTransform: 'none' } } },
  },
})

const LABELS: Record<number, string> = { 1: '定番', 2: '今日', 3: '密度' }

export default function App() {
  const [v, setV] = useState(() => {
    const q = Number(new URLSearchParams(window.location.search).get('v'))
    return q in LABELS ? q : 1
  })
  useEffect(() => {
    window.history.replaceState(null, '', `?v=${v}`)
    document.title = `UNIPA モダンリデザイン ・ ${LABELS[v]}`
  }, [v])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {v === 1 && <VariantFamiliar />}
      {v === 2 && <VariantToday />}
      {v === 3 && <VariantCommand />}
      <ToggleButtonGroup
        value={v}
        exclusive
        onChange={(_, x) => x !== null && setV(x)}
        size="small"
        sx={{
          position: 'fixed',
          right: 16,
          bottom: v === 2 ? 76 : 16,
          zIndex: 1200,
          bgcolor: 'background.paper',
          borderRadius: 2,
          p: 0.5,
          boxShadow: 3,
        }}
      >
        <ToggleButton value={1}>定番</ToggleButton>
        <ToggleButton value={2}>今日</ToggleButton>
        <ToggleButton value={3}>密度</ToggleButton>
      </ToggleButtonGroup>
    </ThemeProvider>
  )
}
