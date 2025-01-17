"use client";

import { GiStarFormation } from "react-icons/gi";

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
    <div className="w-full sm:w-8/12 mb-10">
      <div className="container mx-auto h-full mt-10">
        <nav className="flex px-4 justify-start items-center">
          <GiStarFormation className="text-2xl md:text-4xl text-amber-500 mr-4" />
          <h1 className="text-2xl md:text-4xl font-bold">
            Constellations of Purpose<span className="text-amber-500">.</span>
          </h1>
        </nav>
        <header className="container px-4 lg:flex mt-10 items-center h-full lg:mt-0">
          <div className="w-full">
            <div className="w-20 h-2 bg-amber-500 my-2"></div>
            <p className="text-lg mb-6">
              <strong>Constellations of Purpose</strong> is your personal goal
              management tool that helps you visualize and achieve your dreams.
              Create goals, break them down into manageable tasks, and watch as
              your progress lights up the sky.
            </p>
            <h2 className="text-2xl font-bold mb-4">Get Started</h2>
            <p className="text-lg mb-4">
              Getting started with Constellations of Purpose is easy:
            </p>
            <ol className="text-md list-decimal list-outside mb-4 ml-6">
              <li className="mb-2">
                Click the <strong>Add Constellation</strong> button to create a
                new goal.
              </li>
              <li className="text-md mb-2">
                Name your goal and add tasks to break it down into actionable
                steps.
              </li>
              <li className="text-md mb-2">
                Track your progress by marking tasks as completed.
              </li>
              <li className="text-md mb-2">
                Watch your goals shine brighter as you complete more tasks!
              </li>
              <li className="text-md mb-2">
                This application uses Local Browser Storage - if you clear your
                your browser cache, your goals will be lost. If you have goals
                in your cache you will be automatically redirected to the goals
                listing page.
              </li>
            </ol>
            <AddGoalButton
              goals={goals}
              setGoals={setGoals}
              onGoalAdded={handleGoalAdded}
            />
          </div>
        </header>
      </div>
    </div>
  );
}
