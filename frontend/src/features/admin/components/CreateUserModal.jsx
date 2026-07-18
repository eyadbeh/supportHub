import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X, Loader2 } from 'lucide-react';
import { departmentApi } from '@/api/departmentApi';
import { cn } from '@/lib/utils';

const createUserSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
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

export default function CreateUserModal({ isOpen, onClose, onSuccess }) {
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
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'User',
      departments: [],
    },
  });

  const selectedRole = watch('role');
  const selectedDepartments = watch('departments') || [];

  useEffect(() => {
    if (isOpen) {
      fetchDepartments();
      reset();
    }
  }, [isOpen, reset]);

  const fetchDepartments = async () => {
    try {
      setIsLoadingDepartments(true);
      const data = await departmentApi.getAll();
      // Only show active departments
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
      // If not support, ensure departments are empty
      if (data.role !== 'Support') {
        data.departments = [];
      }
      await onSuccess(data);
      onClose();
    } catch (error) {
      console.error('Submission failed', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-950 rounded-xl shadow-xl w-full max-w-lg overflow-hidden border dark:border-slate-800">
        <div className="flex items-center justify-between p-6 border-b dark:border-slate-800">
          <h2 className="text-xl font-semibold">Create New User</h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <input
                type="text"
                {...register('name')}
                className={cn(
                  "w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary",
                  errors.name ? "border-destructive focus:ring-destructive" : "border-input"
                )}
                placeholder="John Doe"
              />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                {...register('email')}
                className={cn(
                  "w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary",
                  errors.email ? "border-destructive focus:ring-destructive" : "border-input"
                )}
                placeholder="john@example.com"
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <input
                type="password"
                {...register('password')}
                className={cn(
                  "w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary",
                  errors.password ? "border-destructive focus:ring-destructive" : "border-input"
                )}
                placeholder="Minimum 8 characters"
              />
              {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
            </div>

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
                Create User
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
