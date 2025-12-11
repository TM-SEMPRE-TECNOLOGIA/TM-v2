import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle, X, ArrowRight, Building2, Calendar } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';

export function ImportOS() {
  const [step, setStep] = useState<'upload' | 'preview' | 'success'>('upload');
  const [fileName, setFileName] = useState('');

  const handleFileUpload = () => {
    setTimeout(() => {
      setFileName('OS_NOVEMBRO_LOTE_01.xlsx');
      setStep('preview');
    }, 800);
  };

  const handleConfirmImport = () => {
    setStep('success');
  };

  // Mock data representing exact columns from spreadsheet
  // Columns: OS, Prefix, Agency, Contract, Due Date
  const mockPreviewData = [
    { os: '98240', prefix: '9794', agency: 'Agência Central', contract: 'Manutenção Predial', dueDate: '2023-11-25' },
    { os: '98241', prefix: '1020', agency: 'Agência Zona Sul', contract: 'Climatização', dueDate: '2023-11-26' },
    { os: '98242', prefix: '3040', agency: 'Agência Campinas', contract: 'Manutenção Predial', dueDate: '2023-11-28' },
    { os: '98243', prefix: '9794', agency: 'Agência Central', contract: 'Elétrica Emergencial', dueDate: '2023-11-20' },
    { os: '98244', prefix: '5010', agency: 'Agência Osasco', contract: 'Manutenção Predial', dueDate: '2023-11-30' },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Importação de O.S</h2>
        <p className="text-slate-500">Importe a planilha padrão enviada pelo fornecedor ou cliente.</p>
      </div>

      {step === 'upload' && (
        <Card className="border-2 border-dashed border-slate-300 bg-slate-50/50">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center space-y-4">
            <div className="p-4 bg-white rounded-full shadow-sm">
              <Upload className="h-10 w-10 text-emerald-600" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-lg">Selecione a planilha de O.S</h3>
              <p className="text-sm text-slate-500">O sistema identificará automaticamente as colunas padrão.</p>
            </div>
            <Button onClick={handleFileUpload} className="bg-emerald-600 hover:bg-emerald-700 mt-4">
              Selecionar Arquivo
            </Button>
            <div className="pt-8 text-xs text-slate-400 flex flex-col items-center gap-1">
               <span className="flex items-center gap-1"><FileSpreadsheet size={14} /> Colunas esperadas:</span>
               <span>OS, Prefixo, Agência, Contrato, Vencimento</span>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 'preview' && (
        <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Validação de Dados</CardTitle>
                <CardDescription>Arquivo: <span className="font-medium text-slate-900">{fileName}</span></CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setStep('upload')}>
                <X className="mr-2 h-4 w-4" /> Cancelar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
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
                  {mockPreviewData.map((row) => (
                    <TableRow key={row.os}>
                      <TableCell className="font-medium">{row.os}</TableCell>
                      <TableCell>{row.prefix}</TableCell>
                      <TableCell>{row.agency}</TableCell>
                      <TableCell>{row.contract}</TableCell>
                      <TableCell>{row.dueDate}</TableCell>
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
             <div className="mt-4 flex items-center gap-2 text-sm text-slate-500 bg-amber-50 p-3 rounded-md border border-amber-100">
               <AlertCircle size={16} className="text-amber-600" />
               Atenção: As O.S serão importadas sem <strong>Técnico</strong> e <strong>Elaborador</strong> definidos. Você deverá atribuí-los na tela de Gestão.
             </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2 bg-slate-50 border-t border-slate-100 p-4">
             <Button variant="outline" onClick={() => setStep('upload')}>Voltar</Button>
             <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleConfirmImport}>
               <CheckCircle2 className="mr-2 h-4 w-4" /> Importar Ordens
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
              5 novas Ordens de Serviço foram criadas com status "Fornecedor Acionado".
            </p>
            <div className="flex gap-4 mt-6">
              <Button variant="outline" onClick={() => setStep('upload')}>Nova Importação</Button>
              <Button className="bg-slate-900 text-white hover:bg-slate-800">
                Distribuir Tarefas <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
