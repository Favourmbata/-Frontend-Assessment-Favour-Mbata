interface EmptyStateProps {
  title?: string;
  message?: string;
  action?: React.ReactNode;
}

export function EmptyState({
  title = "No Pokémon found",
  message = "Try adjusting your search or filter.",
  action,
}: EmptyStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center py-24 text-center"
    >
     
      <div className="w-20 h-20 mb-6 relative" aria-hidden="true">
        <div className="w-full h-full rounded-full border-4 border-gray-300 overflow-hidden">
          <div className="w-full h-1/2 bg-red-400" />
          <div className="w-full h-1/2 bg-white" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 rounded-full bg-white border-4 border-gray-300" />
        </div>
      </div>
      <h2 className="text-xl font-bold text-gray-700 mb-2">{title}</h2>
      <p className="text-gray-500 max-w-xs">{message}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
