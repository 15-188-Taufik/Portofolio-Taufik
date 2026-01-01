export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#121212]">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner CSS Manual */}
        <div className="w-16 h-16 border-4 border-[#1E1E1E] border-t-[#FFF44F] rounded-full animate-spin"></div>
        <p className="text-[#CFB53B] font-bold animate-pulse">Memuat Data...</p>
      </div>
    </div>
  );
}