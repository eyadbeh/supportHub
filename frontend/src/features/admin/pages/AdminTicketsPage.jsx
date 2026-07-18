import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ticketApi } from '@/api/ticketApi';
import { statusApi } from '@/api/statusApi';
import { toast } from 'react-hot-toast';
import { Loader2, ExternalLink } from 'lucide-react';

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [ticketsData, statusesData] = await Promise.all([
        ticketApi.getAll(),
        statusApi.getAll(),
      ]);
      setTickets(ticketsData);
      setStatuses(statusesData);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load tickets');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (ticketId, newStatusId) => {
    try {
      setUpdatingId(ticketId);
      const updated = await ticketApi.update(ticketId, { status_id: newStatusId });
      setTickets(prev =>
        prev.map(t => (t.id === ticketId ? { ...t, status: updated.status, status_id: updated.status_id } : t))
      );
      toast.success('Status updated');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">All Tickets</h1>
        <p className="text-muted-foreground">Manage and update ticket statuses across all departments.</p>
      </div>

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Number</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Title</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">User</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Department</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Priority</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Created</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {tickets.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                    No tickets found.
                  </td>
                </tr>
              ) : (
                tickets.map(ticket => (
                  <tr key={ticket.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-primary">
                      {ticket.ticket_number}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium truncate max-w-[200px]">
                      {ticket.title}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {ticket.user?.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {ticket.department?.name}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        ticket.priority === 'Critical' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                        ticket.priority === 'High' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                        ticket.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                        'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                      }`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <select
                        value={ticket.status?.id || ''}
                        onChange={e => handleStatusChange(ticket.id, e.target.value)}
                        disabled={updatingId === ticket.id}
                        className="rounded-md border border-border bg-background px-2 py-1 text-xs focus:ring-2 focus:ring-ring disabled:opacity-50"
                      >
                        {statuses.map(s => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
                      {new Date(ticket.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <Link
                        to={`/tickets/${ticket.id}`}
                        className="inline-flex items-center gap-1 text-primary hover:underline"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
