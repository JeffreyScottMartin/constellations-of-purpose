"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AddGoalButton from "@/app/ui/addGoalButton";

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

  // Load goals from localStorage
  useEffect(() => {
    const savedGoals = localStorage.getItem("goals");
    if (savedGoals) {
      const parsedGoals = JSON.parse(savedGoals);
      setGoals(parsedGoals);
    }
  }, []);

  // Handle routing based on goals state
  useEffect(() => {
    if (goals?.some((goal: Goal) => goal.tasks?.length > 0)) {
      router.push("/goals");
    }
  }, [goals, router]);

  const handleGoalAdded = () => {
    router.push("/goals");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Get Started</h1>
      <AddGoalButton
        goals={goals}
        setGoals={setGoals}
        onGoalAdded={handleGoalAdded}
      />
    </div>
  );
}
