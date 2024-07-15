/* eslint-disable react/prop-types */
import { addAnecdote } from '../reducers/anecdoteReducer'
import { useDispatch } from 'react-redux'
import { showNotification } from '../reducers/notificationReducer'

const AnecdoteForm = () => {
    const dispatch = useDispatch()
    
    const createAnecdote = async (event) => {
      event.preventDefault()
      const content = event.target.newAnecdote.value
      event.target.newAnecdote.value = ''
      dispatch(addAnecdote(content))
      dispatch(showNotification(`You added "${content}"!`,5)) 
    }

    return (
      <div>
        <h2>create new</h2>
        <form onSubmit={createAnecdote}>
          <div><input name='newAnecdote'/></div>
          <button type='submit'>create</button>
        </form>
      </div>
    )
}
  
export default AnecdoteForm