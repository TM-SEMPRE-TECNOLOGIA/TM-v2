import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ShieldCheck, Wrench, ArrowRight } from 'lucide-react';

interface LoginProps {
  onLogin: (role: 'manager' | 'technician') => void;
}

export function Login({ onLogin }: LoginProps) {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Intro Section */}
        <div className="flex flex-col justify-center space-y-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-2">MAFFENG <span className="text-emerald-600">CMMS</span></h1>
            <p className="text-lg text-slate-600">Sistema de Gestão de Manutenção Preventiva e Ordens de Serviço.</p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
              <div className="bg-emerald-100 p-2 rounded-full text-emerald-700">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Gestão Completa</h3>
                <p className="text-sm text-slate-500">Controle total de equipe, métricas e agenda.</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
               <div className="bg-blue-100 p-2 rounded-full text-blue-700">
                <Wrench size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Execução Otimizada</h3>
                <p className="text-sm text-slate-500">Foco nas tarefas designadas e checklists.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Login Cards */}
        <div className="space-y-6">
          <div className="text-center mb-4 md:hidden">
            <h2 className="text-xl font-bold">Selecione seu perfil</h2>
          </div>

          {/* Paulo - Gerente */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-emerald-500" onClick={() => onLogin('manager')}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle>Paulo</CardTitle>
                <ShieldCheck className="text-emerald-500" />
              </div>
              <CardDescription>Gerente de Manutenção</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-4">
              <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100&h=100" />
                <AvatarFallback>PA</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="text-sm font-medium">Acesso Administrativo</p>
                <p className="text-xs text-slate-500">Dashboard, Equipe, Todas as O.S, Importação</p>
              </div>
            </CardContent>
            <CardFooter className="pt-0 justify-end">
              <Button variant="ghost" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 group">
                Entrar como Paulo <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </CardFooter>
          </Card>

          {/* Danilo - Executor */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-blue-500" onClick={() => onLogin('technician')}>
            <CardHeader className="pb-2">
               <div className="flex items-center justify-between">
                <CardTitle>Danilo</CardTitle>
                <Wrench className="text-blue-500" />
              </div>
              <CardDescription>Técnico Executor</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-4">
              <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                <AvatarImage src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100&h=100" />
                <AvatarFallback>DA</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="text-sm font-medium">Acesso Operacional</p>
                <p className="text-xs text-slate-500">Minhas O.S, Agenda Pessoal, Execução</p>
              </div>
            </CardContent>
             <CardFooter className="pt-0 justify-end">
              <Button variant="ghost" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 group">
                Entrar como Danilo <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </CardFooter>
          </Card>

        </div>
      </div>
      
      <div className="fixed bottom-4 text-center w-full text-slate-400 text-xs">
        Ambiente de Demonstração • v1.0.0
      </div>
    </div>
  );
}
