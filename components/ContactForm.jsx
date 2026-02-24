'use client';

import { useState } from 'react';

export default function ContactForm({ className = '' }) {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '', channel: 'liaison' });
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const api = process.env.NEXT_PUBLIC_API_URL || '/api';
      const res = await fetch(`${api}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus('success');
        setForm({ name: '', email: '', subject: '', message: '', channel: 'liaison' });
      } else {
        const data = await res.json();
        setStatus(data?.message || 'error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      <h3 className="font-serif text-xl text-noir">Send a message</h3>
      <input
        type="text"
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        className="w-full px-3 py-2 border border-noir/20 bg-cream focus:outline-none focus:ring-1 focus:ring-noir/30 text-noir"
      />
      <input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
        required
        className="w-full px-3 py-2 border border-noir/20 bg-cream focus:outline-none focus:ring-1 focus:ring-noir/30 text-noir"
      />
      <input
        type="text"
        placeholder="Subject"
        value={form.subject}
        onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
        className="w-full px-3 py-2 border border-noir/20 bg-cream focus:outline-none focus:ring-1 focus:ring-noir/30 text-noir"
      />
      <textarea
        placeholder="Message"
        value={form.message}
        onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
        required
        rows={4}
        className="w-full px-3 py-2 border border-noir/20 bg-cream focus:outline-none focus:ring-1 focus:ring-noir/30 text-noir resize-none"
      />
      <button
        type="submit"
        disabled={status === 'sending'}
        className="px-6 py-3 bg-noir text-cream font-medium tracking-widest uppercase hover:bg-noir-light disabled:opacity-50"
      >
        {status === 'sending' ? 'Sending...' : 'Send'}
      </button>
      {status === 'success' && <p className="text-sm text-green-600">Message sent.</p>}
      {status === 'error' && <p className="text-sm text-red-600">Something went wrong.</p>}
    </form>
  );
}
