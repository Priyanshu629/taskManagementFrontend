import React, { useState } from "react";
import Dropdown from "./Dropdown";

type TaskProp = {
  _id: string;
  title: string;
  description: string;
  category: string;
  priority: "Low" | "Medium" | "High";
  deadline: string;
};

const TaskItem: React.FC<TaskProp> = ({ _id, title, description, priority, deadline }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const expDate = new Date(deadline);

  return (
    <div className="flex flex-col shadow-lg max-w-[300px] m-2 bg-white p-4 rounded-md relative">
      <div className="flex justify-between">
        <span className="p-2 bg-red-100 font-bold w-[50%]">{priority}</span>
        <span onClick={() => setIsDropdownOpen((prev) => !prev)} className="font-bold text-xl cursor-pointer">
          ...
        </span>
      </div>
      <span className="font-bold text-xl my-2">{title}</span>
      <span className="text-sm italic font-semibold">{description}</span>
      <span className="my-6">Deadline: {expDate.toLocaleDateString("en-GB")}</span>

      
      <Dropdown _id={_id} dropDownIsOpen={isDropdownOpen} setDropDownIsOpen={setIsDropdownOpen} />
    </div>
  );
};

export default TaskItem;
