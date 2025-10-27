import React from "react";
import Button from "./Button";

function Home() {
    const x = 5;
    console.log("value of x is", x);
    const name ="Fazli";
    const arr = [1, 2, 3];
    const obj ={
        name: "Fazli",
        age: "14",
        city: "Ratkoc",
        country: "Kosova",
    }
    return (
        <>
        <h1>Welcome to Dita 2</h1>
        <p>{ x }</p>
        <p>Hello, { name } </p>
        <p>Array: { arr }</p>
        <p>{obj.name}, {obj.age}, {obj.city}</p>
        <Button/>
        </>

    )
}

export default Home