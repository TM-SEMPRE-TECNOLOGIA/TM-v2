import React, { useState, useRef } from 'react';
import { 
  ArrowLeft,
  Calendar, 
  DollarSign, 
  User, 
  FileText, 
  Building2, 
  AlertTriangle, 
  Save, 
  CheckCircle2, 
  Clock,
  Plus,
  MessageSquare,
  Upload,
  File,
  X,
  Paperclip
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ScrollArea } from './ui/scroll-area';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Progress } from './ui/progress';

// Interfaces atualizadas
interface DifficultyEntry {
  id: string;
  text: string;
  author: string;
  date: string;
  role: 'manager' | 'technician' | 'admin';
}

interface DocumentEntry {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadDate: string;
  uploader: string;
}

interface WorkOrderData {
  id: string;             
  prefix: string;         
  agency: string;         
  contract: string;       
  contractAdmin: string;  // Novo: Administrador do Contrato
  dueDate: string;        
  
  status: string;         
  
  technician?: string;    
  elaborator?: string;    
  
  scheduling?: string;    
  liftingDate?: string;   
  
  liftingValue?: string;  
  approvedValue?: string; 
  
  difficulties: DifficultyEntry[]; // Novo: Lista de dificuldades
  documents: DocumentEntry[];
}

import { UserRole } from '../lib/types';

interface WorkOrderDetailsProps {
  orderId: string;
  onClose: () => void;
  userRole?: UserRole;
}

// Mock Data inicial
const mockOrderData: WorkOrderData = {
  id: 'OS-98234',
  prefix: '9794',
  agency: 'Agência Central - SP',
  contract: 'Manutenção Predial 2023/24',
  contractAdmin: 'Alexandre',
  dueDate: '2023-11-15',
  status: 'Fornecedor Acionado',
  technician: '',
  elaborator: 'Danilo Costa',
  scheduling: '',
  liftingDate: '',
  liftingValue: '',
  approvedValue: '',
  difficulties: [
    {
      id: '1',
      text: 'Acesso à casa de máquinas estava trancado. Chave com a gerência.',
      author: 'Danilo Costa',
      date: '2023-11-01 10:30',
      role: 'technician'
    }
  ],
  documents: [
    {
      id: 'doc-1',
      name: 'Relatório_Inicial.pdf',
      size: 2450000, // 2.45 MB
      type: 'application/pdf',
      uploadDate: '2023-11-01',
      uploader: 'Paulo Silva'
    }
  ]
};

export function WorkOrderDetails({ orderId, onClose, userRole = 'manager' }: WorkOrderDetailsProps) {
  const [data, setData] = useState<WorkOrderData>(mockOrderData);
  const [newDifficulty, setNewDifficulty] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handlers de atualização
  const updateField = (field: keyof WorkOrderData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddDifficulty = () => {
    if (!newDifficulty.trim()) return;
    
    const entry: DifficultyEntry = {
      id: Date.now().toString(),
      text: newDifficulty,
      author: userRole === 'manager' ? 'Paulo Silva' : 'Danilo Costa',
      date: new Date().toLocaleString('pt-BR'),
      role: userRole || 'admin'
    };

    setData(prev => ({
      ...prev,
      difficulties: [entry, ...prev.difficulties]
    }));
    setNewDifficulty('');
  };

  // Upload Logic
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(Array.from(e.target.files));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  const processFiles = (files: File[]) => {
    const validFiles = files.filter(file => {
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB
      if (!isValidSize) {
        alert(`O arquivo ${file.name} excede o limite de 10MB.`);
      }
      return isValidSize;
    });

    const newDocs: DocumentEntry[] = validFiles.map(file => ({
      id: Date.now().toString() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      uploadDate: new Date().toLocaleDateString('pt-BR'),
      uploader: userRole === 'manager' ? 'Paulo Silva' : 'Danilo Costa'
    }));

    setData(prev => ({
      ...prev,
      documents: [...prev.documents, ...newDocs]
    }));
  };

  const handleRemoveDocument = (id: string) => {
    setData(prev => ({
      ...prev,
      documents: prev.documents.filter(doc => doc.id !== id)
    }));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Lógica de Status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Fornecedor Acionado': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Levantamento OK': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Enviada para Orçamento': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Concluída': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Devolvida': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const isLocked = !!data.liftingDate; // Regra: Travado após Data Levantamento

  // Cálculo do Prazo de 15 dias para Relatório
  const getReportDeadline = () => {
    if (!data.liftingDate) return null;
    const date = new Date(data.liftingDate);
    date.setDate(date.getDate() + 15);
    return date.toLocaleDateString('pt-BR');
  };

  const reportDeadline = getReportDeadline();

  return (
    <div className="fixed inset-0 z-50 bg-slate-50 flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Header de Página */}
        <div className="bg-white border-b border-slate-200 p-4 px-6 shadow-sm flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
             <Button variant="ghost" onClick={onClose} className="text-slate-500 hover:text-slate-900">
               <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
             </Button>
             <Separator orientation="vertical" className="h-6" />
             <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-xl font-bold text-slate-900">Detalhes da OS #{orderId}</h1>
                  <Badge className={`${getStatusColor(data.status)} border px-2 py-0.5 text-xs`}>
                    {data.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                  <span className="flex items-center gap-1">
                    <Building2 size={12} /> {data.prefix} - {data.agency}
                  </span>
                  <span className="h-3 w-[1px] bg-slate-300"></span>
                  <span className="flex items-center gap-1 font-medium text-slate-700">
                    <FileText size={12} /> {data.contract}
                  </span>
                  <span className="h-3 w-[1px] bg-slate-300"></span>
                  <span className="flex items-center gap-1 text-slate-500">
                     Admin: <span className="font-medium text-slate-700">{data.contractAdmin}</span>
                  </span>
                </div>
             </div>
          </div>
          
          <div className="flex gap-2">
             <Button className="bg-emerald-600 hover:bg-emerald-700 gap-2">
               <Save size={16} /> Salvar Alterações
             </Button>
          </div>
        </div>

        {/* Corpo Scrollável */}
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-6xl mx-auto space-y-6">
          
          {/* 1. Datas e Prazos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500 uppercase flex items-center gap-2">
                  <Clock size={16} /> Prazos e Agendamento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-xs text-slate-500">Vencimento (Fornecedor)</Label>
                  <div className="font-medium text-slate-900 flex items-center gap-2 mt-1">
                    <Calendar size={16} className="text-red-500" />
                    {data.dueDate}
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label className="flex justify-between">
                    Previsão de Agendamento
                    {isLocked && <Badge variant="secondary" className="text-[10px]">Travado</Badge>}
                  </Label>
                  {userRole === 'manager' ? (
                    <Input 
                      type="datetime-local" 
                      value={data.scheduling} 
                      onChange={(e) => updateField('scheduling', e.target.value)}
                      disabled={isLocked}
                      className={isLocked ? "bg-slate-100" : "bg-white"}
                    />
                  ) : (
                    <div className="p-2 bg-slate-100 rounded text-sm text-slate-700">
                      {data.scheduling || 'Aguardando definição'}
                    </div>
                  )}
                  <p className="text-[10px] text-slate-400">Travado após registro do levantamento.</p>
                </div>
              </CardContent>
            </Card>

            <Card className={data.liftingDate ? 'border-emerald-200 bg-emerald-50/30' : ''}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500 uppercase flex items-center gap-2">
                  <CheckCircle2 size={16} className={data.liftingDate ? 'text-emerald-600' : ''} /> 
                  Execução do Levantamento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="space-y-2">
                  <Label>Data Real do Levantamento</Label>
                   {userRole === 'manager' ? (
                     <Input 
                        type="datetime-local" 
                        value={data.liftingDate}
                        onChange={(e) => {
                          updateField('liftingDate', e.target.value);
                          if(!data.status.includes('OK')) updateField('status', 'Levantamento OK');
                        }}
                        className="bg-white"
                      />
                   ) : (
                      <div className="p-2 bg-slate-100 rounded text-sm text-slate-700">
                        {data.liftingDate || 'Aguardando registro pelo Gerente'}
                      </div>
                   )}
                   <p className="text-[10px] text-slate-500">
                     * Ao preencher, inicia-se o prazo de 15 dias para o relatório.
                   </p>
                   {reportDeadline && (
                      <div className="mt-2 p-2 bg-blue-50 border border-blue-100 rounded-md flex items-center justify-between">
                        <span className="text-xs text-blue-700 font-medium">Prazo Relatório:</span>
                        <Badge variant="secondary" className="bg-white text-blue-700 border-blue-200">
                          {reportDeadline}
                        </Badge>
                      </div>
                   )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500 uppercase flex items-center gap-2">
                  <DollarSign size={16} /> Financeiro
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Valor Levantamento (R$)</Label>
                  <Input 
                    placeholder="0,00" 
                    value={data.liftingValue}
                    onChange={(e) => updateField('liftingValue', e.target.value)}
                    disabled={!!data.approvedValue} 
                    className={userRole === 'technician' ? 'bg-white border-blue-300' : 'bg-slate-100'}
                  />
                  <p className="text-[10px] text-slate-500">Custo do técnico para ir ao local.</p>
                </div>
                
                <div className="space-y-2 opacity-75">
                  <Label>Valor Aprovado (R$)</Label>
                  <Input 
                    value={data.approvedValue} 
                    readOnly 
                    placeholder="Aguardando aprovação..."
                    className="bg-slate-100"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 2. Equipe e Dificuldades */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-slate-500 uppercase flex items-center gap-2">
                  <User size={16} /> Definição de Equipe
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label className="flex justify-between">
                    Técnico de Campo
                    {isLocked && <Badge variant="secondary" className="text-[10px]">Travado</Badge>}
                  </Label>
                  {userRole === 'manager' && !isLocked ? (
                     <Select value={data.technician} onValueChange={(v) => updateField('technician', v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o técnico" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Danilo Costa">Danilo Costa</SelectItem>
                        <SelectItem value="João Silva">João Silva</SelectItem>
                        <SelectItem value="Pedro Santos">Pedro Santos</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                     <div className="p-2 border rounded bg-slate-100 text-sm font-medium">
                       {data.technician || 'Não atribuído'}
                     </div>
                  )}
                  <p className="text-[10px] text-slate-500">Quem vai fisicamente ao local. Travado após levantamento.</p>
                </div>

                <div className="space-y-2">
                  <Label>Elaborador do Relatório</Label>
                  {userRole === 'manager' ? (
                     <Select value={data.elaborator} onValueChange={(v) => updateField('elaborator', v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o elaborador" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Danilo Costa">Danilo Costa</SelectItem>
                        <SelectItem value="Paulo Silva">Paulo Silva</SelectItem>
                        <SelectItem value="Engenharia">Engenharia</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                     <div className="p-2 border rounded bg-slate-100 text-sm font-medium">
                       {data.elaborator || 'Não atribuído'}
                     </div>
                  )}
                   <p className="text-[10px] text-slate-500">Responsável pela OS no sistema. Define quem visualiza em "Minhas OS".</p>
                </div>
              </CardContent>
            </Card>

             <Card className="flex flex-col h-[400px]">
               <CardHeader className="pb-3">
                 <div className="flex items-center justify-between">
                   <CardTitle className="text-sm font-medium text-slate-500 uppercase flex items-center gap-2">
                     <AlertTriangle size={16} /> Histórico de Dificuldades
                   </CardTitle>
                   <Badge variant="outline">{data.difficulties.length}</Badge>
                 </div>
               </CardHeader>
               <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
                 
                 <div className="flex gap-2">
                   <Input 
                     placeholder="Registrar nova dificuldade..." 
                     value={newDifficulty}
                     onChange={(e) => setNewDifficulty(e.target.value)}
                     onKeyDown={(e) => e.key === 'Enter' && handleAddDifficulty()}
                   />
                   <Button size="icon" onClick={handleAddDifficulty} disabled={!newDifficulty.trim()}>
                     <Plus size={16} />
                   </Button>
                 </div>

                 <ScrollArea className="flex-1 pr-4">
                   <div className="space-y-4">
                     {data.difficulties.length === 0 && (
                       <div className="text-center text-slate-400 py-8 text-sm">
                         Nenhuma dificuldade registrada.
                       </div>
                     )}
                     {data.difficulties.map((diff) => (
                       <div key={diff.id} className="flex gap-3 text-sm">
                         <Avatar className="h-8 w-8 mt-1">
                            <AvatarFallback className={diff.role === 'manager' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}>
                              {diff.author.substring(0,2).toUpperCase()}
                            </AvatarFallback>
                         </Avatar>
                         <div className="flex-1 bg-slate-50 p-3 rounded-md border border-slate-100">
                           <div className="flex justify-between items-start mb-1">
                             <span className="font-semibold text-slate-900">{diff.author}</span>
                             <span className="text-[10px] text-slate-400">{diff.date}</span>
                           </div>
                           <p className="text-slate-700">{diff.text}</p>
                         </div>
                       </div>
                     ))}
                   </div>
                 </ScrollArea>
               </CardContent>
             </Card>
          </div>

          {/* 3. Área de Documentos (NOVO) */}
          <Card className="col-span-1">
             <CardHeader>
                <CardTitle className="text-sm font-medium text-slate-500 uppercase flex items-center gap-2">
                  <Paperclip size={16} /> Documentos e Anexos
                </CardTitle>
             </CardHeader>
             <CardContent>
                <div 
                   className={`
                      border-2 border-dashed rounded-lg p-8 text-center transition-colors
                      ${isDragging ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-slate-300'}
                   `}
                   onDragOver={handleDragOver}
                   onDragLeave={handleDragLeave}
                   onDrop={handleDrop}
                >
                   <div className="flex flex-col items-center justify-center gap-2">
                      <div className="p-3 bg-slate-100 rounded-full text-slate-500">
                         <Upload size={24} />
                      </div>
                      <div>
                         <p className="text-sm font-medium text-slate-900">
                            Arraste arquivos aqui ou <span className="text-emerald-600 cursor-pointer hover:underline" onClick={() => fileInputRef.current?.click()}>navegue</span>
                         </p>
                         <p className="text-xs text-slate-500 mt-1">
                            PDF, Excel, Word, Imagens (Máx. 10MB)
                         </p>
                      </div>
                      <Input 
                         ref={fileInputRef}
                         type="file" 
                         multiple 
                         className="hidden" 
                         onChange={handleFileSelect}
                      />
                   </div>
                </div>

                <div className="mt-6 space-y-3">
                   {data.documents.length === 0 ? (
                      <p className="text-center text-sm text-slate-400 italic">Nenhum documento anexado.</p>
                   ) : (
                      data.documents.map(doc => (
                         <div key={doc.id} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-md group hover:border-slate-300 transition-colors">
                            <div className="flex items-center gap-3 overflow-hidden">
                               <div className="bg-white p-2 border rounded text-slate-500">
                                  <FileText size={20} />
                               </div>
                               <div className="min-w-0">
                                  <p className="text-sm font-medium text-slate-900 truncate pr-4">{doc.name}</p>
                                  <p className="text-xs text-slate-500 flex items-center gap-2">
                                     <span>{formatFileSize(doc.size)}</span>
                                     <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                     <span>{doc.uploader}</span>
                                     <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                     <span>{doc.uploadDate}</span>
                                  </p>
                               </div>
                            </div>
                            <Button 
                               variant="ghost" 
                               size="icon" 
                               className="text-slate-400 hover:text-red-500 hover:bg-red-50"
                               onClick={() => handleRemoveDocument(doc.id)}
                            >
                               <X size={16} />
                            </Button>
                         </div>
                      ))
                   )}
                </div>
             </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
