import React, { useState, useEffect } from 'react';
import { 
  User, 
  Shield, 
  Bell, 
  Plus,
  MoreVertical,
  Trash2,
  Edit2,
  Lock
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from './ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { UserRole } from '../lib/types';

// Mock Data para Usuários
const initialUsers = [
  { id: 1, name: 'Paulo Silva', email: 'paulo.manager@cmms.com', role: 'Gerente', status: 'Ativo', avatar: 'PS' },
  { id: 2, name: 'Danilo Costa', email: 'danilo.tec@cmms.com', role: 'Técnico', status: 'Ativo', avatar: 'DC' },
  { id: 3, name: 'Alexandre Admin', email: 'alexandre.adm@cmms.com', role: 'Admin Contrato', status: 'Ativo', avatar: 'AA' },
  { id: 4, name: 'João Silva', email: 'joao.tec@cmms.com', role: 'Técnico', status: 'Inativo', avatar: 'JS' },
];

interface SettingsProps {
  userRole?: UserRole;
}

export function Settings({ userRole = 'technician' }: SettingsProps) {
  const isManager = userRole === 'manager';
  
  // Se não for gerente, força a aba "profile". Se for gerente, começa em "team"
  const [activeTab, setActiveTab] = useState(isManager ? 'team' : 'profile');
  const [users, setUsers] = useState(initialUsers);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Novo Usuário State
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'Técnico' });

  // Sincroniza a aba ativa quando o perfil muda (ex: logout/login)
  useEffect(() => {
    if (!isManager && activeTab !== 'profile') {
      setActiveTab('profile');
    }
  }, [userRole, isManager]);

  const handleAddUser = () => {
    const user = {
      id: Date.now(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: 'Ativo',
      avatar: newUser.name.substring(0,2).toUpperCase()
    };
    setUsers([...users, user]);
    setIsDialogOpen(false);
    setNewUser({ name: '', email: '', role: 'Técnico' });
  };

  const handleDeleteUser = (id: number) => {
    setUsers(users.filter(u => u.id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Configurações</h2>
        <p className="text-slate-500">Gerencie sua conta{isManager && ', equipe e preferências do sistema'}.</p>
      </div>

      <Tabs value={activeTab} className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User size={16} /> Meu Perfil
          </TabsTrigger>
          
          {isManager && (
            <>
              <TabsTrigger value="team" className="flex items-center gap-2">
                <Shield size={16} /> Gestão de Equipe
              </TabsTrigger>
              <TabsTrigger value="system" className="flex items-center gap-2">
                <Bell size={16} /> Sistema
              </TabsTrigger>
            </>
          )}
        </TabsList>

        {/* --- ABA MEU PERFIL --- */}
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
              <CardDescription>Atualize seus dados de contato e credenciais.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="text-2xl bg-slate-100 text-slate-600">
                    {userRole === 'manager' ? 'PS' : 'DC'}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <Button variant="outline" size="sm">Alterar Foto</Button>
                  <p className="text-xs text-slate-500">JPG ou PNG. Máx 1MB.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome Completo</Label>
                  <Input defaultValue={userRole === 'manager' ? "Paulo Silva" : "Danilo Costa"} />
                </div>
                <div className="space-y-2">
                  <Label>E-mail</Label>
                  <Input defaultValue={userRole === 'manager' ? "paulo.manager@cmms.com" : "danilo.tec@cmms.com"} />
                </div>
                <div className="space-y-2">
                  <Label>Telefone</Label>
                  <Input defaultValue="(11) 99999-9999" />
                </div>
                <div className="space-y-2">
                  <Label>Cargo</Label>
                  <Input 
                    defaultValue={userRole === 'manager' ? "Gerente de Operações" : "Técnico de Campo"} 
                    disabled 
                    className="bg-slate-50" 
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-sm font-medium text-slate-900">Segurança</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Senha Atual</Label>
                    <Input type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label>Nova Senha</Label>
                    <Input type="password" />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-slate-50 border-t flex justify-end p-4">
              <Button className="bg-emerald-600 hover:bg-emerald-700">Salvar Alterações</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* --- ABAS DE GERENTE (Condicionais) --- */}
        {isManager && (
          <>
            <TabsContent value="team" className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <h3 className="text-lg font-medium">Membros da Equipe</h3>
                  <p className="text-sm text-slate-500">Gerencie quem tem acesso ao sistema e seus níveis de permissão.</p>
                </div>
                
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-slate-900 hover:bg-slate-800 gap-2">
                      <Plus size={16} /> Adicionar Membro
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Novo Usuário</DialogTitle>
                      <DialogDescription>
                        Adicione um novo membro à equipe. Ele receberá um e-mail de convite.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Nome</Label>
                        <Input 
                          placeholder="Ex: Ana Souza" 
                          value={newUser.name}
                          onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>E-mail</Label>
                        <Input 
                          placeholder="email@empresa.com" 
                          value={newUser.email}
                          onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Perfil de Acesso</Label>
                        <Select 
                          value={newUser.role} 
                          onValueChange={(v) => setNewUser({...newUser, role: v})}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Técnico">Técnico (Campo)</SelectItem>
                            <SelectItem value="Gerente">Gerente (Gestão)</SelectItem>
                            <SelectItem value="Admin Contrato">Admin Contrato</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                      <Button onClick={handleAddUser} className="bg-emerald-600 hover:bg-emerald-700">
                        Convidar Usuário
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <Card>
                <CardContent className="p-0">
                  {users.map((user, index) => (
                    <div 
                      key={user.id} 
                      className={`flex items-center justify-between p-4 ${index !== users.length - 1 ? 'border-b' : ''}`}
                    >
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarFallback className="bg-slate-100 text-slate-700">{user.avatar}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-slate-900">{user.name}</p>
                          <p className="text-sm text-slate-500">{user.email}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <Badge variant="secondary" className="w-[120px] justify-center">
                          {user.role}
                        </Badge>
                        <div className="flex items-center gap-2">
                           <span className={`w-2 h-2 rounded-full ${user.status === 'Ativo' ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                           <span className="text-sm text-slate-600 w-[60px]">{user.status}</span>
                        </div>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical size={16} className="text-slate-400" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit2 className="mr-2 h-4 w-4" /> Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Lock className="mr-2 h-4 w-4" /> Resetar Senha
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteUser(user.id)}>
                              <Trash2 className="mr-2 h-4 w-4" /> Remover
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="system" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Regras de Negócio e Notificações</CardTitle>
                  <CardDescription>Configure como o sistema reage a eventos e prazos.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Notificações por E-mail</Label>
                      <p className="text-sm text-slate-500">
                        Receber alertas diários sobre prazos vencidos.
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Prazo de Relatório (Dias)</Label>
                      <p className="text-sm text-slate-500">
                        Tempo padrão para entrega após levantamento.
                      </p>
                    </div>
                    <div className="w-[100px]">
                      <Input type="number" defaultValue={15} />
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Travamento Automático</Label>
                      <p className="text-sm text-slate-500">
                        Bloquear edição de OS após status "Concluída".
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <Separator />

                   <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base text-red-600">Modo de Manutenção</Label>
                      <p className="text-sm text-slate-500">
                        Impede acesso de técnicos ao sistema temporariamente.
                      </p>
                    </div>
                    <Switch />
                  </div>

                </CardContent>
                <CardFooter className="bg-slate-50 border-t flex justify-end p-4">
                  <Button className="bg-emerald-600 hover:bg-emerald-700">Salvar Preferências</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </>
        )}

      </Tabs>
    </div>
  );
}
