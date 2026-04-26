import React, { useEffect, useState } from "react";
import Card from "./ui/Card";
import { apiFetch } from "../utils/apiFetch";

function RecentActivity() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const res = await apiFetch("/tasks/activity");
      const data = await res.json();
      setActivities(data);
      console.log(data)
    } catch (err) {
      console.error(err);
    }
  };

  const formatTime = (date) => {
  const diff = Date.now() - new Date(date).getTime();

  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return "Just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes === 1) return "1 minute ago";
  if (minutes < 60) return `${minutes} minutes ago`;

  const hours = Math.floor(minutes / 60);
  if (hours === 1) return "1 hour ago";
  if (hours < 24) return `${hours} hours ago`;

  const days = Math.floor(hours / 24);
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
};

  return (
    <Card className="lg:col-span-2 p-6">
      <h3 className="text-gray-900 mb-6">Recent Activity</h3>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0">
            <div className="w-2 h-2 rounded-full bg-blue-600 mt-2" />

            <div className="flex-1">
              <p className="text-gray-900">{activity.action}</p>

              <div className="flex items-center gap-2 mt-1">
                <span className="text-gray-600">{activity.user}</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-500">
                  {formatTime(activity.time)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default RecentActivity;