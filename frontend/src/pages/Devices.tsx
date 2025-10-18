import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Device } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';

export default function Devices() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [filteredDevices, setFilteredDevices] = useState<Device[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    avl: '',
    description: '',
  });
  const [error, setError] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [copiedText, setCopiedText] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  // Detect screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    fetchDevices();
  }, [user, navigate]);

  const fetchDevices = async () => {
    try {
      const { data, error } = await supabase
        .from('devices')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDevices(data || []);
      setFilteredDevices(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter devices based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredDevices(devices);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = devices.filter((device) => {
      return (
        device.name.toLowerCase().includes(query) ||
        device.avl.toLowerCase().includes(query) ||
        device.api_key.toLowerCase().includes(query) ||
        (device.description && device.description.toLowerCase().includes(query))
      );
    });
    setFilteredDevices(filtered);
  }, [searchQuery, devices]);

  const generateApiKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    const randomValues = crypto.getRandomValues(new Uint8Array(10));
    for (let i = 0; i < 10; i++) {
      result += chars[randomValues[i] % chars.length];
    }
    return result;
  };

  const generateAvl = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    const randomValues = crypto.getRandomValues(new Uint8Array(16));
    for (let i = 0; i < 16; i++) {
      result += chars[randomValues[i] % chars.length];
    }
    return result;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (editingDevice) {
        // Update
        const { error } = await supabase
          .from('devices')
          .update({
            name: formData.name,
            avl: formData.avl,
            description: formData.description,
          })
          .eq('id', editingDevice.id);

        if (error) throw error;
      } else {
        // Create
        const { error } = await supabase
          .from('devices')
          .insert({
            user_id: user!.id,
            name: formData.name,
            avl: formData.avl,
            description: formData.description,
            api_key: generateApiKey(),
          });

        if (error) throw error;
      }

      setShowModal(false);
      setEditingDevice(null);
      setFormData({ name: '', avl: '', description: '' });
      fetchDevices();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus device ini?')) return;

    try {
      const { error } = await supabase
        .from('devices')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchDevices();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const toggleActive = async (device: Device) => {
    try {
      const { error } = await supabase
        .from('devices')
        .update({ is_active: !device.is_active })
        .eq('id', device.id);

      if (error) throw error;
      fetchDevices();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const openEditModal = (device: Device) => {
    setEditingDevice(device);
    setFormData({
      name: device.name,
      avl: device.avl,
      description: device.description || '',
    });
    setShowModal(true);
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(label);
      setTimeout(() => setCopiedText(''), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <Layout>
      <div>
        {error && (
          <div style={{
            background: '#fee',
            border: '1px solid #fcc',
            color: '#c33',
            padding: '1rem',
            borderRadius: '6px',
            marginBottom: '1rem'
          }}>
            {error}
          </div>
        )}

        <div style={{ 
          display: 'flex', 
          gap: '0.5rem', 
          marginBottom: '1.5rem',
          flexWrap: 'nowrap',
          alignItems: 'center'
        }}>
          <button
            onClick={() => {
              setEditingDevice(null);
              setFormData({ name: '', avl: generateAvl(), description: '' });
              setShowModal(true);
            }}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              padding: isMobile ? '0' : '0.75rem 1rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: isMobile ? '1.2rem' : 'clamp(0.8rem, 2.5vw, 1rem)',
              whiteSpace: 'nowrap',
              width: isMobile ? '36px' : 'auto',
              height: isMobile ? '36px' : 'auto',
              minWidth: isMobile ? '36px' : 'auto',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {isMobile ? '+' : '+ Tambah Device'}
          </button>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '1.25rem'
              }}>
                🔍
              </span>
              <input
                type="text"
                placeholder="Cari device..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 3rem',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: 'clamp(0.8rem, 2.5vw, 1rem)',
                  background: 'white',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '0.25rem 0.5rem',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    fontWeight: '600'
                  }}
                >
                  ✕ Clear
                </button>
              )}
            </div>
          </div>

          <div style={{
            padding: isMobile ? '0.5rem' : '0.75rem 0.8rem',
            background: 'white',
            borderRadius: '6px',
            border: '1px solid #ddd',
            fontWeight: '600',
            color: '#667eea',
            whiteSpace: 'nowrap',
            fontSize: isMobile ? '0.7rem' : 'clamp(0.75rem, 2vw, 0.9rem)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            flexShrink: 0
          }}>
            {isMobile ? (
              <span>📊 {filteredDevices.length}/{devices.length}</span>
            ) : (
              <>📊 <span>{filteredDevices.length} / {devices.length}</span></>
            )}
          </div>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : devices.length === 0 ? (
          <div style={{
            background: 'white',
            padding: '3rem',
            borderRadius: '12px',
            textAlign: 'center',
            color: '#666'
          }}>
            <p>Belum ada device. Klik tombol "Tambah Device" untuk menambahkan.</p>
          </div>
        ) : filteredDevices.length === 0 ? (
          <div style={{
            background: 'white',
            padding: '3rem',
            borderRadius: '12px',
            textAlign: 'center',
            color: '#666'
          }}>
            <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</p>
            <p style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
              Tidak ada hasil
            </p>
            <p>Tidak ada device yang cocok dengan "{searchQuery}"</p>
            <button
              onClick={() => setSearchQuery('')}
              style={{
                marginTop: '1rem',
                padding: '0.5rem 1rem',
                background: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Clear Search
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {filteredDevices.map((device) => (
              <div
                key={device.id}
                style={{
                  background: 'white',
                  padding: 'clamp(1rem, 3vw, 1.5rem)',
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
              >
                <div>
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'start',
                      gap: '0.5rem',
                      marginBottom: '0.5rem'
                    }}>
                      <h3 style={{ 
                        fontSize: 'clamp(1rem, 4vw, 1.25rem)', 
                        fontWeight: 'bold', 
                        wordBreak: 'break-word',
                        flex: 1
                      }}>
                        {device.name}
                      </h3>
                      <button
                        onClick={() => navigate(`/map/${device.id}`)}
                        style={{
                          background: '#22c55e',
                          color: 'white',
                          border: 'none',
                          padding: '0.4rem 0.75rem',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: 'clamp(0.7rem, 2vw, 0.85rem)',
                          fontWeight: '500',
                          whiteSpace: 'nowrap',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}
                      >
                        🗺️ Map
                      </button>
                    </div>
                    {device.description && (
                      <p style={{ 
                        color: '#666', 
                        marginBottom: '0',
                        fontSize: 'clamp(0.8rem, 2vw, 0.9rem)'
                      }}>
                        {device.description}
                      </p>
                    )}
                  </div>
                  
                  <div style={{ 
                    display: 'grid', 
                    gap: '0.5rem', 
                    fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                    marginBottom: '1rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <strong>AVL:</strong> 
                      <code style={{ 
                        background: '#f5f5f5', 
                        padding: '0.25rem 0.5rem', 
                        borderRadius: '4px',
                        fontSize: 'clamp(0.7rem, 2vw, 0.8rem)',
                        wordBreak: 'break-all',
                        flex: '1 1 auto'
                      }}>{device.avl}</code>
                      <button
                        onClick={() => copyToClipboard(device.avl, `avl-${device.id}`)}
                        style={{
                          background: copiedText === `avl-${device.id}` ? '#22c55e' : '#667eea',
                          color: 'white',
                          border: 'none',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.75rem',
                          whiteSpace: 'nowrap',
                          transition: 'all 0.2s'
                        }}
                      >
                        {copiedText === `avl-${device.id}` ? '✓ Copied' : '📋 Copy'}
                      </button>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <strong>API Key:</strong> 
                      <code style={{ 
                        background: '#f5f5f5', 
                        padding: '0.25rem 0.5rem', 
                        borderRadius: '4px',
                        fontSize: 'clamp(0.7rem, 2vw, 0.8rem)',
                        wordBreak: 'break-all',
                        flex: '1 1 auto'
                      }}>{device.api_key}</code>
                      <button
                        onClick={() => copyToClipboard(device.api_key, `key-${device.id}`)}
                        style={{
                          background: copiedText === `key-${device.id}` ? '#22c55e' : '#667eea',
                          color: 'white',
                          border: 'none',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.75rem',
                          whiteSpace: 'nowrap',
                          transition: 'all 0.2s'
                        }}
                      >
                        {copiedText === `key-${device.id}` ? '✓ Copied' : '📋 Copy'}
                      </button>
                    </div>
                    <div>
                      <strong>Status:</strong>{' '}
                      <span style={{ 
                        color: device.is_active ? '#22c55e' : '#ef4444',
                        fontWeight: '600'
                      }}>
                        {device.is_active ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </div>
                  </div>

                  <div style={{ 
                    display: 'flex', 
                    gap: '0.5rem', 
                    flexWrap: 'wrap',
                    justifyContent: isMobile ? 'flex-start' : 'flex-end'
                  }}>
                    <button
                      onClick={() => toggleActive(device)}
                      style={{
                        flex: isMobile ? '1 1 auto' : '0 1 auto',
                        minWidth: 'fit-content',
                        padding: '0.6rem 0.8rem',
                        borderRadius: '6px',
                        border: 'none',
                        cursor: 'pointer',
                        background: device.is_active ? '#fbbf24' : '#22c55e',
                        color: 'white',
                        fontWeight: '500',
                        fontSize: 'clamp(0.75rem, 2vw, 0.875rem)'
                      }}
                    >
                      {device.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                    </button>
                    <button
                      onClick={() => openEditModal(device)}
                      style={{
                        flex: isMobile ? '1 1 auto' : '0 1 auto',
                        minWidth: 'fit-content',
                        padding: '0.6rem 0.8rem',
                        borderRadius: '6px',
                        border: '1px solid #667eea',
                        cursor: 'pointer',
                        background: 'white',
                        color: '#667eea',
                        fontWeight: '500',
                        fontSize: 'clamp(0.75rem, 2vw, 0.875rem)'
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(device.id)}
                      style={{
                        flex: isMobile ? '1 1 auto' : '0 1 auto',
                        minWidth: 'fit-content',
                        padding: '0.6rem 0.8rem',
                        borderRadius: '6px',
                        border: 'none',
                        cursor: 'pointer',
                        background: '#ef4444',
                        color: 'white',
                        fontWeight: '500',
                        fontSize: 'clamp(0.75rem, 2vw, 0.875rem)'
                      }}
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: 'clamp(0.5rem, 2vw, 1rem)'
        }}>
          <div style={{
            background: 'white',
            padding: 'clamp(1.25rem, 4vw, 2rem)',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <h2 style={{ 
              fontSize: 'clamp(1.1rem, 4vw, 1.5rem)', 
              fontWeight: 'bold', 
              marginBottom: 'clamp(1rem, 3vw, 1.5rem)' 
            }}>
              {editingDevice ? 'Edit Device' : 'Tambah Device Baru'}
            </h2>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Nama Device *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  AVL * (16 digit huruf besar & angka)
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    value={formData.avl}
                    onChange={(e) => setFormData({ ...formData, avl: e.target.value.toUpperCase() })}
                    required
                    maxLength={16}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '1rem',
                      fontFamily: 'monospace',
                      letterSpacing: '1px'
                    }}
                  />
                  {!editingDevice && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, avl: generateAvl() })}
                      style={{
                        padding: isMobile ? '0.75rem' : '0.75rem 1rem',
                        background: '#667eea',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: '500',
                        whiteSpace: 'nowrap',
                        minWidth: isMobile ? '50px' : 'auto',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: isMobile ? '1.2rem' : '1rem'
                      }}
                    >
                      {isMobile ? '🔄' : '🔄 Generate'}
                    </button>
                  )}
                </div>
                <small style={{ color: '#666', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
                  {formData.avl.length}/16 karakter
                </small>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Deskripsi
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '1rem',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              {!editingDevice && (
                <p style={{ 
                  fontSize: '0.875rem', 
                  color: '#666',
                  marginBottom: '1.5rem',
                  padding: '0.75rem',
                  background: '#f0f9ff',
                  borderRadius: '6px'
                }}>
                  API Key akan digenerate otomatis setelah device dibuat
                </p>
              )}

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    flex: 1,
                    padding: '0.875rem',
                    background: loading ? '#999' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: loading ? 'not-allowed' : 'pointer'
                  }}
                >
                  {loading ? 'Menyimpan...' : 'Simpan'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingDevice(null);
                    setFormData({ name: '', avl: '', description: '' });
                  }}
                  style={{
                    flex: 1,
                    padding: '0.875rem',
                    background: 'white',
                    color: '#333',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}

