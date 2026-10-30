// Data model + mock content for the UNIPA modern redesign demo.
// "Today" is pinned to the date in the original screenshot so the demo is deterministic.

export interface ClassEvent {
  id: string
  date: string // YYYY-MM-DD
  start: string // HH:MM
  end: string
  title: string
  teacher: string
  room: string
  attendance: number // percent
}

export interface CustomEvent {
  id: string
  date: string
  title: string
  start?: string
  end?: string
}

export interface Bulletin {
  id: string
  date: string
  title: string
  from: string
  urgent: boolean
  isNew: boolean
  deadline?: string
}

export interface CourseInfo {
  title: string
  teacher: string
  room: string
  attendance: number
}

export const TODAY = '2026-10-23'
export const RANGE_START = '2026-10-19' // Mon
export const RANGE_END = '2026-11-01' // Sun

export const pad2 = (n: number) => String(n).padStart(2, '0')

export function toISO(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
}

export function fromISO(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function addDays(iso: string, n: number): string {
  const d = fromISO(iso)
  d.setDate(d.getDate() + n)
  return toISO(d)
}

const WD = ['日', '月', '火', '水', '木', '金', '土']
export const weekday = (iso: string) => WD[fromISO(iso).getDay()]
export const fmtJP = (iso: string) => {
  const d = fromISO(iso)
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日(${weekday(iso)})`
}
export const fmtShort = (iso: string) => {
  const d = fromISO(iso)
  return `${d.getMonth() + 1}/${d.getDate()}(${weekday(iso)})`
}
export const fmtSlash = (iso: string) => iso.replaceAll('-', '/')

// Weekly timetable (getDay(): Mon=1 .. Fri=5)
type Slot = Omit<ClassEvent, 'id' | 'date'>
const WEEK: Record<number, Slot[]> = {
  1: [
    { start: '10:40', end: '12:10', title: 'データサイエンス入門', teacher: '佐藤 美咲', room: '講義室 A-1', attendance: 85.7 },
    { start: '13:00', end: '14:30', title: 'キャリアデザイン', teacher: '川島 健太', room: '講義室 B-2', attendance: 90.5 },
  ],
  2: [
    { start: '09:00', end: '10:30', title: '実務英語', teacher: 'Jennifer Smith', room: '講義室 C-1', attendance: 71.4 },
    { start: '10:40', end: '12:10', title: 'Pythonプログラミング基礎', teacher: '中村 亮', room: '演習室 2-1', attendance: 88.9 },
    { start: '13:00', end: '14:30', title: '経営学概論', teacher: '山本 誠', room: '講義室 A-2', attendance: 76.2 },
  ],
  3: [
    { start: '13:00', end: '14:30', title: 'マーケティング論', teacher: '田中 裕子', room: '講義室 B-1', attendance: 81.0 },
    { start: '14:40', end: '16:10', title: 'Webデザイン演習', teacher: '小林 真理', room: '演習室 3-2', attendance: 95.2 },
  ],
  4: [
    { start: '10:40', end: '12:10', title: '情報リテラシー', teacher: '鈴木 一郎', room: '演習室 1-1', attendance: 92.9 },
    { start: '13:00', end: '14:30', title: '会計学入門', teacher: '渡辺 翔太', room: '講義室 C-2', attendance: 69.0 },
  ],
  5: [
    { start: '10:40', end: '12:10', title: '統計学基礎', teacher: '伊藤 健一', room: '講義室 A-1', attendance: 84.2 },
    { start: '13:00', end: '14:30', title: 'Practice of System Design', teacher: 'Toyohisa Nakada', room: '演習室 3-1', attendance: 66.7 },
  ],
}

// 統計学基礎 is canceled on 10/23 so that day matches the original screen exactly.
const CANCELED = new Set(['2026-10-23-10:40'])

export const CLASSES: ClassEvent[] = (() => {
  const out: ClassEvent[] = []
  for (let iso = RANGE_START; iso <= RANGE_END; iso = addDays(iso, 1)) {
    for (const s of WEEK[fromISO(iso).getDay()] ?? []) {
      const id = `${iso}-${s.start}`
      if (!CANCELED.has(id)) out.push({ ...s, date: iso, id })
    }
  }
  return out
})()

export const classesOn = (iso: string) =>
  CLASSES.filter((c) => c.date === iso).sort((a, b) => a.start.localeCompare(b.start))

export const COURSES: CourseInfo[] = (() => {
  const m = new Map<string, CourseInfo>()
  for (const s of Object.values(WEEK).flat()) {
    if (!m.has(s.title)) m.set(s.title, { title: s.title, teacher: s.teacher, room: s.room, attendance: s.attendance })
  }
  return [...m.values()]
})()

export const BULLETINS: Bulletin[] = [
  {
    id: 'b1',
    date: '2026-10-21',
    urgent: true,
    isNew: true,
    deadline: '2026-11-04',
    title: '【重要・要対応】2027年度臨地実務実習 実務先エントリー・履歴書提出について(締切11月4日厳守)',
    from: 'デベロップメントセンター 実習担当',
  },
  {
    id: 'b2',
    date: '2026-10-21',
    urgent: true,
    isNew: true,
    title: '【リマインド:重要】サーバメンテナンスに伴うUNIPAの利用停止について【11/4(水)・11/5(木)】',
    from: '事務局 教務担当',
  },
  {
    id: 'b3',
    date: '2026-10-16',
    urgent: true,
    isNew: false,
    title: '【第3学年】2026年度後期開講科目に係る履修登録の修正について(最終リマインド)',
    from: '事務局 教務担当',
  },
  {
    id: 'b4',
    date: '2026-10-14',
    urgent: true,
    isNew: false,
    deadline: '2026-10-28',
    title: '【重要・要対応】2027年度臨地実務実習 ガイダンス動画の視聴について',
    from: 'デベロップメントセンター 実習担当',
  },
  {
    id: 'b5',
    date: '2026-10-09',
    urgent: false,
    isNew: false,
    title: '【リマインド】図書館 蔵書点検に伴うサービス停止のお知らせ',
    from: '事務局 図書館担当',
  },
  {
    id: 'b6',
    date: '2026-10-02',
    urgent: false,
    isNew: false,
    title: '【奨学金】振込口座の確認のお願い',
    from: '事務局 学生支援担当',
  },
]

export const LINKS = [
  { label: 'iU情報経営イノベーション専門職大学HP', url: 'https://www.i-u.ac.jp' },
  { label: 'iU Library', url: 'https://library.i-u.ac.jp' },
  { label: 'iU Agent', url: 'https://agent.i-u.ac.jp' },
  { label: 'iU 奨学金支援', url: 'https://scholarship.i-u.ac.jp' },
]
