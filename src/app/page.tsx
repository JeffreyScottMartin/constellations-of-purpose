"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  useEffect(() => {
    const savedGoals = localStorage.getItem("goals");
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    }
  }, []);

  useEffect(() => {
    if (goals.length > 0) {
      router.push("/goals");
    }
  }, [goals, router]);

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

  if (goals.length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Get Started</h1>
        <button
          className="bg-blue-500 text-black px-4 py-2 rounded-md mb-4"
          onClick={handleAddGoal}
        >
          Add Goal
        </button>
      </div>
    );
  }

  return null;
}
