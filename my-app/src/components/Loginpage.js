import React, { useContext } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useState } from 'react';
import axios from 'axios';
import { Usercontext } from '../globalcontext/Usercontext';

export default function Loginpage() {
  const {setuser}=useContext(Usercontext);
   
    const [email,setemail]=useState();
    const [password,setpassword]=useState();
    const [redirect,setredirect]=useState(false);
    async function loginuser(ev){
        ev.preventDefault();
       try { const {data}=await axios.post('/login',{
            
            email,
            password,
        });
        setuser(data);
        alert('login succesful');
        setredirect(true);
    }catch(e){
      alert('try after sometime');
    }
    }
    if(redirect === true)return <Navigate to={'/'}/> 
      return (
        <div className='flex items-center justify-around '>
        <div className='mt-16  w-1/3 gap-4 p-4'>
           <h1 className='block text-center mb-2 p-2 font-bold text-2xl'>Login </h1>
           <form onSubmit={loginuser}>
           
           <input type="email" placeholder='email  : name@gmail.com' value={email} 
           className='block rounded-xl w-full mb-2 p-2' onChange={(ev)=> {setemail(ev.target.value)}} />
           <input type="password" placeholder='enter password' value={password}
            className='block rounded-xl w-full mb-2 p-2' onChange={(ev)=> {setpassword(ev.target.value)}} />
           <button className="bg-red-300 text-white mb-2 p-2">Login</button>
           <div>
           Not a registered user ?
           <Link to={'/register'} className='underline font-bold'>
               Register
           </Link>
           
           </div>
           </form>
           
  
        </div>
      </div>
  )
}
