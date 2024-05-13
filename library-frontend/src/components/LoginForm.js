import { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { LOGIN } from '../queries'

const LoginForm = ({ show, setErrorMessage, setToken, setPage }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [ login, result ] = useMutation(LOGIN, {
    onError: (error) => {
      setErrorMessage(error.graphQLErrors[0].message)
      setTimeout(() => {
        setErrorMessage(null)
      }, 3000);
    }
  })

  useEffect(() => {
    if ( result.data ) {
      const token = result.data.login.value
      setToken(token)
      localStorage.setItem('token', token)
      localStorage.setItem('username', username)
    }
  }, [result.data]) // eslint-disable-line

  const submit = async (event) => {
    event.preventDefault()
    login({ variables: { username, password } })
    setPage('authors')
  }

  if (!show) {
    return null
  }

  return (
    <div>
       <h2 style={{ marginTop: '2rem'}}>Log in</h2>
      <form onSubmit={submit}>
        <div>
          Username <br />
          <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          Password <br />
          <input
            type='password'
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type='submit' style={{ background: '#5ef7e3', marginTop: 10 }}>login</button>
      </form>
    </div>
  )
}

export default LoginForm