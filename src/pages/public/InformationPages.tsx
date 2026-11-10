import { useState, type FormEvent, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, BriefcaseBusiness, CheckCircle2, ChevronDown, HeartHandshake, Search, ShieldCheck, Users } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import './InformationPages.css'

function Layout({ title, intro, children }: { title: string; intro: string; children: ReactNode }) {
  return <main className="public-page information-page">
    <header className="public-nav">
      <Link className="brand" to="/" aria-label="HOUK — início"><b>H</b><span>HOUK</span></Link>
      <nav className="information-nav" aria-label="Navegação principal"><Link to="/search">Oportunidades</Link><Link to="/about">Sobre</Link><Link to="/faq">FAQ</Link><Link to="/contact">Contato</Link></nav>
      <div className="public-nav-actions"><Link className="nav-login" to="/login">Entrar</Link><Link className="nav-cta" to="/cadastro">Criar conta</Link></div>
    </header>
    <div className="information-container">
      <div className="information-heading"><span className="section-eyebrow">PESSOAS, CONEXÕES E POSSIBILIDADES</span><h1>{title}</h1><p>{intro}</p></div>
      {children}
    </div>
    <footer className="public-footer"><Link className="brand" to="/"><b>H</b><span>HOUK</span></Link><nav className="footer-links" aria-label="Institucional"><Link to="/about">Sobre</Link><Link to="/faq">FAQ</Link><Link to="/contact">Contato</Link></nav><span className="footer-copy">© {new Date().getFullYear()} HOUK</span></footer>
  </main>
}

const questions = [
  { group: 'Candidatos', q: 'Como começo a procurar uma oportunidade?', a: 'Crie sua conta como candidato, preencha seu perfil e acesse a busca de oportunidades. Use os filtros para encontrar vagas de acordo com sua área, localização e modalidade de trabalho.' },
  { group: 'Candidatos', q: 'Como me candidato a uma vaga?', a: 'Entre na sua conta, abra os detalhes da oportunidade e selecione a opção de candidatura. Confira as informações antes de enviar e acompanhe o processo na área Minhas candidaturas.' },
  { group: 'Candidatos', q: 'Onde acompanho minhas candidaturas?', a: 'Na área do candidato, acesse Candidaturas. As atualizações feitas pelo contratante aparecem no status da candidatura e nas notificações da sua conta.' },
  { group: 'Candidatos', q: 'Posso atualizar meu currículo e minhas experiências?', a: 'Sim. Na área do candidato, você pode editar seu perfil, enviar seu currículo e atualizar experiências, formação, competências e portfólio.' },
  { group: 'Candidatos', q: 'Existem oportunidades para pessoas com deficiência?', a: 'A busca oferece um filtro para oportunidades que aceitam candidatos PCD. Confira também a descrição e os requisitos de cada vaga antes de se candidatar.' },
  { group: 'Contratantes', q: 'Como publico uma oportunidade?', a: 'Crie uma conta como contratante, acesse sua área e escolha Publicar oportunidade. Preencha as informações da vaga e envie. A publicação fica aguardando aprovação da administração.' },
  { group: 'Contratantes', q: 'Por que minha vaga ainda não aparece na busca?', a: 'As oportunidades enviadas por contratantes passam por moderação. Acompanhe a situação na sua lista de oportunidades e confira se há alguma orientação para ajustar as informações.' },
  { group: 'Contratantes', q: 'Como acompanho os candidatos da minha vaga?', a: 'Na área do contratante, acesse Candidaturas para consultar os profissionais que se inscreveram e atualizar o andamento de cada processo.' },
  { group: 'Conta e segurança', q: 'Esqueci minha senha. Como recupero o acesso?', a: 'Na tela de login, selecione Esqueci minha senha e informe o e-mail da sua conta. Confira a caixa de entrada e a pasta de spam para encontrar as instruções de recuperação.' },
  { group: 'Conta e segurança', q: 'A HOUK garante minha contratação?', a: 'A HOUK aproxima profissionais e contratantes. A seleção e a contratação são de responsabilidade do contratante; enviar uma candidatura não garante uma oferta de trabalho.' },
  { group: 'Conta e segurança', q: 'Como relato um problema ou uma oportunidade suspeita?', a: 'Use a página de contato, selecione o assunto adequado e descreva o ocorrido. Inclua o título ou o link da oportunidade, mas nunca envie senhas, documentos ou dados bancários.' },
]

export function FAQPage() {
  const [query, setQuery] = useState('')
  const [group, setGroup] = useState('Todas')
  const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
  const results = questions.filter(item => (group === 'Todas' || item.group === group) && normalize(`${item.q} ${item.a}`).includes(normalize(query)))
  return <Layout title="Como podemos ajudar?" intro="Encontre respostas para suas dúvidas e dê o próximo passo com mais confiança.">
    <label className="faq-search"><Search size={20} aria-hidden="true"/><input aria-label="Buscar nas perguntas frequentes" value={query} onChange={event => setQuery(event.target.value)} placeholder="Busque por candidatura, senha, publicação…" type="search"/></label>
    <div className="faq-filters" aria-label="Filtrar perguntas">{['Todas', 'Candidatos', 'Contratantes', 'Conta e segurança'].map(item => <button key={item} type="button" aria-pressed={group === item} onClick={() => setGroup(item)}>{item}</button>)}</div>
    <p className="faq-count" role="status">{results.length} pergunta(s) encontrada(s)</p>
    <div className="faq-list">{results.map(item => <details key={item.q}><summary><span>{item.q}</span><ChevronDown size={18} aria-hidden="true"/></summary><p>{item.a}</p></details>)}{!results.length && <div className="information-card"><h2>Nenhuma resposta encontrada</h2><p>Tente outra palavra ou selecione outra categoria.</p><button className="secondary" onClick={() => { setQuery(''); setGroup('Todas') }}>Limpar filtros</button></div>}</div>
    <div className="information-banner"><div><h2>Ainda precisa de ajuda?</h2><p>Conte para a gente o que aconteceu.</p></div><Link className="primary" to="/contact">Fale com a HOUK <ArrowRight size={16}/></Link></div>
  </Layout>
}

export function AboutPage() {
  return <Layout title="O próximo passo começa com uma conexão." intro="A HOUK conecta pessoas que buscam novas oportunidades a contratantes que precisam de talentos.">
    <section className="about-mission information-card"><span className="section-eyebrow">NOSSO PROPÓSITO</span><h2>Aproximar quem quer trabalhar de quem quer contratar.</h2><p>Buscar trabalho e encontrar a pessoa certa para uma equipe são momentos importantes. A HOUK reúne oportunidades de diferentes áreas em um só lugar e oferece ferramentas para organizar essa jornada, da criação do perfil ao acompanhamento das candidaturas.</p><p>Queremos facilitar conexões que façam sentido para as pessoas, para os negócios e para a comunidade.</p></section>
    <section className="information-grid" aria-label="Nossos princípios">{[{ Icon: Users, title: 'Pessoas no centro', text: 'Perfis, experiências e competências ajudam a apresentar o que cada profissional tem a oferecer.' }, { Icon: HeartHandshake, title: 'Mais possibilidades', text: 'Diferentes categorias e modalidades de trabalho ampliam os caminhos para encontrar uma oportunidade.' }, { Icon: ShieldCheck, title: 'Clareza em cada etapa', text: 'Informações sobre as vagas, moderação das publicações e acompanhamento das candidaturas apoiam decisões mais conscientes.' }].map(({ Icon, title, text }) => <article className="information-card" key={title}><Icon className="information-icon" size={28}/><h2>{title}</h2><p>{text}</p></article>)}</section>
    <section className="information-grid two-columns"><article className="information-card"><Users className="information-icon"/><h2>Para quem busca uma oportunidade</h2><p>Monte seu perfil, destaque suas competências, explore vagas e acompanhe suas candidaturas na sua área.</p><Link className="primary" to="/search">Explorar oportunidades <ArrowRight size={16}/></Link></article><article className="information-card"><BriefcaseBusiness className="information-icon"/><h2>Para quem busca talentos</h2><p>Apresente seu negócio, publique oportunidades para análise e organize o acompanhamento dos candidatos.</p><Link className="primary" to="/cadastro">Começar a contratar <ArrowRight size={16}/></Link></article></section>
  </Layout>
}

export function ContactPage() {
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const payload = { name: String(data.get('name') ?? '').trim(), email: String(data.get('email') ?? '').trim(), subject: String(data.get('subject') ?? ''), message: String(data.get('message') ?? '').trim() }
    if (payload.name.length < 2 || payload.message.length < 20) { setError('Informe seu nome e descreva sua mensagem com pelo menos 20 caracteres.'); return }
    setSending(true)
    setError('')
    try {
      const { error: insertError } = await supabase.from('contact_messages').insert(payload)
      if (insertError) throw insertError
      setSent(true)
      form.reset()
    } catch {
      setError('Não foi possível enviar sua mensagem. Tente novamente em alguns instantes. Seu texto foi mantido no formulário.')
    } finally { setSending(false) }
  }
  return <Layout title="Vamos conversar." intro="Tem uma dúvida, uma sugestão ou precisa de ajuda com a plataforma? Envie sua mensagem.">
    <div className="contact-layout"><section className="information-card"><h2>Envie uma mensagem</h2>{sent ? <div className="contact-success" role="status"><CheckCircle2 size={38}/><h3>Mensagem enviada!</h3><p>Sua mensagem foi registrada. O e-mail informado será o canal para uma eventual resposta da equipe.</p><button className="secondary" onClick={() => setSent(false)}>Enviar outra mensagem</button></div> : <form className="contact-form" onSubmit={submit}>
      <label>Seu nome<input name="name" autoComplete="name" minLength={2} maxLength={120} required placeholder="Como você se chama?" disabled={sending}/></label>
      <label>E-mail<input name="email" type="email" autoComplete="email" maxLength={254} required placeholder="voce@exemplo.com" disabled={sending}/></label>
      <label>Assunto<select name="subject" required defaultValue="" disabled={sending}><option value="" disabled>Selecione um assunto</option>{['Dúvida sobre candidaturas', 'Publicação de oportunidades', 'Conta e acesso', 'Relatar um problema', 'Sugestão ou parceria', 'Outro assunto'].map(subject => <option key={subject}>{subject}</option>)}</select></label>
      <label>Mensagem<textarea name="message" minLength={20} maxLength={5000} rows={7} required placeholder="Descreva como podemos ajudar (mínimo de 20 caracteres)." disabled={sending}/></label>
      <p className="contact-notice">Usaremos os dados informados para tratar sua solicitação. Não envie senhas, documentos pessoais ou dados bancários.</p>
      {error && <p className="form-message" role="alert">{error}</p>}<button className="primary" type="submit" disabled={sending}>{sending ? 'Enviando…' : 'Enviar mensagem'}<ArrowRight size={16}/></button>
    </form>}</section><aside className="contact-help information-card"><span className="section-eyebrow">PODEMOS AJUDAR</span><h2>Uma resposta pode estar pertinho.</h2><p>Veja como se candidatar, publicar oportunidades e acompanhar seus processos nas perguntas frequentes.</p><Link className="secondary" to="/faq">Ver perguntas frequentes <ArrowRight size={16}/></Link><hr/><h3>Problemas para entrar?</h3><p>Se você esqueceu sua senha, use a recuperação de acesso.</p><Link className="information-text-link" to="/esqueci-senha">Recuperar minha senha</Link></aside></div>
  </Layout>
}
