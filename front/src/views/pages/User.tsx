import { IconDeviceFloppy } from '@tabler/icons'
import React, { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTitle } from '../../hooks/useTitle'
import { postUser } from '../../services/user'

export function User(): JSX.Element {
  useTitle('Create user')
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    return postUser(username, password).then(() => {
      navigate('/users')
    })
  }

  return (
    <form onSubmit={onSubmit}>
      <label>
        Username *
        <input value={username} onChange={(e) => setUsername(e.target.value)} required />
      </label>

      <label>
        Password *
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </label>

      <button data-variant="primary" aria-busy={loading}>
        {!loading && <IconDeviceFloppy />} Save
      </button>
    </form>
  )
}
