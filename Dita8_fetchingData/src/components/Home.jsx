import React, {useEffect, useState} from 'react'
import Bloglist from './Bloglist'
import usefetch from './usefetch'

function Home() {
  const {
    list,
    error,
    loading
  } = usefetch('http://localhost:3000/list');

  const deletebutton = (id) => {
  const newlist = list.filter(list => list.id != id);
  setList(newlist);}
  return (
    <>
      <h1>Home</h1>
        { list && <Bloglist list={list} title="User List" deletebutton={deletebutton}  error={error} />}

        { loading && <svg width="50" height="50" xmlns="http://www.w3.org/2000/svg">
    <circle
      cx="25"
      cy="25"
      r="10"
      stroke="white"
      stroke-width="4"
      fill="none"
      stroke-dasharray="50 15"
      stroke-dashoffset="0"
    />
  </svg>}

        { error && <p>{error}</p>}
    </>
  )
}

export default Home