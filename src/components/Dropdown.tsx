import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { useTask } from "../context/taskContext";
import { useState } from "react";
import EditTask from "./EditTask";
import {toast} from "react-hot-toast";

type IdProp = {
  _id: string;
  dropDownIsOpen: boolean;
  setDropDownIsOpen: (value: boolean) => void;
};
type Category = "To Do" | "In Progress" | "Done" | "Timeout";

type Task = {
  _id: string;
  title: string;
  description: string;
  priority: "Low" | "Medium" | "High";
  category: Category;
  deadline: string;
};
const Dropdown: React.FC<IdProp> = ({ _id, dropDownIsOpen, setDropDownIsOpen }) => {
  const { setTasks,selectedCategory } = useTask();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleDelete = async (taskId: string): Promise<void> => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/${taskId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(data.message,{position:"top-center"})
        setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };
  const handleCategoryUpdate =async(_id:string,category:string):Promise<void>=>{
       const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/${_id}`,{
        method:"PATCH",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({category})
       })
       const data = await response.json()
       if(response.ok){
        toast.success(data.message,{position:"top-center"})
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === _id ? { ...task, category } : task
          ) as Task[]
        );
        
       }
  }

  return (
    <div className=" w-full ">
     
      {isOpen && (
        <div className="fixed z-60 top-[25%] left-[50%] max-sm:left-0">
          <EditTask _id={_id} isOpen={isOpen} setIsOpen={setIsOpen} setIsDropdownOpen={setDropDownIsOpen} />
        </div>
      )}

     
      <div
        className={`text-sm font-semibold absolute left-[180px] max-sm:left-[100px] top-12 z-50 border p-4 bg-white flex flex-col shadow-md rounded-md 
        transition-all duration-200 ${dropDownIsOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}
      >
        <div
          onClick={() => {
            setIsOpen(true);
            setDropDownIsOpen(false); 
          }}
          className="p-1 flex cursor-pointer text-sm"
        >
          <FaEdit size={24} /> <span>Edit</span>
        </div>
        <div
          onClick={() => handleDelete(_id)}
          className="p-1 flex rounded-md my-2 cursor-pointer text-sm text-red-600 hover:bg-red-100"
        >
          <MdDeleteForever size={24} />
          <span>Delete</span>
        </div>
        {
          selectedCategory=="To Do"  &&
          <div>
          <button onClick={()=>handleCategoryUpdate(_id,"In Progress")}className="bg-orange-400 p-1 rounded-md cursor-pointer hover:bg-orange-300">MarkAsInProgress</button>
          </div>
        }
        {
          selectedCategory=="In Progress" &&
          <div>
          <button onClick={()=>handleCategoryUpdate(_id,"Done")} className="bg-green-400 p-1 rounded-md cursor-pointer hover:bg-green-300">MarkAsDone</button>
          </div>
        }
      </div>
    </div>
  );
};

export default Dropdown;
