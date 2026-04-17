import React, { useState } from 'react';
import { createEndpoint } from '../services/api';

const METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

const DEFAULT_FORM = {
  name: '',
  url: '',
  method: 'GET',
  headersRaw: '',
  body: '',
};

export default function APIForm({ onCreated }) {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Parse headers
    let headers = {};
    if (form.headersRaw.trim()) {
      try {
        headers = JSON.parse(form.headersRaw);
      } catch {
        setError('Headers must be valid JSON (e.g., {"Authorization": "Bearer token"})');
        return;
      }
    }

    setLoading(true);
    try {
      const { data } = await createEndpoint({
        name: form.name,
        url: form.url,
        method: form.method,
        headers,
        body: form.body,
      });
      onCreated(data);
      setForm(DEFAULT_FORM);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save endpoint');
    } finally {
      setLoading(false);
    }
  };

  const showBody = ['POST', 'PUT', 'PATCH'].includes(form.method);

  return (
    <div className="form-card" style={{ margin: '0.75rem 0.5rem' }}>
      <div className="form-card-title">
        <span>🔌</span> New Endpoint
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Name</label>
          <input
            className="form-input"
            name="name"
            placeholder="e.g. Get Users"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Method & URL</label>
          <div className="form-row">
            <select
              className="form-select"
              name="method"
              value={form.method}
              onChange={handleChange}
            >
              {METHODS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <input
              className="form-input"
              name="url"
              placeholder="https://api.example.com/users"
              value={form.url}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">
            Headers{' '}
            <span style={{ color: 'var(--text-muted)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>
              (JSON, optional)
            </span>
          </label>
          <textarea
            className="form-textarea"
            name="headersRaw"
            placeholder={'{\n  "Authorization": "Bearer token",\n  "Content-Type": "application/json"\n}'}
            value={form.headersRaw}
            onChange={handleChange}
            style={{ minHeight: 80, fontSize: '0.78rem' }}
          />
        </div>

        {showBody && (
          <div className="form-group">
            <label className="form-label">
              Request Body{' '}
              <span style={{ color: 'var(--text-muted)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>
                (JSON)
              </span>
            </label>
            <textarea
              className="form-textarea"
              name="body"
              placeholder={'{\n  "key": "value"\n}'}
              value={form.body}
              onChange={handleChange}
              style={{ minHeight: 80, fontSize: '0.78rem' }}
            />
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary btn-full"
          disabled={loading}
          style={{ marginTop: '0.25rem' }}
        >
          {loading ? (
            <><span className="spinner" /> Saving...</>
          ) : (
            'Save Endpoint'
          )}
        </button>
      </form>
    </div>
  );
}
