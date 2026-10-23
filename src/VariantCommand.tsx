import { useState } from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ButtonBase from '@mui/material/ButtonBase'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import AddIcon from '@mui/icons-material/Add'
import AssignmentIcon from '@mui/icons-material/Assignment'
import CampaignIcon from '@mui/icons-material/Campaign'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import LogoutIcon from '@mui/icons-material/Logout'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import SettingsIcon from '@mui/icons-material/Settings'
import { BULLETINS, RANGE_END, RANGE_START, TODAY, addDays, classesOn, fmtShort } from './data'
import type { CustomEvent } from './data'
import { useStored } from './state'
import { AddEventDialog, BulletinList, ClassActions, LinksList, MonthGrid, useNotice } from './parts'

const H_START = 8 * 60 // 8:00
const H_END = 19 * 60 // 19:00
const ROW_H = 40
const SPAN = H_END - H_START
const toMin = (t: string) => {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}
const pct = (min: number) => `${((min - H_START) / SPAN) * 100}%`

/** V3 — command center: every pane visible at once, dense, no page scroll on desktop. */
export default function VariantCommand() {
  const [noticeNode, notice] = useNotice()
  const [date, setDate] = useState(TODAY)
  const [selId, setSelId] = useState<string | null>(null)
  const [addOpen, setAddOpen] = useState(false)
  const [read, setRead] = useStored<string[]>('read', [])
  const [memos, setMemos] = useStored<Record<string, string>>('memos', {})
  const [custom, setCustom] = useStored<CustomEvent[]>('custom', [])

  const unread = BULLETINS.filter((b) => !read.includes(b.id)).length
  const onRead = (id: string) => setRead(read.includes(id) ? read : [...read, id])

  const events = classesOn(date)
  const dayCustom = custom.filter((c) => c.date === date)
  const allDay = dayCustom.filter((c) => !c.start)
  const timedCustom = dayCustom.filter((c) => c.start)
  // selected pane content: explicit choice, else the first class of the day
  const selClass = events.find((e) => e.id === selId) ?? events[0] ?? null
  const selCustom = timedCustom.find((c) => c.id === selId) ?? null
  const dotDates = new Set([...events.map((e) => e.date), ...custom.map((c) => c.date)])

  const rail = [
    { icon: <CampaignIcon />, label: '掲示板' },
    { icon: <CalendarMonthIcon />, label: '時間割' },
    { icon: <AssignmentIcon />, label: 'MyStep' },
    { icon: <OpenInNewIcon />, label: 'リンク' },
  ]

  return (
    <Box sx={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="static" color="primary" elevation={0}>
        <Toolbar variant="dense" sx={{ gap: 1 }}>
          <Box
            sx={{ bgcolor: '#fff', color: 'primary.main', width: 24, height: 24, borderRadius: 0.5, display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: 11 }}
          >
            iU
          </Box>
          <Typography noWrap sx={{ fontWeight: 800, fontSize: 15 }}>
            UNIVERSAL PASSPORT RX
          </Typography>
          <Box sx={{ flex: 1 }} />
          <Chip
            size="small"
            label={`掲示 未読${unread}`}
            sx={{ color: '#fff', bgcolor: 'rgba(255,255,255,.15)' }}
          />
          <IconButton size="small" color="inherit" onClick={() => notice('設定はモック対象外です')}>
            <SettingsIcon />
          </IconButton>
          <IconButton size="small" color="inherit" onClick={() => notice('ログアウトはモック対象外です')}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          flex: 1,
          p: 1,
          display: 'grid',
          gap: 1,
          alignItems: 'stretch',
          gridTemplateColumns: { xs: '1fr', lg: '52px 280px minmax(0, 1fr) 300px' },
        }}
      >
        {/* rail */}
        <Paper variant="outlined" sx={{ display: { xs: 'none', lg: 'flex' }, flexDirection: 'column', alignItems: 'center', py: 1, gap: 0.5, alignSelf: 'start' }}>
          {rail.map((r) => (
            <IconButton key={r.label} size="small" onClick={() => notice(`${r.label}はモック対象外です`)}>
              {r.icon}
            </IconButton>
          ))}
        </Paper>

        {/* bulletins */}
        <Paper variant="outlined" sx={{ display: 'flex', flexDirection: 'column', minHeight: 120 }}>
          <Box sx={{ px: 1.5, py: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: 1, borderColor: 'divider' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main' }}>
              掲示板
            </Typography>
            <Button size="small" onClick={() => setRead(BULLETINS.map((b) => b.id))}>
              すべて既読
            </Button>
          </Box>
          <Box sx={{ overflow: 'auto', flex: 1 }}>
            <BulletinList compact items={BULLETINS} read={read} onRead={onRead} />
          </Box>
        </Paper>

        {/* schedule */}
        <Paper variant="outlined" sx={{ display: 'flex', flexDirection: 'column', minHeight: 320 }}>
          <Box sx={{ px: 1.5, py: 0.5, display: 'flex', alignItems: 'center', gap: 0.5, borderBottom: 1, borderColor: 'divider', flexWrap: 'wrap' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
              {fmtShort(date)}
            </Typography>
            <Box sx={{ flex: 1 }} />
            <IconButton size="small" disabled={date <= RANGE_START} onClick={() => setDate(addDays(date, -1))}>
              <ChevronLeftIcon />
            </IconButton>
            <Button size="small" disabled={date === TODAY} onClick={() => setDate(TODAY)}>
              今日
            </Button>
            <IconButton size="small" disabled={date >= RANGE_END} onClick={() => setDate(addDays(date, 1))}>
              <ChevronRightIcon />
            </IconButton>
            <Button size="small" startIcon={<AddIcon />} onClick={() => setAddOpen(true)}>
              予定
            </Button>
          </Box>
          {allDay.length > 0 && (
            <Box sx={{ px: 1.5, py: 0.5, display: 'flex', gap: 0.5, flexWrap: 'wrap', borderBottom: 1, borderColor: 'divider' }}>
              <Chip label="全日" size="small" color="primary" variant="outlined" />
              {allDay.map((c) => (
                <Chip key={c.id} label={c.title} size="small" onDelete={() => setCustom(custom.filter((x) => x.id !== c.id))} />
              ))}
            </Box>
          )}
          <Box sx={{ overflow: 'auto', flex: 1, p: 1.5 }}>
            {events.length === 0 && timedCustom.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
                予定はありません。
              </Typography>
            ) : (
              <Box sx={{ position: 'relative', height: (SPAN / 60) * ROW_H }}>
                {Array.from({ length: SPAN / 60 + 1 }, (_, i) => H_START / 60 + i).map((h) => (
                  <Box key={h} sx={{ position: 'absolute', left: 0, right: 0, top: pct(h * 60), borderTop: 1, borderColor: 'divider' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ position: 'absolute', top: -8, left: 0, bgcolor: 'background.paper', px: 0.5, lineHeight: 1.4 }}>
                      {h}:00
                    </Typography>
                  </Box>
                ))}
                {events.map((ev) => {
                  const top = pct(toMin(ev.start))
                  const height = ((toMin(ev.end) - toMin(ev.start)) / SPAN) * 100
                  const active = selId === ev.id
                  return (
                    <ButtonBase
                      key={ev.id}
                      onClick={() => setSelId(ev.id)}
                      sx={{
                        position: 'absolute',
                        left: 44,
                        right: 4,
                        top,
                        height: `${height}%`,
                        display: 'block',
                        textAlign: 'left',
                        p: 0.5,
                        borderRadius: 0.5,
                        overflow: 'hidden',
                        bgcolor: active ? 'primary.main' : 'rgba(10,107,74,.12)',
                        color: active ? '#fff' : 'text.primary',
                        borderLeft: 3,
                        borderColor: 'primary.main',
                      }}
                    >
                      <Typography variant="caption" noWrap sx={{ fontWeight: 700, display: 'block', fontVariantNumeric: 'tabular-nums' }}>
                        {ev.start}–{ev.end} {ev.title}
                      </Typography>
                      <Typography variant="caption" noWrap sx={{ display: 'block', opacity: 0.8 }}>
                        {ev.room}
                      </Typography>
                    </ButtonBase>
                  )
                })}
                {timedCustom.map((c) => {
                  const top = pct(toMin(c.start!))
                  const endMin = c.end ? toMin(c.end) : toMin(c.start!) + 60
                  const height = ((endMin - toMin(c.start!)) / SPAN) * 100
                  return (
                    <ButtonBase
                      key={c.id}
                      onClick={() => setSelId(c.id)}
                      sx={{
                        position: 'absolute',
                        left: 44,
                        right: 4,
                        top,
                        height: `${height}%`,
                        display: 'block',
                        textAlign: 'left',
                        p: 0.5,
                        borderRadius: 0.5,
                        overflow: 'hidden',
                        bgcolor: selId === c.id ? 'action.selected' : 'action.hover',
                        borderLeft: 3,
                        borderColor: 'divider',
                      }}
                    >
                      <Typography variant="caption" noWrap sx={{ fontWeight: 700, display: 'block' }}>
                        {c.start}
                        {c.end ? `–${c.end}` : ''} {c.title}
                      </Typography>
                    </ButtonBase>
                  )
                })}
              </Box>
            )}
          </Box>
        </Paper>

        {/* detail + month + links */}
        <Paper variant="outlined" sx={{ display: 'flex', flexDirection: 'column', overflow: 'auto', minHeight: 200 }}>
          {(selClass || selCustom) && (
            <>
              <Box sx={{ p: 1.5 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                  {selClass ? selClass.title : selCustom!.title}
                </Typography>
                {selClass && (
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    {fmtShort(selClass.date)} {selClass.start}–{selClass.end} ・ {selClass.room} ・ {selClass.teacher}
                  </Typography>
                )}
                {selCustom && (
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    {fmtShort(selCustom.date)} {selCustom.start}
                    {selCustom.end ? `–${selCustom.end}` : ''}
                  </Typography>
                )}
              </Box>
              {selClass && (
                <Box sx={{ p: 1.5, pt: 0 }}>
                  <ClassActions
                    key={selClass.id}
                    ev={selClass}
                    memo={memos[selClass.id] ?? ''}
                    onMemo={(v) => setMemos({ ...memos, [selClass.id]: v })}
                    onMock={notice}
                  />
                </Box>
              )}
              <Divider />
            </>
          )}
          <Box sx={{ p: 1.5 }}>
            <MonthGrid year={2026} month={10} selected={date} dotDates={dotDates} onSelect={setDate} />
          </Box>
          <Divider />
          <LinksList />
        </Paper>
      </Box>

      {noticeNode}
      <AddEventDialog
        open={addOpen}
        date={date}
        onClose={() => setAddOpen(false)}
        onAdd={(e) => setCustom([...custom, { ...e, id: `c${Date.now()}` }])}
      />
    </Box>
  )
}
