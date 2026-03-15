const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-950">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-red-500 font-semibold text-lg">Loading BugFlow...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
