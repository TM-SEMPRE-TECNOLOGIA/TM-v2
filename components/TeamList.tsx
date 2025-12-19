import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Plus, Search, ShieldCheck, Wrench, FileEdit, X, Check } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { USERS, TECNICOS, User, UserRole } from '../lib/types';
import { useOSStore } from '../lib/store';
import { useToast } from '../hooks/use-toast';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  initials: string;
  osCount?: number;
}

export function TeamList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', email: '', role: 'tecnico' });
  const { toast } = useToast();
  
  const ordensServico = useOSStore((state) => state.ordensServico);

  const teamMembers: TeamMember[] = [
    ...USERS.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role === 'manager' ? 'Gerente' : u.role === 'elaborador' ? 'Elaborador' : 'Admin Contrato',
      initials: u.initials,
      osCount: ordensServico.filter(os => os.elaboradorId === u.id || os.elaborador === u.name).length
    })),
    ...TECNICOS.map(t => ({
      id: t.id,
      name: t.nome,
      email: `${t.nome.toLowerCase().replace(' ', '.')}@maffeng.com`,
      role: 'Técnico',
      initials: t.initials,
      osCount: ordensServico.filter(os => os.tecnicoId === t.id || os.tecnico === t.nome).length
    }))
  ];

  const filteredTeam = teamMembers.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    gerentes: USERS.filter(u => u.role === 'manager').length,
    elaboradores: USERS.filter(u => u.role === 'elaborador').length,
    admins: USERS.filter(u => u.role === 'contract_admin').length,
    tecnicos: TECNICOS.length
  };

  const handleAddMember = () => {
    if (!newMember.name || !newMember.email) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha nome e email do membro.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Membro adicionado",
      description: `${newMember.name} foi adicionado como ${newMember.role === 'tecnico' ? 'Técnico' : newMember.role === 'elaborador' ? 'Elaborador' : 'Admin de Contrato'}.`
    });
    setNewMember({ name: '', email: '', role: 'tecnico' });
    setShowAddModal(false);
  };

  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case 'Gerente': return 'border-purple-200 bg-purple-50 text-purple-700';
      case 'Elaborador': return 'border-blue-200 bg-blue-50 text-blue-700';
      case 'Admin Contrato': return 'border-amber-200 bg-amber-50 text-amber-700';
      case 'Técnico': return 'border-slate-200 bg-slate-50 text-slate-700';
      default: return 'border-slate-200 bg-slate-50 text-slate-700';
    }
  };

  const getAvatarStyle = (role: string) => {
    switch (role) {
      case 'Gerente': return 'bg-purple-100 text-purple-700';
      case 'Elaborador': return 'bg-blue-100 text-blue-700';
      case 'Admin Contrato': return 'bg-amber-100 text-amber-700';
      case 'Técnico': return 'bg-slate-100 text-slate-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Gestão de Equipe</h2>
          <p className="text-slate-500">Administre usuários, funções e atribuições.</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => setShowAddModal(true)}>
          <Plus className="mr-2 h-4 w-4" /> Novo Membro
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-purple-50 border-purple-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-md text-purple-600">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4 className="font-bold text-lg text-purple-700">{stats.gerentes}</h4>
                <p className="text-xs text-purple-600">Gerente(s)</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-blue-50 border-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-md text-blue-600">
                <FileEdit size={20} />
              </div>
              <div>
                <h4 className="font-bold text-lg text-blue-700">{stats.elaboradores}</h4>
                <p className="text-xs text-blue-600">Elaboradores</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-amber-50 border-amber-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-md text-amber-600">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4 className="font-bold text-lg text-amber-700">{stats.admins}</h4>
                <p className="text-xs text-amber-600">Admins Contrato</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-50 border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-200 rounded-md text-slate-600">
                <Wrench size={20} />
              </div>
              <div>
                <h4 className="font-bold text-lg text-slate-700">{stats.tecnicos}</h4>
                <p className="text-xs text-slate-600">Técnicos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Membros da Equipe ({filteredTeam.length})</CardTitle>
            <div className="relative w-[250px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                placeholder="Buscar membro..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Função</TableHead>
                <TableHead className="text-center">O.S Atribuídas</TableHead>
                <TableHead>Email</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTeam.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className={getAvatarStyle(member.role)}>
                        {member.initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-slate-900">{member.name}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getRoleBadgeStyle(member.role)}>
                      {member.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {member.osCount && member.osCount > 0 ? (
                      <Badge variant="secondary">{member.osCount}</Badge>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-slate-500">{member.email}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md animate-in zoom-in-95 duration-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">Novo Membro da Equipe</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setShowAddModal(false)}>
                <X size={18} />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Nome Completo *</Label>
                <Input 
                  placeholder="Nome do membro"
                  value={newMember.name}
                  onChange={(e) => setNewMember(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Email *</Label>
                <Input 
                  type="email"
                  placeholder="email@maffeng.com"
                  value={newMember.email}
                  onChange={(e) => setNewMember(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Função</Label>
                <Select 
                  value={newMember.role} 
                  onValueChange={(v) => setNewMember(prev => ({ ...prev, role: v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tecnico">Técnico</SelectItem>
                    <SelectItem value="elaborador">Elaborador</SelectItem>
                    <SelectItem value="contract_admin">Admin de Contrato</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowAddModal(false)}>
                  Cancelar
                </Button>
                <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleAddMember}>
                  <Check className="mr-2 h-4 w-4" /> Adicionar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
