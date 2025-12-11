import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ShieldCheck, Wrench, Briefcase, ArrowRight, Lock, Mail } from 'lucide-react';
import { UserRole, USERS } from '../lib/types';

interface LoginProps {
  onLogin: (role: UserRole) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showProfiles, setShowProfiles] = useState(true);

  const handleProfileSelect = (role: UserRole) => {
    if (role) {
      onLogin(role);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-white mb-2">
            MAFFENG <span className="text-emerald-400">CMMS</span>
          </h1>
          <p className="text-slate-400">Sistema de Gestão de Ordens de Serviço</p>
        </div>

        <Card className="bg-white/95 backdrop-blur shadow-2xl border-0">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-xl">Acesso ao Sistema</CardTitle>
            <CardDescription>
              Selecione seu perfil para acessar
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input 
                      id="email"
                      type="email" 
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-700">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input 
                      id="password"
                      type="password" 
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <p className="text-xs text-slate-500 italic">
                  * Por enquanto, use os botões ao lado para selecionar o perfil
                </p>
              </div>

              <div className="border-l border-slate-200 pl-6">
                <p className="text-sm font-medium text-slate-600 mb-3">Acesso Rápido por Perfil:</p>
                <div className="space-y-3">
                  <button
                    onClick={() => handleProfileSelect('manager')}
                    className="w-full flex items-center gap-3 p-3 rounded-lg border-2 border-emerald-200 bg-emerald-50 hover:bg-emerald-100 hover:border-emerald-300 transition-all group"
                  >
                    <div className="bg-emerald-500 p-2 rounded-full text-white">
                      <ShieldCheck size={20} />
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-semibold text-slate-900">Paulo Silva</p>
                      <p className="text-xs text-slate-500">Gerente de Manutenção</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>

                  <button
                    onClick={() => handleProfileSelect('technician')}
                    className="w-full flex items-center gap-3 p-3 rounded-lg border-2 border-blue-200 bg-blue-50 hover:bg-blue-100 hover:border-blue-300 transition-all group"
                  >
                    <div className="bg-blue-500 p-2 rounded-full text-white">
                      <Wrench size={20} />
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-semibold text-slate-900">Danilo Costa</p>
                      <p className="text-xs text-slate-500">Técnico Executor</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>

                  <button
                    onClick={() => handleProfileSelect('admin')}
                    className="w-full flex items-center gap-3 p-3 rounded-lg border-2 border-purple-200 bg-purple-50 hover:bg-purple-100 hover:border-purple-300 transition-all group"
                  >
                    <div className="bg-purple-500 p-2 rounded-full text-white">
                      <Briefcase size={20} />
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-semibold text-slate-900">Alexandre Souza</p>
                      <p className="text-xs text-slate-500">Administrador de Contratos</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-slate-50 border-t border-slate-100 justify-center py-4">
            <p className="text-xs text-slate-400">
              MAFFENG CMMS v1.0.0 • Ambiente de Demonstração
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
