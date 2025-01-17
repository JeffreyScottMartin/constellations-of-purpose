"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { use } from "react";

interface Goal {
  id: string;
  name: string;
  tasks: string[];
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
    const task = prompt("What is the task?");
    if (task && goal) {
      const updatedGoal = { ...goal, tasks: [...goal.tasks, task] };
      const savedGoals = localStorage.getItem("goals");
      if (savedGoals) {
        const goals = JSON.parse(savedGoals) as Goal[];
        const updatedGoals = goals.map((g) =>
          g.id === goal.id ? updatedGoal : g
        );
        localStorage.setItem("goals", JSON.stringify(updatedGoals));
        setGoal(updatedGoal);
      }
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
            {task}
          </li>
        ))}
      </ul>
      <button
        className="bg-red-600 px-4 py-2 rounded-md mt-4"
        onClick={() => router.push("/")}
      >
        Back to Home
      </button>
    </div>
  );
}
