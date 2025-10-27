import React from 'react'

function Home() {

  const fun = () => {
    console.log("Home Page");
  }

  const fun2 = (para) => {
    console.log("Hello" + para)
  }
  return (
    <>
    <button onClick={fun}>Click Me</button>
    <button onClick={() => fun2("Arianit")}>Click Me 2</button>
    </>
  )
}

export default Home