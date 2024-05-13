import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries.js'
import { padding, thStyle, inputStyle } from '../styles/styles.js'

const Authors = ({ show, authors, token, setErrorMessage }) => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  const [ editAuthor ] = useMutation(EDIT_AUTHOR, {
    onError: (error) => {
      setErrorMessage(error.graphQLErrors[0].message)
      setTimeout(() => {
        setErrorMessage(null)
      }, 3000);
    },
    update: (cache, response) => {
      cache.updateQuery({ query: ALL_AUTHORS }, ({ allAuthors }) => {
        return {
          allAuthors: { 
            ...allAuthors,
             __typename: response.data.editAuthor.__typename,                       
             name: response.data.editAuthor.name,                         
             born: response.data.editAuthor.born 
          }
        }
      })
    },
  })

  const addBirthYear = () => {
    editAuthor({ variables: { name, born: parseInt(born) } })
  }

  const handleNameChange = (event) => {
    event.preventDefault()
    setName(event.target.value)
  }

  if (!show) {
    return null
  }

  return (
    <div>
      <h2 style={{ marginTop: '2rem'}}>Authors</h2>
      <table>
        <tbody style={{ textAlign: 'left'}}>
          <tr>
            <th style={{ color: 'yellow' }}> NAME</th>
            <th style={thStyle}>BORN</th>
            <th style={thStyle}>BOOKS</th>
          </tr>
          {authors.data.allAuthors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td style={padding}>{a.born}</td>
              <td style={padding}>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
      {token ? 
        <>
          <h3>Set Birthyear</h3>
          Name <br />
          <select onChange={handleNameChange} defaultValue={"default"} style={{ padding: 5}}>
            <option value={"default"} disabled></option>
            {authors.data.allAuthors.map((a) => (
                <option key={a.name} value={a.name}>{a.name}</option>
            ))}
          </select>
           <br />
            Birth year
          <input
            value={born}
            onChange={({ target }) => setBorn(target.value)}
            style={inputStyle}
          />
          <button onClick={addBirthYear} style={{background: '#5ef7e3', padding: 6}}>
              Update author
          </button>
        </>
        : <></> }
      </div>
    </div>
  )
}

export default Authors