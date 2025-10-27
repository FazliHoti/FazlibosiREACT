import React from 'react'
import { useState } from 'react'

function Home() {

  const [vlera, setVlera] = useState(0);
  const [name, setName] = useState("Arianit");
  const [arr, setArr] = useState([1,2,3,4,5]);
  const obj = {
    name: "Fazli",
    age: "14",
    City: "Rahovec"
  };
  const [allName , setAllname] =useState([
    {id:1, name: "Arianit", age: "31", city: "Prizren"},
    {id:2, name: "Ardian", age: "25", city: "Prizren"},
    {id:3, name: "Arber", age: "20", city: "Prizren"},
    {id:4, name: "Ardian", age: "33", city: "Prizren"}, 
    {id:5, name: "Albatris", age: "12", city: "Prizren"},
    {id:6, name: "Ardonit", age: "17", city: "Prizren"}, 
  ])
  return (
    <>
    <h1>Home</h1>
    <h2>{vlera}</h2>
    <p>{ name }</p>
    <p>{ arr }</p>
    <p>{ obj.name } - { obj.age } - { obj.City }</p>
    {allName.map ((item) => (
      <div key={item.id}>
        <h2>{item.name}</h2>
        <p>{item.age}</p>
        <p>{item.city}</p>
        <hr />
      </div>
    ) )}
    </>
  )
}

export default Home