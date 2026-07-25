import { Home, Users, Image, Bell, Bookmark } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
    const links = [
        { name: "Home", path: "/", icon: <Home size={20} />, end: true },
        { name: "Community", path: "/community", icon: <Users size={20} />, end: false },
        { name: "My Post", path: "/mypost", icon: <Image size={20} />, end: false },
        { name: "Saved", path: "/bookmarked", icon: <Bookmark size={20} />, end: false },
    ];

    return (
        <div className="w-64 bg-white p-4 rounded-3xl shadow-md ">
            <div className="flex flex-col gap-2">
                {links.map((link) => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        end={link.end}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all
              ${isActive
                                ? "bg-green-100 text-green-600 font-semibold"
                                : "text-gray-600 hover:bg-gray-100"
                            }`
                        }
                    >
                        {link.icon}
                        <span>{link.name}</span>
                    </NavLink>
                ))}
            </div>
        </div>
    );
}