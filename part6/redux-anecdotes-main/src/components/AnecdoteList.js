import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { createNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const Anecdote = ({ anecdote, handleClick }) => {
    return (
      <li>
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
    dispatch(voteAnecdote(anecdote))
    dispatch(createNotification(`you voted '${anecdote.content}'`, 10))
  }

  const filter = useSelector(state => state.filter)
  const anecdotes = useSelector(state => state.anecdotes)
  let filteredAnecdotes
  if (filter) {
    filteredAnecdotes = anecdotes.filter((anecdote) => {
      return anecdote.content.toLowerCase().includes(filter.toLowerCase())
    })
  } else {
    filteredAnecdotes = anecdotes
  }

  return (
    <ul>
      {filteredAnecdotes.map(anecdote =>
        <Anecdote anecdote={anecdote} handleClick={() => vote(anecdote)} key={anecdote.id} />
      )}
    </ul>
  )
}

export default AnecdoteList