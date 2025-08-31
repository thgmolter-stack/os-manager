import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';
import { 
  FileText, 
  Download, 
  Calendar,
  BarChart3,
  PieChart,
  TrendingUp,
  Users,
  Package,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Reports = () => {
  const { user } = useAuth();
  const [reportData, setReportData] = useState({
    total_os: 0,
    total_materials: 0,
    os_by_status: [],
    os_by_technician: [],
    os_by_priority: [],
    materials_by_status: [],
    monthly_stats: [],
    service_orders: [],
    materials: []
  });
  const [loading, setLoading] = useState(true);
  const [reportType, setReportType] = useState('general');

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      // Buscar dados do dashboard
      const dashboardResponse = await axios.get(`${API}/dashboard`);
      
      // Buscar todas as OS
      const osResponse = await axios.get(`${API}/service-orders`);
      
      // Buscar todos os materiais
      const materialsResponse = await axios.get(`${API}/materials`);

      // Processar dados para relatórios
      const serviceOrders = osResponse.data;
      const materials = materialsResponse.data;

      // Calcular estatísticas por prioridade
      const osByPriority = serviceOrders.reduce((acc, os) => {
        const priority = os.prioridade || 'Não definida';
        const existing = acc.find(item => item._id === priority);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ _id: priority, count: 1 });
        }
        return acc;
      }, []);

      // Calcular estatísticas de materiais por status
      const materialsByStatus = materials.reduce((acc, material) => {
        const status = material.status || 'Indefinido';
        const existing = acc.find(item => item._id === status);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ _id: status, count: 1 });
        }
        return acc;
      }, []);

      setReportData({
        ...dashboardResponse.data,
        os_by_priority: osByPriority,
        materials_by_status: materialsByStatus,
        service_orders: serviceOrders,
        materials: materials
      });
    } catch (error) {
      console.error('Error fetching report data:', error);
      toast.error('Erro ao carregar dados do relatório');
    } finally {
      setLoading(false);
    }
  };

  const generateCSVReport = () => {
    try {
      let csvContent = '';
      
      if (reportType === 'general' || reportType === 'service_orders') {
        // Relatório de Ordens de Serviço
        csvContent += 'RELATÓRIO DE ORDENS DE SERVIÇO\n';
        csvContent += 'Data de Geração:,' + new Date().toLocaleString('pt-BR') + '\n';
        csvContent += 'Gerado por:,' + user?.full_name + '\n\n';
        
        csvContent += 'Número OS,Descrição,Tipo Serviço,Responsável,Prioridade,Status,Local,Equipamento,Data Solicitação,Data Atendimento\n';
        
        reportData.service_orders.forEach(os => {
          csvContent += `"${os.numero_os}","${os.descricao}","${os.tipo_servico}","${os.responsavel}","${os.prioridade}","${os.status}","${os.local}","${os.equipamento}","${new Date(os.data_solicitacao).toLocaleString('pt-BR')}","${os.data_atendimento ? new Date(os.data_atendimento).toLocaleString('pt-BR') : 'Não definida'}"\n`;
        });
        
        csvContent += '\n\nRESUMO POR STATUS\n';
        csvContent += 'Status,Quantidade\n';
        reportData.os_by_status.forEach(item => {
          csvContent += `"${item._id}",${item.count}\n`;
        });
        
        csvContent += '\n\nRESUMO POR TÉCNICO\n';
        csvContent += 'Técnico,Quantidade\n';
        reportData.os_by_technician.forEach(item => {
          csvContent += `"${item._id}",${item.count}\n`;
        });
      }
      
      if (reportType === 'general' || reportType === 'materials') {
        csvContent += '\n\nRELATÓRIO DE MATERIAIS\n';
        csvContent += 'Descrição,Quantidade,Status,OS,Solicitado Por,Data Solicitação,Aprovado Por,Data Aprovação\n';
        
        reportData.materials.forEach(material => {
          const os = reportData.service_orders.find(o => o.id === material.os_id);
          csvContent += `"${material.descricao}",${material.quantidade},"${material.status}","${os?.numero_os || 'N/A'}","${material.solicitado_por}","${new Date(material.data_solicitacao).toLocaleString('pt-BR')}","${material.aprovado_por || 'N/A'}","${material.data_aprovacao ? new Date(material.data_aprovacao).toLocaleString('pt-BR') : 'N/A'}"\n`;
        });
      }

      // Download do arquivo
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `relatorio_os_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Relatório CSV gerado com sucesso!');
    } catch (error) {
      console.error('Error generating CSV:', error);
      toast.error('Erro ao gerar relatório CSV');
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

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Crítica': return 'text-red-600 bg-red-100';
      case 'Alta': return 'text-orange-600 bg-orange-100';
      case 'Média': return 'text-yellow-600 bg-yellow-100';
      case 'Baixa': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="grid gap-4">
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Relatórios</h1>
          <p className="text-slate-600">Análise completa do sistema de ordens de serviço</p>
        </div>
        
        <div className="flex gap-3">
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Tipo de relatório" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">Relatório Geral</SelectItem>
              <SelectItem value="service_orders">Apenas OS</SelectItem>
              <SelectItem value="materials">Apenas Materiais</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            onClick={generateCSVReport}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
          >
            <Download className="h-4 w-4 mr-2" />
            Baixar CSV
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total de OS</p>
                <p className="text-3xl font-bold text-slate-900">{reportData.total_os}</p>
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
                <p className="text-sm font-medium text-slate-600">Total Materiais</p>
                <p className="text-3xl font-bold text-slate-900">{reportData.total_materials}</p>
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
                <p className="text-sm font-medium text-slate-600">Técnicos Ativos</p>
                <p className="text-3xl font-bold text-slate-900">{reportData.os_by_technician.length}</p>
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
                <p className="text-sm font-medium text-slate-600">Taxa Conclusão</p>
                <p className="text-3xl font-bold text-slate-900">
                  {reportData.total_os > 0 
                    ? Math.round((reportData.os_by_status.find(s => s._id === 'Concluída')?.count || 0) / reportData.total_os * 100) 
                    : 0}%
                </p>
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
              <BarChart3 className="h-5 w-5" />
              OS por Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportData.os_by_status.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item._id)}`}>
                      {item._id}
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-slate-700">{item.count}</span>
                </div>
              ))}
              {reportData.os_by_status.length === 0 && (
                <p className="text-center text-slate-500 py-8">
                  Nenhuma OS encontrada
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* OS by Priority */}
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              OS por Prioridade
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportData.os_by_priority.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(item._id)}`}>
                      {item._id}
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-slate-700">{item.count}</span>
                </div>
              ))}
              {reportData.os_by_priority.length === 0 && (
                <p className="text-center text-slate-500 py-8">
                  Nenhuma OS encontrada
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* OS by Technician */}
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Desempenho por Técnico
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportData.os_by_technician.map((item, index) => (
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
              {reportData.os_by_technician.length === 0 && (
                <p className="text-center text-slate-500 py-8">
                  Nenhum técnico encontrado
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Materials Summary */}
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Status dos Materiais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportData.materials_by_status.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                      <Package className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-medium text-slate-900">{item._id}</span>
                  </div>
                  <span className="text-2xl font-bold text-slate-700">{item.count}</span>
                </div>
              ))}
              {reportData.materials_by_status.length === 0 && (
                <p className="text-center text-slate-500 py-8">
                  Nenhum material encontrado
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Informações do Relatório
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-1">Data de Geração</p>
              <p className="text-lg font-semibold text-slate-900">
                {new Date().toLocaleDateString('pt-BR')}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600 mb-1">Gerado por</p>
              <p className="text-lg font-semibold text-slate-900">
                {user?.full_name}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600 mb-1">Tipo de Relatório</p>
              <p className="text-lg font-semibold text-slate-900">
                {reportType === 'general' ? 'Relatório Geral' : 
                 reportType === 'service_orders' ? 'Apenas OS' : 'Apenas Materiais'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;