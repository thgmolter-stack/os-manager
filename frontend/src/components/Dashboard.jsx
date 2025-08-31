import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { 
  FileText, 
  Package, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Users,
  TrendingUp,
  Activity
} from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    total_os: 0,
    total_materials: 0,
    os_by_status: [],
    os_by_technician: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get(`${API}/dashboard`);
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Erro ao carregar dados do dashboard');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Aberta': return <FileText className="h-5 w-5" />;
      case 'Em Andamento': return <Clock className="h-5 w-5" />;
      case 'Concluída': return <CheckCircle className="h-5 w-5" />;
      default: return <AlertCircle className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Aberta': return 'text-blue-600 bg-blue-100';
      case 'Atribuída': return 'text-yellow-600 bg-yellow-100';
      case 'Em Andamento': return 'text-orange-600 bg-orange-100';
      case 'Pausada': return 'text-gray-600 bg-gray-100';
      case 'Concluída': return 'text-green-600 bg-green-100';
      case 'Cancelada': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Dashboard
        </h1>
        <p className="text-slate-600">
          Bem-vindo, <span className="font-medium">{user?.full_name}</span>! 
          Aqui está o resumo do sistema.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total de OS</p>
                <p className="text-3xl font-bold text-slate-900">{dashboardData.total_os}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Materiais</p>
                <p className="text-3xl font-bold text-slate-900">{dashboardData.total_materials}</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Package className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Técnicos</p>
                <p className="text-3xl font-bold text-slate-900">{dashboardData.os_by_technician.length}</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Performance</p>
                <p className="text-3xl font-bold text-slate-900">98%</p>
              </div>
              <div className="h-12 w-12 bg-cyan-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-cyan-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* OS by Status */}
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              OS por Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.os_by_status.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${getStatusColor(item._id)}`}>
                      {getStatusIcon(item._id)}
                    </div>
                    <span className="font-medium text-slate-900">{item._id}</span>
                  </div>
                  <span className="text-2xl font-bold text-slate-700">{item.count}</span>
                </div>
              ))}
              {dashboardData.os_by_status.length === 0 && (
                <p className="text-center text-slate-500 py-8">
                  Nenhuma OS encontrada
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* OS by Technician */}
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              OS por Técnico
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.os_by_technician.slice(0, 5).map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">
                        {item._id?.charAt(0)?.toUpperCase() || 'N'}
                      </span>
                    </div>
                    <span className="font-medium text-slate-900">{item._id || 'Não atribuído'}</span>
                  </div>
                  <span className="text-2xl font-bold text-slate-700">{item.count}</span>
                </div>
              ))}
              {dashboardData.os_by_technician.length === 0 && (
                <p className="text-center text-slate-500 py-8">
                  Nenhum técnico encontrado
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="card-hover">
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">Nova OS</h3>
              <p className="text-sm text-blue-700 mb-3">Criar uma nova ordem de serviço</p>
              <button className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Criar OS
              </button>
            </div>
            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-900 mb-2">Materiais</h3>
              <p className="text-sm text-green-700 mb-3">Gerenciar solicitações de material</p>
              <button className="text-sm bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                Ver Materiais
              </button>
            </div>
            <div className="p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg border border-purple-200">
              <h3 className="font-semibold text-purple-900 mb-2">Relatórios</h3>
              <p className="text-sm text-purple-700 mb-3">Visualizar relatórios de performance</p>
              <button className="text-sm bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                Ver Relatórios
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;