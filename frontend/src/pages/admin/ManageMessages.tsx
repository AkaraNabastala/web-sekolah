import React, { useState, useEffect } from 'react';
import { schoolApi } from '../../services/api';
import { ContactMessage } from '../../types';
import { Mail, Check, Trash2, CheckCircle, AlertCircle, Phone, MessageSquare, X, ExternalLink } from 'lucide-react';
import { toast } from '../../hooks/useToast';

export const ManageMessages: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selectedMsg, setSelectedMsg] = useState<ContactMessage | null>(null);

  const loadMessages = async () => {
    try {
      const res = await schoolApi.getAdminMessages();
      setMessages(res);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);


  const handleToggleRead = async (id: number, currentStatus: boolean | number) => {
    try {
      await schoolApi.markMessageRead(id, !currentStatus);
      toast.success('Status pesan diperbarui.');
      loadMessages();
    } catch (err) {
      toast.error('Gagal memperbarui status.');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Hapus pesan ini dari database?')) {
      try {
        await schoolApi.deleteMessage(id);
        toast.success('Pesan berhasil dihapus.');
        if (selectedMsg?.id === id) setSelectedMsg(null);
        loadMessages();
      } catch (err) {
        toast.error('Gagal menghapus pesan.');
      }
    }
  };

  const handleOpenDetail = (msg: ContactMessage) => {
    setSelectedMsg(msg);
    if (!msg.is_read) {
      schoolApi.markMessageRead(msg.id, true).then(() => loadMessages());
    }
  };

  return (
    <div className="space-y-6 font-poppins">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Kotak Masuk Pesan Pengunjung</h1>
          <p className="text-xs text-stone-500 font-normal mt-0.5">
            Daftar pertanyaan, pesan, dan permohonan informasi yang dikirimkan masyarakat melalui formulir kontak.
          </p>
        </div>
      </div>

      

      {/* TABLE */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50 text-stone-700 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Pengirim & Kontak</th>
                <th className="py-3 px-4">Subjek Pesan</th>
                <th className="py-3 px-4">Tanggal Masuk</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-normal">
              {messages.length > 0 ? (
                messages.map((item) => (
                  <tr
                    key={item.id}
                    className={`hover:bg-stone-50/50 cursor-pointer ${
                      !item.is_read ? 'bg-amber-50/30 font-medium' : ''
                    }`}
                    onClick={() => handleOpenDetail(item)}
                  >
                    <td className="py-3 px-4">
                      <p className="font-bold text-stone-900">{item.name}</p>
                      <p className="text-[10px] text-stone-400">{item.email} {item.phone ? `• ${item.phone}` : ''}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-emerald-800 line-clamp-1">{item.subject}</p>
                      <p className="text-[11px] text-stone-500 line-clamp-1 font-normal">{item.message}</p>
                    </td>
                    <td className="py-3 px-4 text-stone-400 text-[11px]">
                      {new Date(item.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        item.is_read ? 'bg-stone-100 text-stone-600' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {item.is_read ? 'Sudah Dibaca' : 'Pesan Baru'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleToggleRead(item.id, item.is_read)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          item.is_read ? 'text-stone-400 hover:text-amber-600' : 'text-emerald-700 bg-emerald-50'
                        }`}
                        title={item.is_read ? 'Tandai belum dibaca' : 'Tandai sudah dibaca'}
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Hapus pesan"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-stone-400 text-xs">
                    Belum ada pesan yang masuk.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL MODAL */}
      {selectedMsg && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-5 border border-stone-100">
            <div className="flex justify-between items-start border-b border-stone-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                  Detail Pesan Pengunjung
                </span>
                <h3 className="text-lg font-bold text-stone-900 mt-2">{selectedMsg.subject}</h3>
              </div>
              <button onClick={() => setSelectedMsg(null)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs bg-stone-50 p-4 rounded-2xl border border-stone-100">
              <p><span className="font-bold text-stone-700">Pengirim:</span> {selectedMsg.name}</p>
              <p><span className="font-bold text-stone-700">Email:</span> {selectedMsg.email}</p>
              <p><span className="font-bold text-stone-700">Telepon / WA:</span> {selectedMsg.phone || '-'}</p>
              <p><span className="font-bold text-stone-700">Tanggal:</span> {new Date(selectedMsg.created_at).toLocaleString('id-ID')}</p>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-bold text-stone-700">Isi Pesan:</p>
              <div className="p-4 rounded-2xl bg-white border border-stone-200 text-stone-700 text-xs leading-relaxed font-normal whitespace-pre-line">
                {selectedMsg.message}
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 flex flex-wrap justify-between items-center gap-2">
              <button
                onClick={() => handleDelete(selectedMsg.id)}
                className="text-red-500 hover:text-red-700 text-xs font-bold flex items-center gap-1"
              >
                <Trash2 className="w-4 h-4" />
                <span>Hapus Pesan</span>
              </button>

              <div className="flex gap-2">
                {selectedMsg.phone && (
                  <a
                    href={`https://wa.me/${selectedMsg.phone.replace(/[^0-9]/g, '')}?text=Halo%20${encodeURIComponent(selectedMsg.name)},%20kami%20dari%20SMP%20Islam%20Caruy%20merespons%20pesan%20Anda:`}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    <span>Balas WhatsApp</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                <a
                  href={`mailto:${selectedMsg.email}?subject=Re:%20${encodeURIComponent(selectedMsg.subject)}`}
                  className="bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Kirim Email</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
