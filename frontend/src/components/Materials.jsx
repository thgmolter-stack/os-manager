import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { 
  Plus, 
  Search, 
  Package, 
  Calendar,
  User,
  Hash,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Materials = () => {
  const { user } = useAuth();
  const [materials, setMaterials] = useState([]);
  const [serviceOrders, setServiceOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [newMaterial, setNewMaterial] = useState({
    os_id: '',
    descricao: '',
    quantidade: ''
  });

  const statusOptions = ['Solicitado', 'Aprovado', 'Entregue'];

  useEffect(() => {
    fetchMaterials();
    fetchServiceOrders();
  }, []);

  const fetchMaterials = async () => {
    try {
      const response = await axios.get(`${API}/materials`);
      setMaterials(response.data);
    } catch (error) {
      console.error('Error fetching materials:', error);
      toast.error('Erro ao carregar materiais');
    } finally {
      setLoading(false);
    }
  };

  const fetchServiceOrders = async () => {
    try {
      const response = await axios.get(`${API}/service-orders`);
      setServiceOrders(response.data);
    } catch (error) {
      console.error('Error fetching service orders:', error);
    }
  };

  const handleCreateMaterial = async (e) => {
    e.preventDefault();
    
    if (!newMaterial.os_id || !newMaterial.descricao || !newMaterial.quantidade) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    try {
      const materialData = {
        ...newMaterial,
        quantidade: parseInt(newMaterial.quantidade)
      };

      await axios.post(`${API}/materials`, materialData);
      toast.success('Material solicitado com sucesso!');
      
      setNewMaterial({
        os_id: '',
        descricao: '',
        quantidade: ''
      });
      
      setIsCreateModalOpen(false);
      fetchMaterials();
    } catch (error) {
      console.error('Error creating material:', error);
      toast.error('Erro ao solicitar material');
    }
  };

  const handleUpdateMaterialStatus = async (materialId, newStatus) => {
    try {
      await axios.put(`${API}/materials/${materialId}`, {
        status: newStatus,
        aprovado_por: user?.username
      });
      toast.success('Status do material atualizado com sucesso!');
      fetchMaterials();
    } catch (error) {
      console.error('Error updating material status:', error);
      toast.error('Erro ao atualizar status do material');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Solicitado': return <Clock className="h-4 w-4" />;
      case 'Aprovado': return <CheckCircle className="h-4 w-4" />;
      case 'Entregue': return <Package className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'Solicitado': return 'secondary';
      case 'Aprovado': return 'default';
      case 'Entregue': return 'default';
      default: return 'secondary';
    }
  };

  const getOSNumber = (osId) => {
    const os = serviceOrders.find(os => os.id === osId);
    return os ? os.numero_os : 'OS não encontrada';
  };

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.descricao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         getOSNumber(material.os_id)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.solicitado_por?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || material.status === statusFilter;
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
          <h1 className="text-3xl font-bold text-slate-900">Materiais</h1>
          <p className="text-slate-600">Gerencie solicitações de materiais para as OS</p>
        </div>
        
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
              <Plus className="h-4 w-4 mr-2" />
              Solicitar Material
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Solicitar Novo Material</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateMaterial} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="os_id">Ordem de Serviço *</Label>
                <Select value={newMaterial.os_id} onValueChange={(value) => setNewMaterial({...newMaterial, os_id: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma OS" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceOrders.map(os => (
                      <SelectItem key={os.id} value={os.id}>
                        {os.numero_os} - {os.descricao.substring(0, 50)}...
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição do Material *</Label>
                <Input
                  id="descricao"
                  placeholder="Ex: Cabo de rede CAT6, Parafusos..."
                  value={newMaterial.descricao}
                  onChange={(e) => setNewMaterial({...newMaterial, descricao: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantidade">Quantidade *</Label>
                <Input
                  id="quantidade"
                  type="number"
                  min="1"
                  placeholder="Digite a quantidade"
                  value={newMaterial.quantidade}
                  onChange={(e) => setNewMaterial({...newMaterial, quantidade: e.target.value})}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-gradient-to-r from-green-600 to-emerald-600">
                  Solicitar
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
                  placeholder="Buscar por material, OS ou solicitante..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="w-full sm:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
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

      {/* Materials List */}
      <div className="grid gap-4">
        {filteredMaterials.map((material) => (
          <Card key={material.id} className="card-hover">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                      <Package className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">
                        {material.descricao}
                      </h3>
                      <p className="text-sm text-slate-500">
                        OS: {getOSNumber(material.os_id)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={getStatusBadgeVariant(material.status)}
                        className="flex items-center gap-1"
                      >
                        {getStatusIcon(material.status)}
                        {material.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-600">Qtd: {material.quantidade}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-600">Por: {material.solicitado_por}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-600">
                        {new Date(material.data_solicitacao).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    {material.aprovado_por && (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-600">Aprovado por: {material.aprovado_por}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {user?.user_type === 'admin' && material.status !== 'Entregue' && (
                  <div className="flex gap-2">
                    {material.status === 'Solicitado' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateMaterialStatus(material.id, 'Aprovado')}
                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Aprovar
                      </Button>
                    )}
                    {material.status === 'Aprovado' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateMaterialStatus(material.id, 'Entregue')}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <Package className="h-4 w-4 mr-1" />
                        Marcar como Entregue
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        
        {filteredMaterials.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                Nenhum material encontrado
              </h3>
              <p className="text-slate-600 mb-4">
                {searchTerm || statusFilter ? 'Tente ajustar os filtros de busca.' : 'Comece solicitando materiais para suas OS.'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-800">Solicitados</p>
                <p className="text-2xl font-bold text-yellow-900">
                  {materials.filter(m => m.status === 'Solicitado').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-800">Aprovados</p>
                <p className="text-2xl font-bold text-blue-900">
                  {materials.filter(m => m.status === 'Aprovado').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-800">Entregues</p>
                <p className="text-2xl font-bold text-green-900">
                  {materials.filter(m => m.status === 'Entregue').length}
                </p>
              </div>
              <Package className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Materials;