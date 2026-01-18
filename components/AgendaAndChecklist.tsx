import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ListTodo,
  Calendar,
  CalendarDays,
} from "lucide-react";
import { UserRole, USERS } from "../lib/types";
import { useOSStore } from "../lib/store";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  addMonths,
  subMonths,
  parseISO,
  getDay,
  isToday,
  isBefore,
  addDays,
} from "date-fns";
import { ptBR } from "date-fns/locale";

const OB = {
  background: '#f0f8ff',
  foreground: '#374151',
  card: '#ffffff',
  primary: '#22c55e',
  primaryLight: '#34d399',
  secondary: '#e0f2fe',
  muted: '#f3f4f6',
  mutedForeground: '#6b7280',
  accent: '#d1fae5',
  border: '#e5e7eb',
  chart1: '#22c55e',
  chart2: '#10b981',
  chart3: '#059669',
  destructive: '#ef4444',
};

interface AgendaProps {
  userRole?: UserRole;
  currentUser?: (typeof USERS)[0];
}

export function AgendaAndChecklist({
  userRole = "manager",
  currentUser,
}: AgendaProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const ordensServico = useOSStore((state) => state.ordensServico);

  const filteredOS = useMemo(() => {
    if (userRole === "elaborador" && currentUser) {
      return ordensServico.filter(
        (os) =>
          os.elaboradorId === currentUser.id ||
          os.elaborador === currentUser.name,
      );
    }
    return ordensServico;
  }, [ordensServico, userRole, currentUser]);

  const osComVencimento = useMemo(() => {
    return filteredOS.filter(
      (os) => os.vencimento && os.situacao !== "Concluída",
    );
  }, [filteredOS]);

  const calendarDays = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const firstDayOffset = useMemo(() => {
    return getDay(startOfMonth(currentMonth));
  }, [currentMonth]);

  const getOSForDay = (day: Date) => {
    return osComVencimento.filter((os) => {
      try {
        const vencimento = parseISO(os.vencimento);
        return isSameDay(vencimento, day);
      } catch {
        return false;
      }
    });
  };

  const selectedDayOS = useMemo(() => {
    if (!selectedDate) return [];
    return getOSForDay(selectedDate);
  }, [selectedDate, osComVencimento]);

  const getStatusColor = (situacao: string, vencimento: string) => {
    try {
      const dataVenc = parseISO(vencimento);
      if (isBefore(dataVenc, new Date()) && situacao !== "Concluída") {
        return "bg-red-100 text-red-700 border-red-200";
      }
    } catch {}

    const colors: Record<string, string> = {
      "Fornecedor Acionado": "bg-blue-100 text-blue-700",
      "Em Levantamento": "bg-amber-100 text-amber-700",
      "Em Elaboração": "bg-orange-100 text-orange-700",
      "Em Orçamento": "bg-purple-100 text-purple-700",
      Concluída: "bg-emerald-100 text-emerald-700",
      "Com Dificuldade": "bg-red-100 text-red-700",
    };
    return colors[situacao] || "bg-slate-100 text-slate-700";
  };

  const goToPreviousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const goToNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const goToToday = () => {
    setCurrentMonth(new Date());
    setSelectedDate(new Date());
  };

  const stats = useMemo(() => {
    const hoje = new Date();
    const em7Dias = addDays(hoje, 7);
    
    return {
      total: osComVencimento.length,
      atrasadas: osComVencimento.filter(os => {
        try {
          return isBefore(parseISO(os.vencimento), hoje);
        } catch { return false; }
      }).length,
      urgentes: osComVencimento.filter(os => {
        try {
          const venc = parseISO(os.vencimento);
          return !isBefore(venc, hoje) && isBefore(venc, em7Dias);
        } catch { return false; }
      }).length,
    };
  }, [osComVencimento]);

  return (
    <div className="min-h-screen p-6" style={{ background: OB.background }}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: OB.foreground }}>
              {userRole === "elaborador" ? "Minha Agenda" : "Agenda de O.S"}
            </h1>
            <p style={{ color: OB.mutedForeground }}>
              Visualize e gerencie os prazos das ordens de serviço
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Card className="border-0 shadow-sm px-4 py-2" style={{ background: OB.card }}>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ background: OB.destructive }}></div>
                  <span style={{ color: OB.mutedForeground }}>Atrasadas: <strong style={{ color: OB.destructive }}>{stats.atrasadas}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <span style={{ color: OB.mutedForeground }}>Urgentes: <strong className="text-amber-600">{stats.urgentes}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ background: OB.primary }}></div>
                  <span style={{ color: OB.mutedForeground }}>Total: <strong style={{ color: OB.primary }}>{stats.total}</strong></span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-4">
            <Card className="border-0 shadow-md" style={{ background: OB.card }}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CalendarDays size={20} style={{ color: OB.primary }} />
                    <CardTitle style={{ color: OB.foreground }}>Calendário</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={goToToday}
                      className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                    >
                      Hoje
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={goToPreviousMonth}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="font-semibold min-w-[160px] text-center capitalize" style={{ color: OB.foreground }}>
                      {format(currentMonth, "MMMM yyyy", { locale: ptBR })}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={goToNextMonth}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-7 gap-1 text-center mb-2">
                  {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map(
                    (dia) => (
                      <div
                        key={dia}
                        className="text-xs font-semibold uppercase py-2"
                        style={{ color: OB.mutedForeground }}
                      >
                        {dia}
                      </div>
                    ),
                  )}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: firstDayOffset }).map((_, i) => (
                    <div
                      key={`empty-${i}`}
                      className="h-24 rounded-lg"
                      style={{ background: OB.muted }}
                    ></div>
                  ))}

                  {calendarDays.map((day) => {
                    const osNoDia = getOSForDay(day);
                    const isSelected =
                      selectedDate && isSameDay(day, selectedDate);
                    const isDiaAtual = isToday(day);
                    const temAtrasadas = osNoDia.some((os) => {
                      try {
                        return isBefore(parseISO(os.vencimento), new Date());
                      } catch {
                        return false;
                      }
                    });

                    return (
                      <div
                        key={day.toISOString()}
                        onClick={() => setSelectedDate(day)}
                        className={`
                          h-24 p-2 rounded-lg border-2 flex flex-col items-start justify-start 
                          cursor-pointer overflow-hidden transition-all
                          ${isSelected 
                            ? "border-emerald-500 ring-2 ring-emerald-200 shadow-md" 
                            : "border-transparent hover:border-emerald-300"}
                        `}
                        style={{ 
                          background: isDiaAtual ? OB.accent : OB.card,
                          boxShadow: isSelected ? '0 4px 12px rgba(34, 197, 94, 0.15)' : undefined
                        }}
                      >
                        <div className="flex items-center gap-1 mb-1">
                          <span
                            className={`
                            text-sm font-semibold 
                            ${isDiaAtual ? "text-white px-2 py-0.5 rounded-full" : ""}
                          `}
                            style={{ 
                              background: isDiaAtual ? OB.primary : 'transparent',
                              color: isDiaAtual ? 'white' : osNoDia.length > 0 ? OB.foreground : OB.mutedForeground
                            }}
                          >
                            {format(day, "d")}
                          </span>
                          {temAtrasadas && (
                            <AlertTriangle size={12} style={{ color: OB.destructive }} />
                          )}
                        </div>
                        {osNoDia.slice(0, 2).map((os) => (
                          <div
                            key={os.id}
                            className={`
                              w-full text-[10px] font-medium truncate px-1.5 py-0.5 rounded mb-0.5
                              ${getStatusColor(os.situacao, os.vencimento)}
                            `}
                          >
                            {os.os} - {os.agencia.substring(0, 12)}
                          </div>
                        ))}
                        {osNoDia.length > 2 && (
                          <div className="text-[10px] font-medium px-1" style={{ color: OB.primary }}>
                            +{osNoDia.length - 2} mais
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4 text-xs flex-wrap" style={{ color: OB.mutedForeground }}>
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-full" style={{ background: OB.card }}>
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div> Fornecedor Acionado
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-full" style={{ background: OB.card }}>
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div> Em Levantamento
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-full" style={{ background: OB.card }}>
                <div className="w-2.5 h-2.5 rounded-full bg-purple-500"></div> Em Orçamento
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-full" style={{ background: OB.card }}>
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: OB.destructive }}></div> Atrasada
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-full" style={{ background: OB.card }}>
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: OB.primary }}></div> Concluída
              </div>
            </div>

            <ChecklistSection ordensServico={filteredOS} userRole={userRole} />
          </div>

          <div className="w-full lg:w-96 space-y-4">
            <Card className="border-0 shadow-md" style={{ background: OB.card }}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar size={20} style={{ color: OB.primary }} />
                    <CardTitle style={{ color: OB.foreground }}>
                      {selectedDate
                        ? format(selectedDate, "d 'de' MMMM", { locale: ptBR })
                        : "Selecione um dia"}
                    </CardTitle>
                  </div>
                  {selectedDate && (
                    <Badge 
                      className="text-white"
                      style={{ background: OB.primary }}
                    >
                      {selectedDayOS.length} O.S
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[500px] overflow-auto">
                  {!selectedDate ? (
                    <div className="p-8 text-center rounded-lg" style={{ background: OB.muted }}>
                      <Clock size={40} className="mx-auto mb-2" style={{ color: OB.mutedForeground, opacity: 0.5 }} />
                      <p className="text-sm" style={{ color: OB.mutedForeground }}>
                        Clique em um dia do calendário para ver as O.S
                      </p>
                    </div>
                  ) : selectedDayOS.length === 0 ? (
                    <div className="p-8 text-center rounded-lg" style={{ background: OB.accent }}>
                      <CheckCircle2 size={40} className="mx-auto mb-2" style={{ color: OB.primary, opacity: 0.5 }} />
                      <p className="text-sm" style={{ color: OB.chart3 }}>
                        Nenhuma O.S vence neste dia
                      </p>
                    </div>
                  ) : (
                    selectedDayOS.map((os) => {
                      const isAtrasada = isBefore(
                        parseISO(os.vencimento),
                        new Date(),
                      );
                      return (
                        <Card
                          key={os.id}
                          className={`cursor-pointer hover:shadow-md transition-all border-l-4 ${
                            isAtrasada ? "border-l-red-500 bg-red-50" : "border-l-emerald-500"
                          }`}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-bold" style={{ color: OB.foreground }}>
                                    O.S {os.os}
                                  </h4>
                                  {isAtrasada && (
                                    <Badge
                                      variant="destructive"
                                      className="text-[10px]"
                                    >
                                      Atrasada
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm" style={{ color: OB.foreground }}>{os.agencia}</p>
                                <p className="text-xs mt-1" style={{ color: OB.mutedForeground }}>
                                  {os.contrato}
                                </p>

                                <div className="flex items-center gap-4 mt-3 text-xs">
                                  {os.tecnico && (
                                    <span style={{ color: OB.mutedForeground }}>
                                      <span className="font-medium">Téc:</span>{" "}
                                      {os.tecnico}
                                    </span>
                                  )}
                                  {os.elaborador && (
                                    <span style={{ color: OB.mutedForeground }}>
                                      <span className="font-medium">Elab:</span>{" "}
                                      {os.elaborador}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <Badge
                                className={getStatusColor(os.situacao, os.vencimento)}
                              >
                                {os.situacao}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ChecklistItem {
  id: string;
  osId: string;
  osNumber: string;
  text: string;
  completed: boolean;
  dueDate: string;
  priority: "alta" | "media" | "baixa";
}

function ChecklistSection({
  ordensServico,
  userRole,
}: {
  ordensServico: any[];
  userRole: UserRole;
}) {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const checklistItems = useMemo(() => {
    const hoje = new Date();
    const em7Dias = addDays(hoje, 7);
    const items: ChecklistItem[] = [];

    ordensServico
      .filter((os) => os.situacao !== "Concluída")
      .forEach((os) => {
        if (!os.vencimento) return;

        try {
          const vencimento = parseISO(os.vencimento);
          const isAtrasada = isBefore(vencimento, hoje);
          const isUrgente = isBefore(vencimento, em7Dias);

          if (isAtrasada) {
            items.push({
              id: `atrasada-${os.id}`,
              osId: os.id,
              osNumber: os.os,
              text: `O.S ${os.os} - Atrasada! Prazo: ${format(vencimento, "dd/MM", { locale: ptBR })}`,
              completed: checkedItems.has(`atrasada-${os.id}`),
              dueDate: os.vencimento,
              priority: "alta",
            });
          } else if (isUrgente) {
            items.push({
              id: `urgente-${os.id}`,
              osId: os.id,
              osNumber: os.os,
              text: `O.S ${os.os} - Vence em ${format(vencimento, "dd/MM", { locale: ptBR })}`,
              completed: checkedItems.has(`urgente-${os.id}`),
              dueDate: os.vencimento,
              priority: "media",
            });
          }

          if (os.situacao === "Em Levantamento") {
            items.push({
              id: `levantamento-${os.id}`,
              osId: os.id,
              osNumber: os.os,
              text: `O.S ${os.os} - Finalizar levantamento`,
              completed: checkedItems.has(`levantamento-${os.id}`),
              dueDate: os.vencimento,
              priority: "media",
            });
          }

          if (os.situacao === "Em Elaboração") {
            items.push({
              id: `elaboracao-${os.id}`,
              osId: os.id,
              osNumber: os.os,
              text: `O.S ${os.os} - Concluir elaboração do relatório`,
              completed: checkedItems.has(`elaboracao-${os.id}`),
              dueDate: os.vencimento,
              priority: "media",
            });
          }

          if (os.situacao === "Em Orçamento") {
            items.push({
              id: `orcamento-${os.id}`,
              osId: os.id,
              osNumber: os.os,
              text: `O.S ${os.os} - Aguardando aprovação do orçamento`,
              completed: checkedItems.has(`orcamento-${os.id}`),
              dueDate: os.vencimento,
              priority: "baixa",
            });
          }

          if (os.situacao === "Com Dificuldade") {
            items.push({
              id: `dificuldade-${os.id}`,
              osId: os.id,
              osNumber: os.os,
              text: `O.S ${os.os} - Resolver dificuldade pendente`,
              completed: checkedItems.has(`dificuldade-${os.id}`),
              dueDate: os.vencimento,
              priority: "alta",
            });
          }
        } catch {}
      });

    const priorityOrder = { alta: 0, media: 1, baixa: 2 };
    return items
      .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
      .slice(0, 8);
  }, [ordensServico, checkedItems]);

  const toggleItem = (id: string) => {
    setCheckedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case "alta":
        return { borderColor: OB.destructive, background: '#fef2f2' };
      case "media":
        return { borderColor: '#f59e0b', background: '#fffbeb' };
      default:
        return { borderColor: '#3b82f6', background: OB.secondary };
    }
  };

  return (
    <Card className="border-0 shadow-md" style={{ background: OB.card }}>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg" style={{ background: OB.accent }}>
            <ListTodo className="h-5 w-5" style={{ color: OB.primary }} />
          </div>
          <CardTitle style={{ color: OB.foreground }}>Checklist de Tarefas</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {checklistItems.length === 0 ? (
          <div className="text-center py-8 rounded-lg" style={{ background: OB.accent }}>
            <CheckCircle2 size={40} className="mx-auto mb-2" style={{ color: OB.primary, opacity: 0.5 }} />
            <p className="text-sm" style={{ color: OB.chart3 }}>Nenhuma tarefa pendente</p>
          </div>
        ) : (
          checklistItems.map((item) => {
            const style = getPriorityStyle(item.priority);
            return (
              <div
                key={item.id}
                className={`flex items-center gap-3 p-3 rounded-lg border-l-4 transition-all ${item.completed ? "opacity-50" : ""}`}
                style={{ 
                  borderLeftColor: style.borderColor,
                  background: style.background
                }}
              >
                <Checkbox
                  id={item.id}
                  checked={item.completed}
                  onCheckedChange={() => toggleItem(item.id)}
                  className="border-slate-300 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                />
                <label
                  htmlFor={item.id}
                  className={`flex-1 text-sm cursor-pointer ${
                    item.completed
                      ? "line-through"
                      : ""
                  }`}
                  style={{ color: item.completed ? OB.mutedForeground : OB.foreground }}
                >
                  {item.text}
                </label>
                <Badge
                  variant="outline"
                  className="text-[10px] font-semibold"
                  style={{
                    borderColor: style.borderColor,
                    color: style.borderColor,
                    background: 'white'
                  }}
                >
                  {item.priority === "alta"
                    ? "Urgente"
                    : item.priority === "media"
                      ? "Atenção"
                      : "Normal"}
                </Badge>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
