import React from 'react';
import { useNavigate } from 'react-router-dom';

function BlogList({ list, title, deleteButton, editButton }) {
  const navigate = useNavigate();

  const handleView = (id) => {
    navigate(`/details/${id}`);
  };

  return (
    <div className="blog-list">
      <h2>{title}</h2>
      <table border={1} cellPadding={10} cellSpacing={0}>
        <thead>
          <tr>
            <th>Id</th>
            <th>Emri</th>
            <th>Kush eshte?</th>
            <th>Foto</th>
            <th>Veprimet</th>
          </tr>
        </thead>
        <tbody>
          {list.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.emri}</td>
              <td>{item.kush}</td>
              <td>
                <img src={item.image} width="100" alt={`Foto e ${item.emri}`} />
              </td>
              <td>
                <button onClick={() => editButton(item.id)}>Edit</button>
                <button onClick={() => viewButton(item.id)}>View</button>
                <button onClick={() => deleteButton(item.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BlogList;