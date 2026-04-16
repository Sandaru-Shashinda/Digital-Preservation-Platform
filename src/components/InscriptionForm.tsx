import { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';
import type { Inscription, InscriptionFormData } from '../services/api';
import { SCRIPT_TYPES } from '../utils/formatters';

interface Props {
  initial?: Inscription | null;
  onSubmit: (data: InscriptionFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

const emptyForm = (): InscriptionFormData => ({
  title: '',
  description: '',
  imageUrl: '',
  location: { name: '', district: '', province: '', coordinates: { lat: null, lng: null } },
  historicalPeriod: '',
  scriptType: '',
  contentRaw: '',
  contentTranslated: '',
});

export default function InscriptionForm({ initial, onSubmit, onCancel, isSubmitting }: Props) {
  const [form, setForm] = useState<InscriptionFormData>(emptyForm());

  useEffect(() => {
    if (initial) {
      setForm({
        title: initial.title,
        description: initial.description,
        imageUrl: initial.imageUrl,
        location: { ...initial.location },
        historicalPeriod: initial.historicalPeriod,
        scriptType: initial.scriptType,
        contentRaw: initial.contentRaw,
        contentTranslated: initial.contentTranslated,
      });
    } else {
      setForm(emptyForm());
    }
  }, [initial]);

  const set = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const setLocation = (field: string, value: string) =>
    setForm((prev) => ({
      ...prev,
      location: { ...prev.location, [field]: value },
    }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(form);
  };

  const inputCls = 'w-full px-3 py-2 text-sm border border-stone-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 bg-white';
  const labelCls = 'block text-xs font-medium text-stone-500 uppercase tracking-wider mb-1';

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Title */}
      <div>
        <label className={labelCls}>Title <span className="text-red-400 normal-case">*</span></label>
        <input
          type="text"
          required
          value={form.title}
          onChange={(e) => set('title', e.target.value)}
          className={inputCls}
          placeholder="e.g. Mihintale Rock Inscription"
        />
      </div>

      {/* Description */}
      <div>
        <label className={labelCls}>Description</label>
        <textarea
          rows={3}
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
          className={inputCls}
          placeholder="Brief description of the inscription…"
        />
      </div>

      {/* Image URL */}
      <div>
        <label className={labelCls}>Image URL</label>
        <input
          type="url"
          value={form.imageUrl}
          onChange={(e) => set('imageUrl', e.target.value)}
          className={inputCls}
          placeholder="https://…"
        />
      </div>

      {/* Location row */}
      <fieldset className="border border-stone-200 rounded-lg p-4">
        <legend className="text-xs font-semibold text-stone-500 uppercase tracking-wider px-1">Location</legend>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
          <div>
            <label className={labelCls}>Site Name</label>
            <input
              type="text"
              value={form.location.name}
              onChange={(e) => setLocation('name', e.target.value)}
              className={inputCls}
              placeholder="e.g. Mihintale"
            />
          </div>
          <div>
            <label className={labelCls}>District</label>
            <input
              type="text"
              value={form.location.district}
              onChange={(e) => setLocation('district', e.target.value)}
              className={inputCls}
              placeholder="e.g. Anuradhapura"
            />
          </div>
          <div>
            <label className={labelCls}>Province</label>
            <input
              type="text"
              value={form.location.province}
              onChange={(e) => setLocation('province', e.target.value)}
              className={inputCls}
              placeholder="e.g. North Central"
            />
          </div>
        </div>
      </fieldset>

      {/* Period & Script row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Historical Period</label>
          <input
            type="text"
            value={form.historicalPeriod}
            onChange={(e) => set('historicalPeriod', e.target.value)}
            className={inputCls}
            placeholder="e.g. 3rd century BCE"
          />
        </div>
        <div>
          <label className={labelCls}>Script Type</label>
          <select
            value={form.scriptType}
            onChange={(e) => set('scriptType', e.target.value)}
            className={inputCls}
          >
            <option value="">Select script…</option>
            {SCRIPT_TYPES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Content Raw */}
      <div>
        <label className={labelCls}>Original Transcription (Raw Text)</label>
        <textarea
          rows={4}
          value={form.contentRaw}
          onChange={(e) => set('contentRaw', e.target.value)}
          className={`${inputCls} font-mono`}
          placeholder="Transcribed text in original script…"
        />
      </div>

      {/* Translation */}
      <div>
        <label className={labelCls}>Translation (Modern Sinhala / English)</label>
        <textarea
          rows={4}
          value={form.contentTranslated}
          onChange={(e) => set('contentTranslated', e.target.value)}
          className={inputCls}
          placeholder="Modern translation of the inscription…"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-2 border-t border-stone-100">
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-1.5 px-4 py-2 text-sm border border-stone-300 rounded hover:bg-stone-50 text-stone-600 transition-colors"
        >
          <X className="w-4 h-4" />
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-1.5 px-5 py-2 text-sm bg-amber-700 text-white rounded hover:bg-amber-800 disabled:opacity-60 disabled:cursor-not-allowed transition-colors font-medium"
        >
          <Save className="w-4 h-4" />
          {isSubmitting ? 'Saving…' : initial ? 'Save Changes' : 'Create Inscription'}
        </button>
      </div>
    </form>
  );
}
