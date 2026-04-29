import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Plus,
  CheckCircle2,
  Circle,
  Trash2,
  Calendar,
  User,
  AlertCircle,
  Filter,
  Edit,
} from 'lucide-react';
import AddTaskForm from '../components/AddTaskForm';
import { apiFetch } from '../utils/apiFetch';
import { useNavigate, useParams,Link } from 'react-router-dom';
import { toast } from 'react-toastify';

function Tasks() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [project, setProject] = useState([])

  // Fetch tasks by projectId
  const fetchTasks = async () => {
    try {
      const res = await apiFetch(`/tasks/${projectId}`);
      if (!res.ok) throw new Error("Failed to fetch tasks");
      const data = await res.json();
      setTasks(data);
      console.log(data)
    } catch (err) {
      console.error(err.message);
    }
  };

  // Fetch single project (optional for name display)
  const fetchProject = async () => {
    try {
      const res = await apiFetch(`/projects/${projectId}`);
      if (!res.ok) throw new Error("Failed to fetch project");
      const data = await res.json();
      setProject(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchProject();
  }, [projectId]);

  /* Stats */
  const total = tasks.length;
  const completed = tasks.filter(
    (t) => t.status === "Completed"
  ).length;
  const percentage = total ? Math.round((completed / total) * 100) : 0;


  // Create task
 const handleAddTask = async (taskData) => {
  const res = await apiFetch("/tasks", {
    method: "POST",
    body: JSON.stringify({ ...taskData, projectId }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message);
  }

  setTasks((prev) => [...prev, data]);
  setShowForm(false);

  toast.success("Task added successfully"); 
};

  // Update task
  const handleEditTask = async (id, updatedTask) => {
  const res = await apiFetch(`/tasks/${id}`, {
    method: "PUT",
    body: JSON.stringify(updatedTask),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message); 
  }

  setTasks((prev) =>
    prev.map((t) => (t._id === id ? data : t))
  );

  setEditTask(null);
  setShowForm(false);

  toast.success("Task updated successfully"); 
};

  // ✅ Delete task
  const handleDeleteTask = async (id) => {
    try {
      const res = await apiFetch(`/tasks/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errData = await res.json();

        if (res.status === 403) {
          toast.error(errData.message || "You don’t have access to delete this task");
        } else {
          toast.error(errData.message || "Failed to delete task");
        }

        return;
      }

      toast.success("Task deleted");

      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.error(err.message);
    }
  };

  const toggleComplete = async (task) => {
    const newStatus =
      task.status === "Completed" ? "Todo" : "Completed";
    await handleEditTask(task._id, {
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate,
      assignedTo: task.assignedTo?._id || task.assignedTo,
      projectId: task.projectId?._id || task.projectId,
      status: newStatus,
    });
  };

  /* ======================= */
  /* Filtering */

  const filteredTasks = tasks.filter((task) => {
    const statusOk =
      filterStatus === "All" || task.status === filterStatus;
    const priorityOk =
      filterPriority === "All" ||
      task.priority === filterPriority;
    return statusOk && priorityOk;
  });


  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-700 border-red-200';
      case 'Medium': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'In Progress': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Todo': return 'bg-slate-100 text-slate-700 border-slate-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link to={'/projects'}>
          <button className="flex items-center gap-2 text-slate-600 mb-4 cursor-pointer">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Projects</span>
          </button>
          </Link>

          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-semibold text-slate-900 mb-2">
                {project?.name}
              </h1>
              <p className="text-slate-600">
                {project?.description}
              </p>
            </div>

            <button
              onClick={() => { setShowForm(true); setEditTask(null); }}
              className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Task
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Task Progress</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Total Tasks */}
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <AlertCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Total Tasks</p>
                <p className="text-2xl font-semibold text-slate-900">{total}</p>
              </div>
            </div>

            {/* Completed Tasks */}
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Completed</p>
                <p className="text-2xl font-semibold text-slate-900">{completed}</p>
              </div>
            </div>

            {/* Progress Percentage */}
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{percentage}%</div>
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-600">Progress</p>
                <div className="w-full bg-slate-200 rounded-full h-2.5 mt-1">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${percentage === 100
                      ? 'bg-green-500'
                      : percentage >= 50
                        ? 'bg-blue-500'
                        : 'bg-amber-500'
                      }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add/Edit Task Form Modal */}
        {showForm && (
          <div className="mb-8">
            <AddTaskForm
              onAddTask={handleAddTask}
              onEditTask={handleEditTask}
              editTask={editTask}
              onCancel={() => { setShowForm(false); setEditTask(null); }}
            />
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
  
  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
    
    {/* Label */}
    <div className="flex items-center gap-2">
      <Filter className="w-5 h-5 text-slate-600" />
      <span className="font-medium text-slate-700">Filter by:</span>
    </div>

    {/* Status */}
    <select
      value={filterStatus}
      onChange={(e) => setFilterStatus(e.target.value)}
      className="w-full sm:w-auto px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
    >
      <option value="All">All Statuses</option>
      <option value="Todo">Todo</option>
      <option value="In Progress">In Progress</option>
      <option value="Completed">Completed</option>
    </select>

    {/* Priority */}
    <select
      value={filterPriority}
      onChange={(e) => setFilterPriority(e.target.value)}
      className="w-full sm:w-auto px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
    >
      <option value="All">All Priorities</option>
      <option value="High">High</option>
      <option value="Medium">Medium</option>
      <option value="Low">Low</option>
    </select>

    {/* Clear */}
    {(filterStatus !== 'All' || filterPriority !== 'All') && (
      <button
        onClick={() => {
          setFilterStatus('All');
          setFilterPriority('All');
        }}
        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
      >
        Clear Filters
      </button>
    )}
    
  </div>
</div>

        {/* Task List */}
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <div className="bg-white p-10 text-center rounded-xl border border-slate-200">
              <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600">No tasks found</p>
            </div>
          ) : (
            filteredTasks.map(task => (
            <div
  key={task._id}
  className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 flex flex-col gap-4 shadow-sm"
>
  <div className="flex items-start gap-3">
    
    {/* Checkbox */}
    <button onClick={() => toggleComplete(task)} className="mt-1">
      {task.status === "Completed" ? (
        <CheckCircle2 className="text-green-600 w-5 h-5" />
      ) : (
        <Circle className="text-slate-400 w-5 h-5" />
      )}
    </button>

    {/* ✅ Content shifted right */}
    <div className="flex-1">

      {/* Title Row */}
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <h3
          className={`font-semibold text-sm sm:text-base ${
            task.status === "Completed"
              ? "line-through text-slate-400"
              : ""
          }`}
        >
          {task.title}
        </h3>

        <span className={`font-semibold px-2 sm:px-3 py-1 text-xs rounded-full border ${getStatusColor(task.status)}`}>
          {task.status}
        </span>

        <span className={`font-semibold px-2 sm:px-3 py-1 text-xs rounded-full border ${getPriorityColor(task.priority)}`}>
          {task.priority} Priority
        </span>
      </div>

      {/* Description */}
      {task.description && (
        <p
          className={`text-xs sm:text-sm mt-1 ${
            task.completed ? "text-slate-400" : "text-slate-600"
          }`}
        >
          {task.description}
        </p>
      )}

      {/* Meta + Actions */}
      <div className="flex items-center justify-between gap-3 text-sm mt-3 text-slate-600">
        
        {/* Left */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          
          {task.dueDate && (
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(task.dueDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          )}

          {task.assignedTo?.length > 0 && (
            <span className="flex items-center gap-2 bg-slate-100 px-2 sm:px-3 py-1.5 rounded-md">
              <User className="w-4 h-4 text-slate-500" />
              <span className="truncate max-w-[120px] sm:max-w-none">
                {task.assignedTo.map((user, index) => (
                  <span key={user._id}>
                    {user.name}
                    {index < task.assignedTo.length - 1 && ", "}
                  </span>
                ))}
              </span>
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => {
              setEditTask(task);
              setShowForm(true);
            }}
          >
            <Edit className="text-purple-600 w-5 h-5" />
          </button>

          <button onClick={() => handleDeleteTask(task._id)}>
            <Trash2 className="text-red-600 w-5 h-5" />
          </button>
        </div>

      </div>
    </div>
  </div>
</div>
            ))
          )}
        </div>
      </main>

    </div>
  );
}

export default Tasks;