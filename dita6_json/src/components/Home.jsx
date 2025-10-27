import React, {useEffect, useState} from 'react'
import Bloglist from './Bloglist'
function Home() {
    const [list, setList] = useState([])
    const deletebutton = (id) => {
        const newlist = list.filter(list => list.id != id);
        setList(newlist);
    }

    const view = (id) => {
      const newlist2 = list.filter(list => list.id == id)
      setList(newlist2)
    }
    const [error, setError] = useState(null)
    useEffect( () => {
      fetch("http://localhost:3000/list2")
      .then((res) => 
        {return res.json()})
      .then((data) => {
        setList(data)
        console.log(data)
      })
      .catch( (err) => {
        setError(err.message)
      })
    }, [])

  return (
    <>
      <h1>Home</h1>
        <Bloglist list={list} title="User List" deletebutton={deletebutton} view={view} error={error} />
        <p>{error}</p>
    </>
  )
}

export default Home