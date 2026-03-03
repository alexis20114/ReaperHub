import * as ToastPrimitive from '@radix-ui/react-toast'
import { cn } from '@/lib/utils'
import { useState, createContext, useContext, useCallback, ReactNode } from 'react'
import { X } from 'lucide-react'

interface ToastItem { id: string; title: string; description?: string; variant?: 'default' | 'destructive' | 'success' }
interface ToastCtx { toast: (t: Omit<ToastItem, 'id'>) => void }

const ToastContext = createContext<ToastCtx>({ toast: () => {} })
export const useToast = () => useContext(ToastContext)

export function Toaster() {
  const [items, setItems] = useState<ToastItem[]>([])

  const toast = useCallback((t: Omit<ToastItem, 'id'>) => {
    const id = Math.random().toString(36).slice(2)
    setItems(prev => [...prev, { ...t, id }])
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      <ToastPrimitive.Provider swipeDirection="right">
        {items.map(item => (
          <ToastPrimitive.Root
            key={item.id}
            onOpenChange={(open) => { if (!open) setItems(prev => prev.filter(i => i.id !== item.id)) }}
            className={cn(
              'glass-card flex items-start gap-3 p-4 rounded-xl shadow-blood-intense border',
              item.variant === 'destructive' && 'border-blood-200/60',
              item.variant === 'success' && 'border-green-700/50',
              !item.variant && 'border-blood-200/30'
            )}
          >
            <div className="flex-1">
              <ToastPrimitive.Title className="text-sm font-tech font-semibold text-blood-50">
                {item.title}
              </ToastPrimitive.Title>
              {item.description && (
                <ToastPrimitive.Description className="text-xs text-text-dim mt-0.5">
                  {item.description}
                </ToastPrimitive.Description>
              )}
            </div>
            <ToastPrimitive.Close className="text-text-dim hover:text-blood-50 transition-colors">
              <X className="w-4 h-4" />
            </ToastPrimitive.Close>
          </ToastPrimitive.Root>
        ))}
        <ToastPrimitive.Viewport className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-80" />
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  )
}
