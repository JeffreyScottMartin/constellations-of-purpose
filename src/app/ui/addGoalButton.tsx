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

interface AddGoalButtonProps {
  goals: Goal[];
  setGoals: (goals: Goal[]) => void;
  onGoalAdded?: () => void; // Optional callback for when a goal is added
}

export default function AddGoalButton({
  goals,
  setGoals,
  onGoalAdded,
}: AddGoalButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newGoalName, setNewGoalName] = useState("");
  const [newTaskName, setNewTaskName] = useState("");
  const [currentGoalId, setCurrentGoalId] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

  const handleAddGoal = () => {
    if (newGoalName) {
      const newGoal = {
        id: Date.now().toString(),
        name: newGoalName,
        tasks: [],
        completed: false,
      };
      const updatedGoals = [newGoal, ...goals];
      setGoals(updatedGoals);
      localStorage.setItem("goals", JSON.stringify(updatedGoals));
      setNewGoalName("");
      setCurrentGoalId(newGoal.id);
    }
  };

  const handleAddTask = () => {
    if (newTaskName) {
      setTasks([...tasks, { name: newTaskName, completed: false }]);
      setNewTaskName("");
    }
  };

  const handleSaveTasks = () => {
    if (currentGoalId) {
      const updatedGoals = goals.map((goal) => {
        if (goal.id === currentGoalId) {
          return {
            ...goal,
            tasks: [...goal.tasks, ...tasks],
          };
        }
        return goal;
      });
      setGoals(updatedGoals);
      localStorage.setItem("goals", JSON.stringify(updatedGoals));
      setTasks([]);
      setIsModalOpen(false);
      setCurrentGoalId(null);
      if (onGoalAdded) {
        onGoalAdded();
      }
    }
  };

  return (
    <>
      <button
        className="bg-amber-500 font-bold text-zinc-950 px-4 py-2 rounded-md mb-4"
        onClick={() => setIsModalOpen(true)}
      >
        Add Constellation
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-zinc-950/80">
          <div className="bg-zinc-950 p-6 rounded-lg shadow-lg border border-amber-500">
            {!currentGoalId ? (
              <>
                <h2 className="text-xl text-white font-bold mb-4">
                  Add a New Constellation
                </h2>
                <input
                  type="text"
                  value={newGoalName}
                  onChange={(e) => setNewGoalName(e.target.value)}
                  className="w-full p-2 border text-black border-gray-300 rounded mb-4"
                  placeholder="Enter goal name"
                />
                <div className="flex justify-end">
                  <button
                    className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-amber-500 text-zinc-950 font-bold px-4 py-2 rounded"
                    onClick={handleAddGoal}
                  >
                    Add Constellation
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-xl text-white font-bold mb-4">
                  Add tasks required to complete the constellation
                </h2>
                <input
                  type="text"
                  value={newTaskName}
                  onChange={(e) => setNewTaskName(e.target.value)}
                  className="w-full p-2 border text-black border-gray-300 rounded mb-4"
                  placeholder="Enter task name"
                />
                <button
                  className="bg-amber-500 text-zinc-950 px-4 py-2 rounded mb-4"
                  onClick={handleAddTask}
                >
                  Add Task
                </button>
                <ul className="list-disc pl-5 mb-4">
                  {tasks.map((task, index) => (
                    <li key={index} className="text-amber-500/60">
                      {task.name}
                    </li>
                  ))}
                </ul>
                <div className="flex justify-end">
                  <button
                    className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                    onClick={() => {
                      setIsModalOpen(false);
                      setCurrentGoalId(null);
                      setTasks([]);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-amber-500 text-zinc-950 px-4 py-2 rounded font-bold"
                    onClick={handleSaveTasks}
                  >
                    Create Constellation
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
