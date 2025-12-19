import { useToast } from "../../hooks/use-toast"
import { X } from "lucide-react"

export function Toaster() {
  const { toasts, dismiss } = useToast()

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            relative p-4 rounded-lg shadow-lg border backdrop-blur-sm
            animate-in slide-in-from-right-full duration-300
            ${toast.variant === 'destructive' 
              ? 'bg-red-50 border-red-200 text-red-900' 
              : 'bg-white border-slate-200 text-slate-900'
            }
          `}
        >
          <button
            onClick={() => dismiss(toast.id)}
            className="absolute top-2 right-2 text-slate-400 hover:text-slate-600"
          >
            <X size={14} />
          </button>
          {toast.title && (
            <div className="font-semibold text-sm pr-4">{toast.title}</div>
          )}
          {toast.description && (
            <div className="text-sm text-slate-600 mt-1">{toast.description}</div>
          )}
        </div>
      ))}
    </div>
  )
}
