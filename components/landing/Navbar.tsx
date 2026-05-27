'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <style>{`
        .nav-ghost {
          padding: 8px 16px;
          font-size: 14px;
          font-weight: 500;
          color: #8E8E9A;
          border: 0.5px solid #2A2A35;
          border-radius: 8px;
          background: transparent;
          transition: color 150ms ease, border-color 150ms ease;
          text-decoration: none;
          display: inline-block;
          cursor: pointer;
        }
        .nav-ghost:hover {
          color: #F5F5F7;
          border-color: #3A3A48;
        }
        .nav-primary {
          padding: 8px 16px;
          font-size: 14px;
          font-weight: 500;
          color: #fff;
          background: #7C5CFC;
          border-radius: 8px;
          transition: background 150ms ease;
          text-decoration: none;
          display: inline-block;
          cursor: pointer;
        }
        .nav-primary:hover {
          background: #9070FD;
        }
        @media (max-width: 480px) {
          .nav-label { display: none; }
          .nav-primary { font-size: 13px; padding: 7px 12px; }
        }
      `}</style>
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 6%',
        height: '56px',
        background: scrolled ? 'rgba(13, 13, 18, 0.9)' : '#0D0D12',
        borderBottom: '0.5px solid #2A2A35',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        transition: 'background 200ms ease',
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{
            fontSize: '16px',
            fontWeight: 500,
            color: '#F5F5F7',
            letterSpacing: '-0.01em',
          }}>
            Guiamos
          </span>
          <span style={{ color: '#7C5CFC', fontSize: '13px' }}>✦</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Link href="/login" className="nav-ghost">
            <span className="nav-label">Entrar</span>
          </Link>
          <Link href="/login?register=true" className="nav-primary">
            Criar minha loja →
          </Link>
        </div>
      </nav>
    </>
  )
}
