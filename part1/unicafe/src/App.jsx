import { useState } from 'react'

const Title = (props) =>{ 
  return(
    <h1>{props.title}</h1>
  )
}

const Button = (props) =>{ 
  return(
    <button onClick = {props.onClick}>
      {props.button_text}
    </button>
  )
}

const StatisticLine = (props) =>{ 
  return(
    <tr>
      <td>{props.text}</td>
      <td>{props.value}</td>
    </tr>
  )
}

const Statistics = (props) =>{ 
  if (props.total === 0){ 
    return( 
      <p>No feedback given</p>
    )
  }
  else{ 
    return( 
      <div>
        <table>
          <tbody>
            <StatisticLine text="good" value={props.good} />
            <StatisticLine text="neutral" value={props.neutral} />
            <StatisticLine text="bad" value={props.bad} />
            <StatisticLine text="total" value={props.total} />
            <StatisticLine text="average" value={props.average} />
            <StatisticLine text="positive" value={props.positive + " %"} />
          </tbody>
        </table>
      </div>
    )
  }
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [total, setTotal] = useState(0)
  const [average, setAverage] = useState(0)
  const [positive, setPositive] = useState(0)


  const addGood = () => { 
    setGood(good+1)
    setTotal(total+1)

    const curr_good = good+1
    const curr_total = total+1
    const curr_average = (curr_good-bad)/curr_total
    setAverage(curr_average)

    const curr_positive = curr_good/curr_total*100
    setPositive(curr_positive)
  }
  const addNeutral = () => {
    setNeutral(neutral+1)
    setTotal(total+1)
    const curr_total = total+1

    const curr_average = (good-bad)/curr_total
    setAverage(curr_average)

    const curr_positive = good/curr_total*100
    setPositive(curr_positive)

  }
  const addBad = () => { 
    setBad(bad+1)
    setTotal(total+1)
    
    const curr_bad = bad+1
    const curr_total = total+1
    const curr_average = (good-curr_bad)/curr_total
    setAverage(curr_average)

    const curr_positive = good/curr_total *100
    setPositive(curr_positive)
  }

  return (
    <div>
      <Title title="give feedback" />
      <Button onClick= {addGood} button_text = "good" />
      <Button onClick= {addNeutral} button_text = "neutral" />
      <Button onClick= {addBad} button_text = "bad" />
      <Title title="statistics" />
      <Statistics good = {good} neutral = {neutral} bad = {bad} average ={average} positive={positive} total={total}/>
    </div>
  )
}

export default App