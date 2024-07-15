import { useSelector, useDispatch } from 'react-redux'
import { addVote } from '../reducers/anecdoteReducer'
import { showNotification } from "../reducers/notificationReducer"

const AnecdoteList = () => {
  
  const dispatch = useDispatch()

  const anecdotes = useSelector(state => [...state.anecdotes].sort((a, b) => b.votes - a.votes))

  const filter = useSelector(state => state.filter)

  const filteredAnecdotes = anecdotes
  .filter(anecdote =>anecdote.content.toLowerCase().includes(filter.toLowerCase()))
  .sort((a, b) => b.votes - a.votes)
  
  const vote = (id, content) => {
    dispatch(addVote(id))
    dispatch(showNotification(`You voted for "${content}" !`,5))
  }

  return (
    <div>
      {filteredAnecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id, anecdote.content)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnecdoteList
