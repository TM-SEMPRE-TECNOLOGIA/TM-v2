import React, { useState, useEffect } from 'react';
import { User, Bell } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { UserRole } from '../lib/types';

interface SettingsProps {
  userRole?: UserRole;
}

export function Settings({ userRole = 'elaborador' }: SettingsProps) {
  const isManager = userRole === 'manager';
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (!isManager && activeTab !== 'profile') {
      setActiveTab('profile');
    }
  }, [userRole, isManager, activeTab]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Configurações</h2>
        <p className="text-slate-500">Gerencie sua conta{isManager && ' e preferências do sistema'}.</p>
      </div>

      <Tabs value={activeTab} className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User size={16} /> Meu Perfil
          </TabsTrigger>
          
          {isManager && (
            <TabsTrigger value="system" className="flex items-center gap-2">
              <Bell size={16} /> Sistema
            </TabsTrigger>
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

        {/* --- ABA SISTEMA (Apenas Gerente) --- */}
        {isManager && (
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
        )}

      </Tabs>
    </div>
  );
}
