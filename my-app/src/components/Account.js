import React, { useContext, useState } from 'react'
import { Usercontext } from '../globalcontext/Usercontext'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import Placespage from './Placespage';
import AccountNav from '../AccountNav';

export default function Account() {
    const {user,ready,setuser}=useContext(Usercontext);
    const [redirect,setredirect]=useState(null)
    let {subpath}=useParams();
    async function logout() {
      await axios.post('/logout');
      setredirect('/');
      setuser(null);
    }
    
    if (!subpath) {
        subpath = 'profile';
      }
      console.log(subpath);
      let content;
      if (redirect) {
        return <Navigate to={redirect} />
      }
     
     
     
    if (!ready) {
      console.log("not ready yet"); 
        return 'Loading...';
       
       
      }
    
      if (ready && !user && !redirect) {
        return <Navigate to={'/login'} />
      }
      if(subpath === 'profile'){
        content = (
          <div className="text-center max-w-lg mx-auto">
            Logged in as {user.name} ({user.email})<br />
            <button onClick={logout} className="primary max-w-sm mt-2">Logout</button>
          </div>
        );
       
      }
     
    
    
    

  return (
    <div className=''>
       <AccountNav/>
          {content}

        {subpath === 'places' && (
        <Placespage />
      )}
        
    </div>
  )
}
