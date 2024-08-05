import React, { useEffect, useState } from 'react'
import { Usercontext } from '../globalcontext/Usercontext'
//import { useContext } from 'react'
import axios from 'axios';

export default function Usercontextprovider({children}) {
  const [user,setuser]=useState(null);
  const [ready,setready]=useState(false);
  useEffect(() => {
    if (!user) {
      axios.get('/profile').then(({ data }) => {
        setuser(data);
         setready(true);
        console.log('user and ready set');
       // console.log(user);
      });
     
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  return (
    <Usercontext.Provider value={{user,setuser,ready}}>
      {children}
    </Usercontext.Provider>
  )
}
