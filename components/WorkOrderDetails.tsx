import React, { useState, useRef, useEffect } from 'react';
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
  Upload,
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
import { UserRole, OSStatus, USERS, TECNICOS, Dificuldade, OrdemServico } from '../lib/types';
import { useOSStore, getOrdemServicoById } from '../lib/store';
import { useToast } from '../hooks/use-toast';

interface DocumentEntry {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadDate: string;
  uploader: string;
}

interface WorkOrderDetailsProps {
  orderId: string;
  onClose: () => void;
  userRole?: UserRole;
  currentUser?: typeof USERS[0];
}

const STATUS_OPTIONS: OSStatus[] = [
  'Fornecedor Acionado',
  'Em Levantamento',
  'Em Elaboração',
  'Em Orçamento',
  'Concluída',
  'Com Dificuldade',
  'Mudança de Contrato'
];

export function WorkOrderDetails({ orderId, onClose, userRole = 'manager', currentUser }: WorkOrderDetailsProps) {
  const updateOrdemServico = useOSStore((state) => state.updateOrdemServico);
  const ordensServico = useOSStore((state) => state.ordensServico);
  const { toast } = useToast();

  const ordemOriginal = ordensServico.find(os => os.id === orderId);
  
  const [formData, setFormData] = useState<Partial<OrdemServico>>({});
  const [newDifficulty, setNewDifficulty] = useState('');
  const [documents, setDocuments] = useState<DocumentEntry[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ordemOriginal) {
      setFormData({
        situacao: ordemOriginal.situacao,
        tecnico: ordemOriginal.tecnico,
        tecnicoId: ordemOriginal.tecnicoId,
        elaborador: ordemOriginal.elaborador,
        elaboradorId: ordemOriginal.elaboradorId,
        agendamento: ordemOriginal.agendamento,
        dataLevantamento: ordemOriginal.dataLevantamento,
        valorLevantamento: ordemOriginal.valorLevantamento,
        valorOrcado: ordemOriginal.valorOrcado,
        valorAprovado: ordemOriginal.valorAprovado,
        dificuldades: ordemOriginal.dificuldades || []
      });
    }
  }, [ordemOriginal]);

  if (!ordemOriginal) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-500">O.S não encontrada</p>
          <Button onClick={onClose} className="mt-4">Voltar</Button>
        </div>
      </div>
    );
  }

  const updateField = <K extends keyof OrdemServico>(field: K, value: OrdemServico[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    updateOrdemServico(orderId, formData);
    setHasChanges(false);
    toast({
      title: "Alterações salvas",
      description: "Os dados da O.S foram atualizados com sucesso."
    });
  };

  const handleAddDifficulty = () => {
    if (!newDifficulty.trim()) return;
    
    const entry: Dificuldade = {
      id: Date.now().toString(),
      texto: newDifficulty,
      autor: currentUser?.name || 'Sistema',
      dataHora: new Date().toLocaleString('pt-BR')
    };

    const updatedDificuldades = [entry, ...(formData.dificuldades || [])];
    updateField('dificuldades', updatedDificuldades);
    setNewDifficulty('');
  };

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
      const isValidSize = file.size <= 10 * 1024 * 1024;
      if (!isValidSize) {
        toast({
          title: "Arquivo muito grande",
          description: `O arquivo ${file.name} excede o limite de 10MB.`,
          variant: "destructive"
        });
      }
      return isValidSize;
    });

    const newDocs: DocumentEntry[] = validFiles.map(file => ({
      id: Date.now().toString() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      uploadDate: new Date().toLocaleDateString('pt-BR'),
      uploader: currentUser?.name || 'Sistema'
    }));

    setDocuments(prev => [...prev, ...newDocs]);
    
    const anexosAtuais = ordemOriginal.anexos || [];
    updateField('anexos', [...anexosAtuais, ...newDocs.map(d => d.name)]);
  };

  const handleRemoveDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusColor = (status: OSStatus) => {
    const colors: Record<OSStatus, string> = {
      'Fornecedor Acionado': 'bg-blue-100 text-blue-700 border-blue-200',
      'Em Levantamento': 'bg-amber-100 text-amber-700 border-amber-200',
      'Em Elaboração': 'bg-orange-100 text-orange-700 border-orange-200',
      'Em Orçamento': 'bg-purple-100 text-purple-700 border-purple-200',
      'Concluída': 'bg-emerald-100 text-emerald-700 border-emerald-200',
      'Com Dificuldade': 'bg-red-100 text-red-700 border-red-200',
      'Mudança de Contrato': 'bg-pink-100 text-pink-700 border-pink-200'
    };
    return colors[status] || 'bg-slate-100 text-slate-700';
  };

  const canEditStatus = userRole === 'manager' || userRole === 'elaborador';
  const canEditTecnico = userRole === 'manager';
  const canEditElaborador = userRole === 'manager';
  const canEditValorAprovado = userRole === 'contract_admin' || userRole === 'manager';
  const canEditValorOrcado = userRole === 'elaborador' || userRole === 'manager';

  const elaboradores = USERS.filter(u => u.role === 'elaborador');

  return (
    <div className="fixed inset-0 z-50 bg-slate-50 flex flex-col animate-in slide-in-from-right duration-300">
      <div className="bg-white border-b border-slate-200 p-4 px-6 shadow-sm flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onClose} className="text-slate-500 hover:text-slate-900">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-slate-900">O.S {ordemOriginal.os}</h1>
              <Badge className={`${getStatusColor(formData.situacao || ordemOriginal.situacao)} border px-2 py-0.5 text-xs`}>
                {formData.situacao || ordemOriginal.situacao}
              </Badge>
              {hasChanges && (
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                  Alterações pendentes
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
              <span className="flex items-center gap-1">
                <Building2 size={12} /> {ordemOriginal.prefixo} - {ordemOriginal.agencia}
              </span>
              <span className="h-3 w-[1px] bg-slate-300"></span>
              <span className="flex items-center gap-1 font-medium text-slate-700">
                <FileText size={12} /> {ordemOriginal.contrato}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            className="bg-emerald-600 hover:bg-emerald-700 gap-2"
            onClick={handleSave}
            disabled={!hasChanges}
          >
            <Save size={16} /> Salvar Alterações
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-6xl mx-auto space-y-6">
        
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500 uppercase flex items-center gap-2">
                  <Clock size={16} /> Prazos e Agendamento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-xs text-slate-500">Vencimento</Label>
                  <div className="font-medium text-slate-900 flex items-center gap-2 mt-1">
                    <Calendar size={16} className="text-red-500" />
                    {ordemOriginal.vencimento || 'Não definido'}
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label>Previsão de Agendamento</Label>
                  {userRole === 'manager' ? (
                    <Input 
                      type="date" 
                      value={formData.agendamento || ''} 
                      onChange={(e) => updateField('agendamento', e.target.value)}
                    />
                  ) : (
                    <div className="p-2 bg-slate-100 rounded text-sm text-slate-700">
                      {formData.agendamento || 'Aguardando definição'}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Data do Levantamento</Label>
                  {userRole === 'manager' || userRole === 'elaborador' ? (
                    <Input 
                      type="date" 
                      value={formData.dataLevantamento || ''} 
                      onChange={(e) => updateField('dataLevantamento', e.target.value)}
                    />
                  ) : (
                    <div className="p-2 bg-slate-100 rounded text-sm text-slate-700">
                      {formData.dataLevantamento || 'Não registrado'}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500 uppercase flex items-center gap-2">
                  <CheckCircle2 size={16} /> Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Situação Atual</Label>
                  {canEditStatus ? (
                    <Select 
                      value={formData.situacao || ordemOriginal.situacao} 
                      onValueChange={(v) => updateField('situacao', v as OSStatus)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map(status => (
                          <SelectItem key={status} value={status}>{status}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="p-2 bg-slate-100 rounded text-sm font-medium">
                      {formData.situacao || ordemOriginal.situacao}
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
                  <Label>Valor Orçado (R$)</Label>
                  {canEditValorOrcado ? (
                    <Input 
                      type="number"
                      step="0.01"
                      placeholder="0,00" 
                      value={formData.valorOrcado || ''}
                      onChange={(e) => updateField('valorOrcado', e.target.value ? parseFloat(e.target.value) : null)}
                    />
                  ) : (
                    <div className="p-2 bg-slate-100 rounded text-sm">
                      {formData.valorOrcado ? `R$ ${formData.valorOrcado.toLocaleString('pt-BR')}` : '-'}
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label>Valor Aprovado (R$)</Label>
                  {canEditValorAprovado ? (
                    <Input 
                      type="number"
                      step="0.01"
                      placeholder="0,00"
                      value={formData.valorAprovado || ''} 
                      onChange={(e) => updateField('valorAprovado', e.target.value ? parseFloat(e.target.value) : null)}
                      className="border-emerald-300 focus:border-emerald-500"
                    />
                  ) : (
                    <div className="p-2 bg-slate-100 rounded text-sm">
                      {formData.valorAprovado ? `R$ ${formData.valorAprovado.toLocaleString('pt-BR')}` : 'Aguardando aprovação'}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-slate-500 uppercase flex items-center gap-2">
                  <User size={16} /> Definição de Equipe
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Técnico de Campo</Label>
                  {canEditTecnico ? (
                    <Select 
                      value={formData.tecnicoId || '__none__'} 
                      onValueChange={(v) => {
                        if (v === '__none__') {
                          updateField('tecnicoId', null);
                          updateField('tecnico', null);
                        } else {
                          const tec = TECNICOS.find(t => t.id === v);
                          updateField('tecnicoId', v);
                          updateField('tecnico', tec?.nome || null);
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o técnico" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__none__">Não atribuído</SelectItem>
                        {TECNICOS.map(tec => (
                          <SelectItem key={tec.id} value={tec.id}>{tec.nome}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="p-2 border rounded bg-slate-100 text-sm font-medium">
                      {formData.tecnico || 'Não atribuído'}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Elaborador do Relatório</Label>
                  {canEditElaborador ? (
                    <Select 
                      value={formData.elaboradorId || '__none__'} 
                      onValueChange={(v) => {
                        if (v === '__none__') {
                          updateField('elaboradorId', null);
                          updateField('elaborador', null);
                        } else {
                          const elab = USERS.find(u => u.id === v);
                          updateField('elaboradorId', v);
                          updateField('elaborador', elab?.name || null);
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o elaborador" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__none__">Não atribuído</SelectItem>
                        {elaboradores.map(elab => (
                          <SelectItem key={elab.id} value={elab.id}>{elab.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="p-2 border rounded bg-slate-100 text-sm font-medium">
                      {formData.elaborador || 'Não atribuído'}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="flex flex-col h-[400px]">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-slate-500 uppercase flex items-center gap-2">
                    <AlertTriangle size={16} /> Histórico de Dificuldades
                  </CardTitle>
                  <Badge variant="outline">{(formData.dificuldades || []).length}</Badge>
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
                    {(formData.dificuldades || []).length === 0 && (
                      <div className="text-center text-slate-400 py-8 text-sm">
                        Nenhuma dificuldade registrada.
                      </div>
                    )}
                    {(formData.dificuldades || []).map((diff) => (
                      <div key={diff.id} className="flex gap-3 text-sm">
                        <Avatar className="h-8 w-8 mt-1">
                          <AvatarFallback className="bg-blue-100 text-blue-700">
                            {diff.autor.substring(0,2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 bg-slate-50 p-3 rounded-md border border-slate-100">
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-semibold text-slate-900">{diff.autor}</span>
                            <span className="text-[10px] text-slate-400">{diff.dataHora}</span>
                          </div>
                          <p className="text-slate-700">{diff.texto}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

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
                {documents.length === 0 && (ordemOriginal.anexos || []).length === 0 ? (
                  <p className="text-center text-sm text-slate-400 italic">Nenhum documento anexado.</p>
                ) : (
                  <>
                    {(ordemOriginal.anexos || []).map((anexo, idx) => (
                      <div key={`existing-${idx}`} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-md">
                        <div className="flex items-center gap-3">
                          <div className="bg-white p-2 border rounded text-slate-500">
                            <FileText size={20} />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-900">{anexo}</p>
                            <p className="text-xs text-slate-500">Anexo existente</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    {documents.map(doc => (
                      <div key={doc.id} className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-100 rounded-md group">
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
                              <Badge variant="secondary" className="ml-2 text-[10px]">Novo</Badge>
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
                    ))}
                  </>
                )}
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
