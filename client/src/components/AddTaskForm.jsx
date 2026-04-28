import { useState, useEffect } from 'react';
import { Plus, X, Edit } from 'lucide-react';
import { apiFetch } from '../utils/apiFetch';
import { toast } from 'react-toastify';
import { useAuthStore } from '../store/authStore';

export default function AddTaskForm({ onAddTask, onCancel, editTask, onEditTask }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Todo');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');

  const [assignedMember, setAssignedMember] = useState([]);
  const currentUser = useAuthStore((state) => state.user);

  // user search states
  const [email, setEmail] = useState('');
  const [foundUsers, setFoundUsers] = useState([]);
  const [loadingUser, setLoadingUser] = useState(false);
  const [error, setError] = useState('');

  const isEditMode = !!editTask;
  useEffect(() => {
    console.log("Updated foundUsers:", foundUsers);
  }, [foundUsers]);

  useEffect(() => {
    console.log(editTask)
    if (editTask) {
      setTitle(editTask.title || '');
      setDescription(editTask.description || '');
      setStatus(editTask.status || 'Todo');
      setPriority(editTask.priority || 'Medium');

      setDueDate(
        editTask.dueDate
          ? new Date(editTask.dueDate).toISOString().split("T")[0]
          : ''
      );

      // ✅ HANDLE MULTIPLE USERS (important)
      if (editTask.assignedTo && Array.isArray(editTask.assignedTo)) {
        setAssignedMember(editTask.assignedTo.map(u => u._id));
        setFoundUsers(editTask.assignedTo);
      } else {
        setAssignedMember([]);
        setFoundUsers([]);
      }

    } else {
      // reset
      setTitle('');
      setDescription('');
      setStatus('Todo');
      setPriority('Medium');
      setDueDate('');
      setAssignedMember([]);
      setEmail('');
      setFoundUsers([]);
      setError('');
    }
  }, [editTask]);

  // 🔍 Find user by email
  const handleFindUser = async () => {
  if (!email.trim()) {
    toast.warning("Please enter an email");
    return;
  }

  try {
    setLoadingUser(true);
    setError('');

    const res = await apiFetch(`/user/find-by-email?email=${email}`);
    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    const user = data?.user;

    if (!user) {
      throw new Error("User not found");
    }

    // 🚫 Prevent adding yourself (frontend check)
   // 🚫 Prevent adding yourself (robust check)
if (
  currentUser &&
  (user._id === currentUser._id ||
   user.email.toLowerCase() === currentUser.email.toLowerCase())
) {
  toast.warning("You can't add yourself");
  return;
}

    // 🚫 Prevent duplicates
    const alreadyExists = foundUsers.some(u => u._id === user._id);

    if (alreadyExists) {
      toast.info("User already added");
      return;
    }

    setFoundUsers(prev => [...prev, user]);
    setAssignedMember(prev => [...prev, user._id]);

    toast.success(`${user.name} added`);
    setEmail('');

  } catch (err) {
    toast.error(err.message || "Failed to find user");
  } finally {
    setLoadingUser(false);
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.warning('Please enter a task title');
      return;
    }

    const taskData = {
      title,
      description,
      status,
      priority,
      dueDate,
      assignedMember,
      completed: status === 'Completed',
    };

    try {
      if (isEditMode && editTask && onEditTask) {
        await onEditTask(editTask._id, taskData);
        toast.success("Task updated successfully");
      } else {
        await onAddTask(taskData);
        toast.success("Task added successfully");
      }

      // reset
      setTitle('');
      setDescription('');
      setStatus('Todo');
      setPriority('Medium');
      setDueDate('');
      setAssignedMember([]);
      setEmail('');
      setFoundUsers([]);
      setError('');

    } catch (err) {
      toast.error(err.message || "Something went wrong");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
      <div className={`bg-gradient-to-r ${isEditMode ? 'from-purple-600 to-purple-700' : 'from-blue-600 to-blue-700'} px-6 py-4 flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg">
            {isEditMode ? <Edit className="w-5 h-5 text-white" /> : <Plus className="w-5 h-5 text-white" />}
          </div>
          <h3 className="text-xl font-semibold text-white">
            {isEditMode ? 'Edit Task' : 'Add New Task'}
          </h3>
        </div>
        <button onClick={onCancel} className="p-2 hover:bg-white/20 rounded-lg">
          <X className="w-5 h-5 text-white" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-5">

  {/* Title */}
  <div>
    <label className="block text-sm font-medium mb-1">Task Title</label>
    <input
      type="text"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      placeholder="Enter task title"
      className="w-full px-4 py-2 border rounded-lg"
      required
    />
  </div>

  {/* Description */}
  <div>
    <label className="block text-sm font-medium mb-1">Description</label>
    <textarea
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      rows={3}
      placeholder="Enter task description"
      className="w-full px-4 py-2 border rounded-lg"
    />
  </div>

  {/* Status & Priority */}
  <div className="grid grid-cols-2 gap-4">
    
    <div>
      <label className="block text-sm font-medium mb-1">Status</label>
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="w-full p-2 border rounded"
      >
        <option>Todo</option>
        <option>In Progress</option>
        <option>Completed</option>
      </select>
    </div>

    <div>
      <label className="block text-sm font-medium mb-1">Priority</label>
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className="w-full p-2 border rounded"
      >
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
      </select>
    </div>

  </div>

  {/* Due Date */}
  <div>
    <label className="block text-sm font-medium mb-1">Due Date</label>
    <input
      type="date"
      value={dueDate}
      onChange={(e) => setDueDate(e.target.value)}
      className="w-full p-2 border rounded"
    />
  </div>

  {/* Assign Users */}
  <div>
    <label className="block text-sm font-medium mb-2">Assign Members</label>

    <div className="flex gap-2">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter user email"
        className="w-full px-4 py-2 border rounded truncate"
      />
      <button
        type="button"
        onClick={handleFindUser}
        className="px-4 bg-blue-600 text-white rounded"
      >
        Search
      </button>
    </div>

    {loadingUser && <p className="text-sm mt-1">Searching...</p>}
    {error && <p className="text-sm text-red-500 mt-1">{error}</p>}

    {/* Users List */}
    {foundUsers.length > 0 && (
      <div className="mt-3 space-y-2">
        {foundUsers.map(user => (
          <div
            key={user._id}
            className="flex justify-between items-center p-2 bg-green-50 border rounded"
          >
            <p className="text-sm truncate">
              <strong>{user.name}</strong> ({user.email})
            </p>

            <button
              type="button"
              onClick={() => {
                setFoundUsers(prev => prev.filter(u => u._id !== user._id));
                setAssignedMember(prev => prev.filter(id => id !== user._id));
                toast.info("User removed");
              }}
              className="text-red-500 text-sm"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    )}
  </div>

  {/* Buttons */}
  <div className="flex gap-3">
    <button
      type="submit"
      className="flex-1 bg-blue-600 text-white py-2 rounded"
    >
      {isEditMode ? 'Update Task' : 'Add Task'}
    </button>

    <button
      type="button"
      onClick={onCancel}
      className="px-4 bg-gray-200 rounded"
    >
      Cancel
    </button>
  </div>

</form>
    </div>
  );
}