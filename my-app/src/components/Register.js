import React from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios';

export default function Register() {
    const [name,setname]=useState();
const [email,setemail]=useState();
const [password,setpassword]=useState();
async function registeruser(ev){
  ev.preventDefault();
    try {  await axios.post('/register',{
        name,
        email,
        password,
    });
    alert('registration succesful');
}catch(e){
    if (e.response && e.response.status === 422)
    alert('email already exists');
else alert('unnoticable error, try after some time');
}
}
  return (
    <div className='flex items-center justify-around '>
      <div className='mt-16  w-1/3 gap-4 p-4'>
         <h1 className='block text-center mb-2 p-2 font-bold text-2xl'>Register </h1>
         <form onSubmit={registeruser}>
         <input type="text" placeholder='Name :  teja' value={name} className='block rounded-xl w-full mb-2 p-2'
          onChange={(ev)=> {setname(ev.target.value)}}  />
         <input type="email" placeholder='email  : name@gmail.com' value={email} 
         className='block rounded-xl w-full mb-2 p-2' onChange={(ev)=> {setemail(ev.target.value)}} />
         <input type="password" placeholder='enter password' value={password}
          className='block rounded-xl w-full mb-2 p-2' onChange={(ev)=> {setpassword(ev.target.value)}} />
         <button className="bg-red-300 text-white mb-2 p-2">Register</button>
         <div>
         Already a user?
         <Link to={'/login'} className='underline font-bold'>
             Login
         </Link>
         
         </div>
         </form>
         

      </div>
    </div>
  )
}
