import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Button } from "@/components/ui/button"
import {Login} from './login'



function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='container mx-auto flex justify-center p-4 '>
    <Login></Login>
  </div>
  )
}

export default App
