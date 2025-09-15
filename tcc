\documentclass[
	% -- opções da classe memoir --
	12pt,				% tamanho da fonte
	openright,			% capítulos começam em pág ímpar (insere página vazia caso preciso)
	oneside,			% para impressão em frente e verso. Oposto a oneside
	a4paper,			% tamanho do papel.
	% -- opções da classe abntex2 --
	chapter=TITLE,		% títulos de capítulos convertidos em letras maiúsculas
	section=TITLE,		% títulos de seções convertidos em letras maiúsculas
	subsection=TITLE,	% títulos de subseções convertidos em letras maiúsculas
	subsubsection=TITLE,% títulos de subsubseções convertidos em letras maiúsculas
	% -- opções do pacote babel --
	english,			% idioma adicional para hifenização
	brazil				% o último idioma é o principal do documento
	]{abntex2}


% ---
% Pacotes básicos 
% ---
%\usepackage{lmodern}			% Usa a fonte Latin Modern
\usepackage{mathptmx}			% Usa a fonte Times New Roman
%\usepackage{helvet}			% Fonte Parecida com Arial
\usepackage[T1]{fontenc}		% Selecao de codigos de fonte.
\usepackage[utf8]{inputenc}		% Codificacao do documento (conversão automática dos acentos)
\usepackage{lastpage}			% Usado pela Ficha catalográfica
\usepackage{indentfirst}			% Indenta o primeiro parágrafo de cada seção.
\usepackage{color}				% Controle das cores
\usepackage{graphicx}			% Inclusão de gráficos
\usepackage{subcaption}			% Inclusão de gráficos lado a lado
\usepackage{microtype} 			% para melhorias de justificação
\usepackage{tabularx,ragged2e}	% Para inserir tabelas
\usepackage{multirow}			% Para mesclar células
\usepackage[dvipsnames,table,xcdraw]{xcolor}		% Permite adicionar cores nas linhas de tabelas
\usepackage{fancyvrb}			% Permite adicionar arquivos de texto
\usepackage[portuguese, ruled, linesnumbered]{algorithm2e} % Uso de algoritmos
\usepackage{amsfonts}			% Permite usar notação de conjuntos
\usepackage{amsmath}			% Permite citar equações
\usepackage{amsthm}				% Permite criar teoremas e experimentos
\usepackage[font={bf, small}, labelsep=endash, labelfont=bf]{caption}	% Faz legenda de figuras ficarem em negrito
\usepackage{cancel}				% Permite fazer expressão tendendo a zero
\usepackage{epstopdf}			% Converte eps para pdf
\usepackage[final]{pdfpages}
\usepackage{hyphenat}
\usepackage{fancyhdr}
\usepackage{longtable}
\usepackage{graphicx}

\newcolumntype{L}{>{\RaggedRight\arraybackslash}X}
% ---
		
% ---
% Pacotes adicionais, usados apenas no âmbito do Modelo Canônico do abnteX2
% ---
\usepackage{lipsum}				% para geração de dummy text
% ---

% ---
% Pacotes de citações
% ---
%\usepackage[brazilian,hyperpageref]{backref}	 % Paginas com as citações na bibl
\usepackage[alf, abnt-emphasize=bf]{abntex2cite}	% Citações padrão ABNT

% ---
% Customizações para o layout da UFPA
% ---
\usepackage{modelo-ufpa/ufpa}

\tolerance=1
\emergencystretch=\maxdimen
\hyphenpenalty=10000
\hbadness=10000
\hyphenchar\font=-1
\sloppy
\renewcommand{\ABNTEXchapterfontsize}{\normalsize}
\renewcommand{\ABNTEXsectionfontsize}{\normalsize}
\renewcommand{\ABNTEXsubsectionfontsize}{\normalsize}
\renewcommand{\ABNTEXsectionfont}{}
\renewcommand{\ABNTEXsubsectionfont}{}

\renewcommand{\chaptername}{ }
%\renewcommand{\familydefault}{\sfdefault} % usar apenas se usar a fonte helvet

% Muda o título de lista de ilustrações para lista de figuras
\addto\captionsbrazil{%
  \renewcommand{\listfigurename}%
    {Lista de Ilustrações}%
	\renewcommand{\listtablename}%
    {Lista de Tabelas}%
}

\fancypagestyle{ultima}{
\fancyhead{}
\fancyfoot{}
\rhead{\thepage}
}

% Permite utilizar figuras sem precisar colocar o caminho absoluto
\graphicspath{{imagens/}}

% Define o ambiente de experimentos
\theoremstyle{definition}
\newtheorem{experimento}{Experimento}[section]
\newcommand{\experimentoautorefname}{Experimento}

% --- 
% CONFIGURAÇÕES DE PACOTES
% --- 

% ---
% Configurações do pacote backref
% Usado sem a opção hyperpageref de backref
%\renewcommand{\backrefpagesname}{Citado na(s) página(s):~}
% Texto padrão antes do número das páginas
%\renewcommand{\backref}{}
% Define os textos da citação
%\renewcommand*{\backrefalt}[4]{
%	\ifcase #1 %
%		Nenhuma citação no texto.%
%	\or
%		Citado na página #2.%
%	\else
%		Citado #1 vezes nas páginas #2.%
%	\fi}%
% ---

% ---
% Informações de dados para CAPA, FOLHA DE ROSTO e FICHA CATALOGRÁFICA
% ---
\universidade{CENTRO UNIVERSITÁRIO SERRA DOS ÓRGÃOS - UNIFESO}
\instituto{CENTRO DE CIÊNCIA E TECNOLOGIA - CCT}
\curso{CURSO DE BACHARELADO EM CIÊNCIA DA COMPUTAÇÃO}
\titulo{RPG Como recurso para promover a valorização cultural em ambientes educativos}
\autor{Nathan de Brito Oliveira}
\local{TERESÓPOLIS}
\data{2025}
\orientador{Prof. Chessman Kennedy Faria Corrêa}
\tipotrabalho{Monografia}
\preambulo{Trabalho de Conclusão de Curso apresentado ao Centro Universitário Serra dos Órgãos como requisito obrigatório para obtenção do título de Bacharel em Ciência da Computação.}
\sobrenome{de Brito Oliveira}
\nome{Nathan}% APENAS O PRIMEIRO NOME SEM SOBRENOME
\palavraschave{%
PALAVRA-CHAVE1,
PALAVRA-CHAVE2,
PALAVRA-CHAVE3.
}

\datadadefesa{Data da Defesa: 28 de Novembro de 2025}% PREENCHER COM O DATA DA DEFESA}
%\conceito{Conceito: Excelente}
\faculdadedoorientador{FACULDADE DO ORIENTADOR} %
\titulacaodoorientador{MSc}%Coloque abreviado a titulação do seu Orientador
\primeiromembrodabanca{NOME DO PRIMEIRO MEMBRO DA BANCA}
\titulacaodoprimeiromembro{DSc}
\faculdadedoprimeiromembrodabanca{FACULDADE DO PRIMEIRO MEMBRO DA BANCA}
\segundomembrodabanca{NOME DO SEGUNDO MEMBRO DA BANCA}
\titulacaodosegundomembro{DSc}
\faculdadedosegundomembrodabanca{FACULDADE DO SEGUNDO MEMBRO DA BANCA}
% ---

% ---
% Configurações de aparência do PDF final

% alterando o aspecto da cor azul
\definecolor{blue}{RGB}{41,5,195}

% informações do PDF

\makeatletter
\hypersetup{
     	%pagebackref=true,
		pdftitle={\imprimirtitulo}, 
		pdfauthor={\imprimirautor},
    	pdfsubject={\imprimirpreambulo},
	    pdfcreator={LaTeX with abnTeX2},
		pdfkeywords={\imprimirpalavraschave}, 
		colorlinks=true,       		% false: boxed links; true: colored links
    	linkcolor=black,          	% color of internal links
    	citecolor=black,        		% color of links to bibliography
    	filecolor=magenta,      		% color of file links
		urlcolor=black,
		bookmarksdepth=4,
        breaklinks=true
}
\makeatother


% --- 

% --- 
% Espaçamentos entre linhas e parágrafos 
% --- 

% O tamanho do parágrafo é dado por:
\setlength{\parindent}{1.5cm}

% Controle do espaçamento entre um parágrafo e outro:
\setlength{\parskip}{0.2cm}  % tente também \onelineskip

% ---
% compila o indice
% ---
\makeindex
% ---

% ----
% Início do documento
% ----
\begin{document}

\nocite{Vrs:2025}
% Seleciona o idioma do documento (conforme pacotes do babel)
%\selectlanguage{english}
\selectlanguage{brazil}

% Retira espaço extra obsoleto entre as frases.
\frenchspacing 


% ----------------------------------------------------------
% ELEMENTOS PRÉ-TEXTUAIS
% ----------------------------------------------------------
% \pretextual

% ---
% Capa
% ---
\imprimircapa
% ---

% ---
% Folha de rosto
% ---
\imprimirfolhaderosto
% ---

% ---
% Inserir a ficha bibliografica
% ---
% A biblioteca da universidade lhe fornecerá um PDF
% com a ficha catalográfica definitiva após a defesa do trabalho. Quando estiver
% com o documento, salve-o como PDF no diretório do seu projeto e substitua todo
% o conteúdo de implementação deste arquivo pelo comando abaixo:

%\begin{fichacatalografica}
%    \includepdf{fichacatalografica.pdf}
%\end{fichacatalografica}


\newpage
% ---
% ---

% ---
% Inserir folha de aprovação
% ---
%
\begin{folhadeaprovacao}
\imprimirfolhadeaprovacao
\end{folhadeaprovacao}


% ---

% ---
% Dedicatória
% ---

% ESCREVA A SUA DEDICATORIA A DEDICATORIA QUE SE ENCONTRA NO ARQUIVO E APENAS UM EXEMPLO. ESCOLHA A DEDICATORIA QUE MAIS LHE AGRADAR. LEMBRE-SE DE UTILIZAR AS '\\' PARA PULAR LINHAS

\begin{dedicatoria}
   \vspace*{\fill}
   \flushright
   %\noindent
   \textit{Este trabalho é dedicado às crianças adultas que,\\
   quando pequenas, sonharam em se tornar cientistas. \\
   - Lauro César em abnTeX2}
\end{dedicatoria}
% ---

% ---
% Agradecimentos
% ---
\begin{agradecimentos}

Agradeço, em primeiro lugar, aos meus pais, que sempre trabalharam incansavelmente para me proporcionar a oportunidade de cursar uma faculdade. Sem o esforço e o apoio deles, nada disso teria sido possível.

Agradeço também ao meu orientador, professor Chessman Kennedy, pelos ensinamentos, conselhos e conversas que me ajudaram a compreender melhor o tema e seguir com confiança durante todo o processo.

Meu sincero agradecimento à Estela, uma grande amiga que esteve ao meu lado durante toda a construção deste trabalho, contribuindo não apenas com ideias e revisões, mas também com apoio constante desde a escolha do tema.

Por fim, agradeço aos meus colegas de classe, que estiveram comigo desde o início desta longa jornada acadêmica, compartilhando desafios, aprendizados e conquistas. Todos vocês fazem parte da pessoa que eu sou hoje e sem vocês, não teria sido a mesma coisa.

Revisar posteriormente.

\end{agradecimentos}
% ---

% ---
% Epígrafe
% ---

% ESCREVA A SUA EPÍGRAFE A MESMA QUE SE ENCONTRA NO ARQUIVO E APENAS UM EXEMPLO. ESCOLHA A EPÍGRAFE QUE MAIS LHE AGRADAR. LEMBRE-SE DE UTILIZAR AS '\\' PARA PULAR LINHAS

\begin{epigrafe}
    \vspace*{\fill}
	\begin{flushright}
		\textit{``Que todos os nossos esforços estejam sempre focados no desafio à impossibilidade.\\ Todas as grandes conquistas humanas vieram daquilo que parecia impossível.''\\
		(Charles Chaplin)}
	\end{flushright}
\end{epigrafe}
% ---

% ---
% RESUMOS
% ---


% ---

% ---
% inserir lista de ilustrações
% ---
% UTILIZE CASO HAJA FIGURAS NA MONOGRAFIAS. EM QUASO DE AUSENCIA DE FIGURAS COMENTAR COM AS 3 LINHAS DE CODIGOS UTILIZANDO O '%'.
\pdfbookmark[0]{\listfigurename}{lof}
\listoffigures*
\cleardoublepage
% ---

% ---
% inserir lista de quadros
% ---
% UTILIZE CASO HAJA QUADROS NA MONOGRAFIAS. EM QUASO DE AUSENCIA DE QUADROS COMENTAR COM AS 3 LINHAS DE CODIGOS UTILIZANDO O '%'.

\pdfbookmark[0]{\listofquadrosname}{loq}
\listofquadros*
\cleardoublepage
% ---

% ---
% inserir lista de tabelas
% ---

% UTILIZE QUASE HAJA TABELAS NA MONOGRAFIAS. EM QUASO DE AUSENCIA DE TABELAS COMENTAR COM AS 3 LINHAS DE CODIGOS UTILIZANDO O '%'.

\pdfbookmark[0]{\listtablename}{lot}
\listoftables*
\cleardoublepage
% ---

% ---
% inserir lista de algoritmos
% ---

% UTILIZE CASO HAJA ALGORITMOS NA MONOGRAFIAS. EM QUASO DE AUSENCIA DE ALGORITMOS COMENTAR COM AS 3 LINHAS DE CODIGOS UTILIZANDO O '%'.

\pdfbookmark[0]{\listalgorithmcfname}{loa}
\imprimirlistadealgoritmos
\cleardoublepage
% ---

% ---
% inserir lista de abreviaturas e siglas
% ---
% DEVE SER PREENCHIDA A MÃO LEMBRE-SE DE MANTER EM ORDEM ALFABETICA.
\begin{siglas}
  \item[ABNT] Associação Brasileira de Normas Técnicas
\end{siglas}
% ---

% ---
% inserir lista de símbolos
% ---
% DEVE SER PREENCHIDA A MÃO LEMBRE-SE DE MANTER EM ORDEM ALFABETICA.
\begin{simbolos}
  \item[$ \theta $] Letra grega maiúscula theta
\end{simbolos}
% ---

% resumo em português
\setlength{\absparsep}{18pt} % ajusta o espaçamento dos parágrafos do resumo
\begin{resumo}

Escreva aqui o resumo do seu trabalho. Lembre-se escreva o resumo por ultimo na monografia. 

 \textbf{Palavras-chave}: \imprimirpalavraschave
\end{resumo}

% resumo em inglês
\begin{resumo}[Abstract]
 \begin{otherlanguage*}{english}
   Escreva aqui o seu abstract (Resumo em inglês)

   \vspace{\onelineskip}
 
   \noindent 
   \textbf{Keywords}: Keywords1. Keywords2. Keywords3.
 \end{otherlanguage*}
\end{resumo}

% ---
% inserir o sumario
% ---
\pdfbookmark[0]{\contentsname}{toc}
\tableofcontents*
\cleardoublepage
% ---



% ----------------------------------------------------------
% ELEMENTOS TEXTUAIS
% ----------------------------------------------------------
\textual
\pagestyle{simple}

% ----------------------------------------------------------
% Introdução
% ----------------------------------------------------------
\chapter{Introdução}
\textit{Role-Playing Game} (RPG) pode ser entendido como um jogo de interpretação. De maneira geral, é uma atividade na qual os jogadores assumem papéis fictícios e interagem entre si em uma história, seguindo regras previamente combinadas. Com o passar dos anos, o RPG deixou de ser apenas um jogo e passou a ganhar espaço na área da educação, especialmente em áreas como a Pedagogia, sendo visto como uma ferramenta que pode contribuir para o processo de ensino (Saldanha, 2009, p.701).

Por meio dessa ferramenta, é possível trabalhar em habilidades como a criatividade, comunicação, cooperação e resolução de problemas. Essas atividades favorecem o desenvolvimento de competências importantes nas áreas acadêmicas e profissionais, como saber se expressar em público e se adaptar a diferentes situações. Estimular essas habilidades em crianças e adolescentes pode fazer uma grande diferença no futuro, pois abre um espaço para aprendizado mais colaborativo, que vai além do conteúdo tradicional.

\subsection{Como utilizar o RPG de mesa como uma ferramenta pedagógica}
A implementação do RPG de mesa como uma ferramenta pedagógica, não exige um alto custo, uma vez que essa ferramenta utiliza regras criadas previamente e na imaginação dos participantes. Isso significa que é possível iniciar essa atividade com poucos recursos. Essa simplicidade torna mais acessível e eficaz o processo de ensino, especialmente no campo de valorização cultural. Através da criação de personagens e situações com elementos da cultura nacional ou local, as crianças e adolescentes podem aprender sobre tradições e história de forma interativa.

Considerando a estrutura deste trabalho, o objetivo geral é analisar como o RPG pode ser uma ferramenta eficaz na valorização e no ensino da cultura. Para isso, o trabalho foi organizado para conduzir o leitor por todo o raciocínio necessário ao entendimento desse potencial do RPG. Os objetivos específicos são apresentar a implementação da proposta, detalhando a metodologia utilizada, incluindo as fontes dos dados, os procedimentos adotados, as análises realizadas, mostrar exemplos práticos da aplicação do método, expor os resultados obtidos com foco nas observações e nos impactos percebidos, promover uma reflexão relacionando teoria e prática reconhecendo as limitações da proposta e propor caminhos possíveis para investigações futuras.

O segundo capítulo aborda como a proposta foi implementada, detalhando a metodologia utilizada, incluindo as fontes dos dados, os procedimentos adotados, as análises realizadas e exemplos práticos. No terceiro capítulo, são apresentados os resultados obtidos a partir da aplicação do método, com foco nas observações e nos impactos percebidos. O quarto capítulo promove uma reflexão mais profunda sobre esses resultados, relacionando a teoria à prática e reconhecendo as limitações da proposta. Por fim, a conclusão retoma as principais contribuições da pesquisa e propõe caminhos possíveis para investigações futuras.


\chapter{FUNDAMENTAÇÃO TEÓRICA}
Neste capítulo, serão apresentados conceitos essenciais para o entendimento do que é
abordado mais à frente no trabalho.

\section{Metodologias Ativas e Game-Based Learning}

O ensino tradicional, focado na transmissão de via única de conhecimento do professor para o aluno, tem sido amplamente questionado nas últimas décadas. Em contrapartida, as chamadas metodologias ativas têm ganhado destaque por proporcionarem abordagens mais participativas, nas quais o estudante se torna protagonista do próprio processo de aprendizagem. Entre essas metodologias, destaca-se o Game-Based Learning (GBL), ou Aprendizado Baseado em Jogos, que utiliza jogos como meio para alcançar objetivos educacionais específicos.

Segundo Amorim et al. (2016), o uso de jogos digitais no ensino médio-técnico favorece o engajamento dos alunos, promovendo a resolução de problemas, o pensamento crítico, a colaboração e o desenvolvimento de habilidades interpessoais. Ao inserir o estudante em situações recreativas com objetivos pedagógicos claros, o aprendizado baseado em jogos (GBL) permite a construção significativa do conhecimento.

Ao contrário da gamificação, que utiliza aspectos como pontuação e recompensas em tarefas comuns, o GBL parte do princípio de que o jogo em si é o recurso didático central, sendo estruturado com objetivos de aprendizagem bem definidos (CARVALHO, 2015). Essa estratégia tem se mostrado eficaz especialmente em contextos onde há necessidade de estimular a motivação, a criatividade e a autonomia dos alunos.

Dentre os jogos com maior potencial educativo está o Role-Playing Game (RPG). Por envolver interpretação, narrativa colaborativa, resolução de desafios e construção conjunta de histórias, o RPG de mesa oferece um ambiente dinâmico e fértil para aplicação do GBL, especialmente no ensino interdisciplinar e na valorização da cultura.


\section{O QUE É RPG?}

Role-Playing Game (RPG), ou jogo de interpretação de papéis, é um estilo de jogo onde um grupo de pessoas se reúne para criar histórias de forma colaborativa, assumindo papéis fictícios dentro de uma narrativa. Esse tipo de jogo surgiu nos Estados Unidos em 1971, com a criação do The Fantasy Game, que foi rebatizado em 1974 como Dungeons and Dragons (DnD) — traduzido como “Masmorras e Dragões”. O DnD continua sendo jogado até hoje e é um RPG com temática de fantasia medieval, fortemente inspirado nos romances O Hobbit e O Senhor dos Anéis (BRASIL ESCOLA, 2024).

O RPG de mesa funciona a partir de regras pré-estabelecidas, normalmente registradas em livros, que definem como o mundo será jogado. Um dos participantes assume o papel de mestre, responsável por narrar e controlar o universo ao redor dos personagens. Cabe a ele criar a base da história que é chamada de “aventura” na qual os demais jogadores introduzem seus personagens. Quando essa narrativa se estende por várias sessões, ela passa a ser chamada de “campanha”. Os livros de RPG geralmente trazem não apenas as regras, mas também cenários prontos que ajudam a contextualizar a ambientação. Isso facilita a criação de personagens que façam sentido dentro daquele universo, como é o caso de Dungeons and Dragons, com sua ambientação medieval fantástica, ou Ordem Paranormal RPG, um sistema nacional ambientado nos tempos atuais, com foco em terror e suspense.

\section{Formas de se jogar RPG}
Com a popularização da internet, novas formas de jogar RPG começaram a se espalhar. Inicialmente, o RPG de mesa era praticado exclusivamente de forma presencial, com todos os participantes reunidos em um mesmo espaço. No entanto, o avanço das tecnologias de comunicação permitiu o surgimento de encontros remotos, no qual toda a experiência ocorre à distância, por meio de plataformas digitais. Essa flexibilização contribuiu para tornar o RPG mais acessível, permitindo que grupos joguem mesmo estando em diferentes localidades.

\subsection{Presencial}
O RPG de forma presencial é a maneira mais tradicional de se jogar, embora muitos jogadores que começaram durante o período da pandemia nunca tenham experimentado esse formato. Jogar presencialmente vai além de estar fisicamente no mesmo ambiente, trata-se também de um espaço de convivência, onde o grupo compartilha momentos de diversão e interação social além das regras do jogo. Mesmo com o avanço da tecnologia, que substituiu elementos como fichas físicas por aplicativos, o RPG presencial continua sendo uma forma amplamente utilizada, especialmente por jogadores que valorizam o contato direto e a imersão proporcionada pela mesa de jogo (JAMBÔ EDITORA, 2020).

\subsection{Remoto}
A modalidade de RPG que mais cresceu durante a pandemia foi o RPG remoto, um formato que permanece em expansão até os dias atuais. Muitos grupos que anteriormente jogavam presencialmente passaram a adotar o formato online para dar continuidade às suas campanhas. Essa mudança também abriu espaço para a entrada de novos jogadores, que puderam acessar mesas de RPG mesmo sem sair de casa. Jogar remotamente exige os mesmos elementos de uma mesa tradicional, como grupo, livro de regras, fichas e narrativa, com a diferença de que a comunicação ocorre por meio de chamadas de áudio ou vídeo em plataformas como o Discord, Google Meet ou Roll20. Algumas dessas plataformas, como o próprio Discord, contam com ferramentas desenvolvidas especificamente para facilitar as mesas, permitindo a realização de sessões ou campanhas inteiras no ambiente digital (JAMBÔ EDITORA, 2020).

\subsection{Guilda}
Embora não tenha sido citada nas categorias acima, a forma de jogar RPG por meio de guildas ainda é bastante utilizada, especialmente em ambientes remotos. Essa modalidade ocorre à distância na maior parte das situações, mas apresenta diferenças importantes. Para participar de uma guilda, é necessário fazer parte de uma comunidade maior, composta por diversos jogadores e mestres que compartilham o mesmo universo narrativo. Cada jogador possui seu próprio personagem, e os mestres criam histórias curtas, chamadas de missões ou one-shots, que são jogadas por quem estiver disponível na data e horário propostos.

As guildas funcionam com base em regras próprias, que muitas vezes adaptam o sistema original para melhor atender à dinâmica de grupos numerosos. Um dos principais diferenciais dessa modalidade é a flexibilidade: não é necessário que todos os integrantes estejam presentes em todas as sessões, o que permite encaixar as aventuras de acordo com a disponibilidade de cada um. Os personagens evoluem à medida que participam das sessões, acumulando recompensas, itens e desenvolvimento narrativo, o que mantém o engajamento contínuo dos participantes (JAMBÔ EDITORA, 2020).

\section{O que é necessário para jogar RPG de mesa?}
Para jogar RPG, é necessário mais do que apenas regras e personagens, se trata de uma atividade que envolve imaginação, cooperação, estrutura narrativa e ferramentas específicas, que variam conforme o sistema que for jogado.

\subsection{Grupo de Jogadores e o Mestre}

O elemento mais essencial para uma partida de RPG é o grupo de participantes. De modo geral, uma mesa de RPG é composta por:

\begin{itemize}
\item \textbf{Jogadores}: cada jogador interpreta um personagem fictício dentro da história. Eles decidem as ações de seus personagens, interagem com o mundo criado pelo mestre e colaboram para o desenrolar da narrativa.
\item \textbf{Mestre (ou narrador)}: é o responsável por conduzir a história, apresentar os desafios, interpretar os personagens não-jogadores (NPCs) e manter o andamento da narrativa. Também é o responsável por aplicar as regras e resolver conflitos durante a sessão.
\end{itemize}

Segundo Dias (2020), o papel do mestre é fundamental para manter a coesão da história e garantir que as regras funcionem de forma justa e consistente. Ele age como árbitro e contador de histórias, guiando os jogadores por mundos imaginários com liberdade e estrutura.

\subsection{Sistema de Regras}

Todo RPG de mesa precisa de um conjunto de regras que define como o mundo funciona, como as ações dos personagens são resolvidas e como os resultados afetam a narrativa. Esse conjunto de regras é conhecido como sistema.

Existem diversos sistemas de RPG, como:

\begin{itemize}
\item \textbf{Dungeons and Dragons (DnD)} – ambientado em fantasia medieval.
\item \textbf{Ordem Paranormal RPG} – ambientado no mundo atual com elementos sobrenaturais.
\item \textbf{Tormenta20} - ambientado também em fantasia medieval porém com algumas modificações do sistema de DnD.
\item \textbf{Vampiro A Máscara} - Um RPG que pode ser utilizado em qualquer data, porém trata de uma fantasia de vampiros.
\end{itemize}

Cada sistema possui seus próprios livros e manuais que explicam como construir personagens, rolar dados, resolver combates, realizar ações sociais, explorar cenários e muito mais.

\subsection{Fichas de Personagem}

As fichas são documentos (digitais ou físicos) que registram todas as informações dos personagens dos jogadores. Elas contêm:

\begin{itemize}
\item Nome, idade, aparência e histórico do personagem.
\item Habilidades, perícias e atributos (força, inteligência, carisma, etc.).
\item Equipamentos, magias, poderes ou habilidades especiais.
\item Pontos de vida, sanidade, energia ou outros recursos do sistema.
\end{itemize}

A ficha é uma ferramenta fundamental para acompanhar a evolução dos personagens e registrar mudanças ao longo da campanha (CAMPOS, 2021).

\subsection{Dados e Sorte}

Grande parte das ações em RPG são resolvidas por meio de dados de diversos lados diferentes, sendo o mais comum o dado com vinte lados diferentes, especialmente em sistemas como DnD e Ordem Paranormal.

A rolagem de dados adiciona um elemento de aleatoriedade nas decisões, o que torna o jogo mais dinâmico e imprevisível. Ela representa a chance, o risco e o acaso dentro das ações dos personagens.

\subsection{Narrativa e Imaginação}

Um dos elementos importantes do RPG de mesa é a construção coletiva de uma história. A narrativa é moldada tanto pelo mestre quanto pelas decisões dos jogadores, que devem agir de acordo com a personalidade, motivações e limitações de seus personagens.

O RPG é uma experiência narrativa interativa, onde a criatividade e a interpretação têm tanto peso quanto os dados e as regras".

\subsection{Materiais de Apoio}

Além dos itens básicos já mencionados, é comum o uso de materiais de apoio, como:
\begin{itemize}
\item Miniaturas e mapas dinâmicos para representar combates.
\item Aplicativos de ficha (como o Beyond ou o C.R.I.S.).
\item Música ambiente e imagens para criar imersão narrativa.
\end{itemize}

\section{Utilização de RPG de Mesa em ambientes escolares}
Em busca de estratégias inovadoras para o processo de ensino de crianças e adolescentes durante suas trajetórias escolares, alguns professores passaram a implementar o RPG como uma ferramenta de ensino em suas salas de aula. Segundo a jornalista Soares (2022), o professor Tiago Dias, utilizou o RPG como uma ferramenta de ensino para a matemática. Seu objetivo era tornar o aprendizado mais acessível e divertido, utilizando da forma que o jogo funciona, aplicando conceitos matemáticos para ensinar seus alunos que tinham dificuldade. No entanto, é reconhecível que não são todos os alunos que se interessam por essa metodologia de ensino, sua abordagem foi criar uma aula extra, fora do horário acadêmico para aqueles que demonstraram interesse em participar. O projeto apresentou resultados positivos, segundo o professor, que notou um maior envolvimento por parte dos alunos durante atividades. Foi relatado que, para continuarem a história, os participantes precisavam dividir uma quantidade de moedas, eles definiram isso com apenas raciocínio lógico, sem ajuda do professor. Essa experiência demonstrou que é possível aprender de maneira significativa por meio de jogos interativos, permitindo utilizar algo que foi ensinado em um jogo para situações da vida cotidiana.



\begin{figure}[!h]
\centering
\caption{Escreva aqui o titulo da sua figura}
\includegraphics [scale=0.5]{UNIFESO.png} %coloque suas figuras na pasta imagem e mude o nome do aqui nessa parte. utilize o comando scale para alterar a escala da imagem
\legend{Fonte: \citeauthoronline{unifeso:2025}, \citeyear{unifeso:2025}}
\label{unifeso} % a escreva o nome qualquer a sua figura. Esse nome sera usado para referenciar a figura com o comando \ref{unifeso}
\end{figure}

Utilize o comando \ref{unifeso} para referenciar as suas Figuras.
exemplo: Figura \ref{unifeso}.


\chapter{METODOLOGIA E DESENVOLVIMENTO}

Neste capítulo são apresentados os procedimentos usados e o processo de criação da proposta desenvolvida neste trabalho. O objetivo é mostrar de forma clara as etapas que guiaram a pesquisa e a aplicação do RPG como recurso pedagógico voltado para a valorização cultural em ambientes de ensino.

Serão explicados os métodos de pesquisa escolhidos, as ferramentas utilizadas, os critérios de seleção do material, além do planejamento e da execução da proposta. Também são descritos os passos que levaram à construção prática da atividade de RPG dentro do contexto educacional, permitindo a análise dos resultados obtidos.

\section{Tipo de Pesquisa}

A pesquisa realizada é de caráter qualitativo e exploratório, pois busca analisar o uso do RPG em ambientes educativos e entender seus efeitos na aprendizagem e no envolvimento dos alunos. Este trabalho procura investigar as possibilidades de aplicação dessa prática pedagógica e levantar ideias que possam servir de base para pesquisas futuras mais aprofundadas.

\section{Público-Alvo}

Para definir bem quem vai participar do estudo, é importante considerar:

\begin{itemize}
    \item Faixa etária: crianças e adolescentes, por exemplo entre ~ 8 a 17 anos. Esse grupo normalmente está em fases de desenvolvimento cognitivo, social e moral importantes, quando atividades que estimulam imaginação, argumentação, trabalho em grupo têm mais efeito.
    \item Contexto cultural: importante selecionar participantes cujos contextos culturais permitam ou beneficiem a valorização cultural. Se forem alunos de comunidades com forte identidade local, línguas ou tradições específicas, isso pode enriquecer o RPG, incorporando elementos culturais significativos.
    \item Habilidades socioemocionais: crianças e adolescentes em desenvolvimento de habilidades de cooperação, criatividade, argumentação, empatia, etc., que são potencializadas por atividades como RPG que envolvem interação, conflito fictício, tomada de decisões.
\end{itemize}

\section{Procedimentos Metodológicos}

A aplicação do RPG como recurso pedagógico foi organizada conforme as etapas abaixo, de maneira a permitir observação sistemática, registro de dados e reflexão sobre os efeitos culturais e educacionais da atividade.

\subsection{Preparação do Cenário e do Sistema}

Como o público-alvo são crianças e adolescentes, não foi adotado um sistema complexo, pois isso poderia gerar desinteresse ou frustração entre os participantes. Por isso, foi desenvolvido um sistema de regras simples, no qual cada jogador assume o papel de um personagem inserido na história do Brasil. O Mestre define o contexto geral do mundo narrativo (época histórica, lugar, elementos culturais), e os jogadores têm liberdade para decidir ações, conduzir o enredo e interagir conforme suas escolhas dentro desse cenário.

Como exemplo prático dessa proposta, é disponibilizada uma mesa de RPG completa, com fichas prontas de personagens históricos brasileiros, para introduzir os alunos ao sistema e mostrar como ele funciona. A aventura inicial conta a história de como surgiu o Carnaval no Brasil, de forma acessível e interessante.

O objetivo dessa sessão é duplo:

\begin{itemize}

\item  Apresentar a origem do Carnaval: mostrar como esse importante elemento cultural se desenvolveu, quais influências (portuguesas, africanas, indígenas) contribuíram, e como práticas festivas foram se transformando ao longo do tempo.

\item Despertar identificação cultural: inserir elementos que façam com que crianças e adolescentes reconheçam partes da própria cultura ou da cultura local, valorizando saberes, tradições, mitos, ritmos e símbolos que lhes sejam próximos.

\item Elaboração de materiais de apoio: fichas de personagem adaptadas, mapas ou ilustrações locais, regras simplificadas, guias para o mestre, se necessário material visual ou sonoro que ajude a ambientar culturalmente o cenário.

\end{itemize}

\subsection{Formação dos Grupos}

Não existe um limite fixo para a quantidade de pessoas em uma sessão de RPG, mas o mais comum é reunir de 3 a 6 jogadores. Esse número costuma ser ideal, pois permite interações equilibradas, cooperação entre os participantes e garante que todos tenham espaço para contribuir ativamente com a narrativa.

O mestre, responsável por conduzir a história, deve se preparar com antecedência. Além de selecionar os participantes, cabe a ele explicar claramente as regras, o funcionamento do sistema e a duração estimada das sessões. Também é importante evitar que o jogo perca o caráter de diversão e se torne uma obrigação. Para isso, o mestre deve prezar sempre pela clareza, organização e, sobretudo, pelo respeito entre todos os envolvidos.

\subsection{Construção dos Personagens}
Cada integrante deve selecionar um personagem previamente definido pelo mestre para participar da sessão. O próprio sistema disponibiliza fichas pré-prontas, que funcionam como exemplos práticos para introduzir os participantes às mecânicas e à narrativa de forma mais acessível. Entretanto, há flexibilidade: o mestre pode criar novas fichas adaptadas ao contexto cultural explorado, ou ainda orientar na elaboração de personagens originais, permitindo maior autonomia criativa.
Cada personagem possui uma característica única com base em sua história, mesmo que um participante sempre utilize apenas um personagem, a experiência sempre será diferente pois o contexto do mundo sempre irá mudar. Desse modo podemos enriquecer a experiência individual e coletiva.

 \subsection{Sessão de Jogo}
Uma sessão tem em média duração entre 2 a 4 horas, conforme a disponibilidade dos participantes.. Pode haver uma ou mais sessões dependendo da profundidade da aventura. O mestre conduz a narrativa, propondo situações, problemas, dilemas morais ou culturais, desafios que requerem tomada de decisão e interação entre jogadores, interpretação de papéis, uso de elementos culturais inseridos no cenário.

\subsection{Flexibilidade Narrativa}
A Flexibilidade que o RPG de mesa traz, permite que os participantes possam influenciar no rumo da história com suas decisões, interajir de um modo criativo, propor ações novas, adaptações no enredo e promovendo participação ativa.

\section{Cultura RPG}
Com base em toda a explicação sobre os conceitos de RPG e no desenvolvimento de um sistema que auxilie tanto jogadores quanto mestres, surgiu um grande desafio: criar uma forma de jogar que pudesse abranger um público maior, mantendo a experiência acessível, dinâmica e divertida.

Para atender a essa necessidade, desenvolvi o site Cultura RPG, uma plataforma voltada para facilitar sua prática. No site, é possível jogar utilizando o sistema já estruturado, contando com missões prontas especialmente elaboradas para mestres iniciantes no sistema, permitindo que mesmo quem nunca conduziu uma mesa possa começar de maneira prática. Além disso, a plataforma disponibiliza fichas de personagens históricos marcantes da cultura brasileira, oferecendo uma forma única de unir aprendizado, narrativa e entretenimento, ao mesmo tempo em que resgata figuras importantes da história brasileira.

A proposta do Cultura RPG é tornar o jogo mais inclusivo e acessível, servindo tanto como ferramenta de diversão quanto como recurso cultural e educativo, permitindo que jogadores de diferentes níveis de experiência possam se engajar em histórias ricas, interativas e com identidade própria.

% ----------------------------------------------------------
% Considerações Finais
% ----------------------------------------------------------
\chapter{Conclusão}

Escreva a sua conclusão do seu trabalho


% ----------------------------------------------------------
% ELEMENTOS PÓS-TEXTUAIS
% ----------------------------------------------------------
\postextual
% ----------------------------------------------------------

% ----------------------------------------------------------
% Referências bibliográficas
% ----------------------------------------------------------
\bibliography{bibliografia}
BRASIL ESCOLA. O que é RPG?. Disponível em: https://brasilesco.la/b672. Acesso em: 29 maio 2025.

SOARES, Gyovanna. \textbf{Professor usa jogos de RPG para ensinar matemática aos alunos no litoral de SP: 'mais confiantes'}. 2022. Disponível em: https://l1nk.dev/19WC5. Acesso em: 29 maio 2025.

SALDANHA, Ana Alayde; BATISTA, José Roniere Morais.\textbf{ A concepção do role-playing game (RPG) em jogadores sistemáticos.} 2012. TCC (Graduação) - Curso de Psicologia, Universidade Federal da Paraíba, João Pessoa, 2012. Disponível em: https://encr.pw/yaUxq. Acesso em: 29 maio 2025.

APAE CURITIBA. RPG ajuda no desenvolvimento de crianças com TDAH. 2023. Disponível em: https://apaecuritiba.org.br/rpg-beneficios-tdah. Acesso em: 30 maio 2025.

SANTOS, Henrique Marinho dos; PINTO, Claudio Roberto Magalhães. RPG na educação: uma proposta lúdica para o ensino de história no ensino fundamental. RENOTE – Revista Novas Tecnologias na Educação, Porto Alegre, v. 9, n. 2, p. 1–7, 2011. Disponível em: https://seer.ufrgs.br/renote/article/view/14301. Acesso em: 30 maio 2025.

SILVA, Caio Cobianchi da. Jogos de representação no ensino de história: práticas pedagógicas a partir do RPG. 2023. Tese (Doutorado em Educação) – Universidade Federal de Mato Grosso, Cuiabá, 2023. Disponível em: https://surl.li/pcrcys. Acesso em: 30 maio 2025.

HENNING, Germano; ANDRADE, Túlio. Role-playing game pode servir como ferramenta para o desenvolvimento de habilidades sociais. Instituto de Psicologia – USP, 2022. Disponível em: https://surl.li/ucivoc. Acesso em: 31 maio 2025.

HENNING, Germano. Jogo RPG traz benefícios no combate ao déficit de atenção. Instituto de Psicologia – USP, 2022. Disponível em: https://www.ip.usp.br/site/noticia/jogo-rpg-traz-beneficios-no-combate-ao-deficit-de-atencao. Acesso em: 31 maio 2025.

INSTITUTO CLARO. RPG na escola: como usar o jogo de interpretação e improvisação. 2023. Disponível em: https://surl.li/dcqemt. Acesso em: 29 maio 2025.

JAMBO EDITORA. Diferentes maneiras de jogar RPG: presencial, online, texto e guilda. Blog Jambô, 2023. Disponível em: https://blog.jamboeditora.com.br/diferentes-maneiras-de-jogar-rpg-presencial-online-texto-guilda/. Acesso em: 01 de junho 2025.

SCIELO. RPG como estratégia terapêutica e educacional no contexto psicológico. Psicologia: Ciência e Profissão, 2022. Disponível em: https://www.scielo.br/j/pcp/a/S5ZVpXPhDD7nCsrJW4sTC8G/?lang=pt. Acesso em: 01 de junho 2025.

CARVALHO, Célia Vieira de. Aprendizagem baseada em jogos. In: II World Congress on Systems Engineering and Information Technology. 2015. p. 19–22. Disponível em: https://www2.ifrn.edu.br/ojs/index.php/RBEPT/article/view/13346. Acesso em: 24 de junho 2025.

AMORIM, Myrna Cecília Martins dos Santos; OLIVEIRA, Eloiza Silva Gomes; SANTOS, Joel André Ferreira; QUADROS, João Roberto de Toledo. Aprendizagem e jogos: diálogo com alunos do ensino médio-técnico. Educação & Realidade, Porto Alegre, v. 41, n. 1, p. 91–115, jan./mar. 2016. DOI: https://doi.org/10.1590/2175-623656109. Acesso em: 24 de junho 2025.

JAMBÔ EDITORA. Diferentes maneiras de jogar RPG: presencial, online, texto, guilda. Bençãos da Deusa, 28 out. 2020. Disponível em: https://blog.jamboeditora.com.br/diferentes-maneiras-de-jogar-rpg-presencial-online-texto-guilda/. Acesso em: 24 de junho. 2025.

% ---


% ----------------------------------------------------------
% Apêndices
% ----------------------------------------------------------

% ---
% Inicia os apêndices
% ---
\begin{apendicesenv}
	
	% Imprime uma página indicando o início dos apêndices
	\partapendices
	
% ----------------------------------------------------------
\chapter{Exemplo}
% ----------------------------------------------------------
	
\end{apendicesenv}
% ---

% ----------------------------------------------------------
% Anexos
% ----------------------------------------------------------

% ---
% Inicia os anexos
% ---
\begin{anexosenv}
	
	% Imprime uma página indicando o início dos anexos
	\partanexos
	
	% ---
    \chapter{Exemplo}
    % ---
	
\end{anexosenv}

\end{document}
