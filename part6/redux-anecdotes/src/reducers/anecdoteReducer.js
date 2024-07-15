/* eslint-disable no-case-declarations */
import { createSlice } from "@reduxjs/toolkit"
import anecdoteService from '../services/anecdote'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    voteAnecdote(state, action) {
      const id = action.payload.id 
      const updatedAnecdote = action.payload 

      return state.map(anecdote => 
        anecdote.id !== id ? anecdote : updatedAnecdote
      )
    },
    appendAnecdote(state, action){ 
      state.push(action.payload)
    }, 
    setAnecdote(state,action){ 
      return action.payload
    }
  }
})

export const { voteAnecdote, appendAnecdote, setAnecdote } = anecdoteSlice.actions

export const initializeAncedotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdote(anecdotes))
  }
}

export const addAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const addVote = id => {
  return async dispatch => {
    const newVote = await anecdoteService.updateVote(id)
    dispatch(voteAnecdote(newVote))
  }
}

export default anecdoteSlice.reducer 