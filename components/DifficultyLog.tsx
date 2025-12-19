import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { AlertTriangle, Search, Inbox } from 'lucide-react';
import { Input } from './ui/input';
import { useOSStore } from '../lib/store';
import { format, parseISO } from 'date-fns';

interface DifficultyEntry {
  id: string;
  osId: string;
  osNumber: string;
  agency: string;
  text: string;
  author: string;
  date: string;
}

export function DifficultyLog() {
  const [searchTerm, setSearchTerm] = useState('');
  const ordensServico = useOSStore((state) => state.ordensServico);

  const allDifficulties = useMemo(() => {
    const difficulties: DifficultyEntry[] = [];
    
    ordensServico.forEach(os => {
      if (os.dificuldades && os.dificuldades.length > 0) {
        os.dificuldades.forEach(dif => {
          difficulties.push({
            id: dif.id,
            osId: os.id,
            osNumber: os.os,
            agency: os.agencia,
            text: dif.texto,
            author: dif.autor,
            date: dif.dataHora
          });
        });
      }
    });

    return difficulties.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [ordensServico]);

  const filteredDifficulties = useMemo(() => {
    if (!searchTerm) return allDifficulties;
    const term = searchTerm.toLowerCase();
    return allDifficulties.filter(d => 
      d.osNumber.toLowerCase().includes(term) ||
      d.agency.toLowerCase().includes(term) ||
      d.text.toLowerCase().includes(term) ||
      d.author.toLowerCase().includes(term)
    );
  }, [allDifficulties, searchTerm]);

  const stats = useMemo(() => {
    const agencyCount: Record<string, number> = {};
    allDifficulties.forEach(d => {
      agencyCount[d.agency] = (agencyCount[d.agency] || 0) + 1;
    });
    
    let topAgency = '-';
    let topCount = 0;
    Object.entries(agencyCount).forEach(([agency, count]) => {
      if (count > topCount) {
        topAgency = agency;
        topCount = count;
      }
    });

    const now = new Date();
    const thisMonth = allDifficulties.filter(d => {
      try {
        const date = parseISO(d.date);
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
      } catch {
        return false;
      }
    }).length;

    return {
      total: allDifficulties.length,
      thisMonth,
      topAgency: topAgency.length > 25 ? topAgency.substring(0, 25) + '...' : topAgency
    };
  }, [allDifficulties]);

  const formatDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), 'dd/MM/yyyy HH:mm');
    } catch {
      return dateStr;
    }
  };

  if (allDifficulties.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Registro de Dificuldades</h2>
          <p className="text-slate-500">Visão consolidada de todos os impedimentos relatados em campo.</p>
        </div>
        <Card className="border-dashed border-2">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center space-y-4">
            <Inbox className="h-16 w-16 text-slate-300" />
            <div>
              <h3 className="text-lg font-semibold text-slate-700">Nenhuma Dificuldade Registrada</h3>
              <p className="text-slate-500 max-w-sm">
                Quando dificuldades forem registradas nas O.S, elas aparecerão aqui.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
              <h3 className="text-2xl font-bold text-red-700">{stats.total}</h3>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-400" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Ocorrências Este Mês</p>
              <h3 className="text-2xl font-bold text-slate-900">{stats.thisMonth}</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Agência com + Problemas</p>
              <h3 className="text-lg font-bold text-slate-900">{stats.topAgency}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Histórico Completo ({filteredDifficulties.length})</CardTitle>
            <div className="relative w-[300px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                placeholder="Buscar por O.S, agência, texto..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-slate-200 overflow-auto max-h-[500px]">
            <Table>
              <TableHeader className="bg-slate-50 sticky top-0">
                <TableRow>
                  <TableHead className="w-[130px]">Data</TableHead>
                  <TableHead className="w-[100px]">O.S</TableHead>
                  <TableHead className="w-[200px]">Agência</TableHead>
                  <TableHead>Relato</TableHead>
                  <TableHead className="w-[150px]">Autor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDifficulties.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium text-slate-500 text-xs">
                      {formatDate(item.date)}
                    </TableCell>
                    <TableCell className="font-medium text-emerald-700">{item.osNumber}</TableCell>
                    <TableCell className="max-w-[200px] truncate" title={item.agency}>
                      {item.agency}
                    </TableCell>
                    <TableCell className="max-w-md">
                      <span className="line-clamp-2" title={item.text}>
                        {item.text}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600">
                          {item.author.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="text-sm">{item.author}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
