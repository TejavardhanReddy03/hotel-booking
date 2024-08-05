import React, { useContext, useState } from 'react'
import { Usercontext } from '../globalcontext/Usercontext'
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import Placespage from './Placespage';

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
     
      function linkClasses (type=null) {
        let classes = 'inline-flex gap-1 py-2 px-6 rounded-full';
        if (type === subpath) {
          classes += ' bg-red-500 text-white';
        } else {
          classes += ' bg-gray-200';
        }
        return classes;
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
       <nav className="w-full flex justify-center mt-8 gap-2 mb-8">
      <Link className={linkClasses('profile')} to={'/account'}>
       
        My profile
      </Link>
      <Link className={linkClasses('bookings')} to={'/account/bookings'}>
       
        My bookings
      </Link>
      <Link className={linkClasses('places')} to={'/account/places'}>
       
        My accommodations
      </Link>
    </nav>
          {content}

        {subpath === 'places' && (
        <Placespage />
      )}
        
    </div>
  )
}
