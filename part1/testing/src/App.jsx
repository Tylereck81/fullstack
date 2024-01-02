import {useState} from 'react' 

const Display = (props) =>{ 
  return( 
    <div> {props.counter}</div>
  )
}

const History = (props) =>{
  if(props.allClicks.length === 0){ 
    return(
      <div>
        press button to start
      </div>
    )
  }
  else{ 
    return(
      <div>
        button press history: {props.allClicks.join(' ')}
      </div>
    )

  }
}

const Button =(props) =>{ 
  return( 
    <button onClick={props.onClick}> 
    {props.text}
    </button>
  )
}
const App = () => {
  const [counter, setCounter] = useState(0)
  const [left, setLeft] = useState(0)
  const [right, setRight] = useState(0)
  const [allClicks, setAll] = useState ([])
  const [total, setTotal] = useState(0)

  const add = () => setCounter(counter+1)
  const subtract = () => setCounter(counter-1)
  const reset = () => setCounter(0)

  const set_left = () => { 
    setLeft(left+1)
    setAll(allClicks.concat('L'))
    setTotal(total+1)
  }
  const set_right = () =>{ 
    setRight(right+1)
    setAll(allClicks.concat('R'))
    setTotal(total+1)
  }

  return (
    <div> 
      <Display counter = {left} />
      <Display counter = {right} />
      <Button onClick={set_left} text ="LEFT" />
      <Button onClick={set_right} text ="RIGHT" />
      <History allClicks = {allClicks} />
      <Display counter = {total} />
    </div>
  )
}

export default App
