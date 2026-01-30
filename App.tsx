import React, { useState, useEffect, useMemo } from 'react';
import {
  BarChart2,
  Users,
  ClipboardList,
  Settings as SettingsIcon,
  CalendarDays,
  Menu,
  AlertTriangle,
  FileSpreadsheet,
  FileText,
  LogOut,
  Briefcase,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Bell
} from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { TeamList } from './components/TeamList';
import { AgendaAndChecklist } from './components/AgendaAndChecklist';
import { WorkOrders } from './components/WorkOrders';
import { Notifications } from './components/Notifications';
import { NotificationsPage } from './components/NotificationsPage';
import { Login } from './components/Login';
import { ImportOS } from './components/ImportOS';
import { DifficultyLog } from './components/DifficultyLog';
import { Reports } from './components/Reports';
import { Settings } from './components/Settings';
import { BalancoPreventivas } from './components/BalancoPreventivas';
import type { UserRole } from './lib/types';
import { USERS } from './lib/types';
import { Toaster } from './components/ui/toaster';
import { useOSStore } from './lib/store';
import { useNotificationsStore } from './lib/notificationsStore';

// Ocean Breeze Design System Colors
const OB = {
  background: '#f0f8ff',
  foreground: '#374151',
  card: '#ffffff',
  primary: '#22c55e',
  primaryForeground: '#ffffff',
  secondary: '#e0f2fe',
  muted: '#f3f4f6',
  mutedForeground: '#6b7280',
  accent: '#d1fae5',
  border: '#e5e7eb',
  sidebar: '#1e293b',
  sidebarForeground: '#d1d5db',
  sidebarPrimary: '#34d399',
  sidebarAccent: '#374151',
  sidebarBorder: '#4b5563',
};

function App() {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const fetchOrdensServico = useOSStore(state => state.fetchOrdensServico);
  const notificacoes = useNotificationsStore(state => state.notificacoes);

  const unreadNotifications = useMemo(() => (
    notificacoes.filter((notificacao) => notificacao.statusLeitura === 'nao_lida').length
  ), [notificacoes]);

  useEffect(() => {
    fetchOrdensServico();
  }, [fetchOrdensServico]);

  const handleLogin = (role: UserRole, id: string) => {
    setUserRole(role);
    setUserId(id);
    if (role === 'elaborador') {
      setActiveTab('work-orders');
    } else if (role === 'contract_admin') {
      setActiveTab('work-orders');
    } else {
      setActiveTab('dashboard');
    }
  };

  const handleLogout = () => {
    setUserRole(null);
    setUserId(null);
    setActiveTab('dashboard');
  };

  if (!userRole) {
    return <Login onLogin={handleLogin} />;
  }

  const currentUser = USERS.find(u => u.id === userId);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onNavigateToImport={() => setActiveTab('import')} />;
      case 'team':
        return userRole === 'manager' ? <TeamList /> : <Dashboard onNavigateToImport={() => setActiveTab('import')} />;
      case 'agenda':
        return <AgendaAndChecklist userRole={userRole} currentUser={currentUser} />;
      case 'work-orders':
        return <WorkOrders userRole={userRole} currentUser={currentUser} onNavigateToImport={() => setActiveTab('import')} />;
      case 'notifications':
        return <NotificationsPage />;
      case 'import':
        return userRole === 'manager' ? <ImportOS onNavigateToOS={() => setActiveTab('work-orders')} /> : <Dashboard onNavigateToImport={() => setActiveTab('import')} />;
      case 'difficulties':
        return userRole === 'manager' ? <DifficultyLog /> : <Dashboard onNavigateToImport={() => setActiveTab('import')} />;
      case 'reports':
        return userRole === 'manager' ? <Reports /> : <Dashboard onNavigateToImport={() => setActiveTab('import')} />;
      case 'balanco':
        return (userRole === 'manager' || userRole === 'contract_admin') ? <BalancoPreventivas /> : <Dashboard onNavigateToImport={() => setActiveTab('import')} />;
      case 'settings':
        return <Settings userRole={userRole} />;
      default:
        return <Dashboard onNavigateToImport={() => setActiveTab('import')} />;
    }
  };

  const getRoleLabel = () => {
    switch (userRole) {
      case 'manager': return 'Gerente';
      case 'elaborador': return 'Elaborador';
      case 'contract_admin': return 'Admin. Contratos';
      default: return '';
    }
  };

  const getWorkOrdersLabel = () => {
    switch (userRole) {
      case 'manager': return 'Todas as O.S';
      case 'elaborador': return 'Minhas O.S';
      case 'contract_admin': return 'O.S por Contrato';
      default: return 'O.S';
    }
  };

  const getRoleStyles = () => {
    switch (userRole) {
      case 'manager':
        return { bg: 'rgba(209, 250, 229, 0.8)', color: '#059669', border: '#a7f3d0' };
      case 'elaborador':
        return { bg: 'rgba(219, 234, 254, 0.8)', color: '#2563eb', border: '#93c5fd' };
      case 'contract_admin':
        return { bg: 'rgba(243, 232, 255, 0.8)', color: '#7c3aed', border: '#c4b5fd' };
      default:
        return { bg: '#f3f4f6', color: '#6b7280', border: '#d1d5db' };
    }
  };

  const roleStyles = getRoleStyles();

  return (
    <div className="flex h-screen" style={{ background: OB.background, color: OB.foreground, fontFamily: 'DM Sans, sans-serif' }}>
      {/* Sidebar - Ocean Breeze Dark */}
      <aside
        className="flex flex-col transition-all duration-300 shadow-xl z-20"
        style={{
          width: isSidebarOpen ? '260px' : '80px',
          background: `linear-gradient(180deg, ${OB.sidebar} 0%, #0f172a 100%)`,
          borderRight: `1px solid ${OB.sidebarBorder}`
        }}
      >
        {/* Logo Header */}
        <div
          className="flex items-center justify-between h-16 px-4"
          style={{ borderBottom: `1px solid ${OB.sidebarBorder}` }}
        >
          {isSidebarOpen ? (
            <h1 className="font-bold text-xl tracking-tight" style={{ color: OB.sidebarPrimary }}>
              MAFFENG
            </h1>
          ) : (
            <span className="font-bold text-xl" style={{ color: OB.sidebarPrimary }}>M</span>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg transition-all duration-200"
            style={{
              background: 'rgba(255,255,255,0.05)',
              color: OB.sidebarForeground
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
          >
            {isSidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {userRole === 'manager' && (
            <NavItem
              icon={<BarChart2 size={20} />}
              label="Dashboard"
              isActive={activeTab === 'dashboard'}
              isOpen={isSidebarOpen}
              onClick={() => setActiveTab('dashboard')}
            />
          )}

          <NavItem
            icon={<ClipboardList size={20} />}
            label={getWorkOrdersLabel()}
            isActive={activeTab === 'work-orders'}
            isOpen={isSidebarOpen}
            onClick={() => setActiveTab('work-orders')}
          />

          <NavItem
            icon={<Bell size={20} />}
            label="Notificacoes"
            isActive={activeTab === 'notifications'}
            isOpen={isSidebarOpen}
            onClick={() => setActiveTab('notifications')}
            badgeCount={unreadNotifications}
          />

          {(userRole === 'manager' || userRole === 'elaborador') && (
            <NavItem
              icon={<CalendarDays size={20} />}
              label="Agenda"
              isActive={activeTab === 'agenda'}
              isOpen={isSidebarOpen}
              onClick={() => setActiveTab('agenda')}
            />
          )}

          {(userRole === 'manager' || userRole === 'contract_admin') && (
            <NavItem
              icon={<DollarSign size={20} />}
              label="Balanço"
              isActive={activeTab === 'balanco'}
              isOpen={isSidebarOpen}
              onClick={() => setActiveTab('balanco')}
            />
          )}

          {userRole === 'manager' && (
            <>
              <div className="my-3 mx-2" style={{ borderTop: `1px solid ${OB.sidebarBorder}` }}></div>
              <NavItem
                icon={<Users size={20} />}
                label="Equipe"
                isActive={activeTab === 'team'}
                isOpen={isSidebarOpen}
                onClick={() => setActiveTab('team')}
              />
              <NavItem
                icon={<FileSpreadsheet size={20} />}
                label="Importar O.S"
                isActive={activeTab === 'import'}
                isOpen={isSidebarOpen}
                onClick={() => setActiveTab('import')}
              />
              <NavItem
                icon={<AlertTriangle size={20} />}
                label="Dificuldades"
                isActive={activeTab === 'difficulties'}
                isOpen={isSidebarOpen}
                onClick={() => setActiveTab('difficulties')}
              />
              <NavItem
                icon={<FileText size={20} />}
                label="Relatórios"
                isActive={activeTab === 'reports'}
                isOpen={isSidebarOpen}
                onClick={() => setActiveTab('reports')}
              />
            </>
          )}
        </nav>

        {/* Footer */}
        <div className="p-4 space-y-2" style={{ borderTop: `1px solid ${OB.sidebarBorder}` }}>
          <NavItem
            icon={<SettingsIcon size={20} />}
            label="Configurações"
            isActive={activeTab === 'settings'}
            isOpen={isSidebarOpen}
            onClick={() => setActiveTab('settings')}
          />
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group"
            style={{ color: '#94a3b8' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)';
              e.currentTarget.style.color = '#f87171';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#94a3b8';
            }}
          >
            <LogOut size={20} />
            {isSidebarOpen && (
              <span className="font-medium whitespace-nowrap overflow-hidden text-sm text-left">
                Sair
              </span>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header - Ocean Breeze Light */}
        <header
          className="h-16 flex items-center justify-between px-6 z-10"
          style={{
            background: OB.card,
            borderBottom: `1px solid ${OB.border}`,
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}
        >
          <h2 className="text-xl font-semibold" style={{ color: OB.foreground }}>
            {activeTab === 'dashboard' && 'Dashboard Geral'}
            {activeTab === 'team' && 'Gestão de Equipe'}
            {activeTab === 'agenda' && 'Agenda'}
            {activeTab === 'work-orders' && getWorkOrdersLabel()}
            {activeTab === 'notifications' && 'Notificacoes'}
            {activeTab === 'import' && 'Importação de O.S'}
            {activeTab === 'difficulties' && 'Registro de Dificuldades'}
            {activeTab === 'reports' && 'Relatórios Gerenciais'}
            {activeTab === 'balanco' && 'Balanço das Preventivas'}
            {activeTab === 'settings' && 'Configurações'}
          </h2>
          <div className="flex items-center gap-4">
            <Notifications />
            <div
              className="h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm cursor-pointer transition-all duration-200"
              style={{
                background: roleStyles.bg,
                color: roleStyles.color,
                border: `2px solid ${roleStyles.border}`
              }}
            >
              {currentUser?.initials || 'U'}
            </div>
            <div className="hidden md:block text-sm">
              <p className="font-semibold leading-none" style={{ color: OB.foreground }}>{currentUser?.name}</p>
              <p className="text-xs mt-1" style={{ color: OB.mutedForeground }}>{getRoleLabel()}</p>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6" style={{ background: OB.background }}>
          <div className="max-w-7xl mx-auto animate-in fade-in duration-300">
            {renderContent()}
          </div>
        </main>
      </div>
      <Toaster />
    </div>
  );
}

function NavItem({ icon, label, isActive, isOpen, onClick, badgeCount }: any) {
  const activeStyle = {
    background: `linear-gradient(135deg, #22c55e, #16a34a)`,
    color: '#ffffff',
    boxShadow: '0 4px 12px rgba(34, 197, 94, 0.4)'
  };

  const inactiveStyle = {
    background: 'transparent',
    color: '#94a3b8'
  };

  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200"
      style={isActive ? activeStyle : {
        ...inactiveStyle,
        background: isHovered ? 'rgba(255,255,255,0.08)' : 'transparent',
        color: isHovered ? '#ffffff' : '#94a3b8'
      }}
    >
      <div className="relative" style={{ color: isActive ? '#ffffff' : (isHovered ? '#ffffff' : '#94a3b8') }}>
        {icon}
        {!isOpen && badgeCount > 0 && (
          <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-slate-900" />
        )}
      </div>
      {isOpen && (
        <span className="font-medium whitespace-nowrap overflow-hidden text-sm text-left">
          {label}
        </span>
      )}
      {isOpen && badgeCount > 0 && (
        <span className="ml-auto rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-semibold text-white">
          {badgeCount}
        </span>
      )}
    </button>
  );
}

export default App;
