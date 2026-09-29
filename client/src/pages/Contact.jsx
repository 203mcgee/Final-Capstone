
import React, { useState } from 'react'


// https://github.com/AkajithAk/ReactUi/blob/main/src/Components/EmailValidation/EmailValidation.js


const Contact = () => {
    const [userName, setUserName] = useState('');
    const [userEmail, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error,setError] = useState(false);

    
    // /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/ 
    function validateEmail(email) {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if(!email.match(regex)){
            setError(true);
        }
        else{
            setError(false);
        }
        return regex.test(email);
    }

    function handleUserName(e) {
        // console.log(e.target.value)
        const value = e.target.value
        if(value === '')
        {
            return;
        }
        setUserName(value);
    }

    function handleEmail(e) {
        const value = e.target.value;
        const validEmail = validateEmail(value);
        // console.log(validEmail);
        setEmail(value);
        
    }

    function handleMessage(e) {
        const value = e.target.value
        if(value === ''){
            return;
        }
        setMessage(value);
    }

    function handleSubmit(e){
        e.preventDefault();
        const data = {userName,userEmail,message};
        console.log(data);
        setUserName('');
        setEmail('');
        setMessage('');
    }



    return (
        <>
            <h1 className='text-center text-3xl py-4'>Contact Me</h1>
            <section className='p-4 items-center justify-center content-center'>
                <form action="" className="flex flex-col max-w-[600px] w-full border py-6 px-3 rounded-lg gap m-auto" 
                onSubmit={handleSubmit}>
                    <label className='flex flex-col gap-2'>
                        Full Name
                        <input
                            type="text"
                            name="fullName"
                            id="fullName"
                            className='border px-3 py-1'
                            value={userName}
                            onChange={handleUserName}
                            required
                        />
                        <span className=""></span>
                        
                    </label>


                    <label className='flex flex-col gap-2'>
                        Email
                        <input
                            type="email"
                            name="email"
                            id="email"
                            value={userEmail}
                            onChange={handleEmail}
                            required
                            className='border px-3 py-1' />
                        {error?<p style={{color:"red"}}>Enter valid Email</p>:''}
                    </label>



                    <label className='flex flex-col gap-2'>
                        Message
                        <textarea
                            name=""
                            id=""
                            onChange={handleMessage}
                            value={message}
                            required
                            className='border px-3 py-1'></textarea>
                        <span className=""></span>
                    </label>
                    <button type='' className='bg-blue-500 text-white inline-block py-2 rounded-lg' >Submit</button>
                </form>

            </section>
        </>
    )
}

export default Contact