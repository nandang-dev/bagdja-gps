import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Device, GpsData } from '../lib/supabase';
import Layout from '../components/Layout';

// Declare Google Maps types
declare const google: any;

export default function Map() {
  const { deviceId } = useParams<{ deviceId: string }>();
  const navigate = useNavigate();
  const [device, setDevice] = useState<Device | null>(null);
  const [latestGps, setLatestGps] = useState<GpsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isRealtime, setIsRealtime] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const mapRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<any>(null);
  const infoWindowRef = useRef<any>(null);

  useEffect(() => {
    if (!deviceId) {
      navigate('/devices');
      return;
    }
    fetchDeviceAndGps();

    // Setup Realtime subscription
    const channel = supabase
      .channel(`gps-data-${deviceId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'gps_data',
          filter: `device_id=eq.${deviceId}`
        },
        (payload) => {
          console.log('🔴 Real-time GPS update:', payload.new);
          const newGpsData = payload.new as GpsData;
          setLatestGps(newGpsData);
          setLastUpdate(new Date());
          setIsRealtime(true);
        }
      )
      .subscribe((status) => {
        console.log('📡 Realtime status:', status);
        if (status === 'SUBSCRIBED') {
          setIsRealtime(true);
        }
      });

    // Cleanup subscription on unmount
    return () => {
      console.log('🔌 Unsubscribing from realtime');
      supabase.removeChannel(channel);
    };
  }, [deviceId, navigate]);

  // Initialize Google Map ONCE
  useEffect(() => {
    if (!latestGps || !mapContainerRef.current || typeof google === 'undefined') return;
    if (mapRef.current) return; // Map already initialized

    console.log('🗺️ Initializing Google Map...');

    // Create map
    const map = new google.maps.Map(mapContainerRef.current, {
      center: { lat: latestGps.lat, lng: latestGps.lng },
      zoom: 15,
      mapTypeControl: true,
      streetViewControl: false,
      fullscreenControl: true,
      zoomControl: true,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'on' }]
        }
      ]
    });

    // Create custom marker
    const marker = new google.maps.Marker({
      position: { lat: latestGps.lat, lng: latestGps.lng },
      map: map,
      icon: {
        url: '/bagdja_logo_gps_orange_marker.png',
        scaledSize: new google.maps.Size(32, 48),
        anchor: new google.maps.Point(16, 48)
      },
      title: device?.name || 'Device',
      animation: google.maps.Animation.DROP
    });

    // Create info window ONCE
    const infoWindow = new google.maps.InfoWindow({
      content: `
        <div style="padding: 8px; font-family: system-ui;">
          <strong style="font-size: 14px;">${device?.name || 'Device'}</strong><br/>
          <small style="color: #666;">${latestGps.lat.toFixed(6)}, ${latestGps.lng.toFixed(6)}</small>
        </div>
      `
    });

    // Click listener to reopen if closed
    marker.addListener('click', () => {
      infoWindow.open(map, marker);
    });

    // Auto open info window
    infoWindow.open(map, marker);

    mapRef.current = map;
    markerRef.current = marker;
    infoWindowRef.current = infoWindow;

    console.log('✅ Google Map initialized');
  }, [latestGps, device]);

  // Update marker position smoothly when GPS data changes
  useEffect(() => {
    if (!latestGps || !markerRef.current || !mapRef.current || !infoWindowRef.current) return;

    console.log('📍 Updating marker position:', latestGps.lat, latestGps.lng);

    const newPosition = { lat: latestGps.lat, lng: latestGps.lng };

    // Smooth marker movement
    markerRef.current.setPosition(newPosition);

    // Smooth pan to new position
    mapRef.current.panTo(newPosition);

    // Update info window content (JANGAN buat baru!)
    infoWindowRef.current.setContent(`
      <div style="padding: 8px; font-family: system-ui;">
        <strong style="font-size: 14px;">${device?.name || 'Device'}</strong><br/>
        <small style="color: #666;">${latestGps.lat.toFixed(6)}, ${latestGps.lng.toFixed(6)}</small><br/>
        <small style="color: #22c55e; font-weight: 600;">🔴 Live Update</small>
      </div>
    `);

    // Keep it open if it was closed
    if (!infoWindowRef.current.getMap()) {
      infoWindowRef.current.open(mapRef.current, markerRef.current);
    }
  }, [latestGps, device?.name]);

  const fetchDeviceAndGps = async () => {
    try {
      // Fetch device info
      const { data: deviceData, error: deviceError } = await supabase
        .from('devices')
        .select('*')
        .eq('id', deviceId)
        .single();

      if (deviceError) throw deviceError;
      setDevice(deviceData);

      // Fetch latest GPS data
      const { data: gpsData, error: gpsError } = await supabase
        .from('gps_data')
        .select('*')
        .eq('device_id', deviceId)
        .order('date_time', { ascending: false })
        .limit(1)
        .single();

      if (gpsError && gpsError.code !== 'PGRST116') {
        throw gpsError;
      }

      setLatestGps(gpsData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const dateStr = date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const timeStr = date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
    return `${dateStr} ${timeStr}`;
  };

  const openInGoogleMaps = () => {
    if (latestGps) {
      window.open(
        `https://www.google.com/maps?q=${latestGps.lat},${latestGps.lng}`,
        '_blank'
      );
    }
  };

  if (loading) {
    return (
      <Layout>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '50vh' 
        }}>
          <p>Loading...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
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
      </Layout>
    );
  }

  return (
    <Layout>
      <div>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <h2 style={{ 
                fontSize: 'clamp(1.25rem, 4vw, 1.75rem)', 
                fontWeight: 'bold',
                margin: 0
              }}>
                📍 {device?.name}
              </h2>
              {isRealtime && (
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  background: '#22c55e',
                  color: 'white',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  animation: 'pulse 2s infinite'
                }}>
                  <span style={{ 
                    width: '8px', 
                    height: '8px', 
                    background: 'white', 
                    borderRadius: '50%',
                    display: 'inline-block'
                  }}></span>
                  LIVE
                </span>
              )}
            </div>
            <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              {device?.description || 'Posisi device terkini'}
              {lastUpdate && (
                <span style={{ color: '#999', marginLeft: '0.5rem' }}>
                  • Update: {lastUpdate.toLocaleTimeString('id-ID', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false
                  })}
                </span>
              )}
            </p>
          </div>
          <button
            onClick={() => navigate('/devices')}
            style={{
              padding: '0.5rem 1rem',
              background: 'white',
              border: '1px solid #ddd',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            ← Kembali
          </button>
        </div>
        
        {/* CSS Animation */}
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }
        `}</style>

        {!latestGps ? (
          <div style={{
            background: 'white',
            padding: '3rem',
            borderRadius: '12px',
            textAlign: 'center',
            color: '#666'
          }}>
            <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>📍</p>
            <p style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
              Belum Ada Data GPS
            </p>
            <p>Device ini belum mengirim data GPS</p>
          </div>
        ) : (
          <>
            {/* Google Map Container */}
            <div style={{
              background: 'white',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              marginBottom: '1.5rem',
              position: 'relative',
              zIndex: 1
            }}>
              <div 
                ref={mapContainerRef}
                style={{ 
                  width: '100%', 
                  height: '450px',
                  borderRadius: '12px',
                  position: 'relative',
                  zIndex: 1
                }}
              />
            </div>

            {/* Info Cards */}
            <div style={{
              display: 'grid',
              gap: '1rem',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))'
            }}>
              {/* Coordinates Card */}
              <div style={{
                background: 'white',
                padding: '1.5rem',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{ 
                  fontSize: '1rem', 
                  fontWeight: '600',
                  marginBottom: '1rem',
                  color: '#667eea'
                }}>
                  📌 Koordinat
                </h3>
                <div style={{ display: 'grid', gap: '0.5rem', fontSize: '0.9rem' }}>
                  <div>
                    <strong>Latitude:</strong>
                    <br />
                    <code style={{ 
                      background: '#f5f5f5', 
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      display: 'inline-block',
                      marginTop: '0.25rem'
                    }}>
                      {latestGps.lat}
                    </code>
                  </div>
                  <div>
                    <strong>Longitude:</strong>
                    <br />
                    <code style={{ 
                      background: '#f5f5f5', 
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      display: 'inline-block',
                      marginTop: '0.25rem'
                    }}>
                      {latestGps.lng}
                    </code>
                  </div>
                </div>
              </div>

              {/* Timestamp Card */}
              <div style={{
                background: 'white',
                padding: '1.5rem',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{ 
                  fontSize: '1rem', 
                  fontWeight: '600',
                  marginBottom: '1rem',
                  color: '#667eea'
                }}>
                  🕐 Waktu
                </h3>
                <p style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
                  {formatDate(latestGps.date_time)}
                </p>
                <p style={{ 
                  fontSize: '0.75rem', 
                  color: '#999',
                  marginTop: '0.5rem'
                }}>
                  Data diterima: {new Date(latestGps.created_at).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })} {new Date(latestGps.created_at).toLocaleTimeString('id-ID', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false
                  })}
                </p>
              </div>

              {/* Device Info Card */}
              <div style={{
                background: 'white',
                padding: '1.5rem',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{ 
                  fontSize: '1rem', 
                  fontWeight: '600',
                  marginBottom: '1rem',
                  color: '#667eea'
                }}>
                  📱 Device Info
                </h3>
                <div style={{ display: 'grid', gap: '0.5rem', fontSize: '0.9rem' }}>
                  <div>
                    <strong>AVL:</strong>
                    <br />
                    <code style={{ 
                      background: '#f5f5f5', 
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      display: 'inline-block',
                      marginTop: '0.25rem'
                    }}>
                      {device?.avl}
                    </code>
                  </div>
                  <div>
                    <strong>Status:</strong>{' '}
                    <span style={{ 
                      color: device?.is_active ? '#22c55e' : '#ef4444',
                      fontWeight: '600'
                    }}>
                      {device?.is_active ? '✓ Aktif' : '✗ Nonaktif'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
              <button
                onClick={openInGoogleMaps}
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '0.875rem 2rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '1rem',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                }}
              >
                🗺️ Buka di Google Maps
              </button>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
