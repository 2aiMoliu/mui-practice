import { useState } from 'react'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import AppBar from '@mui/material/AppBar'
import Avatar from '@mui/material/Avatar'
import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Container from '@mui/material/Container'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import AddIcon from '@mui/icons-material/Add'
import CampaignIcon from '@mui/icons-material/Campaign'
import DeleteIcon from '@mui/icons-material/Delete'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import LinkIcon from '@mui/icons-material/Link'
import PersonIcon from '@mui/icons-material/Person'
import SchoolIcon from '@mui/icons-material/School'
import TodayIcon from '@mui/icons-material/Today'
import { BULLETINS, COURSES, TODAY, classesOn, fmtShort } from './data'
import type { CustomEvent } from './data'
import { useStored } from './state'
import { AddEventDialog, BulletinList, ClassActions, CourseList, LinksList, useNotice } from './parts'

const NOW = '12:50' // demo clock, pinned so the hero is deterministic

const NAV_SEC = [
  { key: 'today', label: '今日', icon: <TodayIcon /> },
  { key: 'board', label: '掲示板', icon: <CampaignIcon /> },
  { key: 'courses', label: '履修', icon: <SchoolIcon /> },
  { key: 'links', label: 'リンク', icon: <LinkIcon /> },
] as const
type Sec = (typeof NAV_SEC)[number]['key']

/** V2 — today-first: one column, the next class as the hero, bottom nav on phones. */
export default function VariantToday() {
  const [noticeNode, notice] = useNotice()
  const [sec, setSec] = useState<Sec>('today')
  const [showAll, setShowAll] = useState(false)
  const [addOpen, setAddOpen] = useState(false)
  const [read, setRead] = useStored<string[]>('read', [])
  const [memos, setMemos] = useStored<Record<string, string>>('memos', {})
  const [custom, setCustom] = useStored<CustomEvent[]>('custom', [])

  const unread = BULLETINS.filter((b) => !read.includes(b.id)).length
  const onRead = (id: string) => setRead(read.includes(id) ? read : [...read, id])
  const shown = showAll ? BULLETINS : BULLETINS.slice(0, 3)

  const todays = classesOn(TODAY)
  const next = todays.find((c) => c.end > NOW) ?? null
  const dayCustom = custom.filter((c) => c.date === TODAY)
  const secProps = (key: Sec) => ({
    sx: {
      display: { xs: sec === key ? 'block' : 'none', md: 'block' },
    },
  })

  return (
    <Box sx={{ minHeight: '100dvh' }}>
      <AppBar position="sticky" elevation={0}>
        <Toolbar sx={{ gap: 1.5 }}>
          <Box
            sx={{ bgcolor: '#fff', color: 'primary.main', width: 32, height: 32, borderRadius: 1, display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: 14 }}
          >
            iU
          </Box>
          <Typography sx={{ fontWeight: 800 }}>今日のUNIPA</Typography>
          <Box sx={{ flex: 1 }} />
          <Avatar sx={{ bgcolor: 'rgba(255,255,255,.2)', width: 32, height: 32 }}>
            <PersonIcon fontSize="small" />
          </Avatar>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ py: 2, display: 'grid', gap: 2, alignContent: 'start', pb: 10 }}>
        {/* 今日 */}
        <Box sx={{ display: { xs: sec === 'today' ? 'grid' : 'none', md: 'grid' }, gap: 2 }}>
          <Paper variant="outlined" sx={{ p: 2.5, borderLeft: 4, borderColor: 'primary.main' }}>
            <Typography variant="body2" color="text.secondary">
              {fmtShort(TODAY)} ・{' '}
              {next ? '次の授業' : todays.length > 0 ? '今日の授業は終了しました' : '今日の予定はありません'}
            </Typography>
            {next ? (
              <>
                <Typography variant="h2" sx={{ fontWeight: 800, fontVariantNumeric: 'tabular-nums', lineHeight: 1.1, fontSize: { xs: 44, sm: 56 } }}>
                  {next.start}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {next.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {next.start}–{next.end} ・ {next.room} ・ {next.teacher}
                </Typography>
                <ClassActions
                  key={next.id}
                  ev={next}
                  memo={memos[next.id] ?? ''}
                  onMemo={(v) => setMemos({ ...memos, [next.id]: v })}
                  onMock={notice}
                />
              </>
            ) : (
              <Typography sx={{ mt: 1 }}>ゆっくり休みましょう。</Typography>
            )}
          </Paper>

          {dayCustom.length > 0 && (
            <Paper variant="outlined" sx={{ p: 1, display: 'grid', gap: 0.5 }}>
              {dayCustom.map((c) => (
                <Box key={c.id} sx={{ display: 'flex', gap: 1.5, alignItems: 'center', px: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                    {c.start ?? '全日'}
                  </Typography>
                  <Typography variant="body2" sx={{ flex: 1 }}>
                    {c.title}
                  </Typography>
                  <IconButton size="small" onClick={() => setCustom(custom.filter((x) => x.id !== c.id))}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Paper>
          )}
          <Button size="small" startIcon={<AddIcon />} onClick={() => setAddOpen(true)} sx={{ justifySelf: 'start' }}>
            My予定を追加
          </Button>

          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main' }}>
            今日の授業
          </Typography>
          {todays.map((ev) => (
            <Accordion key={ev.id} variant="outlined">
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'baseline' }}>
                  <Typography variant="body2" sx={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                    {ev.start}
                  </Typography>
                  <Typography sx={{ fontWeight: 600 }}>{ev.title}</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {ev.teacher} ・ {ev.room}
                </Typography>
                <ClassActions
                  key={ev.id}
                  ev={ev}
                  memo={memos[ev.id] ?? ''}
                  onMemo={(v) => setMemos({ ...memos, [ev.id]: v })}
                  onMock={notice}
                />
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>

        {/* 掲示板 */}
        <Box {...secProps('board')}>
          <Paper variant="outlined">
            <Box sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                掲示板
              </Typography>
              <Chip size="small" color="error" label={`未読 ${unread}`} />
            </Box>
            <BulletinList items={shown} read={read} onRead={onRead} />
            <Button fullWidth size="small" onClick={() => setShowAll((s) => !s)}>
              {showAll ? '折りたたむ' : 'さらに表示'}
            </Button>
          </Paper>
        </Box>

        {/* 履修 */}
        <Box {...secProps('courses')}>
          <Paper variant="outlined" sx={{ p: 1 }}>
            <CourseList courses={COURSES} />
          </Paper>
        </Box>

        {/* リンク */}
        <Box {...secProps('links')}>
          <Paper variant="outlined">
            <LinksList />
          </Paper>
        </Box>
      </Container>

      <BottomNavigation
        value={sec}
        onChange={(_, x) => setSec(x as Sec)}
        showLabels
        sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, display: { xs: 'flex', md: 'none' }, zIndex: 1100 }}
      >
        {NAV_SEC.map((n) => (
          <BottomNavigationAction key={n.key} value={n.key} label={n.label} icon={n.icon} />
        ))}
      </BottomNavigation>

      {noticeNode}
      <AddEventDialog
        open={addOpen}
        date={TODAY}
        onClose={() => setAddOpen(false)}
        onAdd={(e) => setCustom([...custom, { ...e, id: `c${Date.now()}` }])}
      />
    </Box>
  )
}
