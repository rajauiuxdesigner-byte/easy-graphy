import clsx from "clsx";

export default function StatusBadge({ status, className }) {
  const isPaid = status === "Paid";
  
  return (
    <span className={clsx(
      "px-2.5 py-1 text-xs font-medium rounded-full",
      isPaid 
        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      className
    )}>
      {status}
    </span>
  );
}
