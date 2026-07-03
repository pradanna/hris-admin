import React from 'react';

export default function ApprovalCard({ req, onApprove, onReject, onViewDetail }) {
  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : '';
  };

  return (
    <div className="pending-card" id={`req-card-${req.id}`} style={{ padding: '16px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {req.avatar ? (
          <img src={req.avatar} alt={req.name} className="pending-avatar" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
        ) : (
          <div className="pending-avatar-placeholder" style={{ width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
            {getInitials(req.name)}
          </div>
        )}
        <div style={{ flex: 1 }}>
          <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>{req.name}</h4>
          <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>{req.role} • {req.time}</p>
        </div>
        <span className={`pending-tag ${req.tagClass || 'leave'}`}>{req.type}</span>
      </div>

      <p style={{ fontSize: '12px', color: 'var(--color-gray-600)', fontStyle: 'italic', lineHeight: '1.4', margin: '4px 0' }}>
        "{req.reason}"
      </p>

      <div className="pending-actions" style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', borderTop: '1px solid var(--color-border)', paddingTop: '10px', marginTop: '4px' }}>
        <button 
          className="pending-btn reject" 
          onClick={() => onReject(req.id)}
          style={{ padding: '6px 12px', fontSize: '11px', width: 'auto', margin: 0 }}
        >
          Tolak
        </button>
        <button 
          className="pending-btn approve" 
          onClick={(e) => onApprove(req.id, e.target)}
          style={{ padding: '6px 12px', fontSize: '11px', width: 'auto', margin: 0, backgroundColor: 'var(--color-primary)', color: 'white' }}
        >
          Setujui
        </button>
        <button 
          className="action-icon-btn" 
          title="Lihat Detail"
          onClick={() => onViewDetail(req.id)}
          style={{ padding: '6px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', background: 'white', display: 'inline-flex', cursor: 'pointer' }}
        >
          <ion-icon name="eye-outline" style={{ fontSize: '14px', color: 'var(--color-gray-600)' }}></ion-icon>
        </button>
      </div>
    </div>
  );
}
