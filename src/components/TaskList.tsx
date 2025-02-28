import React, {  useEffect } from "react";
import CategorySlider from "./CategorySlider";
import TaskItem from "./TaskItem";
import { useTask } from "../context/taskContext";



const TaskList: React.FC = () => {
  
  const { tasks, setTasks,selectedCategory,setSelectedCategory } = useTask();

  useEffect(() => {
    const updateTaskStatus = () => {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          new Date(task.deadline) < new Date() && task.category !== "Done"
            ? { ...task, category: "Timeout" }
            : task
        )
      );
    };

    updateTaskStatus(); 

    const interval = setInterval(updateTaskStatus, 60000); 

    return () => clearInterval(interval);
  }, [setTasks]); 

  
  

  const filteredTasks = tasks.filter((task) => task.category === selectedCategory);

  return (
    <div className="h-full bg-gray-200 m-2 w-[100%]">
      <CategorySlider selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
      <div className="task-list flex flex-wrap p-4 rounded-md">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => <TaskItem key={task._id} {...task} />)
        ) : (
          <p>No tasks in this category.</p>
        )}
      </div>
    </div>
  );
};

export default TaskList;
