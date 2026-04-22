import Link from "next/link";
import { format } from "date-fns";
import StatusBadge from "./StatusBadge";
import { Calendar, IndianRupee } from "lucide-react";

export default function ClientCard({ client }) {
  return (
    <Link href={`/clients/${client.id}`}>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow active:scale-[0.98]">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{client.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{client.eventType}</p>
          </div>
          <StatusBadge status={client.status} />
        </div>
        
        <div className="flex justify-between items-end mt-4">
          <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span>{format(new Date(client.eventDate), "MMM dd, yyyy")}</span>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Total</p>
            <p className="font-medium flex items-center justify-end">
              <IndianRupee className="w-3.5 h-3.5" />
              {client.totalAmount?.toLocaleString('en-IN')}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
