import React, { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle, X, ArrowRight, Loader2, AlertTriangle, Info } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { Label } from './ui/label';
import * as XLSX from 'xlsx';
import { OrdemServico, OSStatus, USERS, TECNICOS } from '../lib/types';
import { useOSStore } from '../lib/store';
import { useToast } from '../hooks/use-toast';

interface ColumnMapping {
  os: string;
  prefixo: string;
  agencia: string;
  contrato: string;
  vencimento: string;
  tecnico: string;
  elaborador: string;
  situacao: string;
}

interface ImportResult {
  imported: number;
  enhanced: number;
  total: number;
  errors: string[];
  warnings: string[];
  enhancements: string[];
}

interface ImportOSProps {
  onNavigateToOS?: () => void;
}

const STATUS_MAPPINGS: Record<string, OSStatus> = {
  'fornecedor acionado': 'Fornecedor Acionado',
  'acionado': 'Fornecedor Acionado',
  'novo': 'Fornecedor Acionado',
  'nova': 'Fornecedor Acionado',
  'aberta': 'Fornecedor Acionado',
  'aberto': 'Fornecedor Acionado',
  'em levantamento': 'Em Levantamento',
  'levantamento': 'Em Levantamento',
  'em elaboração': 'Em Elaboração',
  'elaboração': 'Em Elaboração',
  'elaboracao': 'Em Elaboração',
  'em orçamento': 'Em Orçamento',
  'orçamento': 'Em Orçamento',
  'orcamento': 'Em Orçamento',
  'concluída': 'Concluída',
  'concluida': 'Concluída',
  'finalizada': 'Concluída',
  'finalizado': 'Concluída',
  'fechada': 'Concluída',
  'com dificuldade': 'Com Dificuldade',
  'dificuldade': 'Com Dificuldade',
  'problema': 'Com Dificuldade',
  'mudança de contrato': 'Mudança de Contrato',
  'mudanca de contrato': 'Mudança de Contrato',
};

function normalizeStatus(rawStatus: string): OSStatus {
  if (!rawStatus) return 'Fornecedor Acionado';
  
  const status = String(rawStatus).trim().toLowerCase();
  
  if (STATUS_MAPPINGS[status]) {
    return STATUS_MAPPINGS[status];
  }
  
  for (const [key, value] of Object.entries(STATUS_MAPPINGS)) {
    if (status.includes(key) || key.includes(status)) {
      return value;
    }
  }
  
  return 'Fornecedor Acionado';
}

function detectHeaderRow(data: any[][]): { headerIndex: number; headers: string[] } {
  const headerKeywords = ['os', 'o.s', 'ordem', 'agencia', 'agência', 'contrato', 'prefixo', 'vencimento', 'prazo', 'data'];
  
  for (let i = 0; i < Math.min(10, data.length); i++) {
    const row = data[i];
    if (!row || !Array.isArray(row)) continue;
    
    const rowStr = row.map(cell => String(cell || '').toLowerCase().trim());
    const matchCount = rowStr.filter(cell => 
      headerKeywords.some(keyword => cell.includes(keyword))
    ).length;
    
    if (matchCount >= 2) {
      return {
        headerIndex: i,
        headers: row.map(h => String(h || '').trim())
      };
    }
  }
  
  return {
    headerIndex: 0,
    headers: data[0]?.map(h => String(h || '').trim()) || []
  };
}

function autoMapColumns(headers: string[]): ColumnMapping {
  const mapping: ColumnMapping = {
    os: '',
    prefixo: '',
    agencia: '',
    contrato: '',
    vencimento: '',
    tecnico: '',
    elaborador: '',
    situacao: ''
  };

  headers.forEach((header, index) => {
    const h = header.toLowerCase().trim();
    
    if ((h.includes('os') || h === 'o.s' || h.includes('ordem')) && !mapping.os) {
      mapping.os = String(index);
    } else if ((h.includes('prefixo') || h.includes('prefix') || h.includes('código')) && !mapping.prefixo) {
      mapping.prefixo = String(index);
    } else if ((h.includes('agencia') || h.includes('agência') || h.includes('local') || h.includes('unidade')) && !mapping.agencia) {
      mapping.agencia = String(index);
    } else if ((h.includes('contrato') || h.includes('contract')) && !mapping.contrato) {
      mapping.contrato = String(index);
    } else if ((h.includes('vencimento') || h.includes('prazo') || h.includes('data')) && !mapping.vencimento) {
      mapping.vencimento = String(index);
    } else if ((h.includes('tecnico') || h.includes('técnico') || h.includes('executor')) && !mapping.tecnico) {
      mapping.tecnico = String(index);
    } else if ((h.includes('elaborador') || h.includes('responsavel') || h.includes('responsável')) && !mapping.elaborador) {
      mapping.elaborador = String(index);
    } else if ((h.includes('situacao') || h.includes('situação') || h.includes('status') || h.includes('estado')) && !mapping.situacao) {
      mapping.situacao = String(index);
    }
  });

  return mapping;
}

export function ImportOS({ onNavigateToOS }: ImportOSProps) {
  const [step, setStep] = useState<'upload' | 'mapping' | 'preview' | 'success'>('upload');
  const [fileName, setFileName] = useState('');
  const [rawData, setRawData] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [headerIndex, setHeaderIndex] = useState(0);
  const [mapping, setMapping] = useState<ColumnMapping>({
    os: '', prefixo: '', agencia: '', contrato: '', vencimento: '', tecnico: '', elaborador: '', situacao: ''
  });
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { importOrdensServico, ordensServico } = useOSStore();
  const { toast } = useToast();

  const processFile = useCallback((file: File) => {
    if (!file) return;

    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'application/excel',
      'text/csv'
    ];
    const isValidType = allowedTypes.includes(file.type) || file.name.match(/\.(xlsx|xls|csv)$/i);

    if (!isValidType) {
      toast({
        title: "Arquivo inválido",
        description: "Apenas arquivos Excel (.xlsx, .xls) ou CSV são aceitos.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      setTimeout(() => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

          if (jsonData.length < 2) {
            setIsLoading(false);
            toast({
              title: "Arquivo vazio",
              description: "O arquivo deve conter pelo menos cabeçalho e dados.",
              variant: "destructive"
            });
            return;
          }

          const { headerIndex: detectedHeaderIndex, headers: detectedHeaders } = detectHeaderRow(jsonData);
          
          setHeaderIndex(detectedHeaderIndex);
          setHeaders(detectedHeaders);
          setRawData(jsonData.slice(detectedHeaderIndex + 1));
          
          const autoMapping = autoMapColumns(detectedHeaders);
          setMapping(autoMapping);

          const autoMappedCount = Object.values(autoMapping).filter(v => v !== '').length;
          
          setTimeout(() => {
            setIsLoading(false);
            if (autoMappedCount > 0) {
              toast({
                title: "Colunas detectadas",
                description: `${autoMappedCount} colunas foram mapeadas automaticamente.`,
              });
            }
            setStep('mapping');
          }, 800);
        } catch (error) {
          console.error('Erro ao ler arquivo:', error);
          setIsLoading(false);
          toast({
            title: "Erro na leitura",
            description: "Não foi possível ler o arquivo. Verifique se é um Excel válido.",
            variant: "destructive"
          });
        }
      }, 50);
    };
    
    reader.readAsBinaryString(file);
  }, [toast]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);

  const handleConfirmMapping = () => {
    if (!mapping.os || !mapping.agencia || !mapping.contrato) {
      toast({
        title: "Mapeamento incompleto",
        description: "Mapeie pelo menos: OS, Agência e Contrato",
        variant: "destructive"
      });
      return;
    }

    const errors: string[] = [];
    const warnings: string[] = [];
    const enhancements: string[] = [];

    const mapped = rawData
      .filter((row, index) => {
        const osValue = row[parseInt(mapping.os)];
        if (!osValue || String(osValue).trim() === '') {
          return false;
        }
        const osStr = String(osValue).toLowerCase();
        if (osStr.includes('total') || osStr.includes('soma')) {
          return false;
        }
        return true;
      })
      .map((row, index) => {
        const lineNumber = headerIndex + index + 2;
        
        const os = String(row[parseInt(mapping.os)] || '').trim();
        const prefixo = mapping.prefixo ? String(row[parseInt(mapping.prefixo)] || '').trim() : '';
        const agencia = String(row[parseInt(mapping.agencia)] || '').trim();
        const contrato = String(row[parseInt(mapping.contrato)] || '').trim();
        const vencimento = mapping.vencimento ? formatDateToISO(row[parseInt(mapping.vencimento)]) : '';
        const tecnico = mapping.tecnico ? String(row[parseInt(mapping.tecnico)] || '').trim() : '';
        const elaborador = mapping.elaborador ? String(row[parseInt(mapping.elaborador)] || '').trim() : '';
        
        let situacao: OSStatus = 'Fornecedor Acionado';
        if (mapping.situacao) {
          const rawSituacao = String(row[parseInt(mapping.situacao)] || '').trim();
          const normalizedSituacao = normalizeStatus(rawSituacao);
          if (rawSituacao && normalizedSituacao !== rawSituacao) {
            enhancements.push(`Linha ${lineNumber}: situação "${rawSituacao}" → "${normalizedSituacao}"`);
          }
          situacao = normalizedSituacao;
        }

        if (!agencia) {
          warnings.push(`Linha ${lineNumber}: Agência em branco`);
        }
        if (!contrato) {
          warnings.push(`Linha ${lineNumber}: Contrato em branco`);
        }

        return { os, prefixo, agencia, contrato, vencimento, tecnico, elaborador, situacao, lineNumber };
      });

    if (mapped.length === 0) {
      toast({
        title: "Nenhum dado válido",
        description: "Não foram encontradas linhas válidas para importar.",
        variant: "destructive"
      });
      return;
    }

    setPreviewData(mapped);
    setImportResult({
      imported: 0,
      enhanced: enhancements.length,
      total: mapped.length,
      errors,
      warnings,
      enhancements
    });
    setStep('preview');
  };

  const formatDateToISO = (value: any): string => {
    if (!value) return '';
    
    if (typeof value === 'number') {
      try {
        const date = XLSX.SSF.parse_date_code(value);
        if (date) {
          const d = new Date(date.y, date.m - 1, date.d);
          return d.toISOString().split('T')[0];
        }
      } catch {
        return '';
      }
    }
    
    const strValue = String(value).trim();
    
    const brMatch = strValue.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (brMatch) {
      const [, day, month, year] = brMatch;
      const d = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      if (!isNaN(d.getTime())) {
        return d.toISOString().split('T')[0];
      }
    }
    
    const brMatch2 = strValue.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2})$/);
    if (brMatch2) {
      const [, day, month, year2d] = brMatch2;
      const fullYear = parseInt(year2d) > 50 ? 1900 + parseInt(year2d) : 2000 + parseInt(year2d);
      const d = new Date(fullYear, parseInt(month) - 1, parseInt(day));
      if (!isNaN(d.getTime())) {
        return d.toISOString().split('T')[0];
      }
    }
    
    const isoMatch = strValue.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (isoMatch) {
      return strValue.substring(0, 10);
    }
    
    try {
      const d = new Date(strValue);
      if (!isNaN(d.getTime())) {
        return d.toISOString().split('T')[0];
      }
    } catch {}
    
    return '';
  };

  const findElaboradorId = (name: string | null): string | null => {
    if (!name) return null;
    const nameLower = name.toLowerCase().trim();
    const elaborador = USERS.filter(u => u.role === 'elaborador').find(u => 
      u.name.toLowerCase() === nameLower || 
      u.name.toLowerCase().includes(nameLower) ||
      nameLower.includes(u.name.toLowerCase())
    );
    return elaborador?.id || null;
  };

  const findTecnicoId = (name: string | null): string | null => {
    if (!name) return null;
    const nameLower = name.toLowerCase().trim();
    const tecnico = TECNICOS.find(t => 
      t.nome.toLowerCase() === nameLower || 
      t.nome.toLowerCase().includes(nameLower) ||
      nameLower.includes(t.nome.toLowerCase())
    );
    return tecnico?.id || null;
  };

  const handleConfirmImport = async () => {
    setIsLoading(true);
    
    const newOrdens: Partial<OrdemServico>[] = previewData.map((item) => ({
      os: item.os,
      prefixo: item.prefixo,
      agencia: item.agencia,
      contrato: item.contrato,
      vencimento: item.vencimento,
      situacao: item.situacao,
      elaborador: item.elaborador || null,
      elaboradorId: findElaboradorId(item.elaborador),
      tecnico: item.tecnico || null,
      tecnicoId: findTecnicoId(item.tecnico),
      valorOrcado: null,
      valorAprovado: null,
      dataAprovacao: null,
      aprovadoPor: null,
      dificuldades: [],
    }));

    try {
      const apiResult = await importOrdensServico(newOrdens);

      const result: ImportResult = {
        ...importResult!,
        imported: apiResult.imported
      };
      setImportResult(result);

      toast({
        title: "Importação concluída!",
        description: `${apiResult.imported} O.S importadas e salvas no banco de dados.`,
      });

      if (result.enhancements.length > 0) {
        setTimeout(() => {
          toast({
            title: "Normalizações aplicadas",
            description: `${result.enhancements.length} campos foram normalizados automaticamente.`,
          });
        }, 1000);
      }

      if (result.warnings.length > 0) {
        setTimeout(() => {
          toast({
            title: "Avisos",
            description: `${result.warnings.length} linhas com campos em branco.`,
            variant: "destructive"
          });
        }, 2000);
      }

      setStep('success');
    } catch (error) {
      console.error('Erro ao importar:', error);
      toast({
        title: "Erro na importação",
        description: "Não foi possível salvar os dados no banco. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetImport = () => {
    setStep('upload');
    setFileName('');
    setRawData([]);
    setHeaders([]);
    setHeaderIndex(0);
    setMapping({ os: '', prefixo: '', agencia: '', contrato: '', vencimento: '', tecnico: '', elaborador: '', situacao: '' });
    setPreviewData([]);
    setImportResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const OB = {
    background: '#f0f8ff',
    foreground: '#374151',
    card: '#ffffff',
    primary: '#22c55e',
    muted: '#f3f4f6',
    mutedForeground: '#6b7280',
    accent: '#d1fae5',
    border: '#e5e7eb',
  };

  return (
    <div className="min-h-screen p-6" style={{ background: OB.background }}>
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: OB.foreground }}>
            Importação de O.S
          </h1>
          <p style={{ color: OB.mutedForeground }}>
            Importe planilhas Excel com detecção inteligente de colunas e normalização automática.
          </p>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept=".xlsx,.xls,.csv"
          className="hidden"
        />

        {step === 'upload' && (
          <Card 
            className={`border-2 border-dashed transition-all duration-200 shadow-md ${
              isDragging 
                ? 'border-emerald-500' 
                : 'hover:border-emerald-300'
            }`}
            style={{ 
              background: isDragging ? OB.accent : OB.card,
              borderColor: isDragging ? OB.primary : OB.border
            }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <CardContent className="flex flex-col items-center justify-center py-16 text-center space-y-4">
              <div 
                className={`p-4 rounded-full shadow-sm transition-all duration-200 ${
                  isDragging ? 'scale-110' : ''
                }`}
                style={{ background: isDragging ? OB.accent : OB.muted }}
              >
                {isLoading ? (
                  <Loader2 
                    className="h-10 w-10" 
                    style={{ color: OB.primary, animation: 'spin 1s linear infinite' }}
                  />
                ) : (
                  <Upload className="h-10 w-10" style={{ color: OB.primary }} />
                )}
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-lg" style={{ color: OB.foreground }}>
                  {isDragging ? 'Solte o arquivo aqui!' : 'Arraste sua planilha ou clique para selecionar'}
                </h3>
                <p className="text-sm" style={{ color: OB.mutedForeground }}>
                  O sistema detectará automaticamente as colunas da sua planilha
                </p>
              </div>
              <Button 
                onClick={() => fileInputRef.current?.click()} 
                className="mt-4 text-white"
                style={{ background: OB.primary }}
                disabled={isLoading}
              >
                {isLoading ? 'Carregando...' : 'Selecionar Arquivo'}
              </Button>
              <div className="pt-8 text-xs flex flex-col items-center gap-1" style={{ color: OB.mutedForeground }}>
                 <span className="flex items-center gap-1"><FileSpreadsheet size={14} /> Formatos aceitos:</span>
                 <span>.xlsx, .xls, .csv</span>
              </div>
            </CardContent>
          </Card>
        )}

      {step === 'mapping' && (
        <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Mapeamento de Colunas</CardTitle>
                <CardDescription>
                  Arquivo: <span className="font-medium text-slate-900">{fileName}</span>
                  <span className="ml-2 text-emerald-600">({rawData.length} linhas detectadas)</span>
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={resetImport}>
                <X className="mr-2 h-4 w-4" /> Cancelar
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-blue-50 rounded-md border border-blue-100 flex items-start gap-2">
              <Info size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-blue-700">
                <strong>Detecção automática:</strong> As colunas foram mapeadas automaticamente com base nos cabeçalhos encontrados. Ajuste se necessário.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MappingSelect
                label="Número da OS *"
                value={mapping.os}
                onChange={(v) => setMapping({...mapping, os: v})}
                headers={headers}
                required
              />
              <MappingSelect
                label="Prefixo"
                value={mapping.prefixo}
                onChange={(v) => setMapping({...mapping, prefixo: v})}
                headers={headers}
              />
              <MappingSelect
                label="Agência *"
                value={mapping.agencia}
                onChange={(v) => setMapping({...mapping, agencia: v})}
                headers={headers}
                required
              />
              <MappingSelect
                label="Contrato *"
                value={mapping.contrato}
                onChange={(v) => setMapping({...mapping, contrato: v})}
                headers={headers}
                required
              />
              <MappingSelect
                label="Vencimento"
                value={mapping.vencimento}
                onChange={(v) => setMapping({...mapping, vencimento: v})}
                headers={headers}
              />
              <MappingSelect
                label="Técnico"
                value={mapping.tecnico}
                onChange={(v) => setMapping({...mapping, tecnico: v})}
                headers={headers}
              />
              <MappingSelect
                label="Elaborador"
                value={mapping.elaborador}
                onChange={(v) => setMapping({...mapping, elaborador: v})}
                headers={headers}
              />
              <MappingSelect
                label="Situação"
                value={mapping.situacao}
                onChange={(v) => setMapping({...mapping, situacao: v})}
                headers={headers}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2 bg-slate-50 border-t border-slate-100 p-4">
             <Button variant="outline" onClick={resetImport}>Voltar</Button>
             <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleConfirmMapping}>
               Continuar <ArrowRight className="ml-2 h-4 w-4" />
             </Button>
          </CardFooter>
        </Card>
      )}

      {step === 'preview' && (
        <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Preview da Importação</CardTitle>
                <CardDescription>{previewData.length} O.S serão importadas</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={resetImport}>
                <X className="mr-2 h-4 w-4" /> Cancelar
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {importResult && (importResult.warnings.length > 0 || importResult.enhancements.length > 0) && (
              <div className="space-y-2">
                {importResult.enhancements.length > 0 && (
                  <div className="p-3 bg-emerald-50 rounded-md border border-emerald-100">
                    <div className="flex items-center gap-2 text-sm text-emerald-700 font-medium mb-1">
                      <CheckCircle2 size={16} />
                      {importResult.enhancements.length} normalizações aplicadas
                    </div>
                    <ul className="text-xs text-emerald-600 space-y-0.5 ml-6">
                      {importResult.enhancements.slice(0, 5).map((e, i) => (
                        <li key={i}>{e}</li>
                      ))}
                      {importResult.enhancements.length > 5 && (
                        <li>... e mais {importResult.enhancements.length - 5}</li>
                      )}
                    </ul>
                  </div>
                )}
                {importResult.warnings.length > 0 && (
                  <div className="p-3 bg-amber-50 rounded-md border border-amber-100">
                    <div className="flex items-center gap-2 text-sm text-amber-700 font-medium mb-1">
                      <AlertTriangle size={16} />
                      {importResult.warnings.length} avisos
                    </div>
                    <ul className="text-xs text-amber-600 space-y-0.5 ml-6">
                      {importResult.warnings.slice(0, 3).map((w, i) => (
                        <li key={i}>{w}</li>
                      ))}
                      {importResult.warnings.length > 3 && (
                        <li>... e mais {importResult.warnings.length - 3}</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            )}

            <ScrollArea className="h-[350px]">
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>OS</TableHead>
                      <TableHead>Prefixo</TableHead>
                      <TableHead>Agência</TableHead>
                      <TableHead>Contrato</TableHead>
                      <TableHead>Vencimento</TableHead>
                      <TableHead>Situação</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {previewData.slice(0, 100).map((row, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{row.os}</TableCell>
                        <TableCell>{row.prefixo || '-'}</TableCell>
                        <TableCell>{row.agencia || <span className="text-amber-500">-</span>}</TableCell>
                        <TableCell>{row.contrato || <span className="text-amber-500">-</span>}</TableCell>
                        <TableCell>{row.vencimento || '-'}</TableCell>
                        <TableCell>
                          <StatusBadge status={row.situacao} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {previewData.length > 100 && (
                <p className="text-center text-sm text-slate-500 mt-2">
                  Mostrando 100 de {previewData.length} registros
                </p>
              )}
            </ScrollArea>
          </CardContent>
          <CardFooter className="flex justify-end gap-2 bg-slate-50 border-t border-slate-100 p-4">
             <Button variant="outline" onClick={() => setStep('mapping')}>Voltar</Button>
             <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleConfirmImport}>
               <CheckCircle2 className="mr-2 h-4 w-4" /> Importar {previewData.length} O.S
             </Button>
          </CardFooter>
        </Card>
      )}

      {step === 'success' && importResult && (
        <Card className="animate-in zoom-in duration-300">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center space-y-4">
            <div className="p-4 bg-emerald-100 rounded-full text-emerald-600 mb-2">
              <CheckCircle2 className="h-12 w-12" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Importação Concluída!</h3>
            <p className="text-slate-600 max-w-md">
              <strong>{importResult.imported}</strong> Ordens de Serviço foram importadas.
            </p>
            
            <div className="flex gap-4 text-sm">
              {importResult.enhanced > 0 && (
                <div className="flex items-center gap-1 text-emerald-600">
                  <CheckCircle2 size={14} />
                  {importResult.enhanced} normalizações
                </div>
              )}
              {importResult.warnings.length > 0 && (
                <div className="flex items-center gap-1 text-amber-600">
                  <AlertTriangle size={14} />
                  {importResult.warnings.length} avisos
                </div>
              )}
            </div>

            <p className="text-sm text-slate-500">
              Total de O.S no sistema: <strong>{ordensServico.length}</strong>
            </p>
            <div className="flex gap-4 mt-6">
              <Button variant="outline" onClick={resetImport}>Nova Importação</Button>
              <Button 
                className="bg-slate-900 text-white hover:bg-slate-800"
                onClick={onNavigateToOS}
              >
                Ver Todas as O.S <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      </div>
    </div>
  );
}

function MappingSelect({ label, value, onChange, headers, required }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  headers: string[];
  required?: boolean;
}) {
  const handleChange = (v: string) => {
    onChange(v === '__none__' ? '' : v);
  };

  return (
    <div className="space-y-2">
      <Label className={required ? 'after:content-["*"] after:ml-0.5 after:text-red-500' : ''}>
        {label.replace(' *', '')}
      </Label>
      <Select value={value || (required ? undefined : '__none__')} onValueChange={handleChange}>
        <SelectTrigger className={value ? 'border-emerald-300 bg-emerald-50' : ''}>
          <SelectValue placeholder="Selecione a coluna" />
        </SelectTrigger>
        <SelectContent>
          {!required && <SelectItem value="__none__">Não mapear</SelectItem>}
          {headers.map((h, i) => (
            <SelectItem key={i} value={String(i)}>{h || `Coluna ${i + 1}`}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    'Fornecedor Acionado': "bg-blue-100 text-blue-700 border-blue-200",
    'Em Levantamento': "bg-amber-100 text-amber-700 border-amber-200",
    'Em Elaboração': "bg-orange-100 text-orange-700 border-orange-200",
    'Em Orçamento': "bg-purple-100 text-purple-700 border-purple-200",
    'Concluída': "bg-emerald-100 text-emerald-700 border-emerald-200",
    'Com Dificuldade': "bg-red-100 text-red-700 border-red-200",
    'Mudança de Contrato': "bg-pink-100 text-pink-700 border-pink-200"
  };
  
  const style = styles[status] || "bg-slate-100 text-slate-700";

  return (
    <Badge variant="outline" className={`${style} whitespace-nowrap text-xs`}>
      {status}
    </Badge>
  );
}
