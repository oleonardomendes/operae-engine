export default function Home() {
  return (
    <main style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: '#0D0D12',
      color: '#F5F5F7',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 500 }}>
          Guiamos
        </h1>
        <p style={{ color: '#8E8E9A', marginTop: '8px' }}>
          Em construção
        </p>
      </div>
    </main>
  )
}
