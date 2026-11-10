-- Execute no SQL Editor do Supabase.
-- Duas vagas de DEMONSTRAÇÃO por categoria ativa (34 nas 17 categorias atuais).
-- Não representam ofertas reais. Reexecuções não duplicam nem alteram vagas.
-- O responsável é uma conta existente de administrador, ou de contratante.
begin;

do $$
begin
  if not exists (select 1 from public.profiles where role in ('admin', 'contractor')) then
    raise exception 'Cadastre uma conta de administrador ou contratante antes de executar os inserts.';
  end if;
end;
$$;

with publisher as (
  select id from public.profiles
  where role in ('admin', 'contractor')
  order by case when role = 'admin' then 0 else 1 end, created_at, id
  limit 1
), templates(category_name, first_title, second_title, activities, qualifications, minimum_salary, maximum_salary) as (
  values
    ('Tecnologia', 'Desenvolvedor(a) Front-end Júnior', 'Analista de Suporte Técnico', 'Desenvolver soluções digitais, investigar problemas e colaborar com a equipe de tecnologia.', 'Conhecimentos de informática, raciocínio lógico e disposição para aprender.', 2800, 4500),
    ('Atendimento', 'Assistente de Atendimento', 'Recepcionista', 'Atender clientes, registrar solicitações e orientar sobre produtos e serviços.', 'Comunicação clara, organização e facilidade para lidar com o público.', 1800, 2500),
    ('Comércio', 'Operador(a) de Loja', 'Repositor(a) de Mercadorias', 'Organizar mercadorias, apoiar o atendimento e acompanhar a reposição de produtos.', 'Ensino médio e atenção à organização e ao atendimento.', 1800, 2600),
    ('Construção', 'Auxiliar de Obras', 'Assistente de Manutenção Predial', 'Apoiar atividades de obra e manutenção, organizar materiais e seguir orientações de segurança.', 'Disposição para atividades práticas e compromisso com a segurança.', 2100, 3200),
    ('Saúde', 'Recepcionista de Clínica', 'Assistente Administrativo de Saúde', 'Organizar agendas, atender pacientes e apoiar as rotinas administrativas da clínica.', 'Ensino médio, discrição e cuidado no atendimento ao público.', 1900, 2800),
    ('Educação', 'Auxiliar de Sala', 'Assistente de Secretaria Escolar', 'Apoiar a equipe escolar, organizar materiais e auxiliar nas rotinas educacionais.', 'Comunicação, organização e interesse pela área educacional.', 1900, 2900),
    ('Marketing', 'Assistente de Marketing', 'Assistente de Redes Sociais', 'Apoiar campanhas, produzir conteúdo e acompanhar indicadores de comunicação.', 'Boa escrita e conhecimentos básicos de redes sociais.', 2300, 3500),
    ('Design', 'Designer Gráfico Júnior', 'Assistente de Design Digital', 'Criar peças visuais, adaptar materiais e colaborar no desenvolvimento de projetos digitais.', 'Conhecimento de ferramentas de design e portfólio de estudos ou trabalhos.', 2500, 3800),
    ('Logística', 'Auxiliar de Logística', 'Assistente de Estoque', 'Conferir materiais, organizar estoque e acompanhar separação e expedição de pedidos.', 'Organização, atenção a detalhes e conhecimentos básicos de informática.', 2000, 3000),
    ('Serviços Gerais', 'Auxiliar de Limpeza', 'Auxiliar de Conservação', 'Realizar limpeza e conservação de ambientes, seguindo orientações de uso dos materiais.', 'Responsabilidade, organização e atenção às normas de segurança.', 1700, 2400),
    ('Alimentação', 'Auxiliar de Cozinha', 'Atendente de Restaurante', 'Apoiar o preparo e a organização de alimentos ou o atendimento no restaurante.', 'Trabalho em equipe e atenção às boas práticas de higiene.', 1800, 2700),
    ('Beleza e Estética', 'Recepcionista de Salão', 'Assistente de Salão de Beleza', 'Organizar agendamentos, receber clientes e apoiar a organização do espaço de atendimento.', 'Boa comunicação, organização e interesse pelo setor de beleza.', 1800, 2800),
    ('Engenharia', 'Assistente de Projetos', 'Auxiliar Técnico de Engenharia', 'Apoiar documentação técnica, acompanhar projetos e organizar informações da equipe.', 'Curso técnico ou graduação em andamento em área relacionada.', 2800, 4200),
    ('Outros', 'Auxiliar Operacional', 'Assistente de Apoio', 'Apoiar rotinas operacionais, organizar materiais e colaborar com diferentes setores.', 'Organização, responsabilidade e disposição para aprender.', 1800, 2700),
    ('Administrativo', 'Assistente Administrativo', 'Auxiliar de Escritório', 'Organizar documentos, atualizar planilhas e apoiar as rotinas do escritório.', 'Ensino médio e conhecimentos básicos de planilhas e informática.', 2100, 3200),
    ('Vendas', 'Consultor(a) de Vendas', 'Assistente Comercial', 'Atender clientes, apresentar soluções e acompanhar propostas comerciais.', 'Boa comunicação, negociação e interesse pela área comercial.', 2200, 3500),
    ('Administração', 'Assistente Financeiro', 'Assistente de Compras', 'Apoiar controles administrativos, organizar documentos e acompanhar processos internos.', 'Organização e conhecimentos de planilhas; formação na área será um diferencial.', 2300, 3400)
), records as (
  select
    md5('houk-demo-v1:' || c.id::text || ':' || variant.position::text)::uuid as id,
    p.id as contractor_id,
    c.id as category_id,
    '[Demonstração] ' || coalesce(
      case when variant.position = 1 then t.first_title else t.second_title end,
      case when variant.position = 1 then 'Assistente de ' else 'Auxiliar de ' end || c.name
    ) as title,
    c.name as category_name,
    coalesce(t.activities, 'Apoiar as atividades da equipe na área de ' || c.name || '.') as responsibilities,
    coalesce(t.qualifications, 'Interesse pela área, organização e disposição para aprender.') as requirements,
    coalesce(t.minimum_salary, 2000) as salary_min,
    coalesce(t.maximum_salary, 3000) as salary_max
  from public.categories c
  cross join publisher p
  cross join (values (1), (2)) as variant(position)
  left join templates t on t.category_name = c.name
  where c.active = true
)
insert into public.opportunities (
  id, contractor_id, category_id, title, description, responsibilities, requirements,
  benefits, opportunity_type, work_model, city, state, neighborhood,
  salary_min, salary_max, workload, vacancies, accepts_pcd, status, published_at, expires_at
)
select
  id, contractor_id, category_id, title,
  'VAGA DE DEMONSTRAÇÃO: este cadastro é um exemplo para explorar a plataforma HOUK e não corresponde a uma contratação real. Área: ' || category_name || '.',
  responsibilities, requirements,
  'Benefícios ilustrativos: vale-transporte e vale-refeição. Não representam uma oferta real.',
  'CLT', 'PRESENTIAL', 'Itapetininga', 'SP', 'Centro',
  salary_min, salary_max, '40 horas semanais', 1, true, 'ACTIVE', now(), now() + interval '90 days'
from records
on conflict (id) do nothing;

commit;

-- Conferência: duas vagas de demonstração por categoria ativa.
select c.name as categoria, count(o.id) as vagas_demonstracao
from public.categories c
left join public.opportunities o
  on o.category_id = c.id
  and o.id in (
    md5('houk-demo-v1:' || c.id::text || ':1')::uuid,
    md5('houk-demo-v1:' || c.id::text || ':2')::uuid
  )
where c.active = true
group by c.id, c.name
order by c.name;
