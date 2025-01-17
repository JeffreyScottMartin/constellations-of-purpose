"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Goal {
  id: string;
  name: string;
  tasks: string[];
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
      const newGoal = { id: Date.now().toString(), name, tasks: [] };
      const updatedGoals = [...goals, newGoal];
      setGoals(updatedGoals);
      localStorage.setItem("goals", JSON.stringify(updatedGoals));
    }
  };

  return (
    <div>
      <button
        className="bg-star text-black px-4 py-2 rounded-md mb-4"
        onClick={handleAddGoal}
      >
        Add New Goal
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map((goal) => (
          <Link
            key={goal.id}
            href={`/${goal.id}`}
            className="p-4 bg-gray-800 rounded-lg shadow-md hover:shadow-xl"
          >
            <h2 className="text-lg font-bold">{goal.name}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
}
