"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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

export default function HomePage() {
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    const savedGoals = localStorage.getItem("goals");
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    }
  }, []);

  const handleAddGoal = () => {
    const name = prompt("What is your goal?");
    if (name) {
      const newGoal = {
        id: Date.now().toString(),
        name,
        tasks: [],
        completed: false,
      };
      const updatedGoals = [...goals, newGoal];
      setGoals(updatedGoals);
      localStorage.setItem("goals", JSON.stringify(updatedGoals));
    }
  };

  const calculateCompletionPercentage = (tasks: Task[]) => {
    if (tasks.length === 0) return 0;
    const completedTasks = tasks.filter((task) => task.completed).length;
    return Math.round((completedTasks / tasks.length) * 100);
  };

  return (
    <div>
      <button
        className="bg-blue-500 text-black px-4 py-2 rounded-md mb-4"
        onClick={handleAddGoal}
      >
        Add Goal
      </button>
      <ul className="list-disc pl-6">
        {goals.map((goal) => (
          <li key={goal.id} className="mb-2">
            <Link href={`/goal/${goal.id}`}>{goal.name}</Link>
            {goal.tasks.length === 0 && (
              <div className="text-red-500">
                No tasks yet. Add tasks to strive for this goal!
              </div>
            )}
            <div>
              {calculateCompletionPercentage(goal.tasks)}% of tasks completed
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
