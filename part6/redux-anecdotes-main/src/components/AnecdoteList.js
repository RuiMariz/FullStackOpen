import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { showNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const Anecdote = ({ anecdote, handleClick }) => {
    return (
      <li key={anecdote.id}>
        <div>
          {anecdote.content}
        </div>
        <div>
          has {anecdote.votes}
          <button onClick={handleClick}>vote</button>
        </div>
      </li>
    )
  }

  const dispatch = useDispatch()
  const vote = (anecdote) => {
    dispatch(voteAnecdote(anecdote.id))
    showNotification(`you voted '${anecdote.content}'`, dispatch)
  }

  const anecdotes = useSelector(state => state.anecdotes)
  return (
    <ul>
      {anecdotes.map(anecdote =>
        <Anecdote anecdote={anecdote} handleClick={() => vote(anecdote)} key={anecdote.id} />
      )}
    </ul>
  )
}

export default AnecdoteList