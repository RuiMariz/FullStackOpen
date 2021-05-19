import anecdoteService from '../services/anecdotes'

const anecdoteReducer = (state = [], action) => {
  switch (action.type) {
    case ('VOTE'):
      return (state.map(anecdote => anecdote.id === action.data.id ? action.data : anecdote))
        .sort((a, b) => a.votes > b.votes ? -1 : 1)
    case ('NEW_ANECDOTE'):
      return [...state, action.data]
    case ('INIT_ANECDOTES'):
      return action.data.sort((a, b) => a.votes > b.votes ? -1 : 1)


    default: return state
  }
}

export const initializeAnecdotes = (anecdotes) => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch({
      type: 'INIT_ANECDOTES',
      data: anecdotes,
    })
  }
}

export const voteAnecdote = (anecdote) => {
  return async dispatch => {
    anecdote.votes++
    const updatedAnecdote = await anecdoteService.update(anecdote)
    dispatch({
      type: 'VOTE',
      data: updatedAnecdote,
    })
  }
}

export const createAnecdote = (anecdote) => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(anecdote)
    dispatch({
      type: 'NEW_ANECDOTE',
      data: newAnecdote,
    })
  }
}

export default anecdoteReducer