import React, { useState } from 'react';
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
  LogOut
} from 'lucide-react';
import { MetricsAndResults } from './components/MetricsAndResults';
import { TeamList } from './components/TeamList';
import { AgendaAndChecklist } from './components/AgendaAndChecklist';
import { WorkOrders } from './components/WorkOrders';
import { Notifications } from './components/Notifications';
import { Login } from './components/Login';
import { ImportOS } from './components/ImportOS';
import { DifficultyLog } from './components/DifficultyLog';
import { Reports } from './components/Reports';
import { Settings } from './components/Settings';
import { Button } from './components/ui/button';

export type UserRole = 'manager' | 'technician' | null;

function App() {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Reset tab when role changes to ensure they land on a valid page
  const handleLogin = (role: 'manager' | 'technician') => {
    setUserRole(role);
    setActiveTab('dashboard'); // Both have a dashboard/metrics view
  };

  const handleLogout = () => {
    setUserRole(null);
    setActiveTab('dashboard');
  };

  if (!userRole) {
    return <Login onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <MetricsAndResults userRole={userRole} />;
      case 'team':
         // Somente Manager
        return userRole === 'manager' ? <TeamList /> : <MetricsAndResults userRole={userRole} />;
      case 'agenda':
        return <AgendaAndChecklist userRole={userRole} />;
      case 'work-orders':
        return <WorkOrders userRole={userRole} />;
      case 'import':
         // Somente Manager
        return userRole === 'manager' ? <ImportOS /> : <MetricsAndResults userRole={userRole} />;
      case 'difficulties':
         // Somente Manager
        return userRole === 'manager' ? <DifficultyLog /> : <MetricsAndResults userRole={userRole} />;
      case 'reports':
         // Somente Manager
        return userRole === 'manager' ? <Reports /> : <MetricsAndResults userRole={userRole} />;
      case 'settings':
        return <Settings userRole={userRole} />;
      default:
        return <MetricsAndResults userRole={userRole} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-slate-900 text-white transition-all duration-300 flex flex-col shadow-xl z-20`}
      >
        <div className="p-4 flex items-center justify-between border-b border-slate-700 h-16">
          {isSidebarOpen ? (
            <h1 className="font-bold text-xl tracking-tight text-emerald-400">MAFFENG</h1>
          ) : (
            <span className="font-bold text-xl text-emerald-400">M</span>
          )}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1 hover:bg-slate-800 rounded-md transition-colors"
          >
            <Menu size={20} />
          </button>
        </div>

        <nav className="flex-1 py-6 px-2 space-y-1">
          <NavItem 
            icon={<BarChart2 size={20} />} 
            label="Dashboard" 
            isActive={activeTab === 'dashboard'} 
            isOpen={isSidebarOpen}
            onClick={() => setActiveTab('dashboard')} 
          />
          
          <NavItem 
            icon={<ClipboardList size={20} />} 
            label={userRole === 'manager' ? "Todas as O.S" : "Minhas O.S"} 
            isActive={activeTab === 'work-orders'} 
            isOpen={isSidebarOpen}
            onClick={() => setActiveTab('work-orders')} 
          />

          <NavItem 
            icon={<CalendarDays size={20} />} 
            label="Agenda e Checklist" 
            isActive={activeTab === 'agenda'} 
            isOpen={isSidebarOpen}
            onClick={() => setActiveTab('agenda')} 
          />

          {userRole === 'manager' && (
            <>
              <div className="my-2 border-t border-slate-800 mx-2"></div>
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

        <div className="p-4 border-t border-slate-700 space-y-2">
          <NavItem 
            icon={<SettingsIcon size={20} />} 
            label="Configurações" 
            isActive={activeTab === 'settings'} 
            isOpen={isSidebarOpen}
            onClick={() => setActiveTab('settings')} 
          />
           <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group text-slate-400 hover:bg-red-900/30 hover:text-red-400`}
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="bg-white h-16 border-b border-slate-200 flex items-center justify-between px-6 shadow-sm z-10">
          <h2 className="text-xl font-semibold text-slate-800">
            {activeTab === 'dashboard' && 'Dashboard'}
            {activeTab === 'team' && 'Gestão de Equipe'}
            {activeTab === 'agenda' && 'Agenda e Checklist'}
            {activeTab === 'work-orders' && (userRole === 'manager' ? 'Todas as O.S' : 'Minhas O.S')}
            {activeTab === 'import' && 'Importação de O.S'}
            {activeTab === 'difficulties' && 'Registro de Dificuldades'}
            {activeTab === 'reports' && 'Relatórios Gerenciais'}
            {activeTab === 'settings' && 'Configurações'}
          </h2>
          <div className="flex items-center gap-4">
            <Notifications />
            <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold border cursor-pointer transition-colors
              ${userRole === 'manager' ? 'bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200' : 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200'}
            `}>
              {userRole === 'manager' ? 'PA' : 'DA'}
            </div>
            <div className="hidden md:block text-sm">
                <p className="font-medium text-slate-900 leading-none">{userRole === 'manager' ? 'Paulo Silva' : 'Danilo Costa'}</p>
                <p className="text-xs text-slate-500 mt-1">{userRole === 'manager' ? 'Gerente' : 'Técnico'}</p>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6 bg-slate-50">
          <div className="max-w-7xl mx-auto animate-in fade-in duration-300">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}

function NavItem({ icon, label, isActive, isOpen, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group
        ${isActive 
          ? 'bg-emerald-600 text-white shadow-md' 
          : 'text-slate-400 hover:bg-slate-800 hover:text-white'
        }`}
    >
      <div className={`${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>
        {icon}
      </div>
      {isOpen && (
        <span className="font-medium whitespace-nowrap overflow-hidden text-sm text-left">
          {label}
        </span>
      )}
    </button>
  );
}

export default App;
