import { useState } from 'react';
import { Users, CheckCircle2, Clock, Trash2 } from 'lucide-react';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import { useAuthStore } from '../store/authStore';
import { apiFetch } from '../utils/apiFetch';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

export default function ProjectCard({ project, onDelete }) {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredProjectMembers = project.members.filter(
    (member) => member._id != project.createdBy
  );

  const getInitials = (name = "") => {
    return name
      .trim()
      .split(" ")
      .filter(Boolean)
      .map(word => word[0]?.toUpperCase())
      .slice(0, 2)
      .join("");
  };

  const date = new Date(project.createdAt);
  const formatted = `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${date.getFullYear()}`;

  // DELETE API CALL
  const handleDeleteProject = async () => {
    try {
      setIsDeleting(true);

      const res = await apiFetch(`/projects/${project._id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      toast.success(data.message || "Project deleted successfully");

      if (onDelete) {
        onDelete(project._id);
      }

      setIsDeleteModalOpen(false);

    } catch (err) {
      toast.error(err.message || "Failed to delete project");
    } finally {
      setIsDeleting(false);
    }
  };

  //  Navigation handler 
  const handleNavigate = () => {
    if (isDeleteModalOpen) return; 
    navigate(`/projects/${project._id}`);
  };

  return (
    <>
      <Card
        className="h-full flex flex-col p-6 hover:shadow-lg transition-shadow cursor-pointer group relative"
        onClick={handleNavigate}
      >

        {/* Header */}
        <div className={`w-12 h-12 rounded-xl bg-linear-to-br ${project.color} mb-4 flex items-center justify-center text-white`}>
          {project.name.charAt(0)}
        </div>

        <h3 className="text-gray-900 mb-2">{project.name}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">
          {project.description}
        </p>

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
        <div className="flex gap-4 mb-4 text-gray-600">
          <div className="flex gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{project.CompletedTasks}/{project.totaltasks}</span>
          </div>

          <div className="flex gap-2">
            <Users className="w-4 h-4" />
            <span>{filteredProjectMembers.length}</span>
          </div>
        </div>

        {/* Members */}
        <div className="mb-4 min-h-[40px] flex items-center">
          {filteredProjectMembers.length > 0 ? (
            <div className="flex -space-x-2">
              {filteredProjectMembers.slice(0, 3).map((member, idx) => (
                <div
                  key={idx}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 border-2 border-white flex items-center justify-center text-white text-xs"
                >
                  {getInitials(member.name)}
                </div>
              ))}
            </div>
          ) : (
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
              No members
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between mt-auto">
          <div className="flex gap-2 text-gray-600">
            <Clock className="w-4 h-4" />
            <span>{formatted}</span>
          </div>

          {/* DELETE BUTTON */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation(); // ✅ stop navigation
              setIsDeleteModalOpen(true);
            }}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>
      </Card>

      {/* 🔥 DELETE CONFIRM MODAL */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={(e) => {
          e?.stopPropagation?.(); // extra safety
          setIsDeleteModalOpen(false);
        }}
        title="Delete Project"
        footer={
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                setIsDeleteModalOpen(false);
              }}
            >
              Cancel
            </Button>

            <Button
              variant="danger"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteProject();
              }}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        }
      >
        <div className="space-y-3">
          <p className="text-red-600 font-semibold">
            ⚠️ This action cannot be undone
          </p>

          <p className="text-gray-700">
            This will permanently delete:
          </p>

          <ul className="list-disc list-inside text-gray-600">
            <li>The project</li>
            <li>All tasks inside it</li>
            <li>All member associations</li>
          </ul>

          <p className="text-gray-700">
            Are you sure you want to continue?
          </p>
        </div>
      </Modal>
    </>
  );
}