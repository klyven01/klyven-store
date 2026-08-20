import { useState } from 'react';
import SEO from '../components/SEO';
import config from '../config';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ 'form-name': 'klyven-contact', ...form }).toString(),
      });
      setStatus('done');
      setForm({ name: '', email: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-5 py-16 md:py-24">
      <SEO title="Contact — KLYVEN" description="Get in touch with KLYVEN support." />
      <p className="spec-tag text-signal mb-2">Contact</p>
      <h1 className="font-display text-3xl md:text-5xl text-bone mb-6">Get In Touch</h1>
      <p className="text-steel mb-10">
        Questions about an order, sizing, or a drop? Reach us at{' '}
        <a href={`mailto:${config.SUPPORT_EMAIL}`} className="text-bone underline underline-offset-4">
          {config.SUPPORT_EMAIL}
        </a>{' '}
        or use the form below.
      </p>

      {status === 'done' ? (
        <p className="spec-tag text-signal">Message sent. We'll get back to you shortly.</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block">
            <span className="spec-tag text-steel block mb-1.5">Name</span>
            <input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="input" />
          </label>
          <label className="block">
            <span className="spec-tag text-steel block mb-1.5">Email</span>
            <input required type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="input" />
          </label>
          <label className="block">
            <span className="spec-tag text-steel block mb-1.5">Message</span>
            <textarea required rows={5} value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} className="input" />
          </label>
          <button
            type="submit"
            disabled={status === 'sending'}
            className="spec-tag bg-bone text-void px-8 py-4 hover:bg-signal hover:text-white transition-colors disabled:opacity-50"
          >
            {status === 'sending' ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      )}
    </div>
  );
}
