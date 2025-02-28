import { useState,useEffect } from "react"
import { useTask } from "../context/taskContext";
import {toast} from "react-hot-toast";

type EditProps={
    _id: string
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
    setIsDropdownOpen: (value: boolean) => void;
}
type Category = "To Do" | "In Progress" | "Done" | "Timeout";

type Task = {
  _id: string;
  title: string;
  description: string;
  priority: "Low" | "Medium" | "High";
  category: Category;
  deadline: string;
};

const EditTask: React.FC<EditProps> = ({ _id,isOpen, setIsOpen ,setIsDropdownOpen }) => {
    const {setTasks}= useTask()

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [deadline, setDeadline] = useState<string>("");
  const [priority,setPriority]= useState<string>("Low")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (title === "" || description === "" || deadline === "") {
      toast.error("* All fields are required");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/${_id}`, {
        method: "PUT",
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
        
        setIsDropdownOpen(false);
        
        setTimeout(() => {
          setIsOpen(false); 
        }, 3000);
    
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === _id
              ? { ...task, title, description, deadline, priority }
              : task
          ) as Task[]
        );
      } else {
        toast.error(data.message,{position:"top-center"});
      }
    } catch (error) {
      console.error("Error submitting task:", error);
      if (error instanceof Error) {
        toast.error(`Failed to submit the task: ${error.message}`, { position: "top-center" });
      } else {
        toast.error("Failed to submit the task", { position: "top-center" });
      }
    }
    
  };




  useEffect(() => {
    const fetchTasks = async () => {
      try {
        if (!import.meta.env.VITE_BACKEND_URL) {
          console.error("Backend URL is missing!");
          return;
        }

        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/${_id}`);
        const data = await response.json();
        setTitle(data.task.title);
        setDescription(data.task.description);
        const deadline = new Date(data.task.deadline).toISOString().split("T")[0]
        setDeadline(deadline);
        setPriority(data.task.priority)
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, [_id]);

  return (
    <div
      className={`${
        isOpen ? "scale-100" : "scale-0"
      } transform transition-all w-[90%] p-4   mx-auto border-2 rounded-md bg-slate-100`}
    >
      <div className="flex justify-between p-2 items-center">
        <h1 className="text-2xl font-semibold p-2 my-2">Edit Task</h1>
        <span
          onClick={() =>{ setIsOpen(false) 
            setIsDropdownOpen(false)
          }}
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

        <div className="my-2 text-lg ">
          <label className="font-bold my-4">Deadline: </label>
          <input
           className="border-[1px]"
            type="date"
            min={new Date().toISOString().split("T")[0]}
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
        </div>
        <div className="my-2 text-lg ">
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
          Update +
        </button>
      </form>
    </div>
  );
};

export default EditTask
