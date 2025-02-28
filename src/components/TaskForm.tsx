import {  useState } from "react";
import { useTask } from "../context/taskContext";
import {toast} from "react-hot-toast";

interface isOpenProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

const TaskForm: React.FC<isOpenProps> = ({ isOpen, setIsOpen }) => {
  const {setTaskAdded}= useTask()
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [deadline, setDeadline] = useState<string>("");
  const [priority,setPriority]= useState<string>("Low")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
   
   
    if (title === "" || description === "" || deadline === "") {
      toast.error("All fields are required");
      return;
    }

    try {
      const response = await fetch(import.meta.env.VITE_BACKEND_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description, deadline,priority }),
      });
      const data = await response.json();

      if (response.ok) {
      toast.success(data.message,{position:"top-center"})
        
        setTitle("");
        setDescription("");
        setDeadline("");
        setPriority("");
        setTimeout(() => {
          setIsOpen(false); 
        }, 2000);
        setTaskAdded(true)
      
      } else {
        toast.error(data.message || "Something went wrong",{position:"top-center"});
      }
    } catch (error) {
      alert(error);
    }
  };

 
  return (
    <div
      className={`${
        isOpen ? "scale-100" : "scale-0"
      } transform transition-all w-[30%] max-sm:w-[95%] p-4 fixed left-[30%] top-[25%] max-sm:left-2 max-sm:top-[200px] mx-auto border-2 rounded-md bg-slate-100`}
    >
      <div className="flex justify-between p-2 items-center">
        <h1 className="text-2xl font-semibold p-2 my-2">Add Task</h1>
        <span
          onClick={() => setIsOpen(false)}
          className="font-bold text-2xl border-[1px] border-green-500 cursor-pointer hover:border-2 transition-all p-2 inline-block text-red-500"
        >
          &times;
        </span>
      </div>
     
      <form onSubmit={handleSubmit}>
        <div className="my-2">
          <label className="font-bold text-lg my-2">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border-[1px]"
            type="text"
            placeholder="Enter Your Task..."
          />
        </div>
        <div>
          <label className="font-bold text-lg my-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border-[1px]"
          ></textarea>
        </div>

        <div className="my-2 text-lg">
          <label className="font-bold my-4">Deadline: </label>
          <input
            type="date"
            min={new Date().toISOString().split("T")[0]}
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
        </div>

        <div className="my-2 text-lg">
          <label className="font-bold my-4">Priority:(optional)</label>
          <select className="italic p-2 border-[1px]" value={priority} onChange={(e)=>setPriority(e.target.value)}>

            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <button
          type="submit"
          className="p-2 bg-green-600 text-white font-semibold rounded-md w-full hover:bg-green-700 cursor-pointer"
        >
          Add +
        </button>
      </form>
    </div>
  );
};

export default TaskForm;
