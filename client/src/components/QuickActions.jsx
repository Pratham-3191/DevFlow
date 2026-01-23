import React from "react";
import Card from "./ui/Card";

function QuickActions() {
  return (
    <Card className="p-6">
      <h3 className="text-gray-900 mb-6">Quick Actions</h3>
      <div className="space-y-3">
        <button className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg" onClick={() => onNavigate("projects")}>
          View Projects
        </button>
        <button className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors" onClick={() => onNavigate("profile")}>
          View Profile
        </button>
        <button className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">
          Invite Team Member
        </button>
      </div>
    </Card>
  );
}

export default QuickActions;
