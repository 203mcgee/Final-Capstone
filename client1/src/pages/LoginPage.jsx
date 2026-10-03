import React from 'react'

const LoginPage = () => {

    let [like,setLike] = useState([]);
    let [hasLiked,setHasLiked] = useState([])


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
            <div className='submit'>
                Login
            </div>
        </div>
    </div>


    </>
  )
}

export default LoginPage