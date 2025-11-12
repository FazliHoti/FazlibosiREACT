import React from 'react'
import './Navbar.css'

function Navbar() {
  return (
    <>


        <nav>
            <ul>
                <li id='li1'>Logo</li>
                <li><a href="/">Home</a></li>
                <li><a href="/about">About</a></li>
                <li><a href="/contact">Contact</a></li>
                <li><a href="/product">Product</a></li>
            </ul>
        </nav>
    
    </>
  )
}

export default Navbar