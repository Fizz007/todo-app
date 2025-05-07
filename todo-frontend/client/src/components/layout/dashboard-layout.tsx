import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import DarkModeToggle from "@/components/common/dark-mode-toggle";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { 
  Home, 
  LogOut,
  Menu
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogoutClick = () => {
    setIsLogoutDialogOpen(true);
  };

  const handleLogoutConfirm = () => {
    logout();
    setIsLogoutDialogOpen(false);
  };

  const navLinks = [
    { name: "Dashboard", href: "/", icon: Home },
  ];

  const navLinkClasses = "flex items-center px-3 py-2 text-sm font-medium rounded-md";
  const activeClasses = "bg-gray-900 dark:bg-gray-800 text-white";
  const inactiveClasses = "text-gray-300 hover:bg-gray-700 hover:text-white";

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar Navigation (desktop) */}
      <aside className="bg-gray-800 dark:bg-gray-900 text-white w-64 flex-shrink-0 hidden md:flex md:flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-700">
          <Link href="/">
            <a className="text-xl font-bold text-blue-400">ToDo</a>
          </Link>
        </div>
        
        <nav className="mt-5 px-3 flex-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location === link.href;
            
            return (
              <Link key={link.name} href={link.href}>
                <a className={cn(
                  navLinkClasses,
                  isActive ? activeClasses : inactiveClasses,
                  "mt-1"
                )}>
                  <Icon className="h-5 w-5 mr-2" />
                  {link.name}
                </a>
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-gray-700">
          <button 
            className="flex items-center text-gray-300 hover:text-white"
            onClick={handleLogoutClick}
          >
            <LogOut className="h-5 w-5 mr-2" />
            Logout
          </button>
        </div>
      </aside>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-100 dark:bg-gray-800">
        {/* Top Navigation Bar */}
        <header className="bg-white dark:bg-gray-900 shadow-sm">
          <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-gray-500 dark:text-gray-400 focus:outline-none"
              onClick={toggleMobileMenu}
            >
              <Menu className="h-6 w-6" />
            </button>
            
            {/* Title (mobile only) */}
            <h1 className="text-lg font-bold text-gray-900 dark:text-white md:hidden">Dashboard</h1>
            
            {/* Right-side items */}
            <div className="flex items-center space-x-4">
              <DarkModeToggle />
              
              {/* User Profile */}
              <div className="relative">
                <div className="flex items-center space-x-2">
                  <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                    {user?.email.charAt(0).toUpperCase()}
                  </span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {user?.email}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>
        
        {/* Mobile Navigation Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            {/* Background overlay */}
            <div 
              className="fixed inset-0 bg-gray-600 bg-opacity-75" 
              onClick={toggleMobileMenu}
            ></div>
            
            {/* Mobile menu */}
            <div className="fixed inset-y-0 left-0 flex flex-col w-56 bg-gray-800 dark:bg-gray-900">
              <div className="h-16 flex items-center px-4 border-b border-gray-700">
                <Link href="/">
                  <a className="text-xl font-bold text-blue-400">ToDo</a>
                </Link>
              </div>
              
              <nav className="mt-5 px-3 flex-1">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = location === link.href;
                  
                  return (
                    <Link key={link.name} href={link.href}>
                      <a 
                        className={cn(
                          navLinkClasses,
                          isActive ? activeClasses : inactiveClasses,
                          "mt-1"
                        )}
                        onClick={toggleMobileMenu}
                      >
                        <Icon className="h-5 w-5 mr-2" />
                        {link.name}
                      </a>
                    </Link>
                  );
                })}
              </nav>
              
              <div className="p-4 border-t border-gray-700">
                <button 
                  className="flex items-center text-gray-300 hover:text-white"
                  onClick={handleLogoutClick}
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
        
        {/* Mobile Navigation (visible on small screens) */}
        <nav className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 fixed bottom-0 left-0 right-0">
          <div className="grid grid-cols-1 h-16">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location === link.href;
              
              return (
                <Link key={link.name} href={link.href}>
                  <a className={cn(
                    "flex flex-col items-center justify-center",
                    isActive 
                      ? "text-blue-600 dark:text-blue-400" 
                      : "text-gray-500 dark:text-gray-400"
                  )}>
                    <Icon className="h-6 w-6" />
                    <span className="text-xs mt-1">{link.name}</span>
                  </a>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
      
      {/* Logout Confirmation Dialog */}
      <AlertDialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to log out? You will need to log in again to access your tasks.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogoutConfirm}>Logout</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
