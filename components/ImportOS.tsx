import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle, X, ArrowRight, Loader2 } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { Label } from './ui/label';
import * as XLSX from 'xlsx';
import { OrdemServico } from '../lib/types';
import { addOrdensServico, getOrdensServico } from '../lib/store';

interface ColumnMapping {
  os: string;
  prefixo: string;
  agencia: string;
  contrato: string;
  vencimento: string;
}

export function ImportOS() {
  const [step, setStep] = useState<'upload' | 'mapping' | 'preview' | 'success'>('upload');
  const [fileName, setFileName] = useState('');
  const [rawData, setRawData] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [mapping, setMapping] = useState<ColumnMapping>({
    os: '',
    prefixo: '',
    agencia: '',
    contrato: '',
    vencimento: ''
  });
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [importedCount, setImportedCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        if (jsonData.length > 0) {
          const headerRow = jsonData[0] as string[];
          setHeaders(headerRow.map(h => String(h || '').trim()));
          setRawData(jsonData.slice(1));
          
          const autoMapping: ColumnMapping = {
            os: '',
            prefixo: '',
            agencia: '',
            contrato: '',
            vencimento: ''
          };
          
          headerRow.forEach((h, index) => {
            const header = String(h || '').toLowerCase().trim();
            if (header.includes('os') || header === 'o.s' || header === 'ordem') {
              autoMapping.os = String(index);
            } else if (header.includes('prefixo') || header.includes('prefix')) {
              autoMapping.prefixo = String(index);
            } else if (header.includes('agencia') || header.includes('agência') || header.includes('agency')) {
              autoMapping.agencia = String(index);
            } else if (header.includes('contrato') || header.includes('contract')) {
              autoMapping.contrato = String(index);
            } else if (header.includes('vencimento') || header.includes('due') || header.includes('prazo') || header.includes('data')) {
              autoMapping.vencimento = String(index);
            }
          });
          
          setMapping(autoMapping);
          setStep('mapping');
        }
      } catch (error) {
        console.error('Error reading file:', error);
        alert('Erro ao ler o arquivo. Verifique se é um arquivo Excel válido.');
      }
      setIsLoading(false);
    };
    
    reader.readAsBinaryString(file);
  };

  const handleConfirmMapping = () => {
    if (!mapping.os || !mapping.agencia || !mapping.contrato) {
      alert('Por favor, mapeie pelo menos: OS, Agência e Contrato');
      return;
    }

    const mapped = rawData
      .filter(row => row[parseInt(mapping.os)])
      .map(row => ({
        os: String(row[parseInt(mapping.os)] || ''),
        prefixo: mapping.prefixo ? String(row[parseInt(mapping.prefixo)] || '') : '',
        agencia: String(row[parseInt(mapping.agencia)] || ''),
        contrato: String(row[parseInt(mapping.contrato)] || ''),
        vencimento: mapping.vencimento ? formatDate(row[parseInt(mapping.vencimento)]) : ''
      }));

    setPreviewData(mapped);
    setStep('preview');
  };

  const formatDate = (value: any): string => {
    if (!value) return '';
    if (typeof value === 'number') {
      const date = XLSX.SSF.parse_date_code(value);
      if (date) {
        return `${String(date.d).padStart(2, '0')}/${String(date.m).padStart(2, '0')}/${date.y}`;
      }
    }
    return String(value);
  };

  const handleConfirmImport = () => {
    const newOrdens: OrdemServico[] = previewData.map((item, index) => ({
      id: `${Date.now()}-${index}`,
      os: item.os,
      prefixo: item.prefixo,
      agencia: item.agencia,
      contrato: item.contrato,
      vencimento: item.vencimento,
      situacao: 'Fornecedor Acionado',
      elaborador: null,
      tecnico: null,
      agendamento: null,
      dataLevantamento: null,
      valorLevantamento: null,
      valorAprovado: null,
      anexos: [],
      dificuldades: [],
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString()
    }));

    addOrdensServico(newOrdens);
    setImportedCount(newOrdens.length);
    setStep('success');
  };

  const resetImport = () => {
    setStep('upload');
    setFileName('');
    setRawData([]);
    setHeaders([]);
    setMapping({ os: '', prefixo: '', agencia: '', contrato: '', vencimento: '' });
    setPreviewData([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Importação de O.S</h2>
        <p className="text-slate-500">Importe planilhas Excel (.xlsx, .xls) ou CSV com as Ordens de Serviço.</p>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept=".xlsx,.xls,.csv"
        className="hidden"
      />

      {step === 'upload' && (
        <Card className="border-2 border-dashed border-slate-300 bg-slate-50/50">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center space-y-4">
            <div className="p-4 bg-white rounded-full shadow-sm">
              {isLoading ? (
                <Loader2 className="h-10 w-10 text-emerald-600 animate-spin" />
              ) : (
                <Upload className="h-10 w-10 text-emerald-600" />
              )}
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-lg">Selecione a planilha de O.S</h3>
              <p className="text-sm text-slate-500">Arraste ou clique para selecionar um arquivo Excel ou CSV</p>
            </div>
            <Button 
              onClick={() => fileInputRef.current?.click()} 
              className="bg-emerald-600 hover:bg-emerald-700 mt-4"
              disabled={isLoading}
            >
              {isLoading ? 'Carregando...' : 'Selecionar Arquivo'}
            </Button>
            <div className="pt-8 text-xs text-slate-400 flex flex-col items-center gap-1">
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
                <CardDescription>Arquivo: <span className="font-medium text-slate-900">{fileName}</span></CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={resetImport}>
                <X className="mr-2 h-4 w-4" /> Cancelar
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-600">
              Identifique qual coluna da sua planilha corresponde a cada campo do sistema:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Número da OS *</Label>
                <Select value={mapping.os} onValueChange={(v) => setMapping({...mapping, os: v})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a coluna" />
                  </SelectTrigger>
                  <SelectContent>
                    {headers.map((h, i) => (
                      <SelectItem key={i} value={String(i)}>{h}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Prefixo</Label>
                <Select value={mapping.prefixo} onValueChange={(v) => setMapping({...mapping, prefixo: v})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a coluna" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Não mapear</SelectItem>
                    {headers.map((h, i) => (
                      <SelectItem key={i} value={String(i)}>{h}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Agência *</Label>
                <Select value={mapping.agencia} onValueChange={(v) => setMapping({...mapping, agencia: v})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a coluna" />
                  </SelectTrigger>
                  <SelectContent>
                    {headers.map((h, i) => (
                      <SelectItem key={i} value={String(i)}>{h}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Contrato *</Label>
                <Select value={mapping.contrato} onValueChange={(v) => setMapping({...mapping, contrato: v})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a coluna" />
                  </SelectTrigger>
                  <SelectContent>
                    {headers.map((h, i) => (
                      <SelectItem key={i} value={String(i)}>{h}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Vencimento</Label>
                <Select value={mapping.vencimento} onValueChange={(v) => setMapping({...mapping, vencimento: v})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a coluna" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Não mapear</SelectItem>
                    {headers.map((h, i) => (
                      <SelectItem key={i} value={String(i)}>{h}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-100">
              <p className="text-sm text-blue-700">
                <strong>{rawData.length}</strong> linhas encontradas na planilha
              </p>
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
          <CardContent>
            <ScrollArea className="h-[400px]">
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>OS</TableHead>
                      <TableHead>Prefixo</TableHead>
                      <TableHead>Agência</TableHead>
                      <TableHead>Contrato</TableHead>
                      <TableHead>Vencimento</TableHead>
                      <TableHead className="text-right">Status Inicial</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {previewData.slice(0, 100).map((row, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{row.os}</TableCell>
                        <TableCell>{row.prefixo}</TableCell>
                        <TableCell>{row.agencia}</TableCell>
                        <TableCell>{row.contrato}</TableCell>
                        <TableCell>{row.vencimento}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            Fornecedor Acionado
                          </Badge>
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
            <div className="mt-4 flex items-center gap-2 text-sm text-slate-500 bg-amber-50 p-3 rounded-md border border-amber-100">
              <AlertCircle size={16} className="text-amber-600" />
              Atenção: As O.S serão importadas sem <strong>Técnico</strong> e <strong>Elaborador</strong> definidos.
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2 bg-slate-50 border-t border-slate-100 p-4">
             <Button variant="outline" onClick={() => setStep('mapping')}>Voltar</Button>
             <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleConfirmImport}>
               <CheckCircle2 className="mr-2 h-4 w-4" /> Importar {previewData.length} O.S
             </Button>
          </CardFooter>
        </Card>
      )}

      {step === 'success' && (
        <Card className="animate-in zoom-in duration-300">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center space-y-4">
            <div className="p-4 bg-emerald-100 rounded-full text-emerald-600 mb-2">
              <CheckCircle2 className="h-12 w-12" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Importação Concluída!</h3>
            <p className="text-slate-600 max-w-md">
              <strong>{importedCount}</strong> Ordens de Serviço foram criadas com status "Fornecedor Acionado".
            </p>
            <p className="text-sm text-slate-500">
              Total de O.S no sistema: <strong>{getOrdensServico().length}</strong>
            </p>
            <div className="flex gap-4 mt-6">
              <Button variant="outline" onClick={resetImport}>Nova Importação</Button>
              <Button className="bg-slate-900 text-white hover:bg-slate-800">
                Ver Todas as O.S <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
