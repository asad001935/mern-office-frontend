import { Bell } from "lucide-react";

export default function NotificationBell({ notifications, onClear }) {
  const latest = notifications.slice(0, 4);

  return (
    <div className="group relative">
      <button
        type="button"
        aria-label="Notifications"
        className="relative grid size-10 place-items-center rounded-lg border border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
      >
        <Bell size={18} />
        {notifications.length > 0 && (
          <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
            {notifications.length}
          </span>
        )}
      </button>

      <div className="invisible absolute right-0 z-30 mt-2 w-80 translate-y-1 rounded-lg border border-slate-200 bg-white p-3 opacity-0 shadow-xl transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 dark:border-slate-700 dark:bg-slate-900">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-950 dark:text-white">Notifications</p>
          {notifications.length > 0 && (
            <button type="button" onClick={onClear} className="text-xs font-semibold text-emerald-600">
              Clear
            </button>
          )}
        </div>
        <div className="space-y-2">
          {latest.map((notification) => (
            <div key={notification.id} className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{notification.message}</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{notification.time}</p>
            </div>
          ))}
          {latest.length === 0 && <p className="p-3 text-sm text-slate-500">No new notifications.</p>}
        </div>
      </div>
    </div>
  );
}
