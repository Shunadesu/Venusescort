'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { HiOutlineX, HiOutlineCalendar, HiOutlineClock } from 'react-icons/hi';
import { submitBooking } from '@/lib/api';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/** Generate time options from 08:00 to 23:30 every 30 min */
function getTimeOptions() {
  const options = [];
  for (let h = 8; h <= 23; h++) {
    options.push(`${String(h).padStart(2, '0')}:00`);
    if (h < 23) options.push(`${String(h).padStart(2, '0')}:30`);
  }
  return options;
}
const TIME_OPTIONS = getTimeOptions();

const STEPS = [
  { id: 1, label: 'Date & duration' },
  { id: 2, label: 'Your details' },
  { id: 3, label: 'Confirm' },
];

export default function BookMeModal({ open, onClose, muse = {}, feesForTier = [] }) {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    durationLabel: '',
    price: '',
    date: '',
    time: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    preferredContact: 'email',
  });

  const update = useCallback((key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError('');
  }, []);

  useEffect(() => {
    if (open) {
      setStep(1);
      setShowCalendar(false);
      setForm((prev) => ({
        ...prev,
        durationLabel: feesForTier[0]?.label ?? '',
        price: feesForTier[0]?.price ?? '',
      }));
      setError('');
      setSuccess(false);
    }
  }, [open, feesForTier]);

  useEffect(() => {
    if (open) {
      const prevOverflow = document.body.style.overflow;
      const prevPosition = document.body.style.position;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      const onEscape = (e) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', onEscape);
      return () => {
        document.body.style.overflow = prevOverflow;
        document.body.style.position = prevPosition;
        document.body.style.width = '';
        window.removeEventListener('keydown', onEscape);
      };
    }
  }, [open, onClose]);

  const canNext1 = form.date && form.time;
  const canNext2 =
    form.firstName?.trim() && form.lastName?.trim() && form.email?.trim();

  // Calendar visibility: only show when user clicks the date field
  const [showCalendar, setShowCalendar] = useState(false);
  // Calendar view month/year (for date picker)
  const [viewDate, setViewDate] = useState(() => {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth() };
  });
  const parsedSelected = form.date ? (() => {
    const [y, m, day] = form.date.split('-').map(Number);
    if (y && m && day) return { year: y, month: m - 1, day };
    return null;
  })() : null;
  useEffect(() => {
    if (parsedSelected) {
      setViewDate({ year: parsedSelected.year, month: parsedSelected.month });
    }
  }, [form.date]);

  const calendarGrid = useMemo(() => {
    const { year, month } = viewDate;
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const startPad = first.getDay();
    const daysInMonth = last.getDate();
    const rows = [];
    let day = 1 - startPad;
    for (let row = 0; row < 6; row++) {
      const week = [];
      for (let col = 0; col < 7; col++) {
        if (day < 1 || day > daysInMonth) {
          week.push({ value: null, isCurrentMonth: false });
        } else {
          week.push({
            value: `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
            isCurrentMonth: true,
          });
        }
        day++;
      }
      rows.push(week);
    }
    return rows;
  }, [viewDate]);

  const goPrevMonth = () => {
    setViewDate((prev) =>
      prev.month === 0
        ? { year: prev.year - 1, month: 11 }
        : { year: prev.year, month: prev.month - 1 }
    );
  };
  const goNextMonth = () => {
    setViewDate((prev) =>
      prev.month === 11
        ? { year: prev.year + 1, month: 0 }
        : { year: prev.year, month: prev.month + 1 }
    );
  };

  const handleNext = () => {
    if (step === 1 && canNext1) setStep(2);
    if (step === 2 && canNext2) setStep(3);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!muse.id) {
      setError('Invalid muse.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await submitBooking({
        museId: muse.id,
        durationLabel: form.durationLabel || undefined,
        price: form.price != null && form.price !== '' ? Number(form.price) : undefined,
        date: form.date,
        time: form.time,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        phone: form.phone?.trim() || undefined,
        preferredContact: form.preferredContact,
      });
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to send. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-noir/70 min-h-[100dvh] overflow-y-auto"
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
      role="dialog"
      aria-modal="true"
      aria-label="Booking form"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-t-lg sm:rounded-sm border border-noir/20 border-b-0 sm:border-b bg-cream shadow-xl overflow-hidden max-h-[95dvh] sm:max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-2 flex items-center justify-between border-b border-noir/10">
          <h2 className="text-sm font-semibold tracking-[0.2em] uppercase text-noir">
            Booking form
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-sm text-noir/60 hover:text-noir hover:bg-noir/10 transition-colors"
            aria-label="Close"
          >
            <HiOutlineX className="w-5 h-5" />
          </button>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-2 px-6 py-4 border-b border-noir/10">
          {STEPS.map((s) => (
            <div key={s.id} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border ${
                  step === s.id
                    ? 'bg-noir text-cream border-noir'
                    : 'bg-cream border-noir/20 text-noir/50'
                }`}
              >
                {s.id}
              </div>
              {s.id < STEPS.length && (
                <div
                  className={`w-8 h-0.5 mx-0.5 ${step > s.id ? 'bg-noir/40' : 'bg-noir/10'}`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="px-6 py-6 min-h-[280px] overflow-y-auto flex-1">
          {/* Step 1 */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-medium tracking-[0.15em] uppercase text-noir/70 mb-1.5">
                  Duration
                </label>
                <select
                  value={form.durationLabel}
                  onChange={(e) => {
                    const opt = feesForTier.find((f) => f.label === e.target.value);
                    update('durationLabel', e.target.value);
                    update('price', opt?.price ?? '');
                  }}
                  className="w-full px-4 py-2.5 rounded-sm border border-noir/20 bg-white text-noir focus:outline-none focus:ring-2 focus:ring-noir/30"
                >
                  {feesForTier.length > 0 ? (
                    feesForTier.map((f) => (
                      <option key={f.label} value={f.label}>
                        {f.label} {f.price > 0 ? `— ${f.price} €` : ''}
                      </option>
                    ))
                  ) : (
                    <option value="">—</option>
                  )}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium tracking-[0.15em] uppercase text-noir/70 mb-1.5">
                    Desired date
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowCalendar((v) => !v)}
                      className="w-full px-4 py-2.5 pr-10 rounded-sm border border-noir/20 bg-white text-noir text-left focus:outline-none focus:ring-2 focus:ring-noir/30 hover:border-noir/30 transition-colors"
                    >
                      <span className={form.date ? 'text-noir' : 'text-noir/50'}>
                        {form.date ? (() => {
                          const [y, m, d] = form.date.split('-');
                          if (!y || !m || !d) return form.date;
                          const dt = new Date(Number(y), Number(m) - 1, Number(d));
                          return dt.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '/');
                        })() : 'Select date'}
                      </span>
                    </button>
                    <HiOutlineCalendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-noir/40 pointer-events-none" />
                  </div>
                  {/* Calendar — only when user clicked to open */}
                  {showCalendar && (
                  <div className="mt-3 p-3 rounded-sm border border-noir/15 bg-white shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <button
                        type="button"
                        onClick={goPrevMonth}
                        className="p-1.5 rounded-sm text-noir/60 hover:bg-noir/10 hover:text-noir transition-colors"
                        aria-label="Previous month"
                      >
                        <span className="text-lg leading-none">‹</span>
                      </button>
                      <span className="text-sm font-medium text-noir">
                        {MONTHS[viewDate.month]} {viewDate.year}
                      </span>
                      <button
                        type="button"
                        onClick={goNextMonth}
                        className="p-1.5 rounded-sm text-noir/60 hover:bg-noir/10 hover:text-noir transition-colors"
                        aria-label="Next month"
                      >
                        <span className="text-lg leading-none">›</span>
                      </button>
                    </div>
                    <div className="grid grid-cols-7 gap-0.5 text-center">
                      {WEEKDAYS.map((w) => (
                        <div key={w} className="py-1 text-[10px] font-medium text-noir/50 uppercase tracking-wider">
                          {w}
                        </div>
                      ))}
                      {calendarGrid.flat().map((cell, idx) => (
                        <button
                          key={idx}
                          type="button"
                          disabled={!cell.isCurrentMonth}
                          onClick={() => {
                            if (cell.value) {
                              update('date', cell.value);
                              setShowCalendar(false);
                            }
                          }}
                          className={`py-2 text-sm rounded-sm transition-colors ${
                            !cell.isCurrentMonth
                              ? 'text-noir/20 cursor-default'
                              : cell.value === form.date
                                ? 'bg-noir text-cream font-medium'
                                : 'text-noir hover:bg-noir/10'
                          }`}
                        >
                          {cell.value ? new Date(cell.value + 'T12:00:00').getDate() : ''}
                        </button>
                      ))}
                    </div>
                  </div>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium tracking-[0.15em] uppercase text-noir/70 mb-1.5">
                    Desired time
                  </label>
                  <div className="relative">
                    <select
                      value={form.time}
                      onChange={(e) => update('time', e.target.value)}
                      className="w-full px-4 py-2.5 pr-10 rounded-sm border border-noir/20 bg-white text-noir focus:outline-none focus:ring-2 focus:ring-noir/30 appearance-none"
                    >
                      <option value="">—</option>
                      {TIME_OPTIONS.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                    <HiOutlineClock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-noir/40 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium tracking-[0.15em] uppercase text-noir/70 mb-1.5">
                    First name
                  </label>
                  <input
                    type="text"
                    value={form.firstName}
                    onChange={(e) => update('firstName', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-sm border border-noir/20 bg-white text-noir focus:outline-none focus:ring-2 focus:ring-noir/30"
                    placeholder=""
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium tracking-[0.15em] uppercase text-noir/70 mb-1.5">
                    Last name
                  </label>
                  <input
                    type="text"
                    value={form.lastName}
                    onChange={(e) => update('lastName', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-sm border border-noir/20 bg-white text-noir focus:outline-none focus:ring-2 focus:ring-noir/30"
                    placeholder=""
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium tracking-[0.15em] uppercase text-noir/70 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-sm border border-noir/20 bg-white text-noir focus:outline-none focus:ring-2 focus:ring-noir/30"
                  placeholder=""
                />
              </div>
              <div>
                <label className="block text-xs font-medium tracking-[0.15em] uppercase text-noir/70 mb-1.5">
                  Phone
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update('phone', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-sm border border-noir/20 bg-white text-noir focus:outline-none focus:ring-2 focus:ring-noir/30"
                  placeholder=""
                />
              </div>
              <div>
                <label className="block text-xs font-medium tracking-[0.15em] uppercase text-noir/70 mb-1.5">
                  Preferred contact
                </label>
                <select
                  value={form.preferredContact}
                  onChange={(e) => update('preferredContact', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-sm border border-noir/20 bg-white text-noir focus:outline-none focus:ring-2 focus:ring-noir/30"
                >
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div className="space-y-3 text-sm">
              <p className="font-medium text-noir/80">
                {muse.name} · {form.durationLabel} · {form.date} {form.time}
                {form.price != null && form.price !== '' && Number(form.price) > 0 && (
                  <> · {form.price} €</>
                )}
              </p>
              <p className="text-noir/70">
                {form.firstName} {form.lastName} · {form.email}
                {form.phone ? ` · ${form.phone}` : ''} · Contact via {form.preferredContact}
              </p>
              {error && <p className="text-red-600 text-sm">{error}</p>}
              {success && (
                <p className="text-green-700 text-sm">Booking sent. We will contact you shortly.</p>
              )}
            </div>
          )}
        </div>

        {/* Footer: privacy + buttons */}
        <div className="px-6 pb-6 pt-2">
          <p className="text-[11px] text-noir/50 mb-4 flex items-center gap-1.5">
            <span aria-hidden>🔒</span>
            Your data is encrypted and processed securely.
          </p>
          <div className="flex gap-3 justify-end">
            {step > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2.5 rounded-sm border border-noir/20 text-noir text-sm font-medium tracking-[0.12em] uppercase hover:bg-noir/5 transition-colors"
              >
                Back
              </button>
            )}
            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={
                  (step === 1 && !canNext1) || (step === 2 && !canNext2)
                }
                className="px-4 py-2.5 rounded-sm bg-noir text-cream text-sm font-medium tracking-[0.12em] uppercase hover:bg-noir/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting || success}
                className="px-4 py-2.5 rounded-sm bg-noir text-cream text-sm font-medium tracking-[0.12em] uppercase hover:bg-noir/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? 'Sending…' : success ? 'Sent' : 'Submit'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (typeof document === 'undefined') return null;
  return createPortal(modalContent, document.body);
}
