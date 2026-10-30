import { useState } from 'react'
import AppBar from '@mui/material/AppBar'
import Badge from '@mui/material/Badge'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ButtonBase from '@mui/material/ButtonBase'
import Chip from '@mui/material/Chip'
import Container from '@mui/material/Container'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import AddIcon from '@mui/icons-material/Add'
import AssignmentIcon from '@mui/icons-material/Assignment'
import CampaignIcon from '@mui/icons-material/Campaign'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import DeleteIcon from '@mui/icons-material/Delete'
import LogoutIcon from '@mui/icons-material/Logout'
import PersonSearchIcon from '@mui/icons-material/PersonSearch'
import SettingsIcon from '@mui/icons-material/Settings'
import StarIcon from '@mui/icons-material/Star'
import TodayIcon from '@mui/icons-material/Today'
import { BULLETINS, CLASSES, COURSES, RANGE_END, RANGE_START, TODAY, addDays, classesOn, fmtJP } from './data'
import type { CustomEvent } from './data'
import { useStored } from './state'
import { AddEventDialog, BulletinList, ClassCard, CourseList, LinksList, MonthGrid, useNotice } from './parts'

const NAV = ['プロダクト共通', '共通', '学務', '履修関連', '資格・試験・出席', 'MyStep登録']

/** V1 — familiar: the original portal, modernized one-to-one. AppBar + sidebar + cards. */
export default function VariantFamiliar() {
  const [noticeNode, notice] = useNotice()
  const [tab, setTab] = useState<'day' | 'month' | 'courses'>('day')
  const [date, setDate] = useState(TODAY)
  const [bulletinTab, setBulletinTab] = useState<'urgent' | 'deadline'>('urgent')
  const [showAll, setShowAll] = useState(false)
  const [addOpen, setAddOpen] = useState(false)
  const [read, setRead] = useStored<string[]>('read', [])
  const [memos, setMemos] = useStored<Record<string, string>>('memos', {})
  const [custom, setCustom] = useStored<CustomEvent[]>('custom', [])

  const unread = BULLETINS.filter((b) => !read.includes(b.id)).length
  const onRead = (id: string) => setRead(read.includes(id) ? read : [...read, id])
  const filtered = BULLETINS.filter((b) => (bulletinTab === 'urgent' ? b.urgent : b.deadline !== undefined))
  const shown = showAll ? filtered : filtered.slice(0, 3)

  const events = classesOn(date)
  const dayCustom = custom.filter((c) => c.date === date)
  const allDay = dayCustom.filter((c) => !c.start)
  const timedCustom = dayCustom.filter((c) => c.start)
  const dotDates = new Set([...CLASSES.map((c) => c.date), ...custom.map((c) => c.date)])

  const tiles = [
    { label: '掲示板', icon: <CampaignIcon />, badge: unread, act: () => setShowAll(true) },
    { label: '時間割変更', icon: <CalendarMonthIcon />, act: () => setTab('month') },
    { label: 'MyStep', icon: <AssignmentIcon />, act: () => notice('MyStepはモック対象外です') },
    { label: 'ClassProfile', icon: <PersonSearchIcon />, act: () => notice('ClassProfile一覧はモック対象外です') },
  ]

  return (
    <Box sx={{ minHeight: '100dvh', pb: 10 }}>
      <AppBar position="sticky" elevation={0}>
        <Toolbar sx={{ gap: 1.5 }}>
          <Box
            sx={{ bgcolor: '#fff', color: 'primary.main', width: 36, height: 36, borderRadius: 1, display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: 15 }}
          >
            iU
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 800, letterSpacing: 0.5, lineHeight: 1.2 }}>
              UNIVERSAL PASSPORT RX
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              GAKUEN SERIES
            </Typography>
          </Box>
          <Box sx={{ flex: 1 }} />
          <Box sx={{ display: { xs: 'none', sm: 'block' }, textAlign: 'right' }}>
            <Typography variant="body2">山田 太郎 -san</Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              前回ログイン 2026/10/22 17:58
            </Typography>
          </Box>
          <IconButton color="inherit" onClick={() => notice('設定はモック対象外です')}>
            <SettingsIcon />
          </IconButton>
          <IconButton color="inherit" onClick={() => notice('お気に入りはモック対象外です')}>
            <StarIcon />
          </IconButton>
          <IconButton color="inherit" onClick={() => notice('ログアウトはモック対象外です')}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
        <Tabs value={false} onChange={() => notice('ホーム画面のみのモックです')} textColor="inherit" indicatorColor="secondary" variant="scrollable" scrollButtons="auto" sx={{ px: 2 }}>
          {NAV.map((n) => (
            <Tab key={n} label={n} />
          ))}
        </Tabs>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: { xs: 2, md: 3 } }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 5, lg: 3 }} sx={{ display: 'grid', gap: 2, alignContent: 'start' }}>
            <Paper variant="outlined">
              <Box sx={{ px: 2, pt: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  掲示板
                </Typography>
                <Chip size="small" color="error" label={`未読 ${unread}`} />
              </Box>
              <Tabs value={bulletinTab} onChange={(_, x) => setBulletinTab(x)} sx={{ px: 1 }}>
                <Tab value="urgent" label="重要" />
                <Tab value="deadline" label="期限あり" />
              </Tabs>
              <Divider />
              <BulletinList items={shown} read={read} onRead={onRead} />
              {filtered.length > 3 && (
                <Button fullWidth size="small" onClick={() => setShowAll((s) => !s)}>
                  {showAll ? '折りたたむ' : 'さらに表示'}
                </Button>
              )}
            </Paper>

            <Paper variant="outlined" sx={{ p: 1 }}>
              <Typography variant="subtitle2" sx={{ px: 1, py: 0.75, fontWeight: 700, color: 'primary.main' }}>
                ショートカット
              </Typography>
              <Grid container spacing={1}>
                {tiles.map((t) => (
                  <Grid size={6} key={t.label}>
                    <ButtonBase
                      onClick={t.act}
                      sx={{ width: '100%', flexDirection: 'column', gap: 0.5, py: 1.5, borderRadius: 1, border: '1px solid', borderColor: 'divider' }}
                    >
                      <Badge badgeContent={t.badge} color="error" max={99}>
                        {t.icon}
                      </Badge>
                      <Typography variant="caption">{t.label}</Typography>
                    </ButtonBase>
                  </Grid>
                ))}
              </Grid>
            </Paper>

            <Paper variant="outlined">
              <Typography variant="subtitle2" sx={{ px: 2, py: 1, fontWeight: 700, color: 'primary.main' }}>
                リンク
              </Typography>
              <Divider />
              <LinksList />
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 7, lg: 9 }}>
            <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tab} onChange={(_, x) => setTab(x)}>
                  <Tab value="day" label="日別" />
                  <Tab value="month" label="月別" />
                  <Tab value="courses" label="履修済み" />
                </Tabs>
                {tab === 'day' && (
                  <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 0.5, px: 1.5, py: 0.5 }}>
                    <IconButton size="small" disabled={date <= RANGE_START} onClick={() => setDate(addDays(date, -1))}>
                      <ChevronLeftIcon />
                    </IconButton>
                    <Button size="small" startIcon={<TodayIcon />} disabled={date === TODAY} onClick={() => setDate(TODAY)}>
                      今日
                    </Button>
                    <IconButton size="small" disabled={date >= RANGE_END} onClick={() => setDate(addDays(date, 1))}>
                      <ChevronRightIcon />
                    </IconButton>
                  </Box>
                )}
              </Box>

              {tab === 'day' && (
                <Box sx={{ p: { xs: 1.5, md: 2.5 }, display: 'grid', gap: 2 }}>
                  <Typography variant="h5" sx={{ fontWeight: 800 }}>
                    {fmtJP(date)}
                    {date === TODAY && (
                      <Chip size="small" color="primary" label="今日" sx={{ ml: 1, verticalAlign: 'middle' }} />
                    )}
                  </Typography>
                  {allDay.length > 0 && (
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip label="全日" size="small" color="primary" variant="outlined" />
                      {allDay.map((c) => (
                        <Chip
                          key={c.id}
                          label={c.title}
                          size="small"
                          onDelete={() => setCustom(custom.filter((x) => x.id !== c.id))}
                        />
                      ))}
                    </Box>
                  )}
                  {events.map((ev) => (
                    <ClassCard
                      key={ev.id}
                      ev={ev}
                      memo={memos[ev.id] ?? ''}
                      onMemo={(v) => setMemos({ ...memos, [ev.id]: v })}
                      onMock={notice}
                    />
                  ))}
                  {timedCustom.map((c) => (
                    <Paper key={c.id} variant="outlined" sx={{ p: 2, display: 'flex', gap: 1.5, alignItems: 'center' }}>
                      <Typography sx={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                        {c.start}
                        {c.end ? `–${c.end}` : ''}
                      </Typography>
                      <Typography sx={{ flex: 1 }}>{c.title}</Typography>
                      <IconButton size="small" onClick={() => setCustom(custom.filter((x) => x.id !== c.id))}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Paper>
                  ))}
                  {events.length === 0 && timedCustom.length === 0 && allDay.length === 0 && (
                    <Typography color="text.secondary">予定はありません。</Typography>
                  )}
                  <Box>
                    <Button size="small" startIcon={<AddIcon />} onClick={() => setAddOpen(true)}>
                      My予定を追加
                    </Button>
                  </Box>
                </Box>
              )}
              {tab === 'month' && (
                <Box sx={{ p: 2 }}>
                  <MonthGrid
                    year={2026}
                    month={10}
                    selected={date}
                    dotDates={dotDates}
                    onSelect={(iso) => {
                      setDate(iso)
                      setTab('day')
                    }}
                  />
                </Box>
              )}
              {tab === 'courses' && (
                <Box sx={{ p: 1 }}>
                  <CourseList courses={COURSES} />
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>

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
