export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const cnpj = searchParams.get('cnpj')?.replace(/\D/g, '')

  if (!cnpj || cnpj.length !== 14) {
    return Response.json({ error: 'CNPJ inválido' }, { status: 400 })
  }

  const res = await fetch(`https://publica.cnpj.ws/cnpj/${cnpj}`)
  if (!res.ok) {
    return Response.json({ error: 'CNPJ não encontrado' }, { status: 404 })
  }

  const data = await res.json()

  const regimeMap: Record<string, string> = {
    'MEI': 'MEI',
    'SIMPLES': 'SN',
    'PRESUMIDO': 'LP',
    'REAL': 'LP',
  }
  const regimeRaw = data.simples?.optante_simples ? 'SIMPLES'
    : data.simei?.optante_simei ? 'MEI'
    : 'LP'
  const regime = regimeMap[regimeRaw] ?? 'SN'

  return Response.json({
    nome: data.razao_social,
    nome_fantasia: data.nome_fantasia || data.razao_social,
    regime,
    cnae: data.cnae_fiscal_descricao,
    cep: data.estabelecimento?.cep,
    logradouro: data.estabelecimento?.logradouro,
    numero: data.estabelecimento?.numero,
    bairro: data.estabelecimento?.bairro,
    municipio: data.estabelecimento?.cidade?.nome,
    uf: data.estabelecimento?.estado?.sigla,
  })
}
