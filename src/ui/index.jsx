import { cn } from '../utils/cn.js'

export function PageHeader({ kicker, title, sub, right }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
      <div className="min-w-0">
        {kicker && <div className="kicker mb-2">{kicker}</div>}
        <h1 className="text-[30px] md:text-[38px]">{title}</h1>
        {sub && <p className="text-dim mt-2 text-[15px] max-w-[62ch]">{sub}</p>}
      </div>
      {right && <div className="flex items-center gap-2">{right}</div>}
    </div>
  )
}
export function Card({ className, children, ...p }) { return <div className={cn('card p-5', className)} {...p}>{children}</div> }
export function Tag({ tone, children, className }) { return <span className={cn('tag', tone, className)}>{children}</span> }
export function Btn({ tone = 'primary', size, className, children, ...p }) { return <button className={cn('btn', tone, size, className)} {...p}>{children}</button> }
export function Avatar({ name, src, size = 40, className, gold }) {
  const ini = (name || '?').split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
  return <span className={cn('avatar', gold && 'gold', className)} style={{ width: size, height: size, fontSize: size * 0.34 }}>{src ? <img src={src} alt="" /> : ini}</span>
}
export function Empty({ title, sub, action }) {
  return <div className="card p-10 text-center"><h3 className="text-[22px]">{title}</h3>{sub && <p className="text-dim mt-2">{sub}</p>}{action && <div className="mt-4">{action}</div>}</div>
}
export function Field({ label, children, hint }) {
  return <label className="block mb-3"><div className="kicker dim mb-1.5">{label}</div>{children}{hint && <div className="text-dimmer text-xs mt-1">{hint}</div>}</label>
}
export function Stat({ label, value, sub, tone }) {
  return (
    <div className={cn('card p-4', tone === 'gold' && 'gold')}>
      <div className={cn('num font-extrabold text-[24px] md:text-[30px] leading-none tracking-[-0.03em]', tone === 'gold' ? 'text-gold-2' : 'text-white')}>{value}</div>
      <div className="kicker dim mt-2">{label}</div>
      {sub && <div className="text-[13px] mt-1 text-dim">{sub}</div>}
    </div>
  )
}
export function Banner({ tone = 'gold', children }) {
  return <div className={cn('rounded-[14px] px-4 py-3 text-[13.5px] mb-4 border', tone === 'gold' && 'bg-gold/10 border-line text-gold-3', tone === 'red' && 'bg-red/10 border-red/30 text-red', tone === 'grey' && 'bg-sur-top border-transparent text-dim')}>{children}</div>
}
export function Bar({ pct, className }) { return <div className={cn('bar', className)}><i style={{ width: pct + '%' }} /></div> }
/* el anillo de avance del prototipo, en SVG */
export function Anillo({ pct, size = 128, label = 'Completado' }) {
  const r = (size - 12) / 2; const c = 2 * Math.PI * r
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-sur-top)" strokeWidth="8" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="url(#g)" strokeWidth="8" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)} style={{ transition: 'stroke-dashoffset .6s cubic-bezier(.32,.72,0,1)' }} />
        <defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stopColor="var(--color-gold-deep)" /><stop offset="1" stopColor="var(--color-gold-2)" /></linearGradient></defs>
      </svg>
      <div className="absolute text-center"><div className="num font-extrabold text-[28px] leading-none">{pct}%</div><div className="kicker dim mt-1" style={{ fontSize: 9 }}>{label}</div></div>
    </div>
  )
}
