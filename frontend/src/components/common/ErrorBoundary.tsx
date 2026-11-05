import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorMessage: ''
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error.message };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error secara aman tanpa mencemari tampilan publik
    if (process.env.NODE_ENV !== 'production') {
      console.error('[ErrorBoundary caught error]', error, errorInfo);
    }
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[500px] flex items-center justify-center p-6 bg-[#FAF8F5]">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-[#ECE7DD] shadow-sm text-center space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-[#FBF0EE] text-[#D94F3D] mx-auto flex items-center justify-center">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-[#1F2621]">Terjadi Sedikit Kendala</h2>
              <p className="text-xs text-[#5C645D] leading-relaxed">
                Halaman ini sementara tidak dapat dimuat dengan sempurna. Silakan muat ulang peramban atau kembali ke beranda utama sekolah.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-2 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center justify-center gap-2 bg-[#1B3B2B] text-white text-xs font-bold px-5 py-3 rounded-xl hover:bg-[#254F3A] transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Muat Ulang</span>
              </button>
              <Link
                to="/"
                onClick={() => this.setState({ hasError: false })}
                className="inline-flex items-center justify-center gap-2 bg-[#EAE5DC] text-[#2C332D] text-xs font-bold px-5 py-3 rounded-xl hover:bg-[#DDD7CD] transition-colors"
              >
                <Home className="w-4 h-4" />
                <span>Halaman Utama</span>
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
