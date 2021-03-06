import React, { useState } from 'react'

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
  ]

  const [selected, setSelected] = useState(0)
  const [allVotes, setAllVotes] = useState(new Array(6).fill(0))
  const header1 = "Anecdote of the day"
  const header2 = "Anecdote with the most votes"

  const handleAnecdoteClick = () => setSelected(Math.floor(Math.random() * 6))
  const handleVoteClick = () => {
    const copy = [...allVotes]
    copy[selected]++;
    setAllVotes(copy)
  }

  return (
    <div>
      <Header header={header1} />
      <p>{anecdotes[selected]}</p>
      <p>has {allVotes[selected]} votes</p>
      <button onClick={handleVoteClick}>
        vote
      </button>
      <button onClick={handleAnecdoteClick}>
        next anecdote
      </button>
      <Header header={header2} />
      <p>{anecdotes[allVotes.indexOf(Math.max(...allVotes))]}</p>
      <p>has {Math.max(...allVotes)} votes</p>
    </div>
  )
}

const Header = ({ header }) => {
  return (
    <div>
      <h1>{header}</h1>
    </div>
  )
}

export default App
