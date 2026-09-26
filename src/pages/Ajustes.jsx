import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PageHeader, Card, Field, Btn, Banner } from '../ui/index.jsx'
import { useData } from '../data/store.jsx'

/* AJUSTES · tu nombre, tu contraseña (también es donde aterriza el enlace de «he olvidado la
   contraseña»: `?recuperar=1`), y cerrar sesión. El correo no se cambia desde aquí. */
export default function Ajustes() {
  const { state, acciones, aula } = useData()
  const [params] = useSearchParams()
  const [nombre, setNombre] = useState(state.perfil?.nombre || state.alumno.nombre)
  const [pw1, setPw1] = useState('')
  const [pw2, setPw2] = useState('')
  const [aviso, setAviso] = useState(null)
  const [avisoPw, setAvisoPw] = useState(params.get('recuperar') ? { tone: 'gold', texto: 'Pon tu contraseña nueva aquí abajo.' } : null)
  useEffect(() => { setNombre(state.perfil?.nombre || state.alumno.nombre) }, [state.perfil?.nombre])
  const guardarNombre = async (e) => { e.preventDefault(); try { await acciones.cambiarNombre(nombre.trim()); setAviso({ tone: 'gold', texto: 'Nombre guardado.' }) } catch (err) { setAviso({ tone: 'red', texto: err.message }) } }
  const guardarPw = async (e) => {
    e.preventDefault()
    if (pw1.length < 8) return setAvisoPw({ tone: 'red', texto: 'Mínimo 8 caracteres.' })
    if (pw1 !== pw2) return setAvisoPw({ tone: 'red', texto: 'No coinciden.' })
    try { await acciones.cambiarContrasena(pw1); setPw1(''); setPw2(''); setAvisoPw({ tone: 'gold', texto: 'En esta vista previa no se guarda.' }) } catch (err) { setAvisoPw({ tone: 'red', texto: err.message }) }
  }
  return (
    <div>
      <PageHeader kicker="Cuenta" title="Ajustes" sub="Tu nombre, tu contraseña y tu sesión." />
      <div className="grid gap-5 md:grid-cols-2">
        <Card>
          <div className="kicker mb-3">Tu cuenta</div>
          {aviso && <Banner tone={aviso.tone}>{aviso.texto}</Banner>}
          <form onSubmit={guardarNombre}>
            <Field label="Nombre"><input className="input" value={nombre} onChange={(e) => setNombre(e.target.value)} /></Field>
            <Field label="Correo" hint="Es el correo con el que entraste. Para cambiarlo, escribe a soporte."><input className="input" value={state.perfil?.email || state.alumno.email} readOnly /></Field>
            <Btn type="submit" size="sm" disabled={!nombre.trim() || nombre.trim() === (state.perfil?.nombre || state.alumno.nombre)}>Guardar nombre</Btn>
          </form>
        </Card>
        <Card>
          <div className="kicker mb-3">Contraseña</div>
          {avisoPw && <Banner tone={avisoPw.tone}>{avisoPw.texto}</Banner>}
          <form onSubmit={guardarPw}>
            <Field label="Nueva contraseña"><input className="input" type="password" autoComplete="new-password" value={pw1} onChange={(e) => setPw1(e.target.value)} /></Field>
            <Field label="Repítela"><input className="input" type="password" autoComplete="new-password" value={pw2} onChange={(e) => setPw2(e.target.value)} /></Field>
            <Btn type="submit" size="sm" disabled={!pw1 || !pw2}>Cambiar contraseña</Btn>
          </form>
          <div className="kicker mt-6 mb-2">Soporte</div>
          <p className="text-dim text-[14px]">Acceso, facturación o algo que no va: {aula.textos?.soporte ? <a className="text-gold-2" href={`mailto:${aula.textos.soporte}`}>{aula.textos.soporte}</a> : 'escribe al equipo'}.</p>
        </Card>
      </div>
    </div>
  )
}
