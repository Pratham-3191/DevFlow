import React from "react";
import StatsGrid from "../components/StatsGrid";
import RecentActivity from "../components/RecentActivity";
import QuickActions from "../components/QuickActions";
import ProgressChart from "../components/ProgressChart";
import { useAuthStore } from "../store/authStore";

function Dashboard() {
  const user = useAuthStore((state)=> state.user)
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto p-4 lg:p-8 space-y-8">
        <div className="space-y-2">
          <h2 className="text-gray-900">Welcome back, {user.name}! 👋</h2>
          <p className="text-gray-600">
            Here's what's happening with your projects today.
          </p>
        </div>

        <StatsGrid />

        <div className="grid lg:grid-cols-3 gap-6">
          <RecentActivity />
          <QuickActions />
        </div>

        {/* <ProgressChart /> */}
      </main>
    </div>
  );
}

export default Dashboard;
