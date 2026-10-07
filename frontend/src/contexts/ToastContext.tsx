import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2);
    const newToast = { ...toast, id };
    setToasts(prev => [...prev, newToast]);

    const duration = toast.duration || 5000;
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm" role="status" aria-live="polite">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`rounded-lg shadow-lg p-4 flex items-start gap-3 animate-[slideIn_0.3s_ease-out] ${
              toast.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' :
              toast.type === 'error' ? 'bg-red-50 border border-red-200 text-red-800' :
              toast.type === 'warning' ? 'bg-amber-50 border border-amber-200 text-amber-800' :
              'bg-blue-50 border border-blue-200 text-blue-800'
            }`}
          >
            <div className="flex-1">
              <p className="font-medium text-sm">{toast.title}</p>
              {toast.message && <p className="text-xs mt-1 opacity-80">{toast.message}</p>}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-current opacity-50 hover:opacity-100 text-lg leading-none"
              aria-label="Dismiss notification"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
}
