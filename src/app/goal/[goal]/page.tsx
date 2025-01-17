"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { GiStarFormation } from "react-icons/gi";

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

    let animationFrameId: number;
    const orbitRadius = 100;
    let angleOffset = 0;

    const render = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Calculate goal brightness based on task completion
      const completedTasks = goal.tasks.filter((task) => task.completed).length;
      const totalTasks = goal.tasks.length;
      const goalBrightness = totalTasks > 0 ? completedTasks / totalTasks : 0.1;

      // Draw goal star in the center
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      drawStar(ctx, centerX, centerY, 40, 5, 20, goalBrightness);

      // Draw task stars orbiting the goal star
      goal.tasks.forEach((task, index) => {
        const angle = (2 * Math.PI * index) / goal.tasks.length + angleOffset;
        const x = centerX + orbitRadius * Math.cos(angle);
        const y = centerY + orbitRadius * Math.sin(angle);
        const taskBrightness = task.completed ? 1 : 0.1;
        drawStar(ctx, x, y, 20, 5, 10, taskBrightness);
      });

      angleOffset += 0.01;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
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
    <section className="w-full h-min-screen p-5">
      <div className="w-full sm:w-8/12 mb-2">
        <div className="container mx-auto h-full">
          <nav className="flex px-4 justify-start items-center">
            <GiStarFormation className="text-2xl md:text-4xl text-amber-500 mr-4" />
            <h1 className="text-2xl md:text-4xl font-bold">
              Constellations of Purpose<span className="text-amber-500">.</span>
            </h1>
          </nav>
          <button
            className="mt-4 bg-amber-500 text-zinc-950 font-bold px-4 py-2 rounded ml-2"
            onClick={() => router.push("/goals")}
          >
            Return to Constellations
          </button>
        </div>
      </div>

      <div className="relative flex flex-col items-center mx-auto lg:flex-row-reverse lg:max-w-5xl lg:mt-2 xl:max-w-6xl">
        <div className="w-full h-64 lg:w-1/2 lg:h-auto">
          <canvas
            ref={canvasRef}
            className="w-full h-auto object-cover"
            width="300"
            height="300"
          />
        </div>
        <div className="max-w-lg bg-zinc-950/60 rounded-lg border border-amber-500 md:max-w-2xl md:z-10 md:shadow-lg md:absolute md:top-0 md:mt-48 lg:w-3/5 lg:left-0 lg:mt-20 lg:ml-20 xl:mt-24 xl:ml-12">
          <div className="flex flex-col p-12 md:px-16">
            <h2 className="text-lg font-bold text-amber-500">{goal.name}</h2>
            <div className="mt-2">
              <ul className="list-disc pl-6">
                {goal.tasks.map((task, index) => (
                  <li key={index} className="flex items-center text-md">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleToggleTaskCompletion(index)}
                    />
                    <span
                      className={
                        task.completed
                          ? "line-through ml-4 text-amber-500/40 text-md"
                          : "ml-4 text-amber-500"
                      }
                    >
                      {task.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-2">
              <div className="flex mb-4">
                <input
                  type="text"
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full p-2 border text-black border-gray-300 rounded-lg"
                  placeholder="Enter new tasks."
                />
              </div>
              <button
                className="bg-amber-500 text-zinc-950 font-bold px-4 py-2 rounded-lg"
                onClick={handleAddTask}
              >
                Add Task
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
