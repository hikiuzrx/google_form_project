'use client';
import { useState} from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

const Navbar = () => {
const {data:session }= useSession()
  const [hoverIndex, setHoverIndex] = useState<number>(0);
  const [h1,setH1]= useState<boolean>(false)
  const [h2,setH2]= useState<boolean>(false)
  const [h3,setH3]= useState<boolean>(false)
  const [h4,setH4] = useState<boolean>(false)
  const [h5,setH5] = useState<boolean>(false)
  
  
  // Start with -1 to indicate no hover

  return (
    <nav className={`relative flex  text-white w-1/3  ${!session? ' justify-between':' justify-around '}`}>
      <div
        className={`absolute inset-0 ${session?'ml-20':'ml-0'} w-1/5 rounded-xl transition-transform duration-300 ease-in-out z-0 ${
          (session?(!h4 && !h5):(!h1 && !h2 && !h3)) ?'bg-transparent':'bg-custom1'
        }`}
        style={{
          transform: `translateX(${session?hoverIndex*250 :hoverIndex*200}%)`, // Adjust based on the size of your links
        }}
      ></div>

      {!session? (['/forms', '/auth/login', '/auth/register'].map((href, index) => (
        <Link
          key={index}
          href={href}
          className="relative border-2 border-cyan-400 p-3 w-1/5 text-center rounded-xl text-white group"
          onMouseEnter={() => {
               switch(index){
                    case 0:setH1(true)
                    break;
                    case 1: setH2(true)
                    break;
                    case 2: setH3(true)
                    break;
                    
               }
               setHoverIndex(index)}} // Set index on hover
          onMouseLeave={() => {
               switch(index){
                    case 0:setH1(false)
                    break;
                    case 1: setH2(false)
                    break;
                    case 2: setH3(false)
                    break;
                
               }
            // Do nothing on mouse leave to keep the background visible
          }}
        >
          <p className="z-10">{href === '/forms' ? 'Forms' : href === '/auth/login' ? 'Login' : "Sign-Up"}</p>
        </Link>
      ))):['/forms', '/auth/signout'].map((href, index) => ( 
        <Link
          key={index}
          href={href}
          className="relative border-2 ml-2 border-cyan-400 p-3 w-1/5 text-center rounded-xl text-white group"
          onMouseEnter={() => {
               switch(index){
                    case 0:setH4(true)
                    break;
                    case 1: setH5(true)
                    break;
                   
               }
               setHoverIndex(index)}} // Set index on hover
          onMouseLeave={() => {
               switch(index){
                    case 0:setH4(false)
                    break;
                    case 1: setH5(false)
                    break;
                  
               }
            // Do nothing on mouse leave to keep the background visible
         
          }}
        >
          <p className="z-10">{href === '/forms' ? 'forms' : "Sign Out"}</p>
        </Link>
      ))}
    </nav>
  );
};

export default Navbar;
