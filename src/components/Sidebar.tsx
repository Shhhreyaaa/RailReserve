"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "./AuthProvider";
import {
  Train,
  LayoutDashboard,
  Ticket,
  ClipboardList,
  TicketSlash,
  LogOut,
  Menu,
  X,
  User as UserIcon,
} from "lucide-react";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Book New Ticket", href: "/book", icon: Ticket },
    { name: "My Reservations", href: "/reservations", icon: ClipboardList },
    { name: "Cancel Ticket", href: "/cancel", icon: TicketSlash },
  ];

  if (!user) return null;

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden flex items-center justify-between bg-slate-900 border-b border-slate-800 px-4 py-3 text-slate-100 z-30 relative select-none">
        <div className="flex items-center gap-2">
          <Train className="w-6 h-6 text-yellow-500" />
          <span className="font-bold tracking-wider">
            Rail<span className="text-yellow-500">Reserve</span>
          </span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-100"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="md:hidden fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-20"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 left-0 bottom-0 h-screen w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between text-slate-300 z-30 transition-transform duration-300 transform select-none ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div>
          {/* Logo Section */}
          <div className="hidden md:flex items-center gap-3 px-6 py-6 border-b border-slate-800/50">
            <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-500 border border-yellow-500/20">
              <Train className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-wider text-slate-100">
                Rail<span className="text-yellow-500">Reserve</span>
              </h1>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
                Indian Railways
              </span>
            </div>
          </div>

          {/* User profile quick view */}
          <div className="px-6 py-4 border-b border-slate-800/30 bg-slate-900/50 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-yellow-500 font-bold">
              <UserIcon className="w-5 h-5 text-slate-400" />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-slate-200 truncate">
                {user.full_name}
              </p>
              <p className="text-xs text-slate-500 truncate">@{user.login_id}</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-4 py-6 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition duration-150 ${
                    isActive
                      ? "bg-yellow-500/10 text-yellow-500 border-l-2 border-yellow-500 pl-3.5"
                      : "hover:bg-slate-800/60 hover:text-slate-100 text-slate-400"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "text-yellow-500" : "text-slate-400"}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Logout Section */}
        <div className="p-4 border-t border-slate-800/50">
          <button
            onClick={() => {
              setIsOpen(false);
              logout();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition duration-150"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
