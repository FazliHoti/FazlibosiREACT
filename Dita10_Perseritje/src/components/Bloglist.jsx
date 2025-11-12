import React from 'react'

function BlogList(props) {

    const list = props.list
    const title = props.title
    const deleteButton = props.deleteButton
    const viewButton = props.viewButton
  return (
    <>
    <div className="blog-list">
        <h2>{ title }</h2>
        <table border={1} cellPadding={10} cellSpacing={0}>
          <thead>
            <tr>
                <th>Id</th>
                <th>Emri</th>
                <th>Mosha</th>
                <th>Veprimet</th>
                <th>Foto</th>
            </tr>   
          </thead>
          <tbody>
        { list.map( (item) => (
            <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.emri}</td>
                <td>{item.mosha}</td>
                <td>
                    <button onClick={() => deletebutton(item.id)}>Delete</button>
                    <button onClick={() => props.editButton(item.id)}>Edit</button>
                    <button onClick={() => props.viewButton(item.id)}>View</button>
                </td>
                <td><img src={item.image} width="100" alt={`Foto e ${item.emri}`} /></td>
            </tr>
        ))
        }
        </tbody>
        </table>
    </div>
    </>
  )
}

export default BlogList