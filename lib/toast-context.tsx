"use client";

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import { CheckCircle2 } from "lucide-react";

type Toast = { id: number; message: string };

type ToastContextValue = {
  showToast: (message: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counter = useRef(0);

  const showToast = useCallback((message: string) => {
    const id = counter.current++;
    setToasts((prev) => [...prev, { id, message }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 2800);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex flex-col items-center gap-2 px-4 sm:top-6">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className="animate-toast-in pointer-events-auto flex items-center gap-2 rounded-xl border border-border bg-white px-4 py-3 text-sm font-medium text-ink shadow-elevated"
          >
            <CheckCircle2 size={18} className="shrink-0 text-success" aria-hidden="true" />
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
