import { useQueryClient, useMutation } from '@tanstack/react-query'
import { createAnecdote } from '../request'
import { useNotificationDispatch } from '../notificationContext'

const AnecdoteForm = () => {
  const queryClient = useQueryClient()
  const dispatch = useNotificationDispatch()

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote, 
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['anecdotes']})
    }
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value 
    console.log(content)
    if (content.length >=5){ 
      newAnecdoteMutation.mutate({content, votes:0})
      event.target.anecdote.value = ''
      dispatch({ type: 'SHOWNOTIFICATION', payload: `You added: ${content}!`  })
      setTimeout(() => {
        dispatch({ type: 'HIDENOTIFICATION' })
      }, 5000)
    }
    else{ 
      dispatch({ type: 'SHOWNOTIFICATION', payload: `too short anecdote, must have length 5 or more` })
      setTimeout(() => {
        dispatch({ type: 'HIDENOTIFICATION' })
      }, 5000)
    }
   
}

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
