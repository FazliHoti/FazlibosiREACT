import React from 'react'

function Bloglist(props) {
    const list = props.list;
    const title = props.title;
    const deletebutton = props.deletebutton;
    const view = props.view
  return (
    <>
    <h1>{title}</h1>
    {list.map( (item) =>(
        <div key={item.id}>
            <h2>{ item.name }</h2>
            <p>{ item.age }</p>
            <p>{ item.city }</p>
            <button onClick={() => deletebutton(item.id)}>Delete</button>
            <button onClick={() => view(item.id)}>View</button>
            <hr />
        </div>
    ))}
    
    </>
  )
}

export default Bloglist