import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Plus, Search, ShieldCheck, Wrench, Building2, MoreHorizontal } from 'lucide-react';

const mockTeam = [
  { id: 1, name: 'Paulo Silva', role: 'Gerente', email: 'paulo@maffeng.com', contracts: ['Manutenção Predial', 'Elétrica Global'] },
  { id: 2, name: 'Alexandre Souza', role: 'Admin Contrato', email: 'alexandre@maffeng.com', contracts: ['Climatização - Zona Sul'] },
  { id: 3, name: 'Danilo Costa', role: 'Técnico', email: 'danilo@maffeng.com', status: 'Em Campo' },
  { id: 4, name: 'João Silva', role: 'Técnico', email: 'joao@maffeng.com', status: 'Disponível' },
  { id: 5, name: 'Pedro Santos', role: 'Técnico', email: 'pedro@maffeng.com', status: 'Férias' },
];

export function TeamList() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTeam = mockTeam.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Gestão de Equipe e Contratos</h2>
          <p className="text-slate-500">Administre usuários, funções e vínculos contratuais.</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="mr-2 h-4 w-4" /> Novo Membro
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-2">
          <CardHeader className="pb-3">
             <div className="flex items-center justify-between">
              <CardTitle>Membros da Equipe</CardTitle>
              <div className="relative w-[250px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                <Input
                  placeholder="Buscar membro..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Função</TableHead>
                  <TableHead>Status / Vínculos</TableHead>
                  <TableHead className="text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTeam.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className={member.role.includes('Técnico') ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}>
                          {member.name.substring(0,2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-900">{member.name}</span>
                        <span className="text-xs text-slate-500">{member.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={
                        member.role === 'Gerente' ? 'border-purple-200 bg-purple-50 text-purple-700' :
                        member.role === 'Admin Contrato' ? 'border-amber-200 bg-amber-50 text-amber-700' :
                        'border-slate-200 bg-slate-50 text-slate-700'
                      }>
                        {member.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {member.role.includes('Técnico') ? (
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${
                            member.status === 'Disponível' ? 'bg-emerald-500' : 
                            member.status === 'Em Campo' ? 'bg-blue-500' : 'bg-slate-300'
                          }`} />
                          <span className="text-sm text-slate-600">{member.status}</span>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-1">
                          {member.contracts?.map((c, i) => (
                            <div key={i} className="text-xs flex items-center gap-1 text-slate-600">
                              <Building2 size={10} /> {c}
                            </div>
                          ))}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal size={16} className="text-slate-400" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="bg-slate-50 border-slate-200">
           <CardHeader>
             <CardTitle className="text-sm font-medium text-slate-500 uppercase">Resumo de Atribuições</CardTitle>
           </CardHeader>
           <CardContent className="space-y-4">
             <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
               <div className="flex items-center gap-3 mb-2">
                 <div className="p-2 bg-emerald-100 rounded-md text-emerald-600"><ShieldCheck size={20} /></div>
                 <div>
                   <h4 className="font-bold text-lg">3</h4>
                   <p className="text-xs text-slate-500">Gestores/Admins</p>
                 </div>
               </div>
               <p className="text-xs text-slate-600 mt-2">Responsáveis pela aprovação de valores e gestão de prazos.</p>
             </div>

             <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
               <div className="flex items-center gap-3 mb-2">
                 <div className="p-2 bg-blue-100 rounded-md text-blue-600"><Wrench size={20} /></div>
                 <div>
                   <h4 className="font-bold text-lg">12</h4>
                   <p className="text-xs text-slate-500">Técnicos de Campo</p>
                 </div>
               </div>
               <p className="text-xs text-slate-600 mt-2">Disponíveis para levantamentos e execução de serviços.</p>
             </div>
           </CardContent>
        </Card>
      </div>
    </div>
  );
}
