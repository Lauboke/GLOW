import React from "react";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  UserCog,
  Wallet,
  Mail,
  Star,
  ImagePlus,
  Gift,
  LogOut,
  UserCircle2,
  Settings,
  X,
} from "lucide-react";

const NAV_ITEMS = [
  { key: "dashboard", label: "Overview", icon: LayoutDashboard },
  { key: "appointments", label: "Appointments", icon: CalendarDays },
  { key: "clients", label: "Clients", icon: Users },
  { key: "staff", label: "Staff", icon: UserCog },
  { key: "revenue", label: "Revenue", icon: Wallet },
  { key: "inquiries", label: "Inquiries", icon: Mail },
  { key: "reviews", label: "Reviews", icon: Star },
  { key: "services", label: "Services", icon: ImagePlus },
  { key: "giveaways", label: "Promos", icon: Gift },
  { key: "settings", label: "Settings", icon: Settings },
  { key: "profile", label: "My Profile", icon: UserCircle2 },
];

const AdminSidebar = ({
  activeTab,
  setActiveTab,
  handleLogout,
  isMobileMenuOpen = false,
  closeMobileMenu = () => {},
}) => {
  return (
    <>
      {isMobileMenuOpen && (
        <button
          type="button"
          onClick={closeMobileMenu}
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          aria-label="Close sidebar overlay"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-black p-8 text-white transform transition-transform duration-300 md:h-full ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="mb-10 flex items-center justify-between md:block">
          <h2 className="text-xl font-black italic uppercase tracking-tighter text-pink-500 md:mb-12">
            Glow Admin
          </h2>

          <button
            type="button"
            onClick={closeMobileMenu}
            className="text-gray-400 hover:text-white md:hidden"
            aria-label="Close sidebar"
          >
            <X size={22} strokeWidth={2.4} />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-3">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.key}
                onClick={() => {
                  setActiveTab(item.key);
                  closeMobileMenu();
                }}
                className={`flex items-center gap-3 rounded-2xl px-5 py-3 text-left text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === item.key
                    ? "bg-white text-black"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Icon size={16} strokeWidth={2.4} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-gray-800 pt-6">
          <button
            onClick={() => {
              closeMobileMenu();
              handleLogout();
            }}
            className="flex items-center gap-3 text-[10px] font-black uppercase text-gray-500 transition-colors hover:text-red-500"
          >
            <LogOut size={16} strokeWidth={2.4} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;