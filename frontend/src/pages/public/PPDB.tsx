import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '../../components/common/PageHeader';
import { schoolApi } from '../../services/api';
import { PPDBInfo } from '../../types';
import { SEO } from '../../components/common/SEO';
import { ADMISSION_LABEL } from '../../config/admissions';
import {
  Calendar,
  CheckCircle2,
  FileText,
  PhoneCall,
  Send
} from 'lucide-react';

const applyAdmissionLabel = (value?: string | null) =>
  value ? value.replace(/\bPPDB\b/gi, ADMISSION_LABEL) : '';

export const PPDB: React.FC = () => {
  const [ppdb, setPpdb] = useState<PPDBInfo | null>(null);
  const [, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [applicationCode, setApplicationCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [documentFiles, setDocumentFiles] = useState<Record<string, File | null>>({});
  const [formData, setFormData] = useState({
    candidateName: '', birthPlace: '', birthDate: '', gender: '',
    originSchool: '', parentName: '', phone: '', address: '',
    program: 'Reguler', notes: ''
  });
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
  const admissionOpen = Boolean(ppdb?.is_open) &&
    (!ppdb?.start_date || String(ppdb.start_date).slice(0,10) <= today) &&
    (!ppdb?.end_date || String(ppdb.end_date).slice(0,10) >= today);

  useEffect(() => {
    schoolApi.getPPDB()
      .then(res => setPpdb(res))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!admissionOpen) return;
    setSubmitting(true);
    try {
      const documents: Record<string, string> = {};
      for (const [label, file] of Object.entries(documentFiles)) {
        if (file) documents[label] = (await schoolApi.uploadAdmissionDocument(file)).fileKey;
      }
      const result = await schoolApi.submitAdmissionApplication({
        candidate_name: formData.candidateName, birth_place: formData.birthPlace,
        birth_date: formData.birthDate || null, gender: formData.gender,
        origin_school: formData.originSchool, parent_name: formData.parentName,
        parent_phone: formData.phone, address: formData.address,
        program: formData.program, notes: formData.notes, documents,
        academic_year: ppdb.academic_year
      });
      setApplicationCode(result.data.application_code);
      setSubmitted(true);
    } catch (error: any) {
      console.error('Pendaftaran gagal dikirim:', error);
      window.alert(error?.response?.data?.message || 'Pendaftaran belum berhasil dikirim. Silakan coba kembali.');
    } finally { setSubmitting(false); }
  };

  return (
    <div className="font-poppins bg-stone-50 min-h-screen pb-24">
      <SEO
        title={`${ADMISSION_LABEL} ${ppdb?.academic_year || '2026/2027'}`}
        description={`Informasi ${ADMISSION_LABEL} SMP Islam Caruy.`}
      />
      <PageHeader
        title={`${ADMISSION_LABEL} Tahun Ajaran ${ppdb?.academic_year || '2026/2027'}`}
        subtitle="Penerimaan Peserta Didik Baru SMP Islam Caruy. Mari bergabung membina generasi berkarakter Qurani."
        badge="Penerimaan Peserta Didik Baru"
        breadcrumbs={[{ label: ADMISSION_LABEL }]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 space-y-12">
        {/* BANNER STATUS UTAMA */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-950 text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden border-4 border-amber-400">
          <div className="max-w-3xl space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="bg-amber-400 text-emerald-950 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                Status: {admissionOpen ? 'PENDAFTARAN DIBUKA' : 'PENDAFTARAN DITUTUP'}
              </span>
              <span className="text-emerald-200 text-xs">
                Tahun Ajaran {ppdb?.academic_year || '2026/2027'}
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
              Raih Masa Depan Gemilang Berakhlakul Karimah
            </h2>

            <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed font-normal">
              {applyAdmissionLabel(ppdb?.overview) || `Informasi ${ADMISSION_LABEL} SMP Islam Caruy.`}
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <a
                href="#daftar-online"
                className="bg-amber-400 hover:bg-amber-500 text-emerald-950 font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all shadow-md active:scale-95"
              >
                Isi Formulir Pendaftaran
              </a>
              {ppdb?.contact_whatsapp && (
                <a
                  href={`https://wa.me/${ppdb.contact_whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all flex items-center gap-2"
                >
                  <PhoneCall className="w-4 h-4 text-amber-300" />
                  <span>Konsultasi Panitia</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* ALUR PENDAFTARAN (4 STEPS) */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-stone-100 space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-emerald-700 font-bold text-xs uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              Panduan Praktis
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-stone-900">
              Alur Pendaftaran Peserta Didik Baru
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ppdb?.steps.map((st) => (
              <div
                key={st.step}
                className="bg-stone-50 p-6 rounded-2xl border border-stone-200/80 hover:bg-emerald-50/50 hover:border-emerald-200 transition-all space-y-3 relative group"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-base shadow-sm group-hover:scale-110 transition-transform">
                  {st.step}
                </div>
                <h4 className="font-bold text-stone-900 text-base">{applyAdmissionLabel(st.title)}</h4>
                <p className="text-xs text-stone-600 font-normal leading-relaxed">
                  {applyAdmissionLabel(st.desc)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* PERSYARATAN & JADWAL SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Persyaratan (6 cols) */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-stone-100 space-y-6">
            <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-stone-900">Persyaratan Dokumen</h3>
              </div>
            </div>

            <ul className="space-y-3.5">
              {ppdb?.requirements.map((req, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-stone-700 leading-relaxed font-normal">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{applyAdmissionLabel(req)}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Jadwal Pelaksanaan (6 cols) */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-stone-100 space-y-6">
            <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-stone-900">Jadwal & Agenda {ADMISSION_LABEL}</h3>
              </div>
            </div>

            <div className="space-y-4">
              {ppdb?.schedules.map((sch, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-stone-50 border border-stone-100 space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-stone-900">{applyAdmissionLabel(sch.phase)}</span>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      {sch.period}
                    </span>
                  </div>
                  {sch.notes && (
                    <p className="text-[11px] text-stone-500 font-normal">{applyAdmissionLabel(sch.notes)}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* BIAYA PENDIDIKAN TRANSPARAN (IF SHOW_FEES IS TRUE) */}
        {ppdb?.show_fees ? (
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-stone-100 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
              <div>
                <span className="text-amber-600 font-bold text-xs uppercase tracking-wider">
                  Investasi Pendidikan
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-stone-900 mt-1">
                  Rincian Biaya Pendidikan Transparan
                </h3>
              </div>
              <span className="text-xs bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-xl font-semibold border border-emerald-200">
                Tersedia Skema Angsuran & Beasiswa
              </span>
            </div>

            <p className="text-xs sm:text-sm text-stone-600 font-normal leading-relaxed">
              {applyAdmissionLabel(ppdb.fees_description)}
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-stone-200 bg-stone-50 text-stone-700 font-bold uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-4">Komponen Pembiayaan</th>
                    <th className="py-3 px-4">Estimasi Nominal</th>
                    <th className="py-3 px-4">Keterangan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-normal">
                  {ppdb.fees_items.map((fee, idx) => (
                    <tr key={idx} className="hover:bg-stone-50/50">
                      <td className="py-3.5 px-4 font-medium text-stone-900">{applyAdmissionLabel(fee.item)}</td>
                      <td className="py-3.5 px-4 font-bold text-emerald-800">{fee.nominal}</td>
                      <td className="py-3.5 px-4 text-stone-500">{applyAdmissionLabel(fee.note) || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}

        {/* FORMULIR PENDAFTARAN ONLINE LANGSUNG */}
        <div id="daftar-online" className="bg-white rounded-3xl p-6 sm:p-12 shadow-xl border border-stone-100 space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-emerald-700 font-bold text-xs uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              Registrasi Cepat
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-stone-900">
              Formulir Pra-Pendaftaran {ADMISSION_LABEL} Online
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 font-normal">
            </p>
          </div>

          {submitted && <div role="status" className="mx-auto max-w-2xl rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">Pendaftaran berhasil dikirim. Simpan nomor pendaftaran Anda: <strong>{applicationCode}</strong>. Panitia akan memeriksa data dan dokumen yang dikirim.</div>}
          <form onSubmit={handleFormSubmit} className="max-w-2xl mx-auto space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="space-y-1.5 text-xs font-bold text-stone-700">Tempat Lahir<input type="text" value={formData.birthPlace} onChange={e=>setFormData({...formData,birthPlace:e.target.value})} className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-xs font-normal"/></label>
              <label className="space-y-1.5 text-xs font-bold text-stone-700">Tanggal Lahir<input type="date" value={formData.birthDate} onChange={e=>setFormData({...formData,birthDate:e.target.value})} className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-xs font-normal"/></label>
            </div>
            <label className="block space-y-1.5 text-xs font-bold text-stone-700">Jenis Kelamin<select value={formData.gender} onChange={e=>setFormData({...formData,gender:e.target.value})} className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-xs font-normal"><option value="">Pilih</option><option value="L">Laki-laki</option><option value="P">Perempuan</option></select></label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Nama Calon Siswa *</label>
                <input
                  type="text"
                  required
                  value={formData.candidateName}
                  onChange={(e) => setFormData({ ...formData, candidateName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Asal SD / MI *</label>
                <input
                  type="text"
                  required
                  value={formData.originSchool}
                  onChange={(e) => setFormData({ ...formData, originSchool: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Nama Orang Tua / Wali *</label>
                <input
                  type="text"
                  required
                  value={formData.parentName}
                  onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Nomor WhatsApp Aktif *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
                />
              </div>
            </div>

            <label className="block space-y-1.5 text-xs font-bold text-stone-700">Alamat Domisili<textarea rows={2} value={formData.address} onChange={e=>setFormData({...formData,address:e.target.value})} className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-xs font-normal"/></label>
            <div className="space-y-2"><label className="text-xs font-bold text-stone-700">Dokumen Pendukung (PDF, JPG, PNG, WebP)</label>
              {['Kartu Keluarga','Akta Kelahiran','Ijazah atau Surat Keterangan Lulus'].map(label=><div key={label} className="grid gap-2 sm:grid-cols-[180px_1fr] sm:items-center"><span className="text-xs text-stone-600">{label}</span><input type="file" accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp" onChange={e=>setDocumentFiles(prev=>({...prev,[label]:e.target.files?.[0]||null}))} className="w-full text-xs"/></div>)}
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">Pilihan Peminatan Program</label>
              <select
                value={formData.program}
                onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
              >
                <option value="Reguler">Kelas Reguler Terpadu</option>
                
                <option value="Sains & Robotika">Kelas Peminatan Sains & Teknologi</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">Pertanyaan atau Catatan Khusus</label>
              <textarea
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
              />
            </div>

            <label className="flex items-start gap-2 rounded-xl border border-stone-200 bg-stone-50 p-3 text-xs leading-5 text-stone-600">
              <input type="checkbox" required className="mt-0.5 accent-emerald-700"/>
              <span>Saya menyatakan data yang dikirim benar dan menyetujui penggunaan data serta dokumen untuk keperluan proses pendaftaran dan verifikasi oleh pihak sekolah.</span>
            </label>
            <button
              type="submit"
              disabled={submitted || submitting || !admissionOpen}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider py-4 rounded-xl shadow-lg shadow-emerald-700/20 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{submitted ? 'Pendaftaran Terkirim' : submitting ? 'Mengirim Pendaftaran…' : admissionOpen ? 'Kirim Formulir Pendaftaran' : 'Pendaftaran Ditutup'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
