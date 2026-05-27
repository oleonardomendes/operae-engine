export default function Footer() {
  return (
    <footer style={{
      borderTop: '0.5px solid #2A2A35',
      padding: '24px 6%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '12px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <span style={{ fontSize: '15px', fontWeight: 500, color: '#5A5A68' }}>Guiamos</span>
        <span style={{ color: '#7C5CFC', fontSize: '12px' }}>✦</span>
      </div>
      <span style={{ fontSize: '13px', color: '#5A5A68' }}>
        &copy; 2026 Guiamos
      </span>
    </footer>
  )
}
