export type Locale = 'zh' | 'en'
export type TimeZone = 'Asia/Shanghai' | 'Europe/London' | 'America/New_York' | 'Asia/Tokyo'
export type ReservationStatus = 'pending' | 'approved' | 'rejected' | 'cancelled' | 'checked-in'
export type MeetingId = 'media' | 'ai' | 'mobility'

export type Meeting = {
  id: MeetingId
  title: { zh: string; en: string }
  type: string
  time: string
  local: string
  source: string
  sourceTimezone: TimeZone
  tone: 'cool' | 'warm' | 'mint'
  tag: string
  capacity: number
  venue: string
}

export type Reservation = {
  id: string
  owner: 'liuchen' | 'sofia'
  attendeeName: string
  organization: string
  meetingId: MeetingId
  status: ReservationStatus
  createdAt: string
  hasConflict: boolean
  alternativeSlot?: boolean
  reason?: string
  checkinCode?: string
}

export type DemoNotice = {
  id: string
  kind: 'approved' | 'rejected' | 'submitted' | 'cancelled' | 'change'
  title: string
  detail: string
  createdAt: string
  read: boolean
}

export type AuditEvent = {
  id: string
  type: string
  detail: string
  createdAt: string
}

export type DemoState = {
  version: 1
  locale: Locale
  timezone: TimeZone
  reservations: Reservation[]
  notices: DemoNotice[]
  audits: AuditEvent[]
}

export const DEMO_STATE_KEY = 'globmeet-demo-state-v1'

export const meetings: Meeting[] = [
  {
    id: 'media',
    title: { zh: '全球媒体创新论坛', en: 'Global Media Innovation Forum' },
    type: 'Hybrid',
    time: '09:30-11:00',
    local: '上海',
    source: 'London 02:30',
    sourceTimezone: 'Europe/London',
    tone: 'cool',
    tag: '推荐',
    capacity: 60,
    venue: 'Harbor Hall A + Online',
  },
  {
    id: 'ai',
    title: { zh: 'AI 内容交流会', en: 'AI Content Exchange' },
    type: 'Online',
    time: '13:00-14:30',
    local: '上海',
    source: 'New York 01:00',
    sourceTimezone: 'America/New_York',
    tone: 'warm',
    tag: '可预约',
    capacity: 40,
    venue: 'Harbor Hall B',
  },
  {
    id: 'mobility',
    title: { zh: '城市出行圆桌会', en: 'Urban Mobility Roundtable' },
    type: 'Harbor Hall B',
    time: '16:00-17:00',
    local: '上海',
    source: 'Tokyo 17:00',
    sourceTimezone: 'Asia/Tokyo',
    tone: 'mint',
    tag: '时间冲突',
    capacity: 20,
    venue: 'Harbor Hall B',
  },
]

export function meetingById(id: string | null) {
  return meetings.find((meeting) => meeting.id === id) ?? meetings[0]
}

export function meetingName(meeting: Meeting, locale: Locale) {
  return meeting.title[locale]
}

export function statusLabel(status: ReservationStatus) {
  return ({ pending: '待审核', approved: '已批准', rejected: '已拒绝', cancelled: '已取消', 'checked-in': '已签到' })[status]
}

export function seedDemoState(): DemoState {
  return {
    version: 1,
    locale: 'zh',
    timezone: 'Asia/Shanghai',
    reservations: [
      {
        id: 'GM-2026-019',
        owner: 'liuchen',
        attendeeName: '薛花花',
        organization: 'Northstar Studio · 上海',
        meetingId: 'media',
        status: 'approved',
        createdAt: '09 Aug 09:16',
        hasConflict: false,
        checkinCode: 'GM-0826-019',
      },
      {
        id: 'GM-2026-018',
        owner: 'sofia',
        attendeeName: 'Sofia Martin',
        organization: 'Skyline Media · London',
        meetingId: 'ai',
        status: 'pending',
        createdAt: '09 Aug 09:10',
        hasConflict: true,
      },
    ],
    notices: [
      {
        id: 'notice-change',
        kind: 'change',
        title: '会议地点已变更',
        detail: 'AI 内容交流会已改至 Harbor Hall B，日程已同步更新。',
        createdAt: '刚刚',
        read: false,
      },
    ],
    audits: [
      { id: 'audit-change', type: '会议地点已变更', detail: 'AI 内容交流会 · Harbor Hall B · 已通知相关参会人', createdAt: '09 Aug 09:12' },
      { id: 'audit-checkin', type: '现场核验完成', detail: 'GM-2026-019 · 全球媒体创新论坛 · 已签到', createdAt: '09 Aug 09:28' },
    ],
  }
}

export function loadDemoState(forceSeed = false): DemoState {
  if (forceSeed) return seedDemoState()
  try {
    const stored = window.localStorage.getItem(DEMO_STATE_KEY)
    if (!stored) return seedDemoState()
    const state = JSON.parse(stored) as DemoState
    if (state.version !== 1) return seedDemoState()
    return {
      ...state,
      timezone: state.timezone ?? 'Asia/Shanghai',
      reservations: state.reservations.map((reservation) => reservation.owner === 'liuchen'
        ? { ...reservation, attendeeName: '薛花花' }
        : reservation),
    }
  } catch {
    return seedDemoState()
  }
}

export function persistDemoState(state: DemoState) {
  window.localStorage.setItem(DEMO_STATE_KEY, JSON.stringify(state))
}

function appendAudit(state: DemoState, type: string, detail: string): DemoState {
  return {
    ...state,
    audits: [{ id: `audit-${Date.now()}`, type, detail, createdAt: '刚刚' }, ...state.audits],
  }
}

function appendNotice(state: DemoState, kind: DemoNotice['kind'], title: string, detail: string): DemoState {
  return {
    ...state,
    notices: [{ id: `notice-${Date.now()}`, kind, title, detail, createdAt: '刚刚', read: false }, ...state.notices],
  }
}

export function reservationForOwner(state: DemoState, meetingId: MeetingId, owner: Reservation['owner'] = 'liuchen') {
  return state.reservations.find((reservation) => reservation.owner === owner && reservation.meetingId === meetingId && !['rejected', 'cancelled'].includes(reservation.status))
}

export function submitReservation(state: DemoState, meetingId: MeetingId, hasConflict: boolean, alternativeSlot = false) {
  const existing = reservationForOwner(state, meetingId)
  if (existing) return { state, reservation: existing, error: '你已提交过这场会议的预约，请在“我的”查看进度。' }
  const sequence = 20 + state.reservations.filter((reservation) => reservation.owner === 'liuchen').length
  const reservation: Reservation = {
    id: `GM-2026-${String(sequence).padStart(3, '0')}`,
    owner: 'liuchen',
    attendeeName: '薛花花',
    organization: 'Northstar Studio · 上海',
    meetingId,
    status: 'pending',
    createdAt: '刚刚',
    hasConflict,
    alternativeSlot,
  }
  const meeting = meetingById(meetingId)
  let next = { ...state, reservations: [reservation, ...state.reservations] }
  next = appendNotice(next, 'submitted', '预约已提交', `${meeting.title.zh} 已进入会务审核。`)
  next = appendAudit(next, '提交预约申请', `${reservation.id} · ${meeting.title.zh} · 待审核`)
  return { state: next, reservation }
}

export function approveReservation(state: DemoState, reservationId: string) {
  const reservation = state.reservations.find((item) => item.id === reservationId)
  if (!reservation || reservation.status !== 'pending') return { state, error: '该申请已处理，请刷新待办列表。' }
  const meeting = meetingById(reservation.meetingId)
  const occupied = state.reservations.filter((item) => item.meetingId === meeting.id && ['approved', 'checked-in'].includes(item.status)).length
  if (occupied >= meeting.capacity) return { state, error: '会议已满员，暂时无法批准该申请。' }
  const updated = { ...reservation, status: 'approved' as const, checkinCode: `GM-0826-${reservation.id.slice(-3)}` }
  let next = { ...state, reservations: state.reservations.map((item) => item.id === reservationId ? updated : item) }
  if (reservation.owner === 'liuchen') next = appendNotice(next, 'approved', '预约已获批准', `${meeting.title.zh} 已加入你的日程，并生成现场核验码。`)
  next = appendAudit(next, '批准预约', `${reservation.id} · ${meeting.title.zh} · 会务人员`)
  return { state: next, reservation: updated }
}

export function rejectReservation(state: DemoState, reservationId: string, reason: string) {
  const reservation = state.reservations.find((item) => item.id === reservationId)
  if (!reservation || reservation.status !== 'pending') return { state, error: '该申请已处理，请刷新待办列表。' }
  if (!reason.trim()) return { state, error: '请填写拒绝原因后再提交。' }
  const meeting = meetingById(reservation.meetingId)
  const updated = { ...reservation, status: 'rejected' as const, reason: reason.trim() }
  let next = { ...state, reservations: state.reservations.map((item) => item.id === reservationId ? updated : item) }
  if (reservation.owner === 'liuchen') next = appendNotice(next, 'rejected', '预约未获批准', `${meeting.title.zh}：${updated.reason}`)
  next = appendAudit(next, '拒绝预约', `${reservation.id} · ${meeting.title.zh} · ${updated.reason}`)
  return { state: next, reservation: updated }
}

export function cancelReservation(state: DemoState, reservationId: string) {
  const reservation = state.reservations.find((item) => item.id === reservationId)
  if (!reservation || !['pending', 'approved'].includes(reservation.status)) return { state, error: '当前预约不可取消。' }
  const meeting = meetingById(reservation.meetingId)
  const updated = { ...reservation, status: 'cancelled' as const, reason: '参会人员取消预约' }
  let next = { ...state, reservations: state.reservations.map((item) => item.id === reservationId ? updated : item) }
  next = appendNotice(next, 'cancelled', '预约已取消', `${meeting.title.zh} 已从你的日程和核验资格中移除。`)
  next = appendAudit(next, '取消预约', `${reservation.id} · ${meeting.title.zh} · 参会人员`)
  return { state: next, reservation: updated }
}
