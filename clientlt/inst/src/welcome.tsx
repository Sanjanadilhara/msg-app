
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



const Welcome=() =>{
  return (
    <div className='container mx-auto flex justify-center p-4  '>
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Welcome {"sanjana"}
        </CardTitle>
       {/* <CardDescription>You have 3 unread messages.</CardDescription> */}
      </CardHeader>
    </Card>
    </div>
  )
}
export {Welcome};
