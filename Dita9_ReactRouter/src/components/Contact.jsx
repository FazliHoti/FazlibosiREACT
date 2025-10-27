import React from 'react'

function Contact() {
  return (
    <>
    <h1>Contact</h1>
    
    <form action="/submit-form" method="POST">
  <h2>Contact Us</h2>

  <label htmlFor="name">Name:</label><br />
  <input type="text" id="name" name="name" required /><br /><br />

  <label htmlFor="email">Email:</label><br />
  <input type="email" id="email" name="email" required /><br /><br />

  <label htmlFor="subject">Subject:</label><br />
  <input type="text" id="subject" name="subject" /><br /><br />

  <label htmlFor="message">Message:</label><br />
  <textarea id="message" name="message" rows="5" required></textarea><br /><br />

  <button type="submit">Send Message</button>
</form>
  </>
  )
}

export default Contact