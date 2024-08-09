import React, { useContext } from 'react'
import { Link } from 'react-router-dom'

import { Usercontext } from '../globalcontext/Usercontext';



export default function Header() {
  const {user}=useContext(Usercontext);
  return (
    <div>
      <div className="flex items-center justify-between m-2 gap-4  bg-green-300 h-20 px-2">
    <Link to='/'  className="flex items-center  gap-2">
      <div className="-rotate-90 transform scale-150 ">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
</svg>
</div>
<span className="text-xl">BookMyStay</span>
</Link >
   <div className="flex  gap-2 py-1 px-2 bg-gray-100 rounded-full w-1/2 h-full ">
    <div className=" hover:bg-gray-300 rounded-full p-3 w-1/4">
     <p className="font-bold mb-1 ">where</p>
     <input type="text" placeholder="search destinations" className=" bg-transparent w-full outline-none border-none " />
     </div>
     <div className=" hover:bg-gray-300 rounded-full p-3 w-1/5">
     <p className="font-bold mb-1 ">check in</p>
     <input type="text" placeholder="Add dates" className="bg-transparent w-full outline-none border-none  " />
     </div>
     <div className=" hover:bg-gray-300 rounded-full p-3 w-1/5">
     <p className="font-bold mb-1 ">check out</p>
     <input type="text" placeholder="Add dates" className="bg-transparent w-full outline-none border-none  " />
     </div>
     <div className=" flex hover:bg-gray-300 rounded-full p-3  gap-6">
      <div>
          <p className="font-bold mb-1 ">who</p>
          <p  className="font-thin text-gray-400 ">Add  guests</p>
      </div>
     <button className="flex justify-center items-center bg-red-300 rounded-full w-12 h-12">
     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
</svg>

     </button>
     </div>

     </div>
     <Link to={user? '/account':'/login'} className="flex border rounded-full border-gray-50 p-2">
     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
      stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
     </svg>
     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} 
      stroke="currentColor" className="size-6 ml-2">
  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
     </svg>
     {!!user && (
          <div>
            {user.name}
          </div>
        )}

     </Link>
     
   </div>
    </div>
  )
}
