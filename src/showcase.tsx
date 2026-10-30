import { useState } from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import { ThemeProvider } from '@mui/material/styles'
import { theme } from './theme'
import VariantCommand from './VariantCommand'
import VariantFamiliar from './VariantFamiliar'
import VariantToday from './VariantToday'

export const VARIANTS: Record<number, string> = { 1: '定番', 2: '今日', 3: '密度' }

/**
 * ThemeProvider + the three variants + the floating switcher.
 * `bare` skips the page-level CssBaseline reset — the userscript overlay
 * must not restyle the real portal body beneath it.
 */
export default function Showcase({
  initial = 1,
  bare = false,
  onVariant,
}: {
  initial?: number
  bare?: boolean
  onVariant?: (v: number) => void
}) {
  const [v, setV] = useState(initial)
  return (
    <ThemeProvider theme={theme}>
      {!bare && <CssBaseline />}
      {v === 1 && <VariantFamiliar />}
      {v === 2 && <VariantToday />}
      {v === 3 && <VariantCommand />}
      <ToggleButtonGroup
        value={v}
        exclusive
        onChange={(_, x) => {
          if (x !== null) {
            setV(x)
            onVariant?.(x)
          }
        }}
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
        {Object.entries(VARIANTS).map(([n, label]) => (
          <ToggleButton key={n} value={Number(n)}>
            {label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </ThemeProvider>
  )
}
