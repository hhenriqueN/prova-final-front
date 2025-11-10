import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import TripList from './components/TripList'
import TripForm from './components/TripForm'

export default function App() {
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0()

  return (
    <div style={{ padding: 24, fontFamily: 'Arial, sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Prova - Viagens</h1>
        <div>
          {isAuthenticated ? (
            <>
              <span style={{ marginRight: 8 }}>Olá, {user && (user.name || user.email)}</span>
              <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>Logout</button>
            </>
          ) : (
            <button onClick={() => loginWithRedirect()}>Login</button>
          )}
        </div>
      </header>

      <main style={{ marginTop: 20 }}>
        {isAuthenticated ? (
          <>
            <TripForm />
            <hr />
            <TripList />
          </>
        ) : (
          <p>Faça login para ver e cadastrar viagens.</p>
        )}
      </main>
    </div>
  )
}
