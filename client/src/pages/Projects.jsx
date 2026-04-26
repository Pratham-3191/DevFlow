import React, { useState, useEffect } from 'react';
import { Plus, Users, CheckCircle2, Clock, Trash2 } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import ProjectCard from '../components/ProjectCard';
import { apiFetch } from '../utils/apiFetch';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

// Projects UI Component
export default function Projects() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    members: '',
  });

  // const handleCreateProject = () => {
  //   if (!newProject.name.trim()) return;

  //   const project = {
  //     id: Date.now().toString(),
  //     name: newProject.name,
  //     description: newProject.description,
  //     members: newProject.members
  //       .split(',')
  //       .map((m) => m.trim())
  //       .filter(Boolean),
  //     progress: 0,
  //     completedTasks: 0,
  //     totalTasks: 0,
  //     createdAt: new Date().toLocaleDateString(),
  //   };

  //   setProjects((prev) => [...prev, project]);
  //   setNewProject({ name: '', description: '', members: '' });
  //   setIsCreateModalOpen(false);
  // };

  const [projects, setProjects] = useState([])

  const colors = [
    'from-blue-600 to-blue-400',
    'from-purple-600 to-purple-400',
    'from-green-600 to-green-400',
    'from-orange-600 to-orange-400',
  ];
  const fetchProjects = async () => {
    try {
      const res = await apiFetch("/projects");
      if (!res.ok) throw new Error("Failed to fetch projects");
      const data = await res.json();
      setProjects(data);
      console.log(data)
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const getTotal = (projects = [], key) => {
    return projects.reduce((total, project) => {
      return total + (project[key] || 0);
    }, 0);
  };

  const getTotalMembers = (projects = []) => {
    return projects.reduce((total, project) => {
      const membersWithoutOwner = project.members?.filter(
        (m) => m._id !== project.createdBy
      ) || [];

      return total + membersWithoutOwner.length;
    }, 0);
  };


  const handleCreateProject = async () => {
    if (!newProject.name.trim()) {
      toast.warning("Project name is required");
      return;
    }

    try {
      const res = await apiFetch("/projects", {
        method: "POST",
        body: JSON.stringify({
          name: newProject.name,
          description: newProject.description,
          members: newProject.members
            .split(",")
            .map((m) => m.trim())
            .filter(Boolean),
        }),
      });

      if (!res.ok) throw new Error("Failed to create project");
      toast.success("Project created successfully");

      const data = await res.json();
      setProjects((prev) => [...prev, data]);
      setNewProject({ name: "", description: "", members: "" });
      setIsCreateModalOpen(false);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = (id) => {
    setProjects(prev => prev.filter(project => project._id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50">

      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-gray-900 text-2xl font-semibold mb-2">Projects</h1>
            <p className="text-gray-600">Manage your projects and track progress</p>
          </div>
          <div className="flex items-center gap-3">
            {/* <div className="flex items-center gap-2 bg-white rounded-lg p-1 border border-gray-200">
              <button className="px-3 py-1.5 rounded bg-gray-100 text-gray-900">Grid</button>
              <button className="px-3 py-1.5 rounded text-gray-600">List</button>
            </div> */}
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="w-4 h-4" />
              Create Project
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <div className="text-gray-600 mb-1">Total Projects</div>
            <div className="text-gray-900">{projects.length}</div>
          </Card>
          <Card className="p-6">
            <div className="text-gray-600 mb-1">Active Tasks</div>
            <div className="text-gray-900">{getTotal(projects, 'activeTasks')}</div>
          </Card>
          <Card className="p-6">
            <div className="text-gray-600 mb-1">Completed Tasks</div>
            <div className="text-gray-900">{getTotal(projects, 'CompletedTasks')}</div>
          </Card>
          <Card className="p-6">
            <div className="text-gray-600 mb-1">Team Members</div>
            <div className="text-gray-900">{getTotalMembers(projects, 'members')}</div>
          </Card>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <ProjectCard
              key={project._id}
              project={{ ...project, color: colors[index % colors.length] }}
              onDelete={handleDelete}
            />
          ))}
        </div>

        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => {
            setIsCreateModalOpen(false);
            setNewProject({ name: '', description: '', members: '' });
          }}
          title="Create New Project"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Project Name</label>
              <Input
                type="text"
                placeholder="Enter project name"
                value={newProject.name}
                onChange={(e) =>
                  setNewProject({ ...newProject, name: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Description</label>
              <textarea
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Enter project description"
                value={newProject.description}
                onChange={(e) =>
                  setNewProject({ ...newProject, description: e.target.value })
                }
              />
            </div>

            {/* <div>
              <label className="block text-gray-700 mb-2">Team Members</label>
              <Input
                type="text"
                placeholder="John Doe, Jane Smith"
                value={newProject.members}
                onChange={(e) =>
                  setNewProject({ ...newProject, members: e.target.value })
                }
              />
            </div> */}

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="secondary"
                onClick={() => setIsCreateModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateProject}
                disabled={!newProject.name.trim()}
              >
                Create Project
              </Button>
            </div>
          </div>
        </Modal>

      </main>
    </div>
  );
}
