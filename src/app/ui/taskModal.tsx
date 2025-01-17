import { useState } from "react";

interface Task {
  name: string;
  completed: boolean;
}

interface Goal {
  id: string;
  name: string;
  tasks: Task[];
  completed: boolean;
}

interface TaskModalProps {
  goal: Goal;
  onClose: () => void;
  onSave: (taskName: string) => void;
}

export default function TaskModal({ goal, onClose, onSave }: TaskModalProps) {
  const [taskName, setTaskName] = useState("");

  const handleSave = () => {
    if (taskName) {
      onSave(taskName);
      setTaskName("");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-md w-96">
        <h2 className="text-2xl font-bold mb-4">
          Update/Add Tasks for {goal.name}
        </h2>
        <input
          type="text"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          className="w-full p-2 border text-black border-gray-300 rounded mb-4"
          placeholder="Enter task name"
        />
        <div className="flex justify-end">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleSave}
          >
            Save Task
          </button>
        </div>
      </div>
    </div>
  );
}
