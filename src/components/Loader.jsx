import { LoaderCircle } from "lucide-react";

export default function Loader({
  text = "Loading...",
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="flex w-[320px] flex-col items-center rounded-2xl bg-white p-8 shadow-2xl dark:bg-slate-900">
        <div className="mb-5 rounded-full bg-emerald-100 p-4 dark:bg-emerald-900/30">
          <LoaderCircle
            size={42}
            className="animate-spin text-emerald-600"
          />
        </div>

        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          {text}
        </h2>

        <p className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400">
          Please wait a moment...
        </p>

        <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-emerald-500"></div>
        </div>
      </div>
    </div>
  );
}