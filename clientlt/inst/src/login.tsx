import { BellRing, Check } from "lucide-react"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { useEffect, useState } from 'react'






const Login=() =>{
  const [userData, setUserData]=useState({email:"", password:""});


  useEffect(()=>{
    console.log(userData);
  }, [userData]);


  function onLoginClicked(){
    fetch("http://localhost:80/login", {
      method: "POST",
      // mode: "cors", // no-cors, *cors, same-origin
      // credentials: "same-origin",
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData), 
    })
    .then((data)=>data.json())
    .then((data)=>{
      if(data.status==-1){
        alert("no user exist");
      }
      else if(data.status==-2){
        alert("wrong password");
      }
      else{
        window.location.href="http://localhost:3000/"
      }
    }).catch((err)=>{

    });
  }

  return (
    <div className='container mx-auto flex justify-center p-4  '>

    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Log In
        </CardTitle>
       {/* <CardDescription>You have 3 unread messages.</CardDescription> */}
      </CardHeader>
      <CardContent className="grid gap-4">
     
        <Label>email</Label>
        <Input type='email' placeholder='e-mail'  onChange={(e)=>setUserData({...userData, email:e.target.value})}></Input>
        <Label>password</Label>
        <Input type='password' placeholder='password'  onChange={(e)=>setUserData({...userData, password:e.target.value})}></Input>

      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={onLoginClicked}>
           LogIn
        </Button>
      </CardFooter>
    </Card>
    </div>
  )
}
export {Login};
