import React from "react";
import { useTask } from "../context/taskContext";

type Category = "To Do" | "In Progress" | "Done" | "Timeout";

interface Props {
  selectedCategory: Category;
  onSelectCategory: (category: Category) => void;
}

const categories: Category[] = ["To Do", "In Progress", "Done", "Timeout"];

const CategorySlider: React.FC<Props> = ({ selectedCategory, onSelectCategory }) => {
    const {tasks}=useTask()
  return (
    <div className="category-slider  overflow-x-scroll bg-white">
      {categories.map((category) => (
        <button
          key={category}
          className={`category-button ${selectedCategory === category ? "active" : ""} max-sm:w-[100%] w-[25%] m-2`}
          onClick={() => onSelectCategory(category)}
        >
          {category} ({tasks.filter(task=> task.category=== category).length})
        </button>
      ))}
    </div>
  );
};

export default CategorySlider;
