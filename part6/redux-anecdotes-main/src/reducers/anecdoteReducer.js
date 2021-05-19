
const anecdoteReducer = (state = [], action) => {
  switch (action.type) {
    case ('VOTE'):
      return (state.map(anecdote => anecdote.id === action.data.id ? { ...anecdote, votes: anecdote.votes + 1 } : anecdote))
        .sort((a, b) => a.votes > b.votes ? -1 : 1)
    case ('NEW_ANECDOTE'):
      return [...state, action.data]
    case ('INIT_ANECDOTES'):
      return action.data


    default: return state
  }
}

export const initializeAnecdotes = (anecdotes) => {
  return {
    type: 'INIT_ANECDOTES',
    data: anecdotes,
  }
}

export const voteAnecdote = (id) => {
  return {
    type: 'VOTE',
    data: { id }
  }
}

export const createAnecdote = (anecdote) => {
  return {
    type: 'NEW_ANECDOTE',
    data: anecdote
  }
}

export default anecdoteReducer