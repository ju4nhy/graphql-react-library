import { useState } from 'react'
import { useQuery, useApolloClient, useSubscription } from '@apollo/client'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Recommend from './components/Recommend'
import Notify from './components/Notify'
import { ALL_AUTHORS, ALL_BOOKS, ALL_USERS, BOOK_ADDED } from './queries.js'
import { bg, containerStyle, buttonStyle, buttonStyleSpecial, logoutButtonStyle } from './styles/styles.js'

export const updateCache = (cache, query, addedBook) => {
  const uniqByTitle = (a) => {
    let seen = new Set()
    return a.filter((item) => {
      let k = item.title
      return seen.has(k) ? false : seen.add(k)
    })
  }
  cache.updateQuery(query, ({ allBooks }) => {
    return {
      allBooks: uniqByTitle(allBooks.concat(addedBook)),
    }
  })
}

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const [genre, setGenre] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const client = useApolloClient()

  const users = useQuery(ALL_USERS)
  const authors = useQuery(ALL_AUTHORS)
  const booksAll = useQuery(ALL_BOOKS)

  // books filtered by genre:
  const books = useQuery(ALL_BOOKS, {
    variables: { genre },
    fetchPolicy: "network-only",
  })

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const addedBook = subscriptionData.data.bookAdded
      window.alert(`NOTICE: New book ${addedBook.title} added`)
      updateCache(client.cache, { query: ALL_BOOKS }, addedBook)
    }
  })

  const logout = () => {
    setToken(null)
    setPage('authors')
    localStorage.clear()
    client.resetStore()
  }

  if (books.loading || authors.loading)  {
    return <div>Loading...</div>
  }

  return (
    <div className="container" style={containerStyle}>
      <div style={bg}>
          <div style={{ background: '#092635', padding: 10 }}>
            <button style={buttonStyle} onClick={() => setPage('authors')}>Authors</button>
            <button style={buttonStyle} onClick={() => setPage('books')}>Books</button>
            {!token ? <button style={buttonStyleSpecial} onClick={() => setPage('login')}>Login</button>
                    : <>
                        <button style={buttonStyle} onClick={() => setPage('recommend')}>Recommend</button>
                        <button style={buttonStyle} onClick={() => setPage('add')}>Add book</button>
                        <button style={logoutButtonStyle} onClick={logout}>Logout</button>
                      </>
            }
          </div>
          {errorMessage ? <Notify errorMessage={errorMessage}/> : null } 
          <Authors show={page === 'authors'} authors={authors} token={token} setErrorMessage={setErrorMessage} />
          <Books show={page === 'books'} books={books} booksAll={booksAll} genre={genre} setGenre={setGenre} />
          <Recommend show={page === 'recommend'} booksAll={booksAll} users={users} />
          <NewBook show={page === 'add'} books={books} booksAll={booksAll} setErrorMessage={setErrorMessage} />
          <LoginForm show={page === 'login'} setToken={setToken} setPage={setPage} setErrorMessage={setErrorMessage} />
      </div>
    </div>
  )
}

export default App