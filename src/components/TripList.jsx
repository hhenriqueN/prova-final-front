import React, { useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { fetchWithToken, isAdmin } from '../api'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export default function TripList() {
  const { getAccessTokenSilently } = useAuth0()
  const [trips, setTrips] = useState([])
  const [admin, setAdmin] = useState(false)
  const [error, setError] = useState(null)

  async function load() {
    try {
      const data = await fetchWithToken(getAccessTokenSilently, `${API}/api/trips`, { method: 'GET' })
      setTrips(data)
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    load()
    // recarregar após criação
    function handler() { load() }
    window.addEventListener('trips:changed', handler)
    return () => window.removeEventListener('trips:changed', handler)
  }, [])

  useEffect(() => {
    (async () => {
      setAdmin(await isAdmin(getAccessTokenSilently))
    })()
  }, [getAccessTokenSilently])

  async function handleDelete(id) {
    if (!confirm('Confirma excluir?')) return
    try {
      await fetchWithToken(getAccessTokenSilently, `${API}/api/trips/${id}`, { method: 'DELETE' })
      setTrips(prev => prev.filter(t => t.id !== id))
    } catch (err) {
      setError(err.message)
    }
  }

  if (error) return <p>Erro: {error}</p>

  return (
    <div>
      <h2>Viagens cadastradas</h2>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th><th>Origem</th><th>Destino</th><th>Descrição</th><th>Transporte</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {trips.map(t => (
            <tr key={t.id}>
              <td>{t.id}</td>
              <td>{t.origin}</td>
              <td>{t.destination}</td>
              <td>{t.description}</td>
              <td>{t.transportMode}</td>
              <td>
                {admin ? <button onClick={() => handleDelete(t.id)}>Excluir</button> : <span>-</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
