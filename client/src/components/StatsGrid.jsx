import React from "react";
import Card from "./ui/Card";

function StatsGrid() {
  const stats = [
    { label: "Total Projects", value: "4", icon: () => null, color: "from-blue-600 to-blue-500", change: "+2" },
    { label: "Active Tasks", value: "19", icon: () => null, color: "from-purple-600 to-purple-500", change: "+5%" },
    { label: "Completed", value: "30", icon: () => null, color: "from-green-600 to-green-500", change: "+8%" },
    { label: "Team Members", value: "12", icon: () => null, color: "from-orange-600 to-orange-500", change: "+2" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} hover className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white`}>
                <Icon className="w-6 h-6" />
              </div>
              <span className="px-2 py-1 rounded-full bg-green-100 text-green-700">{stat.change}</span>
            </div>
            <div className="text-gray-600 mb-1">{stat.label}</div>
            <div className="text-gray-900">{stat.value}</div>
          </Card>
        );
      })}
    </div>
  );
}

export default StatsGrid;
