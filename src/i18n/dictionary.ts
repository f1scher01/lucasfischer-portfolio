/**
 * Dicionário PT/EN/FR/ES: fonte única de strings do site.
 * PT é o default (pré-renderizado); os demais idiomas trocam no client via LangProvider.
 * Todo idioma precisa ter exatamente a mesma forma de `pt` (garantido pelo tipo Dict).
 */

export const LANGS = ["pt", "en", "fr", "es"] as const;
export type Lang = (typeof LANGS)[number];

export const HTML_LANG: Record<Lang, string> = { pt: "pt-BR", en: "en", fr: "fr", es: "es" };

const pt = {
  nav: {
    getInTouch: "Contato ↗",
    menuOpen: "Abrir menu",
    menuClose: "Fechar menu",
    menuLabel: "Navegação",
    language: "Idioma",
    sections: { about: "Sobre", work: "Projetos", toolkit: "Ferramentas", credentials: "Certificações", contact: "Contato" },
  },
  hero: {
    kicker: "Lucas Fischer Paez · Engenharia Mecânica · IMT",
    l1: "Engenharia mecânica.",
    l2: "Física, dados",
    l3: "e código.",
    sub: "Estudante do 2º ano no Instituto Mauá de Tecnologia. Modelo fenômenos físicos, trabalho com dados reais e escrevo as ferramentas para analisá-los.",
    hint: "Mova o cursor · a viga responde",
    badgeRunning: "simulação automática · toque para pausar",
    badgePaused: "simulação pausada · toque para retomar",
    hud: {
      title: "Viga em flexão, em tempo real",
      utilization: "Utilização da tensão de escoamento",
      compression: "compressão",
      tension: "tração",
    },
  },
  physics: {
    eyebrow: "Física em tempo real",
    h1: "A viga acima não é um vídeo. É ",
    hAccent: "Euler-Bernoulli",
    h2: " resolvida a cada quadro, a partir do seu cursor.",
    eq: [
      { label: "Momento de inércia", note: "seção retangular" },
      { label: "Tensão de flexão", note: "fibra extrema" },
      { label: "Deflexão no centro", note: "viga biapoiada" },
    ],
    specs:
      "Aço 1020 · E = 200 GPa · σ_y = 250 MPa · L = 1 m · seção 30×50 mm · compressão em tons frios e tração em tons quentes, como em software de elementos finitos",
  },
  about: {
    eyebrow: "Sobre",
    h1: "Engenheiro em formação,",
    h2: "orientado por dados.",
    lead1: "Estudante de Engenharia Mecânica no ",
    leadAccent: "Instituto Mauá de Tecnologia",
    lead2:
      ", no 2º ano, com coeficiente de rendimento 8,23. Gosto de problemas em que física, dados e software precisam fechar a mesma conta.",
    p1: "Minha base é mecânica: projeto em CAD, análise por elementos finitos, seleção de materiais e motores. Nos projetos pessoais levo o mesmo rigor para os dados, com um pipeline que cruza satélite, qualidade do ar e internações do SUS e um simulador de telemetria em que o tempo de volta sai da física.",
    p2: "Tenho cidadania brasileira e espanhola, falo português, espanhol e inglês e estudo francês (TCF B1, compreensão em nível B2) com o objetivo de continuar a formação em engenharia na França.",
    stats: [
      { value: "8,23", label: "Coeficiente de rendimento" },
      { value: "360 h", label: "Atividades extracurriculares certificadas" },
      { value: "4", label: "Idiomas" },
      { value: "3", label: "Projetos com código aberto" },
    ],
  },
  disciplines: {
    eyebrow: "Áreas",
    h: "Onde a física encontra os dados.",
    items: [
      { title: "Análise estrutural e FEA", desc: "Dimensionamento por elementos finitos no Ansys: malha, condições de contorno, tensão de von Mises e fator de segurança." },
      { title: "Projeto em CAD", desc: "SolidWorks, Siemens NX, CATIA 3DEXPERIENCE e AutoCAD, de peças isoladas a conjuntos mecânicos." },
      { title: "Seleção de materiais", desc: "Restrições de projeto, índices de mérito e análise de custo no Ansys Granta EduPack." },
      { title: "Dados geoespaciais", desc: "NetCDF de satélite, GDAL, QGIS e PyQGIS aplicados a dados reais de qualidade do ar e saúde." },
      { title: "Séries temporais", desc: "Modelagem, ingestão e visualização de sinais físicos com Python, InfluxDB e Grafana." },
      { title: "Motores", desc: "Desmontagem, ensaio em dinamômetro e fundamentos de motores de combustão interna." },
    ],
  },
  dyno: {
    eyebrow: "Bancada virtual",
    h1: "Segure o acelerador.",
    h2: "Sinta o motor.",
    desc: "Simulação longitudinal de um carro esportivo: câmbio de 6 marchas com corte de torque, arrasto aerodinâmico e som de motor comandado pela rotação. Cronometre seu 0 a 100.",
    specs: "6 marchas · 0 a 100 em cerca de 3,2 s · ronco real de V8 na partida · estalos de escape ao aliviar",
    redline: "corte",
    gear: "marcha",
    best: "melhor",
    hold: "SEGURE PARA ACELERAR ⏯",
    holding: "ACELERANDO…",
    soundOn: "🔊 som ligado",
    soundOff: "🔈 ativar som",
  },
  work: {
    eyebrow: "Projetos",
    h: "O que tenho construído",
    context: "Contexto",
    code: "Código ↗",
    demo: "Ver no ar ↗",
    projects: [
      {
        title: "Poluição do ar e saúde na RMSP",
        role: "Projeto autônomo · 2026",
        blurb: "Pipeline em Python que cruza aerossóis medidos por satélite, a rede de qualidade do ar da CETESB e internações do SUS na Região Metropolitana de São Paulo.",
        bullets: [
          "Leitura de NetCDF-4 do satélite GOES-19 e reprojeção da grade geoestacionária com GDAL.",
          "Doze meses do SIH/SUS lidos direto dos arquivos do DATASUS: 102 mil internações respiratórias agregadas por município.",
          "Mapas gerados por PyQGIS, com os limites do que os dados sustentam documentados no repositório.",
        ],
      },
      {
        title: "Simulador de telemetria veicular",
        role: "Projeto autônomo · 2025–2026",
        blurb: "Modelo físico de uma volta em Interlagos alimentando um pipeline de séries temporais com InfluxDB e Grafana.",
        bullets: [
          "Avanço por distância percorrida, aceleração lateral por v²/R e resposta térmica de primeira ordem.",
          "Ingestão por Line Protocol, dashboard em Flux provisionado e cockpit web que reproduz a volta a 10 Hz.",
        ],
      },
      {
        title: "Otimização estrutural de componente veicular",
        role: "IMT · Dimensionamento e otimização estrutural veicular · 2025",
        blurb: "Alívio de massa de um componente mecânico com validação por elementos finitos.",
        bullets: [
          "Análise estática no Ansys Workbench, com malha de 7.699 elementos e condições de uso definidas junto a um piloto profissional.",
          "Após a remoção do material sem função estrutural: tensão de von Mises máxima de 21 MPa contra 250 MPa de escoamento, fator de segurança próximo de 12.",
        ],
      },
      {
        title: "Painel sensorial para crianças com TEA",
        role: "Projeto Integrador Extensionista · IMT · 2026",
        blurb: "Seleção de material e de processo para o painel principal de um brinquedo sensorial para crianças de 3 a 8 anos, em equipe de seis alunos.",
        bullets: [
          "Índices de mérito para painel em flexão, E^(1/3)/ρ e σy^(2/3)/ρ, com filtro de tenacidade à fratura no Ansys Granta EduPack.",
          "MDF escolhido pela relação entre rigidez, massa e custo, com corte a laser no FabLab e peças em PLA por impressão 3D.",
        ],
      },
      {
        title: "Motor de kart: dinamômetro e competição",
        role: "Motores de Combustão Interna · IMT · 2025",
        blurb: "Desmontagem completa de um motor e ensaios em dinamômetro. Só o grupo com a melhor otimização ganhava o direito de competir.",
        bullets: [
          "Nosso grupo foi o selecionado e levou o kart para correr contra equipes de séries mais avançadas.",
          "A prova aconteceu depois do fim da atividade. Concluímos em três pessoas, fora do horário de aula, e o kart andou.",
        ],
      },
      {
        title: "Notas e CR para Engenharia Mecânica",
        role: "Projeto pessoal · em produção · 2026",
        blurb: "Aplicativo instalável que calcula médias pelas regras de cada plano de ensino e projeta o coeficiente de rendimento.",
        bullets: [
          "Roda inteiro no navegador, sem servidor e sem login: nenhuma nota sai do aparelho de quem usa.",
          "Em uso por colegas de curso, com Service Worker para funcionar sem conexão.",
        ],
      },
    ],
  },
  toolkit: {
    eyebrow: "Ferramentas",
    h: "Ferramentas e onde as usei",
    sub: "Sem barras de proficiência: cada item aponta para o trabalho em que foi aplicado.",
    groups: [
      {
        title: "CAD e CAE",
        items: [
          { name: "Ansys Workbench · Mechanical", note: "análise estática e otimização estrutural" },
          { name: "Ansys Granta EduPack", note: "seleção de materiais no projeto extensionista" },
          { name: "Siemens NX", note: "atividade de 40 h em conjuntos mecânicos" },
          { name: "CATIA 3DEXPERIENCE", note: "atividade de 40 h de introdução" },
          { name: "SolidWorks · AutoCAD", note: "modelagem de peças e desenho técnico" },
        ],
      },
      {
        title: "Dados e programação",
        items: [
          { name: "Python · NumPy · Pandas · SciPy", note: "pipelines com dados reais e métodos numéricos" },
          { name: "GDAL · QGIS · PyQGIS", note: "NetCDF de satélite, reprojeção e mapas por script" },
          { name: "InfluxDB · Grafana · Docker", note: "séries temporais do simulador de telemetria" },
          { name: "MATLAB · Minitab", note: "laboratórios de física e estatística" },
          { name: "JavaScript · TypeScript", note: "aplicativo de notas e este site" },
        ],
      },
      {
        title: "Métodos e fabricação",
        items: [
          { name: "Lean Six Sigma Green Belt", note: "projeto DMAIC entregue à instituição" },
          { name: "Impressão 3D · corte a laser", note: "prototipagem no FabLab do IMT" },
        ],
      },
      {
        title: "Idiomas",
        items: [
          { name: "Português", note: "nativo" },
          { name: "Español", note: "avançado" },
          { name: "English", note: "avançado" },
          { name: "Français", note: "TCF Tout Public B1, compreensão oral e escrita em B2" },
        ],
      },
    ],
  },
  credentials: {
    eyebrow: "Certificações",
    h: "Formação complementar",
    desc1: "Nove atividades de 40 h no programa de Projetos e Atividades Especiais do IMT, somando ",
    descStrong: "360 horas",
    desc2: ", além de certificações externas.",
    groups: [
      {
        title: "Engenharia e CAE",
        items: [
          { name: "Dimensionamento e otimização estrutural veicular", meta: "IMT · 40 h" },
          { name: "Modelamento de conjuntos mecânicos no Siemens NX", meta: "IMT · 40 h" },
          { name: "3DEXPERIENCE: introdução ao CATIA", meta: "IMT · 40 h" },
          { name: "Motores de combustão interna de veículos", meta: "IMT · 40 h" },
          { name: "Simulação: a base da engenharia moderna", meta: "Instituto ESSS · 7 h" },
        ],
      },
      {
        title: "Métodos e dados",
        items: [
          { name: "Lean Six Sigma Green Belt", meta: "IMT · 40 h" },
          { name: "Telemetria para competições acadêmicas", meta: "IMT · 40 h" },
          { name: "A bolsa de valores no Brasil e seus ativos", meta: "IMT · 40 h" },
        ],
      },
      {
        title: "Extensão e idiomas",
        items: [
          { name: "Projeto Integrador Extensionista", meta: "IMT · 40 h" },
          { name: "Introdução à língua francesa (A1.1)", meta: "IMT · 40 h" },
          { name: "TCF Tout Public", meta: "France Éducation International · B1" },
          { name: "Défi InterAlliances 2026", meta: "1º na etapa local · 4º na final nacional" },
        ],
      },
    ],
  },
  contact: {
    eyebrow: "Contato",
    h1: "Vamos conversar",
    h2: "sobre engenharia.",
    desc: "Aberto a estágio, iniciação científica e intercâmbio acadêmico. Respondo por e-mail ou pelo LinkedIn.",
    email: "E-mail",
    copy: "copiar e-mail",
    copied: "copiado ✓",
  },
  footer: { rights: "São Paulo, BR" },
  preloader: { line: "Calibrando célula de carga · malha estrutural" },
};

export type Dict = typeof pt;

const en: Dict = {
  nav: {
    getInTouch: "Get in touch ↗",
    menuOpen: "Open menu",
    menuClose: "Close menu",
    menuLabel: "Navigation",
    language: "Language",
    sections: { about: "About", work: "Projects", toolkit: "Tools", credentials: "Certifications", contact: "Contact" },
  },
  hero: {
    kicker: "Lucas Fischer Paez · Mechanical Engineering · IMT",
    l1: "Mechanical engineering.",
    l2: "Physics, data",
    l3: "and code.",
    sub: "Second-year student at Instituto Mauá de Tecnologia. I model physical phenomena, work with real data and write the tools to analyze them.",
    hint: "Move your cursor · the beam responds",
    badgeRunning: "auto simulation · tap to pause",
    badgePaused: "simulation paused · tap to resume",
    hud: {
      title: "Beam in bending, live",
      utilization: "Yield stress utilization",
      compression: "compression",
      tension: "tension",
    },
  },
  physics: {
    eyebrow: "Real-time physics",
    h1: "The beam above is not a video. It is ",
    hAccent: "Euler-Bernoulli",
    h2: " solved every frame, driven by your cursor.",
    eq: [
      { label: "Moment of inertia", note: "rectangular section" },
      { label: "Bending stress", note: "extreme fiber" },
      { label: "Center deflection", note: "simply supported beam" },
    ],
    specs:
      "1020 steel · E = 200 GPa · σ_y = 250 MPa · L = 1 m · 30×50 mm section · compression in cool tones and tension in warm tones, as in finite element software",
  },
  about: {
    eyebrow: "About",
    h1: "Engineer in training,",
    h2: "driven by data.",
    lead1: "Mechanical Engineering student at ",
    leadAccent: "Instituto Mauá de Tecnologia",
    lead2:
      ", second year, with a cumulative GPA of 8.23 out of 10. I enjoy problems where physics, data and software have to add up to the same answer.",
    p1: "My foundation is mechanical: CAD design, finite element analysis, materials selection and engines. In my own projects I bring the same rigor to data, with a pipeline that combines satellite retrievals, air quality stations and public hospital admissions, and a telemetry simulator whose lap time comes out of the physics.",
    p2: "I hold Brazilian and Spanish citizenship, speak Portuguese, Spanish and English, and study French (TCF B1, comprehension at B2) with the goal of continuing my engineering education in France.",
    stats: [
      { value: "8.23", label: "Cumulative GPA (out of 10)" },
      { value: "360 h", label: "Certified extracurricular activities" },
      { value: "4", label: "Languages" },
      { value: "3", label: "Open-source projects" },
    ],
  },
  disciplines: {
    eyebrow: "Fields",
    h: "Where physics meets data.",
    items: [
      { title: "Structural analysis and FEA", desc: "Finite element sizing in Ansys: meshing, boundary conditions, von Mises stress and safety factor." },
      { title: "CAD design", desc: "SolidWorks, Siemens NX, CATIA 3DEXPERIENCE and AutoCAD, from single parts to mechanical assemblies." },
      { title: "Materials selection", desc: "Design constraints, material indices and cost analysis in Ansys Granta EduPack." },
      { title: "Geospatial data", desc: "Satellite NetCDF, GDAL, QGIS and PyQGIS applied to real air quality and health data." },
      { title: "Time series", desc: "Modeling, ingestion and visualization of physical signals with Python, InfluxDB and Grafana." },
      { title: "Engines", desc: "Teardown, dynamometer testing and internal combustion engine fundamentals." },
    ],
  },
  dyno: {
    eyebrow: "Virtual test bench",
    h1: "Hold the throttle.",
    h2: "Feel the engine.",
    desc: "Longitudinal simulation of a sports car: 6-speed gearbox with torque cut, aerodynamic drag and an engine sound driven by rpm. Time your 0 to 100 km/h.",
    specs: "6 gears · 0 to 100 km/h in about 3.2 s · real V8 rev on start · exhaust crackle on lift-off",
    redline: "redline",
    gear: "gear",
    best: "best",
    hold: "HOLD TO ACCELERATE ⏯",
    holding: "ACCELERATING…",
    soundOn: "🔊 sound on",
    soundOff: "🔈 enable sound",
  },
  work: {
    eyebrow: "Projects",
    h: "What I have been building",
    context: "Context",
    code: "Code ↗",
    demo: "Live ↗",
    projects: [
      {
        title: "Air pollution and health in São Paulo",
        role: "Independent project · 2026",
        blurb: "Python pipeline that combines satellite aerosol retrievals, the CETESB air quality network and public hospital admissions in the São Paulo Metropolitan Region.",
        bullets: [
          "Reads GOES-19 NetCDF-4 files and reprojects the geostationary grid with GDAL.",
          "Twelve months of SIH/SUS read straight from DATASUS files: 102 thousand respiratory admissions aggregated by municipality.",
          "Maps generated with PyQGIS, with the limits of what the data supports documented in the repository.",
        ],
      },
      {
        title: "Vehicle telemetry simulator",
        role: "Independent project · 2025–2026",
        blurb: "Physical model of a lap at Interlagos feeding a time-series pipeline with InfluxDB and Grafana.",
        bullets: [
          "Distance-based position, lateral acceleration from v²/R and first-order thermal response.",
          "Line Protocol ingestion, a provisioned Flux dashboard and a web cockpit that replays the lap at 10 Hz.",
        ],
      },
      {
        title: "Structural optimization of a vehicle component",
        role: "IMT · Vehicle structural sizing and optimization · 2025",
        blurb: "Mass reduction of a mechanical component validated by finite element analysis.",
        bullets: [
          "Static analysis in Ansys Workbench with a 7,699-element mesh and load cases defined with a professional racing driver.",
          "After removing material with no structural role: maximum von Mises stress of 21 MPa against a 250 MPa yield strength, safety factor close to 12.",
        ],
      },
      {
        title: "Sensory panel for autistic children",
        role: "University extension project · IMT · 2026",
        blurb: "Material and process selection for the main panel of a sensory toy for children aged 3 to 8, in a team of six students.",
        bullets: [
          "Material indices for a panel in bending, E^(1/3)/ρ and σy^(2/3)/ρ, with a fracture toughness filter in Ansys Granta EduPack.",
          "MDF selected for its balance of stiffness, mass and cost, laser cut at the FabLab, with PLA parts made by 3D printing.",
        ],
      },
      {
        title: "Kart engine: dynamometer and race",
        role: "Internal Combustion Engines · IMT · 2025",
        blurb: "Complete engine teardown and dynamometer testing. Only the group with the best optimization earned the right to race.",
        bullets: [
          "Our group was selected and took the kart to race against teams from more advanced years.",
          "The race happened after the course had ended. We finished it as a team of three, outside class hours, and the kart ran.",
        ],
      },
      {
        title: "Grades and GPA for Mechanical Engineering",
        role: "Personal project · in production · 2026",
        blurb: "Installable app that computes final grades from each syllabus and projects the cumulative GPA.",
        bullets: [
          "Runs entirely in the browser, with no server and no login: no grade ever leaves the user's device.",
          "Used by classmates, with a Service Worker so it works offline.",
        ],
      },
    ],
  },
  toolkit: {
    eyebrow: "Tools",
    h: "Tools and where I used them",
    sub: "No proficiency bars: every item points to the work where it was applied.",
    groups: [
      {
        title: "CAD and CAE",
        items: [
          { name: "Ansys Workbench · Mechanical", note: "static analysis and structural optimization" },
          { name: "Ansys Granta EduPack", note: "materials selection in the extension project" },
          { name: "Siemens NX", note: "40 h course on mechanical assemblies" },
          { name: "CATIA 3DEXPERIENCE", note: "40 h introductory course" },
          { name: "SolidWorks · AutoCAD", note: "part modeling and technical drawing" },
        ],
      },
      {
        title: "Data and programming",
        items: [
          { name: "Python · NumPy · Pandas · SciPy", note: "real-data pipelines and numerical methods" },
          { name: "GDAL · QGIS · PyQGIS", note: "satellite NetCDF, reprojection and scripted maps" },
          { name: "InfluxDB · Grafana · Docker", note: "time series from the telemetry simulator" },
          { name: "MATLAB · Minitab", note: "physics and statistics labs" },
          { name: "JavaScript · TypeScript", note: "grades app and this website" },
        ],
      },
      {
        title: "Methods and fabrication",
        items: [
          { name: "Lean Six Sigma Green Belt", note: "DMAIC project delivered to the institution" },
          { name: "3D printing · laser cutting", note: "prototyping at the IMT FabLab" },
        ],
      },
      {
        title: "Languages",
        items: [
          { name: "Português", note: "native" },
          { name: "Español", note: "advanced" },
          { name: "English", note: "advanced" },
          { name: "Français", note: "TCF Tout Public B1, listening and reading at B2" },
        ],
      },
    ],
  },
  credentials: {
    eyebrow: "Certifications",
    h: "Complementary training",
    desc1: "Nine 40-hour activities in the IMT Special Projects and Activities program, totaling ",
    descStrong: "360 hours",
    desc2: ", plus external certifications.",
    groups: [
      {
        title: "Engineering and CAE",
        items: [
          { name: "Vehicle structural sizing and optimization", meta: "IMT · 40 h" },
          { name: "Mechanical assembly modeling in Siemens NX", meta: "IMT · 40 h" },
          { name: "3DEXPERIENCE: introduction to CATIA", meta: "IMT · 40 h" },
          { name: "Vehicle internal combustion engines", meta: "IMT · 40 h" },
          { name: "Simulation: the foundation of modern engineering", meta: "ESSS Institute · 7 h" },
        ],
      },
      {
        title: "Methods and data",
        items: [
          { name: "Lean Six Sigma Green Belt", meta: "IMT · 40 h" },
          { name: "Telemetry for academic competitions", meta: "IMT · 40 h" },
          { name: "The Brazilian stock exchange and its assets", meta: "IMT · 40 h" },
        ],
      },
      {
        title: "Extension and languages",
        items: [
          { name: "University extension project", meta: "IMT · 40 h" },
          { name: "Introduction to French (A1.1)", meta: "IMT · 40 h" },
          { name: "TCF Tout Public", meta: "France Éducation International · B1" },
          { name: "Défi InterAlliances 2026", meta: "1st in the local round · 4th in the national final" },
        ],
      },
    ],
  },
  contact: {
    eyebrow: "Contact",
    h1: "Let's talk",
    h2: "engineering.",
    desc: "Open to internships, undergraduate research and academic exchange. I reply by email or on LinkedIn.",
    email: "Email",
    copy: "copy email",
    copied: "copied ✓",
  },
  footer: { rights: "São Paulo, Brazil" },
  preloader: { line: "Calibrating load cell · structural mesh" },
};

const fr: Dict = {
  nav: {
    getInTouch: "Contact ↗",
    menuOpen: "Ouvrir le menu",
    menuClose: "Fermer le menu",
    menuLabel: "Navigation",
    language: "Langue",
    sections: { about: "À propos", work: "Projets", toolkit: "Outils", credentials: "Certifications", contact: "Contact" },
  },
  hero: {
    kicker: "Lucas Fischer Paez · Génie mécanique · IMT",
    l1: "Génie mécanique.",
    l2: "Physique, données",
    l3: "et code.",
    sub: "Étudiant en deuxième année à l'Instituto Mauá de Tecnologia. Je modélise des phénomènes physiques, je travaille avec des données réelles et j'écris les outils pour les analyser.",
    hint: "Bougez le curseur · la poutre réagit",
    badgeRunning: "simulation automatique · touchez pour mettre en pause",
    badgePaused: "simulation en pause · touchez pour reprendre",
    hud: {
      title: "Poutre en flexion, en temps réel",
      utilization: "Taux d'utilisation de la limite d'élasticité",
      compression: "compression",
      tension: "traction",
    },
  },
  physics: {
    eyebrow: "Physique en temps réel",
    h1: "La poutre ci-dessus n'est pas une vidéo. C'est ",
    hAccent: "Euler-Bernoulli",
    h2: ", résolue à chaque image à partir de votre curseur.",
    eq: [
      { label: "Moment d'inertie", note: "section rectangulaire" },
      { label: "Contrainte de flexion", note: "fibre extrême" },
      { label: "Flèche au centre", note: "poutre sur deux appuis" },
    ],
    specs:
      "Acier 1020 · E = 200 GPa · σ_y = 250 MPa · L = 1 m · section 30×50 mm · compression en tons froids et traction en tons chauds, comme dans un logiciel d'éléments finis",
  },
  about: {
    eyebrow: "À propos",
    h1: "Ingénieur en formation,",
    h2: "guidé par les données.",
    lead1: "Étudiant en génie mécanique à l'",
    leadAccent: "Instituto Mauá de Tecnologia",
    lead2:
      ", en deuxième année, avec une moyenne générale de 8,23 sur 10. J'aime les problèmes où la physique, les données et le logiciel doivent aboutir au même résultat.",
    p1: "Ma base est mécanique : conception en CAO, analyse par éléments finis, choix des matériaux et moteurs. Dans mes projets personnels, j'applique la même rigueur aux données, avec une chaîne de traitement qui croise satellite, qualité de l'air et hospitalisations du système public de santé, et un simulateur de télémétrie dont le temps au tour découle de la physique.",
    p2: "J'ai la double nationalité brésilienne et espagnole, je parle portugais, espagnol et anglais, et j'étudie le français (TCF B1, compréhension au niveau B2) dans le but de poursuivre ma formation d'ingénieur en France.",
    stats: [
      { value: "8,23", label: "Moyenne générale (sur 10)" },
      { value: "360 h", label: "Activités extracurriculaires certifiées" },
      { value: "4", label: "Langues" },
      { value: "3", label: "Projets en code ouvert" },
    ],
  },
  disciplines: {
    eyebrow: "Domaines",
    h: "Là où la physique rencontre les données.",
    items: [
      { title: "Analyse structurelle et éléments finis", desc: "Dimensionnement par éléments finis sous Ansys : maillage, conditions aux limites, contrainte de von Mises et coefficient de sécurité." },
      { title: "Conception en CAO", desc: "SolidWorks, Siemens NX, CATIA 3DEXPERIENCE et AutoCAD, de la pièce isolée à l'assemblage mécanique." },
      { title: "Choix des matériaux", desc: "Contraintes de conception, indices de performance et analyse de coût avec Ansys Granta EduPack." },
      { title: "Données géospatiales", desc: "NetCDF satellitaire, GDAL, QGIS et PyQGIS appliqués à des données réelles de qualité de l'air et de santé." },
      { title: "Séries temporelles", desc: "Modélisation, ingestion et visualisation de signaux physiques avec Python, InfluxDB et Grafana." },
      { title: "Moteurs", desc: "Démontage, essais au banc dynamométrique et fondamentaux des moteurs à combustion interne." },
    ],
  },
  dyno: {
    eyebrow: "Banc d'essai virtuel",
    h1: "Gardez l'accélérateur enfoncé.",
    h2: "Sentez le moteur.",
    desc: "Simulation longitudinale d'une voiture de sport : boîte à 6 rapports avec coupure de couple, traînée aérodynamique et son moteur piloté par le régime. Chronométrez votre 0 à 100 km/h.",
    specs: "6 rapports · 0 à 100 km/h en environ 3,2 s · vrai son de V8 au démarrage · pétarades à l'échappement au lever de pied",
    redline: "zone rouge",
    gear: "rapport",
    best: "record",
    hold: "MAINTENIR POUR ACCÉLÉRER ⏯",
    holding: "ACCÉLÉRATION…",
    soundOn: "🔊 son activé",
    soundOff: "🔈 activer le son",
  },
  work: {
    eyebrow: "Projets",
    h: "Ce que j'ai construit",
    context: "Contexte",
    code: "Code ↗",
    demo: "En ligne ↗",
    projects: [
      {
        title: "Pollution de l'air et santé à São Paulo",
        role: "Projet personnel · 2026",
        blurb: "Chaîne de traitement en Python qui croise les aérosols mesurés par satellite, le réseau de qualité de l'air de la CETESB et les hospitalisations du système public dans la région métropolitaine de São Paulo.",
        bullets: [
          "Lecture de fichiers NetCDF-4 du satellite GOES-19 et reprojection de la grille géostationnaire avec GDAL.",
          "Douze mois de SIH/SUS lus directement dans les fichiers du DATASUS : 102 000 hospitalisations respiratoires agrégées par commune.",
          "Cartes générées avec PyQGIS, et limites de ce que les données permettent de conclure documentées dans le dépôt.",
        ],
      },
      {
        title: "Simulateur de télémétrie automobile",
        role: "Projet personnel · 2025–2026",
        blurb: "Modèle physique d'un tour à Interlagos qui alimente une chaîne de séries temporelles avec InfluxDB et Grafana.",
        bullets: [
          "Position calculée par distance parcourue, accélération latérale par v²/R et réponse thermique du premier ordre.",
          "Ingestion par Line Protocol, tableau de bord Flux provisionné et cockpit web qui rejoue le tour à 10 Hz.",
        ],
      },
      {
        title: "Optimisation structurelle d'une pièce automobile",
        role: "IMT · Dimensionnement et optimisation structurelle automobile · 2025",
        blurb: "Allègement d'une pièce mécanique validé par éléments finis.",
        bullets: [
          "Analyse statique sous Ansys Workbench avec un maillage de 7 699 éléments et des cas de charge définis avec un pilote professionnel.",
          "Après suppression de la matière sans rôle structurel : contrainte de von Mises maximale de 21 MPa pour une limite d'élasticité de 250 MPa, coefficient de sécurité proche de 12.",
        ],
      },
      {
        title: "Panneau sensoriel pour enfants autistes",
        role: "Projet d'extension universitaire · IMT · 2026",
        blurb: "Choix du matériau et du procédé pour le panneau principal d'un jouet sensoriel destiné aux enfants de 3 à 8 ans, au sein d'une équipe de six étudiants.",
        bullets: [
          "Indices de performance pour un panneau en flexion, E^(1/3)/ρ et σy^(2/3)/ρ, avec un filtre de ténacité sous Ansys Granta EduPack.",
          "MDF retenu pour son compromis entre rigidité, masse et coût, découpé au laser au FabLab, avec des pièces en PLA imprimées en 3D.",
        ],
      },
      {
        title: "Moteur de kart : banc d'essai et course",
        role: "Moteurs à combustion interne · IMT · 2025",
        blurb: "Démontage complet d'un moteur et essais au banc dynamométrique. Seul le groupe ayant la meilleure optimisation gagnait le droit de courir.",
        bullets: [
          "Notre groupe a été retenu et a engagé le kart face à des équipes d'années plus avancées.",
          "La course a eu lieu après la fin du module. Nous l'avons menée à trois, en dehors des heures de cours, et le kart a roulé.",
        ],
      },
      {
        title: "Notes et moyenne en génie mécanique",
        role: "Projet personnel · en production · 2026",
        blurb: "Application installable qui calcule les moyennes selon les règles de chaque programme de cours et projette la moyenne générale.",
        bullets: [
          "Fonctionne entièrement dans le navigateur, sans serveur ni connexion : aucune note ne quitte l'appareil de l'utilisateur.",
          "Utilisée par des camarades de promotion, avec un Service Worker pour fonctionner hors ligne.",
        ],
      },
    ],
  },
  toolkit: {
    eyebrow: "Outils",
    h: "Outils et où je les ai utilisés",
    sub: "Pas de barres de niveau : chaque élément renvoie au travail où il a été appliqué.",
    groups: [
      {
        title: "CAO et IAO",
        items: [
          { name: "Ansys Workbench · Mechanical", note: "analyse statique et optimisation structurelle" },
          { name: "Ansys Granta EduPack", note: "choix des matériaux dans le projet d'extension" },
          { name: "Siemens NX", note: "module de 40 h sur les assemblages mécaniques" },
          { name: "CATIA 3DEXPERIENCE", note: "module d'introduction de 40 h" },
          { name: "SolidWorks · AutoCAD", note: "modélisation de pièces et dessin technique" },
        ],
      },
      {
        title: "Données et programmation",
        items: [
          { name: "Python · NumPy · Pandas · SciPy", note: "chaînes de traitement sur données réelles et méthodes numériques" },
          { name: "GDAL · QGIS · PyQGIS", note: "NetCDF satellitaire, reprojection et cartes par script" },
          { name: "InfluxDB · Grafana · Docker", note: "séries temporelles du simulateur de télémétrie" },
          { name: "MATLAB · Minitab", note: "travaux pratiques de physique et de statistique" },
          { name: "JavaScript · TypeScript", note: "application de notes et ce site" },
        ],
      },
      {
        title: "Méthodes et fabrication",
        items: [
          { name: "Lean Six Sigma Green Belt", note: "projet DMAIC remis à l'établissement" },
          { name: "Impression 3D · découpe laser", note: "prototypage au FabLab de l'IMT" },
        ],
      },
      {
        title: "Langues",
        items: [
          { name: "Português", note: "langue maternelle" },
          { name: "Español", note: "avancé" },
          { name: "English", note: "avancé" },
          { name: "Français", note: "TCF Tout Public B1, compréhension orale et écrite au niveau B2" },
        ],
      },
    ],
  },
  credentials: {
    eyebrow: "Certifications",
    h: "Formation complémentaire",
    desc1: "Neuf activités de 40 h dans le programme de projets et activités spéciales de l'IMT, soit ",
    descStrong: "360 heures",
    desc2: ", en plus de certifications externes.",
    groups: [
      {
        title: "Ingénierie et IAO",
        items: [
          { name: "Dimensionnement et optimisation structurelle automobile", meta: "IMT · 40 h" },
          { name: "Modélisation d'assemblages mécaniques sous Siemens NX", meta: "IMT · 40 h" },
          { name: "3DEXPERIENCE : introduction à CATIA", meta: "IMT · 40 h" },
          { name: "Moteurs à combustion interne automobiles", meta: "IMT · 40 h" },
          { name: "La simulation, fondement de l'ingénierie moderne", meta: "Institut ESSS · 7 h" },
        ],
      },
      {
        title: "Méthodes et données",
        items: [
          { name: "Lean Six Sigma Green Belt", meta: "IMT · 40 h" },
          { name: "Télémétrie pour compétitions universitaires", meta: "IMT · 40 h" },
          { name: "La bourse brésilienne et ses actifs", meta: "IMT · 40 h" },
        ],
      },
      {
        title: "Extension et langues",
        items: [
          { name: "Projet d'extension universitaire", meta: "IMT · 40 h" },
          { name: "Introduction au français (A1.1)", meta: "IMT · 40 h" },
          { name: "TCF Tout Public", meta: "France Éducation International · B1" },
          { name: "Défi InterAlliances 2026", meta: "1er à l'étape locale · 4e à la finale nationale" },
        ],
      },
    ],
  },
  contact: {
    eyebrow: "Contact",
    h1: "Parlons",
    h2: "d'ingénierie.",
    desc: "Ouvert aux stages, à l'initiation à la recherche et aux échanges académiques. Je réponds par e-mail ou sur LinkedIn.",
    email: "E-mail",
    copy: "copier l'e-mail",
    copied: "copié ✓",
  },
  footer: { rights: "São Paulo, Brésil" },
  preloader: { line: "Étalonnage du capteur de force · maillage structurel" },
};

const es: Dict = {
  nav: {
    getInTouch: "Contacto ↗",
    menuOpen: "Abrir menú",
    menuClose: "Cerrar menú",
    menuLabel: "Navegación",
    language: "Idioma",
    sections: { about: "Sobre mí", work: "Proyectos", toolkit: "Herramientas", credentials: "Certificaciones", contact: "Contacto" },
  },
  hero: {
    kicker: "Lucas Fischer Paez · Ingeniería Mecánica · IMT",
    l1: "Ingeniería mecánica.",
    l2: "Física, datos",
    l3: "y código.",
    sub: "Estudiante de segundo año en el Instituto Mauá de Tecnologia. Modelo fenómenos físicos, trabajo con datos reales y escribo las herramientas para analizarlos.",
    hint: "Mueve el cursor · la viga responde",
    badgeRunning: "simulación automática · toca para pausar",
    badgePaused: "simulación en pausa · toca para reanudar",
    hud: {
      title: "Viga en flexión, en tiempo real",
      utilization: "Utilización del límite elástico",
      compression: "compresión",
      tension: "tracción",
    },
  },
  physics: {
    eyebrow: "Física en tiempo real",
    h1: "La viga de arriba no es un video. Es ",
    hAccent: "Euler-Bernoulli",
    h2: " resuelta en cada fotograma a partir de tu cursor.",
    eq: [
      { label: "Momento de inercia", note: "sección rectangular" },
      { label: "Tensión de flexión", note: "fibra extrema" },
      { label: "Flecha en el centro", note: "viga biapoyada" },
    ],
    specs:
      "Acero 1020 · E = 200 GPa · σ_y = 250 MPa · L = 1 m · sección 30×50 mm · compresión en tonos fríos y tracción en tonos cálidos, como en un software de elementos finitos",
  },
  about: {
    eyebrow: "Sobre mí",
    h1: "Ingeniero en formación,",
    h2: "guiado por datos.",
    lead1: "Estudiante de Ingeniería Mecánica en el ",
    leadAccent: "Instituto Mauá de Tecnologia",
    lead2:
      ", en segundo año, con un promedio acumulado de 8,23 sobre 10. Me gustan los problemas en los que la física, los datos y el software tienen que cuadrar en el mismo resultado.",
    p1: "Mi base es mecánica: diseño en CAD, análisis por elementos finitos, selección de materiales y motores. En mis proyectos personales aplico el mismo rigor a los datos, con un pipeline que cruza satélite, calidad del aire e internaciones del sistema público de salud, y un simulador de telemetría en el que el tiempo de vuelta sale de la física.",
    p2: "Tengo nacionalidad brasileña y española, hablo portugués, español e inglés y estudio francés (TCF B1, comprensión en nivel B2) con el objetivo de continuar mi formación de ingeniero en Francia.",
    stats: [
      { value: "8,23", label: "Promedio acumulado (sobre 10)" },
      { value: "360 h", label: "Actividades extracurriculares certificadas" },
      { value: "4", label: "Idiomas" },
      { value: "3", label: "Proyectos de código abierto" },
    ],
  },
  disciplines: {
    eyebrow: "Áreas",
    h: "Donde la física se encuentra con los datos.",
    items: [
      { title: "Análisis estructural y FEA", desc: "Dimensionamiento por elementos finitos en Ansys: mallado, condiciones de contorno, tensión de von Mises y factor de seguridad." },
      { title: "Diseño en CAD", desc: "SolidWorks, Siemens NX, CATIA 3DEXPERIENCE y AutoCAD, de piezas individuales a conjuntos mecánicos." },
      { title: "Selección de materiales", desc: "Restricciones de diseño, índices de mérito y análisis de costos en Ansys Granta EduPack." },
      { title: "Datos geoespaciales", desc: "NetCDF satelital, GDAL, QGIS y PyQGIS aplicados a datos reales de calidad del aire y salud." },
      { title: "Series temporales", desc: "Modelado, ingesta y visualización de señales físicas con Python, InfluxDB y Grafana." },
      { title: "Motores", desc: "Desmontaje, ensayos en dinamómetro y fundamentos de motores de combustión interna." },
    ],
  },
  dyno: {
    eyebrow: "Banco de pruebas virtual",
    h1: "Mantén el acelerador.",
    h2: "Siente el motor.",
    desc: "Simulación longitudinal de un auto deportivo: caja de 6 marchas con corte de par, resistencia aerodinámica y sonido de motor comandado por las revoluciones. Cronometra tu 0 a 100 km/h.",
    specs: "6 marchas · 0 a 100 km/h en unos 3,2 s · rugido real de V8 al arrancar · petardeo del escape al soltar",
    redline: "corte",
    gear: "marcha",
    best: "mejor",
    hold: "MANTÉN PARA ACELERAR ⏯",
    holding: "ACELERANDO…",
    soundOn: "🔊 sonido activado",
    soundOff: "🔈 activar sonido",
  },
  work: {
    eyebrow: "Proyectos",
    h: "Lo que he construido",
    context: "Contexto",
    code: "Código ↗",
    demo: "Ver en línea ↗",
    projects: [
      {
        title: "Contaminación del aire y salud en São Paulo",
        role: "Proyecto propio · 2026",
        blurb: "Pipeline en Python que cruza aerosoles medidos por satélite, la red de calidad del aire de la CETESB e internaciones del sistema público de salud en la Región Metropolitana de São Paulo.",
        bullets: [
          "Lectura de archivos NetCDF-4 del satélite GOES-19 y reproyección de la grilla geoestacionaria con GDAL.",
          "Doce meses del SIH/SUS leídos directamente de los archivos del DATASUS: 102 mil internaciones respiratorias agregadas por municipio.",
          "Mapas generados con PyQGIS, con los límites de lo que los datos permiten concluir documentados en el repositorio.",
        ],
      },
      {
        title: "Simulador de telemetría vehicular",
        role: "Proyecto propio · 2025–2026",
        blurb: "Modelo físico de una vuelta en Interlagos que alimenta un pipeline de series temporales con InfluxDB y Grafana.",
        bullets: [
          "Avance por distancia recorrida, aceleración lateral por v²/R y respuesta térmica de primer orden.",
          "Ingesta por Line Protocol, dashboard en Flux aprovisionado y cockpit web que reproduce la vuelta a 10 Hz.",
        ],
      },
      {
        title: "Optimización estructural de un componente vehicular",
        role: "IMT · Dimensionamiento y optimización estructural vehicular · 2025",
        blurb: "Aligeramiento de un componente mecánico validado por elementos finitos.",
        bullets: [
          "Análisis estático en Ansys Workbench con una malla de 7.699 elementos y condiciones de uso definidas junto a un piloto profesional.",
          "Tras retirar el material sin función estructural: tensión de von Mises máxima de 21 MPa frente a 250 MPa de fluencia, factor de seguridad cercano a 12.",
        ],
      },
      {
        title: "Panel sensorial para niños con TEA",
        role: "Proyecto de extensión universitaria · IMT · 2026",
        blurb: "Selección de material y de proceso para el panel principal de un juguete sensorial para niños de 3 a 8 años, en un equipo de seis estudiantes.",
        bullets: [
          "Índices de mérito para un panel en flexión, E^(1/3)/ρ y σy^(2/3)/ρ, con filtro de tenacidad a la fractura en Ansys Granta EduPack.",
          "MDF elegido por su equilibrio entre rigidez, masa y costo, cortado con láser en el FabLab, con piezas de PLA impresas en 3D.",
        ],
      },
      {
        title: "Motor de kart: dinamómetro y carrera",
        role: "Motores de Combustión Interna · IMT · 2025",
        blurb: "Desmontaje completo de un motor y ensayos en dinamómetro. Solo el grupo con la mejor optimización ganaba el derecho a competir.",
        bullets: [
          "Nuestro grupo fue el seleccionado y llevó el kart a correr contra equipos de años más avanzados.",
          "La carrera se hizo después de terminar la actividad. La completamos entre tres, fuera del horario de clases, y el kart anduvo.",
        ],
      },
      {
        title: "Notas y promedio para Ingeniería Mecánica",
        role: "Proyecto personal · en producción · 2026",
        blurb: "Aplicación instalable que calcula las notas finales según las reglas de cada programa y proyecta el promedio acumulado.",
        bullets: [
          "Funciona entera en el navegador, sin servidor y sin inicio de sesión: ninguna nota sale del dispositivo de quien la usa.",
          "La usan compañeros de carrera, con Service Worker para funcionar sin conexión.",
        ],
      },
    ],
  },
  toolkit: {
    eyebrow: "Herramientas",
    h: "Herramientas y dónde las usé",
    sub: "Sin barras de nivel: cada ítem apunta al trabajo en el que se aplicó.",
    groups: [
      {
        title: "CAD y CAE",
        items: [
          { name: "Ansys Workbench · Mechanical", note: "análisis estático y optimización estructural" },
          { name: "Ansys Granta EduPack", note: "selección de materiales en el proyecto de extensión" },
          { name: "Siemens NX", note: "curso de 40 h sobre conjuntos mecánicos" },
          { name: "CATIA 3DEXPERIENCE", note: "curso introductorio de 40 h" },
          { name: "SolidWorks · AutoCAD", note: "modelado de piezas y dibujo técnico" },
        ],
      },
      {
        title: "Datos y programación",
        items: [
          { name: "Python · NumPy · Pandas · SciPy", note: "pipelines con datos reales y métodos numéricos" },
          { name: "GDAL · QGIS · PyQGIS", note: "NetCDF satelital, reproyección y mapas por script" },
          { name: "InfluxDB · Grafana · Docker", note: "series temporales del simulador de telemetría" },
          { name: "MATLAB · Minitab", note: "laboratorios de física y estadística" },
          { name: "JavaScript · TypeScript", note: "aplicación de notas y este sitio" },
        ],
      },
      {
        title: "Métodos y fabricación",
        items: [
          { name: "Lean Six Sigma Green Belt", note: "proyecto DMAIC entregado a la institución" },
          { name: "Impresión 3D · corte láser", note: "prototipado en el FabLab del IMT" },
        ],
      },
      {
        title: "Idiomas",
        items: [
          { name: "Português", note: "nativo" },
          { name: "Español", note: "avanzado" },
          { name: "English", note: "avanzado" },
          { name: "Français", note: "TCF Tout Public B1, comprensión oral y escrita en B2" },
        ],
      },
    ],
  },
  credentials: {
    eyebrow: "Certificaciones",
    h: "Formación complementaria",
    desc1: "Nueve actividades de 40 h en el programa de Proyectos y Actividades Especiales del IMT, que suman ",
    descStrong: "360 horas",
    desc2: ", además de certificaciones externas.",
    groups: [
      {
        title: "Ingeniería y CAE",
        items: [
          { name: "Dimensionamiento y optimización estructural vehicular", meta: "IMT · 40 h" },
          { name: "Modelado de conjuntos mecánicos en Siemens NX", meta: "IMT · 40 h" },
          { name: "3DEXPERIENCE: introducción a CATIA", meta: "IMT · 40 h" },
          { name: "Motores de combustión interna de vehículos", meta: "IMT · 40 h" },
          { name: "Simulación: la base de la ingeniería moderna", meta: "Instituto ESSS · 7 h" },
        ],
      },
      {
        title: "Métodos y datos",
        items: [
          { name: "Lean Six Sigma Green Belt", meta: "IMT · 40 h" },
          { name: "Telemetría para competencias universitarias", meta: "IMT · 40 h" },
          { name: "La bolsa de valores en Brasil y sus activos", meta: "IMT · 40 h" },
        ],
      },
      {
        title: "Extensión e idiomas",
        items: [
          { name: "Proyecto de extensión universitaria", meta: "IMT · 40 h" },
          { name: "Introducción al francés (A1.1)", meta: "IMT · 40 h" },
          { name: "TCF Tout Public", meta: "France Éducation International · B1" },
          { name: "Défi InterAlliances 2026", meta: "1º en la etapa local · 4º en la final nacional" },
        ],
      },
    ],
  },
  contact: {
    eyebrow: "Contacto",
    h1: "Hablemos",
    h2: "de ingeniería.",
    desc: "Abierto a prácticas, iniciación a la investigación e intercambio académico. Respondo por correo o por LinkedIn.",
    email: "Correo",
    copy: "copiar correo",
    copied: "copiado ✓",
  },
  footer: { rights: "São Paulo, Brasil" },
  preloader: { line: "Calibrando celda de carga · malla estructural" },
};

export const dict: Record<Lang, Dict> = { pt, en, fr, es };
