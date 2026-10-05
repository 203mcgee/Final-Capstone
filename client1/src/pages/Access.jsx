import React from 'react'
import { Link } from 'react-router-dom'

export const Access = () => {
    return (
        <>
        <div className='grid'>
            <div className='flex-center justify-center items-center'>
                <div className='col-start-1 row-start-1  text-black text-4xl'>Access</div>
                <h1>Do you want to login or register?</h1>
                <nav>
                    <Link to="/login" className='col-start-1 row-start-1 p-3'>Login</Link>
                    <Link to="/register" className='col-start-1 row-start-1'>Register</Link>
                </nav>

            </div>

        </div>
        </>
    )
}
