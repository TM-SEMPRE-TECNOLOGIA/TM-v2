import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { AlertTriangle, Search, Inbox, Calendar, MapPin } from 'lucide-react';
import { Input } from './ui/input';
import { useOSStore } from '../lib/store';
import { format, parseISO } from 'date-fns';

const OB = {
  background: '#f0f8ff',
  foreground: '#374151',
  card: '#ffffff',
  primary: '#22c55e',
  secondary: '#e0f2fe',
  muted: '#f3f4f6',
  mutedForeground: '#6b7280',
  accent: '#d1fae5',
  border: '#e5e7eb',
  destructive: '#ef4444',
};

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
      <div className="min-h-screen p-6" style={{ background: OB.background }}>
        <div className="max-w-7xl mx-auto space-y-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: OB.foreground }}>
              Registro de Dificuldades
            </h1>
            <p style={{ color: OB.mutedForeground }}>
              Visão consolidada de todos os impedimentos relatados em campo.
            </p>
          </div>
          <Card className="border-2 border-dashed" style={{ borderColor: OB.border, background: OB.card }}>
            <CardContent className="flex flex-col items-center justify-center py-16 text-center space-y-4">
              <div className="p-4 rounded-full" style={{ background: OB.muted }}>
                <Inbox className="h-12 w-12" style={{ color: OB.mutedForeground }} />
              </div>
              <div>
                <h3 className="text-lg font-semibold" style={{ color: OB.foreground }}>
                  Nenhuma Dificuldade Registrada
                </h3>
                <p style={{ color: OB.mutedForeground }} className="max-w-sm">
                  Quando dificuldades forem registradas nas O.S, elas aparecerão aqui.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6" style={{ background: OB.background }}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: OB.foreground }}>
            Registro de Dificuldades
          </h1>
          <p style={{ color: OB.mutedForeground }}>
            Visão consolidada de todos os impedimentos relatados em campo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-0 shadow-md" style={{ background: OB.card }}>
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl" style={{ background: '#fef2f2' }}>
                  <AlertTriangle size={24} style={{ color: OB.destructive }} />
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: OB.mutedForeground }}>Total Ocorrências</p>
                  <h3 className="text-2xl font-bold" style={{ color: OB.destructive }}>{stats.total}</h3>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md" style={{ background: OB.card }}>
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl" style={{ background: OB.accent }}>
                  <Calendar size={24} style={{ color: OB.primary }} />
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: OB.mutedForeground }}>Este Mês</p>
                  <h3 className="text-2xl font-bold" style={{ color: OB.foreground }}>{stats.thisMonth}</h3>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md" style={{ background: OB.card }}>
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl" style={{ background: OB.secondary }}>
                  <MapPin size={24} className="text-sky-600" />
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: OB.mutedForeground }}>Agência + Problemas</p>
                  <h3 className="text-lg font-bold" style={{ color: OB.foreground }}>{stats.topAgency}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-0 shadow-md" style={{ background: OB.card }}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle size={20} style={{ color: OB.destructive }} />
                <CardTitle style={{ color: OB.foreground }}>
                  Histórico Completo ({filteredDifficulties.length})
                </CardTitle>
              </div>
              <div className="relative w-[300px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: OB.mutedForeground }} />
                <Input
                  placeholder="Buscar por O.S, agência, texto..."
                  className="pl-9 focus:border-emerald-400 focus:ring-emerald-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border overflow-auto max-h-[500px]" style={{ borderColor: OB.border }}>
              <Table>
                <TableHeader className="sticky top-0" style={{ background: OB.muted }}>
                  <TableRow>
                    <TableHead className="w-[130px] font-semibold" style={{ color: OB.foreground }}>Data</TableHead>
                    <TableHead className="w-[100px] font-semibold" style={{ color: OB.foreground }}>O.S</TableHead>
                    <TableHead className="w-[200px] font-semibold" style={{ color: OB.foreground }}>Agência</TableHead>
                    <TableHead className="font-semibold" style={{ color: OB.foreground }}>Relato</TableHead>
                    <TableHead className="w-[150px] font-semibold" style={{ color: OB.foreground }}>Autor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDifficulties.map((item, index) => (
                    <TableRow 
                      key={item.id}
                      className="hover:bg-slate-50"
                      style={{ background: index % 2 === 0 ? OB.card : OB.muted }}
                    >
                      <TableCell className="font-medium text-xs" style={{ color: OB.mutedForeground }}>
                        {formatDate(item.date)}
                      </TableCell>
                      <TableCell>
                        <Badge className="text-white" style={{ background: OB.primary }}>
                          {item.osNumber}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate" title={item.agency} style={{ color: OB.foreground }}>
                        {item.agency}
                      </TableCell>
                      <TableCell className="max-w-md">
                        <span className="line-clamp-2" title={item.text} style={{ color: OB.foreground }}>
                          {item.text}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold"
                            style={{ background: OB.accent, color: OB.primary }}
                          >
                            {item.author.substring(0, 2).toUpperCase()}
                          </div>
                          <span className="text-sm" style={{ color: OB.foreground }}>{item.author}</span>
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
    </div>
  );
}
