const Header = (props) =>{ 
    return(
      <h2>{props.course}</h2>
    )
  }
  
const Part = (props) =>{ 
    return(
    <p>{props.p} {props.e}</p>
    )
  }
  
const Content = ({parts}) =>{   
    return(
      <div>
        {parts.map(part=>
          <Part key = {part.id} p = {part.name} e = {part.exercises} />
        )}
      </div>
    )
}
  
const Total = ({parts}) =>{ 
   let initial = 0
   let Total = parts.reduce((a,b) =>
      a+b.exercises,
      initial
   )

  return(
    <div>
      <b>total of {Total} exercises </b>
    </div>
  )
}

const Course = ({course}) =>{ 
  return(
      <div>
        <Header course={course.name} />
        <Content parts={course.parts} />
        <Total parts={course.parts} />
      </div>
  )
}

export default Course