import {
  HomeIcon,
  UsersIcon,
  AcademicCapIcon,
  BookOpenIcon,
  MegaphoneIcon,
} from "@heroicons/react/24/outline";

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: "dashboard", icon: HomeIcon, label: "Dashboard" },
    { id: "students", icon: UsersIcon, label: "Students" },
    { id: "teachers", icon: AcademicCapIcon, label: "Teachers" },
    { id: "subjects", icon: BookOpenIcon, label: "Subjects" },
    { id: "announcements", icon: MegaphoneIcon, label: "Announcements" },
  ];

  return (
    <div className="h-screen w-64 bg-gray-900 text-white fixed left-0 top-0 overflow-y-auto">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold">🏫 SchoolLink</h1>
        <p className="text-sm text-gray-400 mt-1">Admin Dashboard</p>
      </div>

      <nav className="mt-6 px-3">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center w-full px-4 py-3 my-1 text-sm rounded-lg transition-colors ${
              activeTab === item.id
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:bg-gray-800 hover:text-white"
            }`}
          >
            <item.icon className="h-5 w-5 mr-3" />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="absolute bottom-0 w-full p-4 border-t border-gray-800">
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-xs text-gray-400">Admin User</p>
          <p className="text-sm text-white">admin@school.com</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;