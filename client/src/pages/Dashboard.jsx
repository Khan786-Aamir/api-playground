import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import APIForm from '../components/APIForm';
import APIList from '../components/APIList';
import ResponseViewer from '../components/ResponseViewer';
import { getEndpoints, testEndpoint, deleteEndpoint } from '../services/api';

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const [endpoints, setEndpoints] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [response, setResponse] = useState(null);
  const [testing, setTesting] = useState(false);
  const [loadingList, setLoadingList] = useState(true);
  const [activeTab, setActiveTab] = useState('list'); // 'list' | 'add'

  const fetchEndpoints = useCallback(async () => {
    try {
      const { data } = await getEndpoints();
      setEndpoints(data);
    } catch (err) {
      console.error('Failed to load endpoints', err);
    } finally {
      setLoadingList(false);
    }
  }, []);

  useEffect(() => {
    fetchEndpoints();
  }, [fetchEndpoints]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleCreated = (newEndpoint) => {
    setEndpoints((prev) => [newEndpoint, ...prev]);
    setActiveTab('list');
    setSelectedId(newEndpoint._id);
    setResponse(null);
  };

  const handleSelect = (id) => {
    setSelectedId(id);
    setResponse(null);
  };

  const handleTest = async (id) => {
    setSelectedId(id);
    setResponse(null);
    setTesting(true);
    try {
      const { data } = await testEndpoint(id);
      setResponse({ success: true, ...data });
    } catch (err) {
      const errData = err.response?.data;
      setResponse({
        success: false,
        error: errData?.message || err.message || 'Request failed',
        code: errData?.code,
      });
    } finally {
      setTesting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this endpoint?')) return;
    try {
      await deleteEndpoint(id);
      setEndpoints((prev) => prev.filter((ep) => ep._id !== id));
      if (selectedId === id) {
        setSelectedId(null);
        setResponse(null);
      }
    } catch (err) {
      alert('Failed to delete endpoint.');
    }
  };

  return (
    <div className="dashboard">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-brand">
          <div className="navbar-brand-icon">⚡</div>
          API Playground
        </div>
        <div className="navbar-right">
          <span className="navbar-user">
            Signed in as <span>{user.name || user.email}</span>
          </span>
          <button className="btn btn-ghost" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      {/* Body */}
      <div className="dashboard-body">
        {/* Sidebar */}
        <div className="sidebar">
          <div className="sidebar-header">
            <div className="sidebar-title">Endpoints</div>
            <div className="tab-row">
              <button
                className={`tab-btn ${activeTab === 'list' ? 'active' : ''}`}
                onClick={() => setActiveTab('list')}
              >
                Saved ({endpoints.length})
              </button>
              <button
                className={`tab-btn ${activeTab === 'add' ? 'active' : ''}`}
                onClick={() => setActiveTab('add')}
              >
                + Add New
              </button>
            </div>
          </div>

          <div className="sidebar-list">
            {activeTab === 'add' ? (
              <APIForm onCreated={handleCreated} />
            ) : (
              <APIList
                endpoints={endpoints}
                loading={loadingList}
                selectedId={selectedId}
                testing={testing}
                onSelect={handleSelect}
                onTest={handleTest}
                onDelete={handleDelete}
              />
            )}
          </div>
        </div>

        {/* Main Panel */}
        <div className="main-panel">
          <div className="panel-header">
            <span style={{ fontSize: '1rem' }}>📡</span>
            <span className="panel-title">Response Viewer</span>
            {testing && (
              <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginLeft: 'auto' }}>
                <span className="spinner" style={{ borderTopColor: 'var(--accent)' }} /> Running request...
              </span>
            )}
          </div>
          <div className="panel-body">
            <ResponseViewer
              response={response}
              loading={testing}
              endpoint={endpoints.find((ep) => ep._id === selectedId)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
