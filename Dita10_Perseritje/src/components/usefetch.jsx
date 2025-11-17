import React, {useState , useEffect} from 'react'

function usefetch(url) {
    const [list, setList] = useState([])
    const [error, setError] = useState(null)    
    const [loading, setLoading] = useState(true);

        useEffect( () => {
        setTimeout( () => {
          fetch(url)
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
        }, 1000)
        }, [])
        const deleteButton = (id) => {
    const newlist = list.filter(item => item.id != id);
    setList(newlist); 
  };
      const viewButton = (id) => {
    const newlist2 = list.filter(item => item.id != id);
    setList(newlist2)
  };
 return {
      list,
      error,
      loading,
      deleteButton,
      viewButton,
  }
}

export default usefetch