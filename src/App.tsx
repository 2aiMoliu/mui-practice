import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'

export default function App() {
  return (
    <>
      <CssBaseline />
      <main style={{ display: 'grid', placeItems: 'center', minHeight: '100dvh' }}>
        <Button variant="contained">mui-practice</Button>
      </main>
    </>
  )
}
