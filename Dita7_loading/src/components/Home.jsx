import React, {useEffect, useState} from 'react'
import Bloglist from './Bloglist'
function Home() {
    const [list, setList] = useState([])
    const deletebutton = (id) => {
        const newlist = list.filter(list => list.id != id);
        setList(newlist);
    }
    const [error, setError] = useState(null)    
    const [loading, setLoading] = useState(true);
    useEffect( () => {
      fetch("http://localhost:3000/list")
      .then((res) => 
        {return res.json()})
      .then((data) => {
        setList(data)
        console.log(data)
      })
      .catch( (err) => {
         setError(err.message)
         setLoading(false);
      })
    }, [])

      

  return (
    <>
      <h1>Home</h1>
        { list && <Bloglist list={list} title="User List" deletebutton={deletebutton}  error={error} />}
        { loading && <p>Loading...</p>}
        { error && <p>{error}</p>}
    </>
  )
}

export default Home