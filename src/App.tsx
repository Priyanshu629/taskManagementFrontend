import Header from "./components/Header"
import { FcExpired } from "react-icons/fc";
import { IoBagRemoveOutline } from "react-icons/io5";
import { FaRegClock } from "react-icons/fa";
import TaskList from "./components/TaskList";
import TaskForm from "./components/TaskForm";
import { useState } from "react";
import { useTask } from "./context/taskContext";
import  { Toaster}from "react-hot-toast"


const App = () => {
  const [isOpen , setIsOpen]=useState<boolean>(false)
  const {expiredTasks,activeTasks,doneTasks}=useTask()

  

  return (
    
    <div className="w-[90%]">
      <Header/>

    <main className="w-[95%] mx-auto flex flex-wrap justify-between p-4 mt-[100px]">

    <div className="flex flex-col w-[20%] max-sm:w-[100%] sm:fixed    p-2 text-black">
    <button className="p-2 rounded-lg bg-black text-white font-bold mt-2 cursor-pointer hover:bg-green-500" onClick={()=>setIsOpen(true)}>Add Task +</button>
    
     <div className="bg-gray-300 flex flex-col p-4 rounded-md  my-2 shadow-lg ">
      <FcExpired size={48} />
      <span>Expired Tasks</span>
      <span className="text-4xl font-bold">{expiredTasks}</span>
      </div>

     <div className="bg-gray-300 flex flex-col p-4 rounded-md  my-2 shadow-lg">
      <IoBagRemoveOutline size={48}/>
      <span>All active tasks</span>
      <span className="text-4xl font-bold">{activeTasks }</span>
      </div>

     <div className="bg-gray-300 flex flex-col p-4 rounded-md  my-2 shadow-lg">
      <FaRegClock size={48}/>
     <span>Completed Tasks</span>
     <span className="text-4xl font-bold">{doneTasks}/{activeTasks}</span>
      </div>
     
     
    </div>

    <div className="w-[80%] max-sm:w-[100%] sm:left-[30%] sm:relative   mr-6">
    <TaskList/>
    </div>
    <TaskForm isOpen={isOpen} setIsOpen={setIsOpen}/>
    
     <Toaster/>
    </main>
    
    </div>
  )
}

export default App
