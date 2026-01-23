import React from "react";
import Card from "./ui/Card";

function ProgressChart() {
  const projects = [
    { name: 'Frontend Development', progress: 85, color: 'bg-blue-600' },
    { name: 'Backend API', progress: 60, color: 'bg-purple-600' },
    { name: 'Testing & QA', progress: 40, color: 'bg-green-600' },
    { name: 'Documentation', progress: 70, color: 'bg-orange-600' },
  ];

  return (
    <Card className="p-6">
      <h3 className="text-gray-900 mb-6">Project Progress</h3>
      <div className="space-y-4">
        {projects.map((project, index) => (
          <div key={index}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-700">{project.name}</span>
              <span className="text-gray-600">{project.progress}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className={`h-full ${project.color} rounded-full transition-all duration-300`} style={{ width: `${project.progress}%` }} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default ProgressChart;
