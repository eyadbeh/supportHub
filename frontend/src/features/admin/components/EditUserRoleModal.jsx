import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X, Loader2 } from 'lucide-react';
import { departmentApi } from '@/api/departmentApi';
import { cn } from '@/lib/utils';

const editRoleSchema = z.object({
  role: z.enum(['Admin', 'Support', 'User']),
  departments: z.array(z.number()).optional(),
}).refine(data => {
  if (data.role === 'Support') {
    return data.departments && data.departments.length > 0;
  }
  return true;
}, {
  message: 'Support agents must be assigned to at least one department',
  path: ['departments'],
});

export default function EditUserRoleModal({ isOpen, onClose, user, onSuccess }) {
  const [departments, setDepartments] = useState([]);
  const [isLoadingDepartments, setIsLoadingDepartments] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(editRoleSchema),
    defaultValues: {
      role: 'User',
      departments: [],
    },
  });

  const selectedRole = watch('role');
  const selectedDepartments = watch('departments') || [];

  useEffect(() => {
    if (isOpen && user) {
      fetchDepartments();
      const currentRole = user.roles?.[0] || 'User';
      const currentDepts = user.departments?.map(d => d.id) || [];
      reset({
        role: currentRole,
        departments: currentDepts,
      });
    }
  }, [isOpen, user, reset]);

  const fetchDepartments = async () => {
    try {
      setIsLoadingDepartments(true);
      const data = await departmentApi.getAll();
      setDepartments(data.filter(d => d.is_active));
    } catch (error) {
      console.error('Failed to load departments', error);
    } finally {
      setIsLoadingDepartments(false);
    }
  };

  const handleDepartmentToggle = (deptId) => {
    const current = [...selectedDepartments];
    if (current.includes(deptId)) {
      setValue('departments', current.filter(id => id !== deptId), { shouldValidate: true });
    } else {
      setValue('departments', [...current, deptId], { shouldValidate: true });
    }
  };

  const onSubmit = async (data) => {
    try {
      if (data.role !== 'Support') {
        data.departments = [];
      }
      await onSuccess(user.id, data);
      onClose();
    } catch (error) {
      console.error('Submission failed', error);
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-950 rounded-xl shadow-xl w-full max-w-lg overflow-hidden border dark:border-slate-800">
        <div className="flex items-center justify-between p-6 border-b dark:border-slate-800">
          <div>
            <h2 className="text-xl font-semibold">Edit Role</h2>
            <p className="text-sm text-muted-foreground mt-1">{user.name} ({user.email})</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 self-start mt-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Role</label>
              <select
                {...register('role')}
                className={cn(
                  "w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary",
                  errors.role ? "border-destructive focus:ring-destructive" : "border-input"
                )}
              >
                <option value="User">User</option>
                <option value="Support">Support Agent</option>
                <option value="Admin">Admin</option>
              </select>
              {errors.role && <p className="text-xs text-destructive">{errors.role.message}</p>}
            </div>

            {selectedRole === 'Support' && (
              <div className="space-y-2 pt-2 border-t dark:border-slate-800">
                <label className="text-sm font-medium">Assign Departments</label>
                {isLoadingDepartments ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" /> Loading departments...
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {departments.map((dept) => (
                      <label
                        key={dept.id}
                        className={cn(
                          "flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors",
                          selectedDepartments.includes(dept.id)
                            ? "border-primary bg-primary/5"
                            : "hover:bg-slate-50 dark:hover:bg-slate-900"
                        )}
                      >
                        <input
                          type="checkbox"
                          className="rounded border-slate-300 text-primary focus:ring-primary"
                          checked={selectedDepartments.includes(dept.id)}
                          onChange={() => handleDepartmentToggle(dept.id)}
                        />
                        <span className="text-sm font-medium">{dept.name}</span>
                      </label>
                    ))}
                  </div>
                )}
                {errors.departments && <p className="text-xs text-destructive">{errors.departments.message}</p>}
              </div>
            )}

            <div className="pt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium border rounded-md hover:bg-slate-50 dark:hover:bg-slate-900"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 flex items-center gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
