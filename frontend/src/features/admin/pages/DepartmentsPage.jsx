import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-hot-toast';
import { departmentApi } from '@/api/departmentApi';
import { cn } from '@/lib/utils';
import { Plus, Edit, Trash2, X } from 'lucide-react';

const departmentSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  description: z.string().optional(),
  is_active: z.boolean().default(true),
});

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState([]);
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
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      name: '',
      description: '',
      is_active: true,
    },
  });

  const fetchDepartments = async () => {
    try {
      setIsLoading(true);
      const data = await departmentApi.getAll();
      console.log('Fetched departments:', data);
      setDepartments(data);
    } catch (error) {
      console.error('Fetch departments error:', error, error.response?.data);
      toast.error('Failed to load departments');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    reset({ name: '', description: '', is_active: true });
    setIsModalOpen(true);
  };

  const openEditModal = (department) => {
    setEditingId(department.id);
    reset({
      name: department.name,
      description: department.description || '',
      is_active: department.is_active,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    reset();
  };

  const onSubmit = async (data) => {
    try {
      if (editingId) {
        await departmentApi.update(editingId, data);
        toast.success('Department updated successfully');
      } else {
        await departmentApi.create(data);
        toast.success('Department created successfully');
      }
      closeModal();
      fetchDepartments();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Action failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        await departmentApi.delete(id);
        toast.success('Department deleted');
        fetchDepartments();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Departments</h1>
          <p className="text-muted-foreground">Manage support departments</p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Add Department
        </button>
      </div>

      <div className="rounded-md border bg-white dark:bg-slate-950">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-900 border-b">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Description</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center">Loading...</td>
              </tr>
            ) : departments.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center">No departments found.</td>
              </tr>
            ) : (
              departments.map((dept) => (
                <tr key={dept.id} className="border-b last:border-0 hover:bg-slate-50 dark:hover:bg-slate-900">
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">{dept.name}</td>
                  <td className="px-6 py-4 text-slate-500">{dept.description || '-'}</td>
                  <td className="px-6 py-4">
                    <span className={cn("px-2 py-1 rounded-full text-xs font-medium", dept.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800")}>
                      {dept.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button onClick={() => openEditModal(dept)} className="text-blue-600 hover:text-blue-900">
                      <Edit className="h-4 w-4 inline" />
                    </button>
                    <button onClick={() => handleDelete(dept.id)} className="text-red-600 hover:text-red-900">
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
              <h2 className="text-lg font-semibold">{editingId ? 'Edit Department' : 'Create Department'}</h2>
              <button onClick={closeModal} className="text-slate-500 hover:text-slate-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <input
                  {...register('name')}
                  className={cn(
                    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
                    errors.name && "border-red-500"
                  )}
                  placeholder="e.g. IT Support"
                />
                {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea
                  {...register('description')}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="Optional description"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_active"
                  {...register('is_active')}
                  className="h-4 w-4 rounded border-slate-300 text-primary"
                />
                <label htmlFor="is_active" className="text-sm font-medium leading-none">
                  Active
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
