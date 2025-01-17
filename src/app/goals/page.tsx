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

export default function GoalsPage() {
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
      const updatedGoals = [newGoal, ...goals];
      setGoals(updatedGoals);
      localStorage.setItem("goals", JSON.stringify(updatedGoals));
    }
  };

  const calculateCompletionPercentage = (tasks: Task[]) => {
    if (tasks.length === 0) return 0;
    const completedTasks = tasks.filter((task) => task.completed).length;
    return Math.round((completedTasks / tasks.length) * 100);
  };

  const drawStars = (canvas: HTMLCanvasElement, goal: Goal) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const completionPercentage = calculateCompletionPercentage(goal.tasks);
    const brightness = completionPercentage / 100;
    const x = canvas.width / 2;
    const y = canvas.height / 2;

    // Draw goal star
    drawStar(ctx, x, y, 10, brightness);

    // Draw task stars
    goal.tasks.forEach((task, taskIndex) => {
      const angle = (taskIndex / goal.tasks.length) * 2 * Math.PI;
      const taskX = x + 50 * Math.cos(angle);
      const taskY = y + 50 * Math.sin(angle);
      drawStar(ctx, taskX, taskY, 5, task.completed ? 1 : 0.2);
    });
  };

  const drawStar = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number,
    brightness: number
  ) => {
    ctx.beginPath();
    const spikes = 5;
    const outerRadius = radius;
    const innerRadius = radius / 2;
    let rot = (Math.PI / 2) * 3;
    let step = Math.PI / spikes;

    ctx.moveTo(x, y - outerRadius);
    for (let i = 0; i < spikes; i++) {
      ctx.lineTo(
        x + Math.cos(rot) * outerRadius,
        y - Math.sin(rot) * outerRadius
      );
      rot += step;
      ctx.lineTo(
        x + Math.cos(rot) * innerRadius,
        y - Math.sin(rot) * innerRadius
      );
      rot += step;
    }
    ctx.lineTo(x, y - outerRadius);
    ctx.closePath();
    ctx.fillStyle = `rgba(255, 255, 0, ${Math.max(brightness, 0.1)})`;
    ctx.fill();
  };

  return (
    <section className="w-full h-min-screen bg-gray-100 p-5">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-7xl font-bold text-gray-800 mb-5 text-center">
          My Constellations
        </h1>
        <button
          className="bg-blue-500 text-black px-4 py-2 rounded-md mb-4"
          onClick={handleAddGoal}
        >
          Add Goal
        </button>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {goals.map((goal) => (
            <div
              key={goal.id}
              className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col"
            >
              <canvas
                ref={(canvas) => {
                  if (canvas) drawStars(canvas, goal);
                }}
                width={200}
                height={200}
                className="w-full h-60 h-min-60 bg-black object-cover"
              ></canvas>
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  {goal.name}
                </h2>
                <p className="text-gray-600 mt-2">
                  {calculateCompletionPercentage(goal.tasks)}% of tasks
                  completed
                </p>
              </div>
              <div className="p-4">
                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
                  <Link href={`/goal/${goal.id}`}>Update/Add Tasks</Link>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
