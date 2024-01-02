import { useState } from "react"

const Button = (props) =>{
  return (
      <button onClick={props.func}>
        {props.text}
      </button>
  )
}

const Content = (props) =>{ 
  return(
    <div>
      {props.text}
    </div>
  )
}

const Title = (props) =>{ 
  return (
    <h2>
      {props.text}
    </h2>
  )
}

let most = 0
let most_points = 0

const App = () =>{
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]

  
  const [selected,setSelected] = useState(0)
  const [points, setPoints] = useState([0,0,0,0,0,0,0,0])

  const changeAnecdote =() =>{
    const random_number = Math.floor(Math.random()*7) 
    //console.log(random_number)
    setSelected(random_number)
  }

  const voteAnecdote =() =>{
    const copy = [...points]
    copy[selected]+=1
    setPoints(copy)

    const current = copy[selected]

    if(current>most_points){
      most_points = current
      most = selected
    }
  }

  return(
    <div>
      <Title text="Anecdote of the Day"/>
      <Content text ={anecdotes[selected]} />
      has {points[selected]} votes<br></br>
      <Button func={voteAnecdote} text="vote"/>
      <Button func={changeAnecdote} text="next anecdote"/>

      <Title text="Anecdote with most votes"/>
      <Content text = {anecdotes[most]} />

    </div>
  )

}
export default App
