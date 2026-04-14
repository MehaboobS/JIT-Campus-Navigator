import { useState, useRef, useCallback, useEffect } from 'react'
import './index.css'

const BLOCKS = {
  A: {
    label: 'A Block',
    floors: [
      { id: 'basement', label: 'B', fullLabel: 'Basement', svg: '/A-block-basement_-_Copy.svg' },
      { id: 'ground',   label: 'G', fullLabel: 'Ground',   svg: '/A-block-groundfloor_-_Copy.svg' },
      { id: 'first',    label: '1', fullLabel: '1st Floor', svg: '/A-block-firstfloor_-_Copy.svg' },
      { id: 'second',   label: '2', fullLabel: '2nd Floor', svg: '/A-block-secondfloor_-_Copy.svg' },
      { id: 'third',    label: '3', fullLabel: '3rd Floor', svg: '/A-block-thirdfloor_-_Copy.svg' },
    ]
  },
  B: {
    label: 'B Block',
    floors: [
      { id: 'basement-2', label: 'B2', fullLabel: 'Basement 2', svg: '/B-Block_basement.svg' },
      { id: 'basement-1', label: 'B1', fullLabel: 'Basement 1', svg: '/B Block - Basement-1.svg' },
      { id: 'ground',   label: 'G', fullLabel: 'Ground',   svg: '/B-block-groundfloor.svg' },
      { id: 'first',    label: '1', fullLabel: '1st Floor', svg: '/B-block-firstfloor.svg' },
      { id: 'second',   label: '2', fullLabel: '2nd Floor', svg: '/B-block-secondfloor.svg' },
      { id: 'third',    label: '3', fullLabel: '3rd Floor', svg: '/B-block-thirdfloor_-_Copy.svg' },
    ]
  }
}

const MIN_ZOOM = 0.25, MAX_ZOOM = 5, ZOOM_STEP = 0.3

function MapViewport({ svgSrc, resetToken, isLoading, setIsLoading }) {
  const viewportRef = useRef(null)
  const canvasRef = useRef(null)
  const state = useRef({ scale: 1, panX: 0, panY: 0 })
  const drag = useRef(null)
  const touch = useRef(null)
  const [grabbing, setGrabbing] = useState(false)
  const [imgNatural, setImgNatural] = useState({ w: 1200, h: 800 })

  const applyTransform = useCallback((panX, panY, scale, animate = false) => {
    const el = canvasRef.current
    if (!el) return
    Object.assign(state.current, { panX, panY, scale })
    el.style.transition = animate ? 'transform 0.3s cubic-bezier(.25,.46,.45,.94)' : 'none'
    el.style.transform = `translate(-50%, -50%) translate(${panX}px, ${panY}px) scale(${scale})`
  }, [])

  const fitToScreen = useCallback(() => {
    const vp = viewportRef.current
    if (!vp) return
    const s = Math.min(vp.clientWidth / imgNatural.w, vp.clientHeight / imgNatural.h) * 0.82
    applyTransform(0, 0, Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, s)), true)
  }, [imgNatural, applyTransform])

  const zoom = useCallback((delta) => {
    const s = state.current
    const newScale = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, s.scale + delta))
    applyTransform(s.panX, s.panY, newScale)
  }, [applyTransform])

  useEffect(() => {
    window.__mapZoom = { in: () => zoom(ZOOM_STEP), out: () => zoom(-ZOOM_STEP), reset: fitToScreen }
  }, [zoom, fitToScreen])

  useEffect(() => {
    drag.current = null
    touch.current = null
    setGrabbing(false)
    applyTransform(0, 0, 1, false)
  }, [resetToken, applyTransform])

  useEffect(() => {
    const vp = viewportRef.current
    if (!vp) return
    const onWheel = (e) => {
      e.preventDefault()
      const step = Math.max(-0.4, Math.min(0.4, -e.deltaY * 0.0025))
      zoom(step)
    }
    const onTouchMove = (e) => {
      e.preventDefault()
      const t = touch.current
      if (!t) return
      if (t.type === 'pan' && e.touches.length === 1) {
        applyTransform(t.ox + e.touches[0].clientX - t.sx, t.oy + e.touches[0].clientY - t.sy, state.current.scale)
      } else if (t.type === 'pinch' && e.touches.length === 2) {
        const dx = e.touches[1].clientX - e.touches[0].clientX
        const dy = e.touches[1].clientY - e.touches[0].clientY
        const ratio = Math.sqrt(dx*dx + dy*dy) / t.dist
        applyTransform(state.current.panX, state.current.panY, Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, t.scale * ratio)))
      }
    }
    vp.addEventListener('wheel', onWheel, { passive: false })
    vp.addEventListener('touchmove', onTouchMove, { passive: false })
    return () => { vp.removeEventListener('wheel', onWheel); vp.removeEventListener('touchmove', onTouchMove) }
  }, [zoom, applyTransform])

  useEffect(() => {
    const ro = new ResizeObserver(fitToScreen)
    if (viewportRef.current) ro.observe(viewportRef.current)
    return () => ro.disconnect()
  }, [fitToScreen])

  const lastTap = useRef(0)

  return (
    <div
      ref={viewportRef}
      className={`map-viewport${grabbing ? ' grabbing' : ''}`}
      style={{ background: 'radial-gradient(ellipse at 50% 40%, #0d1630 0%, #080c18 100%)' }}
      onMouseDown={e => { if (e.button !== 0) return; drag.current = { sx: e.clientX, sy: e.clientY, ox: state.current.panX, oy: state.current.panY }; setGrabbing(true) }}
      onMouseMove={e => { if (!drag.current) return; applyTransform(drag.current.ox + e.clientX - drag.current.sx, drag.current.oy + e.clientY - drag.current.sy, state.current.scale) }}
      onMouseUp={() => { drag.current = null; setGrabbing(false) }}
      onMouseLeave={() => { drag.current = null; setGrabbing(false) }}
      onTouchStart={e => {
        if (e.touches.length === 1) touch.current = { type: 'pan', sx: e.touches[0].clientX, sy: e.touches[0].clientY, ox: state.current.panX, oy: state.current.panY }
        else if (e.touches.length === 2) {
          const dx = e.touches[1].clientX - e.touches[0].clientX, dy = e.touches[1].clientY - e.touches[0].clientY
          touch.current = { type: 'pinch', dist: Math.sqrt(dx*dx + dy*dy), scale: state.current.scale }
        }
      }}
      onTouchEnd={e => {
        const now = Date.now()
        if (now - lastTap.current < 300 && e.changedTouches.length === 1) {
          const t = e.changedTouches[0]
          if (state.current.scale < 1.8) zoom(1, t.clientX, t.clientY)
          else fitToScreen()
        }
        lastTap.current = now
        touch.current = null
      }}
    >
      {/* Grid overlay */}
      <div style={{ position:'absolute',inset:0,pointerEvents:'none',backgroundImage:'linear-gradient(rgba(0,217,245,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(0,217,245,0.02) 1px,transparent 1px)',backgroundSize:'48px 48px' }} />

      <div ref={canvasRef} className="map-canvas" style={{ transform: 'translate(-50%, -50%) translate(0px, 0px) scale(1)' }}>
        <img
          key={svgSrc} src={svgSrc} alt="Floor map" draggable={false}
          style={{ maxWidth: 'none', display: 'block', filter: 'drop-shadow(0 0 40px rgba(0,217,245,0.06))' }}
          onLoad={e => { setImgNatural({ w: e.target.naturalWidth, h: e.target.naturalHeight }); setIsLoading(false); requestAnimationFrame(fitToScreen) }}
          onError={() => setIsLoading(false)}
        />
      </div>

      {/* Vignette */}
      <div style={{ position:'absolute',inset:0,pointerEvents:'none',background:'radial-gradient(ellipse at center, transparent 35%, rgba(8,12,24,0.55) 100%)' }} />

      {isLoading && (
        <div style={{ position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',background:'rgba(8,12,24,0.75)',backdropFilter:'blur(10px)',zIndex:50 }}>
          <div className="loading-spin" style={{ width:40,height:40,borderRadius:'50%',border:'3px solid rgba(0,217,245,0.15)',borderTopColor:'var(--accent)' }} />
          <div style={{ marginTop:14,fontFamily:'Syne',fontSize:12,color:'var(--text-muted)',letterSpacing:'0.1em' }}>LOADING MAP…</div>
        </div>
      )}
    </div>
  )
}

export default function App() {
  const [block, setBlock] = useState('A')
  const [floorIdx, setFloorIdx] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [showHelp, setShowHelp] = useState(false)

  const currentBlock = BLOCKS[block]
  const floors = currentBlock.floors
  const safeFloor = Math.min(floorIdx, floors.length - 1)
  const floor = floors[safeFloor]
  const mapResetToken = `${block}-${floor.id}`
  const getDefaultFloorIndex = blockKey => {
    const blockFloors = BLOCKS[blockKey].floors
    const groundIndex = blockFloors.findIndex(f => f.id === 'ground')
    return groundIndex >= 0 ? groundIndex : 0
  }

  const changeBlock = b => {
    setBlock(b)
    setFloorIdx(getDefaultFloorIndex(b))
    setIsLoading(true)
  }
  const changeFloor = idx => { if (idx !== safeFloor) { setFloorIdx(idx); setIsLoading(true) } }

  return (
    <div className="app-shell">

      {/* HEADER */}
      <header className="glass app-header" style={{ borderTop:'none',borderLeft:'none',borderRight:'none',borderBottom:'1px solid var(--border)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:34,height:34,borderRadius:9,background:'linear-gradient(135deg,var(--accent) 0%,#005580 100%)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 0 14px rgba(0,217,245,0.35)',flexShrink:0 }}>
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M10 2L18 7V13L10 18L2 13V7Z" stroke="#000" strokeWidth="1.5"/><circle cx="10" cy="10" r="2.5" fill="#000"/></svg>
          </div>
          <div>
            <div style={{ fontFamily:'Syne', fontWeight:800, fontSize:15, letterSpacing:'0.05em', lineHeight:1.1 }}>CAMPUS <span style={{color:'var(--accent)'}}>MAP</span></div>
            <div className="header-subtitle" style={{ fontSize:10, color:'var(--text-muted)', letterSpacing:'0.08em' }}>INTERACTIVE NAVIGATOR</div>
          </div>
        </div>

        <div className="block-switch" style={{ display:'flex', gap:6 }}>
          {Object.keys(BLOCKS).map(b => (
            <button key={b} onClick={() => changeBlock(b)} style={{ padding:'6px 14px', borderRadius:8, fontFamily:'Syne', fontWeight:700, fontSize:13, letterSpacing:'0.05em', cursor:'pointer', border:'1.5px solid', borderColor:block===b?'var(--accent)':'var(--border)', background:block===b?'var(--accent)':'rgba(255,255,255,0.03)', color:block===b?'#000':'var(--text-muted)', boxShadow:block===b?'0 0 14px rgba(0,217,245,0.3)':'none', transition:'all 0.18s' }}>
              {BLOCKS[b].label}
            </button>
          ))}
        </div>

        <button onClick={() => setShowHelp(v=>!v)} style={{ width:34,height:34,borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',background:showHelp?'rgba(0,217,245,0.1)':'rgba(255,255,255,0.03)',border:'1.5px solid',borderColor:showHelp?'rgba(0,217,245,0.35)':'var(--border)',cursor:'pointer',color:showHelp?'var(--accent)':'var(--text-muted)',transition:'all 0.18s' }}>
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.4"/><path d="M8 7v4.5M8 5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
        </button>
      </header>

      {/* CONTENT */}
      <div className="app-main" style={{ display:'flex', position:'relative', overflow:'hidden' }}>

        {/* Sidebar – floor selector */}
        <aside className="glass floor-sidebar" style={{ flexShrink:0, zIndex:20, borderRight:'1px solid var(--border)', borderTop:'none',borderBottom:'none',borderLeft:'none', display:'flex',flexDirection:'column',alignItems:'center',padding:'14px 0',gap:6 }}>
          <div style={{ fontSize:9, color:'var(--text-muted)', fontFamily:'Syne', fontWeight:700, letterSpacing:'0.12em', writingMode:'vertical-rl', transform:'rotate(180deg)', marginBottom:8 }}>LEVEL</div>
          <div style={{ flex:1, display:'flex', flexDirection:'column', gap:5, justifyContent:'center', alignItems:'center' }}>
            {[...floors].reverse().map((f, ri) => {
              const idx = floors.length - 1 - ri
              const active = safeFloor === idx
              return (
                <button key={f.id} onClick={() => changeFloor(idx)} title={f.fullLabel} style={{ width:44,height:44,borderRadius:9,cursor:'pointer',fontFamily:'Syne',fontWeight:800,fontSize:13,border:'1.5px solid',borderColor:active?'var(--accent)':'var(--border)',background:active?'var(--accent)':'rgba(255,255,255,0.03)',color:active?'#000':'var(--text-muted)',boxShadow:active?'0 0 12px rgba(0,217,245,0.4)':'none',transition:'all 0.18s',position:'relative' }}>
                  {f.label}
                  {active && <span style={{ position:'absolute',right:-3,top:'50%',transform:'translateY(-50%)',width:5,height:5,borderRadius:'50%',background:'var(--accent)',boxShadow:'0 0 5px var(--accent)' }} />}
                </button>
              )
            })}
          </div>
          <svg width="44" height="44" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="20" stroke="rgba(0,217,245,0.12)" strokeWidth="1"/>
            <polygon points="24,8 26.5,20 24,18.5 21.5,20" fill="var(--accent)" opacity="0.85"/>
            <polygon points="24,40 26.5,28 24,29.5 21.5,28" fill="rgba(255,255,255,0.18)"/>
            <polygon points="8,24 20,21.5 18.5,24 20,26.5" fill="rgba(255,255,255,0.18)"/>
            <polygon points="40,24 28,21.5 29.5,24 28,26.5" fill="rgba(255,255,255,0.18)"/>
            <circle cx="24" cy="24" r="2.5" fill="var(--accent)" opacity="0.7"/>
            <text x="24" y="6" textAnchor="middle" fill="var(--accent)" fontSize="7" fontFamily="Syne" fontWeight="700">N</text>
          </svg>
        </aside>

        {/* Map area */}
        <div className="map-panel" style={{ flex:1, position:'relative', overflow:'hidden' }}>
          <MapViewport svgSrc={floor.svg} resetToken={mapResetToken} isLoading={isLoading} setIsLoading={setIsLoading} />

          {/* Location badge */}
          <div className="glass" style={{ position:'absolute',bottom:14,left:14,padding:'7px 13px',borderRadius:9,zIndex:20,display:'flex',alignItems:'center',gap:7 }}>
            <div style={{ width:7,height:7,borderRadius:'50%',background:'var(--accent)',boxShadow:'0 0 7px var(--accent)' }} />
            <span style={{ fontFamily:'Syne',fontWeight:600,fontSize:11,letterSpacing:'0.06em' }}>
              {currentBlock.label} <span style={{color:'var(--text-muted)',fontWeight:400,margin:'0 2px'}}>·</span> {floor.fullLabel}
            </span>
          </div>

          {/* Zoom controls */}
          <div className="glass" style={{ position:'absolute',bottom:14,right:14,zIndex:20,borderRadius:10,overflow:'hidden',display:'flex',flexDirection:'column' }}>
            {[
              { lbl:'+', fn:() => window.__mapZoom?.in(), tip:'Zoom In' },
              { lbl:'−', fn:() => window.__mapZoom?.out(), tip:'Zoom Out' },
              { lbl:'⊙', fn:() => window.__mapZoom?.reset(), tip:'Fit to Screen' },
            ].map((b,i) => (
              <button key={i} onClick={b.fn} title={b.tip} style={{ width:42,height:42,display:'flex',alignItems:'center',justifyContent:'center',background:'transparent',border:'none',borderBottom:i<2?'1px solid var(--border)':'none',cursor:'pointer',color:'var(--text-muted)',fontSize:i===2?15:19,fontWeight:300,lineHeight:1,transition:'all 0.12s' }}
                onMouseEnter={e => { e.currentTarget.style.background='rgba(0,217,245,0.08)'; e.currentTarget.style.color='var(--accent)' }}
                onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='var(--text-muted)' }}
              >{b.lbl}</button>
            ))}
          </div>
        </div>

        {/* Help panel */}
        {showHelp && (
          <aside className="glass" style={{ width:240,flexShrink:0,zIndex:20,borderLeft:'1px solid var(--border)',borderTop:'none',borderBottom:'none',borderRight:'none',padding:'18px 16px',overflowY:'auto' }}>
            <div style={{ fontFamily:'Syne',fontWeight:800,fontSize:13,letterSpacing:'0.06em',color:'var(--accent)',marginBottom:14 }}>HOW TO NAVIGATE</div>
            {[['🖱️','Scroll to zoom'],['✋','Drag to pan'],['🤏','Pinch to zoom (mobile)'],['👆','Double-tap to zoom'],['⊙','Reset to fit screen']].map(([ic,tx],i) => (
              <div key={i} style={{ display:'flex',alignItems:'center',gap:9,marginBottom:10,color:'var(--text-muted)',fontSize:12 }}>
                <span style={{fontSize:15}}>{ic}</span><span>{tx}</span>
              </div>
            ))}
            <div style={{ borderTop:'1px solid var(--border)',marginTop:14,paddingTop:14 }}>
              <div style={{ fontFamily:'Syne',fontWeight:700,fontSize:11,letterSpacing:'0.08em',color:'var(--text-muted)',marginBottom:10 }}>AVAILABLE MAPS</div>
              {Object.entries(BLOCKS).map(([k,b]) => (
                <div key={k} style={{ marginBottom:10 }}>
                  <div style={{ fontFamily:'Syne',fontWeight:700,fontSize:11,color:'var(--accent)',marginBottom:4 }}>{b.label}</div>
                  <div style={{ display:'flex',gap:3,flexWrap:'wrap' }}>
                    {b.floors.map(f => <span key={f.id} style={{ padding:'2px 7px',borderRadius:4,background:'rgba(255,255,255,0.05)',fontSize:10,color:'var(--text-muted)',fontFamily:'Syne' }}>{f.fullLabel}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </aside>
        )}
      </div>

      {/* FOOTER – floor tabs */}
      <footer className="glass app-footer" style={{ borderTop:'1px solid var(--border)',borderBottom:'none',borderLeft:'none',borderRight:'none' }}>
        <div style={{ display:'flex',gap:5,flex:1 }}>
          {floors.map((f,idx) => {
            const active = safeFloor === idx
            return (
              <button key={f.id} onClick={() => changeFloor(idx)} style={{ padding:'5px 11px',borderRadius:7,flexShrink:0,fontFamily:'Syne',fontWeight:700,fontSize:11,letterSpacing:'0.04em',cursor:'pointer',border:'1px solid',borderColor:active?'var(--accent)':'var(--border)',background:active?'rgba(0,217,245,0.1)':'transparent',color:active?'var(--accent)':'var(--text-muted)',transition:'all 0.15s' }}>
                {f.fullLabel}
              </button>
            )
          })}
        </div>
        <div style={{ display:'flex',gap:4,flexShrink:0,borderLeft:'1px solid var(--border)',paddingLeft:12 }}>
          {Object.keys(BLOCKS).map(b => (
            <button key={b} onClick={() => changeBlock(b)} style={{ padding:'5px 9px',borderRadius:7,fontFamily:'Syne',fontWeight:800,fontSize:11,letterSpacing:'0.04em',cursor:'pointer',border:'1px solid',borderColor:block===b?'var(--accent)':'var(--border)',background:block===b?'var(--accent)':'transparent',color:block===b?'#000':'var(--text-muted)',transition:'all 0.15s' }}>
              {b}
            </button>
          ))}
        </div>
      </footer>

    </div>
  )
}
