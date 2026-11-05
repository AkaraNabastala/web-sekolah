import { toast } from '../../hooks/useToast';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { schoolApi } from '../../services/api';
import {
  Save,
  Lock,
  User,
  Mail,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Key,
  UserPlus,
  Trash2,
  Shield,
  Clock,
  X,
  Sparkles
} from 'lucide-react';

export const ManageAccount: React.FC = () => {
  const { admin, updateAdminUser } = useAuth();
  const [fullName, setFullName] = useState(admin?.full_name || '');
  const [email, setEmail] = useState(admin?.email || '');
  const [username, setUsername] = useState(admin?.username || '');
  const [avatar, setAvatar] = useState(admin?.avatar || '');

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Multi-user & Roles List
  const [usersList, setUsersList] = useState<any[]>([]);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    full_name: '',
    email: '',
    password: '',
    role: 'admin_konten'
  });

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [addingUser, setAddingUser] = useState(false);

  const loadUsers = async () => {
    try {
      const data = await schoolApi.getAdminUsers();
      setUsersList(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);


  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await schoolApi.updateAdminProfile({ full_name: fullName, email, username, avatar });
      if (res.success && res.user) {
        updateAdminUser(res.user);
        toast.success('Profil akun administrator berhasil disimpan!');
        loadUsers();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal memperbarui profil.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Konfirmasi password baru tidak cocok.');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Password baru minimal 6 karakter.');
      return;
    }

    setSavingPassword(true);
    try {
      const res = await schoolApi.changePassword({ currentPassword, newPassword });
      if (res.success) {
        toast.success(res.message);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal mengubah password.');
    } finally {
      setSavingPassword(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newUser.password.length < 6) {
      toast.error('Password minimal 6 karakter.');
      return;
    }
    setAddingUser(true);
    try {
      const res = await schoolApi.createAdminUser(newUser);
      if (res.success) {
        toast.success('Akun pengelola baru berhasil ditambahkan!');
        setShowAddUserModal(false);
        setNewUser({ username: '', full_name: '', email: '', password: '', role: 'admin_konten' });
        loadUsers();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal menambahkan akun.');
    } finally {
      setAddingUser(false);
    }
  };

  const handleDeleteUser = async (id: number, uname: string) => {
    if (id === 1) {
      toast.error('Akun superadmin utama tidak dapat dihapus.');
      return;
    }
    if (window.confirm(`Yakin ingin menghapus akun @${uname}?`)) {
      try {
        await schoolApi.deleteAdminUser(id);
        toast.success(`Akun @${uname} berhasil dihapus.`);
        loadUsers();
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Gagal menghapus akun.');
      }
    }
  };

  return (
    <div className="space-y-8 font-poppins pb-12">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">Keamanan & Akun Administrator</h1>
        <p className="text-xs text-stone-500 font-normal mt-0.5">
          Kelola profil pengelola, amankan akses dengan hashing bcrypt, dan konfigurasi hak akses peran pengguna sekolah.
        </p>
      </div>

      

      {/* Profil Saya & Ganti Password */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Form Profil Administrator */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200/80 space-y-6">
          <div className="border-b border-stone-100 pb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-emerald-700" />
              <div>
                <h2 className="text-base font-bold text-stone-900">Informasi Profil Akun Aktif</h2>
                <p className="text-[11px] text-stone-400 font-normal">Identitas administrator yang sedang masuk</p>
              </div>
            </div>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full uppercase">
              {admin?.role || 'Superadmin'}
            </span>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">Nama Lengkap Pengelola</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Username Login</label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Alamat Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">URL Avatar Foto Profil</label>
              <input
                type="text"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
              />
            </div>

            <button
              type="submit"
              disabled={savingProfile}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider px-6 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{savingProfile ? 'Menyimpan...' : 'Perbarui Profil'}</span>
            </button>
          </form>
        </div>

        {/* Form Ganti Password */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200/80 space-y-6">
          <div className="border-b border-stone-100 pb-4 flex items-center gap-3">
            <Key className="w-5 h-5 text-amber-600" />
            <div>
              <h2 className="text-base font-bold text-stone-900">Ubah Kata Sandi (Password)</h2>
              <p className="text-[11px] text-stone-400 font-normal">Disimpan dengan enkripsi Bcrypt 10 rounds</p>
            </div>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">Kata Sandi Saat Ini *</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Masukkan kata sandi lama"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">Kata Sandi Baru *</label>
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">Konfirmasi Kata Sandi Baru *</label>
              <input
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi kata sandi baru"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
              />
            </div>

            <button
              type="submit"
              disabled={savingPassword}
              className="bg-amber-500 hover:bg-amber-600 text-emerald-950 font-bold text-xs uppercase tracking-wider px-6 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>{savingPassword ? 'Menyimpan...' : 'Ubah Kata Sandi'}</span>
            </button>
          </form>
        </div>
      </div>

      {/* Multi-User & Role Management Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200/80 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-emerald-700" />
            <div>
              <h2 className="text-base font-bold text-stone-900">Struktur Pengguna & Peran Sistem (Role Management)</h2>
              <p className="text-[11px] text-stone-400 font-normal">
                Saat ini cukup 1 akun admin aktif, namun arsitektur sistem telah mendukung penambahan peran (Superadmin, Admin Konten, Admin PPDB) di kemudian hari.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAddUserModal(true)}
            className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm self-start sm:self-auto"
          >
            <UserPlus className="w-4 h-4" />
            <span>Tambah Akun Pengelola</span>
          </button>
        </div>

        {/* User List Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-500 font-bold uppercase tracking-wider border-b border-stone-200">
              <tr>
                <th className="p-3">Pengelola</th>
                <th className="p-3">Username & Email</th>
                <th className="p-3">Peran (Role)</th>
                <th className="p-3">Hak Akses</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {usersList.map((user) => (
                <tr key={user.id} className="hover:bg-stone-50/50">
                  <td className="p-3 flex items-center gap-3">
                    <img
                      src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100'}
                      alt={user.full_name}
                      className="w-8 h-8 rounded-full object-cover border border-emerald-300"
                    />
                    <span className="font-bold text-stone-900">{user.full_name}</span>
                  </td>
                  <td className="p-3">
                    <p className="font-semibold text-emerald-900">@{user.username}</p>
                    <p className="text-stone-400 text-[11px]">{user.email}</p>
                  </td>
                  <td className="p-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      user.role === 'superadmin'
                        ? 'bg-purple-100 text-purple-800'
                        : user.role === 'admin_konten'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {user.role === 'superadmin' ? 'Superadmin' : user.role === 'admin_konten' ? 'Admin Konten' : 'Admin PPDB'}
                    </span>
                  </td>
                  <td className="p-3 text-stone-600 text-[11px]">
                    {user.role === 'superadmin'
                      ? 'Seluruh Akses Penuh (Full Access)'
                      : user.role === 'admin_konten'
                      ? 'Berita, Profil, Guru, Prestasi, Galeri'
                      : 'Data PPDB & Verifikasi Siswa'}
                  </td>
                  <td className="p-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-800">
                      Aktif
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    {user.id !== 1 ? (
                      <button
                        onClick={() => handleDeleteUser(user.id, user.username)}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Hapus Akun"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    ) : (
                      <span className="text-[10px] text-stone-400 italic font-mono">Akun Utama</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL TAMBAH PENGGUNA BARU */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative border border-stone-100">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-stone-900">Tambah Akun Pengelola Baru</h3>
                <p className="text-xs text-stone-400 font-normal">Sistem Multi-User SMP Islam Caruy</p>
              </div>
              <button onClick={() => setShowAddUserModal(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Ustadz Ahmad, S.Pd"
                  value={newUser.full_name}
                  onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700">Username</label>
                  <input
                    type="text"
                    required
                    placeholder="namauser"
                    value={newUser.username}
                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700">Peran (Role)</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
                  >
                    <option value="admin_konten">Admin Konten</option>
                    <option value="superadmin">Super Administrator</option>
                    <option value="admin_ppdb">Admin PPDB</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Email</label>
                <input
                  type="email"
                  required
                  placeholder="pengelola@smpislamcaruy.sch.id"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Password Awal (Min. 6 Karakter)</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="Masukkan kata sandi awal"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={addingUser}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm"
                >
                  {addingUser ? 'Menyimpan...' : 'Tambah Pengguna'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
