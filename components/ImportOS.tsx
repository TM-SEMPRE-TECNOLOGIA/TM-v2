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
