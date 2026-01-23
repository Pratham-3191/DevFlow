import React from 'react';
import {
  Users,
  CheckCircle2,
  Clock,
  Trash2
} from 'lucide-react';
import Card from '../components/ui/Card';

function Projects() {
  const project = {
    name: 'Website Redesign',
    description: 'Complete overhaul of company website with new branding',
    members: ['John Doe', 'Jane Smith', 'Mike Johnson'],
    color: 'from-blue-600 to-blue-400',
    progress: 60,
    completedTasks: 7,
    totalTasks: 12,
    createdAt: '15/01/2024',
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-md">
        <Card className="p-6 hover:shadow-lg transition-shadow relative">
          {/* Header */}
          <div
            className={`w-12 h-12 rounded-xl bg-linear-to-br ${project.color} mb-4 flex items-center justify-center text-white`}
          >
            {project.name.charAt(0)}
          </div>

          <h3 className="text-gray-900 mb-2">{project.name}</h3>
          <p className="text-gray-600 mb-4">{project.description}</p>

          {/* Progress */}
          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Progress</span>
              <span className="text-gray-900">{project.progress}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full bg-linear-to-r ${project.color}`}
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 mb-4 text-gray-600">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{project.completedTasks}/{project.totalTasks} tasks</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>{project.members.length}</span>
            </div>
          </div>

          {/* Members */}
          <div className="flex -space-x-2 mb-4">
            {project.members.map((member, idx) => (
              <div
                key={idx}
                className="w-8 h-8 rounded-full bg-linear-to-br from-blue-600 to-purple-600 border-2 border-white flex items-center justify-center text-white text-xs"
                title={member}
              >
                {member.split(' ').map(n => n[0]).join('')}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between text-gray-600">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{project.createdAt}</span>
            </div>

            <button className="p-2 rounded-lg hover:bg-gray-100">
              <Trash2 className="w-4 h-4 text-red-600" />
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Projects;
