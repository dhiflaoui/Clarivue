"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpenCheck, Settings, User, LogOut } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const DashboardNavbar: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/50 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-slate-800/50 dark:bg-slate-900/95 dark:supports-[backdrop-filter]:bg-slate-900/60">
      <div className="container flex h-14 items-center">
        {/* Logo */}
        <Link href="/dashboard" className="mr-6 flex items-center space-x-2">
          <div className="p-1.5 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg">
            <BookOpenCheck className="text-white w-4 h-4" />
          </div>
          <span className="hidden sm:block font-bold text-lg bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent dark:from-slate-200 dark:to-slate-400">
            Clarivue
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center space-x-6 text-sm font-medium flex-1">
          <Link
            href="/dashboard"
            className="transition-colors hover:text-foreground/80 text-foreground/60 dark:text-slate-400 dark:hover:text-slate-100"
          >
            Documents
          </Link>
          <Link
            href="/dashboard/chat"
            className="transition-colors hover:text-foreground/80 text-foreground/60 dark:text-slate-400 dark:hover:text-slate-100"
          >
            Chat
          </Link>
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-2">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Settings */}
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>

          {/* User Menu */}
          <Button variant="ghost" size="sm">
            <User className="h-4 w-4" />
          </Button>

          {/* Logout */}
          <Button variant="ghost" size="sm">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default DashboardNavbar;
