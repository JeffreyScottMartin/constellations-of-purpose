"use client";

import { useEffect, useState, useRef } from "react";
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [taskName, setTaskName] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();
  const params = useParams();
  const goalId = params?.goal as string;

  useEffect(() => {
    const fetchGoal = () => {
      console.log("Fetching goal with ID:", goalId);
      const savedGoals = localStorage.getItem("goals");

      if (savedGoals) {
        try {
          const goals = JSON.parse(savedGoals) as Goal[];
          console.log("All goals:", goals);

          const foundGoal = goals.find((g) => g.id === goalId);
          console.log("Found goal:", foundGoal);

          if (foundGoal) {
            setGoal(foundGoal);
            setError(null);
          } else {
            setError(`Goal not found with ID: ${goalId}`);
            console.error("Goal not found with ID:", goalId);
          }
        } catch (err) {
          setError("Error parsing goals from storage");
          console.error("Error parsing goals:", err);
        }
      } else {
        setError("No goals found in storage");
        console.error("No goals in localStorage");
      }
      setIsLoading(false);
    };

    fetchGoal();
  }, [goalId]);

  const handleAddTask = () => {
    if (taskName && goal) {
      const newTask = { name: taskName, completed: false };
      const updatedTasks = [...goal.tasks, newTask];
      const updatedGoal = { ...goal, tasks: updatedTasks };
      updateGoalInStorage(updatedGoal);
      setTaskName("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAddTask();
    }
  };

  const handleToggleTaskCompletion = (taskIndex: number) => {
    if (goal) {
      const updatedTasks = goal.tasks.map((task, index) =>
        index === taskIndex ? { ...task, completed: !task.completed } : task
      );
      const updatedGoal = { ...goal, tasks: updatedTasks };
      updateGoalInStorage(updatedGoal);
    }
  };

  const updateGoalInStorage = (updatedGoal: Goal) => {
    const savedGoals = localStorage.getItem("goals");
    if (savedGoals) {
      const goals = JSON.parse(savedGoals);
      const updatedGoals = goals.map((g: Goal) =>
        g.id === updatedGoal.id ? updatedGoal : g
      );
      localStorage.setItem("goals", JSON.stringify(updatedGoals));
      setGoal(updatedGoal);
    }
  };

  const drawStar = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number,
    spikes: number,
    innerRadius: number,
    brightness: number
  ) => {
    ctx.beginPath();
    ctx.translate(x, y);

    for (let i = 0; i < spikes * 2; i++) {
      const r = i % 2 === 0 ? radius : innerRadius;
      const angle = (Math.PI * i) / spikes;
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }

    ctx.closePath();
    ctx.fillStyle = `rgba(255, 255, 0, ${brightness})`;
    ctx.fill();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  };

  useEffect(() => {
    if (!goal || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = 400;
    canvas.height = 400;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw goal star in the center
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const goalBrightness = goal.completed ? 1 : 0.5;
    drawStar(ctx, centerX, centerY, 40, 5, 20, goalBrightness);

    // Draw task stars orbiting the goal star
    const orbitRadius = 100;
    goal.tasks.forEach((task, index) => {
      const angle = (2 * Math.PI * index) / goal.tasks.length;
      const x = centerX + orbitRadius * Math.cos(angle);
      const y = centerY + orbitRadius * Math.sin(angle);
      const taskBrightness = task.completed ? 1 : 0.1;
      drawStar(ctx, x, y, 20, 5, 10, taskBrightness);
    });
  }, [goal]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center">
        <p className="text-red-500">{error}</p>
        <button
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => router.push("/goals")}
        >
          Return to Goals
        </button>
      </div>
    );
  }

  if (!goal) {
    return <div>Goal not found</div>;
  }

  return (
    <div>
      <div className="w-full max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">{goal.name}</h1>

        <div className="mb-8">
          <canvas
            ref={canvasRef}
            className="w-full h-auto object-cover bg-slate-950"
            width="400"
            height="400"
          />
        </div>
        <div className="flex mb-4">
          <input
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full p-2 border text-black border-gray-300 rounded-l mb-4"
            placeholder="Enter task name and press Enter"
          />
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded ml-2"
            onClick={() => router.push("/goals")}
          >
            Return to Goals
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-r"
            onClick={handleAddTask}
          >
            Add Task
          </button>
        </div>
        <ul className="list-disc pl-6">
          {goal.tasks.map((task, index) => (
            <li key={index} className="mb-2 flex items-center">
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
      </div>
    </div>
  );
}
