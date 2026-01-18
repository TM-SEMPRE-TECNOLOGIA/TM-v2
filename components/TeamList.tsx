import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Plus, Search, ShieldCheck, Wrench, FileEdit, X, Check, Users, Briefcase, TrendingUp } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { USERS, TECNICOS } from '../lib/types';
import { useOSStore } from '../lib/store';
import { useToast } from '../hooks/use-toast';

const OB = {
  background: '#f0f8ff',
  foreground: '#374151',
  card: '#ffffff',
  primary: '#22c55e',
  primaryLight: '#34d399',
  secondary: '#e0f2fe',
  muted: '#f3f4f6',
  mutedForeground: '#6b7280',
  accent: '#d1fae5',
  border: '#e5e7eb',
  chart1: '#22c55e',
  chart2: '#10b981',
  chart3: '#059669',
};

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  initials: string;
  osCount: number;
}

export function TeamList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', email: '', role: 'tecnico' });
  const { toast } = useToast();
  
  const ordensServico = useOSStore((state) => state.ordensServico);

  const teamMembers: TeamMember[] = useMemo(() => [
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
  ], [ordensServico]);

  const filteredTeam = teamMembers.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = useMemo(() => ({
    gerentes: USERS.filter(u => u.role === 'manager').length,
    elaboradores: USERS.filter(u => u.role === 'elaborador').length,
    admins: USERS.filter(u => u.role === 'contract_admin').length,
    tecnicos: TECNICOS.length,
    totalOS: ordensServico.length,
    osAtribuidas: ordensServico.filter(os => os.tecnicoId || os.elaboradorId).length
  }), [ordensServico]);

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
      case 'Gerente': return 'border-emerald-200 bg-emerald-50 text-emerald-700';
      case 'Elaborador': return 'border-sky-200 bg-sky-50 text-sky-700';
      case 'Admin Contrato': return 'border-amber-200 bg-amber-50 text-amber-700';
      case 'Técnico': return 'border-slate-200 bg-slate-50 text-slate-700';
      default: return 'border-slate-200 bg-slate-50 text-slate-700';
    }
  };

  const getAvatarStyle = (role: string) => {
    switch (role) {
      case 'Gerente': return 'bg-emerald-100 text-emerald-700';
      case 'Elaborador': return 'bg-sky-100 text-sky-700';
      case 'Admin Contrato': return 'bg-amber-100 text-amber-700';
      case 'Técnico': return 'bg-slate-100 text-slate-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getProgressWidth = (count: number) => {
    const max = Math.max(...teamMembers.map(m => m.osCount), 1);
    return `${(count / max) * 100}%`;
  };

  return (
    <div className="min-h-screen p-6" style={{ background: OB.background }}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: OB.foreground }}>
              Gestão de Equipe
            </h1>
            <p style={{ color: OB.mutedForeground }}>
              Administre usuários, funções e atribuições de O.S.
            </p>
          </div>
          <Button 
            onClick={() => setShowAddModal(true)}
            style={{ background: OB.primary }}
            className="hover:opacity-90 text-white"
          >
            <Plus className="mr-2 h-4 w-4" /> Novo Membro
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-0 shadow-md" style={{ background: OB.card }}>
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl" style={{ background: OB.accent }}>
                  <ShieldCheck size={24} style={{ color: OB.chart1 }} />
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: OB.mutedForeground }}>Gerentes</p>
                  <h3 className="text-2xl font-bold" style={{ color: OB.foreground }}>{stats.gerentes}</h3>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md" style={{ background: OB.card }}>
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl" style={{ background: OB.secondary }}>
                  <FileEdit size={24} className="text-sky-600" />
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: OB.mutedForeground }}>Elaboradores</p>
                  <h3 className="text-2xl font-bold" style={{ color: OB.foreground }}>{stats.elaboradores}</h3>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md" style={{ background: OB.card }}>
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-amber-50">
                  <Briefcase size={24} className="text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: OB.mutedForeground }}>Admins Contrato</p>
                  <h3 className="text-2xl font-bold" style={{ color: OB.foreground }}>{stats.admins}</h3>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md" style={{ background: OB.card }}>
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl" style={{ background: OB.muted }}>
                  <Wrench size={24} style={{ color: OB.mutedForeground }} />
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: OB.mutedForeground }}>Técnicos</p>
                  <h3 className="text-2xl font-bold" style={{ color: OB.foreground }}>{stats.tecnicos}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 border-0 shadow-md" style={{ background: OB.card }}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users size={20} style={{ color: OB.primary }} />
                  <CardTitle style={{ color: OB.foreground }}>
                    Membros da Equipe ({filteredTeam.length})
                  </CardTitle>
                </div>
                <div className="relative w-[250px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: OB.mutedForeground }} />
                  <Input
                    placeholder="Buscar membro..."
                    className="pl-9 border-slate-200 focus:border-emerald-400 focus:ring-emerald-200"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border overflow-hidden" style={{ borderColor: OB.border }}>
                <Table>
                  <TableHeader>
                    <TableRow style={{ background: OB.muted }}>
                      <TableHead className="font-semibold" style={{ color: OB.foreground }}>Nome</TableHead>
                      <TableHead className="font-semibold" style={{ color: OB.foreground }}>Função</TableHead>
                      <TableHead className="text-center font-semibold" style={{ color: OB.foreground }}>O.S</TableHead>
                      <TableHead className="font-semibold" style={{ color: OB.foreground }}>Email</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTeam.map((member, index) => (
                      <TableRow 
                        key={member.id}
                        className="hover:bg-slate-50 transition-colors"
                        style={{ background: index % 2 === 0 ? OB.card : OB.muted }}
                      >
                        <TableCell className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 border-2 border-white shadow-sm">
                            <AvatarFallback className={getAvatarStyle(member.role)}>
                              {member.initials}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium" style={{ color: OB.foreground }}>{member.name}</span>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getRoleBadgeStyle(member.role)}>
                            {member.role}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          {member.osCount > 0 ? (
                            <Badge 
                              className="text-white"
                              style={{ background: OB.primary }}
                            >
                              {member.osCount}
                            </Badge>
                          ) : (
                            <span style={{ color: OB.mutedForeground }}>-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm" style={{ color: OB.mutedForeground }}>
                          {member.email}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md" style={{ background: OB.card }}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <TrendingUp size={20} style={{ color: OB.primary }} />
                <CardTitle style={{ color: OB.foreground }}>Top Colaboradores</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {teamMembers
                .filter(m => m.osCount > 0)
                .sort((a, b) => b.osCount - a.osCount)
                .slice(0, 6)
                .map((member, index) => (
                  <div key={member.id} className="flex items-center gap-3">
                    <div 
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                      style={{ 
                        background: index === 0 ? OB.chart1 : index === 1 ? OB.chart2 : OB.chart3 
                      }}
                    >
                      {index + 1}
                    </div>
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className={getAvatarStyle(member.role)}>
                        {member.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: OB.foreground }}>
                        {member.name}
                      </p>
                      <div className="flex items-center gap-2">
                        <div 
                          className="h-1.5 rounded-full flex-1"
                          style={{ background: OB.muted }}
                        >
                          <div 
                            className="h-full rounded-full transition-all"
                            style={{ 
                              width: getProgressWidth(member.osCount),
                              background: `linear-gradient(90deg, ${OB.chart1}, ${OB.chart2})`
                            }}
                          />
                        </div>
                        <span className="text-xs font-semibold" style={{ color: OB.primary }}>
                          {member.osCount}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              {teamMembers.filter(m => m.osCount > 0).length === 0 && (
                <div className="text-center py-8" style={{ color: OB.mutedForeground }}>
                  <Users size={40} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Nenhuma O.S atribuída ainda</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md animate-in zoom-in-95 duration-200 border-0 shadow-2xl">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg" style={{ background: OB.accent }}>
                    <Plus size={18} style={{ color: OB.primary }} />
                  </div>
                  <CardTitle className="text-lg" style={{ color: OB.foreground }}>
                    Novo Membro da Equipe
                  </CardTitle>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setShowAddModal(false)}>
                  <X size={18} />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label style={{ color: OB.foreground }}>Nome Completo *</Label>
                  <Input 
                    placeholder="Nome do membro"
                    value={newMember.name}
                    onChange={(e) => setNewMember(prev => ({ ...prev, name: e.target.value }))}
                    className="focus:border-emerald-400 focus:ring-emerald-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label style={{ color: OB.foreground }}>Email *</Label>
                  <Input 
                    type="email"
                    placeholder="email@maffeng.com"
                    value={newMember.email}
                    onChange={(e) => setNewMember(prev => ({ ...prev, email: e.target.value }))}
                    className="focus:border-emerald-400 focus:ring-emerald-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label style={{ color: OB.foreground }}>Função</Label>
                  <Select 
                    value={newMember.role} 
                    onValueChange={(v) => setNewMember(prev => ({ ...prev, role: v }))}
                  >
                    <SelectTrigger className="focus:border-emerald-400 focus:ring-emerald-200">
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
                  <Button 
                    onClick={handleAddMember}
                    style={{ background: OB.primary }}
                    className="hover:opacity-90 text-white"
                  >
                    <Check className="mr-2 h-4 w-4" /> Adicionar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
