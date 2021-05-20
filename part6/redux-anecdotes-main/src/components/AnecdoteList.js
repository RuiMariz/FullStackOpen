import React from 'react'
import { connect } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { createNotification } from '../reducers/notificationReducer'

const AnecdoteList = (props) => {
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

  const vote = (anecdote) => {
    props.voteAnecdote(anecdote)
    props.createNotification(`you voted '${anecdote.content}'`, 10)
  }

  const filter = props.filter
  const anecdotes = props.anecdotes
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

const mapStateToProps = ({ anecdotes, filter }) => {
  return {
    anecdotes,
    filter,
  }
}

const mapDispatchToProps = {
  createNotification,
  voteAnecdote
}

export default connect(mapStateToProps, mapDispatchToProps)(AnecdoteList);