import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ticketApi } from '../../../api/ticketApi';
import { replyApi } from '../../../api/replyApi';
import { statusApi } from '../../../api/statusApi';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';

export default function TicketDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  
  const [ticket, setTicket] = useState(null);
  const [statuses, setStatuses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [replyMessage, setReplyMessage] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const hasAdminRole = user?.roles?.some(r => r.name === 'Admin' || r.name === 'Support');

  useEffect(() => {
    fetchTicket();
    if (hasAdminRole) {
      fetchStatuses();
    }
  }, [id, hasAdminRole]);

  const fetchTicket = async () => {
    try {
      setIsLoading(true);
      const data = await ticketApi.getOne(id);
      setTicket(data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load ticket details');
      navigate('/tickets');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStatuses = async () => {
    try {
      const data = await statusApi.getAll();
      setStatuses(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim()) return;

    try {
      setIsReplying(true);
      const newReply = await replyApi.create(id, { message: replyMessage });
      // Update local state without refetching the whole ticket
      setTicket(prev => ({
        ...prev,
        replies: [...(prev.replies || []), newReply]
      }));
      setReplyMessage('');
      toast.success('Reply added');
    } catch (error) {
      console.error(error);
      toast.error('Failed to add reply');
    } finally {
      setIsReplying(false);
    }
  };

  const handleStatusChange = async (newStatusId) => {
    try {
      setIsUpdatingStatus(true);
      const updated = await ticketApi.update(id, { status_id: newStatusId });
      setTicket(prev => ({ ...prev, status: updated.status, status_id: updated.status_id }));
      toast.success('Status updated');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update status');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Loading ticket...</div>;
  }

  if (!ticket) return null;

  return (
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6">
      
      {/* Main Content: Ticket & Replies */}
      <div className="flex-1 space-y-6">
        
        {/* Ticket Header & Description */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                [{ticket.ticket_number}] {ticket.title}
              </h1>
              <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                <span>By {ticket.user?.name}</span>
                <span>•</span>
                <span>{new Date(ticket.created_at).toLocaleString()}</span>
              </div>
            </div>
            <span 
              className="px-3 py-1 rounded-full text-sm font-medium text-white"
              style={{ backgroundColor: ticket.status?.color || '#cbd5e1' }}
            >
              {ticket.status?.name}
            </span>
          </div>
          
          <div className="prose dark:prose-invert max-w-none mt-6 border-t dark:border-gray-700 pt-6 whitespace-pre-wrap">
            {ticket.description}
          </div>
        </div>

        {/* Replies List */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Conversation</h3>
          
          {ticket.replies?.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm">No replies yet.</p>
          ) : (
            ticket.replies?.map(reply => (
              <div key={reply.id} className={`flex ${reply.user?.id === user.id ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-lg p-4 ${
                  reply.user?.roles?.some(r => r.name === 'Support' || r.name === 'Admin') 
                    ? 'bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800' 
                    : 'bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700'
                }`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-medium text-sm text-gray-900 dark:text-white">{reply.user?.name}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(reply.created_at).toLocaleString()}
                    </span>
                    {reply.user?.roles?.some(r => r.name === 'Support' || r.name === 'Admin') && (
                      <span className="text-[10px] uppercase tracking-wider bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200 px-1.5 py-0.5 rounded">
                        Agent
                      </span>
                    )}
                  </div>
                  <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap text-sm">
                    {reply.message}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add Reply Form */}
        {!ticket.status?.is_closed ? (
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mt-6">
            <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">Add a Reply</h4>
            <form onSubmit={handleReplySubmit}>
              <textarea
                rows={4}
                className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Type your message here..."
                value={replyMessage}
                onChange={e => setReplyMessage(e.target.value)}
                required
              />
              <div className="mt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={isReplying || !replyMessage.trim()}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
                >
                  {isReplying ? 'Sending...' : 'Send Reply'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 text-center border dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400 text-sm">This ticket is closed. You cannot add new replies.</p>
          </div>
        )}
      </div>

      {/* Sidebar: Details & Actions */}
      <div className="w-full md:w-80 space-y-6">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Ticket Details</h3>
          
          <dl className="space-y-4 text-sm">
            <div>
              <dt className="text-gray-500 dark:text-gray-400">Department</dt>
              <dd className="font-medium text-gray-900 dark:text-white">{ticket.department?.name}</dd>
            </div>
            <div>
              <dt className="text-gray-500 dark:text-gray-400">Category</dt>
              <dd className="font-medium text-gray-900 dark:text-white">{ticket.category?.name}</dd>
            </div>
            <div>
              <dt className="text-gray-500 dark:text-gray-400">Priority</dt>
              <dd className="font-medium text-gray-900 dark:text-white">{ticket.priority}</dd>
            </div>
            {ticket.assignee && (
              <div>
                <dt className="text-gray-500 dark:text-gray-400">Assigned To</dt>
                <dd className="font-medium text-gray-900 dark:text-white">{ticket.assignee.name}</dd>
              </div>
            )}
          </dl>

          {/* Admin Actions */}
          {hasAdminRole && (
            <div className="mt-8 pt-6 border-t dark:border-gray-700 space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-white">Admin Actions</h4>
              
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Change Status</label>
                <select
                  disabled={isUpdatingStatus}
                  className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                  value={ticket.status?.id || ''}
                  onChange={(e) => handleStatusChange(e.target.value)}
                >
                  {statuses.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

            </div>
          )}
        </div>
      </div>

    </div>
  );
}
