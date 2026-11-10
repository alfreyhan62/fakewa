import { useEffect, useMemo, useRef, useState } from 'react'
import { toPng } from 'html-to-image'
import { Camera, Check, ChevronDown, Download, FileDown, FileUp, GripVertical, Image, Mic, Paperclip, Plus, Save, Smile, Trash2 } from 'lucide-react'
import { create } from 'zustand'
import navbarAtas from './assets/navbaratas.png'
import './App.css'

const initialChat = {
  profile: { name: 'Dinda', phone: '+62 8', presence: 'online', photo: '' },
  appearance: { theme: 'light', wallpaper: 'doodle' },
  ui: { statusTime: '21.52', battery: '33' },
  messages: [
    { id: '1', sender: 'me', text: 'Halo juga! Lagi santai di rumah.', time: '20.43', receipt: 'read' },
    { id: '2', sender: 'contact', text: 'tes', time: '03.21', receipt: 'sent' },
  ],
}

const loadChat = () => {
  try { return JSON.parse(localStorage.getItem('wa-chat-studio')) || initialChat } catch { return initialChat }
}

const useChat = create((set) => ({
  chat: loadChat(),
  setChat: (chat) => set({ chat }),
  update: (section, values) => set((state) => ({ chat: { ...state.chat, [section]: { ...state.chat[section], ...values } } })),
  setMessages: (messages) => set((state) => ({ chat: { ...state.chat, messages } })),
}))

const receiptIcon = (receipt) => receipt === 'sent' ? <Check className="single-check" /> : <span className={`double-check ${receipt === 'read' ? 'read' : ''}`}><Check /><Check /></span>

function StatusBar({ battery }) {
  const [time, setTime] = useState(() => new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':'))
  const [deviceBattery, setDeviceBattery] = useState(null)
  useEffect(() => {
    const updateTime = () => setTime(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':'))
    const interval = setInterval(updateTime, 60000)
    return () => clearInterval(interval)
  }, [])
  useEffect(() => {
    if (!navigator.getBattery) return
    let manager
    const updateBattery = () => setDeviceBattery(String(Math.round(manager.level * 100)))
    navigator.getBattery().then((batteryManager) => {
      manager = batteryManager
      updateBattery()
      manager.addEventListener('levelchange', updateBattery)
    })
    return () => manager?.removeEventListener('levelchange', updateBattery)
  }, [])
  return <div className="status-bar"><div className="status-left"><span>{time}</span></div><div className="status-icons"><img src={navbarAtas} alt="Status jaringan" /><span>{deviceBattery ?? battery ?? '33'}</span></div></div>
}

function ChatPreview({ chat }) {
  const previewRef = useRef(null)
  const viewportRef = useRef(null)
  const [fullscreen, setFullscreen] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [fullscreenScale, setFullscreenScale] = useState(1)
  const { profile, appearance, ui, messages } = chat
  useEffect(() => {
    if (!fullscreen) return
    const resize = () => setFullscreenScale(viewportRef.current.clientWidth / 720)
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [fullscreen])
  const exportPng = async () => {
    setExporting(true)
    try {
      const dataUrl = await toPng(previewRef.current, { pixelRatio: 1, cacheBust: true, width: 720, height: 1600, style: { transform: 'none' } })
      const link = document.createElement('a')
      link.download = 'wa-chat-simulasi.png'
      link.href = dataUrl
      link.click()
    } finally { setExporting(false) }
  }
  return <section className={`preview-wrap ${fullscreen ? 'fullscreen' : ''}`}><div className="preview-actions"><button type="button" className="preview-toggle" onClick={() => setFullscreen(!fullscreen)}>{fullscreen ? 'Tutup preview' : 'Preview layar penuh'}</button><button type="button" onClick={exportPng} disabled={exporting}><Download /> {exporting ? 'Menyimpan' : 'PNG 720×1600'}</button></div><div className="preview-viewport" ref={viewportRef}><div className={`phone ${appearance.theme}`} ref={previewRef} style={fullscreen ? { transform: `scale(${fullscreenScale})` } : undefined}>
    <StatusBar battery={ui?.battery} />
    <header className="chat-header"><img className="header-icon back-icon" src="/header-icons/back.png" alt="Kembali" /><div className="avatar">{profile.photo ? <img src={profile.photo} alt="Foto kontak" /> : profile.name.slice(0, 1)}</div><div className="contact"><strong>{profile.name || 'Nama kontak'}</strong><small>{profile.presence}</small></div><div className="header-actions"><img className="header-icon video-icon" src="/header-icons/account.png" alt="Panggilan video" /><img className="header-icon" src="/header-icons/phone.png" alt="Telepon" /><span className="header-caret">▾</span><img className="header-icon menu-icon" src="/header-icons/menu.png" alt="Menu" /></div></header>
    <main className={`messages ${appearance.wallpaper}`}><div className="simulation">SIMULASI</div><div className="date-chip">Hari ini</div><div className="encryption"><svg className="encryption-lock" viewBox="0 0 16 16" aria-hidden="true"><path d="M11.5 6V4.75a3.5 3.5 0 0 0-7 0V6H3.75A1.75 1.75 0 0 0 2 7.75v5.5C2 14.22 2.78 15 3.75 15h8.5c.97 0 1.75-.78 1.75-1.75v-5.5C14 6.78 13.22 6 12.25 6h-.75ZM6 4.75a2 2 0 1 1 4 0V6H6V4.75Zm2 7.5a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5Z" /></svg> Pesan dan telepon terenkripsi secara end-to-end. Hanya orang di obrolan ini yang bisa membaca, mendengarkan, atau membagikannya. <b>Pelajari selengkapnya.</b></div>{messages.map((message) => <div className={`message ${message.sender}`} key={message.id}><span>{message.text}</span><span className="meta">{message.time} {message.sender === 'me' && <i>{receiptIcon(message.receipt)}</i>}</span></div>)}</main>
    <div className="composer"><div className="input"><Smile /><span>Ketik pesan</span><Paperclip /><Camera /></div><button type="button" aria-label="Rekam suara"><Mic /></button></div>
  </div></div></section>
}

function ProfileEditor({ chat }) {
  const update = useChat((state) => state.update)
  const [source, setSource] = useState('')
  const [zoom, setZoom] = useState(1)
  const [x, setX] = useState(0)
  const [y, setY] = useState(0)
  const photo = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => { setSource(reader.result); setZoom(1); setX(0); setY(0) }
    reader.readAsDataURL(file)
    event.target.value = ''
  }
  const applyCrop = () => {
    const image = new window.Image()
    image.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = canvas.height = 600
      const context = canvas.getContext('2d')
      const base = Math.max(600 / image.width, 600 / image.height)
      const scale = base * zoom
      const width = image.width * scale
      const height = image.height * scale
      context.drawImage(image, (600 - width) / 2 + x * Math.abs(600 - width) / 2, (600 - height) / 2 + y * Math.abs(600 - height) / 2, width, height)
      update('profile', { photo: canvas.toDataURL('image/jpeg', .92) })
      setSource('')
    }
    image.src = source
  }
  return <div className="editor-form"><label>Foto kontak <span className="upload"><Image /> Upload atau kamera<input type="file" accept="image/*" capture="user" onChange={photo} /></span></label>{source && <div className="cropper"><div className="crop-preview"><img src={source} alt="Pratinjau crop" style={{ transform: `translate(${x * 50}%, ${y * 50}%) scale(${zoom})` }} /></div><label>Zoom<input type="range" min="1" max="2.5" step=".01" value={zoom} onChange={(e) => setZoom(Number(e.target.value))} /></label><label>Geser horizontal<input type="range" min="-1" max="1" step=".01" value={x} onChange={(e) => setX(Number(e.target.value))} /></label><label>Geser vertikal<input type="range" min="-1" max="1" step=".01" value={y} onChange={(e) => setY(Number(e.target.value))} /></label><button type="button" className="apply-crop" onClick={applyCrop}>Terapkan crop</button></div>}<label>Nama kontak<input value={chat.profile.name} onChange={(e) => update('profile', { name: e.target.value })} /></label><label>Nomor telepon<input value={chat.profile.phone} onChange={(e) => update('profile', { phone: e.target.value })} /></label><label>Status<select value={chat.profile.presence} onChange={(e) => update('profile', { presence: e.target.value })}><option value="online">online</option><option value="sedang mengetik...">sedang mengetik...</option><option value="terakhir dilihat hari ini pukul 20.30">terakhir dilihat hari ini pukul 20.30</option><option value="">Kosong</option></select></label></div>
}

function MessagesEditor({ chat }) {
  const setMessages = useChat((state) => state.setMessages)
  const change = (id, values) => setMessages(chat.messages.map((item) => item.id === id ? { ...item, ...values } : item))
  const remove = (id) => setMessages(chat.messages.filter((item) => item.id !== id))
  const add = () => setMessages([...chat.messages, { id: crypto.randomUUID(), sender: 'me', text: 'Pesan baru', time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace(':', '.'), receipt: 'sent' }])
  const move = (index, direction) => { const next = [...chat.messages]; const target = index + direction; if (target < 0 || target >= next.length) return; [next[index], next[target]] = [next[target], next[index]]; setMessages(next) }
  return <div className="message-editor"><button type="button" className="add" onClick={add}><Plus /> Tambah pesan</button>{chat.messages.map((message, index) => <article key={message.id}><div className="message-row"><GripVertical /><textarea value={message.text} aria-label="Isi pesan" onChange={(e) => change(message.id, { text: e.target.value })} /><button type="button" className="delete" aria-label="Hapus pesan" onClick={() => remove(message.id)}><Trash2 /></button></div><div className="message-controls"><select value={message.sender} onChange={(e) => change(message.id, { sender: e.target.value })}><option value="me">Saya</option><option value="contact">Kontak</option></select><input type="time" value={message.time.replace('.', ':')} onChange={(e) => change(message.id, { time: e.target.value.replace(':', '.') })} /><select value={message.receipt} onChange={(e) => change(message.id, { receipt: e.target.value })} disabled={message.sender === 'contact'}><option value="sent">Satu centang</option><option value="delivered">Dua abu-abu</option><option value="read">Dua biru</option></select><button type="button" onClick={() => move(index, -1)}>↑</button><button type="button" onClick={() => move(index, 1)}>↓</button></div></article>)}</div>
}

function AppearanceEditor({ chat }) {
  const update = useChat((state) => state.update)
  return <div className="editor-form choices"><label>Jam status bar<input type="time" value={(chat.ui?.statusTime || '21.52').replace('.', ':')} onChange={(e) => update('ui', { statusTime: e.target.value.replace(':', '.') })} /></label><label>Baterai<input inputMode="numeric" maxLength="3" value={chat.ui?.battery ?? '33'} onChange={(e) => update('ui', { battery: e.target.value.replace(/\D/g, '') })} /></label></div>
}

function App() {
  const chat = useChat((state) => state.chat)
  const setChat = useChat((state) => state.setChat)
  const [tab, setTab] = useState('profile')
  useEffect(() => localStorage.setItem('wa-chat-studio', JSON.stringify(chat)), [chat])
  const editor = useMemo(() => tab === 'profile' ? <ProfileEditor chat={chat} /> : tab === 'messages' ? <MessagesEditor chat={chat} /> : <AppearanceEditor chat={chat} />, [chat, tab])
  const exportJson = () => { const blob = new Blob([JSON.stringify(chat, null, 2)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = 'wa-chat-session.json'; link.click(); URL.revokeObjectURL(url) }
  const importJson = (event) => { const file = event.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => { try { setChat(JSON.parse(reader.result)) } catch { window.alert('File JSON tidak valid.') } }; reader.readAsText(file); event.target.value = '' }
  return <div className="app"><header className="toolbar"><div><strong>WA Chat Studio</strong><small>Editor simulasi</small></div><div><label className="icon-button" title="Import JSON"><FileUp /><input type="file" accept="application/json" onChange={importJson} /></label><button type="button" className="icon-button" title="Export JSON" onClick={exportJson}><FileDown /></button><span className="saved"><Save /> Tersimpan</span></div></header><div className="workspace"><ChatPreview chat={chat} /><aside className="editor"><div className="tabs">{[['profile', 'Profil'], ['messages', 'Pesan'], ['appearance', 'Tampilan']].map(([id, label]) => <button type="button" className={tab === id ? 'active' : ''} onClick={() => setTab(id)} key={id}>{label}</button>)}</div><div className="sheet-handle"><ChevronDown /></div><div className="editor-content"><h1>{tab === 'profile' ? 'Profil kontak' : tab === 'messages' ? 'Percakapan' : 'Tampilan chat'}</h1>{editor}</div></aside></div></div>
}

export default App
