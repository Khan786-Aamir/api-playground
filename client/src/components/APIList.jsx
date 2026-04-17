import React from 'react';

export default function APIList({
  endpoints,
  loading,
  selectedId,
  testing,
  onSelect,
  onTest,
  onDelete,
}) {
  if (loading) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">
          <span className="spinner" style={{ borderTopColor: 'var(--accent)', width: 20, height: 20, border: '2px solid var(--border)', borderTopColor: 'var(--accent)', display: 'inline-block', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
        </div>
        <p>Loading endpoints...</p>
      </div>
    );
  }

  if (endpoints.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">🔌</div>
        <p>
          No endpoints yet.<br />
          Click <strong>"+ Add New"</strong> to save your first API.
        </p>
      </div>
    );
  }

  return (
    <div>
      {endpoints.map((ep) => (
        <div
          key={ep._id}
          className={`endpoint-card ${selectedId === ep._id ? 'active' : ''}`}
          onClick={() => onSelect(ep._id)}
        >
          <div className="endpoint-card-top">
            <span className="endpoint-name" title={ep.name}>
              {ep.name}
            </span>
            <span className={`method-badge method-${ep.method}`}>
              {ep.method}
            </span>
          </div>

          <div className="endpoint-url" title={ep.url}>
            {ep.url}
          </div>

          <div className="endpoint-actions" onClick={(e) => e.stopPropagation()}>
            <button
              className={`btn btn-test ${testing && selectedId === ep._id ? 'loading' : ''}`}
              onClick={() => onTest(ep._id)}
              disabled={testing && selectedId === ep._id}
            >
              {testing && selectedId === ep._id ? (
                <><span className="spinner" /> Running</>
              ) : (
                '▶ Test'
              )}
            </button>
            <button
              className="btn btn-danger"
              onClick={() => onDelete(ep._id)}
              disabled={testing && selectedId === ep._id}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
