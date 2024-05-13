import { notifyStyle } from "../styles/styles"

const Notify = ({ errorMessage }) => {
  return (
    <div style={notifyStyle}>
      <h4>{errorMessage}</h4>
    </div>
  )
}

export default Notify