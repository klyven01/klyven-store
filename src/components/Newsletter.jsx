import { useState } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | done | error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ 'form-name': 'klyven-newsletter', email }).toString(),
      });
      setStatus('done');
      setEmail('');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="max-w-xl">
      <p className="spec-tag text-steel mb-3">Stay In The Loop</p>
      <h3 className="font-display text-2xl md:text-3xl mb-5">
        Be first to know when the next drop lands.
      </h3>
      {status === 'done' ? (
        <p className="text-signal spec-tag">You're on the list.</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="flex-1 bg-transparent border border-line focus:border-signal px-4 py-3 text-sm outline-none placeholder:text-steel"
          />
          <button
            type="submit"
            disabled={status === 'sending'}
            className="spec-tag bg-bone text-void px-6 hover:bg-signal hover:text-white transition-colors disabled:opacity-50"
          >
            {status === 'sending' ? '...' : 'Join'}
          </button>
        </form>
      )}
    </div>
  );
}
