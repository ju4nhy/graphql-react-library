import { padding, thStyle } from "../styles/styles"

const Books = ({ show, books, booksAll, genre, setGenre }) => {
  const defaultBookList = () => {
    let fullBookList = booksAll.data.allBooks.map((book) => (
      <tr key={book.title} >
        <td>{book.title}</td>
        <td style={padding}>{book.author.name}</td>
        <td style={padding}>{book.published}</td>
        <td style={padding}>{book.genres.toString().replace(/,/g, ', ')}</td>
      </tr>
    ))
    return fullBookList
  }

  const filteredBookList = () => {
      let filteredBookList = books.data.allBooks.map((book) => (
        <tr key={book.title} >
          <td>{book.title}</td>
          <td style={padding}>{book.author.name}</td>
          <td style={padding}>{book.published}</td>
          <td style={padding}>{book.genres.toString().replace(/,/g, ', ')}</td>
        </tr>
    )) 
    return filteredBookList
  }

  const genreButtons = () => {
    let bookGenres = booksAll.data.allBooks.map(book => book.genres.toString())
    let genreStringToArray = bookGenres.toString().split(',')
    let uniqueGenres = [...new Set(genreStringToArray)]
    let buttons = uniqueGenres.map((genre) => (
      <button key={genre} onClick={() => setGenre(genre)} style={{ background: '#5ef7e3', marginRight: 5 }}>{genre}</button>
    )) 
    return buttons
  }

  if (!show) {
    return null
  }

  return (
    <div>
    <h2 style={{ marginTop: '2rem'}}>Books</h2>
     {genre !== null ? <h4>Genre: {genre}</h4> : null}
      <table>
        <tbody style={{ textAlign: 'left'}}>
          <tr>
            <th style={{ color: 'yellow' }}>TITLE</th>
            <th style={thStyle}>AUTHOR</th>
            <th style={thStyle}>PUBLISHED</th>
            <th style={thStyle}>GENRES</th>
          </tr>
            {genre === null ? defaultBookList() : filteredBookList()}
        </tbody>
      </table>
        <h3>Filter by genre</h3>
        <button onClick={() => setGenre(null)} style={{display: 'block', background: 'yellow', marginBottom: 10}}>All genres</button>
        <div>{genreButtons()}</div>
    </div>
  )
}

export default Books