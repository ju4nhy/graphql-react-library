import { padding, thStyle } from '../styles/styles';

const Recommend = ({ show, booksAll, users }) => {
  let userLoggedIn = localStorage.getItem('username')
  let userData = null
  let favBookList = null

  if (userLoggedIn !== null) {
    userData = users.data.allUsers.find((user) => user.username === userLoggedIn)
    favBookList = booksAll.data.allBooks.filter(book => book.genres.includes(userData.favoriteGenre))
  } 
  
  const RecommendedBooks = () => {
    let favBooks = favBookList.map((book) => (
      <tr key={book.title} >
        <td>{book.title}</td>
        <td style={padding}>{book.author.name}</td>
        <td style={padding}>{book.published}</td>
        <td style={padding}>{book.genres.toString().replace(/,/g, ', ')}</td>
      </tr>
    )) 
    return favBooks
 }

if (!show || userLoggedIn === null) {
  return null
}

return (
  <div>
     <h2 style={{ marginTop: '2rem'}}>Recommendations</h2>
    <p>Books in your favorite genre: <b>{userData.favoriteGenre}</b></p>
    <table>
      <tbody style={{ textAlign: 'left'}}>
        <tr>
          <th style={{ color: 'yellow'}}>TITLE</th>
          <th style={thStyle}>AUTHOR</th>
          <th style={thStyle}>PUBLISHED</th>
          <th style={thStyle}>GENRES</th>
        </tr>
        {RecommendedBooks()}
      </tbody>
    </table>
  </div>
  )
}

export default Recommend