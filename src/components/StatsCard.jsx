import React from 'react';

export default function StatsCard({ title, value, icon, bgColor, bg, color, trendHtml, trend, onClick }) {
  const actualBg = bgColor || bg || '#F8FAFC';
  const actualTrend = trendHtml || trend;

  return (
    <div 
      className="glass-card stat-card" 
      onClick={onClick}
      style={{ 
        cursor: onClick ? 'pointer' : 'default', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '12px',
        padding: '20px',
        borderRadius: '16px',
        border: '1px solid #E2E8F0',
        backgroundColor: '#FFFFFF',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 12px 20px -8px rgba(0, 0, 0, 0.08)';
        e.currentTarget.style.borderColor = color || 'var(--color-primary)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)';
        e.currentTarget.style.borderColor = '#E2E8F0';
      }}
    >
      {/* Decorative Top Accent line using the card's theme color */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        backgroundColor: color || 'var(--color-primary)'
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748B', letterSpacing: '0.3px' }}>{title}</span>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          borderRadius: '12px', 
          backgroundColor: actualBg, 
          color: color || 'var(--color-primary)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          transition: 'transform 0.2s ease'
        }}>
          <ion-icon name={icon} style={{ fontSize: '20px' }}></ion-icon>
        </div>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '2px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#1E293B', margin: 0, lineHeight: 1 }}>{value}</h2>
      </div>
      
      {actualTrend && (
        <div 
          style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }} 
          dangerouslySetInnerHTML={{ __html: actualTrend }} 
        />
      )}
    </div>
  );
}
