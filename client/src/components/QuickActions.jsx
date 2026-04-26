import React from "react";
import Card from "./ui/Card";
import { Link } from "react-router-dom";

function QuickActions() {
  return (
    <Card className="p-6">
      <h3 className="text-gray-900 mb-6">Quick Actions</h3>
      <div className="space-y-3">
        <Link
          to="/projects"
          className="w-full block px-4 py-3 rounded-lg bg-linear-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all shadow-md text-center"
        >
          View Projects
        </Link>

        <Link
          to="/profile"
          className="w-full block px-4 py-3 rounded-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors text-center"
        >
          View Profile
        </Link>

        {/* <button className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">
          Invite Team Member
        </button> */}
      </div>
    </Card>
  );
}

export default QuickActions;
