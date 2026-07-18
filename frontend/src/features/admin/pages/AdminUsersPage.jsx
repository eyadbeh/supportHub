import { useState, useEffect } from 'react';
import { userApi } from '@/api/userApi';
import { toast } from 'react-hot-toast';
import { Loader2, Users, Shield, Headphones, User as UserIcon, Plus, Edit2, Ban, CheckCircle } from 'lucide-react';
import CreateUserModal from '../components/CreateUserModal';
import EditUserRoleModal from '../components/EditUserRoleModal';
import { useSelector } from 'react-redux';

const ROLE_CONFIG = {
  Admin: { icon: Shield, color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
  Support: { icon: Headphones, color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  User: { icon: UserIcon, color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400' },
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { user: currentUser } = useSelector(state => state.auth);
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const data = await userApi.getAll();
      setUsers(data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = async (data) => {
    try {
      await userApi.create(data);
      toast.success('User created successfully');
      fetchUsers();
    } catch (error) {
      if (error.response?.data?.errors) {
        Object.values(error.response.data.errors).forEach(err => toast.error(err[0]));
      } else {
        toast.error('Failed to create user');
      }
      throw error;
    }
  };

  const handleUpdateRole = async (userId, data) => {
    try {
      await userApi.updateRole(userId, data);
      toast.success('Role updated successfully');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update role');
      throw error;
    }
  };

  const handleToggleStatus = async (user) => {
    if (user.id === currentUser.id) {
      toast.error('You cannot disable your own account');
      return;
    }
    
    try {
      if (user.deleted_at) {
        await userApi.enable(user.id);
        toast.success('User enabled successfully');
      } else {
        if (!window.confirm('Are you sure you want to disable this user? They will not be able to log in.')) return;
        await userApi.disable(user.id);
        toast.success('User disabled successfully');
      }
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update user status');
    }
  };

  const filteredUsers = filter === 'all' 
    ? users 
    : users.filter(u => u.roles?.includes(filter));

  const stats = {
    all: users.length,
    Admin: users.filter(u => u.roles?.includes('Admin')).length,
    Support: users.filter(u => u.roles?.includes('Support')).length,
    User: users.filter(u => u.roles?.includes('User')).length,
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">View and manage all system users.</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create User
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {['all', 'Admin', 'Support', 'User'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-muted hover:bg-muted/80 text-muted-foreground'
            }`}
          >
            {f === 'all' ? 'All Users' : f === 'Support' ? 'Supporters' : `${f}s`}
            <span className="ml-2 text-xs opacity-70">({stats[f]})</span>
          </button>
        ))}
      </div>

      {/* Users Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredUsers.length === 0 ? (
          <div className="col-span-full py-12 text-center text-muted-foreground">
            No users found.
          </div>
        ) : (
          filteredUsers.map(user => {
            const roleName = user.roles?.[0] || 'User';
            const config = ROLE_CONFIG[roleName] || ROLE_CONFIG.User;
            const RoleIcon = config.icon;

            return (
              <div key={user.id} className="rounded-xl border bg-card p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg shrink-0 overflow-hidden">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="h-full w-full object-cover rounded-full" />
                    ) : (
                      user.name?.charAt(0)?.toUpperCase()
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{user.name}</p>
                    <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${config.color}`}>
                        <RoleIcon className="h-3 w-3" />
                        {roleName}
                      </span>
                    </div>
                    {user.departments?.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {user.departments.map(dept => (
                          <span key={dept.id} className="text-xs bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                            {dept.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => setUserToEdit(user)}
                      className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-primary transition-colors"
                      title="Edit Role & Departments"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    {user.id !== currentUser.id && (
                      <button
                        onClick={() => handleToggleStatus(user)}
                        className={`p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                          user.deleted_at ? 'text-green-500 hover:text-green-600' : 'text-red-500 hover:text-red-600'
                        }`}
                        title={user.deleted_at ? 'Enable User' : 'Disable User'}
                      >
                        {user.deleted_at ? <CheckCircle className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                      </button>
                    )}
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                  <span>Joined {new Date(user.created_at).toLocaleDateString()}</span>
                  {user.deleted_at && (
                    <span className="text-red-500 font-medium">Disabled</span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateUser}
      />

      <EditUserRoleModal
        isOpen={!!userToEdit}
        onClose={() => setUserToEdit(null)}
        user={userToEdit}
        onSuccess={handleUpdateRole}
      />
    </div>
  );
}
