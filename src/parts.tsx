import { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ButtonBase from '@mui/material/ButtonBase'
import Chip from '@mui/material/Chip'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import LinearProgress from '@mui/material/LinearProgress'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Paper from '@mui/material/Paper'
import Snackbar from '@mui/material/Snackbar'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import CheckIcon from '@mui/icons-material/Check'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { LINKS, TODAY, fmtShort, fmtSlash, pad2 } from './data'
import type { Bulletin, ClassEvent, CustomEvent, CourseInfo } from './data'

/** Snackbar + its setter, ready to drop into a variant. */
export function useNotice() {
  const [msg, setMsg] = useState<string | null>(null)
  const node = (
    <Snackbar
      open={msg !== null}
      autoHideDuration={2400}
      onClose={() => setMsg(null)}
      message={msg ?? undefined}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    />
  )
  return [node, setMsg] as const
}

/** Attendance rate + syllabus/class profile buttons + class memo, shared by all variants. */
export function ClassActions({
  ev,
  memo,
  onMemo,
  onMock,
}: {
  ev: ClassEvent
  memo: string
  onMemo: (v: string) => void
  onMock: (label: string) => void
}) {
  const [draft, setDraft] = useState(memo)
  const dirty = draft !== memo
  return (
    <Box sx={{ mt: 1.5, display: 'grid', gap: 1.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Typography variant="body2" color="text.secondary" sx={{ flexShrink: 0 }}>
          出席率
        </Typography>
        <LinearProgress
          variant="determinate"
          value={ev.attendance}
          sx={{ flex: 1, maxWidth: 320, height: 6, borderRadius: 3 }}
        />
        <Typography variant="body2" sx={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
          {ev.attendance}%
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Button
          size="small"
          variant="outlined"
          startIcon={<MenuBookIcon />}
          onClick={() => onMock('シラバス照会はモック対象外です')}
        >
          シラバス照会
        </Button>
        <Button size="small" variant="outlined" onClick={() => onMock('ClassProfileはモック対象外です')}>
          ClassProfile
        </Button>
      </Box>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          size="small"
          fullWidth
          placeholder="クラスメモを編集"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
        />
        <Button
          variant={dirty ? 'contained' : 'outlined'}
          disabled={!dirty}
          startIcon={dirty ? undefined : <CheckIcon />}
          onClick={() => onMemo(draft)}
          sx={{ flexShrink: 0 }}
        >
          {dirty ? '登録' : '登録済み'}
        </Button>
      </Box>
    </Box>
  )
}

/** A class period card used in the day views. */
export function ClassCard({
  ev,
  memo,
  onMemo,
  onMock,
}: {
  ev: ClassEvent
  memo: string
  onMemo: (v: string) => void
  onMock: (label: string) => void
}) {
  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'baseline', flexWrap: 'wrap' }}>
        <Typography sx={{ fontVariantNumeric: 'tabular-nums', fontWeight: 700 }}>
          {ev.start}–{ev.end}
        </Typography>
        <Typography variant="h6" component="h3" sx={{ fontWeight: 700 }}>
          {ev.title}
        </Typography>
      </Box>
      <Typography variant="body2" color="text.secondary">
        {ev.teacher} ・ {ev.room}
      </Typography>
      <ClassActions ev={ev} memo={memo} onMemo={onMemo} onMock={onMock} />
    </Paper>
  )
}

/** Bulletin rows; a click marks the item read. compact = one line (command center). */
export function BulletinList({
  items,
  read,
  onRead,
  compact = false,
}: {
  items: Bulletin[]
  read: string[]
  onRead: (id: string) => void
  compact?: boolean
}) {
  return (
    <List dense disablePadding>
      {items.map((b) => {
        const unread = !read.includes(b.id)
        return (
          <ListItemButton key={b.id} onClick={() => onRead(b.id)} sx={{ alignItems: 'flex-start', px: 2, py: 1 }}>
            <Box
              sx={{
                mr: 1.25,
                mt: '7px',
                width: 8,
                height: 8,
                borderRadius: '50%',
                flexShrink: 0,
                bgcolor: unread ? (b.urgent ? 'error.main' : 'primary.main') : 'transparent',
                border: unread ? 0 : 1,
                borderColor: 'divider',
              }}
            />
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', gap: 0.75, alignItems: 'flex-start' }}>
                  <Typography
                    component="span"
                    variant="body2"
                    sx={
                      compact
                        ? { fontWeight: unread ? 700 : 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }
                        : {
                            fontWeight: unread ? 700 : 400,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }
                    }
                  >
                    {b.title}
                  </Typography>
                  {b.isNew && (
                    <Chip
                      size="small"
                      color="error"
                      label="NEW"
                      sx={{ height: 18, fontSize: 10, fontWeight: 700, flexShrink: 0, mt: '1px' }}
                    />
                  )}
                </Box>
              }
              secondary={
                compact
                  ? undefined
                  : `${fmtSlash(b.date)} ${b.from}${b.deadline ? ` ・ 締切 ${fmtSlash(b.deadline)}` : ''}`
              }
            />
          </ListItemButton>
        )
      })}
      {items.length === 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ px: 2, py: 2 }}>
          該当する掲示はありません。
        </Typography>
      )}
    </List>
  )
}

/** Dialog to add a personal event on the given date. */
export function AddEventDialog({
  open,
  date,
  onClose,
  onAdd,
}: {
  open: boolean
  date: string
  onClose: () => void
  onAdd: (e: Omit<CustomEvent, 'id'>) => void
}) {
  const [title, setTitle] = useState('')
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const submit = () => {
    if (!title.trim()) return
    onAdd({ date, title: title.trim(), start: start || undefined, end: end || undefined })
    setTitle('')
    setStart('')
    setEnd('')
    onClose()
  }
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>My予定を追加({fmtShort(date)})</DialogTitle>
      <DialogContent sx={{ display: 'grid', gap: 2, pt: 1 }}>
        <TextField
          label="タイトル"
          value={title}
          autoFocus
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
        />
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField label="開始" type="time" value={start} onChange={(e) => setStart(e.target.value)} sx={{ flex: 1 }} />
          <TextField label="終了" type="time" value={end} onChange={(e) => setEnd(e.target.value)} sx={{ flex: 1 }} />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>キャンセル</Button>
        <Button variant="contained" onClick={submit} disabled={!title.trim()}>
          追加
        </Button>
      </DialogActions>
    </Dialog>
  )
}

/** Month calendar with event dots; the selected day is outlined. */
export function MonthGrid({
  year,
  month,
  selected,
  dotDates,
  onSelect,
}: {
  year: number
  month: number
  selected: string
  dotDates: Set<string>
  onSelect: (iso: string) => void
}) {
  const blanks = new Date(year, month - 1, 1).getDay()
  const days = new Date(year, month, 0).getDate()
  const cells: (number | null)[] = [
    ...Array<null>(blanks).fill(null),
    ...Array.from({ length: days }, (_, i) => i + 1),
  ]
  return (
    <Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', mb: 0.5 }}>
        {['日', '月', '火', '水', '木', '金', '土'].map((w, i) => (
          <Typography
            key={w}
            variant="caption"
            sx={{ textAlign: 'center', fontWeight: 600, color: i === 0 ? 'error.main' : i === 6 ? 'primary.main' : 'text.secondary' }}
          >
            {w}
          </Typography>
        ))}
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.25 }}>
        {cells.map((d, i) =>
          d === null ? (
            <Box key={`b${i}`} />
          ) : (
            <ButtonBase
              key={d}
              onClick={() => onSelect(`${year}-${pad2(month)}-${pad2(d)}`)}
              sx={{
                display: 'grid',
                placeItems: 'center',
                py: 0.75,
                borderRadius: 1,
                border: 1,
                borderColor: `${year}-${pad2(month)}-${pad2(d)}` === selected ? 'primary.main' : 'transparent',
                bgcolor: `${year}-${pad2(month)}-${pad2(d)}` === TODAY ? 'action.hover' : 'transparent',
              }}
            >
              <Typography variant="body2" sx={{ fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
                {d}
              </Typography>
              <Box
                sx={{
                  width: 4,
                  height: 4,
                  borderRadius: '50%',
                  mt: 0.25,
                  bgcolor: dotDates.has(`${year}-${pad2(month)}-${pad2(d)}`) ? 'primary.main' : 'transparent',
                }}
              />
            </ButtonBase>
          ),
        )}
      </Box>
    </Box>
  )
}

/** Registered courses with attendance rates. */
export function CourseList({ courses }: { courses: CourseInfo[] }) {
  return (
    <List dense disablePadding>
      {courses.map((c) => (
        <ListItem
          key={c.title}
          divider
          secondaryAction={
            <Typography variant="body2" sx={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
              {c.attendance}%
            </Typography>
          }
        >
          <ListItemText primary={c.title} secondary={`${c.teacher} ・ ${c.room}`} />
        </ListItem>
      ))}
    </List>
  )
}

/** External link list. */
export function LinksList() {
  return (
    <List dense disablePadding>
      {LINKS.map((l) => (
        <ListItemButton key={l.label} component="a" href={l.url} target="_blank" rel="noreferrer" dense>
          <ListItemText
            primary={l.label}
            slotProps={{ primary: { variant: 'body2', sx: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } } }}
          />
          <OpenInNewIcon fontSize="small" sx={{ color: 'text.secondary', ml: 1 }} />
        </ListItemButton>
      ))}
    </List>
  )
}
