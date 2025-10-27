import React,{useState} from "react";

function About() {

    const [vlera, setVlera] = useState(0);

    return (
        <>
        <h1>Welcome to Dita 2</h1>
        <p>Current value: (vlera)</p>
        <button onClick={() => setVlera(vlera + 1)}>Increase value </button>
        </>
    )
}

export default About