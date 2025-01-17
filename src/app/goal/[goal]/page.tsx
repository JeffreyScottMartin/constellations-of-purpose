"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

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

export default function GoalPage() {
  const [goal, setGoal] = useState<Goal | null>(null);
  const [taskName, setTaskName] = useState("");
  const router = useRouter();
  const params = useParams();
  const goalId = params?.goal as string; // Get the 'goal' parameter from URL

  useEffect(() => {
    const fetchGoal = () => {
      const savedGoals = localStorage.getItem("goals");
      if (savedGoals) {
        const goals = JSON.parse(savedGoals) as Goal[];
        console.log("Goals in storage:", goals); // Debug log
        console.log("Looking for goal ID:", goalId); // Debug log

        const currentGoal = goals.find((g) => g.id === goalId);
        if (currentGoal) {
          console.log("Found goal:", currentGoal); // Debug log
          setGoal(currentGoal);
        } else {
          console.error(`Goal not found with ID: ${goalId}`);
          router.push("/goals");
        }
      } else {
        console.error("No goals found in localStorage");
        router.push("/goals");
      }
    };

    fetchGoal();
  }, [goalId]);

  useEffect(() => {
    const savedGoals = localStorage.getItem("goals");
    if (savedGoals) {
      const goals = JSON.parse(savedGoals) as Goal[];
      const currentGoal = goals.find((g) => g.id === goalId);
      if (currentGoal) {
        setGoal(currentGoal);
      } else {
        console.error("Goal not found");
        router.push("/goals");
      }
    } else {
      console.error("No goals found in localStorage");
      router.push("/goals");
    }
  }, [goalId, router]);

  const handleAddTask = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && taskName && goal) {
      const newTask = { name: taskName, completed: false };
      const updatedTasks = [...goal.tasks, newTask];
      const updatedGoal = { ...goal, tasks: updatedTasks };
      setGoal(updatedGoal);
      setTaskName("");
      // Update the goal in localStorage
      const savedGoals = localStorage.getItem("goals");
      if (savedGoals) {
        const goals = JSON.parse(savedGoals);
        const updatedGoals = goals.map((g: Goal) =>
          g.id === goal.id ? updatedGoal : g
        );
        localStorage.setItem("goals", JSON.stringify(updatedGoals));
      }
    }
  };

  const handleToggleTaskCompletion = (taskIndex: number) => {
    if (goal) {
      const updatedTasks = goal.tasks.map((task, index) =>
        index === taskIndex ? { ...task, completed: !task.completed } : task
      );
      const updatedGoal = { ...goal, tasks: updatedTasks };
      setGoal(updatedGoal);
      // Update the goal in localStorage
      const savedGoals = localStorage.getItem("goals");
      if (savedGoals) {
        const goals = JSON.parse(savedGoals);
        const updatedGoals = goals.map((g: Goal) =>
          g.id === goal.id ? updatedGoal : g
        );
        localStorage.setItem("goals", JSON.stringify(updatedGoals));
      }
    }
  };

  if (!goal) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{goal.name}</h1>
      <input
        type="text"
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
        onKeyDown={handleAddTask}
        className="w-full p-2 border text-black border-gray-300 rounded mb-4"
        placeholder="Enter task name and press Enter"
      />
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
        onClick={() => router.push("/goals")}
      >
        Back to Home
      </button>
    </div>
  );
}
