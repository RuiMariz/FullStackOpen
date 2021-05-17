import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { vote } from '../reducers/anecdoteReducer'

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

const Anecdotes = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(state => state)

  return (
    <ul>
      {anecdotes.map(anecdote =>
        <Anecdote anecdote={anecdote} handleClick={() => dispatch(vote(anecdote.id))} key={anecdote.id}/>
      )}
    </ul>
  )
}

export default Anecdotes