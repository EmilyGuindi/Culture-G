/**
 * Données de leçons fictives (contenu local de démarrage).
 *
 * Chaque leçon respecte le même schéma que celui que renverra plus tard
 * l'API IA (voir js/data/provider.js). Ne pas modifier la forme sans
 * mettre à jour le provider.
 *
 * Schéma :
 *   id, title, category, minutes, summary,
 *   body: string[]  (paragraphes, 400–600 mots au total)
 *   retenir: string,
 *   funFact: string,
 *   quiz: [{ question, options: string[], answer: number, explain }]
 */

export const CATEGORIES = [
  { id: "histoire", label: "Histoire", icon: "🏛️" },
  { id: "geopolitique", label: "Géopolitique", icon: "🌍" },
  { id: "sciences", label: "Sciences", icon: "🔬" },
  { id: "economie", label: "Économie", icon: "📈" },
  { id: "philosophie", label: "Philosophie", icon: "💭" },
  { id: "arts", label: "Arts", icon: "🎨" },
  { id: "technologie", label: "Technologie", icon: "💻" },
];

export const LESSONS = [
  {
    id: "les-lumieres",
    title: "Le siècle des Lumières",
    category: "histoire",
    minutes: 5,
    summary: "Comment un mouvement d'idées a redessiné l'Europe et posé les bases du monde moderne.",
    body: [
      "Le XVIIIe siècle européen est traversé par un courant intellectuel d'une ambition inédite : les Lumières. Derrière ce nom se cache une conviction simple mais radicale pour l'époque — la raison humaine, et non la tradition ou l'autorité religieuse, doit être la boussole qui guide la société. Penseurs, savants et écrivains se donnent pour mission d'« éclairer » leurs contemporains en combattant l'ignorance, la superstition et l'arbitraire du pouvoir.",
      "En France, ce mouvement prend un visage collectif avec l'Encyclopédie, dirigée par Diderot et d'Alembert. Publiée entre 1751 et 1772, elle rassemble le savoir de son temps en des milliers d'articles rédigés par les meilleurs esprits. Bien plus qu'un dictionnaire, c'est une machine de guerre intellectuelle : sous couvert de définir des mots, elle diffuse discrètement des idées critiques sur la religion, la monarchie et les privilèges.",
      "Les figures des Lumières ne forment pas un bloc uniforme. Voltaire manie l'ironie pour dénoncer l'intolérance et défendre la liberté d'expression. Montesquieu, dans « De l'esprit des lois », théorise la séparation des pouvoirs — exécutif, législatif, judiciaire — un principe qui structure encore aujourd'hui la plupart des démocraties. Rousseau, lui, s'écarte du groupe en interrogeant les inégalités sociales et en imaginant, avec le « Contrat social », une souveraineté fondée sur la volonté du peuple.",
      "Ces idées ne restent pas confinées aux salons parisiens. Elles circulent dans toute l'Europe, portées par la correspondance, les cafés et les cercles savants. Des souverains eux-mêmes, comme Frédéric II de Prusse ou Catherine II de Russie, se réclament du « despotisme éclairé », tentant de moderniser leurs États tout en conservant leur pouvoir absolu — un équilibre souvent plus théorique que réel.",
      "L'héritage des Lumières est immense. On leur doit la formulation de droits universels, l'idée que la connaissance doit être partagée, et la confiance dans le progrès. La Déclaration d'indépendance américaine (1776) comme la Déclaration des droits de l'homme et du citoyen (1789) puisent directement dans ce vocabulaire de la raison et de la liberté. Sans les Lumières, difficile d'imaginer la démocratie moderne telle que nous la connaissons.",
      "Mais l'époque a aussi ses zones d'ombre. La foi dans la raison a parfois viré à l'excès de confiance, et certains penseurs des Lumières ont défendu des hiérarchies entre les peuples qui nourriront plus tard des idéologies problématiques. Comprendre les Lumières, c'est donc saisir à la fois un formidable élan émancipateur et les tensions qu'il portait en germe.",
    ],
    retenir:
      "Les Lumières placent la raison au centre de la société et posent les bases intellectuelles de la démocratie moderne : séparation des pouvoirs, droits universels, diffusion du savoir.",
    funFact:
      "L'Encyclopédie de Diderot a failli être interdite plusieurs fois ; pour la sauver, certains articles « dangereux » étaient cachés derrière des renvois vers des sujets anodins.",
    quiz: [
      {
        question: "Quel penseur a théorisé la séparation des pouvoirs ?",
        options: ["Voltaire", "Montesquieu", "Rousseau", "Diderot"],
        answer: 1,
        explain: "Montesquieu développe ce principe dans « De l'esprit des lois » (1748).",
      },
      {
        question: "Qui dirigeait l'Encyclopédie avec d'Alembert ?",
        options: ["Rousseau", "Voltaire", "Diderot", "Montesquieu"],
        answer: 2,
        explain: "Diderot en fut le maître d'œuvre pendant plus de vingt ans.",
      },
      {
        question: "Quel texte de 1789 s'inspire directement des Lumières ?",
        options: [
          "La Déclaration des droits de l'homme et du citoyen",
          "Le Code civil",
          "La Constitution de 1958",
          "L'Édit de Nantes",
        ],
        answer: 0,
        explain: "Elle reprend le vocabulaire de la raison, de la liberté et des droits universels.",
      },
    ],
  },

  {
    id: "detroits-strategiques",
    title: "Les détroits, verrous du monde",
    category: "geopolitique",
    minutes: 5,
    summary: "Pourquoi quelques kilomètres de mer suffisent à faire trembler l'économie mondiale.",
    body: [
      "Regardez une carte du commerce maritime : elle ressemble à un réseau de veines où circule le sang de l'économie mondiale. Environ 80 % des marchandises voyagent par la mer. Or, sur ces routes, quelques passages étroits — les détroits — concentrent un pouvoir démesuré. Les contrôler, c'est tenir un robinet sur le flux mondial du pétrole, des céréales ou des conteneurs.",
      "Le détroit d'Ormuz, entre l'Iran et la péninsule Arabique, en est l'exemple le plus tendu. Chaque jour, près d'un cinquième du pétrole consommé dans le monde y transite. Sa largeur navigable ne dépasse guère quelques kilomètres. La moindre tension régionale y fait grimper les cours du brut, car les marchés redoutent une fermeture, même temporaire.",
      "Plus à l'est, le détroit de Malacca relie l'océan Indien à la mer de Chine méridionale. C'est l'artère vitale du commerce asiatique : la majeure partie des importations énergétiques de la Chine, du Japon et de la Corée du Sud y passe. Sa congestion et sa vulnérabilité à la piraterie en font un point de fixation stratégique, au point que Pékin cherche des routes alternatives par voie terrestre.",
      "En Europe, le canal de Suez joue un rôle comparable. En reliant la Méditerranée à la mer Rouge, il évite aux navires le long contournement de l'Afrique. En 2021, l'échouage d'un seul porte-conteneurs, l'Ever Given, a bloqué le canal pendant six jours et paralysé une part du commerce mondial, rappelant à tous la fragilité de ces goulots d'étranglement.",
      "Ces points de passage expliquent une grande partie des stratégies militaires et diplomatiques contemporaines. Les grandes puissances y déploient des flottes, y nouent des alliances et y installent des bases. La géopolitique des détroits, c'est l'art de sécuriser ses approvisionnements tout en gardant la capacité de gêner ceux des rivaux.",
      "D'autres passages, moins connus, comptent tout autant. Le détroit de Bab-el-Mandeb, à l'entrée de la mer Rouge, commande l'accès au canal de Suez ; le Bosphore, à Istanbul, relie la mer Noire à la Méditerranée et conditionne les exportations de céréales de toute une région. Certains États cherchent même à contourner ces dépendances : projets d'oléoducs terrestres, ports alternatifs, voire routes arctiques rendues navigables par le réchauffement climatique. Chaque nouvelle infrastructure redessine, un peu, la carte des rapports de force. Ce qui explique pourquoi la moindre étincelle près d'un détroit majeur fait aussitôt réagir les marchés et les chancelleries du monde entier.",
      "Comprendre les détroits, c'est saisir une vérité contre-intuitive : dans un monde globalisé et immatériel, la géographie physique reste décisive. Un chenal de quelques kilomètres peut peser plus lourd, dans les rapports de force, que des continents entiers.",
    ],
    retenir:
      "Quelques détroits (Ormuz, Malacca, Suez) concentrent l'essentiel du commerce maritime mondial. Les contrôler ou les sécuriser est un enjeu géopolitique majeur.",
    funFact:
      "Le blocage du canal de Suez par l'Ever Given en 2021 a immobilisé chaque jour l'équivalent de près de 10 milliards de dollars de marchandises.",
    quiz: [
      {
        question: "Quelle part du pétrole mondial transite par le détroit d'Ormuz ?",
        options: ["Environ 5 %", "Environ 20 %", "Environ 50 %", "Environ 75 %"],
        answer: 1,
        explain: "Près d'un cinquième du pétrole consommé dans le monde y passe chaque jour.",
      },
      {
        question: "Quel détroit est vital pour le commerce énergétique de la Chine ?",
        options: ["Le Bosphore", "Le détroit de Gibraltar", "Le détroit de Malacca", "Le Pas-de-Calais"],
        answer: 2,
        explain: "Malacca relie l'océan Indien à la mer de Chine méridionale.",
      },
      {
        question: "Qu'a révélé l'incident de l'Ever Given en 2021 ?",
        options: [
          "La fin du transport maritime",
          "La fragilité des goulots d'étranglement du commerce",
          "L'inutilité du canal de Suez",
          "Une victoire militaire",
        ],
        answer: 1,
        explain: "Un seul navire échoué a suffi à paralyser une part du commerce mondial.",
      },
    ],
  },

  {
    id: "entropie",
    title: "L'entropie, ou la flèche du temps",
    category: "sciences",
    minutes: 5,
    summary: "Pourquoi un verre se brise mais ne se reconstitue jamais tout seul.",
    body: [
      "Imaginez un verre qui tombe et se brise en mille morceaux. Vous n'avez jamais vu, et ne verrez jamais, des éclats se rassembler spontanément pour reformer un verre intact. Cette évidence du quotidien cache l'une des lois les plus profondes de la physique : le deuxième principe de la thermodynamique, et son concept central, l'entropie.",
      "L'entropie mesure, en gros, le désordre d'un système — ou plus précisément le nombre de façons dont ses composants peuvent s'organiser. Un jeu de cartes rangé dans l'ordre n'a qu'une seule configuration ; mélangé, il en a des milliards. Statistiquement, il est donc infiniment plus probable de tomber sur un état « désordonné » que sur l'unique état « ordonné ».",
      "Le deuxième principe énonce que, dans un système isolé, l'entropie ne peut qu'augmenter ou rester constante. Autrement dit, l'univers tend naturellement vers plus de désordre. C'est ce qui donne au temps une direction : le passé est l'état de plus faible entropie, le futur celui de plus forte entropie. Les physiciens parlent joliment de « flèche du temps ».",
      "Cela ne signifie pas que l'ordre est impossible. Une plante qui pousse, un cristal qui se forme, un être vivant qui s'organise : tout cela crée localement de l'ordre. Mais toujours au prix d'un désordre plus grand ailleurs. Votre corps maintient une belle organisation interne en dégradant de l'énergie et en rejetant de la chaleur : le bilan global d'entropie, lui, augmente bien.",
      "Ce principe a des conséquences vertigineuses. Il explique pourquoi aucune machine ne peut être parfaitement efficace : une part de l'énergie se dissipe toujours en chaleur inutilisable. Il éclaire aussi le destin lointain de l'univers, que certains scénarios voient s'acheminer vers une « mort thermique » — un état final où tout serait uniformément tiède, sans plus aucune différence exploitable pour produire du travail.",
      "L'entropie a aussi profondément marqué d'autres domaines que la physique. Dans la théorie de l'information, développée au XXe siècle par Claude Shannon, un concept très proche mesure la quantité d'incertitude contenue dans un message : plus un signal est imprévisible, plus son entropie est élevée. Cette parenté n'est pas qu'une coïncidence de vocabulaire ; elle révèle un lien profond entre désordre physique et information. C'est pourquoi on retrouve l'entropie aussi bien dans un moteur thermique que dans un algorithme de compression de fichiers, qui cherche précisément à traquer et éliminer la redondance pour ne garder que l'information réellement utile.",
      "L'entropie relie ainsi l'expérience la plus banale — un café qui refroidit, un bureau qui se désordonne — aux questions les plus grandes sur l'origine et la fin du cosmos. Une même idée, du verre brisé jusqu'aux étoiles.",
    ],
    retenir:
      "Le deuxième principe de la thermodynamique dit que l'entropie (le désordre) d'un système isolé ne peut qu'augmenter. C'est ce qui donne au temps sa direction irréversible.",
    funFact:
      "Créer de l'ordre localement (une plante, un être vivant) est autorisé par la physique, à condition de produire encore plus de désordre ailleurs.",
    quiz: [
      {
        question: "Que mesure l'entropie ?",
        options: ["La température", "Le désordre d'un système", "La vitesse", "La masse"],
        answer: 1,
        explain: "Elle compte le nombre de configurations possibles d'un système.",
      },
      {
        question: "Dans un système isolé, l'entropie…",
        options: ["diminue toujours", "reste nulle", "ne peut qu'augmenter ou rester constante", "oscille"],
        answer: 2,
        explain: "C'est l'énoncé du deuxième principe de la thermodynamique.",
      },
      {
        question: "Pourquoi l'entropie donne-t-elle une « flèche du temps » ?",
        options: [
          "Parce qu'elle est identique dans le passé et le futur",
          "Parce que le futur a une entropie plus élevée que le passé",
          "Parce qu'elle n'a aucun lien avec le temps",
          "Parce qu'elle mesure la vitesse de la lumière",
        ],
        answer: 1,
        explain: "Le passé est l'état de plus faible entropie, le futur celui de plus forte entropie.",
      },
    ],
  },

  {
    id: "inflation",
    title: "L'inflation, cette érosion invisible",
    category: "economie",
    minutes: 5,
    summary: "Comment la hausse des prix redistribue silencieusement la richesse.",
    body: [
      "L'inflation, c'est la hausse générale et durable des prix. Concrètement, avec la même somme d'argent, vous achetez un peu moins de choses chaque année. Une inflation de 2 % signifie qu'un panier de biens qui coûtait 100 euros en coûtera 102 l'année suivante. Prise isolément, la variation paraît minime ; répétée sur une décennie, elle transforme profondément le pouvoir d'achat.",
      "D'où vient-elle ? Les économistes distinguent plusieurs moteurs. L'inflation « par la demande » survient quand les consommateurs veulent acheter plus que ce que l'économie peut produire : les prix montent pour équilibrer l'offre et la demande. L'inflation « par les coûts » vient d'une hausse des matières premières ou des salaires, que les entreprises répercutent sur leurs prix. Enfin, une création monétaire trop abondante peut aussi nourrir la hausse des prix.",
      "L'inflation n'est pas seulement une gêne : c'est un formidable outil de redistribution, souvent invisible. Elle pénalise les épargnants, dont les économies perdent de la valeur, et les créanciers, remboursés dans une monnaie qui vaut moins. À l'inverse, elle avantage les emprunteurs, y compris les États très endettés, dont la dette « fond » mécaniquement avec la hausse des prix.",
      "C'est pourquoi les banques centrales en font leur cible prioritaire. La plupart visent une inflation d'environ 2 % : assez basse pour préserver la confiance dans la monnaie, mais pas nulle, car une inflation légère facilite les ajustements de salaires et éloigne le spectre de la déflation. Pour piloter les prix, leur principal levier est le taux d'intérêt : le relever refroidit la demande, le baisser la stimule.",
      "Les épisodes extrêmes marquent les mémoires. L'hyperinflation de l'Allemagne des années 1920 est restée célèbre : les prix doublaient parfois en quelques jours, et l'on transportait des liasses de billets dans des brouettes. À l'opposé, une déflation prolongée — la baisse des prix — peut être tout aussi dangereuse, car elle pousse chacun à reporter ses achats, ce qui étouffe l'activité.",
      "Un phénomène rend l'inflation particulièrement difficile à maîtriser : les anticipations. Si les ménages et les entreprises s'attendent à une hausse des prix, ils l'intègrent d'avance — les salariés réclament des augmentations, les commerçants relèvent leurs tarifs par précaution. La hausse se nourrit alors d'elle-même, dans une « spirale prix-salaires » qui peut s'auto-entretenir. C'est pourquoi les banques centrales soignent autant leur communication que leurs décisions : convaincre le public qu'elles garderont l'inflation sous contrôle est parfois aussi efficace qu'une hausse de taux. La crédibilité, en matière monétaire, est une arme à part entière.",
      "Comprendre l'inflation, c'est comprendre que la valeur de l'argent n'a rien de figé. Derrière un simple chiffre publié chaque mois se joue une redistribution silencieuse entre épargnants et emprunteurs, entre générations, entre l'État et les citoyens.",
    ],
    retenir:
      "L'inflation est la hausse durable des prix. Elle érode l'épargne, allège les dettes, et constitue l'objectif de pilotage n°1 des banques centrales (cible d'environ 2 %).",
    funFact:
      "Pendant l'hyperinflation allemande de 1923, il pouvait être moins cher de brûler des billets de banque pour se chauffer que d'acheter du bois avec.",
    quiz: [
      {
        question: "Que signifie une inflation de 2 % ?",
        options: [
          "Les prix baissent de 2 %",
          "Les prix montent de 2 %",
          "Les salaires montent de 2 %",
          "La monnaie disparaît",
        ],
        answer: 1,
        explain: "Un panier à 100 € coûte 102 € l'année suivante.",
      },
      {
        question: "Qui l'inflation avantage-t-elle plutôt ?",
        options: ["Les épargnants", "Les créanciers", "Les emprunteurs", "Personne"],
        answer: 2,
        explain: "Les dettes « fondent » car elles sont remboursées dans une monnaie qui vaut moins.",
      },
      {
        question: "Quel est le principal levier des banques centrales ?",
        options: ["Le taux d'intérêt", "Le prix du pétrole", "Les impôts", "Le taux de change fixe"],
        answer: 0,
        explain: "Relever les taux refroidit la demande, les baisser la stimule.",
      },
    ],
  },

  {
    id: "stoicisme",
    title: "Le stoïcisme, l'art de ce qui dépend de nous",
    category: "philosophie",
    minutes: 5,
    summary: "Une philosophie antique devenue guide de vie pour le monde contemporain.",
    body: [
      "Fondé à Athènes vers 300 avant notre ère par Zénon de Kition, le stoïcisme est l'une des rares philosophies antiques à connaître aujourd'hui un véritable regain. On le retrouve dans les livres de développement personnel, les discours d'entrepreneurs et les applications de méditation. Cette popularité tient à une idée d'une simplicité désarmante mais exigeante.",
      "Cette idée centrale, on la doit notamment à Épictète, ancien esclave devenu maître de sagesse : il existe des choses qui dépendent de nous et d'autres qui n'en dépendent pas. Nos opinions, nos désirs, nos jugements et nos actions nous appartiennent. En revanche, le corps, la réputation, la richesse, le regard des autres, les événements extérieurs échappent largement à notre contrôle. La sagesse consiste à concentrer toute son énergie sur le premier domaine et à accueillir sereinement le second.",
      "Les stoïciens ne prônent pas l'indifférence froide qu'évoque parfois le mot « stoïque » aujourd'hui. Leur but est l'ataraxie, une tranquillité de l'âme obtenue non pas en supprimant les émotions, mais en cessant de se laisser dominer par des jugements erronés. Ce n'est pas l'événement qui nous trouble, disent-ils, mais l'idée que nous nous en faisons.",
      "Le stoïcisme a séduit des profils très divers. Sénèque était un homme politique fortuné, Épictète un ancien esclave, et Marc Aurèle un empereur romain. Ce dernier a laissé les « Pensées pour moi-même », un journal intime rédigé sur le front militaire, où le maître du monde connu se rappelle à lui-même la brièveté de la vie et le devoir d'agir avec justice.",
      "Concrètement, les stoïciens proposent des exercices : passer en revue sa journée le soir, s'entraîner à distinguer ce qui dépend de soi, ou pratiquer la « prémeditation des maux », c'est-à-dire imaginer à l'avance les difficultés possibles pour ne pas en être terrassé. Autant de techniques que la psychologie moderne, notamment les thérapies cognitives, a en partie redécouvertes.",
      "Le stoïcisme repose aussi sur une vision plus large : celle d'un ordre rationnel qui traverse l'univers, que les Anciens nommaient le logos. Vivre selon la nature, pour un stoïcien, ce n'est pas retourner à l'état sauvage, mais accorder sa conduite à cette raison universelle et accepter d'être une petite partie d'un tout qui nous dépasse. De là découle un fort sens du devoir et de la solidarité : puisque tous les humains partagent la même raison, ils forment une seule communauté. Cette idée de « cosmopolitisme » — se sentir citoyen du monde avant d'être d'une cité — est l'un des apports les plus modernes de cette école antique.",
      "Le stoïcisme n'est pas un appel à la résignation. C'est au contraire une invitation à agir avec vigueur sur ce que l'on peut changer, tout en cultivant la paix intérieure face à ce que l'on ne peut pas. Une boussole minimaliste, vieille de deux mille ans, qui parle étrangement à notre époque saturée d'incertitudes.",
    ],
    retenir:
      "Le stoïcisme distingue ce qui dépend de nous (jugements, actions) de ce qui n'en dépend pas. La sagesse consiste à agir sur le premier et à accueillir sereinement le second.",
    funFact:
      "Marc Aurèle, l'homme le plus puissant de son temps, écrivait ses « Pensées » pour lui seul : elles n'étaient pas destinées à être publiées.",
    quiz: [
      {
        question: "Quelle est l'idée centrale du stoïcisme selon Épictète ?",
        options: [
          "Tout dépend du destin",
          "Distinguer ce qui dépend de nous de ce qui n'en dépend pas",
          "Il faut supprimer toute émotion",
          "Le plaisir est le souverain bien",
        ],
        answer: 1,
        explain: "C'est le cœur de la sagesse stoïcienne.",
      },
      {
        question: "Quel empereur romain était stoïcien et auteur des « Pensées » ?",
        options: ["Néron", "Auguste", "Marc Aurèle", "César"],
        answer: 2,
        explain: "Il a rédigé ce journal intime sur le front militaire.",
      },
      {
        question: "Qu'est-ce que l'ataraxie recherchée par les stoïciens ?",
        options: [
          "La richesse",
          "La tranquillité de l'âme",
          "La gloire militaire",
          "L'indifférence totale au monde",
        ],
        answer: 1,
        explain: "Une paix intérieure obtenue en corrigeant nos jugements erronés.",
      },
    ],
  },

  {
    id: "perspective",
    title: "La perspective, quand la peinture a conquis l'espace",
    category: "arts",
    minutes: 5,
    summary: "Comment une invention de la Renaissance a changé notre façon de voir le monde.",
    body: [
      "Avant le XVe siècle, la peinture européenne représentait le monde sans véritable profondeur. Les personnages importants étaient peints plus grands, non parce qu'ils étaient plus proches, mais parce qu'ils comptaient davantage. L'espace obéissait à une logique symbolique, pas optique. Puis, à Florence, une révolution silencieuse a tout changé : la perspective linéaire.",
      "Vers 1420, l'architecte Filippo Brunelleschi réalise une démonstration restée célèbre. Il peint le baptistère de Florence sur un petit panneau, en respectant des règles géométriques précises, puis invite les spectateurs à comparer sa peinture au bâtiment réel à travers un dispositif ingénieux. L'illusion est saisissante : la peinture semble reproduire fidèlement la profondeur du réel.",
      "Le principe est aussi élégant que puissant. Toutes les lignes parallèles qui s'éloignent du spectateur — le bord d'une route, les arêtes d'un bâtiment — semblent converger vers un même « point de fuite » situé à l'horizon. En respectant cette convergence, le peintre crée sur une surface plane l'illusion convaincante de la troisième dimension.",
      "Cette découverte se répand vite. Le théoricien Leon Battista Alberti la codifie dès 1435, offrant aux artistes une méthode reproductible. Des maîtres comme Piero della Francesca en font un usage presque mathématique, tandis que Léonard de Vinci l'enrichit d'observations sur la manière dont l'atmosphère estompe les couleurs au loin — la « perspective atmosphérique ».",
      "L'enjeu dépasse la seule technique. La perspective traduit une nouvelle vision du monde, où l'homme devient le point de référence à partir duquel tout s'organise. Ce n'est pas un hasard si elle naît en même temps que l'humanisme de la Renaissance : dans les deux cas, le regard humain devient la mesure de l'espace et du savoir.",
      "Fait remarquable, ce langage si convaincant n'a rien d'universel. Bien des cultures ont peint et dessiné pendant des siècles sans jamais adopter la perspective linéaire, non par ignorance, mais par choix esthétique : représenter le monde tel qu'on le sait plutôt que tel qu'on le voit d'un point unique. Et dès le début du XXe siècle, des artistes comme Cézanne puis les cubistes s'amusent délibérément à briser cette perspective, multipliant les points de vue dans un même tableau. La perspective apparaît alors pour ce qu'elle est vraiment : non pas la seule façon « juste » de voir, mais une convention culturelle particulièrement puissante et durable.",
      "Aujourd'hui, la perspective nous paraît si naturelle que nous oublions qu'elle a dû être inventée. Elle imprègne la photographie, le cinéma, les jeux vidéo et les images de synthèse. Chaque fois qu'un écran nous donne l'illusion de la profondeur, il applique encore, à sa manière, la géométrie découverte sur une place de Florence il y a six siècles.",
    ],
    retenir:
      "La perspective linéaire, inventée à Florence vers 1420, utilise un point de fuite pour créer l'illusion de la profondeur sur une surface plane. Elle traduit la vision humaniste de la Renaissance.",
    funFact:
      "La démonstration de Brunelleschi utilisait un petit trou dans le panneau et un miroir : le spectateur regardait l'image « par-derrière » pour vérifier l'illusion.",
    quiz: [
      {
        question: "Vers quelle date la perspective linéaire est-elle inventée ?",
        options: ["Vers 1200", "Vers 1420", "Vers 1650", "Vers 1800"],
        answer: 1,
        explain: "La démonstration de Brunelleschi date d'environ 1420, à Florence.",
      },
      {
        question: "Vers quoi convergent les lignes parallèles en perspective ?",
        options: ["Le centre du tableau", "Le point de fuite", "Le premier plan", "Les bords du cadre"],
        answer: 1,
        explain: "Elles semblent se rejoindre au point de fuite, situé à l'horizon.",
      },
      {
        question: "À quel mouvement la perspective est-elle associée ?",
        options: ["Le romantisme", "L'humanisme de la Renaissance", "Le baroque", "L'impressionnisme"],
        answer: 1,
        explain: "Elle place le regard humain au centre, comme l'humanisme.",
      },
    ],
  },

  {
    id: "chiffrement",
    title: "Le chiffrement, gardien invisible du numérique",
    category: "technologie",
    minutes: 5,
    summary: "Comment des mathématiques protègent chacun de vos paiements et messages.",
    body: [
      "Chaque fois que vous consultez votre banque en ligne, envoyez un message ou payez sur internet, une technologie invisible veille : le chiffrement. Son rôle est de transformer une information lisible en une suite de caractères incompréhensible pour quiconque n'a pas la bonne clé. Ce n'est pas un gadget : c'est le fondement de la confiance dans tout le monde numérique.",
      "L'idée de coder ses messages est ancienne. Jules César décalait déjà les lettres de l'alphabet pour brouiller ses ordres militaires. Mais ces méthodes « à clé secrète » partagent une faiblesse : l'expéditeur et le destinataire doivent d'abord s'échanger la clé, ce qui, sur internet, revient à crier un mot de passe dans une foule.",
      "La révolution vient des années 1970 avec le chiffrement « à clé publique ». Chaque personne possède deux clés liées mathématiquement : une clé publique, qu'elle diffuse à tous, et une clé privée, qu'elle garde secrète. On chiffre un message avec la clé publique du destinataire, et seul celui-ci, avec sa clé privée, peut le déchiffrer. Plus besoin d'échanger un secret au préalable.",
      "La sécurité de ce système repose sur des problèmes mathématiques faciles à poser mais très difficiles à résoudre. Le célèbre algorithme RSA, par exemple, s'appuie sur la difficulté de factoriser un très grand nombre en ses facteurs premiers. Multiplier deux grands nombres premiers est instantané ; retrouver ces facteurs à partir du résultat peut demander des milliards d'années à un ordinateur classique.",
      "Ce même principe permet aussi la « signature numérique ». En chiffrant une empreinte de son message avec sa clé privée, on prouve qu'on en est bien l'auteur et que le contenu n'a pas été modifié. C'est ce qui authentifie les mises à jour logicielles, les sites web sécurisés (le petit cadenas du navigateur) et de nombreuses transactions.",
      "Le chiffrement a longtemps été un enjeu de pouvoir autant que de technique. Pendant des siècles, il fut jalousement réservé aux armées et aux diplomates ; sa diffusion au grand public, dans les années 1990, a même déclenché de véritables batailles politiques, certains États voulant en limiter l'usage. Aujourd'hui, le débat s'est déplacé sans disparaître : entre le besoin de protéger la vie privée des citoyens et la volonté des services de sécurité d'accéder aux communications, l'équilibre reste discuté. Le chiffrement n'est donc pas seulement une affaire de mathématiques : c'est aussi un choix de société sur ce que nous voulons garder secret.",
      "L'avenir du chiffrement est déjà un champ de bataille. Les ordinateurs quantiques, encore balbutiants, pourraient un jour casser certains systèmes actuels. Chercheurs et institutions travaillent donc à une cryptographie « post-quantique », capable de résister à ces futures machines. Invisible mais essentiel, le chiffrement reste l'un des piliers les plus discrets de notre vie connectée.",
    ],
    retenir:
      "Le chiffrement à clé publique permet d'échanger des messages sûrs sans partager de secret au préalable. Sa sécurité repose sur des problèmes mathématiques très difficiles à inverser.",
    funFact:
      "Le petit cadenas de votre navigateur signifie qu'à cet instant, des nombres de plusieurs centaines de chiffres protègent votre connexion.",
    quiz: [
      {
        question: "Quel est l'apport du chiffrement à clé publique ?",
        options: [
          "Chiffrer plus vite",
          "Échanger des messages sûrs sans partager de secret au préalable",
          "Supprimer les mots de passe",
          "Ralentir internet",
        ],
        answer: 1,
        explain: "Clé publique pour chiffrer, clé privée pour déchiffrer : aucun secret à s'échanger d'abord.",
      },
      {
        question: "Sur quelle difficulté repose l'algorithme RSA ?",
        options: [
          "Additionner de grands nombres",
          "Factoriser un très grand nombre en facteurs premiers",
          "Trier une liste",
          "Compter jusqu'à l'infini",
        ],
        answer: 1,
        explain: "Multiplier est facile, factoriser le résultat est extrêmement lent.",
      },
      {
        question: "Quelle menace pèse sur le chiffrement actuel ?",
        options: [
          "Les ordinateurs quantiques",
          "La fin d'internet",
          "Les virus classiques",
          "La hausse des prix",
        ],
        answer: 0,
        explain: "D'où la recherche d'une cryptographie « post-quantique ».",
      },
    ],
  },

  {
    id: "route-de-la-soie",
    title: "La route de la soie, première mondialisation",
    category: "histoire",
    minutes: 5,
    summary: "Un réseau de pistes qui a fait circuler des marchandises, des idées et des maladies.",
    body: [
      "On imagine souvent la route de la soie comme une longue piste unique reliant la Chine à la Méditerranée. La réalité est plus riche : il s'agissait d'un vaste réseau de routes terrestres et maritimes, actif pendant plus de mille cinq cents ans, par lequel transitaient bien plus que de la soie. Ce nom, d'ailleurs, est une invention tardive du XIXe siècle.",
      "Les marchandises y voyageaient rarement d'un bout à l'autre. Elles passaient de marchand en marchand, de caravane en caravane, gagnant en valeur à chaque étape. La soie chinoise partait vers l'ouest ; en sens inverse revenaient l'or, l'argent, la laine, le verre, les chevaux et les épices. Des villes-étapes comme Samarcande prospéraient grâce à ce commerce de relais.",
      "Mais l'essentiel de ce qui circulait n'était pas matériel. Les idées, les religions et les technologies suivaient les mêmes pistes. Le bouddhisme s'est diffusé de l'Inde vers la Chine par ces routes. Le papier, inventé en Chine, a mis des siècles à gagner l'Occident en empruntant ce chemin. La route de la soie fut ainsi l'une des premières grandes autoroutes de la connaissance.",
      "Cette circulation avait aussi son revers. Les mêmes routes qui portaient les marchandises transportaient les épidémies. On pense que la peste noire, qui ravagea l'Europe au XIVe siècle, a en partie voyagé par ces réseaux commerciaux, illustrant très tôt le lien entre échanges et diffusion des maladies.",
      "Le déclin des routes terrestres s'amorce à partir du XVe siècle. Les grandes découvertes maritimes ouvrent des voies alternatives, plus rapides et moins soumises aux intermédiaires. Le commerce se déplace vers les océans, et les cités-caravanes perdent peu à peu leur rôle central.",
      "Ce commerce a aussi façonné des civilisations entières. Des oasis se sont transformées en cités brillantes, dotées de bibliothèques, d'observatoires et de marchés cosmopolites où se croisaient des dizaines de langues. Samarcande, Boukhara ou encore les villes caravanières du désert doivent leur splendeur passée à ce flux de marchandises et d'idées. Les routes servaient aussi de creuset religieux : le long des mêmes pistes voyageaient bouddhistes, chrétiens, manichéens et, plus tard, marchands musulmans, chacun laissant des traces dans l'art et l'architecture locale. La route de la soie n'était pas qu'un circuit commercial : c'était un immense espace d'échange où les cultures se mélangeaient bien plus qu'elles ne s'affrontaient.",
      "La route de la soie n'a pas seulement enrichi des marchands : elle a façonné une première forme de monde interconnecté, où une invention, une croyance ou un fléau pouvait traverser un continent. À l'heure où l'on parle de « nouvelles routes de la soie », ce précédent millénaire rappelle que la mondialisation n'est pas née hier.",
    ],
    retenir:
      "La route de la soie était un réseau, non une route unique, qui a fait circuler pendant plus de 1500 ans des marchandises, mais surtout des idées, des religions, des technologies… et des épidémies.",
    funFact:
      "L'expression « route de la soie » n'a été inventée qu'au XIXe siècle, par le géographe allemand Ferdinand von Richthofen.",
    quiz: [
      {
        question: "La route de la soie était surtout…",
        options: [
          "Une route unique et rectiligne",
          "Un vaste réseau de routes terrestres et maritimes",
          "Un canal",
          "Une voie ferrée",
        ],
        answer: 1,
        explain: "Un réseau de relais, pas une piste unique.",
      },
      {
        question: "Qu'est-ce qui, surtout, circulait par ces routes ?",
        options: [
          "Uniquement de la soie",
          "Des idées, religions et technologies, en plus des marchandises",
          "Seulement des armes",
          "Rien d'important",
        ],
        answer: 1,
        explain: "Bouddhisme, papier, savoirs… l'immatériel primait souvent.",
      },
      {
        question: "Quel fléau aurait en partie voyagé par ces routes ?",
        options: ["La grippe espagnole", "La peste noire", "Le choléra", "La variole"],
        answer: 1,
        explain: "La peste noire du XIVe siècle a suivi les réseaux commerciaux.",
      },
    ],
  },
];

/** Renvoie la leçon du jour de façon déterministe (change chaque jour). */
export function pickDailyLessonId(dateStr) {
  // dateStr au format YYYY-MM-DD → index stable dans la journée
  const seed = dateStr.split("-").reduce((acc, n) => acc + parseInt(n, 10), 0);
  return LESSONS[seed % LESSONS.length].id;
}
