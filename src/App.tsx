import {
  ArrowLeft,
  Bell,
  CalendarDays,
  Check,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  Copy,
  FileText,
  Globe2,
  Languages,
  LocateFixed,
  MapPin,
  MessageSquareText,
  QrCode,
  Search,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  TicketCheck,
  UserRound,
  Users,
  X,
} from 'lucide-react'
import { createContext, useContext, useEffect, useState } from 'react'
import type { MouseEvent, ReactNode } from 'react'
import {
  approveReservation,
  cancelReservation,
  loadDemoState,
  meetingById,
  meetingName,
  meetings,
  persistDemoState,
  rejectReservation,
  reservationForOwner,
  seedDemoState,
  statusLabel,
  submitReservation,
} from './demo-state'
import type { DemoState, Locale, Meeting, MeetingId, Reservation, TimeZone } from './demo-state'

type OrganizerScreen = 'review' | 'organizer-meetings' | 'organizer-meeting-detail' | 'checkin'
type Screen = 'discover' | 'detail' | 'booking' | 'conflict' | 'application-result' | 'change-impact' | 'notice' | OrganizerScreen | 'schedule' | 'profile' | 'organizer-records' | 'admin'

const screens: Screen[] = ['discover', 'detail', 'booking', 'conflict', 'application-result', 'change-impact', 'notice', 'review', 'organizer-meetings', 'organizer-meeting-detail', 'schedule', 'profile', 'checkin', 'organizer-records', 'admin']

type AttendeeOrigin = 'discover' | 'schedule' | 'notice'

function getScreen(): Screen {
  const screen = new URLSearchParams(window.location.search).get('screen') as Screen | null
  return screen && screens.includes(screen) ? screen : 'discover'
}

function href(screen: Screen) {
  return `?screen=${screen}`
}

function screenHref(screen: Screen, params: Record<string, string> = {}) {
  const search = new URLSearchParams({ screen, ...params })
  return `?${search.toString()}`
}

function getOrigin(): AttendeeOrigin {
  const origin = new URLSearchParams(window.location.search).get('from')
  return origin === 'schedule' || origin === 'notice' ? origin : 'discover'
}

function getEntry() {
  return new URLSearchParams(window.location.search).get('entry') === 'detail' ? 'detail' : 'list'
}

function organizerHref(screen: OrganizerScreen | 'organizer-records') {
  return `?screen=${screen}&role=organizer`
}

type DemoContextValue = {
  state: DemoState
  write: (next: DemoState) => void
  setLocale: (locale: Locale) => void
  setTimezone: (timezone: TimeZone) => void
  reset: () => void
}

const DemoContext = createContext<DemoContextValue | null>(null)

function useDemo() {
  const context = useContext(DemoContext)
  if (!context) throw new Error('Demo state is unavailable')
  return context
}

function currentMeeting() {
  return meetingById(new URLSearchParams(window.location.search).get('meeting'))
}

function localizedMeetingCopy(copy: string, locale: Locale) {
  return meetings.reduce(
    (result, meeting) => result
      .replaceAll(meeting.title.zh, meetingName(meeting, locale))
      .replaceAll(meeting.title.en, meetingName(meeting, locale)),
    copy,
  )
}

function useShanghaiNow() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [])
  return now
}

const timezoneOptions: Array<{ value: TimeZone; label: string; city: string }> = [
  { value: 'Asia/Shanghai', label: '上海 UTC+8', city: '上海' },
  { value: 'Asia/Tokyo', label: '东京 UTC+9', city: '东京' },
  { value: 'Europe/London', label: '伦敦 UTC+1', city: '伦敦' },
  { value: 'America/New_York', label: '纽约 UTC-4', city: '纽约' },
]

function timezoneMeta(timezone: TimeZone) {
  return timezoneOptions.find((option) => option.value === timezone) ?? timezoneOptions[0]
}

function supportedTimezone(timezone: string): TimeZone {
  return timezoneOptions.some((option) => option.value === timezone) ? timezone as TimeZone : 'Asia/Shanghai'
}

function localTimezone(): TimeZone {
  return supportedTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone)
}

function zonedDateParts(date: Date, timezone: TimeZone) {
  const parts = new Intl.DateTimeFormat('zh-CN', {
    timeZone: timezone,
    weekday: 'short',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date)
  return Object.fromEntries(parts.map(({ type, value }) => [type, value]))
}

function formatZonedDate(date: Date, timezone: TimeZone) {
  const { weekday, month, day } = zonedDateParts(date, timezone)
  return `${weekday} · ${month}月${day}日`
}

function formatZonedDateTime(date: Date, timezone: TimeZone) {
  const { hour, minute, second } = zonedDateParts(date, timezone)
  return `${formatZonedDate(date, timezone)} · ${hour}:${minute}:${second}`
}

function formatMeetingTime(time: string, timezone: TimeZone) {
  const formatter = new Intl.DateTimeFormat('zh-CN', { timeZone: timezone, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
  const converted = time.split('-').map((value) => formatter.format(new Date(`2026-08-09T${value}:00+08:00`)))
  return converted.join('-')
}

function MeetingTimePair({ meeting, timezone, time = meeting.time }: { meeting: Meeting; timezone: TimeZone; time?: string }) {
  const localTimezone = meeting.sourceTimezone
  return <div className="meeting-time-pair" aria-label={`当地时间 ${formatMeetingTime(time, localTimezone)} ${timezoneMeta(localTimezone).label}；你的时间 ${formatMeetingTime(time, timezone)} ${timezoneMeta(timezone).label}`}>
    <p><b>当地时间 · {timezoneMeta(localTimezone).label}</b><span>{formatMeetingTime(time, localTimezone)}</span></p>
    <p><b>你的时间 · {timezoneMeta(timezone).label}</b><span>{formatMeetingTime(time, timezone)}</span></p>
  </div>
}

function LinkButton({ screen, children, variant = 'primary' }: { screen: Screen; children: ReactNode; variant?: 'primary' | 'secondary' | 'quiet' }) {
  return <a className={`button ${variant}`} href={href(screen)}>{children}</a>
}

function Brand({ organizer = false }: { organizer?: boolean }) {
  return <a href={organizer ? organizerHref('review') : href('discover')} className="brand" aria-label={organizer ? '返回 GlobMeet 会务工作台' : '前往 GlobMeet 会议'}><span className="brand-mark" aria-hidden="true"><Globe2 size={20} strokeWidth={2.3} /></span><span>GLOBMEET</span></a>
}

function Topbar({ organizer = false, schedule = false, organizerActive }: { organizer?: boolean; schedule?: boolean; organizerActive?: OrganizerScreen }) {
  const { state, setLocale, setTimezone } = useDemo()
  const [showTimezoneDialog, setShowTimezoneDialog] = useState(false)
  const [showTimezoneChangePrompt, setShowTimezoneChangePrompt] = useState(false)
  const [showLanguagePrompt, setShowLanguagePrompt] = useState(false)
  const [languageStep, setLanguageStep] = useState<'confirm' | 'select'>('confirm')
  const [switchedTimezone, setSwitchedTimezone] = useState<TimeZone | null>(null)
  const [detectedTimezone, setDetectedTimezone] = useState<TimeZone | null>(null)
  const [calibrated, setCalibrated] = useState(false)
  const [timezoneFeedback, setTimezoneFeedback] = useState('')
  const timezone = timezoneMeta(state.timezone)
  const autoCalibrate = () => {
    const detected = localTimezone()
    setCalibrated(true)
    if (detected === state.timezone) {
      setTimezoneFeedback('时区校准完毕，无时区变化')
      window.setTimeout(() => setTimezoneFeedback(''), 2600)
      return
    }
    setTimezoneFeedback('')
    setDetectedTimezone(detected)
    setShowTimezoneChangePrompt(true)
  }
  return <header className="topbar">
    <Brand organizer={organizer} />
    {organizer && <nav className="organizer-top-nav" aria-label="会务主导航">{([{ screen: 'review', label: '待办' }, { screen: 'organizer-meetings', label: '会议' }, { screen: 'checkin', label: '核验' }] as const).map(({ screen, label }) => <a key={screen} className={organizerActive === screen ? 'active' : ''} href={organizerHref(screen)}>{label}</a>)}</nav>}
    <div className="topbar-actions">
    {organizer ? <><span className="search-chip">搜索申请人或会议</span><span className="role-label">会务人员 · 上海</span></> : schedule ? <a className="timezone-chip" href={href('notice')} aria-label="查看 2 条通知">通知 2</a> : <>{calibrated && <button type="button" className="manual-timezone" onClick={() => setShowTimezoneDialog(true)}>手动校准</button>}<button type="button" className="timezone-chip timezone-trigger" onClick={autoCalibrate} aria-label="自动校准时区"><LocateFixed size={14} />{timezone.label}</button>{timezoneFeedback && <span className="timezone-feedback" role="status">{timezoneFeedback}</span>}</>}
    </div>
    {showTimezoneChangePrompt && <div className="timezone-modal" role="dialog" aria-modal="true" aria-labelledby="timezone-change-title"><button type="button" className="modal-scrim" aria-label="关闭时区确认" onClick={() => setShowTimezoneChangePrompt(false)} /><section className="timezone-dialog language-dialog"><div className="timezone-dialog-heading"><div><p>自动校准</p><h2 id="timezone-change-title">发现新的时区</h2></div><button type="button" className="icon-button" aria-label="关闭时区确认" onClick={() => setShowTimezoneChangePrompt(false)}><X size={18} /></button></div><p className="timezone-dialog-copy">时区校准为{timezoneMeta(detectedTimezone ?? state.timezone).label}，是否确认切换？</p><div className="dialog-actions"><button type="button" className="button secondary" onClick={() => setShowTimezoneChangePrompt(false)}>暂不切换</button><button type="button" className="button primary" onClick={() => { const next = detectedTimezone ?? state.timezone; setTimezone(next); setSwitchedTimezone(next); setLanguageStep('confirm'); setShowTimezoneChangePrompt(false); setShowLanguagePrompt(true) }}>确认切换</button></div></section></div>}
    {showTimezoneDialog && <div className="timezone-modal" role="dialog" aria-modal="true" aria-labelledby="timezone-dialog-title"><button type="button" className="modal-scrim" aria-label="关闭时区选择" onClick={() => setShowTimezoneDialog(false)} /><section className="timezone-dialog"><div className="timezone-dialog-heading"><div><p>时区偏好</p><h2 id="timezone-dialog-title">手动校准</h2></div><button type="button" className="icon-button" aria-label="关闭时区选择" onClick={() => setShowTimezoneDialog(false)}><X size={18} /></button></div><p className="timezone-dialog-copy">选择后，会议页与日程会按该时区显示当前日期时间。</p><div className="timezone-options">{timezoneOptions.map((option) => <button key={option.value} type="button" className={state.timezone === option.value ? 'selected' : ''} onClick={() => { setTimezone(option.value); setCalibrated(true); setTimezoneFeedback(''); setSwitchedTimezone(option.value); setLanguageStep('confirm'); setShowTimezoneDialog(false); setShowLanguagePrompt(true) }}><span><b>{option.city}</b><small>{option.value}</small></span>{state.timezone === option.value && <Check size={17} />}</button>)}</div></section></div>}
    {showLanguagePrompt && <div className="timezone-modal" role="dialog" aria-modal="true" aria-labelledby="language-dialog-title"><button type="button" className="modal-scrim" aria-label="关闭语言选择" onClick={() => setShowLanguagePrompt(false)} /><section className="timezone-dialog language-dialog"><div className="timezone-dialog-heading"><div><p>显示偏好</p><h2 id="language-dialog-title">{languageStep === 'confirm' ? '会议时间已更新' : '选择界面语言'}</h2></div><button type="button" className="icon-button" aria-label="关闭语言选择" onClick={() => setShowLanguagePrompt(false)}><X size={18} /></button></div>{languageStep === 'confirm' ? <><p className="timezone-dialog-copy">已切换至{timezoneMeta(switchedTimezone ?? state.timezone).label}时区，会议时间已更新为当前时区，是否需要切换语言？</p><div className="dialog-actions"><button type="button" className="button secondary" onClick={() => setShowLanguagePrompt(false)}>暂不切换</button><button type="button" className="button primary" onClick={() => setLanguageStep('select')}>切换语言</button></div></> : <><p className="timezone-dialog-copy">当前仅开放中文；其他语言将在后续版本提供。</p><div className="language-options"><button type="button" className="selected" onClick={() => { setLocale('zh'); setShowLanguagePrompt(false) }}><span>中文</span><Check size={17} /></button>{(['English', '日本語', 'Français', 'Deutsch'] as const).map((language) => <button type="button" key={language} disabled>{language}<span>暂未开放</span></button>)}</div></>}</section></div>}
  </header>
}

function MobileNav({ active }: { active: Screen }) {
  const items: Array<{ screen: Screen; label: string }> = [
    { screen: 'discover', label: '会议' },
    { screen: 'schedule', label: '日程' },
    { screen: 'notice', label: '通知' },
    { screen: 'profile', label: '我的' },
  ]
  return <nav className="mobile-nav" aria-label="主导航">
    {items.map(({ screen, label }) => <a key={screen} className={active === screen ? 'active' : ''} href={href(screen)}><span>{label}</span></a>)}
  </nav>
}

function PageShell({ children, active, organizer = false, organizerActive, topbar = true }: { children: ReactNode; active: Screen; organizer?: boolean; organizerActive?: OrganizerScreen; topbar?: boolean }) {
  return <div className={organizer ? 'app-shell desktop-shell' : 'app-shell'}>
    <a className="skip-link" href="#main-content">跳到主要内容</a>
    {topbar && <Topbar organizer={organizer} organizerActive={organizerActive} schedule={active === 'schedule'} />}
    <main id="main-content">{children}</main>
    {!organizer && <MobileNav active={active} />}
  </div>
}

function PageTitle({ eyebrow, title, copy }: { eyebrow: string; title: string; copy?: string }) {
  return <section className="page-title"><p>{eyebrow}</p><h1>{title}</h1>{copy && <span>{copy}</span>}</section>
}

function DateRail({ now, timezone }: { now: Date; timezone: TimeZone }) {
  const dates = [-1, 0, 1, 2].map((offset) => {
    const date = new Date(now.getTime() + offset * 24 * 60 * 60 * 1000)
    const { weekday, day } = zonedDateParts(date, timezone)
    return { weekday, day, selected: offset === 0 }
  })
  return <div className="date-rail" aria-label="日期选择">
    {dates.map(({ weekday, day, selected }) => <span key={`${weekday}-${day}`} className={selected ? 'selected' : ''}><b>{weekday}</b><small>{day}</small></span>)}
  </div>
}

function MeetingCard({ meeting, compact = false, date = '08', month = 'AUG', tag = meeting.tag, invited = false }: { meeting: Meeting; compact?: boolean; date?: string; month?: string; tag?: string; invited?: boolean }) {
  const { state } = useDemo()
  const actionHref = screenHref('detail', invited ? { meeting: meeting.id, from: 'discover', invitation: 'true' } : { meeting: meeting.id, from: 'discover' })
  return <article className={`meeting-card gradient-${meeting.tone} ${compact ? 'compact' : ''} ${invited ? 'invited-meeting' : ''}`}>
    <div className="date-tile"><strong>{date}</strong><span>{month}</span></div>
    <div className="meeting-body">
      <div className="meeting-title-row"><h2>{meetingName(meeting, state.locale)}</h2><span className={`status-tag ${invited ? 'invitation-tag' : ''}`}>{invited && <i aria-hidden="true" />}{tag}</span></div>
      <MeetingTimePair meeting={meeting} timezone={state.timezone} />
      <p className="meeting-meta">{meeting.source} <span>•</span> {meeting.type}</p>
      {!compact && <a className="button primary" href={actionHref}>查看详情</a>}
    </div>
  </article>
}

type DiscoverTab = 'invites' | 'weekly' | 'format' | 'filter'

const discoverTabs: Array<{ id: DiscoverTab; label: string }> = [
  { id: 'invites', label: '我的邀请' },
  { id: 'weekly', label: '本周推荐' },
  { id: 'format', label: '线上+现场' },
  { id: 'filter', label: '筛选' },
]

const futureMeetings: Array<{ meeting: Meeting; date: string; month: string }> = [
  { meeting: { ...meetings[0], time: '19:00-20:30', source: 'London 12:00', type: 'Online', tag: '8月18日' }, date: '18', month: 'AUG' },
  { meeting: { ...meetings[1], time: '09:00-10:00', source: 'New York 21:00', type: 'Hybrid', tag: '8月23日' }, date: '23', month: 'AUG' },
  { meeting: { ...meetings[2], time: '15:00-16:30', source: 'Tokyo 16:00', type: 'Hybrid', tag: '9月02日' }, date: '02', month: 'SEP' },
  { meeting: { ...meetings[0], time: '18:30-20:00', source: 'London 11:30', type: 'Hybrid', tag: '9月12日' }, date: '12', month: 'SEP' },
  { meeting: { ...meetings[1], time: '20:00-21:30', source: 'New York 08:00', type: 'Online', tag: '9月19日' }, date: '19', month: 'SEP' },
  { meeting: { ...meetings[2], time: '10:30-12:00', source: 'Tokyo 11:30', type: 'Hybrid', tag: '10月06日' }, date: '06', month: 'OCT' },
]

function Discover() {
  const { state } = useDemo()
  const now = useShanghaiNow()
  const [activeTab, setActiveTab] = useState<DiscoverTab>('weekly')
  const [query, setQuery] = useState('')
  const [hasSearched, setHasSearched] = useState(false)
  const activeIndex = discoverTabs.findIndex((tab) => tab.id === activeTab)
  const searchResults = hasSearched ? meetings.filter((meeting) => {
    const cityAlias = meeting.source.startsWith('London') ? '伦敦' : meeting.source.startsWith('New York') ? '纽约' : '东京'
    return `${meetingName(meeting, state.locale)} ${meeting.type} ${meeting.source} ${cityAlias}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())
  }) : []
  const tabContent = activeTab === 'invites'
    ? <><div className="section-heading"><h2>我的邀请</h2><span className="unread-copy"><i />1 条新邀请</span></div><div className="meeting-list"><MeetingCard meeting={meetings[2]} date="16" month="AUG" tag="新邀请" invited /></div></>
    : activeTab === 'format'
      ? <><div className="section-heading"><h2>线上 + 现场</h2></div><div className="meeting-list">{futureMeetings.map(({ meeting, date, month }) => <MeetingCard key={`${meeting.id}-${date}`} meeting={meeting} date={date} month={month} />)}</div></>
      : activeTab === 'filter'
        ? <div className="meeting-search"><form className="meeting-search-form" onSubmit={(event) => { event.preventDefault(); if (query.trim()) setHasSearched(true) }}><div className="search-input"><Search size={18} /><input aria-label="搜索会议" value={query} onChange={(event) => { setQuery(event.target.value); setHasSearched(false) }} placeholder="搜索会议、形式或来源地" autoFocus /></div><button type="submit" className="button primary search-submit" disabled={!query.trim()}>搜索</button></form><div className="search-hints"><span>快速筛选</span><button type="button" onClick={() => { setQuery('Online'); setHasSearched(false) }}>线上会议</button><button type="button" onClick={() => { setQuery('London'); setHasSearched(false) }}>伦敦来源</button></div>{hasSearched ? <><div className="section-heading"><h2>搜索结果</h2><span>{searchResults.length} 场匹配</span></div><div className="meeting-list">{searchResults.length ? searchResults.map((meeting) => <MeetingCard meeting={meeting} key={meeting.id} />) : <p className="empty-copy">没有匹配的会议，试试更短的关键词。</p>}</div></> : <p className="search-idle-copy">输入关键词后点击“搜索”</p>}</div>
        : <><div className="section-heading"><h2>为你推荐</h2><span>12 场可安排</span></div><div className="meeting-list">{meetings.map((meeting) => <MeetingCard meeting={meeting} key={meeting.id} />)}</div></>
  return <PageShell active="discover">
    <PageTitle eyebrow={formatZonedDateTime(now, state.timezone)} title="探索跨国会议" copy="把每一场对话放在正确的当地时间。" />
    <section className="content-section discover-controls">
      <div className="segment-control" role="tablist" aria-label="会议浏览方式"><span className="segment-indicator" style={{ transform: `translateX(${activeIndex * 100}%)` }} />{discoverTabs.map((tab) => <button key={tab.id} type="button" role="tab" aria-selected={activeTab === tab.id} className={activeTab === tab.id ? 'selected' : ''} onClick={() => setActiveTab(tab.id)}>{tab.label}{tab.id === 'invites' && <i className="tab-unread-dot" aria-label="1 条未读邀请" />}</button>)}</div>
      {tabContent}
    </section>
  </PageShell>
}

function Detail() {
  const { state } = useDemo()
  const meeting = currentMeeting()
  const origin = getOrigin()
  const invited = new URLSearchParams(window.location.search).get('invitation') === 'true'
  const meetingCopy = {
    media: '媒体、技术与内容团队的跨区域协作论坛。',
    ai: '面向跨区域内容团队的 AI 工作流与案例交流。',
    mobility: '围绕城市出行、公共空间与协同创新的专题讨论。',
  }[meeting.id]
  const venue = meeting.id === 'media' ? 'Harbor Hall A + Online' : meeting.id === 'ai' ? 'Online' : 'Harbor Hall B'
  const backLabel = origin === 'schedule' ? '返回日程' : '返回会议'
  const bookingHref = screenHref('booking', invited ? { meeting: meeting.id, from: origin, entry: 'detail', invitation: 'true' } : { meeting: meeting.id, from: origin, entry: 'detail' })
  const preMeeting = meeting.id === 'ai'
    ? ['提前 10 分钟进入线上候场室，完成音频与字幕测试。', '请在会前阅读跨区域内容工作流摘要，提问将按主题汇总。']
    : meeting.id === 'media'
      ? ['请携带会议确认码；现场与线上参与者将同步进入主会场。', '会前材料包含主题简报、演讲嘉宾介绍与讨论问题。']
      : ['这是你收到的一条新邀请，请在会议开始前确认参与。', '本场将围绕公共空间与城市出行的协作案例展开讨论。']
  return <PageShell active="discover">
    <section className="detail-header"><a href={href(origin)} className="back-link"><ArrowLeft size={18} /> {backLabel}</a></section>
    <article className="detail-hero">
      <span className="status-tag">{meeting.type}</span>
      <div className="detail-title-actions"><h1>{meetingName(meeting, state.locale)}</h1>{origin !== 'schedule' && <a className="button primary detail-primary-action" href={bookingHref}>{invited ? '接受邀请' : '申请预约'}</a>}</div>
      <p>{meetingCopy}</p>
      <div className="detail-facts"><span className="detail-time-fact"><Clock3 size={16} /><MeetingTimePair meeting={meeting} timezone={state.timezone} /></span><span><MapPin size={16} /> {venue}</span><span><Users size={16} /> {meeting.id === 'media' ? '42 / 60' : meeting.id === 'ai' ? '18 / 40' : '12 / 20'}</span></div>
    </article>
    <section className="content-section detail-grid">
      <article className="surface-card detail-prep-card"><div className="detail-card-heading"><span><FileText size={18} /></span><div><p>会前资料</p><h2>参会前请了解</h2></div></div><div className="prep-list">{preMeeting.map((item, index) => <p key={item}><b>0{index + 1}</b>{item}</p>)}</div><a className="button quiet" href="#agenda">查看会议议程 <ChevronRight size={16} /></a></article>
      <div className="surface-card"><h2>跨时区时间</h2><MeetingTimePair meeting={meeting} timezone={state.timezone} /><p>会议形式 · {meeting.type}</p></div>
      <article className="surface-card detail-sync-card"><div className="detail-card-heading"><span><MessageSquareText size={18} /></span><div><p>会前信息同步</p><h2>本场协作安排</h2></div></div><div><b>讨论方式</b><p>主持人将按议题轮流邀请发言；线上提问会进入统一问题池。</p></div><div><b>资料更新</b><p>会议开始前 30 分钟停止修改议程，最新版本会同步至通知中心。</p></div></article>
      <div id="agenda" className="surface-card"><h2>会议议程</h2><div className="agenda"><span>{meeting.time.slice(0, 5)}</span><p><b>会议开场与议题概览</b>了解本场会议的协作目标与参与方式</p><span>{meeting.time.slice(6)}</span><p><b>专题交流与问答</b>与来自不同地区的参会者展开讨论</p></div></div>
      <article className="surface-card participants-card"><div className="section-heading"><h2>与会人员</h2><span>12 位已确认</span></div><div className="participant-avatars"><span className="avatar-purple">SM</span><span className="avatar-mint">AO</span><span className="avatar-amber">KI</span><span className="avatar-count">+9</span></div><p>来自内容、技术与会务团队的跨区域参会者将共同参与本场讨论。</p></article>
      {origin === 'schedule'
        ? <div className="sticky-action"><span>该会议已在你的本地日程中。</span><a className="button secondary" href={href('schedule')}>返回日程</a></div>
        : <div className="detail-action-note"><Check size={16} />{invited ? '接受后将把邀请加入你的预约流程。' : '无需外部账号，申请将进入会务审核。'}</div>}
    </section>
  </PageShell>
}

function Booking() {
  const { state, write } = useDemo()
  const meeting = currentMeeting()
  const origin = getOrigin()
  const entry = getEntry()
  const alternative = new URLSearchParams(window.location.search).get('slot') === 'alternative'
  const bookingTime = alternative ? '10:00-11:30' : meeting.time
  const bookingSource = alternative ? 'AI 建议替代场次 · 上海' : `${meeting.source} · ${meeting.type}`
  const backHref = entry === 'detail'
    ? screenHref('detail', { meeting: meeting.id, from: origin })
    : href(origin)
  const submitHref = meeting.id === 'ai' && !alternative
    ? screenHref('conflict', { meeting: meeting.id, from: origin, entry })
    : screenHref('application-result', { meeting: meeting.id, from: origin, slot: alternative ? 'alternative' : 'standard' })
  const existing = reservationForOwner(state, meeting.id)
  const submit = (event: MouseEvent<HTMLAnchorElement>) => {
    if (meeting.id === 'ai' && !alternative) return
    event.preventDefault()
    const outcome = submitReservation(state, meeting.id, false, alternative)
    write(outcome.state)
    window.location.assign(`${submitHref}&reservation=${outcome.reservation.id}`)
  }
  return <PageShell active="discover" topbar={false}>
    <section className="booking-header"><a href={backHref} className="back-pill" aria-label={entry === 'detail' ? '返回会议详情' : '返回会议列表'}><ArrowLeft size={18} /></a><h1>预约确认</h1><span className="status-tag">{alternative ? '替代场次' : '待提交'}</span></section>
    <section className="content-section booking-flow">
      <p className="booking-label">你的选择</p>
      <article className="selected-meeting"><div className="date-tile"><strong>08</strong><span>AUG</span></div><div><h2>{meetingName(meeting, state.locale)}</h2><MeetingTimePair meeting={meeting} timezone={state.timezone} time={bookingTime} /><p className="meeting-meta">{bookingSource}</p></div></article>
      <article className="booking-summary"><span className="summary-icon"><Check size={19} /></span><div><b>提交后进入会务审核</b><p>会务人员将核对容量与已有日程，并同步处理结果。</p></div></article>
      {existing ? <p className="inline-feedback error">你已提交过这场会议的预约，请在“我的”查看进度。</p> : <a className="button primary wide-action" href={submitHref} onClick={submit}>{meeting.id === 'ai' && !alternative ? '检测冲突并继续' : '提交预约申请'}</a>}
      <a className="button secondary wide-action" href={backHref}>取消预约</a>
    </section>
  </PageShell>
}

function Conflict() {
  const { state, write } = useDemo()
  const meeting = currentMeeting()
  const origin = getOrigin()
  const entry = getEntry()
  const bookingHref = screenHref('booking', { meeting: meeting.id, from: origin, entry })
  const cancelHref = entry === 'detail' ? screenHref('detail', { meeting: meeting.id, from: origin }) : href(origin)
  return <PageShell active="discover" topbar={false}>
    <section className="booking-header"><a href={bookingHref} className="back-pill" aria-label="返回预约确认"><ArrowLeft size={18} /></a><h1>检测到时间冲突</h1><span className="status-tag amber">需选择</span></section>
    <section className="content-section booking-flow">
      <p className="booking-label">你的选择</p>
      <article className="selected-meeting"><div className="date-tile"><strong>08</strong><span>AUG</span></div><div><h2>{meetingName(meeting, state.locale)}</h2><MeetingTimePair meeting={meeting} timezone={state.timezone} /><p className="meeting-meta">{meeting.source} <span>•</span> {meeting.type}</p></div></article>
      <article className="conflict-alert"><div><h2>时间冲突 · 90 分钟重叠</h2><p>与已确认的 {meetingName(meetingById('media'), state.locale)} 重叠。提交后将交由会务人员判断。</p></div></article>
      <article className="ai-card ai-recommendation"><div className="ai-card-title"><span className="ai-label">AI 建议</span><h2>更适合你的替代场次</h2></div><strong>09 Aug · 10:00-11:30 · 上海</strong><p>保留 AI 内容主题，避开已确认日程，并预留 30 分钟转场时间。</p><a className="button primary" href={screenHref('booking', { meeting: meeting.id, from: origin, entry, slot: 'alternative' })}>采纳替代场次</a></article>
      <a className="button primary wide-action" href={screenHref('application-result', { meeting: meeting.id, from: origin, slot: 'conflict' })} onClick={(event) => { event.preventDefault(); const outcome = submitReservation(state, meeting.id, true); write(outcome.state); window.location.assign(`${screenHref('application-result', { meeting: meeting.id, from: origin, slot: 'conflict' })}&reservation=${outcome.reservation.id}`) }}>仍然提交审核</a>
      <a className="button secondary wide-action" href={cancelHref}>{entry === 'detail' ? '取消并返回详情' : '取消并返回会议'}</a>
    </section>
  </PageShell>
}

function ApplicationResult() {
  const { state } = useDemo()
  const meeting = currentMeeting()
  const origin = getOrigin()
  const alternative = new URLSearchParams(window.location.search).get('slot') === 'alternative'
  const reservationId = new URLSearchParams(window.location.search).get('reservation')
  const reservation = state.reservations.find((item) => item.id === reservationId) ?? reservationForOwner(state, meeting.id)
  return <PageShell active="discover" topbar={false}>
    <section className="booking-header"><a href={href(origin)} className="back-pill" aria-label="返回会议"><ArrowLeft size={18} /></a><h1>预约已提交</h1><span className="status-tag">待审核</span></section>
    <section className="content-section result-flow">
      <article className="result-card"><span className="result-mark"><Check size={28} /></span><p>申请已进入审核</p><h2>{meetingName(meeting, state.locale)}</h2><MeetingTimePair meeting={meeting} timezone={state.timezone} time={alternative ? '10:00-11:30' : meeting.time} /><span>申请编号 {reservation?.id ?? 'GM-2026-020'}</span><p>会务人员会核对会议容量和你的已有日程，并将处理结果同步至通知与日程。</p></article>
      <a className="button primary wide-action" href={href('notice')}>查看通知</a>
      <a className="button secondary wide-action" href={href(origin)}>继续浏览会议</a>
    </section>
  </PageShell>
}

function ChangeImpact() {
  const { state } = useDemo()
  const meeting = meetingById('ai')
  return <PageShell active="schedule">
    <section className="detail-header"><a href={href('schedule')} className="back-link"><ArrowLeft size={18} /> 返回日程</a></section>
    <PageTitle eyebrow="日程变更" title="确认会议地点更新" copy="会务人员已将变更同步到你的本地时间安排。" />
    <section className="content-section impact-flow">
      <article className="impact-card"><span className="status-tag amber">地点变更</span><h2>{meetingName(meeting, state.locale)}</h2><div><span>时间</span><b>13:00-14:30 · 上海</b></div><div><span>原地点</span><b>Online</b></div><div><span>更新后</span><b>Harbor Hall B</b></div></article>
      <article className="booking-summary"><span className="summary-icon"><CalendarDays size={19} /></span><div><b>对日程的影响</b><p>时间未变更；你的日程已更新为 Harbor Hall B，无需再次确认。</p></div></article>
      <a className="button primary wide-action" href={href('schedule')}>查看更新后的日程</a>
      <a className="button secondary wide-action" href={href('notice')}>查看通知</a>
    </section>
  </PageShell>
}

function TodoSidebar({ pendingCount, active }: { pendingCount: number; active: 'review' | 'records' }) {
  return <aside className="review-sidebar"><div><p>待办</p><h2>预约审核</h2><span className="sidebar-secondary-label">二级导航</span><nav aria-label="待办二级导航"><a className={active === 'review' ? 'active' : ''} href={organizerHref('review')}>待审核申请 · {pendingCount}</a><a className={active === 'records' ? 'active' : ''} href={organizerHref('organizer-records')}>处理记录</a></nav></div><p className="sidebar-scope-copy">当前显示负责会议的预约审核与处理记录。</p></aside>
}

function Review() {
  const { state, write } = useDemo()
  const pending = state.reservations.filter((reservation) => reservation.status === 'pending')
  const requested = new URLSearchParams(window.location.search).get('reservation')
  const selected = pending.find((reservation) => reservation.id === requested) ?? pending[0]
  const [reason, setReason] = useState('')
  const [feedback, setFeedback] = useState('')
  const meeting = selected ? meetingById(selected.meetingId) : null
  const approve = () => {
    if (!selected) return
    const outcome = approveReservation(state, selected.id)
    write(outcome.state)
    setFeedback(outcome.error ?? `已批准 ${selected.id}，相关日程、通知与凭证已同步。`)
  }
  const reject = () => {
    if (!selected) return
    const outcome = rejectReservation(state, selected.id, reason)
    write(outcome.state)
    setFeedback(outcome.error ?? `已拒绝 ${selected.id}，已写入原因并通知申请人。`)
  }
  return <PageShell active="review" organizer organizerActive="review">
    <div className="review-layout">
      <TodoSidebar pendingCount={pending.length} active="review" />
      <section className="review-queue"><div className="review-heading"><div><h1>待审核申请</h1><p>按会议与冲突风险排序</p></div><span className="count-pill">{pending.length}</span></div><div className="queue-items">{pending.length ? pending.map((reservation) => <QueueItem key={reservation.id} reservation={reservation} selected={reservation.id === selected?.id} />) : <p className="empty-copy">当前没有待处理申请。</p>}</div></section>
      <section className="review-detail">{selected && meeting ? <><div className="review-heading"><h1>{selected.attendeeName} 的预约申请</h1><span className="status-tag">待审核</span></div><article className="meeting-context"><div><b>{meetingName(meeting, state.locale)}</b><MeetingTimePair meeting={meeting} timezone={state.timezone} /><span>{meeting.type} · {meeting.venue}</span></div><div><small>申请人</small><b>{selected.attendeeName} · {selected.organization}</b><span>{selected.hasConflict ? '已确认日程 1 项' : '无已知日程冲突'}</span></div></article>{selected.hasConflict && <article className="review-conflict"><h2>日程冲突 · 申请人已有同时段会议</h2><p>申请人已知晓与 {meetingName(meetingById('media'), state.locale)} 重叠的时间，并选择继续提交审核。</p></article>}<div className="decision-panel"><h2>处理决定</h2><p>批准会同步日程、通知与凭证；拒绝必须填写原因。</p><label htmlFor="review-reason">拒绝原因</label><textarea id="review-reason" value={reason} onChange={(event) => setReason(event.target.value)} placeholder="例如：当前场次名额已预留给受邀嘉宾" />{feedback && <p className={feedback.startsWith('请') || feedback.startsWith('该') || feedback.startsWith('会议') ? 'inline-feedback error' : 'inline-feedback success'} role="status">{feedback}</p>}<div className="decision-actions"><button className="button primary" onClick={approve}>批准并同步</button><button className="button danger" onClick={reject}>拒绝申请</button></div></div><article className="sync-preview"><h2>同步预览</h2><p>1&nbsp;&nbsp;日程：写入参会人的本地会议时间</p><p>2&nbsp;&nbsp;通知：发送审核结果及冲突说明</p><p>3&nbsp;&nbsp;凭证：批准后生成可现场核验的演示凭证</p><a className="workspace-record-link" href={organizerHref('organizer-records')}>查看处理记录 <ChevronRight size={15} /></a></article></> : <div className="review-empty">{feedback && <p className="inline-feedback success" role="status">{feedback}</p>}<h1>待办已处理完毕</h1><p>新的参会预约会自动显示在这里。</p></div>}</section>
    </div>
  </PageShell>
}

function QueueItem({ reservation, selected }: { reservation: Reservation; selected: boolean }) {
  const { state } = useDemo()
  const meeting = meetingById(reservation.meetingId)
  return <a className={`queue-item ${selected ? 'active' : ''}`} href={`${organizerHref('review')}&reservation=${reservation.id}`}><div><b>{reservation.attendeeName}</b><p>{reservation.organization}</p><small>{meetingName(meeting, state.locale)} · {meeting.time}</small></div>{reservation.hasConflict && <span className="queue-flag danger-text">有冲突</span>}</a>
}

function Schedule() {
  const { state } = useDemo()
  const now = useShanghaiNow()
  const scheduled = state.reservations.filter((reservation) => reservation.owner === 'liuchen' && ['approved', 'checked-in'].includes(reservation.status))
  return <PageShell active="schedule">
    <PageTitle eyebrow={`我的行程 · ${formatZonedDateTime(now, state.timezone)} · ${timezoneMeta(state.timezone).label}`} title="今天的会议日历" />
    <section className="content-section stack"><DateRail now={now} timezone={state.timezone} /><article className="agenda-card"><div className="agenda-title"><b>{formatZonedDate(now, state.timezone)}</b><span>{timezoneMeta(state.timezone).label}</span></div>{scheduled.length ? scheduled.map((reservation) => <Timeline key={reservation.id} meeting={meetingById(reservation.meetingId)} status={statusLabel(reservation.status)} timezone={state.timezone} />) : <p className="empty-copy">暂无已批准会议，完成审核后会显示在这里。</p>}</article><article className="change-card"><b>会议地点已变更</b><p>{meetingName(meetingById('ai'), state.locale)} 改至 Harbor Hall B，相关日程会同步更新。</p><a className="button quiet" href={href('change-impact')}>查看影响 <ChevronRight size={16} /></a></article>{scheduled[0] && <article className="upcoming-card"><div className="upcoming-heading"><span>即将开始的会议</span><time>30 分钟后</time></div><h2>{meetingName(meetingById(scheduled[0].meetingId), state.locale)}</h2><div className="upcoming-meta"><span><Clock3 size={15} /><MeetingTimePair meeting={meetingById(scheduled[0].meetingId)} timezone={state.timezone} /></span><span><MapPin size={15} /> {meetingById(scheduled[0].meetingId).venue}</span></div><a className="button secondary" href={screenHref('detail', { meeting: scheduled[0].meetingId, from: 'schedule' })}>查看详情 <ChevronRight size={16} /></a></article>}</section>
  </PageShell>
}

function Notice() {
  const { state } = useDemo()
  return <PageShell active="notice">
    <PageTitle eyebrow={`通知中心 · ${state.notices.filter((notice) => !notice.read).length} 条未读`} title="需要你留意的更新" copy="审核结果、会议变更和待确认调整都会显示在这里。" />
    <section className="content-section notification-list">
      {state.notices.map((notice) => <article className={`notification-card ${notice.read ? '' : 'unread'}`} key={notice.id}><span className={`notification-icon ${notice.kind === 'approved' ? 'approved' : notice.kind === 'change' ? 'change' : 'suggestion'}`}>{notice.kind === 'approved' ? <Check size={18} /> : notice.kind === 'change' ? <MapPin size={18} /> : <Sparkles size={18} />}</span><div><div className="notification-heading"><h2>{notice.title}</h2><time>{notice.createdAt}</time></div><p>{localizedMeetingCopy(notice.detail, state.locale)}</p><a className="button quiet" href={href('schedule')}>查看相关日程 <ChevronRight size={16} /></a></div></article>)}
    </section>
  </PageShell>
}

function Profile() {
  const { state, write, setLocale, reset } = useDemo()
  const mine = state.reservations.filter((reservation) => reservation.owner === 'liuchen')
  const [showOrganizerLink, setShowOrganizerLink] = useState(false)
  const [copied, setCopied] = useState(false)
  const organizerUrl = `${window.location.origin}${organizerHref('review')}`
  const copyOrganizerUrl = async () => {
    try {
      await navigator.clipboard.writeText(organizerUrl)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }
  return <PageShell active="profile">
    <PageTitle eyebrow="我的资料" title="个人信息与偏好" copy="这些设置会作为演示中的跨国会议默认配置。" />
    <section className="content-section profile-stack">
      <article className="profile-card profile-identity">
        <span className="profile-avatar" aria-hidden="true">LC</span>
        <div><h2>薛花花</h2><p>Northstar Studio · 上海</p><span>参会人员</span></div>
        <a className="profile-edit" href="#profile-details">查看资料 <ChevronRight size={16} /></a>
      </article>
      <section className="profile-group" aria-labelledby="profile-bookings-title">
        <div className="profile-group-heading"><TicketCheck size={17} /><h2 id="profile-bookings-title">我的预约</h2></div>
        <div className="profile-list">{mine.map((reservation) => { const meeting = meetingById(reservation.meetingId); return <div className="profile-booking" key={reservation.id}><div><b>{meetingName(meeting, state.locale)}</b><span>{reservation.id} · {statusLabel(reservation.status)}</span></div>{['pending', 'approved'].includes(reservation.status) && <button className="button quiet" onClick={() => { const outcome = cancelReservation(state, reservation.id); write(outcome.state) }}>取消预约</button>}</div> })}</div>
      </section>
      <section id="profile-details" className="profile-group" aria-labelledby="profile-details-title">
        <div className="profile-group-heading"><UserRound size={17} /><h2 id="profile-details-title">个人信息</h2></div>
        <div className="profile-list">
          <div className="profile-row"><span>姓名</span><b>薛花花</b></div>
          <div className="profile-row"><span>组织</span><b>Northstar Studio</b></div>
          <div className="profile-row"><span>所在城市</span><b>上海</b></div>
        </div>
      </section>
      <section className="profile-group" aria-labelledby="profile-preference-title">
        <div className="profile-group-heading"><Languages size={17} /><h2 id="profile-preference-title">会议偏好</h2></div>
        <div className="profile-list">
          <div className="profile-row"><span>界面语言</span><span className="preference-actions"><button className={state.locale === 'zh' ? 'selected' : ''} onClick={() => setLocale('zh')}>中文</button><button className={state.locale === 'en' ? 'selected' : ''} onClick={() => setLocale('en')}>English</button></span></div>
          <div className="profile-row"><span>默认时区</span><b>{timezoneMeta(state.timezone).label}</b></div>
          <div className="profile-row"><span>演示角色</span><button type="button" className="role-link-button" onClick={() => { setCopied(false); setShowOrganizerLink(true) }}>切换至会务人员 <ChevronRight size={15} /></button></div>
        </div>
      </section>
      <section className="profile-group" aria-labelledby="profile-settings-title">
        <div className="profile-group-heading"><Settings size={17} /><h2 id="profile-settings-title">设置</h2></div>
        <div className="profile-list">
          <div className="profile-row"><span>会议变更通知</span><b>已开启</b></div>
          <div className="profile-row"><span>隐私与数据说明</span><b>本地演示数据</b></div>
          <div className="profile-row"><span>演示数据</span><button className="button quiet" onClick={reset}>重置</button></div>
        </div>
      </section>
    </section>
    {showOrganizerLink && <div className="timezone-modal" role="dialog" aria-modal="true" aria-labelledby="organizer-link-title"><button type="button" className="modal-scrim" aria-label="关闭网页端链接" onClick={() => setShowOrganizerLink(false)} /><section className="timezone-dialog organizer-link-dialog"><div className="timezone-dialog-heading"><div><p>演示角色</p><h2 id="organizer-link-title">网页端会务工作台</h2></div><button type="button" className="icon-button" aria-label="关闭网页端链接" onClick={() => setShowOrganizerLink(false)}><X size={18} /></button></div><p className="timezone-dialog-copy">会务人员使用独立的网页端工作台。请复制下方链接，在电脑浏览器中打开。</p><label htmlFor="organizer-web-link">网页端链接</label><div className="organizer-link-field"><input id="organizer-web-link" value={organizerUrl} readOnly onFocus={(event) => event.currentTarget.select()} /><button type="button" className="button primary" onClick={copyOrganizerUrl}><Copy size={15} />{copied ? '已复制' : '复制链接'}</button></div><p className="organizer-link-hint">链接仅使用当前浏览器中的本地演示数据。</p></section></div>}
  </PageShell>
}

function Timeline({ meeting, status, timezone }: { meeting: Meeting; status: string; timezone: TimeZone }) {
  const { state } = useDemo()
  return <div className="timeline-row"><span className="timeline-time">{formatMeetingTime(meeting.time, timezone).slice(0, 5)}</span><span className="timeline-dot" /><article className={`timeline-event gradient-${meeting.tone}`}><b>{meetingName(meeting, state.locale)}</b><MeetingTimePair meeting={meeting} timezone={timezone} /><p>{status}</p></article></div>
}

function OrganizerMeetings() {
  const { state } = useDemo()
  const [modal, setModal] = useState<'create' | 'change' | null>(null)
  const [draftTitle, setDraftTitle] = useState('')
  const [draftComplete, setDraftComplete] = useState(false)
  const [changeMeetingId, setChangeMeetingId] = useState<MeetingId>('ai')
  const [changeVenue, setChangeVenue] = useState(meetingById('ai').venue)
  const [changePreview, setChangePreview] = useState(false)
  const [actionFeedback, setActionFeedback] = useState('')
  const changeMeeting = meetingById(changeMeetingId)
  const openModal = (next: 'create' | 'change') => {
    setModal(next)
    setDraftComplete(false)
    setChangePreview(false)
  }
  const closeModal = () => setModal(null)
  return <PageShell active="organizer-meetings" organizer organizerActive="organizer-meetings">
    <section className="organizer-page">
      <div className="organizer-page-heading"><div><p>负责会议 · 3 场</p><h1>会议与变更</h1><span>变更发布前先核对受影响预约和潜在日程冲突。</span></div><div className="organizer-page-actions"><button type="button" className="button secondary" onClick={() => openModal('create')}><CalendarDays size={16} />发起会议</button><button type="button" className="button primary" onClick={() => openModal('change')}><FileText size={16} />发布会议变更</button></div></div>
      {actionFeedback && <p className="inline-feedback success organizer-action-feedback" role="status">{actionFeedback}</p>}
      <section className="organizer-meeting-grid">
        {meetings.map((meeting, index) => <article className={`organizer-meeting-card ${index === 0 ? 'current' : ''}`} key={meeting.id}><div><span className="status-tag">{index === 1 ? '已变更' : index === 0 ? '今日进行' : '已发布'}</span><h2>{meetingName(meeting, state.locale)}</h2><div className="organizer-time"><Clock3 size={15} /><MeetingTimePair meeting={meeting} timezone={state.timezone} /></div><p><MapPin size={15} /> {meeting.venue}</p></div><div className="organizer-card-footer"><div className="meeting-impact"><b>{state.reservations.filter((reservation) => reservation.meetingId === meeting.id && ['approved', 'checked-in'].includes(reservation.status)).length} / {meeting.capacity}</b><span>已确认参会人</span></div><a className="button secondary organizer-detail-link" href={`${organizerHref('organizer-meeting-detail')}&meeting=${meeting.id}`}>查看详情 <ChevronRight size={15} /></a></div></article>)}
      </section>
      <article className="organizer-impact-card"><div><CalendarDays size={21} /><div><h2>最近一次变更已同步</h2><p>{meetingName(meetingById('ai'), state.locale)} 已改至 Harbor Hall B；相关参会人已收到通知。</p></div></div><a className="workspace-record-link" href={organizerHref('organizer-records')}>查看变更记录 <ChevronRight size={15} /></a></article>
    </section>
    {modal === 'create' && <div className="timezone-modal organizer-modal" role="dialog" aria-modal="true" aria-labelledby="create-meeting-title"><button type="button" className="modal-scrim" aria-label="关闭发起会议" onClick={closeModal} /><section className="timezone-dialog organizer-action-dialog"><div className="timezone-dialog-heading"><div><p>会议管理</p><h2 id="create-meeting-title">发起会议</h2></div><button type="button" className="icon-button" aria-label="关闭发起会议" onClick={closeModal}><X size={18} /></button></div>{draftComplete ? <div className="organizer-action-complete"><span className="result-mark"><Check size={25} /></span><h3>会议草稿已创建</h3><p>“{draftTitle}”已进入待发布状态，可在会议详情中继续补充议程与参会范围。</p><button type="button" className="button primary" onClick={closeModal}>完成</button></div> : <form className="organizer-action-form" onSubmit={(event) => { event.preventDefault(); setDraftComplete(true) }}><p>先建立基础信息，发布前仍可调整。</p><label htmlFor="draft-title">会议名称</label><input id="draft-title" value={draftTitle} onChange={(event) => setDraftTitle(event.target.value)} placeholder="例如：全球内容协作圆桌会" required autoFocus /><div className="organizer-form-grid"><div><label htmlFor="draft-format">会议形式</label><select id="draft-format" defaultValue="Hybrid"><option>Hybrid</option><option>Online</option><option>On-site</option></select></div><div><label htmlFor="draft-timezone">会议当地时区</label><select id="draft-timezone" defaultValue="Asia/Shanghai"><option value="Asia/Shanghai">上海 UTC+8</option><option value="Europe/London">伦敦 UTC+1</option><option value="America/New_York">纽约 UTC-4</option><option value="Asia/Tokyo">东京 UTC+9</option></select></div></div><label htmlFor="draft-venue">地点或线上信息</label><input id="draft-venue" placeholder="例如：Harbor Hall C + Online" required /><div className="dialog-actions"><button type="button" className="button secondary" onClick={closeModal}>取消</button><button type="submit" className="button primary">创建会议草稿</button></div></form>}</section></div>}
    {modal === 'change' && <div className="timezone-modal organizer-modal" role="dialog" aria-modal="true" aria-labelledby="change-meeting-title"><button type="button" className="modal-scrim" aria-label="关闭会议变更" onClick={closeModal} /><section className="timezone-dialog organizer-action-dialog"><div className="timezone-dialog-heading"><div><p>会议管理</p><h2 id="change-meeting-title">发布会议变更</h2></div><button type="button" className="icon-button" aria-label="关闭会议变更" onClick={closeModal}><X size={18} /></button></div>{changePreview ? <div className="organizer-change-preview"><span className="status-tag amber">待确认发布</span><h3>变更影响预览</h3><p><b>{meetingName(changeMeeting, state.locale)}</b> 的地点将更新为 {changeVenue}。</p><div><span>已确认参会人</span><b>{state.reservations.filter((reservation) => reservation.meetingId === changeMeeting.id && ['approved', 'checked-in'].includes(reservation.status)).length} 人</b></div><div><span>待审核申请</span><b>{state.reservations.filter((reservation) => reservation.meetingId === changeMeeting.id && reservation.status === 'pending').length} 人</b></div><p className="organizer-preview-note">确认后将生成参会人通知，并写入会务处理记录。</p><div className="dialog-actions"><button type="button" className="button secondary" onClick={() => setChangePreview(false)}>返回编辑</button><button type="button" className="button primary" onClick={() => { setActionFeedback(`已发布「${meetingName(changeMeeting, state.locale)}」的会议变更，通知已生成。`); closeModal() }}>确认发布</button></div></div> : <form className="organizer-action-form" onSubmit={(event) => { event.preventDefault(); setChangePreview(true) }}><p>选择会议并填写变更内容，发布前会先查看影响范围。</p><label htmlFor="change-meeting">选择会议</label><select id="change-meeting" value={changeMeetingId} onChange={(event) => { const meetingId = event.target.value as MeetingId; setChangeMeetingId(meetingId); setChangeVenue(meetingById(meetingId).venue) }}>{meetings.map((meeting) => <option value={meeting.id} key={meeting.id}>{meetingName(meeting, state.locale)}</option>)}</select><label htmlFor="change-venue">更新后的地点或线上信息</label><input id="change-venue" value={changeVenue} onChange={(event) => setChangeVenue(event.target.value)} required /><label htmlFor="change-note">变更说明</label><textarea id="change-note" defaultValue="因现场议程调整，更新会议地点与参会指引。" required /><div className="dialog-actions"><button type="button" className="button secondary" onClick={closeModal}>取消</button><button type="submit" className="button primary">查看影响预览</button></div></form>}</section></div>}
  </PageShell>
}

function OrganizerMeetingDetail() {
  const { state } = useDemo()
  const meeting = currentMeeting()
  const reservations = state.reservations.filter((reservation) => reservation.meetingId === meeting.id)
  const confirmed = reservations.filter((reservation) => ['approved', 'checked-in'].includes(reservation.status))
  return <PageShell active="organizer-meeting-detail" organizer organizerActive="organizer-meetings">
    <section className="organizer-page organizer-detail-page"><a className="back-link" href={organizerHref('organizer-meetings')}><ArrowLeft size={18} /> 返回会议与变更</a><div className="organizer-page-heading"><div><p>会议管理 · {meeting.id.toUpperCase()}</p><h1>{meetingName(meeting, state.locale)}</h1><span>会务端视图：核对会议信息、预约容量和参会人员。</span></div><span className="status-tag">{meeting.type}</span></div><section className="organizer-detail-grid"><article className="surface-card"><h2>会议信息</h2><MeetingTimePair meeting={meeting} timezone={state.timezone} /><div className="organizer-detail-list"><span>地点</span><b>{meeting.venue}</b><span>会议状态</span><b>{meeting.id === 'mobility' ? '已发布' : '已排期'}</b><span>会务编号</span><b>GM-2026-{meeting.id === 'media' ? '001' : meeting.id === 'ai' ? '002' : '003'}</b></div></article><article className="surface-card"><h2>预约与容量</h2><strong>{confirmed.length} / {meeting.capacity}</strong><p>已确认参会人</p><div className="organizer-capacity-bar"><span style={{ width: `${Math.max(8, confirmed.length / meeting.capacity * 100)}%` }} /></div><div className="organizer-detail-list"><span>待审核申请</span><b>{reservations.filter((reservation) => reservation.status === 'pending').length} 人</b><span>剩余容量</span><b>{meeting.capacity - confirmed.length} 人</b></div></article><article className="surface-card organizer-detail-wide"><div className="section-heading"><h2>参会人员</h2><span>{reservations.length} 条预约</span></div>{reservations.length ? <div className="organizer-attendee-list">{reservations.map((reservation) => <div key={reservation.id}><span className="avatar">{reservation.attendeeName.slice(0, 1)}</span><div><b>{reservation.attendeeName}</b><p>{reservation.organization}</p></div><span className={`status-tag ${['approved', 'checked-in'].includes(reservation.status) ? 'success' : ''}`}>{statusLabel(reservation.status)}</span></div>)}</div> : <p className="empty-copy">当前没有预约记录。</p>}</article><article className="surface-card organizer-detail-wide"><div className="section-heading"><h2>会务发布记录</h2><span>本地演示</span></div><div className="organizer-release-list"><p><b>会议已发布</b><span>08 Aug · 已生成参会链接与基础资料</span></p><p><b>地点信息已确认</b><span>{meeting.venue} · 已同步至参会端</span></p></div></article></section></section>
  </PageShell>
}

function Checkin() {
  const { state } = useDemo()
  const meeting = meetingById('media')
  return <PageShell active="checkin" organizer organizerActive="checkin">
    <section className="checkin-shell"><PageTitle eyebrow="现场核验 · 会务人员" title="核验预约凭证" copy="仅显示完成核验所需的最少信息。" /><div className="checkin-grid"><article className="surface-card scanner-card"><span className="scanner-icon"><QrCode size={46} /></span><h2>输入模拟核验码</h2><p>有效码会显示对应预约，重复或非本场码会给出原因。</p><label htmlFor="pass-code">核验码</label><div className="code-input"><input id="pass-code" value="GM-0826-019" readOnly /><button className="button primary" disabled>开始核验</button></div></article><article className="surface-card verify-result"><p>预置结果示例</p><span className="verified-mark"><Check size={30} /></span><h2>{meetingName(meeting, state.locale)}</h2><div><b>薛花花</b><span>预约 GM-2026-019</span></div><span className="status-tag success">已签到 · 09:28</span></article></div></section>
  </PageShell>
}

function OrganizerRecords() {
  const { state } = useDemo()
  const pendingCount = state.reservations.filter((reservation) => reservation.status === 'pending').length
  return <PageShell active="organizer-records" organizer organizerActive="review">
    <div className="review-layout todo-records-layout">
      <TodoSidebar pendingCount={pendingCount} active="records" />
      <section className="review-detail organizer-records-detail"><div className="organizer-page-heading"><div><p>会务操作记录</p><h1>处理可追溯</h1><span>仅显示当前负责会议的审核、变更和核验记录。</span></div><a className="button secondary" href={organizerHref('review')}>返回待办</a></div><article className="surface-card audit-card">{state.audits.map((audit) => <Audit key={audit.id} icon={audit.type.includes('批准') ? <Check size={16} /> : audit.type.includes('取消') ? <X size={16} /> : <Bell size={16} />} title={audit.type} detail={localizedMeetingCopy(audit.detail, state.locale)} />)}</article></section>
    </div>
  </PageShell>
}

function Admin() {
  const { state } = useDemo()
  return <PageShell active="admin">
    <PageTitle eyebrow="系统管理员 · 演示身份" title="权限与操作记录" copy="管理员只能查看模拟数据与角色边界。" />
      <section className="content-section stack"><article className="admin-roles"><div><ShieldCheck size={22} /><b>参会人员</b><span>查询、预约、处理本人日程与凭证</span></div><div><ClipboardCheck size={22} /><b>会务人员</b><span>审核负责会议、发布变更与现场核验</span></div><div><Users size={22} /><b>系统管理员</b><span>查看全部模拟记录，不能代办审核</span></div></article><article className="surface-card audit-card"><div className="section-heading"><h2>最近操作</h2><span>本地模拟数据</span></div>{state.audits.map((audit) => <Audit key={audit.id} icon={<TicketCheck size={16} />} title={audit.type} detail={localizedMeetingCopy(audit.detail, state.locale)} />)}</article></section>
  </PageShell>
}

function Audit({ icon, title, detail }: { icon: ReactNode; title: string; detail: string }) {
  return <div className="audit-row"><span>{icon}</span><div><b>{title}</b><p>{detail}</p></div><time>09 Aug</time></div>
}

export function App() {
  const forceSeed = new URLSearchParams(window.location.search).get('scenario') === 'seed'
  const [state, setState] = useState(() => {
    const initial = loadDemoState(forceSeed)
    persistDemoState(initial)
    return initial
  })
  const write = (next: DemoState) => {
    persistDemoState(next)
    setState(next)
  }
  const setLocale = (locale: Locale) => write({ ...state, locale })
  const setTimezone = (timezone: TimeZone) => write({ ...state, timezone })
  const reset = () => {
    const initial = seedDemoState()
    persistDemoState(initial)
    window.history.replaceState({}, '', href('discover'))
    setState(initial)
  }
  const screen = getScreen()
  const views: Record<Screen, ReactNode> = { discover: <Discover />, detail: <Detail />, booking: <Booking />, conflict: <Conflict />, 'application-result': <ApplicationResult />, 'change-impact': <ChangeImpact />, notice: <Notice />, review: <Review />, 'organizer-meetings': <OrganizerMeetings />, 'organizer-meeting-detail': <OrganizerMeetingDetail />, schedule: <Schedule />, profile: <Profile />, checkin: <Checkin />, 'organizer-records': <OrganizerRecords />, admin: <Admin /> }
  return <DemoContext.Provider value={{ state, write, setLocale, setTimezone, reset }}>{views[screen]}</DemoContext.Provider>
}
