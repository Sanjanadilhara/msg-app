"use client"
import { useEffect, useState } from 'react'
import {Signup} from './signup'
import {Login} from './login'
import {Welcome} from './welcome'

export default function  Home() {
    const [authUser, setAuth]=useState(false);
    useEffect(()=>{
      
      fetch("http://localhost:80/",{credentials: 'include',}).then((data)=>data.json()).then((data)=>{
        console.log(data);
        if(data.status>0){
          setAuth(true);
        }
        else{
          setAuth(false);
        }
      }).catch((err)=>setAuth(false));
    }, []);
    console.log("home called");
    return (
      <div className='container mx-auto flex justify-center p-4 '>
        {(authUser)?<Welcome></Welcome>:<Login></Login>}
      </div>
    )
}
