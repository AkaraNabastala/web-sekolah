import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { SchoolLogo } from '../../components/common/SchoolLogo';
import { Lock, User, Eye, EyeOff, LogIn, ArrowLeft, AlertCircle, ShieldCheck } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('adminCaruy2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login(username, password);
      if (res.success) {
        navigate('/admin');
      } else {
        setError(res.message || 'Login gagal. Silakan periksa kembali kredensial Anda.');
      }
    } catch (err: any) {
      setError('Terjadi kendala koneksi ke server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 flex flex-col justify-center items-center p-4 sm:p-6 font-['Poppins'] relative selection:bg-amber-400 selection:text-emerald-950">
      {/* Background Decorative Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]"></div>

      {/* Back to Home Link */}
      <div className="w-full max-w-md mb-4 flex justify-between items-center relative z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-emerald-200 hover:text-white text-xs font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Website Publik</span>
        </Link>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-emerald-800/40 relative z-10 space-y-6">
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <SchoolLogo size="lg" showText={false} />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-stone-900">Portal Administrator</h2>
            <p className="text-xs text-stone-500 font-light mt-1">
              Sistem Informasi Terintegrasi SMP Islam Caruy
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700">Username atau Email</label>
            <div className="relative">
              <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username admin"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50/60"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700">Kata Sandi (Password)</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan kata sandi"
                className="w-full pl-10 pr-10 py-3 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50/60"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs uppercase tracking-wider py-3.5 rounded-xl shadow-lg shadow-emerald-700/20 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70 mt-2"
          >
            <LogIn className="w-4 h-4" />
            <span>{loading ? 'Memverifikasi...' : 'Masuk ke Dashboard'}</span>
          </button>
        </form>

        {/* Demo Credentials Box */}
        <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200/80 text-[11px] text-amber-900 space-y-1">
          <p className="font-bold flex items-center gap-1.5 text-amber-950">
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            <span>Akun Administrator Demo:</span>
          </p>
          <p className="text-stone-700">
            Username: <code className="bg-white px-1.5 py-0.5 rounded font-mono font-bold text-emerald-800">admin</code>
          </p>
          <p className="text-stone-700">
            Password: <code className="bg-white px-1.5 py-0.5 rounded font-mono font-bold text-emerald-800">adminCaruy2026!</code>
          </p>
        </div>
      </div>
    </div>
  );
};
