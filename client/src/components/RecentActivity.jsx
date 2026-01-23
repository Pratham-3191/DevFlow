import React from "react";
import Card from "./ui/Card";

function RecentActivity() {
  const recentActivities = [
    { id: 1, action: 'Task "Update UI Components" completed', time: '2 hours ago', user: 'John Doe' },
    { id: 2, action: 'New member joined the team', time: '4 hours ago', user: 'Sarah Smith' },
    { id: 3, action: 'Project milestone achieved', time: '1 day ago', user: 'Team' },
    { id: 4, action: 'Code review completed', time: '2 days ago', user: 'Mike Johnson' },
  ];

  return (
    <Card className="lg:col-span-2 p-6">
      <h3 className="text-gray-900 mb-6">Recent Activity</h3>
      <div className="space-y-4">
        {recentActivities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0">
            <div className="w-2 h-2 rounded-full bg-blue-600 mt-2" />
            <div className="flex-1">
              <p className="text-gray-900">{activity.action}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-gray-600">{activity.user}</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-500">{activity.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default RecentActivity;
