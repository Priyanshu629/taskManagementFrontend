import { createContext, useState, useEffect, ReactNode, useContext } from "react";

type Category = "To Do" | "In Progress" | "Done" | "Timeout";

type Task = {
  _id: string;
  title: string;
  description: string;
  priority: "Low" | "Medium" | "High";
  category: Category;
  deadline: string;
};

type TaskContextType = {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  expiredTasks:number
  doneTasks:number
  activeTasks:number
  selectedCategory:Category
  setSelectedCategory:React.Dispatch<React.SetStateAction<Category>>
  setTaskAdded:(value:boolean)=> void
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

type TaskProviderProps = {
  children: ReactNode;
};

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
const [selectedCategory, setSelectedCategory] = useState<Category>("To Do");
const [taskAdded,setTaskAdded]=useState<boolean>(false)
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        if (!import.meta.env.VITE_BACKEND_URL) {
          console.error("Backend URL is missing!");
          return;
        }

        const response = await fetch(import.meta.env.VITE_BACKEND_URL);
        const data = await response.json();
        setTasks(data.tasks);
      } catch (error) {
        return error
       
      }
    };

    fetchTasks();
    if(taskAdded==true){
      fetchTasks();
      setTaskAdded(false)
    }
  }, [taskAdded]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        if (!import.meta.env.VITE_BACKEND_URL) {
          console.error("Backend URL is missing!");
          return;
        }

        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/streaming`);
        const data = await response.json();
       
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
    
    
  }, []);


  

  const expiredTasks=tasks.filter(task=>task.category==="Timeout").length
  const activeTasks = tasks.filter(task=>task.category==="To Do").length + tasks.filter(task=>task.category==="In Progress").length
  const doneTasks= tasks.filter(task=>task.category==="Done").length

  return <TaskContext.Provider value={{ tasks, setTasks,expiredTasks,activeTasks,doneTasks,selectedCategory,setSelectedCategory,setTaskAdded }}>{children}</TaskContext.Provider>;
};

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTask must be used within a TaskProvider");
  }
  return context;
};
