import { useEffect } from "react";
import { useToast } from "@/hooks/useToast";

export default function Toast() {
  const { toast, hideToast } = useToast();

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        hideToast();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [toast.show, hideToast]);

  if (!toast.show) return null;

  return (
    <div className={`medical-toast ${toast.show ? 'show' : ''} ${toast.type}`}>
      <span>{toast.message}</span>
    </div>
  );
}
