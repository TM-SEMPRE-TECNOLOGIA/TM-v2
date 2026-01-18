import React, { useState, useEffect } from 'react';
import { User, Bell, Shield, Lock } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { UserRole } from '../lib/types';

const OB = {
  background: '#f0f8ff',
  foreground: '#374151',
  card: '#ffffff',
  primary: '#22c55e',
  secondary: '#e0f2fe',
  muted: '#f3f4f6',
  mutedForeground: '#6b7280',
  accent: '#d1fae5',
  border: '#e5e7eb',
  destructive: '#ef4444',
};

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
    <div className="min-h-screen p-6" style={{ background: OB.background }}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: OB.foreground }}>
            Configurações
          </h1>
          <p style={{ color: OB.mutedForeground }}>
            Gerencie sua conta{isManager && ' e preferências do sistema'}.
          </p>
        </div>

        <Tabs value={activeTab} className="space-y-4" onValueChange={setActiveTab}>
          <TabsList className="bg-white border shadow-sm">
            <TabsTrigger 
              value="profile" 
              className="flex items-center gap-2 data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700"
            >
              <User size={16} /> Meu Perfil
            </TabsTrigger>
            
            {isManager && (
              <TabsTrigger 
                value="system" 
                className="flex items-center gap-2 data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700"
              >
                <Bell size={16} /> Sistema
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <Card className="border-0 shadow-md" style={{ background: OB.card }}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <User size={20} style={{ color: OB.primary }} />
                  <div>
                    <CardTitle style={{ color: OB.foreground }}>Informações Pessoais</CardTitle>
                    <CardDescription>Atualize seus dados de contato e credenciais.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
                    <AvatarFallback 
                      className="text-2xl font-bold"
                      style={{ background: OB.accent, color: OB.primary }}
                    >
                      {userRole === 'manager' ? 'PS' : 'DC'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                    >
                      Alterar Foto
                    </Button>
                    <p className="text-xs" style={{ color: OB.mutedForeground }}>
                      JPG ou PNG. Máx 1MB.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label style={{ color: OB.foreground }}>Nome Completo</Label>
                    <Input 
                      defaultValue={userRole === 'manager' ? "Paulo Silva" : "Danilo Costa"}
                      className="focus:border-emerald-400 focus:ring-emerald-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label style={{ color: OB.foreground }}>E-mail</Label>
                    <Input 
                      defaultValue={userRole === 'manager' ? "paulo.manager@cmms.com" : "danilo.tec@cmms.com"}
                      className="focus:border-emerald-400 focus:ring-emerald-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label style={{ color: OB.foreground }}>Telefone</Label>
                    <Input 
                      defaultValue="(11) 99999-9999"
                      className="focus:border-emerald-400 focus:ring-emerald-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label style={{ color: OB.foreground }}>Cargo</Label>
                    <Input 
                      defaultValue={userRole === 'manager' ? "Gerente de Operações" : "Técnico de Campo"} 
                      disabled 
                      style={{ background: OB.muted }}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Lock size={18} style={{ color: OB.primary }} />
                    <h3 className="text-sm font-semibold" style={{ color: OB.foreground }}>Segurança</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label style={{ color: OB.foreground }}>Senha Atual</Label>
                      <Input 
                        type="password"
                        className="focus:border-emerald-400 focus:ring-emerald-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label style={{ color: OB.foreground }}>Nova Senha</Label>
                      <Input 
                        type="password"
                        className="focus:border-emerald-400 focus:ring-emerald-200"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end p-4 border-t" style={{ background: OB.muted }}>
                <Button 
                  className="text-white"
                  style={{ background: OB.primary }}
                >
                  Salvar Alterações
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {isManager && (
            <TabsContent value="system" className="space-y-4">
              <Card className="border-0 shadow-md" style={{ background: OB.card }}>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Shield size={20} style={{ color: OB.primary }} />
                    <div>
                      <CardTitle style={{ color: OB.foreground }}>Regras de Negócio e Notificações</CardTitle>
                      <CardDescription>Configure como o sistema reage a eventos e prazos.</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  <div className="flex items-center justify-between p-4 rounded-lg" style={{ background: OB.muted }}>
                    <div className="space-y-0.5">
                      <Label className="text-base" style={{ color: OB.foreground }}>Notificações por E-mail</Label>
                      <p className="text-sm" style={{ color: OB.mutedForeground }}>
                        Receber alertas diários sobre prazos vencidos.
                      </p>
                    </div>
                    <Switch 
                      defaultChecked
                      className="data-[state=checked]:bg-emerald-600"
                    />
                  </div>
                  
                  <Separator />

                  <div className="flex items-center justify-between p-4 rounded-lg" style={{ background: OB.muted }}>
                    <div className="space-y-0.5">
                      <Label className="text-base" style={{ color: OB.foreground }}>Prazo de Relatório (Dias)</Label>
                      <p className="text-sm" style={{ color: OB.mutedForeground }}>
                        Tempo padrão para entrega após levantamento.
                      </p>
                    </div>
                    <div className="w-[100px]">
                      <Input 
                        type="number" 
                        defaultValue={15}
                        className="focus:border-emerald-400 focus:ring-emerald-200"
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between p-4 rounded-lg" style={{ background: OB.muted }}>
                    <div className="space-y-0.5">
                      <Label className="text-base" style={{ color: OB.foreground }}>Travamento Automático</Label>
                      <p className="text-sm" style={{ color: OB.mutedForeground }}>
                        Bloquear edição de OS após status "Concluída".
                      </p>
                    </div>
                    <Switch 
                      defaultChecked
                      className="data-[state=checked]:bg-emerald-600"
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between p-4 rounded-lg border-2" style={{ borderColor: '#fecaca', background: '#fef2f2' }}>
                    <div className="space-y-0.5">
                      <Label className="text-base" style={{ color: OB.destructive }}>Modo de Manutenção</Label>
                      <p className="text-sm" style={{ color: OB.mutedForeground }}>
                        Impede acesso de técnicos ao sistema temporariamente.
                      </p>
                    </div>
                    <Switch className="data-[state=checked]:bg-red-600" />
                  </div>

                </CardContent>
                <CardFooter className="flex justify-end p-4 border-t" style={{ background: OB.muted }}>
                  <Button 
                    className="text-white"
                    style={{ background: OB.primary }}
                  >
                    Salvar Preferências
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          )}

        </Tabs>
      </div>
    </div>
  );
}
