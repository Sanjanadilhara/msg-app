
import Image from 'next/image'
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



const Signup=() =>{
  return (
    <div className='container mx-auto flex justify-center p-4  '>

    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>SignUp
        </CardTitle>
       {/* <CardDescription>You have 3 unread messages.</CardDescription> */}
      </CardHeader>
      <CardContent className="grid gap-4">
        <Label>name</Label>
        <Input type='text' placeholder='name'></Input>
        <Label>email</Label>
        <Input type='email' placeholder='e-mail'></Input>
        <Label>password</Label>
        <Input type='password' placeholder='password'></Input>

      </CardContent>
      <CardFooter>
        <Button className="w-full">
           Sign Up
        </Button>
      </CardFooter>
    </Card>
    </div>
  )
}
export {Signup};
