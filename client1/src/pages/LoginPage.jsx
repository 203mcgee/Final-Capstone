import React from 'react'


// https://www.youtube.com/watch?v=8QgQKRcAUvM
const LoginPage = () => {

    


  return (
    <>
    <div>LoginPage</div>
    <div className='container'>
        <div className='header'>
            <div className='text'>Sign In</div>
        </div>
        <div className='inputs'>
            <div className='input'>
                <input type='text'/>
            </div>
            <div className='input'>
                <input type='email'/>
            </div>
            <div className='input'>
                <input type='password'/>
            </div>
        </div>
        <div className='submit-container'>
        <div className='forgot-password'>Forgot Password? <span>Click Here</span></div>
            <div className='submit'>
                Login
            </div>
        </div>
    </div>


    </>
  )
}

export default LoginPage