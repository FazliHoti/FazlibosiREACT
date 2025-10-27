import React, {useState} from 'react'

function About() {
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
    <h1>About</h1>
    </>
  )
}

export default About