import { useState, useCallback } from "react";

let globalToastState = {
  show: false,
  message: "",
  type: "success"
};

let globalSetToast = () => {};

export function useToast() {
  const [toast, setToast] = useState(globalToastState);

  // Update global setter
  globalSetToast = setToast;

  const showToast = useCallback((message, type = "success") => {
    const newToast = { show: true, message, type };
    globalToastState = newToast;
    globalSetToast(newToast);
  }, []);

  const hideToast = useCallback(() => {
    const newToast = { show: false, message: "", type: "success" };
    globalToastState = newToast;
    globalSetToast(newToast);
  }, []);

  return { toast, showToast, hideToast };
}
