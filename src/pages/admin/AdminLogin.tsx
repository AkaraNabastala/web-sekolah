import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, User, AlertCircle, ShieldCheck, ArrowRight, School } from 'lucide-react';
import axios from 'axios';

export const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSetupNeeded, setIsSetupNeeded] = useState(false);

  // Form Setup Admin Pertama
  const [setupFullName, setSetupFullName] = useState('');
  const [setupEmail, setSetupEmail] = useState('');
  const [setupUsername, setSetupUsername] = useState('');
  const [setupPassword, setSetupPassword] = useState('');
  const [setupMessage, setSetupMessage] = useState<string | null>(null);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // Periksa status inisialisasi administrator
    axios.get('/api/setup/status')
      .then(res => {
        if (res.data && res.data.initialized === false) {
          setIsSetupNeeded(true);
        }
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError('Username dan password wajib diisi.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const res = await login(username, password);
      if (res.success) {
        navigate('/admin');
      } else {
        setError(res.message || 'Login gagal. Periksa kembali username dan kata sandi Anda.');
      }
    } catch (err: any) {
      setError('Terjadi kendala saat menghubungi server autentikasi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFirstAdminSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSetupMessage(null);

    if (!setupFullName || !setupEmail || !setupUsername || !setupPassword) {
      setError('Semua kolom form pembuatan admin pertama wajib diisi.');
      return;
    }

    if (setupPassword.length < 8) {
      setError('Kata sandi harus minimal 8 karakter.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await axios.post('/api/setup/first-admin', {
        full_name: setupFullName,
        email: setupEmail,
        username: setupUsername,
        password: setupPassword
      });

      if (res.data.success) {
        setSetupMessage('Administrator utama berhasil dibuat! Silakan masuk dengan akun yang baru Anda daftarkan.');
        setIsSetupNeeded(false);
        setUsername(setupUsername);
        setPassword('');
      } else {
        setError(res.data.message || 'Gagal menginisialisasi administrator.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal membuat administrator pertama.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 opacity-10 bg-[radial-gradient(#15803d_1px,transparent_1px)] [background-size:16px_16px]"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shadow-lg shadow-emerald-700/30">
            <School className="w-9 h-9" />
          </div>
        </div>
        <h2 className="mt-4 text-center text-2xl font-bold tracking-tight text-slate-900">
          SMP ISLAM CARUY
        </h2>
        <p className="mt-1 text-center text-sm font-medium text-emerald-800">
          Portal Masuk Dashboard Pengelolaan Sistem
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/80 rounded-2xl border border-slate-200 sm:px-10">
          {error && (
            <div className="mb-5 bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl flex items-center gap-3 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {setupMessage && (
            <div className="mb-5 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center gap-3 text-sm">
              <ShieldCheck className="w-5 h-5 flex-shrink-0 text-emerald-600" />
              <span>{setupMessage}</span>
            </div>
          )}

          {isSetupNeeded ? (
            /* Formulir Inisialisasi Administrator Pertama (Terkunci Otomatis setelah terdaftar) */
            <form onSubmit={handleFirstAdminSetup} className="space-y-4">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs leading-relaxed">
                <span className="font-bold">Inisialisasi Sistem:</span> Belum ada akun administrator terdaftar. Silakan buat akun Superadmin pertama untuk mengamankan panel sekolah.
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={setupFullName}
                  onChange={(e) => setSetupFullName(e.target.value)}
                  placeholder="Nama Lengkap Administrator"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Alamat Email</label>
                <input
                  type="email"
                  required
                  value={setupEmail}
                  onChange={(e) => setSetupEmail(e.target.value)}
                  placeholder="admin@smpislamcaruy.sch.id"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Username Baru</label>
                <input
                  type="text"
                  required
                  value={setupUsername}
                  onChange={(e) => setSetupUsername(e.target.value)}
                  placeholder="Pilih username unik"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Kata Sandi (Min. 8 Karakter)</label>
                <input
                  type="password"
                  required
                  value={setupPassword}
                  onChange={(e) => setSetupPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-4 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white font-medium bg-emerald-700 hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-600 transition-all shadow-md disabled:opacity-60"
              >
                {isSubmitting ? 'Memproses Setup...' : 'Buat Administrator Utama'}
              </button>
            </form>
          ) : (
            /* Formulir Login Admin Standar */
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Username atau Email
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="h-5 w-5" />
                  </div>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Masukkan username atau email"
                    className="block w-full pl-10 pr-3.5 py-2.5 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 text-sm transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Kata Sandi
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="block w-full pl-10 pr-3.5 py-2.5 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 text-sm transition-all"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white font-medium bg-emerald-700 hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-600 transition-all shadow-md shadow-emerald-700/20 disabled:opacity-60 cursor-pointer"
                >
                  {isSubmitting ? (
                    'Memverifikasi Kredensial...'
                  ) : (
                    <>
                      <span>Masuk ke Dashboard</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Sistem Terenkripsi
            </span>
            <a href="/" className="text-emerald-700 hover:text-emerald-800 hover:underline">
              ← Kembali ke Website Publik
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
