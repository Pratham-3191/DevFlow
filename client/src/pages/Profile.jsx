import Modal from "../components/ui/Modal";
import Input from '../components/ui/Input'
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { Mail, User, MapPin, Phone, Edit } from "lucide-react";
import { apiFetch } from "../utils/apiFetch";
import { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import { toast } from 'react-toastify';

function Profile() {
  const accessToken = useAuthStore((state) => state.accessToken)
  const updateUser = useAuthStore((state) => state.updateUser)
  const user = useAuthStore((state) => state.user)

  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [userData, setUserData] = useState({});
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({});

  useEffect(() => {
    fetchProfile();
    fetchProjectsAndTasks();
  }, [accessToken]);

  const fetchProfile = async () => {
  try {
    const res = await apiFetch(`/user/profile`, accessToken);
    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    setUserData(data.user);
    setEditFormData(data.user);

  } catch (err) {
    toast.error("Failed to load profile"); 
  }
};


const fetchProjectsAndTasks = async () => {
  try {
    const projRes = await apiFetch("/projects");
    const projData = await projRes.json();

    if (!projRes.ok) throw new Error("Failed to fetch projects");

    setProjects(projData);

    const allTasks = [];

    for (let proj of projData) {
      const res = await apiFetch(`/tasks/${proj._id}`);
      const data = await res.json();
      allTasks.push(...data);
    }

    setTasks(allTasks);

  } catch (err) {
    toast.error("Failed to load activity data"); 
  }
};

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    t => t.status === "Completed"
  ).length;

  const completionRate = totalTasks
    ? Math.round((completedTasks / totalTasks) * 100)
    : 0;

  const totalProjects = projects.length;

  const hoursLogged = 0;

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

 const handleSaveProfile = async () => {
  try {
    const res = await apiFetch(`/user/profile`, {
      method: "PUT",
      body: JSON.stringify(editFormData),
    });

    const updated = await res.json();

    if (!res.ok) throw new Error(updated.message);

    setUserData(updated.user);
    updateUser(updated.user);

    toast.success("Profile updated successfully "); 

    setIsEditModalOpen(false);

  } catch (err) {
    toast.error(err.message || "Failed to update profile "); 
  }
};

  const handleCancelEdit = () => {
    setEditFormData(userData);
    setIsEditModalOpen(false);
  };

  const handleDeleteAccount = async () => {
  try {
    setIsDeleting(true);

    const res = await apiFetch("/user/profile", {
      method: "DELETE",
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message);
    }

    toast.success("Account deleted successfully"); 

    setTimeout(() => {
      window.location.href = "/";
    }, 1500); 

  } catch (err) {
    toast.error(err.message || "Failed to delete account"); 
  } finally {
    setIsDeleting(false);
    setIsDeleteModalOpen(false);
  }
};

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-4xl mx-auto p-4 lg:p-8">
        <div className="space-y-6">

          {/* Profile Header */}
          <Card className="p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-linear-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white shrink-0">
                <span className="text-3xl">{user.name?.charAt(0).toUpperCase()}{user.name?.split(" ")[1]?.charAt(0).toUpperCase()}</span>
              </div>

              <div className="flex-1 space-y-2">
                <h2 className="text-gray-900">{user.name}</h2>
                <p className="text-gray-600">{user.bio || "__"}</p>

                <div className="flex flex-wrap gap-4 pt-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{user.location || "India"}</span>
                  </div>
                </div>
              </div>

              <Button onClick={() => setIsEditModalOpen(true)}>
                <Edit className="w-4 h-4" />
                Edit Profile
              </Button>
            </div>
          </Card>


          {/* Personal Information */}
          <Card className="p-8">
            <h3 className="text-gray-900 mb-6">Personal Information</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-2 text-gray-600">
                  <User className="w-5 h-5" />
                  <span>Full Name</span>
                </div>
                <p className="text-gray-900 pl-7">{user.name}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-5 h-5" />
                  <span>Email Address</span>
                </div>
                <p className="text-gray-900 pl-7">{user.email}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="w-5 h-5" />
                  <span>Phone Number</span>
                </div>
                <p className="text-gray-900 pl-7">{user.phone || "__"}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-5 h-5" />
                  <span>Location</span>
                </div>
                <p className="text-gray-900 pl-7">{user.location || "India"}</p>
              </div>
            </div>
          </Card>


          {/* Account Settings */}
          <Card className="p-8">
            <h3 className="text-gray-900 mb-6">Account Settings</h3>

            <div className="space-y-4">
              {/* <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <div>
                  <p className="text-gray-900">Email Notifications</p>
                  <p className="text-gray-600">Receive email updates about your account</p>
                </div>
                <div className="w-11 h-6 bg-blue-600 rounded-full relative">
                  <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5" />
                </div>
              </div> */}

              {/* <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <div>
                  <p className="text-gray-900">Two-Factor Authentication</p>
                  <p className="text-gray-600">Add an extra layer of security</p>
                </div>
                <Button variant="outline" size="sm">Enable</Button>
              </div> */}

              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-gray-900">Delete Account</p>
                  <p className="text-gray-600">Permanently delete your account and data</p>
                </div>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setIsDeleteModalOpen(true)}
                >
                  Delete
                </Button>
              </div>
            </div>
          </Card>
          <Modal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            title="Delete Account"
            footer={
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setIsDeleteModalOpen(false)}
                >
                  Cancel
                </Button>

                <Button
                  variant="danger"
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete Permanently"}
                </Button>
              </div>
            }
          >
            <div className="space-y-3">
              <p className="text-red-600 font-semibold">
                ⚠️ This action cannot be undone
              </p>

              <p className="text-gray-700">
                Deleting your account will permanently remove:
              </p>

              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>All your projects</li>
                <li>All tasks inside those projects</li>
                <li>Your team memberships</li>
                <li>Your profile and personal data</li>
              </ul>

              <p className="text-gray-700 mt-2">
                Are you sure you want to continue?
              </p>
            </div>
          </Modal>

          {/* Activity Summary */}
          <Card className="p-8">
            <h3 className="text-gray-900 mb-6">Activity Summary</h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">

              <div>
                <div className="text-gray-900 mb-1">{totalTasks}</div>
                <div className="text-gray-600">Total Tasks</div>
              </div>

              <div>
                <div className="text-gray-900 mb-1">{hoursLogged}</div>
                <div className="text-gray-600">Hours Logged</div>
              </div>

              <div>
                <div className="text-gray-900 mb-1">{totalProjects}</div>
                <div className="text-gray-600">Projects</div>
              </div>

              <div>
                <div className="text-gray-900 mb-1">{completionRate}%</div>
                <div className="text-gray-600">Completion Rate</div>
              </div>

            </div>
          </Card>

        </div>
      </main>
      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={handleCancelEdit}
        title="Edit Profile"
        footer={
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={handleCancelEdit}>
              Cancel
            </Button>
            <Button onClick={handleSaveProfile}>
              Save Changes
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input
            label="Full Name"
            type="text"
            name="name"
            value={editFormData.name || ""}
            onChange={handleEditChange}
            icon={<User className="w-5 h-5" />}
          />
          <Input
            label="Email Address"
            type="email"
            name="email"
            value={editFormData.email || ""}
            onChange={handleEditChange}
            icon={<Mail className="w-5 h-5" />}
            disabled
          />
          <Input
            label="Phone Number"
            type="tel"
            name="phone"
            value={editFormData.phone || ""}
            onChange={handleEditChange}
            icon={<Phone className="w-5 h-5" />}
          />
          <Input
            label="Location"
            type="text"
            name="location"
            value={editFormData.location || ""}
            onChange={handleEditChange}
            icon={<MapPin className="w-5 h-5" />}
          />
          <div>
            <label className="block text-gray-700 mb-2">Bio</label>
            <textarea
              name="bio"
              value={editFormData.bio || ""}
              onChange={handleEditChange}
              rows={3}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Profile;
