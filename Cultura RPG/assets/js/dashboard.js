



// Toggle modo escuro
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    
    const themeIcon = document.querySelector('.theme-toggle i');
    if (document.body.classList.contains('dark-mode')) {
        themeIcon.className = 'fas fa-sun';
    } else {
        themeIcon.className = 'fas fa-moon';
    }
}

// Simulação de progresso das missões
const questButtons = document.querySelectorAll('.quest-btn');

questButtons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
        const card = btn.closest('.quest-card');
        const progressFill = card.querySelector('.progress-fill');
        const progressText = card.querySelector('.quest-progress span');
        
        // Simula progresso aleatório
        const progress = Math.floor(Math.random() * 100);
        progressFill.style.width = progress + '%';
        
        // Atualiza texto baseado no progresso
        const maxSteps = index === 0 ? 5 : index === 1 ? 4 : 6;
        const currentSteps = Math.floor((progress / 100) * maxSteps);
        progressText.textContent = `${currentSteps}/${maxSteps} completo`;
        
        // Atualiza botão se completo
        if (progress === 100) {
            btn.textContent = 'Concluído!';
            btn.style.background = '#22c55e';
        } else {
            btn.textContent = 'Continuar';
        }
        
        // Atualiza estatísticas
        updateStats();
    });
});

// Atualizar estatísticas
function updateStats() {
    const achievements = document.querySelector('.stat-value');
    const xp = document.querySelectorAll('.stat-value')[1];
    const missions = document.querySelectorAll('.stat-value')[2];
    
    // Incrementa valores aleatoriamente
    achievements.textContent = parseInt(achievements.textContent) + Math.floor(Math.random() * 3);
    xp.textContent = parseInt(xp.textContent) + Math.floor(Math.random() * 50) + 10;
    missions.textContent = parseInt(missions.textContent) + 1;
}



// Sistema de conhecimentos adquiridos
let ownedKnowledge = {};

// Dados dos conhecimentos com descrições por nível
const knowledgeData = {
    'Samba': {
        icon: 'fas fa-music',
        category: 'Música',
        descriptions: {
            1: 'O samba nasceu no Rio de Janeiro entre 1916-1917, nas comunidades afro-brasileiras da Praça Onze e morros da Tijuca, Mangueira e Salgueiro. A primeira gravação foi "Pelo Telefone" de Donga e Mauro de Almeida em 1917.',
            2: 'O samba possui compasso 2/4 com síncope característica, criando o "balanco" único. Originou-se da fusão do lundu, maxixe e batuques africanos com a polca europeia. As "tias baianas" como Tia Ciata foram fundamentais, promovendo encontros musicais em suas casas.',
            3: 'Subgêneros principais: Samba-enredo (escolas de samba, narrativo), Samba de roda (Bahia, Patrimônio UNESCO 2005), Samba-canção (romântico, anos 1930), Pagode (anos 1980, Cacique de Ramos), Samba de breque (pausas dramáticas), Samba de gafieira (instrumental para dança).',
            4: 'Grandes mestres: Pixinguinha (harmonização), Cartola (poesia), Noel Rosa (crônica urbana), Ary Barroso ("Aquarela do Brasil"), Nelson Cavaquinho (melancolia), Clementina de Jesus (samba rural), Dona Ivone Lara (primeira mulher compositora de escola de samba), Paulinho da Viola (tradição).',
            5: 'O samba transcendeu fronteiras: influenciou jazz americano, música latina e world music. Instrumentação complexa: cavaquinho (harmonia), pandeiro (marcação), tan-tan (grave), cuíca (efeitos), surdo (base), tamborim (repique), reco-reco (percussão). Representa resistência, identidade nacional e democracia racial brasileira. Escola de samba é instituição social única no mundo.'
        }
    },
    'Bossa Nova': {
        icon: 'fas fa-music',
        category: 'Música',
        descriptions: {
            1: 'A Bossa Nova nasceu em 1958 com "Chega de Saudade" de Tom Jobim e Vinicius de Moraes, interpretada por João Gilberto. Surgiu nos apartamentos de Copacabana e Ipanema, refletindo o otimismo do Brasil dos anos JK (Juscelino Kubitschek).',
            2: 'Características musicais: harmonias jazzisticas (acordes com 7ª, 9ª, 11ª), batida de violão única (polegar no baixo, dedos na harmonia), canto sussurrado, andamento moderado. Influenciada pelo cool jazz de Miles Davis e Chet Baker, mas mantendo a base rítmica do samba.',
            3: 'Triângulo dourado: Tom Jobim (compositor/arranjador), Vinicius de Moraes (letrista/poeta), João Gilberto (intérprete/criador da batida). Clássicos: "Garota de Ipanema" (mais tocada no mundo), "Corcovado", "Desafinado", "Wave", "Insensatez". Outros nomes: Carlos Lyra, Roberto Menescal, Nara Leão, Sylvia Telles.',
            4: 'Marco internacional: concerto no Carnegie Hall (1962) com Stan Getz, Charlie Byrd, João Gilberto e Tom Jobim. Álbum "Getz/Gilberto" (1964) ganhou Grammy. Frank Sinatra gravou "Garota de Ipanema". Influenciou Beatles, Stevie Wonder, Diana Krall. Criou o "Brazilian Jazz" mundial.',
            5: 'Revolução estética: transformou música popular em arte erudita sem perder popularidade. Técnica do violão: uso de cordas soltas, harmonias abertas, economia de movimentos. Letras sofisticadas sobre amor, natureza e cotidiano urbano. Representa a modernidade brasileira, influenciando gêneros como MPB, jazz fusion e world music. Patrimonio cultural que projetou o Brasil como país de cultura refinada.'
        }
    },
    'Capoeira': {
        icon: 'fas fa-fist-raised',
        category: 'Artes Marciais',
        descriptions: {
            1: 'A capoeira originou-se no século XVI com escravos africanos (principalmente bantos de Angola) no Brasil colonial. Combina luta, dança, acrobacia e música numa arte única. O nome pode derivar de "capuêra" (vegetação rasteira) onde era praticada secretamente.',
            2: 'Desenvolvida como resistência cultural: escravos treinavam luta disfarçada de dança para enganar feitores. A "roda" simboliza o ciclo da vida e igualdade. Elementos essenciais: ginga (movimento base), esquivas (defesas), golpes (ataques), floreios (acrobacias). Proibida após abolição (1888), praticada clandestinamente.',
            3: 'Dois estilos principais: CAPOEIRA ANGOLA - tradicional, criada por Mestre Pastinha (1889-1981), movimentos baixos, jogo lento, filosofia ancestral, berimbau gunga marca ritmo. CAPOEIRA REGIONAL - moderna, criada por Mestre Bimba (1899-1974) em 1928, mais acrobática, sequências de ensino, primeira academia oficial (1937).',
            4: 'Instrumentos da orquestra: Berimbau (arco musical, 3 tipos: gunga-grave, médio-médio, viola-agudo), Pandeiro, Atabaque, Agogô, Reco-reco. Cantigas: ladainha (solo reflexivo), chula (coro), corridos (diálogo). Mestres lendários: Besouro Cordão de Ouro, Mestre Waldemar, Mestre João Grande, Mestre Acordeon.',
            5: 'Patrimônio Cultural Imaterial da Humanidade (UNESCO, 2014). Filosofia: malicia (esperteza), mandinga (magia/energia), axé (força vital). Movimentos icônicos: Ginga (base), Au (estrela), Meia-lua (chute circular), Martelo (chute frontal), Macaco (salto), Bananeira (parada de mão). Graduacão por cordas coloridas. Presente em 160 países, símbolo da resistência afro-brasileira e democracia racial.'
        }
    },
    'Machado de Assis': {
        icon: 'fas fa-book',
        category: 'Literatura',
        descriptions: {
            1: 'Joaquim Maria Machado de Assis (1839-1908) é considerado o maior escritor brasileiro.',
            2: 'Suas obras como "Dom Casmurro", "O Cortico" e "Memórias Póstumas de Brás Cubas" são marcos da literatura nacional.',
            3: 'Machado foi pioneiro do Realismo no Brasil, retratando a sociedade com ironia e pessimismo. Criou narradores não-confiáveis e técnicas narrativas inovadoras.',
            4: 'Fundou a Academia Brasileira de Letras em 1897. Suas crônicas no jornal revelam um observador arguto da sociedade carioca do século XIX.',
            5: 'Machado transcendeu seu tempo ao abordar temas universais como ciúme, ambição e hipocrisia. Sua obra influencia escritores até hoje e é estudada mundialmente como exemplo de excelência literária.'
        }
    },
    'Feijoada': {
        icon: 'fas fa-utensils',
        category: 'Culinária',
        descriptions: {
            1: 'A feijoada é considerada o prato nacional do Brasil, feita com feijão preto e carnes.',
            2: 'Originada nos tempos coloniais, é servida tradicionalmente às quartas e sábados com acompanhamentos como arroz, couve e laranja.',
            3: 'Cada região tem sua variação: feijoada carioca (mais encorpada), paulista, mineira. Os ingredientes incluem linguiça, costelinha, paio e carne seca.',
            4: 'A feijoada representa a miscigenação cultural brasileira, unindo ingredientes africanos, europeus e indígenas. É um prato social, consumido em família.',
            5: 'Mais que um prato, a feijoada é um ritual social brasileiro. Seu preparo lento e compartilhamento fortalecem laços familiares. Simboliza a identidade nacional e a capacidade brasileira de transformar ingredientes simples em algo especial.'
        }
    },
    'Forró': {
        icon: 'fas fa-music',
        category: 'Música',
        descriptions: {
            1: 'O forró nasceu no século XIX no Nordeste brasileiro, derivado de danças europeias adaptadas pelos sertanejos. O nome pode vir de "forrobodó" (festa popular) ou da expressão inglesa "for all" dos bailes de construção de ferrovias.',
            2: 'Trio clássico: sanfona (8 baixos), zabumba (tambor duplo) e triângulo. A sanfona marca a melodia, zabumba o ritmo base e triângulo os contrapontos. Dança em pares, com passos arrastados e giros característicos.',
            3: 'Luiz Gonzaga (1912-1989), o "Rei do Baiao", revolucionou o gênero nos anos 1940. "Asa Branca" (1947) tornou-se hino nordestino. Outros clássicos: "Qui nem Jiló", "Juazeiro", "Baiao". Parceria com Humberto Teixeira foi fundamental.',
            4: 'Evolução em três vertentes: Forró Pé-de-Serra (tradicional, acústico), Forró Eletrônico (anos 1990, bandas como Mastruz com Leite), Forró Universitário (anos 2000, Falamansa, Rastapé). Cada estilo com instrumentação e público próprios.',
            5: 'Patrimônio cultural nordestino que preserva identidade sertaneja. Festivais como o de Campina Grande (PB) atraem milhões. Representa resistência cultural, migração nordestina e saudade da terra natal. Influenciou música nacional e é estudado academicamente como fenômeno sociológico.'
        }
    },
    'Axé': {
        icon: 'fas fa-music',
        category: 'Música',
        descriptions: {
            1: 'O axé music nasceu em Salvador (BA) nos anos 1980, fusionando frevo pernambucano, maracatu, rock, reggae e ritmos afro-baianos. "Axé" significa "energia positiva" no candomblé, refletindo a alegria contagiante do gênero.',
            2: 'Precursores: Novos Baianos (anos 1970) e Moraes Moreira. Marco inicial: "Fricote" de Luiz Caldas (1985). Características: BPM acelerado (130-140), guitarras distorcidas, percussão intensa, vocalização energética e coreografias marcantes.',
            3: 'Grandes nomes: Daniela Mercury ("O Canto da Cidade"), Ivete Sangalo ("Sorte Grande"), Chiclete com Banana ("Diga que Valeu"), Claudia Leitte, Carlinhos Brown, Asa de Águia. Bandas de trio elétrico revolucionaram apresentações.',
            4: 'Fenômeno do Carnaval de Salvador: 2 milhões de foliões, 200 blocos, circuito de 25km. Axé virou produto de exportação cultural baiana. Influenciou pagode baiano, samba-reggae e música pop nacional.',
            5: 'Movimento que transformou Salvador em capital cultural do Brasil. Gerou economia criativa de R$ 1 bilhão/ano, projetou artistas internacionalmente e criou identidade musical única. Representa alegria, diversidade racial e potência cultural afro-brasileira.'
        }
    },
    'Funk Carioca': {
        icon: 'fas fa-music',
        category: 'Música',
        descriptions: {
            1: 'O funk carioca nasceu nos anos 1980 nas favelas do Rio de Janeiro, inspirado no funk americano de James Brown. Inicialmente tocado em bailes de comunidade, tornou-se expressão cultural da periferia carioca.',
            2: 'Evolução: Funk Melôdico (anos 1990), Funk Proibição (crônicas do tráfico), Funk Ostentação (consumo). Base rítmica: "Volt Mix" e "Tamborzao". BPM: 130-150. Produção: samplers, drum machines, sintetizadores.',
            3: 'Pioneiros: DJ Marlboro, MC Claudinho e Buchecha ("Nosso Sonho"), Bonde do Tigrão. Nova geração: MC Kevinho, Anitta, MC Fioti ("Bum Bum Tam Tam"). Bailes funk: Furacão 2000, equipes de som gigantes.',
            4: 'Polêmicas e reconhecimento: criminalização vs. expressão artística. Lei estadual RJ (2009) reconheceu como movimento cultural. Anitta levou funk ao mainstream internacional. Plataformas digitais democratizaram produção.',
            5: 'Fenômeno global: TikTok, Spotify, colaborações internacionais. Representa voz da periferia, empoderamento jovem e inovação musical brasileira. Influenciou trap, pop e música eletrônica mundial. Símbolo de resistência e criatividade urbana.'
        }
    },
    'MPB': {
        icon: 'fas fa-music',
        category: 'Música',
        descriptions: {
            1: 'A Música Popular Brasileira (MPB) surgiu nos anos 1960 como evolução da Bossa Nova, incorporando elementos de protesto político durante a ditadura militar (1964-1985). Representa sofisticação musical e consciência social.',
            2: 'Características: harmonias complexas, letras poéticas, fusão de gêneros (samba, baiao, rock, jazz). Instrumentação variada: violão, piano, orquestração elaborada. Canto expressivo, interpretação dramática.',
            3: 'Grandes nomes: Chico Buarque ("Cálice"), Caetano Veloso ("Alegria Alegria"), Gilberto Gil ("Aquele Abraço"), Elis Regina ("Como Nossos Pais"), Milton Nascimento ("Travessia"), Maria Bethânia, Gal Costa, Tom Zé.',
            4: 'Tropicalia (1967-1968): movimento de vanguarda liderado por Caetano e Gil, misturando MPB com rock, pop e elementos experimentais. Festivais da Canção (TV Record/Globo) lançaram carreiras e definiram estética do gênero.',
            5: 'Patrimônio cultural brasileiro que influenciou música mundial. Artistas como David Byrne, Beck e Thom Yorke reconhecem sua importância. Representa maturidade artística nacional, resistência cultural e capacidade de inovação estética brasileira.'
        }
    },
    'Funk Carioca': {
        icon: 'fas fa-music',
        category: 'Música',
        descriptions: {
            1: 'O funk carioca nasceu nos anos 1980 nas favelas do Rio, inspirado no funk americano.',
            2: 'Evoluiu com batidas eletrônicas e letras que retratam a realidade das comunidades.',
            3: 'MC Marlboro, Claudinho e Buchecha foram pioneiros. Bailes funk se tornaram fenômeno social.',
            4: 'Gerou polêmicas mas também reconhecimento artístico, influenciando música pop nacional.',
            5: 'Expressão cultural da periferia que conquistou todas as classes sociais, exportado internacionalmente.'
        }
    },
    'MPB': {
        icon: 'fas fa-music',
        category: 'Música',
        descriptions: {
            1: 'A Música Popular Brasileira (MPB) surgiu nos anos 1960 como evolução da Bossa Nova.',
            2: 'Incorporou elementos de protesto político durante a ditadura militar (1964-1985).',
            3: 'Grandes nomes: Chico Buarque, Caetano Veloso, Gilberto Gil, Elis Regina, Milton Nascimento.',
            4: 'Movimento Tropicalia (1967) revolucionou a MPB misturando rock, pop e vanguarda.',
            5: 'Representa a sofisticação da música brasileira, unindo qualidade artística e consciência social.'
        }
    },
    'Cordel': {
        icon: 'fas fa-book',
        category: 'Literatura',
        descriptions: {
            1: 'Literatura de cordel é poesia popular nordestina impressa em folhetos (8, 16, 32 páginas) e vendida em feiras, mercados e praças. Nome deriva dos barbantes (cordeis) onde eram pendurados para venda em Portugal.',
            2: 'Origem ibérica (séc. XVI), adaptada no Brasil colonial. Estrutura: sextilhas (ABCBDB), septilhas, décimas. Métrica rigorosa: versos de 7 sílabas poéticas (redondilha maior). Linguagem popular, narrativa oral impressa.',
            3: 'Temas universais: heróis (Lampião, Padre Cícero), amor, religião, política, acontecimentos. Xilogravuras: arte popular que ilustra capas, criadas por artistas como J. Borges. Cantoria: improviso oral que origina cordel.',
            4: 'Mestres: Leandro Gomes de Barros ("pai do cordel"), João Martins de Athayde, Cuica de Santo Amaro, Patativa do Assaré. Editoras tradicionais: Luzeiro (São Paulo), José Bernardo da Silva (Juazeiro).',
            5: 'Patrimônio Cultural Imaterial do Brasil (IPHAN, 2018). Preserva memória coletiva, oralidade nordestina e resistência cultural. Influenciou Ariano Suassuna, Elba Ramalho, Alceu Valença. Presente em universidades e movimentos de letramento popular.'
        }
    },
    'Clarice Lispector': {
        icon: 'fas fa-book',
        category: 'Literatura',
        descriptions: {
            1: 'Clarice Lispector (1920-1977), nascida na Ucrânia e criada no Recife, é considerada uma das maiores escritoras do século XX. Revolucionou a literatura brasileira com introspecção psicológica e linguagem inovadora.',
            2: 'Estreou aos 23 anos com "Perto do Coração Selvagem" (1943), surpreendendo críticos. Estilo: fluxo de consciência, epifanias, questões existenciais, linguagem poética em prosa. Influenciada por Kafka, Joyce e Woolf.',
            3: 'Obras principais: "A Paixão Segundo G.H." (1964), "A Hora da Estrela" (1977), "Laços de Família" (1960), "A Descoberta do Mundo" (crônicas). Personagens femininas complexas, busca de identidade.',
            4: 'Reconhecimento internacional: traduzida para 25 idiomas. Influenciou Lygia Fagundes Telles, Nélida Piñon, Hilda Hilst. Jornalista, tradutora, cronista. Vida pessoal reservada, mito literário em vida.',
            5: 'Gênia literária que transcendeu fronteiras nacionais. Obra estudada mundialmente como exemplo de modernidade literária. Representa busca da condição humana, feminino na literatura e inovação estética brasileira. Influencia escritores contemporâneos globalmente.'
        }
    },
    'Jorge Amado': {
        icon: 'fas fa-book',
        category: 'Literatura',
        descriptions: {
            1: 'Jorge Amado (1912-2001), escritor baiano de Itabuna, é o autor brasileiro mais traduzido no mundo. Cronista da Bahia, retratou cultura afro-brasileira, sincretismo religioso e vida popular com realismo mágico.',
            2: 'Fases: Social (anos 1930-40) - "Cacau", "Suôr"; Madura (1950+) - "Gabriela", "Dona Flor". Estilo: narrativa fluida, humor, sensualidade, personagens populares. Linguagem acessível, oralidade baiana.',
            3: 'Obras icônicas: "Gabriela, Cravo e Canela" (1958), "Dona Flor e Seus Dois Maridos" (1966), "Tieta do Agreste" (1977), "Capitaes da Areia" (1937). Personagens inesquecíveis: Gabriela, Quincas Berro D’Água, Vadinho.',
            4: 'Traduções: 49 idiomas, 20 milhões de exemplares vendidos. Adaptações: cinema ("Dona Flor", Bruno Barreto), TV (novelas Globo), teatro. Membro Academia Brasileira de Letras, Prêmio Camões (1994).',
            5: 'Embaixador cultural do Brasil que eternizou a Bahia na literatura mundial. Obra representa democracia racial, religiosidade afro-brasileira e identidade nacional mestica. Influenciou realismo mágico latino-americano e projetou cultura brasileira globalmente.'
        }
    },
    'Clarice Lispector': {
        icon: 'fas fa-book',
        category: 'Literatura',
        descriptions: {
            1: 'Clarice Lispector (1920-1977) foi escritora ucraniano-brasileira, mestra da introspecção.',
            2: 'Obras principais: "A Hora da Estrela", "A Paixão Segundo G.H.", "Lacos de Família".',
            3: 'Revolucionou a literatura com fluxo de consciência e exploração da psique feminina.',
            4: 'Influenciou gerações de escritores e é estudada internacionalmente como gênia literária.',
            5: 'Considerada uma das maiores escritoras do século XX, transcendeu fronteiras nacionais.'
        }
    },
    'Jorge Amado': {
        icon: 'fas fa-book',
        category: 'Literatura',
        descriptions: {
            1: 'Jorge Amado (1912-2001) foi escritor baiano, cronista da cultura afro-brasileira.',
            2: 'Obras famosas: "Dona Flor e Seus Dois Maridos", "Gabriela", "Tieta", "Capitaes da Areia".',
            3: 'Retratou a Bahia com realismo mágico, valorizando sincretismo religioso e cultura popular.',
            4: 'Traduzido para 49 idiomas, suas obras viraram filmes, novelas e peças teatrais.',
            5: 'Embaixador cultural do Brasil, eternizou a Bahia na literatura mundial.'
        }
    },
    'Açaí': {
        icon: 'fas fa-utensils',
        category: 'Culinária',
        descriptions: {
            1: 'O açaí é fruto da palmeira Euterpe oleracea, nativa da Amazônia. Para povos indígenas como os Caboclos, é alimento sagrado. Lenda conta que Íaca, filha do cacique, deu origem à palmeira para alimentar sua tribo.',
            2: 'Alimento básico ribeirinho há milênios. Rico em antocianinas (antioxidantes), ômega-3, fibras, ferro. Tradicionalmente consumido salgado com peixe, camarão, farinha de mandioca. Colheita sustentável preserva floresta em pé.',
            3: 'Popularização nacional (anos 1980): surfistas cariocas descobriram energia do fruto. "Açaí na tigela" com granola, frutas. Mercado Ver-o-Peso (Belém) é centro tradicional de comércio.',
            4: 'Fenômeno global: exportado como "superfruit" para EUA, Europa, Japão. Indústria de R$ 1,5 bilhão/ano. Certificacões orgânicas, comércio justo. Pesquisas científicas comprovam benefícios à saúde.',
            5: 'Símbolo da economia verde amazônica. Gera renda para 120 mil famílias ribeirinhas, incentiva preservação florestal. Representa biodiversidade brasileira, sabedoria ancestral e modelo de desenvolvimento sustentável para o mundo.'
        }
    },
    'Pão de Açúcar': {
        icon: 'fas fa-utensils',
        category: 'Culinária',
        descriptions: {
            1: 'Pão de açúcar é doce tradicional mineiro feito com açúcar cristal derretido e moldado em formato cônico. Nome deriva da semelhança com os pães de açúcar coloniais exportados do Brasil.',
            2: 'Origem século XVIII, quando Minas Gerais era centro açucareiro. Técnica: açúcar aquecido a 160°C (ponto de bala dura), moldado em formas cônicas de barro. Textura cristalina, sabor puro do açúcar caramelizado.',
            3: 'Tradição familiar mineira: receitas passadas por gerações. Consumo clássico: com queijo minas frescal, criando contraste doce-salgado. Presente em cafés coloniais, fazendas históricas.',
            4: 'Patrimônio gastronômico de Minas Gerais. Produção artesanal em cidades como Tiradentes, Ouro Preto. Turismo rural valoriza tradição. Variações: pão de açúcar com coco, amendoim.',
            5: 'Representa simplicidade e genialidade da culinária mineira. Símbolo da hospitalidade e do "jeitinho brasileiro" de transformar ingredientes básicos em iguarias. Preserva memória afetiva e identidade cultural de Minas Gerais.'
        }
    },
    'Acarajé': {
        icon: 'fas fa-utensils',
        category: 'Culinária',
        descriptions: {
            1: 'Acarajé é bolinho de feijão-fradinho (Vigna unguiculata) frito no dendê, origem iorubá da África Ocidental. Trazido por escravos para Salvador, tornou-se símbolo da culinária afro-brasileira.',
            2: 'Preparo ritual: feijão descascado à mão, moido em pedra, temperado com cebola e sal. Frito em dendê (azeite de palm) em panela de ferro. No candomblé, é comida sagrada de Iansã (orixá dos ventos).',
            3: 'Baianas de acarajé: mulheres vestidas de branco, turbante, balãngandãs, vendendo nas ruas de Salvador há séculos. Recheios tradicionais: vatapá (pasta de camarão), caruru (quiabo), camarão seco, pimenta.',
            4: 'Patrimônio Cultural Imaterial (IPHAN, 2005). Resistência cultural: McDonald’s tentou comercializar "McAcarajé" (2000), gerando polêmica e defesa da tradição. Mais de 3 mil baianas registradas.',
            5: 'Símbolo máximo da resistência afro-brasileira e sincretismo cultural. Representa identidade baiana, religiosidade, empreendedorismo feminino negro. Reconhecido mundialmente como patrimônio imaterial da humanidade pela diversidade cultural que representa.'
        }
    },
    'Brigadeiro': {
        icon: 'fas fa-utensils',
        category: 'Culinária',
        descriptions: {
            1: 'Brigadeiro é doce brasileiro criado nos anos 1940, feito com leite condensado, chocolate em pó e manteiga. Nome homenageia o Brigadeiro Eduardo Gomes, candidato à presidência em 1945.',
            2: 'Origem: campanha política de Eduardo Gomes. Mulheres da sociedade carioca criaram o doce para arrecadar fundos, usando ingredientes disponíveis pós-guerra. Slogan: "Vote no brigadeiro, que é bonito e é solteiro".',
            3: 'Preparo clássico: leite condensado, chocolate, manteiga em fogo baixo até desgrudar da panela. Enrolado em bolinhas, coberto com granulado. Tornou-se obrigatório em aniversários infantis brasileiros.',
            4: 'Evolução gourmet (anos 2000): sabores sofisticados (maracujá, pistache, champagne), embalações elegantes, brigadeirias especializadas. Exportado para comunidades brasileiras no exterior.',
            5: 'Embaixador da doçaria brasileira mundial. Representa afetividade, hospitalidade e "jeitinho brasileiro". Símbolo de celebração, infância e identidade nacional. Conecta gerações e preserva memória afetiva coletiva brasileira.'
        }
    },
    'Pão de Açúcar': {
        icon: 'fas fa-utensils',
        category: 'Culinária',
        descriptions: {
            1: 'Pão de açúcar é doce tradicional mineiro feito com açúcar cristal e água.',
            2: 'Originado no período colonial, quando Minas Gerais era centro da produção açucareira.',
            3: 'Preparo artesanal: açúcar derretido em ponto de bala, moldado em formas cônicas.',
            4: 'Tradicionalmente consumido com queijo minas, criando contraste doce-salgado único.',
            5: 'Representa a simplicidade e genialidade da culinária mineira, patrimônio gastronômico nacional.'
        }
    },
    'Acarajé': {
        icon: 'fas fa-utensils',
        category: 'Culinária',
        descriptions: {
            1: 'Acarajé é bolinho de feijão-fradinho frito no dendê, origem africana na Bahia.',
            2: 'Trazido pelos escravos iorubás, é comida sagrada do candomblé, oferenda para Iansã.',
            3: 'Vendido pelas baianas de acarajé, Patrimônio Cultural Imaterial (IPHAN, 2005).',
            4: 'Recheado com vatapá, caruru, camarão seco e pimenta, representa sincretismo cultural.',
            5: 'Símbolo da resistência afro-brasileira e identidade baiana, reconhecido mundialmente.'
        }
    },
    'Brigadeiro': {
        icon: 'fas fa-utensils',
        category: 'Culinária',
        descriptions: {
            1: 'Brigadeiro é doce brasileiro feito com leite condensado, chocolate e manteiga.',
            2: 'Criado nos anos 1940, homenageando o Brigadeiro Eduardo Gomes, candidato à presidência.',
            3: 'Tornou-se obrigatório em festas infantis brasileiras, símbolo de celebração.',
            4: 'Evoluiu em gourmet com sabores sofisticados: maracujá, pistache, champagne.',
            5: 'Embaixador da doçaria brasileira no exterior, representa afetividade e hospitalidade nacional.'
        }
    },
    'Curupira': {
        icon: 'fas fa-theater-masks',
        category: 'Folclore',
        descriptions: {
            1: 'Curupira é entidade protetora das florestas no folclore brasileiro, com pés virados para trás. Origem tupi: "curu" (corpo) + "pira" (corpo), significa "corpo de menino". Primeira menção: Padre Anchieta (1560).',
            2: 'Descrição tradicional: criança ou anão de 7-10 anos, cabelos vermelhos como fogo, dentes verdes, pés voltados para trás. Vive no âmago da mata, conhece todos os segredos da floresta. Emite assobios agudos para se comunicar.',
            3: 'Proteção da fauna: confunde caçadores com pegadas invertidas, fazendo-os se perder. Castiga quem mata animais em excesso, destrói ninhos ou corta árvores sem necessidade. Pode ajudar viajantes perdidos que respeitam a natureza.',
            4: 'Variações regionais: Amazônia (mais feroz), Sudeste (mais brincalhão), Sul (Curupira loiro). Presente em literatura: Monteiro Lobato, Walcyr Carrasco. Adaptado em quadrinhos, filmes, jogos eletrônicos.',
            5: 'Símbolo da consciência ecológica indígena, extremamente atual na crise ambiental. Representa sabedoria ancestral sobre sustentabilidade, equilíbrio ecológico e responsabilidade humana com a natureza. Inspira movimentos ambientalistas contemporâneos.'
        }
    },
    'Saci-Pererê': {
        icon: 'fas fa-theater-masks',
        category: 'Folclore',
        descriptions: {
            1: 'Saci-Pererê é personagem icônico do folclore brasileiro: negrinho de uma perna só, gorro vermelho, cachimbo, travesso e brincalhão. Origem indígena: "Yaci-yaterê" (Yaci = lua, yaterê = criança).',
            2: 'Evolução histórica: indígena (menino índio), colonial (negrinho escravo), moderna (Monteiro Lobato). Características: aparece em redemoinhos de vento, viaja em mini-tornados, possui poderes mágicos limitados.',
            3: 'Travessuras clássicas: esconde objetos, assaé animais, queima comida, faz trancinhas em crinas de cavalos, some com agulhas de costura. Não é malévolo, apenas travesso. Medo de água, cruzes, nós.',
            4: 'Monteiro Lobato popularizou no "Sítio do Picapau Amarelo" (1921), criando versão mais humanizada. Dia do Saci: 31 de outubro (contraponto ao Halloween). Presente em música, literatura, cinema, publicidade.',
            5: 'Símbolo da malandragem e criatividade brasileira. Representa miscigenação cultural (indígena-africana-europeia), jeitinho brasileiro, resistência cultural. Personifica espírito nacional: irreverente, esperto, resiliente. Ícone da identidade brasileira mestica.'
        }
    },
    'Iara': {
        icon: 'fas fa-theater-masks',
        category: 'Folclore',
        descriptions: {
            1: 'Iara, a Mãe-d’Água, é sereia dos rios brasileiros que seduz pescadores com seu canto. Origem tupi: "y-iara" (senhora das águas). Lenda nasceu na Amazônia, espalhando-se por todo Brasil.',
            2: 'Lenda originária: Iara era índia guerreira, filha de pajé, mais habilidosa que os irmãos. Por ciúme, eles tentaram matá-la, mas ela os matou em defesa. Punida pelo pai, foi jogada no rio, transformando-se em sereia.',
            3: 'Descrição: mulher belíssima da cintura para cima, cauda de peixe, cabelos longos e negros, olhos verdes como água. Canto hipnótico atrai homens para as profundezas. Vive em poções, cachoeiras, rios caudalosos.',
            4: 'Variações regionais: Amazônia (mais selvagem), Nordeste (Mãe-d’Água dos açudes), Sudeste (sereia dos rios). Literatura: José de Alencar, Gonçalves Dias. Adaptada em óperas, filmes, novelas.',
            5: 'Representa poder feminino da natureza, sedução, perigo e mistério das águas brasileiras. Símbolo da relação mística entre homem e natureza. Inspira discussões sobre feminino, ecologia aquática e preservação dos rios brasileiros.'
        }
    },
    'Boitatá': {
        icon: 'fas fa-theater-masks',
        category: 'Folclore',
        descriptions: {
            1: 'Boitatá é serpente de fogo do folclore brasileiro, protetora dos campos contra queimadas. Nome tupi: "mboi" (cobra) + "tatá" (fogo) = "coisa de fogo". Primeira menção: Padre Anchieta (1560).',
            2: 'Origem lendária: grande dilúvio cobriu a Terra, poucos animais sobreviveram. Uma cobra comeu os olhos dos animais mortos para enxergar na escuridão, transformando-se em ser luminoso. Tornou-se guardiã contra o fogo destrutivo.',
            3: 'Descrição: serpente gigantesca (50-200 metros), corpo transparente ou luminoso, olhos como tochas flamejantes. Voa pelos campos à noite, deixando rastro de fogo. Persegue e pune incendiários, protegendo vegetação.',
            4: 'Variações regionais: Boi-tatá (Sul - touro de fogo), Fogo-fato (Nordeste), Cobra-de-fogo (Centro-Oeste). Cada região adaptou conforme fauna local. Presente em cordel, literatura regional, cinema nacional.',
            5: 'Representa consciência ecológica indígena sobre preservação contra queimadas. Extremamente atual na luta contra desmatamento, incêndios florestais e mudanças climáticas. Símbolo da responsabilidade ambiental e sabedoria ancestral sobre equilíbrio ecológico.'
        }
    },
    'Saci-Pererê': {
        icon: 'fas fa-theater-masks',
        category: 'Folclore',
        descriptions: {
            1: 'Saci-Pererê é personagem do folclore brasileiro, negrinho de uma perna só e gorro vermelho.',
            2: 'Origem indígena (Yaci-yaterê), miscigenado com elementos africanos e europeus.',
            3: 'Travesso que faz pegadinhas: esconde objetos, assaé animais, queima comida.',
            4: 'Monteiro Lobato popularizou o personagem no "Sítio do Picapau Amarelo" (1921).',
            5: 'Símbolo da malandragem brasileira e criatividade popular, representa identidade nacional mestica.'
        }
    },
    'Iara': {
        icon: 'fas fa-theater-masks',
        category: 'Folclore',
        descriptions: {
            1: 'Iara é sereia dos rios brasileiros, mãe-d’água que seduz pescadores com seu canto.',
            2: 'Lenda originária dos indígenas tupis, adaptada com elementos da sereia europeia.',
            3: 'Descrita como mulher belíssima, metade peixe, que vive nas profundezas dos rios.',
            4: 'Representa o poder feminino da natureza e os perigos das águas brasileiras.',
            5: 'Símbolo da relação mística entre homem e natureza na cultura brasileira.'
        }
    },
    'Boitatá': {
        icon: 'fas fa-theater-masks',
        category: 'Folclore',
        descriptions: {
            1: 'Boitatá é serpente de fogo do folclore brasileiro, protetora dos campos.',
            2: 'Nome tupi significa "coisa de fogo", descrita como cobra gigante com olhos flamejantes.',
            3: 'Protege a natureza punindo quem provoca queimadas e destrói vegetação.',
            4: 'Varia regionalmente: Boi-tatá (Sul), Fogo-fato (Nordeste), cada com características próprias.',
            5: 'Representa consciência ecológica indígena, atual na luta contra desmatamento e queimadas.'
        }
    },
    'Jiu-Jitsu Brasileiro': {
        icon: 'fas fa-fist-raised',
        category: 'Artes Marciais',
        descriptions: {
            1: 'Jiu-Jitsu Brasileiro (BJJ) é arte marcial criada pela adaptação do judô/jiu-jitsu japonês pela família Gracie. Mitsuyo Maeda (Conde Koma) ensinou Carlos Gracie em Belém (1917), iniciando revolução marcial.',
            2: 'Filosofia "arte suave": técnica supera força bruta. Foco no combate de solo (ne-waza), desenvolvendo sistema único de posições, transições, finalizações. Guarda (guard) - inovação brasileira revolucionária.',
            3: 'Hélio Gracie (1913-2009) adaptou técnicas para pessoas menores/mais fracas. Royce Gracie provou eficácia no UFC 1 (1993). Principais técnicas: mata-leão, triângulo, kimura, armlock, omoplata.',
            4: 'Revolução no MMA: base fundamental para lutadores modernos. Escolas Gracie espalharam-se mundialmente. Federação Internacional (IBJJF) regulamenta competições. Sistema de faixas: branca, azul, roxa, marrom, preta.',
            5: 'Maior contribuição brasileira às artes marciais mundiais. Praticado em 195 países, 5 milhões de praticantes. Representa inovação, adaptação e genialidade brasileira. Filosofia de vida: humildade, persistência, respeito. Exportação cultural brasileira de sucesso.'
        }
    },
    'Huka-Huka': {
        icon: 'fas fa-fist-raised',
        category: 'Artes Marciais',
        descriptions: {
            1: 'Huka-Huka é luta tradicional indígena brasileira, praticada principalmente pelos povos do Alto Xingu (MT). Nome deriva da onomatópeia do som da respiração ofegante durante o combate.',
            2: 'Ritual de passagem masculina e demonstração de força entre guerreiros. Praticada durante o Kuarup (ritual funerário) e outras cerimônias importantes. Representa coragem, honra e status social na comunidade.',
            3: 'Regras tradicionais: derrubar adversário sem usar golpes, socos ou chutes. Apenas força, técnica de agarramento e desequilíbrio. Combate em terreno de areia, lutadores nus, corpo pintado com urucum e jenipapo.',
            4: 'Povos praticantes: Kuikuro, Kalapalo, Matipu, Nahukwá, Mehinaku. Preservada pelos caciques e pajés como tradição ancestral. Documentada por antropólogos, filólogos, cineastas ("Kuarup" - Ruy Guerra).',
            5: 'Patrimônio cultural indígena que preserva tradições milenares brasileiras. Representa resistência cultural, identidade étnica e sabedoria ancestral. Símbolo da diversidade cultural brasileira e importância da preservação dos povos originários.'
        }
    },
    'Huka-Huka': {
        icon: 'fas fa-fist-raised',
        category: 'Artes Marciais',
        descriptions: {
            1: 'Huka-Huka é luta tradicional indígena brasileira, praticada principalmente no Xingu.',
            2: 'Ritual de passagem masculina, demonstração de força e coragem entre guerreiros.',
            3: 'Regras: derrubar adversário sem usar golpes, apenas força e técnica de agarramento.',
            4: 'Preservada pelos povos Kuikuro, Kalapalo e outras etnias do Alto Xingu.',
            5: 'Patrimônio cultural indígena que preserva tradições ancestrais brasileiras.'
        }
    },
    'Carnaval': {
        icon: 'fas fa-calendar-alt',
        category: 'Festas Populares',
        descriptions: {
            1: 'Carnaval brasileiro é a maior festa popular do mundo, celebrada nos 4 dias antes da Quaresma católica. Origem no "entrudo" português (séc. XVII), transformado pela criatividade afro-brasileira em espetáculo único.',
            2: 'Evolução histórica: Entrudo colonial (brincadeiras violentas) → Grandes Sociedades (séc. XIX) → Cordoes e Ranchos → Escolas de Samba (1928). Miscigenação cultural: europeia, africana, indígena.',
            3: 'Variações regionais icônicas: Rio (Sambódromo, escolas de samba), Salvador (Circuito Dodô, axé music), Recife-Olinda (frevo, maracatu), São Paulo (Anhembi), Florianopolis (Lagoa da Conceição).',
            4: 'Impacto econômico: R$ 8 bilhões/ano, 2 milhões de turistas estrangeiros, 500 mil empregos temporários. Transmissão global: 200 países, 1 bilhão de telespectadores. Indústria criativa gigantesca.',
            5: 'Maior expressão da identidade cultural brasileira. Representa democracia racial, criatividade popular, resistência cultural afro-brasileira. Símbolo mundial de alegria, diversidade e genialidade artística nacional. Patrimônio imaterial da humanidade.'
        }
    },
    'Festa Junina': {
        icon: 'fas fa-calendar-alt',
        category: 'Festas Populares',
        descriptions: {
            1: 'Festas Juninas celebram santos católicos (Antônio-13, João-24, Pedro-29 de junho) com tradições rurais. Origem europeia (festivais de solstício) adaptada ao Brasil colonial, sincretizada com rituais indígenas.',
            2: 'Elementos tradicionais: fogueira (purificação), quadrilha (dança francesa "quadrille"), bandeirinhas, balões, casamento caipira. Comidas típicas: pamonha, curau, quentao, vinho quente, pé-de-moleque, cocada.',
            3: 'Tradições regionais: Nordeste (fogueiras gigantes, forró), Sudeste (quadrilhas elaboradas), Sul (quermesses), Norte (boi-bumba). Cada região adaptou conforme cultura local.',
            4: 'Maior festa do interior brasileiro: 12 mil eventos, 50 milhões de participantes. Campina Grande (PB) - "Maior São João do Mundo". Caruaru (PE), Cacéres (MT). Movimenta R$ 2 bilhões na economia rural.',
            5: 'Preserva tradições rurais, religiosidade popular e identidade caipira brasileira. Fortalece laços comunitários, valoriza cultura do interior. Representa resistência da cultura tradicional frente à urbanização. Patrimônio cultural que une gerações.'
        }
    },
    'Bumba Meu Boi': {
        icon: 'fas fa-calendar-alt',
        category: 'Festas Populares',
        descriptions: {
            1: 'Bumba Meu Boi é auto popular nordestino que narra morte e ressurreição de um boi. Origem colonial (séc. XVIII), mescla elementos indígenas (totemismo), africanos (ancestralidade) e europeus (teatro medieval).',
            2: 'Enredo clássico: Pai Francisco mata boi do patrão para satisfazer desejo da esposa Catirina (grávida). Descoberto o crime, o boi é ressuscitado por pajé/curandeiro. Representa ciclos de morte/renascimento, justiça social.',
            3: 'Personagens típicos: Amo (fazendeiro), Pai Francisco (vaqueiro), Catirina (esposa), Boi (protagonista), Pajé (curandeiro), Vaqueiros, Caboclos de Pena, Cazumbas (figuras cômicas). Cada um com função dramática específica.',
            4: 'Variações regionais: Maranhão (sotaques: Baixada, Orquídea, Zabumba), Amazonas (Boi-Bumba de Parintins), Pernambuco (Boi de Carnaval), Alagoas (Folguedo do Boi). Cada região com música, dança, indumentária próprias.',
            5: 'Patrimônio Cultural Imaterial da Humanidade (UNESCO, 2019). Representa sincretismo cultural brasileiro, resistência das tradições populares, criatividade coletiva. Símbolo da diversidade cultural nacional e capacidade de reinvenção artística popular.'
        }
    },
    'Festival de Parintins': {
        icon: 'fas fa-calendar-alt',
        category: 'Festas Populares',
        descriptions: {
            1: 'Festival Folclórico de Parintins é competição anual entre bois Garantido (vermelho) e Caprichoso (azul) na ilha de Parintins (AM). Baseado na lenda do Bumba Meu Boi, tornou-se maior espetáculo da Amazônia.',
            2: 'História: iniciado em 1965 como brincadeira local. Bumbodódromo (1988) - arena com 35 mil lugares. Cada boi apresenta 3 noites (29, 30 junho, 1º julho), 2h30 de espetáculo. Julgamento por quesitos: toada, dança, alegorias, fantasia.',
            3: 'Elementos artísticos: toadas (músicas narrativas), alegorias gigantes (15m altura), danças regionais (sinhazinha, porta-estandarte, pajés), boi-arte (escultura central), rituais indígenas, lendas amazônicas.',
            4: 'Impacto regional: 100 mil visitantes/ano, R$ 120 milhões economia local. Transmissão nacional (TV Globo), internacional (TV Brasil). Revitalização cultural amazônica, valorização de artistas regionais.',
            5: 'Maior manifestação cultural da Amazônia que preserva identidade regional brasileira. Representa criatividade popular, sustentabilidade cultural, orgulho regional. Conecta tradição indígena com modernidade, projetando Amazônia culturalmente no mundo.'
        }
    }
};
    'Festa Junina': {
        icon: 'fas fa-calendar-alt',
        category: 'Festas Populares',
        descriptions: {
            1: 'Festas Juninas celebram santos católicos (Antônio, João, Pedro) em junho.',
            2: 'Origem europeia adaptada ao Brasil colonial, misturada com rituais indígenas.',
            3: 'Tradições: quadrilha, fogueira, comidas típicas (pamonha, quentao, pé-de-moleque).',
            4: 'Maior festa do interior brasileiro, fortalece identidade rural e comunitária.',
            5: 'Preserva tradições populares e religiosidade brasileira, patrimônio cultural nacional.'
        }
    },
    'Bumba Meu Boi': {
        icon: 'fas fa-calendar-alt',
        category: 'Festas Populares',
        descriptions: {
            1: 'Bumba Meu Boi é auto popular nordestino que narra morte e ressurreição de um boi.',
            2: 'Origem colonial, mescla elementos indígenas, africanos e europeus.',
            3: 'Personagens: Pai Francisco, Catirina, Amo, Vaqueiros, cada com função específica.',
            4: 'Patrimônio Cultural Imaterial da Humanidade (UNESCO, 2019).',
            5: 'Representa sincretismo cultural brasileiro e resistência das tradições populares.'
        }
    },
    'Festival de Parintins': {
        icon: 'fas fa-calendar-alt',
        category: 'Festas Populares',
        descriptions: {
            1: 'Festival de Parintins é competição entre bois Garantido (vermelho) e Caprichoso (azul).',
            2: 'Realizado anualmente em Parintins (AM), baseado na lenda do Bumba Meu Boi.',
            3: 'Espetáculo grandioso com alegorias, danças e toadas que contam lendas amazônicas.',
            4: 'Movimenta economia local, atrai turistas nacionais e internacionais.',
            5: 'Maior manifestação cultural da Amazônia, preserva identidade regional brasileira.'
        }
    }
};

// Função para obter nome do nível
function getLevelName(level) {
    const levels = ['', 'Iniciante', 'Aprendiz', 'Conhecedor', 'Especialista', 'Mestre'];
    return levels[level] || 'Iniciante';
}

// Função para atualizar biblioteca
function updateLibrary() {
    const ownedKnowledgeContainer = document.getElementById('owned-knowledge');
    const emptyLibrary = document.getElementById('empty-library');
    
    // Limpa conteúdo atual (exceto mensagem vazia)
    const knowledgeCards = ownedKnowledgeContainer.querySelectorAll('.knowledge-card');
    knowledgeCards.forEach(card => card.remove());
    
    if (Object.keys(ownedKnowledge).length === 0) {
        emptyLibrary.style.display = 'block';
        return;
    }
    
    emptyLibrary.style.display = 'none';
    
    // Adiciona cada conhecimento adquirido
    Object.entries(ownedKnowledge).forEach(([name, level]) => {
        const data = knowledgeData[name];
        if (!data) return;
        
        // Obtém a descrição do nível atual
        const description = data.descriptions[level] || data.descriptions[1];
        
        const knowledgeCard = document.createElement('div');
        knowledgeCard.className = 'knowledge-card';
        knowledgeCard.innerHTML = `
            <i class="${data.icon}"></i>
            <h3>${name} - Nível ${level}</h3>
            <p class="knowledge-description">${description}</p>
            <div class="progress-bar">
                <div class="progress" style="width: ${(level / 5) * 100}%"></div>
            </div>
            <div class="knowledge-controls">
                <span class="level-info">${level}/5 - ${getLevelName(level)}</span>
                <button class="level-selector-btn" onclick="openLevelSelector('${name}', ${level})">
                    <i class="fas fa-book-open"></i> Ver Níveis
                </button>
            </div>
        `;
        
        ownedKnowledgeContainer.insertBefore(knowledgeCard, emptyLibrary);
    });
}

// Inicialização quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    
    // Sistema de compra na loja
    const buyButtons = document.querySelectorAll('.buy-btn');
    const pcCountElement = document.querySelector('.pc-count');
    let currentPC = parseInt(pcCountElement.textContent);
    
    buyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const shopItem = this.closest('.shop-item');
            const itemName = shopItem.querySelector('h4').textContent;
            const price = 1;
            
            if (currentPC >= price) {
                currentPC -= price;
                pcCountElement.textContent = currentPC;
                
                if (ownedKnowledge[itemName]) {
                    if (ownedKnowledge[itemName] < 5) {
                        ownedKnowledge[itemName]++;
                        showNotification(`${itemName} evoluiu para nível ${ownedKnowledge[itemName]}!`);
                    } else {
                        showNotification(`${itemName} já está no nível máximo!`, 'error');
                        currentPC += price;
                        pcCountElement.textContent = currentPC;
                        return;
                    }
                } else {
                    ownedKnowledge[itemName] = 1;
                    showNotification(`${itemName} adquirido com sucesso!`);
                }
                
                updateLibrary();
                
                const currentLevel = ownedKnowledge[itemName];
                if (currentLevel >= 5) {
                    this.textContent = 'Máximo';
                    this.style.background = '#666666';
                    this.disabled = true;
                } else {
                    this.textContent = `Evoluir (${currentLevel}/5)`;
                }
            } else {
                showNotification('Pontos de Conhecimento insuficientes!', 'error');
            }
        });
    });
    
    updateLibrary();
});

// Função para abrir seletor de níveis
function openLevelSelector(knowledgeName, maxLevel) {
    const modal = document.createElement('div');
    modal.className = 'level-modal';
    modal.innerHTML = `
        <div class="level-modal-content">
            <div class="level-modal-header">
                <h3>${knowledgeName}</h3>
                <button class="close-modal" onclick="this.closest('.level-modal').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="level-list">
                ${Array.from({length: maxLevel}, (_, i) => {
                    const level = i + 1;
                    const levelName = getLevelName(level);
                    return `
                        <button class="level-item" onclick="showLevelDescription('${knowledgeName}', ${level})">
                            <span class="level-number">${level}</span>
                            <span class="level-name">${levelName}</span>
                        </button>
                    `;
                }).join('')}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Função para mostrar descrição de nível específico
function showLevelDescription(knowledgeName, level) {
    const data = knowledgeData[knowledgeName];
    if (!data) return;
    
    const description = data.descriptions[level];
    const levelName = getLevelName(level);
    
    // Atualiza a descrição na biblioteca
    const knowledgeCards = document.querySelectorAll('.knowledge-card');
    knowledgeCards.forEach(card => {
        const title = card.querySelector('h3').textContent;
        if (title.includes(knowledgeName)) {
            const descriptionElement = card.querySelector('.knowledge-description');
            descriptionElement.textContent = description;
            
            // Atualiza o título para mostrar o nível selecionado
            const currentLevel = ownedKnowledge[knowledgeName];
            card.querySelector('h3').textContent = `${knowledgeName} - Nível ${level} (${levelName})`;
            
            // Se não for o nível atual, adiciona indicação
            if (level !== currentLevel) {
                card.querySelector('h3').innerHTML += ` <small style="opacity: 0.7">(Visualizando)</small>`;
            }
        }
    });
    
    // Fecha o modal
    document.querySelector('.level-modal').remove();
    
    showNotification(`Visualizando ${knowledgeName} - Nível ${level}`);
}

// Sistema de notificações simples
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#228B22' : '#A34A39'};
        color: white;
        padding: 1rem;
        border-radius: 8px;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}