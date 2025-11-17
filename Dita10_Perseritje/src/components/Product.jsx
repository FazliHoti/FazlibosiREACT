import React, { useEffect, useState } from 'react';
import Bloglist from './Bloglist';
import usefetch from './usefetch';

function Product() {
  const { list: fetchedList, error, loading, deleteButton, viewButton } = usefetch('http://localhost:3000/list');
  const [list, setList] = useState([]);

  useEffect(() => {
    if (fetchedList) {
      setList(fetchedList);
    }
  }, [fetchedList]);


  return (
    <>
      <h1>Home</h1>
      {list && <Bloglist list={list} title="User List" deleteButton={deleteButton} error={error} />}
      {list && <Bloglist list={list} title="User List" viewButton={viewButton} error={error} />}
      {loading && (
        <svg width="50" height="50" xmlns="http://www.w3.org/2000/svg">
          <circle
            cx="25"
            cy="25"
            r="10"
            stroke="white"
            strokeWidth="4"
            fill="none"
            strokeDasharray="50 15"
            strokeDashoffset="0"
          />
        </svg>
      )}
      {error && <p>{error}</p>}
    </>
  );
}

export default Product;
