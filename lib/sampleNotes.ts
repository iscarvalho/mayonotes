// Notas de exemplo para a demo. Carregadas pelo botão "Carregar notas de exemplo"
// quando o banco está vazio.
export const SAMPLE_NOTES: string[] = [
  `# Viagem para Lisboa

- Datas: 12 a 19 de abril
- Voo: TAP, sai de Guarulhos às 22h40, chega às 11h55 (horário local)
- Hotel: Casa do Alfama, check-in a partir das 15h

## Roteiro
1. Dia 1: Alfama e Castelo de São Jorge
2. Dia 2: Belém, comer pastel no Pastéis de Belém cedo para evitar fila
3. Dia 3: bate-volta para Sintra (Palácio da Pena, comprar ingresso online)

Lembrar: levar adaptador de tomada tipo F.`,

  `# Reunião de planejamento Q3

Participantes: Ana, Bruno, Carla e eu.

## Decisões
- O lançamento do app mobile foi adiado para 15 de setembro.
- Bruno fica responsável pela migração do banco para Postgres 17.
- Orçamento de marketing do trimestre: R$ 40 mil.

## Pendências
- Carla vai mandar o levantamento de custos de infraestrutura até sexta.
- Marcar reunião com o time de design para revisar o onboarding.`,

  `# Receita: pão de fermentação natural

## Ingredientes
- 500 g de farinha (450 g branca + 50 g integral)
- 350 g de água
- 100 g de levain ativo
- 10 g de sal

## Passo a passo
1. Autólise: misture farinha e água e descanse 1 hora.
2. Adicione o levain e o sal.
3. Faça 4 dobras a cada 30 minutos.
4. Fermentação em temperatura ambiente até crescer 50%.
5. Modele e deixe na geladeira de 12 a 16 horas.
6. Asse a 250 °C por 20 min com tampa e mais 25 min sem tampa.`,

  `# Livro: Hábitos Atômicos

Autor: James Clear.

## Ideias principais
- Melhorar 1% por dia gera resultados enormes no longo prazo.
- Foque em sistemas, não em metas.
- As quatro leis: tornar óbvio, atraente, fácil e satisfatório.
- "Empilhamento de hábitos": ligar um hábito novo a um que já existe.

Minha aplicação: ler 10 páginas logo depois do café da manhã.`,

  `# Treino de corrida — meia maratona

Prova: Meia Maratona do Rio, 23 de agosto.

## Plano semanal
- Segunda: descanso
- Terça: intervalado, 6 x 800 m em ritmo de 4:50/km
- Quinta: 8 km em ritmo leve (6:00/km)
- Sábado: longão, aumentando 1 km por semana até 18 km

Meta: terminar abaixo de 2h05. Tênis novo precisa de pelo menos 50 km de amaciamento antes da prova.`,

  `# Consulta com a dermatologista

Dra. Fernanda Lima, 3 de março.

- Usar protetor solar FPS 50 todos os dias, reaplicar a cada 3 horas.
- Ácido azelaico à noite, 3 vezes por semana no começo.
- Retorno em 90 dias.
- Evitar esfoliação durante o tratamento.`,

  `# Finanças pessoais 2025

## Metas
- Reserva de emergência: 6 meses de despesas (cerca de R$ 30 mil).
- Investir 20% do salário todo mês.
- Quitar o financiamento do carro até dezembro.

## Onde está o dinheiro
- Reserva: Tesouro Selic
- Longo prazo: fundos de índice
- Cartão de crédito: sempre pagar a fatura inteira, vence dia 10.`,

  `# Estudo: como funciona RAG

RAG (Retrieval-Augmented Generation) junta busca e geração de texto.

1. Os documentos são divididos em pedaços (chunks).
2. Cada chunk vira um vetor de embedding.
3. Na pergunta, o sistema busca os chunks mais parecidos.
4. Os chunks entram no prompt e o modelo responde com base neles.

Vantagem: o modelo responde com informação atualizada e cita a fonte. Desvantagem: se a busca trouxer o trecho errado, a resposta sai errada.`,

  `# Ideias para o aniversário da Júlia

Aniversário: 7 de junho, ela faz 30 anos.

- Ela comentou que quer um curso de cerâmica.
- Restaurante favorito: Mocotó.
- Fazer um álbum de fotos da viagem para Paraty.
- Convidar os amigos da faculdade para uma surpresa no sábado seguinte.`,

  `# Configuração do ambiente de desenvolvimento

- Editor: VS Code com as extensões ESLint, Prettier e Tailwind CSS IntelliSense.
- Node.js 22 instalado via fnm.
- Terminal: zsh com Starship.
- Atalho para abrir o projeto: \`code .\`

## Git
\`\`\`
git config --global pull.rebase true
git config --global init.defaultBranch main
\`\`\``,

  `# Manutenção do carro

Carro: Onix 2021.

- Última troca de óleo: 15 de janeiro, com 42.300 km.
- Próxima troca: com 52.300 km ou em julho, o que vier primeiro.
- Pneus trocados em novembro do ano passado.
- Seguro vence em 28 de setembro, renovar com antecedência.`,

  `# Aula de inglês — phrasal verbs

- **give up**: desistir
- **look forward to**: estar ansioso por (no bom sentido)
- **run out of**: ficar sem algo
- **figure out**: descobrir, entender
- **put off**: adiar

Exercício para a próxima aula: escrever 5 frases usando cada um.`,

  `# Horta na varanda

- Manjericão: rega todo dia no verão, precisa de pelo menos 4 horas de sol.
- Alecrim: gosta de solo seco, regar só quando a terra estiver seca.
- Tomate-cereja: plantado em 10 de fevereiro, colocar tutor quando passar de 30 cm.
- Adubo orgânico (húmus de minhoca) uma vez por mês.`,

  `# Retrospectiva da sprint 14

## O que foi bem
- Entregamos a busca nova sem bugs críticos.
- Pareamento entre front e back acelerou as revisões.

## O que pode melhorar
- Muitas tarefas entraram no meio da sprint.
- Deploys de sexta causaram estresse.

## Ações
- Congelar o escopo depois do planejamento.
- Não fazer deploy em produção depois das 16h de sexta.`,

  `# Filmes para assistir

- Central do Brasil (Walter Salles)
- Cidade de Deus
- Ainda Estou Aqui, recomendação da Júlia
- Parasita
- A Viagem de Chihiro

Já vi e recomendo: O Auto da Compadecida.`,

  `# Mudança de apartamento

Data prevista: 1º de outubro.

## Checklist
- Avisar o proprietário com 30 dias de antecedência (até 1º de setembro).
- Transferir internet e energia para o novo endereço.
- Orçamento de mudança: três empresas, a mais barata cobrou R$ 1.800.
- Atualizar o endereço no banco e na Receita Federal.`,

  `# Estudo: Postgres e índices

- **B-tree**: o padrão, bom para igualdade e intervalos.
- **GIN**: bom para busca em texto completo (tsvector) e arrays.
- **HNSW / IVFFlat** (pgvector): busca aproximada de vetores.

Dica: usar \`EXPLAIN ANALYZE\` para ver se a consulta usa o índice. Índice demais deixa a escrita lenta.`,

  `# Receita: moqueca baiana

Serve 4 pessoas.

- 800 g de peixe firme (robalo ou badejo) em postas
- 1 vidro de leite de coco
- 3 colheres de azeite de dendê
- Pimentões vermelho e amarelo, tomate e cebola em rodelas
- Coentro a gosto

Marinar o peixe com limão, alho e sal por 30 minutos. Montar em camadas na panela de barro e cozinhar por 20 minutos sem mexer.`,

  `# Metas de leitura do ano

Meta: 24 livros (2 por mês).

## Lidos
1. Hábitos Atômicos
2. Torto Arado (Itamar Vieira Junior)
3. Sapiens

## Próximos
- O Programador Pragmático
- Designing Data-Intensive Applications
- Grande Sertão: Veredas`,

  `# Entrevista de emprego — Empresa X

Data: 18 de março, 14h, por vídeo.

- Vaga: desenvolvedor front-end pleno.
- Entrevistadora: Marina, tech lead.
- Estudar: performance em React, acessibilidade, testes.
- Perguntas para fazer: como é o processo de code review? O time trabalha remoto?

Retorno prometido em até uma semana.`,
];
