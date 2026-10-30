import { createTheme } from '@mui/material/styles'

/**
 * Base of the userscript overlay host (unipa-userscript.tsx). MUI portals
 * (Dialog/Menu/Snackbar/Tooltip) stack above it, so they stay visible over
 * the real UNIPA page. Harmless on the standalone Pages demo.
 */
export const OVERLAY_Z = 2_147_483_000

export const theme = createTheme({
  palette: {
    primary: { main: '#0a6b4a' },
    background: { default: '#f4f7f5' },
  },
  typography: {
    fontFamily: ['Roboto', '"Hiragino Kaku Gothic ProN"', '"Hiragino Sans"', 'Meiryo', 'system-ui', 'sans-serif'].join(', '),
  },
  zIndex: {
    modal: OVERLAY_Z + 100,
    snackbar: OVERLAY_Z + 200,
    tooltip: OVERLAY_Z + 300,
  },
  components: {
    MuiButton: { styleOverrides: { root: { textTransform: 'none' } } },
  },
})
