import React from 'react'

function About() {

  const fun = () => {
    console.log("Hello");
  }
  
  const fun2 = (name) => {
    console.log("Hello" + "React");
  }

  return (
    <>
    <h1>About page</h1>
    <button onClick={fun}>click</button>
    <hr />
    <button onClick={() => fun2("React")}>click</button>
    </>
  )
}

export default About