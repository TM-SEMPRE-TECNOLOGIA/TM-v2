import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { AlertTriangle, Search, Filter } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';

// Mock Data agregado de todas as OS
const mockAllDifficulties = [
  {
    id: 'd1',
    osId: 'OS-98234',
    agency: 'Agência Central - SP',
    text: 'Acesso à casa de máquinas estava trancado. Chave com a gerência.',
    author: 'Danilo Costa',
    date: '2023-11-01 10:30',
    type: 'Access'
  },
  {
    id: 'd2',
    osId: 'OS-98235',
    agency: 'Agência Zona Sul',
    text: 'Falta de material específico para reparo do quadro elétrico.',
    author: 'João Silva',
    date: '2023-11-02 14:15',
    type: 'Material'
  },
  {
    id: 'd3',
    osId: 'OS-98234',
    agency: 'Agência Central - SP',
    text: 'Responsável técnico da agência não estava presente para assinar a RAT.',
    author: 'Danilo Costa',
    date: '2023-11-01 16:45',
    type: 'Process'
  },
  {
    id: 'd4',
    osId: 'OS-98240',
    agency: 'Agência Campinas',
    text: 'Equipamento não localizado no patrimônio indicado.',
    author: 'Pedro Santos',
    date: '2023-11-03 09:00',
    type: 'Data'
  }
];

export function DifficultyLog() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Registro de Dificuldades</h2>
          <p className="text-slate-500">Visão consolidada de todos os impedimentos relatados em campo.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-red-50 border-red-100">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Total Ocorrências</p>
              <h3 className="text-2xl font-bold text-red-700">12</h3>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-400" />
          </CardContent>
        </Card>
        <Card>
           <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Ocorrências Este Mês</p>
              <h3 className="text-2xl font-bold text-slate-900">8</h3>
            </div>
          </CardContent>
        </Card>
         <Card>
           <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Agência com + Problemas</p>
              <h3 className="text-lg font-bold text-slate-900">Agência Central</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
           <div className="flex items-center justify-between">
            <CardTitle>Histórico Completo</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                <Input
                  placeholder="Buscar..."
                  className="pl-9 w-[250px]"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">Data</TableHead>
                <TableHead className="w-[100px]">OS</TableHead>
                <TableHead>Agência</TableHead>
                <TableHead>Relato</TableHead>
                <TableHead>Autor</TableHead>
                <TableHead className="text-right">Tipo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockAllDifficulties.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium text-slate-500 text-xs">{item.date}</TableCell>
                  <TableCell className="font-medium text-emerald-700">{item.osId}</TableCell>
                  <TableCell>{item.agency}</TableCell>
                  <TableCell className="max-w-md truncate" title={item.text}>
                    {item.text}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                       <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600">
                         {item.author.substring(0,2).toUpperCase()}
                       </div>
                       <span className="text-sm">{item.author}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline" className="text-xs">{item.type}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
