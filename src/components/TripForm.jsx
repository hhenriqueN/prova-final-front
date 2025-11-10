import React, { useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { fetchWithToken } from '../api'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export default function TripForm() {
  const { getAccessTokenSilently } = useAuth0()
  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')
  const [description, setDescription] = useState('')
  const [transportMode, setTransportMode] = useState('carro')
  const [msg, setMsg] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      await fetchWithToken(getAccessTokenSilently, `${API}/api/trips`, {
        method: 'POST',
        body: JSON.stringify({ origin, destination, description, transportMode })
      })
      setMsg('Viagem criada com sucesso!')
      // limpa
      setOrigin(''); setDestination(''); setDescription('');
      // opcional: evento para recarregar lista (emitir por custom event)
      window.dispatchEvent(new Event('trips:changed'))
    } catch (err) {
      setMsg('Erro: ' + err.message)
    }
  }

  return (
    <div>
      <h2>Cadastrar Viagem</h2>
      <form onSubmit={handleSubmit}>
        <div><input placeholder="Origem" value={origin} onChange={e => setOrigin(e.target.value)} required /></div>
        <div><input placeholder="Destino" value={destination} onChange={e => setDestination(e.target.value)} required /></div>
        <div><textarea placeholder="Descrição" value={description} onChange={e => setDescription(e.target.value)} /></div>
        <div>
          <label>Transporte:</label>
          <select value={transportMode} onChange={e => setTransportMode(e.target.value)}>
            <option value="carro">Carro</option>
            <option value="avião">Avião</option>
            <option value="trem">Trem</option>
            <option value="ônibus">Ônibus</option>
          </select>
        </div>
        <button type="submit">Cadastrar</button>
      </form>
      {msg && <p>{msg}</p>}
    </div>
  )
}
