import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { updateCache } from '../App'
import { CREATE_BOOK, ALL_BOOKS, ALL_AUTHORS } from '../queries.js'

const NewBook = ({ show, setErrorMessage }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genres, setGenres] = useState([])
  const [genre, setGenre] = useState('')

  const [ createBook ] = useMutation(CREATE_BOOK, {
    onError: (error) => {
      setErrorMessage(error.toString())
      setTimeout(() => {
        setErrorMessage(null)
      }, 3000);
    },
    update: (cache, response) => {
      updateCache(cache, { query: ALL_BOOKS }, response.data.addBook)
      cache.updateQuery({ query: ALL_AUTHORS }, ({ allAuthors }) => {
        return {
          allAuthors: { 
            ...allAuthors, 
            __typename: response.data.addBook.__typename,
            name: response.data.addBook.name, 
            born: response.data.addBook.born,
            bookCount: response.data.addBook.bookCount  
          }
        }
      })
    },
  })

  const submit = async (event) => {
    event.preventDefault()
    createBook({ variables: { 
        title, 
        author,
        published: parseInt(published), 
        genres 
      } 
    })
    setTitle('')
    setPublished('')
    setAuthor('')
    setGenre('')
    setGenres([])
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  if (!show) {
    return null
  }

  return (
    <div>
       <h2 style={{ marginTop: '2rem'}}>Add book</h2>
      <form onSubmit={submit}>
        <div>
          Title 
          <br />
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          Author 
          <br />
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          Published 
          <br />
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        Genres 
        <br />
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button" style={{background: '#5ef7e3'}}>
            Add genre
          </button>
        </div>
        <h4>List of selected genres: {genres.join(', ')}</h4>
        <button type="submit" style={{background: '#5ef7e3', padding: 6}}>Add book</button>
      </form>
    </div>
  )
}

export default NewBook