export default function StatCard({ title, value, icon: Icon, trend }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
        <div className="p-2 bg-brand-50 dark:bg-brand-900/30 rounded-xl">
          <Icon className="w-5 h-5 text-brand-600 dark:text-brand-400" />
        </div>
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        {trend && (
          <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
            {trend}
          </p>
        )}
      </div>
    </div>
  );
}
