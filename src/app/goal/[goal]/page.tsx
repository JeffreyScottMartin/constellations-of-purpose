"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { use } from "react";

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

export default function GoalPage({
  params,
}: {
  params: Promise<{ goal: string }>;
}) {
  const unwrappedParams = use(params);
  const [goal, setGoal] = useState<Goal | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchGoal = async () => {
      const savedGoals = localStorage.getItem("goals");
      if (savedGoals) {
        const goals = JSON.parse(savedGoals) as Goal[];
        const currentGoal = goals.find((g) => g.id === unwrappedParams.goal);
        if (currentGoal) {
          setGoal(currentGoal);
        } else {
          console.error("Goal not found");
        }
      } else {
        console.error("No goals found in localStorage");
      }
      setLoading(false);
    };

    fetchGoal();
  }, [unwrappedParams.goal]);

  const handleAddTask = () => {
    const taskName = prompt("What is the task?");
    if (taskName && goal) {
      const newTask = { name: taskName, completed: false };
      const updatedGoal = { ...goal, tasks: [...goal.tasks, newTask] };
      updateGoal(updatedGoal);
    }
  };

  const handleToggleTaskCompletion = (taskIndex: number) => {
    if (goal) {
      const updatedTasks = goal.tasks.map((task, index) =>
        index === taskIndex ? { ...task, completed: !task.completed } : task
      );
      const allTasksCompleted = updatedTasks.every((task) => task.completed);
      const updatedGoal = {
        ...goal,
        tasks: updatedTasks,
        completed: allTasksCompleted,
      };
      updateGoal(updatedGoal);
    }
  };

  const updateGoal = (updatedGoal: Goal) => {
    const savedGoals = localStorage.getItem("goals");
    if (savedGoals) {
      const goals = JSON.parse(savedGoals) as Goal[];
      const updatedGoals = goals.map((g) =>
        g.id === updatedGoal.id ? updatedGoal : g
      );
      localStorage.setItem("goals", JSON.stringify(updatedGoals));
      setGoal(updatedGoal);
    }
  };

  if (loading) return <div>Loading...</div>;

  if (!goal) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">No goal found</h1>
        <button
          className="bg-blue-500 text-black px-4 py-2 rounded-md mb-4"
          onClick={() => router.push("/")}
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{goal.name}</h1>
      <button
        className="bg-blue-500 text-black px-4 py-2 rounded-md mb-4"
        onClick={handleAddTask}
      >
        Add Task
      </button>
      <ul className="list-disc pl-6">
        {goal.tasks.map((task, index) => (
          <li key={index} className="mb-2">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => handleToggleTaskCompletion(index)}
            />
            <span className={task.completed ? "line-through" : ""}>
              {task.name}
            </span>
          </li>
        ))}
      </ul>
      {goal.completed && (
        <div className="text-green-500 font-bold mt-4">Goal Completed!</div>
      )}
      <button
        className="bg-red-600 px-4 py-2 rounded-md mt-4"
        onClick={() => router.push("/")}
      >
        Back to Home
      </button>
    </div>
  );
}
