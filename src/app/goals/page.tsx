"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AddGoalButton from "@/app/ui/addGoalButton";
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

const calculateCompletionPercentage = (tasks: Task[]): number => {
  const completedTasks = tasks.filter((task) => task.completed).length;
  return Number(((completedTasks / tasks.length) * 100).toFixed(0));
};

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    const savedGoals = localStorage.getItem("goals");
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    }
  }, []);

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
    const opacity = Math.max(brightness, 0.1);
    ctx.fillStyle = `rgba(255, 255, 0, ${opacity})`;
    ctx.fill();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  };

  const drawStars = (canvas: HTMLCanvasElement, goal: Goal) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = () => {
      // Set canvas size
      canvas.width = 200;
      canvas.height = 200;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw goal star in the center
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const goalBrightness = goal.completed ? 1 : 0.5;
      drawStar(ctx, centerX, centerY, 20, 5, 10, goalBrightness);

      // Draw task stars orbiting the goal star
      const orbitRadius = 50;
      const currentTime = Date.now() / 1000;
      goal.tasks.forEach((task, taskIndex) => {
        const angle =
          (2 * Math.PI * taskIndex) / goal.tasks.length + currentTime;
        const x = centerX + orbitRadius * Math.cos(angle);
        const y = centerY + orbitRadius * Math.sin(angle);
        const taskBrightness = task.completed ? 1 : 0.1;
        drawStar(ctx, x, y, 10, 5, 5, taskBrightness);
      });

      requestAnimationFrame(render);
    };

    render();
  };

  return (
    <section className="w-full h-min-screen p-5">
      <div className="w-full sm:w-8/12 mb-10">
        <div className="container mx-auto h-full">
          <nav className="flex px-4 justify-start items-center">
            <GiStarFormation className="text-2xl md:text-4xl text-amber-500 mr-4" />
            <h1 className="text-2xl md:text-4xl font-bold">
              Constellations of Purpose<span className="text-amber-500">.</span>
            </h1>
          </nav>
          <div className="mt-4 pl-6">
            <button
              className="bg-red-500 text-white/70 px-4 py-2 rounded-md mb-4 mr-4"
              onClick={() => {
                localStorage.removeItem("goals");
                setGoals([]);
                window.location.href = "/";
              }}
            >
              Clear Universe
            </button>
            <AddGoalButton goals={goals} setGoals={setGoals} />
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {goals.map((goal) => (
            <div
              key={goal.id}
              className="bg-zinc-950/60 shadow-md rounded-lg border border-amber-500 overflow-hidden flex flex-col"
            >
              <canvas
                ref={(canvas) => {
                  if (canvas) drawStars(canvas, goal);
                }}
                width={200}
                height={200}
                className="w-full h-60 object-cover border-b border-amber-500"
              ></canvas>
              <div className="p-4">
                <h2 className="text-lg font-semibold text-amber-500">
                  {goal.name}
                </h2>
                <p className="text-amber-500/60 mt-2">
                  {calculateCompletionPercentage(goal.tasks)}% of tasks
                  completed
                </p>
              </div>
              <div className="p-4">
                <span className="inline-block bg-amber-500 rounded-lg px-3 py-1 text-sm font-semibold text-zinc-950 mr-2">
                  <Link href={`/goal/${goal.id}`}>Add or Update Tasks</Link>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
