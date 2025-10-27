import React, {useState} from 'react'

function About() {
  const [name, setName] = useState("Arianit");
  const [age, setAge] = useState(21);
  const [color, setColor] = useState(false)

  return (
    <>
      <h1>About Page</h1>

      <p>Name: {name}</p>
      <button onClick={() => setName("Fazli")}> Change Name</button>
      <button onClick={() => setName("Arianit")}> Change Name</button>

      <p>Age: {age}</p>
      <button onClick={() => setAge(age + 1)}>Increment Age</button>
      <button onClick={() => setAge(age - 1)}>Decrement Age</button>
      <hr />
      <p style={{ color: "blue",fontSize:"25px"}}>This is a styled paragraph.</p>

    <p style={{color: color ?  "red" : "green", fontSize:20}}>This is a colored text.</p>
    <button onClick={() => setColor(!color)}>Change color</button>

    <p style={{color: age ? 18>  "red" : "green", fontSize:20}}>This is a colored text.</p>
    </>
  )
} 

export default About