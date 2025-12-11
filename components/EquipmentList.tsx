import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from './ui/table';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Search, Plus, Filter, MoreHorizontal, FileText } from 'lucide-react';

const mockEquipment = [
  {
    id: 'EQ-001',
    name: 'Compressor de Ar Industrial',
    model: 'Atlas Copco GA 30+',
    sector: 'Utilidades',
    status: 'active',
    lastMaintenance: '2023-10-15',
    nextMaintenance: '2023-11-15'
  },
  {
    id: 'EQ-002',
    name: 'Torno CNC',
    model: 'Romi GL 240',
    sector: 'Usinagem',
    status: 'maintenance',
    lastMaintenance: '2023-09-20',
    nextMaintenance: '2023-10-20'
  },
  {
    id: 'EQ-003',
    name: 'Empilhadeira Elétrica',
    model: 'Toyota 8FBE15',
    sector: 'Logística',
    status: 'active',
    lastMaintenance: '2023-10-01',
    nextMaintenance: '2023-12-01'
  },
  {
    id: 'EQ-004',
    name: 'Gerador Diesel',
    model: 'Caterpillar C18',
    sector: 'Utilidades',
    status: 'inactive',
    lastMaintenance: '2023-08-15',
    nextMaintenance: '2024-02-15'
  },
  {
    id: 'EQ-005',
    name: 'Prensa Hidráulica',
    model: 'Müller 400T',
    sector: 'Estamparia',
    status: 'active',
    lastMaintenance: '2023-10-10',
    nextMaintenance: '2023-11-10'
  },
];

export function EquipmentList() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEquipment = mockEquipment.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sector.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Equipamentos</h2>
          <p className="text-slate-500">Gerencie o inventário de ativos da empresa.</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="mr-2 h-4 w-4" /> Novo Equipamento
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium">Lista de Ativos</CardTitle>
            <div className="flex items-center gap-2">
               <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                <Input
                  placeholder="Buscar equipamento..."
                  className="pl-9 w-[250px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Equipamento</TableHead>
                <TableHead>Setor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Última Manut.</TableHead>
                <TableHead>Próxima Manut.</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEquipment.map((equipment) => (
                <TableRow key={equipment.id}>
                  <TableCell className="font-medium">{equipment.id}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{equipment.name}</span>
                      <span className="text-xs text-slate-500">{equipment.model}</span>
                    </div>
                  </TableCell>
                  <TableCell>{equipment.sector}</TableCell>
                  <TableCell>
                    {equipment.status === 'active' && <Badge variant="success">Operacional</Badge>}
                    {equipment.status === 'maintenance' && <Badge variant="warning">Em Manutenção</Badge>}
                    {equipment.status === 'inactive' && <Badge variant="secondary">Inativo</Badge>}
                  </TableCell>
                  <TableCell>{new Date(equipment.lastMaintenance).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>{new Date(equipment.nextMaintenance).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
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
