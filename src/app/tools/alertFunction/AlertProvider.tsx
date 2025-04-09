"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import styled from "styled-components";

const AlertDiv = styled.div`
  height: auto;
`;

interface AlertData {
  title: string;
  description: string;
}

interface InternalAlertData extends AlertData {
  onConfirm: () => void;
  onCancel: () => void;
}

interface AlertContextType {
  alert: InternalAlertData | null;
  showAlert: (alertData: AlertData) => Promise<boolean>;
  hideAlert: () => void;
}

const AlertContext = createContext<AlertContextType | null>(null);

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
};

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [alert, setAlert] = useState<InternalAlertData | null>(null);
  const resolverRef = useRef<(value: boolean) => void>();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!alert) return;

      switch (e.key) {
        case "Tab":
          e.preventDefault();
          break;
        case "Enter":
          alert.onConfirm();
          break;
        case "Backspace":
          alert.onCancel();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [alert]);

  const showAlert = (alertData: AlertData): Promise<boolean> => {
    return new Promise((resolve) => {
      resolverRef.current = (value: boolean) => {
        resolve(value);
        resolverRef.current = undefined;
      };

      setAlert({
        ...alertData,
        onConfirm: () => {
          resolverRef.current?.(true);
          setAlert(null);
        },
        onCancel: () => {
          resolverRef.current?.(false);
          setAlert(null);
        },
      });
    });
  };

  const hideAlert = () => {
    setAlert(null);
  };

  return (
    <AlertContext.Provider value={{ alert, showAlert, hideAlert }}>
      {children}
    </AlertContext.Provider>
  );
};
