import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { profileApi } from '@/api/profileApi';
import { setUser } from '@/store/authSlice';
import { toast } from 'react-hot-toast';
import { Loader2, User as UserIcon, Camera, KeyRound, Mail, Building2 } from 'lucide-react';

export default function ProfilePage() {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [profileData, setProfileData] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    password: '',
    password_confirmation: '',
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsFetching(true);
      const data = await profileApi.get();
      setProfileData(data);
      setFormData(prev => ({ ...prev, name: data.name }));
      setAvatarPreview(data.avatar);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load profile');
    } finally {
      setIsFetching(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size should be less than 2MB');
        return;
      }
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.password_confirmation) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      setIsLoading(true);
      const data = new FormData();
      data.append('name', formData.name);
      
      if (formData.password) {
        data.append('password', formData.password);
        data.append('password_confirmation', formData.password_confirmation);
      }
      
      if (avatarFile) {
        data.append('avatar', avatarFile);
      }

      // Add _method=PUT for Laravel if we used put route, but we used post route in api.php
      
      const response = await profileApi.update(data);
      
      // Update global user state
      dispatch(setUser({ ...user, name: response.data.name, avatar: response.data.avatar }));
      setProfileData(response.data);
      setFormData(prev => ({ ...prev, password: '', password_confirmation: '' }));
      setAvatarFile(null);
      
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error(error);
      const message = error.response?.data?.message || 'Failed to update profile';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground">Manage your personal information and security.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
        {/* Left Column: Read-only Info */}
        <div className="space-y-6">
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 flex flex-col items-center text-center">
            <div className="relative h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-3xl mb-4 overflow-hidden border-4 border-background shadow-sm">
              {avatarPreview ? (
                <img src={avatarPreview} alt={profileData?.name} className="h-full w-full object-cover" />
              ) : (
                profileData?.name?.charAt(0)?.toUpperCase()
              )}
            </div>
            <h3 className="font-semibold text-lg">{profileData?.name}</h3>
            <p className="text-sm text-muted-foreground mb-4">{profileData?.roles?.[0] || 'User'}</p>
            
            <div className="w-full space-y-3 text-left">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="truncate">{profileData?.email}</span>
              </div>
              
              {profileData?.departments?.length > 0 && (
                <div className="flex items-start gap-3 text-sm">
                  <Building2 className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  <div className="flex flex-wrap gap-1">
                    {profileData.departments.map(d => (
                      <span key={d.id} className="bg-muted px-2 py-0.5 rounded-md text-xs text-muted-foreground">
                        {d.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Edit Form */}
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-6">Edit Information</h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Profile Picture
              </label>
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center overflow-hidden border">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Preview" className="h-full w-full object-cover" />
                  ) : (
                    <UserIcon className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1">
                  <label htmlFor="avatar-upload" className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 border border-input bg-background hover:bg-accent hover:text-accent-foreground text-sm font-medium rounded-md transition-colors">
                    <Camera className="h-4 w-4" />
                    Change Picture
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/jpeg,image/png,image/gif"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <p className="text-xs text-muted-foreground mt-2">JPG, PNG or GIF. Max 2MB.</p>
                </div>
              </div>
            </div>

            <hr className="border-border" />

            {/* Name */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium leading-none">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>

            <hr className="border-border" />

            {/* Password */}
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium leading-none flex items-center gap-2 mb-4">
                  <KeyRound className="h-4 w-4 text-muted-foreground" />
                  Change Password
                </h4>
                <p className="text-sm text-muted-foreground mb-4">Leave blank if you don't want to change your password.</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium leading-none text-muted-foreground">
                    New Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.password}
                    onChange={handleInputChange}
                    minLength={8}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="password_confirmation" className="text-sm font-medium leading-none text-muted-foreground">
                    Confirm Password
                  </label>
                  <input
                    id="password_confirmation"
                    name="password_confirmation"
                    type="password"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.password_confirmation}
                    onChange={handleInputChange}
                    minLength={8}
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
