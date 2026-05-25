'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import StoreHeader from '@/components/StoreHeader'
import StoreFooter from '@/components/StoreFooter'
import { KitDetalhe } from '@/data/kitsDetalhes'

const fmt = (n: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n)

export default function KitDetalhePage({ kit }: { kit: KitDetalhe }) {
  const [stickyVisible, setStickyVisible] = useState(false)

  useEffect(() => {
    const handler = () => setStickyVisible(window.scrollY > 400)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const checkoutHref = `/kits/checkout?kit=${kit.checkoutId}`

  return (
    <>
      <style>{styles}</style>
      <StoreHeader />

      <main style={{ background: 'var(--cream)', minHeight: '60vh' }}>

        {/* Breadcrumb */}
        <nav className="kd-breadcrumb">
          <Link href="/">Loja</Link>
          <span>→</span>
          <Link href="/kits">Kits</Link>
          <span>→</span>
          <span>{kit.nome}</span>
        </nav>

        {/* Hero */}
        <section className="kd-hero">
          <div className="kd-hero-inner">
            <span className="kd-badge">{kit.badge}</span>
            <h1 className="kd-hero-nome">{kit.nome}</h1>
            <p className="kd-hero-tagline">{kit.tagline}</p>
            <p className="kd-hero-sub">{kit.subtitulo}</p>
            <div className="kd-hero-preco">
              <span className="kd-preco-val">{fmt(kit.preco)}</span>
              <span className="kd-preco-note">ou em até 12x no cartão</span>
            </div>
            <div className="kd-frete-tag">🚚 Frete grátis incluído</div>
            <Link href={checkoutHref} className="kd-btn-comprar">
              Comprar kit completo →
            </Link>
            <p className="kd-seguro">
              Pagamento seguro · Entrega para todo o Brasil
            </p>
          </div>
        </section>

        {/* Para quem é */}
        <section className="kd-section">
          <div className="kd-container">
            <h2 className="kd-section-title">👤 Para quem é esse kit?</h2>
            <p className="kd-text">{kit.paraQuemE.descricao}</p>
            <div className="kd-perfil-grid">
              <div className="kd-perfil-item">
                <span className="kd-perfil-icon">🐟</span>
                <div>
                  <span className="kd-perfil-label">Espécies</span>
                  <span className="kd-perfil-val">{kit.paraQuemE.especies}</span>
                </div>
              </div>
              <div className="kd-perfil-item">
                <span className="kd-perfil-icon">🌊</span>
                <div>
                  <span className="kd-perfil-label">Ambiente</span>
                  <span className="kd-perfil-val">{kit.paraQuemE.ambiente}</span>
                </div>
              </div>
              <div className="kd-perfil-item">
                <span className="kd-perfil-icon">🪝</span>
                <div>
                  <span className="kd-perfil-label">Técnica</span>
                  <span className="kd-perfil-val">{kit.paraQuemE.tecnica}</span>
                </div>
              </div>
              <div className="kd-perfil-item">
                <span className="kd-perfil-icon">⚙️</span>
                <div>
                  <span className="kd-perfil-label">Nível</span>
                  <span className="kd-perfil-val">{kit.paraQuemE.nivel}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Componentes do kit */}
        <section className="kd-section kd-section-dark">
          <div className="kd-container">
            <h2 className="kd-section-title">O que vem no kit</h2>
            <div className="kd-componentes">
              {kit.componentes.map((comp, i) => (
                <div key={i} className={`kd-comp${comp.isBrinde ? ' kd-comp-brinde' : ''}`}>
                  {comp.isBrinde ? (
                    <div className="kd-comp-img kd-comp-img-brinde">
                      <span style={{ fontSize: '48px' }}>🎁</span>
                    </div>
                  ) : comp.imagem ? (
                    <div className="kd-comp-img">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={comp.imagem} alt={comp.titulo}
                        style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '12px' }} />
                    </div>
                  ) : null}
                  <div className="kd-comp-info">
                    {comp.isBrinde && (
                      <span className="kd-brinde-badge">🎁 BRINDE EXCLUSIVO</span>
                    )}
                    <h3 className="kd-comp-titulo">{comp.titulo}</h3>
                    <p className="kd-comp-sub">{comp.subtitulo}</p>
                    <p className="kd-comp-desc">{comp.descricao}</p>
                    {comp.specs.length > 0 && (
                      <ul className="kd-specs">
                        {comp.specs.map((s, j) => (
                          <li key={j}>
                            <span className="kd-spec-check">✓</span> {s}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Por que combina */}
        <section className="kd-section">
          <div className="kd-container kd-container-sm">
            <h2 className="kd-section-title">🔧 Por que esses produtos combinam?</h2>
            {kit.porQueCombina.split('\n\n').map((p, i) => (
              <p key={i} className="kd-text">{p}</p>
            ))}
          </div>
        </section>

        {/* CTA Final */}
        <section className="kd-section kd-cta-final">
          <div className="kd-container kd-container-sm" style={{ textAlign: 'center' }}>
            <h2 className="kd-cta-nome">{kit.nome}</h2>
            <p className="kd-cta-preco">{fmt(kit.preco)}</p>
            <p className="kd-cta-note">ou em até 12x no cartão · Frete grátis</p>
            <Link href={checkoutHref} className="kd-btn-comprar" style={{ display: 'inline-block' }}>
              Comprar kit completo →
            </Link>
            <p className="kd-seguro" style={{ marginTop: '16px' }}>
              Pagamento seguro · Entrega para todo o Brasil · Frete grátis
            </p>
          </div>
        </section>

      </main>

      <StoreFooter />

      {/* Barra sticky */}
      {stickyVisible && (
        <div className="kd-sticky">
          <div className="kd-sticky-inner">
            <div>
              <span className="kd-sticky-nome">{kit.nome}</span>
              <span className="kd-sticky-preco">{fmt(kit.preco)} · Frete grátis</span>
            </div>
            <Link href={checkoutHref} className="kd-sticky-btn">
              Comprar agora →
            </Link>
          </div>
        </div>
      )}
    </>
  )
}

const styles = `
  .kd-breadcrumb {
    display: flex; align-items: center; gap: 8px;
    padding: 14px 6%; font-size: 13px; color: var(--muted);
    background: #fff; border-bottom: 1px solid var(--border);
  }
  .kd-breadcrumb a { color: var(--g700); }
  .kd-breadcrumb a:hover { text-decoration: underline; }

  .kd-hero {
    background: var(--g900); color: #fff;
    padding: 72px 6%;
  }
  .kd-hero-inner {
    max-width: 960px; margin: 0 auto;
    display: flex; flex-direction: column; gap: 16px;
  }
  .kd-badge {
    display: inline-block; align-self: flex-start;
    background: var(--a500); color: #fff;
    font-size: 11px; font-weight: 800;
    letter-spacing: .12em; text-transform: uppercase;
    padding: 4px 14px; border-radius: 50px;
  }
  .kd-hero-nome {
    font-family: var(--ff-display); font-size: 48px;
    color: #fff; letter-spacing: .02em; line-height: 1.1;
  }
  .kd-hero-tagline {
    font-size: 20px; color: #c8e6c9; font-weight: 600; line-height: 1.4;
  }
  .kd-hero-sub {
    font-size: 16px; color: rgba(255,255,255,.75); line-height: 1.65;
  }
  .kd-hero-preco {
    display: flex; align-items: baseline; gap: 12px; margin-top: 8px;
  }
  .kd-preco-val {
    font-family: var(--ff-display); font-size: 48px; color: #4CAF70;
  }
  .kd-preco-note { font-size: 14px; color: rgba(255,255,255,.6); }
  .kd-frete-tag {
    display: inline-block; align-self: flex-start;
    background: rgba(76,175,112,.2); color: #4CAF70;
    font-size: 13px; font-weight: 700;
    padding: 6px 16px; border-radius: 50px;
    border: 1px solid rgba(76,175,112,.3);
  }
  .kd-btn-comprar {
    display: inline-block; align-self: flex-start;
    background: var(--a500); color: #fff;
    font-weight: 800; font-size: 16px;
    padding: 16px 36px; border-radius: 50px;
    text-decoration: none; transition: all .2s;
    box-shadow: 0 4px 20px rgba(212,132,12,.4);
  }
  .kd-btn-comprar:hover {
    background: #e8920e; transform: translateY(-2px);
  }
  .kd-seguro {
    font-size: 12px; color: rgba(255,255,255,.5);
  }

  .kd-section { padding: 64px 6%; }
  .kd-section-dark { background: #fff; }
  .kd-container { max-width: 960px; margin: 0 auto; }
  .kd-container-sm { max-width: 720px; margin: 0 auto; }

  .kd-section-title {
    font-family: var(--ff-display); font-size: 32px;
    color: var(--g900); margin-bottom: 24px; letter-spacing: .02em;
  }
  .kd-text {
    font-size: 16px; color: var(--muted); line-height: 1.75;
    margin-bottom: 20px;
  }

  .kd-perfil-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 16px; margin-top: 24px;
  }
  .kd-perfil-item {
    display: flex; align-items: flex-start; gap: 12px;
    background: var(--cream); border-radius: 12px;
    padding: 16px; border: 1px solid var(--border);
  }
  .kd-perfil-icon { font-size: 24px; flex-shrink: 0; }
  .kd-perfil-label {
    display: block; font-size: 11px; font-weight: 700;
    color: var(--muted); text-transform: uppercase;
    letter-spacing: .08em; margin-bottom: 4px;
  }
  .kd-perfil-val { display: block; font-size: 14px; color: var(--dark); font-weight: 600; }

  .kd-componentes { display: flex; flex-direction: column; gap: 48px; margin-top: 16px; }
  .kd-comp {
    display: grid; grid-template-columns: 280px 1fr;
    gap: 40px; align-items: start;
  }
  .kd-comp:nth-child(even) { direction: rtl; }
  .kd-comp:nth-child(even) > * { direction: ltr; }
  .kd-comp-brinde {
    background: linear-gradient(135deg, #fffbf0 0%, #fff8e1 100%);
    border: 2px solid var(--a400, #f0a500);
    border-radius: 16px; padding: 28px;
    grid-template-columns: 120px 1fr;
  }
  .kd-comp-img {
    width: 100%; aspect-ratio: 1;
    background: var(--g50); border-radius: 16px;
    border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    overflow: hidden;
  }
  .kd-comp-img-brinde {
    background: #fff8e1; border: 2px dashed var(--a400, #f0a500);
  }
  .kd-brinde-badge {
    display: inline-block; background: var(--a500); color: #fff;
    font-size: 11px; font-weight: 800; letter-spacing: .1em;
    padding: 4px 12px; border-radius: 50px; margin-bottom: 8px;
  }
  .kd-comp-titulo {
    font-size: 13px; font-weight: 800; color: var(--g700);
    letter-spacing: .1em; text-transform: uppercase; margin-bottom: 4px;
  }
  .kd-comp-sub {
    font-size: 20px; font-weight: 700; color: var(--g900); margin-bottom: 12px;
  }
  .kd-comp-desc { font-size: 15px; color: var(--muted); line-height: 1.7; margin-bottom: 16px; }
  .kd-specs { display: flex; flex-direction: column; gap: 6px; padding: 0; list-style: none; }
  .kd-specs li { font-size: 14px; color: var(--dark); display: flex; gap: 8px; }
  .kd-spec-check { color: #22c55e; font-weight: 700; flex-shrink: 0; }

  .kd-cta-final {
    background: var(--g900); color: #fff;
  }
  .kd-cta-final .kd-section-title { color: #fff; }
  .kd-cta-nome {
    font-family: var(--ff-display); font-size: 36px; color: #fff; margin-bottom: 8px;
  }
  .kd-cta-preco {
    font-family: var(--ff-display); font-size: 52px; color: #4CAF70;
    margin-bottom: 4px;
  }
  .kd-cta-note { font-size: 14px; color: rgba(255,255,255,.6); margin-bottom: 28px; }

  .kd-sticky {
    position: fixed; bottom: 0; left: 0; right: 0;
    background: var(--g900); color: #fff;
    border-top: 2px solid var(--g700);
    z-index: 100; padding: 12px 6%;
    box-shadow: 0 -4px 20px rgba(0,0,0,.2);
    animation: slideUp .3s ease;
  }
  @keyframes slideUp {
    from { transform: translateY(100%); }
    to { transform: translateY(0); }
  }
  .kd-sticky-inner {
    max-width: 960px; margin: 0 auto;
    display: flex; align-items: center;
    justify-content: space-between; gap: 16px;
  }
  .kd-sticky-nome {
    display: block; font-weight: 700; font-size: 15px;
  }
  .kd-sticky-preco {
    display: block; font-size: 13px; color: #4CAF70; font-weight: 600;
  }
  .kd-sticky-btn {
    background: var(--a500); color: #fff;
    font-weight: 800; font-size: 14px;
    padding: 12px 28px; border-radius: 50px;
    text-decoration: none; white-space: nowrap;
    transition: background .2s;
  }
  .kd-sticky-btn:hover { background: #e8920e; }

  @media (min-width: 768px) {
    .kd-hero { padding: 60px 80px; }
    .kd-hero-inner { max-width: 960px; margin: 0; padding: 0; text-align: left; align-items: flex-start; }
    .kd-section { padding: 64px 80px; }
    .kd-container { max-width: 960px; margin: 0; }
    .kd-container-sm { max-width: 700px; margin: 0; }
    .kd-section-title { text-align: left; }
    .kd-text { text-align: left; }
    .kd-cta-final .kd-container-sm { text-align: center; margin: 0 auto; }
    .kd-hero-nome { font-size: 2.5rem; }
    .kd-preco-val { font-size: 3rem; }
    .kd-cta-preco { font-size: 3rem; }
    .kd-cta-nome { font-size: 2rem; }
  }

  @media (max-width: 768px) {
    .kd-hero-nome { font-size: 32px; }
    .kd-preco-val { font-size: 36px; }
    .kd-comp { grid-template-columns: 1fr; }
    .kd-comp:nth-child(even) { direction: ltr; }
    .kd-comp-img { max-width: 240px; }
    .kd-perfil-grid { grid-template-columns: 1fr; }
    .kd-section-title { font-size: 24px; }
    .kd-cta-preco { font-size: 36px; }
    .kd-btn-comprar { align-self: stretch; text-align: center; }
  }
`
