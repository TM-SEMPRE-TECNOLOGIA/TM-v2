import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ShieldCheck, FileEdit, Briefcase, ArrowRight, Lock, Mail, ChevronDown, ChevronUp } from 'lucide-react';
import { UserRole, USERS, User } from '../lib/types';

interface LoginProps {
  onLogin: (role: UserRole, userId: string) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [expandedRole, setExpandedRole] = useState<UserRole>(null);

  const handleUserSelect = (user: User) => {
    if (user.role) {
      onLogin(user.role, user.id);
    }
  };

  const managers = USERS.filter(u => u.role === 'manager');
  const elaboradores = USERS.filter(u => u.role === 'elaborador');
  const contractAdmins = USERS.filter(u => u.role === 'contract_admin');

  const toggleRole = (role: UserRole) => {
    setExpandedRole(expandedRole === role ? null : role);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)'
    }}>
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full opacity-20" style={{
          background: 'radial-gradient(circle, #34d399 0%, transparent 70%)'
        }}></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full opacity-15" style={{
          background: 'radial-gradient(circle, #22c55e 0%, transparent 70%)'
        }}></div>
      </div>

      <div className="max-w-5xl w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold tracking-tight text-white mb-3" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            MAFFENG <span style={{ color: '#34d399' }}>CMMS</span>
          </h1>
          <p className="text-lg" style={{ color: '#94a3b8' }}>Sistema de Gestão de Ordens de Serviço</p>
        </div>

        {/* Main Card - Glassmorphism */}
        <Card className="border-0 shadow-2xl" style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px'
        }}>
          <CardHeader className="text-center pb-2 pt-8">
            <CardTitle className="text-2xl font-bold" style={{ color: '#1e293b' }}>Acesso ao Sistema</CardTitle>
            <CardDescription className="text-base" style={{ color: '#64748b' }}>
              Selecione seu perfil para acessar
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-8 pb-6 px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Side - Login Form */}
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium" style={{ color: '#374151' }}>Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: '#9ca3af' }} />
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-11 h-12 text-base"
                      style={{
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px'
                      }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium" style={{ color: '#374151' }}>Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: '#9ca3af' }} />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-11 h-12 text-base"
                      style={{
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px'
                      }}
                    />
                  </div>
                </div>
                <p className="text-xs italic" style={{ color: '#94a3b8' }}>
                  * Por enquanto, use os botões ao lado para selecionar o perfil
                </p>
              </div>

              {/* Right Side - Quick Access */}
              <div className="pl-0 md:pl-6 md:border-l" style={{ borderColor: '#e2e8f0' }}>
                <p className="text-sm font-semibold mb-4" style={{ color: '#475569' }}>Acesso Rápido por Perfil:</p>
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                  {/* Managers */}
                  {managers.map(user => (
                    <button
                      key={user.id}
                      onClick={() => handleUserSelect(user)}
                      className="w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-200 group"
                      style={{
                        background: 'linear-gradient(135deg, rgba(209, 250, 229, 0.8), rgba(167, 243, 208, 0.6))',
                        border: '2px solid #a7f3d0'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(34, 197, 94, 0.25)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <div className="p-2.5 rounded-full text-white" style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}>
                        <ShieldCheck size={22} />
                      </div>
                      <div className="text-left flex-1">
                        <p className="font-semibold" style={{ color: '#1e293b' }}>{user.name}</p>
                        <p className="text-xs" style={{ color: '#64748b' }}>Gerente de Manutenção</p>
                      </div>
                      <ArrowRight className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#16a34a' }} />
                    </button>
                  ))}

                  {/* Elaboradores Accordion */}
                  <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #bfdbfe' }}>
                    <button
                      onClick={() => toggleRole('elaborador')}
                      className="w-full flex items-center gap-4 p-4 transition-all"
                      style={{
                        background: 'linear-gradient(135deg, rgba(219, 234, 254, 0.8), rgba(191, 219, 254, 0.6))'
                      }}
                    >
                      <div className="p-2.5 rounded-full text-white" style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
                        <FileEdit size={22} />
                      </div>
                      <div className="text-left flex-1">
                        <p className="font-semibold" style={{ color: '#1e293b' }}>Elaboradores</p>
                        <p className="text-xs" style={{ color: '#64748b' }}>{elaboradores.length} usuários</p>
                      </div>
                      {expandedRole === 'elaborador' ? <ChevronUp size={20} style={{ color: '#2563eb' }} /> : <ChevronDown size={20} style={{ color: '#2563eb' }} />}
                    </button>
                    {expandedRole === 'elaborador' && (
                      <div className="divide-y" style={{ background: '#ffffff', borderColor: '#f1f5f9' }}>
                        {elaboradores.map(user => (
                          <button
                            key={user.id}
                            onClick={() => handleUserSelect(user)}
                            className="w-full flex items-center gap-3 p-4 transition-all group"
                            style={{ background: 'transparent' }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#eff6ff'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                          >
                            <div className="h-9 w-9 rounded-full flex items-center justify-center font-bold text-sm" style={{ background: '#dbeafe', color: '#2563eb' }}>
                              {user.initials}
                            </div>
                            <div className="text-left flex-1">
                              <p className="font-medium" style={{ color: '#1e293b' }}>{user.name}</p>
                              <p className="text-xs" style={{ color: '#64748b' }}>Elaborador de Relatório</p>
                            </div>
                            <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#2563eb' }} />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Contract Admins Accordion */}
                  <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #e9d5ff' }}>
                    <button
                      onClick={() => toggleRole('contract_admin')}
                      className="w-full flex items-center gap-4 p-4 transition-all"
                      style={{
                        background: 'linear-gradient(135deg, rgba(243, 232, 255, 0.8), rgba(233, 213, 255, 0.6))'
                      }}
                    >
                      <div className="p-2.5 rounded-full text-white" style={{ background: 'linear-gradient(135deg, #a855f7, #9333ea)' }}>
                        <Briefcase size={22} />
                      </div>
                      <div className="text-left flex-1">
                        <p className="font-semibold" style={{ color: '#1e293b' }}>Administradores de Contratos</p>
                        <p className="text-xs" style={{ color: '#64748b' }}>{contractAdmins.length} usuários</p>
                      </div>
                      {expandedRole === 'contract_admin' ? <ChevronUp size={20} style={{ color: '#9333ea' }} /> : <ChevronDown size={20} style={{ color: '#9333ea' }} />}
                    </button>
                    {expandedRole === 'contract_admin' && (
                      <div className="divide-y" style={{ background: '#ffffff', borderColor: '#f1f5f9' }}>
                        {contractAdmins.map(user => (
                          <button
                            key={user.id}
                            onClick={() => handleUserSelect(user)}
                            className="w-full flex items-center gap-3 p-4 transition-all group"
                            style={{ background: 'transparent' }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#faf5ff'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                          >
                            <div className="h-9 w-9 rounded-full flex items-center justify-center font-bold text-sm" style={{ background: '#f3e8ff', color: '#9333ea' }}>
                              {user.initials}
                            </div>
                            <div className="text-left flex-1">
                              <p className="font-medium" style={{ color: '#1e293b' }}>{user.name}</p>
                              <p className="text-xs" style={{ color: '#64748b' }}>Administrador de Contratos</p>
                            </div>
                            <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#9333ea' }} />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="justify-center py-5" style={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0', borderRadius: '0 0 16px 16px' }}>
            <p className="text-xs" style={{ color: '#94a3b8' }}>
              MAFFENG CMMS v1.0.0 • Ambiente de Demonstração
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
