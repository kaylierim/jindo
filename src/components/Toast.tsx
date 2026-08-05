interface ToastProps {
  message: string;
  visible: boolean;
}

export function Toast({ message, visible }: ToastProps) {
  return (
    <div
      role="status"
      aria-hidden={!visible}
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-jindo-charcoal px-5 py-2 text-sm font-medium text-white shadow-lg transition-all duration-300 ease-in-out ${
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-4 opacity-0 pointer-events-none"
      }`}
    >
      {visible ? message : ""}
    </div>
  );
}
