import React from 'react'
import { Link } from 'react-router-dom'

export const Access = () => {
  return (
    <>
        <div>Access</div>
        <h1>Do you want to login or register?</h1>
        <nav>
            <Link to="/login">login</Link>
            <Link to="/register">Register</Link>
        </nav>
    </>
  )
}
