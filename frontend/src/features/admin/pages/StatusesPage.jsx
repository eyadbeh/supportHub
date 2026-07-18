import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-hot-toast';
import { statusApi } from '@/api/statusApi';
import { cn } from '@/lib/utils';
import { Plus, Edit, Trash2, X } from 'lucide-react';

const statusSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  slug: z.string().min(2, 'Slug is required'),
  color: z.string().optional(),
  is_closed: z.boolean().default(false),
  sort_order: z.string().or(z.number()).transform((val) => Number(val) || 0),
});

export default function StatusesPage() {
  const [statuses, setStatuses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(statusSchema),
    defaultValues: {
      name: '',
      slug: '',
      color: '#3b82f6', // default blue
      is_closed: false,
      sort_order: 0,
    },
  });

  const fetchStatuses = async () => {
    try {
      setIsLoading(true);
      const data = await statusApi.getAll();
      setStatuses(data);
    } catch (error) {
      toast.error('Failed to load statuses');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatuses();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    reset({ name: '', slug: '', color: '#3b82f6', is_closed: false, sort_order: 0 });
    setIsModalOpen(true);
  };

  const openEditModal = (status) => {
    setEditingId(status.id);
    reset({
      name: status.name,
      slug: status.slug,
      color: status.color || '#000000',
      is_closed: status.is_closed,
      sort_order: status.sort_order,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    reset();
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    setValue('name', name);
    if (!editingId) {
      // Auto-generate slug
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      setValue('slug', slug);
    }
  };

  const onSubmit = async (data) => {
    try {
      if (editingId) {
        await statusApi.update(editingId, data);
        toast.success('Status updated');
      } else {
        await statusApi.create(data);
        toast.success('Status created');
      }
      closeModal();
      fetchStatuses();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Action failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this status?')) {
      try {
        await statusApi.delete(id);
        toast.success('Status deleted');
        fetchStatuses();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Statuses</h1>
          <p className="text-muted-foreground">Manage ticket lifecycle states</p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Add Status
        </button>
      </div>

      <div className="rounded-md border bg-white dark:bg-slate-950">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-900 border-b">
            <tr>
              <th className="px-6 py-3">Order</th>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Slug</th>
              <th className="px-6 py-3">Type</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center">Loading...</td>
              </tr>
            ) : statuses.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center">No statuses found.</td>
              </tr>
            ) : (
              statuses.map((status) => (
                <tr key={status.id} className="border-b last:border-0 hover:bg-slate-50 dark:hover:bg-slate-900">
                  <td className="px-6 py-4 text-slate-500">{status.sort_order}</td>
                  <td className="px-6 py-4 font-medium">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: status.color || '#ccc' }}></div>
                      {status.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500 font-mono text-xs">{status.slug}</td>
                  <td className="px-6 py-4">
                    {status.is_closed ? (
                      <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium dark:bg-slate-800 dark:text-slate-300">
                        Closed State
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium dark:bg-blue-900/30 dark:text-blue-400">
                        Open State
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button onClick={() => openEditModal(status)} className="text-blue-600 hover:text-blue-900">
                      <Edit className="h-4 w-4 inline" />
                    </button>
                    <button onClick={() => handleDelete(status.id)} className="text-red-600 hover:text-red-900">
                      <Trash2 className="h-4 w-4 inline" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-950 rounded-xl max-w-md w-full p-6 shadow-lg border">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">{editingId ? 'Edit Status' : 'Create Status'}</h2>
              <button onClick={closeModal} className="text-slate-500 hover:text-slate-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <input
                  {...register('name')}
                  onChange={handleNameChange}
                  className={cn(
                    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
                    errors.name && "border-red-500"
                  )}
                  placeholder="e.g. In Progress"
                />
                {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Slug</label>
                <input
                  {...register('slug')}
                  className={cn(
                    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono",
                    errors.slug && "border-red-500"
                  )}
                />
                {errors.slug && <p className="text-xs text-red-500">{errors.slug.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      {...register('color')}
                      className="h-10 w-14 rounded-md border border-input p-1 cursor-pointer"
                    />
                    <input
                      type="text"
                      {...register('color')}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm uppercase"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sort Order</label>
                  <input
                    type="number"
                    {...register('sort_order')}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2 border-t mt-4">
                <input
                  type="checkbox"
                  id="is_closed"
                  {...register('is_closed')}
                  className="h-4 w-4 rounded border-slate-300 text-primary"
                />
                <label htmlFor="is_closed" className="text-sm font-medium leading-none">
                  Marks ticket as Closed
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
