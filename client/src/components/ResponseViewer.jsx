import React from 'react';

function highlight(json) {
  return JSON.stringify(json, null, 2)
    .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?)/g, (match, p1, p2, p3) =>
      p3 ? `<span class="json-key">${match}</span>` : `<span class="json-string">${match}</span>`
    )
    .replace(/\b(\d+\.?\d*)\b/g, '<span class="json-number">$1</span>')
    .replace(/\b(true|false)\b/g, '<span class="json-bool">$1</span>')
    .replace(/\bnull\b/g, '<span class="json-null">null</span>');
}

function getStatusClass(status) {
  if (status >= 200 && status < 300) return 'status-2xx';
  if (status >= 300 && status < 400) return 'status-3xx';
  if (status >= 400 && status < 500) return 'status-4xx';
  return 'status-5xx';
}

export default function ResponseViewer({ response, loading, endpoint }) {
  if (!response && !loading) {
    return (
      <div className="response-viewer">
        <div className="response-empty">
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem', opacity: 0.25 }}>📭</div>
          <p>
            Select an endpoint from the sidebar<br />
            and click <strong style={{ color: 'var(--text-primary)' }}>▶ Test</strong> to see the response here.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="response-viewer">
        <div className="response-empty">
          <div style={{ marginBottom: '0.75rem' }}>
            <span
              style={{
                display: 'inline-block',
                width: 24,
                height: 24,
                border: '2px solid var(--border)',
                borderTopColor: 'var(--accent)',
                borderRadius: '50%',
                animation: 'spin 0.6s linear infinite',
              }}
            />
          </div>
          <p>Sending request{endpoint ? ` to ${endpoint.name}` : ''}...</p>
        </div>
      </div>
    );
  }

  if (!response.success) {
    return (
      <div className="response-viewer">
        <div className="response-header">
          <span className="response-title">
            <span style={{ marginRight: 6 }}>❌</span> Request Failed
          </span>
          {response.code && (
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--mono)' }}>
              {response.code}
            </span>
          )}
        </div>
        <div className="response-error">
          <div className="alert alert-error">{response.error}</div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            Common causes: invalid URL, CORS restriction, server unreachable, or network timeout.
          </p>
        </div>
      </div>
    );
  }

  const isJson = typeof response.data === 'object' && response.data !== null;
  const rawText = isJson
    ? JSON.stringify(response.data, null, 2)
    : String(response.data);

  return (
    <div className="response-viewer">
      <div className="response-header">
        <span className="response-title">
          <span style={{ marginRight: 6 }}>✅</span> Response
          {endpoint && (
            <span style={{ color: 'var(--text-muted)', fontWeight: 400, marginLeft: 8 }}>
              — {endpoint.name}
            </span>
          )}
        </span>
        <div className="response-meta">
          <span className={`status-pill ${getStatusClass(response.status)}`}>
            {response.status} {response.statusText}
          </span>
          {response.duration && (
            <span className="duration-tag">{response.duration}ms</span>
          )}
          <button
            className="btn btn-ghost"
            style={{ padding: '0.2rem 0.6rem', fontSize: '0.72rem' }}
            onClick={() => navigator.clipboard.writeText(rawText)}
            title="Copy to clipboard"
          >
            Copy
          </button>
        </div>
      </div>

      <div className="response-body">
        {isJson ? (
          <pre dangerouslySetInnerHTML={{ __html: highlight(response.data) }} />
        ) : (
          <pre style={{ color: 'var(--text-primary)' }}>{rawText}</pre>
        )}
      </div>
    </div>
  );
}
