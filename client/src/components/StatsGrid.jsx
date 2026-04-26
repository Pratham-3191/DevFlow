import React, { useEffect, useState } from "react";
import Card from "./ui/Card";
import { apiFetch } from "../utils/apiFetch";

function StatsGrid() {
  const [projects, setProjects] = useState([]);

  // ✅ Fetch projects
  const fetchProjects = async () => {
    try {
      const res = await apiFetch("/projects");
      if (!res.ok) throw new Error("Failed to fetch projects");

      const data = await res.json();
      setProjects(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // ✅ Generic total function
  const getTotal = (arr = [], key) =>
    arr.reduce((sum, item) => sum + (item[key] || 0), 0);

  // ✅ Total members excluding owner
  const getTotalMembers = (projects = []) => {
    return projects.reduce((total, project) => {
      const ownerId =
        typeof project.createdBy === "object"
          ? project.createdBy._id
          : project.createdBy;

      const membersWithoutOwner =
        project.members?.filter((m) => m._id !== ownerId) || [];

      return total + membersWithoutOwner.length;
    }, 0);
  };

  // ✅ Derived stats
  const totalProjects = projects.length;
  const activeTasks = getTotal(projects, "activeTasks");
  const completedTasks = getTotal(projects, "completedTasks");
  const totalMembers = getTotalMembers(projects);

  const stats = [
    {
      label: "Total Projects",
      value: totalProjects,
      color: "from-blue-600 to-blue-500",
    },
    {
      label: "Active Tasks",
      value: activeTasks,
      color: "from-purple-600 to-purple-500",
    },
    {
      label: "Completed",
      value: completedTasks,
      color: "from-green-600 to-green-500",
    },
    {
      label: "Team Members",
      value: totalMembers,
      color: "from-orange-600 to-orange-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color}`}
            />
          </div>

          <div className="text-gray-600 mb-1">{stat.label}</div>
          <div className="text-gray-900 text-2xl font-semibold">
            {stat.value}
          </div>
        </Card>
      ))}
    </div>
  );
}

export default StatsGrid;