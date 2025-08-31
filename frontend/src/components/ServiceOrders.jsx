import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Eye,
  Calendar,
  User,
  MapPin,
  Wrench
} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ServiceOrders = () => {
  const { user } = useAuth();
  const [serviceOrders, setServiceOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedOS, setSelectedOS] = useState(null);

  const [newOS, setNewOS] = useState({
    descricao: '',
    tipo_servico: '',
    responsavel: '',
    prioridade: '',
    local: '',
    equipamento: '',
    data_atendimento: ''
  });

  const statusOptions = [
    'Aberta', 'Atribuída', 'Em Andamento', 'Pausada', 'Concluída', 'Cancelada'
  ];

  const priorityOptions = [
    'Baixa', 'Média', 'Alta', 'Crítica'
  ];

  useEffect(() => {
    fetchServiceOrders();
  }, []);

  const fetchServiceOrders = async () => {
    try {
      const response = await axios.get(`${API}/service-orders`);
      setServiceOrders(response.data);
    } catch (error) {
      console.error('Error fetching service orders:', error);
      toast.error('Erro ao carregar ordens de serviço');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOS = async (e) => {
    e.preventDefault();
    
    if (!newOS.descricao || !newOS.tipo_servico || !newOS.responsavel || 
        !newOS.prioridade || !newOS.local || !newOS.equipamento) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    try {
      const osData = {
        ...newOS,
        data_atendimento: newOS.data_atendimento ? new Date(newOS.data_atendimento).toISOString() : null
      };

      await axios.post(`${API}/service-orders`, osData);
      toast.success('Ordem de serviço criada com sucesso!');
      
      setNewOS({
        descricao: '',
        tipo_servico: '',
        responsavel: '',
        prioridade: '',
        local: '',
        equipamento: '',
        data_atendimento: ''
      });
      
      setIsCreateModalOpen(false);
      fetchServiceOrders();
    } catch (error) {
      console.error('Error creating service order:', error);
      toast.error('Erro ao criar ordem de serviço');
    }
  };

  const handleUpdateOS = async (e) => {
    e.preventDefault();
    
    try {
      const updateData = {
        descricao: selectedOS.descricao,
        tipo_servico: selectedOS.tipo_servico,
        responsavel: selectedOS.responsavel,
        prioridade: selectedOS.prioridade,
        local: selectedOS.local,
        equipamento: selectedOS.equipamento,
        status: selectedOS.status,
        data_atendimento: selectedOS.data_atendimento ? new Date(selectedOS.data_atendimento).toISOString() : null
      };

      await axios.put(`${API}/service-orders/${selectedOS.id}`, updateData);
      toast.success('Ordem de serviço atualizada com sucesso!');
      
      setIsEditModalOpen(false);
      setSelectedOS(null);
      fetchServiceOrders();
    } catch (error) {
      console.error('Error updating service order:', error);
      toast.error('Erro ao atualizar ordem de serviço');
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'Aberta': return 'default';
      case 'Atribuída': return 'secondary';
      case 'Em Andamento': return 'default';
      case 'Pausada': return 'secondary';
      case 'Concluída': return 'default';
      case 'Cancelada': return 'destructive';
      default: return 'secondary';
    }
  };

  const getPriorityBadgeVariant = (priority) => {
    switch (priority) {
      case 'Crítica': return 'destructive';
      case 'Alta': return 'default';
      case 'Média': return 'secondary';
      case 'Baixa': return 'outline';
      default: return 'secondary';
    }
  };

  const filteredOrders = serviceOrders.filter(os => {
    const matchesSearch = os.numero_os?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         os.descricao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         os.responsavel?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || os.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="p-6">
        <div className="grid gap-4">
          {[...Array(5)].map((_, i) => (
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
          <h1 className="text-3xl font-bold text-slate-900">Ordens de Serviço</h1>
          <p className="text-slate-600">Gerencie todas as ordens de serviço do sistema</p>
        </div>
        
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
              <Plus className="h-4 w-4 mr-2" />
              Nova OS
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Criar Nova Ordem de Serviço</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateOS} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="descricao">Descrição *</Label>
                  <Textarea
                    id="descricao"
                    placeholder="Descreva o serviço a ser realizado"
                    value={newOS.descricao}
                    onChange={(e) => setNewOS({...newOS, descricao: e.target.value})}
                    className="min-h-[100px]"
                  />
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="tipo_servico">Tipo de Serviço *</Label>
                    <Input
                      id="tipo_servico"
                      placeholder="Ex: Manutenção, Instalação"
                      value={newOS.tipo_servico}
                      onChange={(e) => setNewOS({...newOS, tipo_servico: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="responsavel">Responsável *</Label>
                    <Input
                      id="responsavel"
                      placeholder="Nome do técnico responsável"
                      value={newOS.responsavel}
                      onChange={(e) => setNewOS({...newOS, responsavel: e.target.value})}
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prioridade">Prioridade *</Label>
                  <Select value={newOS.prioridade} onValueChange={(value) => setNewOS({...newOS, prioridade: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a prioridade" />
                    </SelectTrigger>
                    <SelectContent>
                      {priorityOptions.map(priority => (
                        <SelectItem key={priority} value={priority}>{priority}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="data_atendimento">Data de Atendimento</Label>
                  <Input
                    id="data_atendimento"
                    type="datetime-local"
                    value={newOS.data_atendimento}
                    onChange={(e) => setNewOS({...newOS, data_atendimento: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="local">Local *</Label>
                  <Input
                    id="local"
                    placeholder="Local do serviço"
                    value={newOS.local}
                    onChange={(e) => setNewOS({...newOS, local: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="equipamento">Equipamento *</Label>
                  <Input
                    id="equipamento"
                    placeholder="Equipamento a ser atendido"
                    value={newOS.equipamento}
                    onChange={(e) => setNewOS({...newOS, equipamento: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-gradient-to-r from-blue-600 to-cyan-600">
                  Criar OS
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Buscar por número, descrição ou responsável..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="w-full sm:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  {statusOptions.map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Service Orders List */}
      <div className="grid gap-4">
        {filteredOrders.map((os) => (
          <Card key={os.id} className="card-hover">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-slate-900">
                      {os.numero_os}
                    </h3>
                    <Badge 
                      variant={getStatusBadgeVariant(os.status)}
                      className={`status-${os.status?.toLowerCase().replace(' ', '-')}`}
                    >
                      {os.status}
                    </Badge>
                    <Badge 
                      variant={getPriorityBadgeVariant(os.prioridade)}
                      className={`priority-${os.prioridade?.toLowerCase()}`}
                    >
                      {os.prioridade}
                    </Badge>
                  </div>
                  
                  <p className="text-slate-600">{os.descricao}</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-600">{os.responsavel}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-600">{os.local}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wrench className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-600">{os.equipamento}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-600">
                        {new Date(os.data_solicitacao).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedOS(os);
                      setIsEditModalOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {filteredOrders.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                Nenhuma ordem de serviço encontrada
              </h3>
              <p className="text-slate-600 mb-4">
                {searchTerm || statusFilter ? 'Tente ajustar os filtros de busca.' : 'Comece criando sua primeira OS.'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Ordem de Serviço</DialogTitle>
          </DialogHeader>
          {selectedOS && (
            <form onSubmit={handleUpdateOS} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit_descricao">Descrição</Label>
                  <Textarea
                    id="edit_descricao"
                    value={selectedOS.descricao}
                    onChange={(e) => setSelectedOS({...selectedOS, descricao: e.target.value})}
                    className="min-h-[100px]"
                  />
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit_status">Status</Label>
                    <Select 
                      value={selectedOS.status} 
                      onValueChange={(value) => setSelectedOS({...selectedOS, status: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map(status => (
                          <SelectItem key={status} value={status}>{status}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit_responsavel">Responsável</Label>
                    <Input
                      id="edit_responsavel"
                      value={selectedOS.responsavel}
                      onChange={(e) => setSelectedOS({...selectedOS, responsavel: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-gradient-to-r from-blue-600 to-cyan-600">
                  Atualizar
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServiceOrders;