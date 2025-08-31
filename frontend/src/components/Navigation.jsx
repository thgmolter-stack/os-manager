import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../App';
import { Button } from './ui/button';
import { 
  LayoutDashboard, 
  FileText, 
  Package, 
  LogOut, 
  User,
  Settings,
  BarChart3
} from 'lucide-react';

const Navigation = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const menuItems = [
    {
      path: '/dashboard',
      icon: LayoutDashboard,
      label: 'Dashboard',
      description: 'Visão geral do sistema'
    },
    {
      path: '/service-orders',
      icon: FileText,
      label: 'Ordens de Serviço',
      description: 'Gerenciar OS'
    },
    {
      path: '/materials',
      icon: Package,
      label: 'Materiais',
      description: 'Solicitações de material'
    }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-64 bg-white shadow-xl h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b bg-gradient-to-r from-blue-600 to-cyan-600">
        <h1 className="text-2xl font-bold text-white mb-1">OS Manager</h1>
        <p className="text-blue-100 text-sm">Sistema de Gestão</p>
      </div>

      {/* User Info */}
      <div className="p-4 border-b bg-slate-50">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">
              {user?.full_name}
            </p>
            <p className="text-xs text-slate-500 capitalize">
              {user?.user_type}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group
                    ${isActive(item.path) 
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg' 
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }
                  `}
                >
                  <Icon 
                    className={`h-5 w-5 transition-transform group-hover:scale-110 ${
                      isActive(item.path) ? 'text-white' : 'text-slate-400'
                    }`} 
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium">{item.label}</div>
                    <div className={`text-xs ${
                      isActive(item.path) ? 'text-blue-100' : 'text-slate-400'
                    }`}>
                      {item.description}
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t">
        <Button
          onClick={logout}
          variant="ghost"
          className="w-full justify-start text-slate-600 hover:text-red-600 hover:bg-red-50"
        >
          <LogOut className="h-4 w-4 mr-3" />
          Sair
        </Button>
      </div>
    </div>
  );
};

export default Navigation;