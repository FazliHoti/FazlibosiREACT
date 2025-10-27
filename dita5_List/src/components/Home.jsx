import React, {useState} from 'react'
import Bloglist from './Bloglist'
function Home() {
    const [list, setList] = useState([{id: 1, name: 'Fazli', age: 20, city: 'Tirana'}, {id: 2, name: 'Lis', age: 21, city: 'Shkodra'}, {id: 3, name: 'Albatris', age: 22, city: 'Durres'}])
    const deletebutton = (id) => {
        const newlist = list.filter(list => list.id != id);
        setList(newlist);
    }

    const view = (id) => {
      const newlist2 = list.filter(list => list.id == id)
      setList(newlist2)
    }
  return (
    <>
      <h1>Home</h1>
      {/* {list.map( (item) =>(
        <div key={item.id}>
            <h2>{ item.name }</h2>
            <p>{ item.age }</p>
            <p>{ item.city }</p>
            <hr />
        </div>
    ))} */}
        <Bloglist list={list} title="User List" deletebutton={deletebutton} view={view} />
    </>
  )
}

export default Home