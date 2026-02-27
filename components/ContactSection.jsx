'use client';

import { useEffect, useState } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';

export default function ContactSection() {
  const [channels, setChannels] = useState([]);
  const [loadingChannels, setLoadingChannels] = useState(true);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [channel, setChannel] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function loadChannels() {
      try {
        const res = await fetch(`${API_BASE}/contact`);
        if (!res.ok) throw new Error('Failed to load contact channels');
        const data = await res.json();
        if (cancelled) return;
        const visible = Array.isArray(data)
          ? data.filter((c) => c.visible !== false)
          : [];
        setChannels(visible);
        if (visible.length > 0 && !channel) {
          setChannel(visible[0].label || '');
        }
      } catch {
        if (!cancelled) {
          setChannels([]);
        }
      } finally {
        if (!cancelled) {
          setLoadingChannels(false);
        }
      }
    }
    loadChannels();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setStatus('sending');
    setError('');
    try {
      const res = await fetch(`${API_BASE}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          subject,
          message,
          channel: channel || undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to send message');
      }
      setStatus('success');
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (err) {
      setStatus('error');
      setError(err.message || 'Something went wrong');
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-12 md:gap-16 items-start">
        <div>
          <p className="text-[10px] uppercase tracking-[0.35em] text-cream/60 mb-3">
            Contact
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-[42px] text-cream mb-4">
            A direct line to the House.
          </h2>
          <p className="text-sm sm:text-base text-cream/70 leading-relaxed max-w-md">
            For enquiries, introductions, or matters that require a human reply. Messages are read
            deliberately, not automatically.
          </p>
          {!loadingChannels && channels.length > 0 && (
            <div className="mt-6 space-y-2 text-sm text-cream/60">
              <p className="text-[10px] uppercase tracking-[0.3em] text-cream/50">
                Available channels
              </p>
              <ul className="space-y-1">
                {channels.map((c, idx) => (
                  <li key={idx}>
                    <span className="font-medium text-cream/80">{c.label}</span>
                    {c.role && <span className="text-cream/50"> — {c.role}</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="bg-noir/70 border border-cream/15 rounded-lg p-6 sm:p-7 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                required
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2.5 rounded border border-cream/20 bg-transparent text-cream text-sm placeholder:text-cream/35 focus:outline-none focus:border-cream/60"
              />
              <input
                type="email"
                required
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 rounded border border-cream/20 bg-transparent text-cream text-sm placeholder:text-cream/35 focus:outline-none focus:border-cream/60"
              />
            </div>
            <input
              type="text"
              placeholder="Subject (optional)"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2.5 rounded border border-cream/20 bg-transparent text-cream text-sm placeholder:text-cream/35 focus:outline-none focus:border-cream/60"
            />
            {(!loadingChannels || channels.length > 0) && (
              <div>
                <select
                  value={channel}
                  onChange={(e) => setChannel(e.target.value)}
                  className="w-full px-3 py-2.5 rounded border border-cream/20 bg-noir text-cream text-sm focus:outline-none focus:border-cream/60"
                >
                  {channels.length === 0 && <option value="">General</option>}
                  {channels.length > 0 &&
                    channels.map((c, idx) => (
                      <option key={idx} value={c.label}>
                        {c.label}
                        {c.role ? ` — ${c.role}` : ''}
                      </option>
                    ))}
                </select>
              </div>
            )}
            <textarea
              required
              rows={4}
              placeholder="Your message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3 py-2.5 rounded border border-cream/20 bg-transparent text-cream text-sm placeholder:text-cream/35 focus:outline-none focus:border-cream/60"
            />

            {status === 'success' && (
              <p className="text-xs text-emerald-300">
                Your message has been received. The House will reply if it aligns with our current
                focus.
              </p>
            )}
            {status === 'error' && (
              <p className="text-xs text-red-300">
                {error || 'Something went wrong. Please try again.'}
              </p>
            )}

            <button
              type="submit"
              disabled={status === 'sending'}
              className="inline-flex items-center justify-center px-6 py-2.5 border border-cream/40 text-cream text-xs tracking-[0.25em] uppercase rounded-full hover:bg-cream/10 transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {status === 'sending' ? 'Sending…' : 'Send message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

