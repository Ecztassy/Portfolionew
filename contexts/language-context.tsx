"use client"

import type React from "react";
import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

// Define available languages
export type Language = "en" | "es" | "jp" | "pt" | "fr";

// Define the context type
type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};



// Create the context with default values
const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => { },
  t: () => "",
});

// Translations object
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    "nav.home": "HOME",
    "nav.about": "ABOUT",
    "nav.projects": "PROJECTS",
    "nav.skills": "SKILLS",
    "nav.contact": "CONTACT",

    // Welcome Screen
    "welcome.title": "Void",
    "welcome.subtitle": "PORTFOLIO",
    "welcome.select": "Select Language",
    "welcome.continue": "ENTER THE WIRED",

    // Hero Section
    "hero.title": "WORKS",
    "hero.subtitle": "PORTFOLIO",
    "hero.description": "A collection of my works and skills.",
    "hero.viewProjects": "View Projects",
    "hero.aboutMe": "About Me",

    // About Section
    "about.title": "ABOUT ME",
    "about.p1": "Hi my name is Diogo, I am a {{age}}y old programming student with a passion for all kinds of technology.",
    "about.p2":
      "My work focuses on Fullstack web development, Software development, Servers and Databases. ",
    "about.p3":
      "I aim to be out of alpha and be the better version of myself, improving everyday, everytime.",
    "about.quote": "Above everything, make yourself proud.",
    "about.terminal.identity": "Identity confirmed",
    "about.terminal.connection": "Connection established",
    "about.terminal.present": "Owner confirmed",

    // Projects Section
    "projects.title": "PROJECTS",
    "projects.description": "Things I created",
    "projects.selectCategory": "SELECT PROJECT CATEGORY:",
    "projects.categorySelected": "CATEGORY SELECTED",
    "projects.loading": "Loading projects...",
    "projects.noProjects": "No projects found in this category.",
    "projects.terminal.title": "PROJECT_CATEGORIES.exe",
    "projects.terminal.loading": "Loading categories...",

    // Project Categories
    "projects.categories.all": "ALL PROJECTS",
    "projects.categories.web": "WebDev",
    "projects.categories.software": "Software",
    "projects.categories.server": "Servers",
    "projects.categories.linux": "Linux",

    // Project Items
    "projects.items.ezpass.title": "EZPass Website",
    "projects.items.ezpass.description": "A website I created to advertise my password manager software.",
    "projects.items.ezpass.category": "web",

    "projects.items.portfolio.title": "Old Portfolio",
    "projects.items.portfolio.description": "My old portfolio website, created with jquery and bootstrap.",
    "projects.items.portfolio.category": "web",

    "projects.items.protocol.title": "About Me",
    "projects.items.protocol.description": "A page I created to talk about myself and my personality.",
    "projects.items.protocol.category": "web",

    "projects.items.memory.title": "First Website Ever",
    "projects.items.memory.description": "Created for school, a simple website to explain about hardware, software, servers and to provide content for our subjects.",
    "projects.items.memory.category": "web",

    "projects.items.engine.title": "FTP Server",
    "projects.items.engine.description": "A simple FTP that I set up to store files on my personal server. It has safe linux file permissions and user control.",
    "projects.items.engine.category": "server",

    "projects.items.wired.title": "XAMPP/Wordpress",
    "projects.items.wired.description": "I was the one responsible for setting up the XAMPP server and Wordpress for my group project at school. Also created a website section to talk about linux.",
    "projects.items.wired.category": "web",

    "projects.items.extension.title": "EZPass Extension",
    "projects.items.extension.description": "A browser extension I created to autocomplete passwords in the browser that links with my password manager software.",
    "projects.items.extension.category": "web",

    "projects.items.server.title": "Home Server",
    "projects.items.server.description": "My home server that runs on a old computer. It runs alpine linux setted up with pihole for adblocking and security, a minecraft server and a file hosting server.",
    "projects.items.server.category": "linux",

    "projects.items.pixel.title": "Store Management Program",
    "projects.items.pixel.description": "I created a store management software with C# and WinUI for the Windows OS.",
    "projects.items.pixel.category": "software",

    "projects.items.artifacts.title": "EZPass",
    "projects.items.artifacts.description": "A password manager software written in Rust and Slint. It uses Argon2 and SHA256 for encryption and hashing. It also syncs with a browser extension for autocomplete.",
    "projects.items.artifacts.category": "software",

    // Skills Section
    "skills.title": "SKILLS",
    "skills.description": "Technical abilities acquired through my experiences and research.",
    "skills.technologies": "TECHNOLOGIES",
    "skills.viewDetails": "VIEW DETAILS",
    "skills.detailedInfo": "DETAILED INFORMATION",
    "skills.noAdditionalInfo": "No additional information available in the system.",
    "skills.profileLoaded": "Skill profile loaded",
    "skills.connectionSecure": "Connection secure",
    "skills.encryptionEnabled": "Encryption enabled",

    // Skills - Frontend
    "skills.frontend.title": "Frontend Development",
    "skills.frontend.description": "Responsive, minimalistic or detailed interfaces with modern web technologies.",
    "skills.frontend.details":
      "My experience with frontend development is one of my many interests as a cybersecurity enthusiast. I have experiences with many stacks and try to be flexible with the ones I use. I like being able to adapt to new things.",

    // Skills - Backend
    "skills.backend.title": "Software Development",
    "skills.backend.description": "Creating multiplatform software",
    "skills.backend.details":
      "I like to build software, being it for work or as a hobbie, I just love building things. I have more experience with Java, C, C# and Python while trying to  get my hands dirty on Rust, a new low-level and fast programming language that is being implemented on Windows and Linux systems, and also C++ for game development.",

    // Skills - Database
    "skills.database.title": "Database Management and Backend",
    "skills.database.description": "Data manegement and Data integration",
    "skills.database.details":
      "I am a fullstack dev, I implement data logic for my websites and server operations aswell to make it all acessible. I also know my ways in MySQL, PostgreSQL and SQLite.",

    // Skills - AI
    "skills.ai.title": "Linux",
    "skills.ai.description": "Setup of the Linux OS for multiple purposes",
    "skills.ai.details":
      "I use Computers since I was 4y old and had my first contact with linux at 11, while browsing youtube, my first distro was debian based. I daily drive it to this day and while still distro hopping, I am using void linux as my main. Have used Debian, Arch and Gentoo in the past.",

    // Contact Section
    "contact.title": "CONTACT",
    "contact.description": "Contact me to ask for more.",
    "contact.form.title": "CONTACT FORM",
    "contact.form.subtitle": "Send a message.",
    "contact.form.name": "NAME",
    "contact.form.email": "EMAIL",
    "contact.form.message": "MESSAGE",
    "contact.form.send": "Send Message",
    "contact.form.sending": "Transmitting...",
    "contact.form.success": "MESSAGE TRANSMITTED",
    "contact.form.successDesc": "Your message has been received. I'll contact you back soon.",
    "contact.form.sendAnother": "Send Another Message",

    // Footer
    "footer.copyright": "Diogo Fragoso",
    "footer.presentDay": "From the Void",

    // Terminal
    "terminal.title": "TERMINAL CONNECTION",
    "terminal.connection": "WIRED CONNECTION ESTABLISHED",
    "terminal.helpPrompt": 'Type "help" for available commands.',
    "terminal.processing": "Processing...",
    "terminal.placeholder": "Type a command...",
    "terminal.help": `Available commands:
- help: Display this help message
- about: Learn about me
- contact: Get my contact information
- projects: View my projects
- clear: Clear the terminal
- exit: Close this connection`,
    "terminal.about":
      "Please read the About me section, these are my other links",
    "terminal.contact": `Email: fragosodiogo245@gmail.com
GitHub: github.com/Ecztassy`,
    "terminal.projects": `Navigate to the Projects section to view my work.
Use the selection filters to filter by category.`,
    "terminal.cleared": "Terminal cleared.",
    "terminal.exit": "Closing connection...",
    "terminal.notRecognized": `Command not recognized: "{command}". Type "help" for available commands.`,
  },
  es: {
    // Navigation
    "nav.home": "INICIO",
    "nav.about": "SOBRE MÍ",
    "nav.projects": "PROYECTOS",
    "nav.skills": "HABILIDADES",
    "nav.contact": "CONTACTO",

    // Welcome Screen
    "welcome.title": "VACÍO",
    "welcome.subtitle": "PORTAFOLIO",
    "welcome.select": "Seleccionar Idioma",
    "welcome.continue": "ENTRAR AL CABLEADO",

    // Hero Section
    "hero.title": "TRABAJOS",
    "hero.subtitle": "PORTAFOLIO",
    "hero.description": "Una colección de mis trabajos y habilidades.",
    "hero.viewProjects": "Ver Proyectos",
    "hero.aboutMe": "Sobre Mí",

    // About Section
    "about.title": "SOBRE MÍ",
    "about.p1": "Hola, mi nombre es Diogo, soy un estudiante de programación de {{age}} años con una pasión por todo tipo de tecnología.",
    "about.p2": "Mi trabajo se centra en el desarrollo web fullstack, desarrollo de software, servidores y bases de datos.",
    "about.p3": "Busco salir de la fase alfa y ser la mejor versión de mí mismo, mejorando cada día, todo el tiempo.",
    "about.quote": "Por encima de todo, hazte sentir orgulloso.",
    "about.terminal.identity": "Identidad confirmada",
    "about.terminal.connection": "Conexión establecida",
    "about.terminal.present": "Propietario confirmado",

    // Projects Section
    "projects.title": "PROYECTOS",
    "projects.description": "Cosas que he creado",
    "projects.selectCategory": "SELECCIONAR CATEGORÍA DE PROYECTO:",
    "projects.categorySelected": "CATEGORÍA SELECCIONADA",
    "projects.loading": "Cargando proyectos...",
    "projects.noProjects": "No se encontraron proyectos en esta categoría.",
    "projects.terminal.title": "PROYECTOS_CATEGORIAS.exe",
    "projects.terminal.loading": "Cargando categorías...",

    // Project Categories
    "projects.categories.all": "TODOS LOS PROYECTOS",
    "projects.categories.web": "Desarrollo Web",
    "projects.categories.software": "Software",
    "projects.categories.server": "Servidores",
    "projects.categories.linux": "Linux",

    // Project Items
    "projects.items.ezpass.title": "Sitio Web EZPass",
    "projects.items.ezpass.description": "Un sitio web que creé para publicitar mi software de gestión de contraseñas.",
    "projects.items.ezpass.category": "web",

    "projects.items.portfolio.title": "Portafolio Antiguo",
    "projects.items.portfolio.description": "Mi antiguo sitio web de portafolio, creado con jQuery y Bootstrap.",
    "projects.items.portfolio.category": "web",

    "projects.items.protocol.title": "Sobre Mí",
    "projects.items.protocol.description": "Una página que creé para hablar sobre mí y mi personalidad.",
    "projects.items.protocol.category": "web",

    "projects.items.memory.title": "Mi Primer Sitio Web",
    "projects.items.memory.description": "Creado para la escuela, un sitio web simple para explicar sobre hardware, software, servidores y proporcionar contenido para nuestras materias.",
    "projects.items.memory.category": "web",

    "projects.items.engine.title": "Servidor FTP",
    "projects.items.engine.description": "Un FTP simple que configuré para almacenar archivos en mi servidor personal. Tiene permisos de archivo seguros en Linux y control de usuarios.",
    "projects.items.engine.category": "server",

    "projects.items.wired.title": "XAMPP/Wordpress",
    "projects.items.wired.description": "Fui el responsable de configurar el servidor XAMPP y Wordpress para el proyecto grupal de mi escuela. También creé una sección del sitio web para hablar sobre Linux.",
    "projects.items.wired.category": "web",

    "projects.items.extension.title": "Extensión EZPass",
    "projects.items.extension.description": "Una extensión de navegador que creé para autocompletar contraseñas en el navegador que se vincula con mi software de gestión de contraseñas.",
    "projects.items.extension.category": "web",

    "projects.items.server.title": "Servidor Casero",
    "projects.items.server.description": "Mi servidor casero que funciona en una computadora vieja. Corre Alpine Linux configurado con Pi-hole para bloqueo de anuncios y seguridad, un servidor de Minecraft y un servidor de alojamiento de archivos.",
    "projects.items.server.category": "linux",

    "projects.items.pixel.title": "Programa de Gestión de Tienda",
    "projects.items.pixel.description": "Creé un software de gestión de tienda con C# y WinUI para el sistema operativo Windows.",
    "projects.items.pixel.category": "software",

    "projects.items.artifacts.title": "EZPass",
    "projects.items.artifacts.description": "Un software de gestión de contraseñas escrito en Rust y Slint. Utiliza Argon2 y SHA256 para cifrado y hash. También se sincroniza con una extensión de navegador para autocompletado.",
    "projects.items.artifacts.category": "software",

    // Skills Section
    "skills.title": "HABILIDADES",
    "skills.description": "Habilidades técnicas adquiridas a través de mis experiencias e investigación.",
    "skills.technologies": "TECNOLOGÍAS",
    "skills.viewDetails": "VER DETALLES",
    "skills.detailedInfo": "INFORMACIÓN DETALLADA",
    "skills.noAdditionalInfo": "No hay información adicional disponible en el sistema.",
    "skills.profileLoaded": "Perfil de habilidades cargado",
    "skills.connectionSecure": "Conexión segura",
    "skills.encryptionEnabled": "Cifrado habilitado",

    // Skills - Frontend
    "skills.frontend.title": "Desarrollo Frontend",
    "skills.frontend.description": "Interfaces responsivas, minimalistas o detalladas con tecnologías web modernas.",
    "skills.frontend.details": "Mi experiencia con el desarrollo frontend es uno de mis muchos intereses como entusiasta de la ciberseguridad. Tengo experiencia con muchas 'frameworks' y trato de ser flexible con las que uso. Me gusta poder adaptarme a cosas nuevas.",

    // Skills - Backend
    "skills.backend.title": "Desarrollo de Software",
    "skills.backend.description": "Creación de software multiplataforma",
    "skills.backend.details": "Me gusta construir software, ya sea para trabajo o como pasatiempo, simplemente amo crear cosas. Tengo más experiencia con Java, C, C# y Python mientras intento ensuciarme las manos con Rust, un nuevo lenguaje de programación de bajo nivel y rápido que se está implementando en sistemas Windows y Linux, y también C++ para desarrollo de juegos.",

    // Skills - Database
    "skills.database.title": "Gestión de Bases de Datos y Backend",
    "skills.database.description": "Gestión de datos e integración de datos",
    "skills.database.details": "Soy un desarrollador fullstack, implemento lógica de datos para mis sitios web y operaciones de servidor también para hacerlo todo accesible. También sé manejarme con MySQL, PostgreSQL y SQLite.",

    // Skills - AI
    "skills.ai.title": "Linux",
    "skills.ai.description": "Configuración del sistema operativo Linux para múltiples propósitos",
    "skills.ai.details": "Uso computadoras desde que tenía 4 años y tuve mi primer contacto con Linux a los 11, mientras navegaba por YouTube, mi primera distribución fue basada en Debian. Lo uso diariamente hasta hoy y, mientras sigo probando distribuciones, estoy usando Void Linux como mi principal. He usado Debian, Arch y Gentoo en el pasado.",

    // Contact Section
    "contact.title": "CONTACTO",
    "contact.description": "Contáctame para preguntar más.",
    "contact.form.title": "FORMULARIO DE CONTACTO",
    "contact.form.subtitle": "Envía un mensaje.",
    "contact.form.name": "NOMBRE",
    "contact.form.email": "CORREO",
    "contact.form.message": "MENSAJE",
    "contact.form.send": "Enviar Mensaje",
    "contact.form.sending": "Transmitiendo...",
    "contact.form.success": "MENSAJE TRANSMITIDO",
    "contact.form.successDesc": "Tu mensaje ha sido recibido. Te contactaré pronto.",
    "contact.form.sendAnother": "Enviar Otro Mensaje",

    // Footer
    "footer.copyright": "Diogo Fragoso",
    "footer.presentDay": "From the Void",

    // Terminal
    "terminal.title": "CONEXIÓN TERMINAL",
    "terminal.connection": "CONEXIÓN AL CABLEADO ESTABLECIDA",
    "terminal.helpPrompt": 'Escribe "help" para ver los comandos disponibles.',
    "terminal.processing": "Procesando...",
    "terminal.placeholder": "Escribe un comando...",
    "terminal.help": `Comandos disponibles:
- help: Muestra este mensaje de ayuda
- about: Conoce sobre mí
- contact: Obtén mi información de contacto
- projects: Ver mis proyectos
- clear: Limpiar la terminal
- exit: Cerrar esta conexión`,
    "terminal.about": "Por favor lee la sección Sobre Mí, estos son mis otros enlaces",
    "terminal.contact": `Email: fragosodiogo245@gmail.com
GitHub: github.com/Ecztassy`,
    "terminal.projects": `Navega a la sección de Proyectos para ver mi trabajo.
Usa la selección para filtrar por categoría.`,
    "terminal.cleared": "Terminal limpiada.",
    "terminal.exit": "Cerrando conexión...",
    "terminal.notRecognized": `Comando no reconocido: "{command}". Escribe "help" para ver los comandos disponibles.`,
  },
  jp: {
    // Navigation
    "nav.home": "ホーム",
    "nav.about": "私について",
    "nav.projects": "プロジェクト",
    "nav.skills": "スキル",
    "nav.contact": "連絡先",

    // Welcome Screen
    "welcome.title": "虚空",
    "welcome.subtitle": "ポートフォリオ",
    "welcome.select": "言語を選択",
    "welcome.continue": "ワイヤードに入る",

    // Hero Section
    "hero.title": "作品",
    "hero.subtitle": "ポートフォリオ",
    "hero.description": "私の作品とスキルのコレクション。",
    "hero.viewProjects": "プロジェクトを見る",
    "hero.aboutMe": "私について",

    // About Section
    "about.title": "私について",
    "about.p1": "こんにちは、私の名前はDiogo(ディオゴ)です。{{age}}歳のプログラミング学生で、あらゆる種類の技術に情熱を持っています。",
    "about.p2": "私の仕事はフルスタックウェブ開発、ソフトウェア開発、サーバー、データベースに焦点を当てています。",
    "about.p3": "アルファ版から脱却し、毎日、常に自分自身のより良いバージョンになることを目指しています。",
    "about.quote": "何よりも、自分自身を誇りに思うように。",
    "about.terminal.identity": "アイデンティティ確認",
    "about.terminal.connection": "接続確立",
    "about.terminal.present": "所有者確認",

    // Projects Section
    "projects.title": "プロジェクト",
    "projects.description": "私が作ったもの",
    "projects.selectCategory": "プロジェクトカテゴリを選択:",
    "projects.categorySelected": "選択されたカテゴリ",
    "projects.loading": "プロジェクトを読み込み中...",
    "projects.noProjects": "このカテゴリにプロジェクトが見つかりません。",
    "projects.terminal.title": "プロジェクト_カテゴリ.exe",
    "projects.terminal.loading": "カテゴリを読み込み中...",

    // Project Categories
    "projects.categories.all": "すべてのプロジェクト",
    "projects.categories.web": "ウェブ開発",
    "projects.categories.software": "ソフトウェア",
    "projects.categories.server": "サーバー",
    "projects.categories.linux": "Linux",

    // Project Items
    "projects.items.ezpass.title": "EZPassウェブサイト",
    "projects.items.ezpass.description": "私が作成したパスワード管理ソフトウェアを宣伝するためのウェブサイト。",
    "projects.items.ezpass.category": "web",

    "projects.items.portfolio.title": "古いポートフォリオ",
    "projects.items.portfolio.description": "jQueryとBootstrapで作成した私の古いポートフォリオウェブサイト。",
    "projects.items.portfolio.category": "web",

    "projects.items.protocol.title": "私について",
    "projects.items.protocol.description": "私自身と私の性格について話すために作成したページ。",
    "projects.items.protocol.category": "web",

    "projects.items.memory.title": "初めてのウェブサイト",
    "projects.items.memory.description": "学校のために作成した、ハードウェア、ソフトウェア、サーバーについて説明し、授業のためのコンテンツを提供するシンプルなウェブサイト。",
    "projects.items.memory.category": "web",

    "projects.items.engine.title": "FTPサーバー",
    "projects.items.engine.description": "私の個人サーバーにファイルを保存するために設定したシンプルなFTP。Linuxの安全なファイル許可とユーザー管理を備えています。",
    "projects.items.engine.category": "server",

    "projects.items.wired.title": "XAMPP/Wordpress",
    "projects.items.wired.description": "学校のグループプロジェクトのためにXAMPPサーバーとWordpressを設定する責任者でした。また、Linuxについて話すウェブサイトのセクションも作成しました。",
    "projects.items.wired.category": "web",

    "projects.items.extension.title": "EZPass拡張機能",
    "projects.items.extension.description": "ブラウザでパスワードを自動入力するために作成したブラウザ拡張機能で、私のパスワード管理ソフトウェアと連携します。",
    "projects.items.extension.category": "web",

    "projects.items.server.title": "ホームサーバー",
    "projects.items.server.description": "古いコンピューターで動作する私のホームサーバー。Alpine Linuxで動作し、広告ブロックとセキュリティのためにPi-hole、Minecraftサーバー、ファイルホスティングサーバーを設定しています。",
    "projects.items.server.category": "linux",

    "projects.items.pixel.title": "店舗管理プログラム",
    "projects.items.pixel.description": "Windows OS用にC#とWinUIで作成した店舗管理ソフトウェア。",
    "projects.items.pixel.category": "software",

    "projects.items.artifacts.title": "EZPass",
    "projects.items.artifacts.description": "RustとSlintで書かれたパスワード管理ソフトウェア。Argon2とSHA256を使用して暗号化とハッシュを行い、ブラウザ拡張機能と同期して自動入力も可能です。",
    "projects.items.artifacts.category": "software",

    // Skills Section
    "skills.title": "スキル",
    "skills.description": "私の経験と研究を通じて獲得した技術的能力。",
    "skills.technologies": "テクノロジー",
    "skills.viewDetails": "詳細を見る",
    "skills.detailedInfo": "詳細情報",
    "skills.noAdditionalInfo": "システムに追加情報はありません。",
    "skills.profileLoaded": "スキルプロファイルが読み込まれました",
    "skills.connectionSecure": "接続が安全です",
    "skills.encryptionEnabled": "暗号化が有効です",

    // Skills - Frontend
    "skills.frontend.title": "フロントエンド開発",
    "skills.frontend.description": "最新のウェブ技術を使用して、レスポンシブでミニマリストまたは詳細なインターフェースを作成。",
    "skills.frontend.details": "フロントエンド開発に関する私の経験は、サイバーセキュリティ愛好家としての多くの興味の一つです。多くのスタックでの経験があり、使用するものに対して柔軟であろうとしています。新しいものに適応できるのが好きです。",

    // Skills - Backend
    "skills.backend.title": "ソフトウェア開発",
    "skills.backend.description": "マルチプラットフォームソフトウェアの作成",
    "skills.backend.details": "ソフトウェアを作るのが好きで、それが仕事であろうと趣味であろうと、ただ作ることが大好きです。Java、C、C#、Pythonでの経験が豊富で、WindowsやLinuxシステムに実装されている新しい低レベルで高速なプログラミング言語Rustや、ゲーム開発のためのC++に挑戦しています。",

    // Skills - Database
    "skills.database.title": "データベース管理とバックエンド",
    "skills.database.description": "データ管理とデータ統合",
    "skills.database.details": "私はフルスタック開発者で、ウェブサイトやサーバー操作のためのデータロジックを実装し、すべてにアクセスできるようにしています。MySQL、PostgreSQL、SQLiteの扱い方も知っています。",

    // Skills - AI
    "skills.ai.title": "Linux",
    "skills.ai.description": "複数の目的のためのLinux OSのセットアップ",
    "skills.ai.details": "4歳からコンピュータを使い始め、11歳の時にYouTubeを見ながらLinuxに初めて触れました。最初のディストリビューションはDebianベースでした。現在も毎日使い続けており、ディストリビューションを試しながら、今はVoid Linuxをメインに使っています。過去にはDebian、Arch、Gentooを使用しました。",

    // Contact Section
    "contact.title": "連絡先",
    "contact.description": "もっと知りたい場合は私に連絡してください。",
    "contact.form.title": "コンタクトフォーム",
    "contact.form.subtitle": "メッセージを送信してください。",
    "contact.form.name": "名前",
    "contact.form.email": "メール",
    "contact.form.message": "メッセージ",
    "contact.form.send": "メッセージを送信",
    "contact.form.sending": "送信中...",
    "contact.form.success": "メッセージ送信完了",
    "contact.form.successDesc": "あなたのメッセージを受け取りました。すぐに連絡します。",
    "contact.form.sendAnother": "別のメッセージを送信",

    // Footer
    "footer.copyright": "Diogo Fragoso",
    "footer.presentDay": "From the Void",

    // Terminal
    "terminal.title": "ターミナル接続",
    "terminal.connection": "ワイヤード接続確立",
    "terminal.helpPrompt": '利用可能なコマンドを表示するには "help" と入力してください。',
    "terminal.processing": "処理中...",
    "terminal.placeholder": "コマンドを入力...",
    "terminal.help": `利用可能なコマンド:
- help: このヘルプメッセージを表示
- about: 私について知る
- contact: 連絡先情報を取得
- projects: プロジェクトを表示
- clear: ターミナルをクリア
- exit: この接続を閉じる`,
    "terminal.about": "「私について」セクションを読んでください。これが私の他のリンクです",
    "terminal.contact": `Email: fragosodiogo245@gmail.com
GitHub: github.com/Ecztassy`,
    "terminal.projects": 'プロジェクトセクションに移動して私の作品を表示します。選択フィルターを使用してカテゴリごとにフィルタリングしてください。',
    "terminal.cleared": "ターミナルがクリアされました。",
    "terminal.exit": "接続を閉じています...",
    "terminal.notRecognized": `コマンドが認識されません: "{command}"。利用可能なコマンドを表示するには "help" と入力してください。`,
  },
  pt: {
    // Navigation
    "nav.home": "INÍCIO",
    "nav.about": "SOBRE MIM",
    "nav.projects": "PROJETOS",
    "nav.skills": "HABILIDADES",
    "nav.contact": "CONTATO",

    // Welcome Screen
    "welcome.title": "Void",
    "welcome.subtitle": "PORTFÓLIO",
    "welcome.select": "Selecionar o Idioma",
    "welcome.continue": "ENTRAR NA REDE",

    // Hero Section
    "hero.title": "TRABALHOS",
    "hero.subtitle": "PORTFÓLIO",
    "hero.description": "Uma coleção dos meus trabalhos e habilidades.",
    "hero.viewProjects": "Ver Projetos",
    "hero.aboutMe": "Sobre Mim",

    // About Section
    "about.title": "SOBRE MIM",
    "about.p1": "Olá, o meu nome é Diogo, sou um estudante de programação de {{age}} anos com paixão por todos os tipos de tecnologia.",
    "about.p2": "O meu trabalho foca no desenvolvimento web fullstack, desenvolvimento de software, servidores e Databases.",
    "about.p3": "Quero sair da fase alfa e ser a melhor versão de mim mesmo, melhorar todos os dias, o tempo todo.",
    "about.quote": "Acima de tudo, orgulhe-se de ser quem é",
    "about.terminal.identity": "Identidade confirmada",
    "about.terminal.connection": "Conexão estabelecida",
    "about.terminal.present": "Proprietário confirmado",

    // Projects Section
    "projects.title": "PROJETOS",
    "projects.description": "Coisas que eu criei",
    "projects.selectCategory": "SELECIONAR CATEGORIA DE PROJETO:",
    "projects.categorySelected": "CATEGORIA SELECIONADA",
    "projects.loading": "Carregando projetos...",
    "projects.noProjects": "Nenhum projeto encontrado nesta categoria.",
    "projects.terminal.title": "CATEGORIAS_PROJETO.exe",
    "projects.terminal.loading": "Carregando categorias...",

    // Project Categories
    "projects.categories.all": "TODOS OS PROJETOS",
    "projects.categories.web": "Desenvolvimento Web",
    "projects.categories.software": "Software",
    "projects.categories.server": "Servidores",
    "projects.categories.linux": "Linux",

    // Project Items
    "projects.items.ezpass.title": "Site EZPass",
    "projects.items.ezpass.description": "Um site que criei para divulgar o meu software de gerenciamento de palavras-passe.",
    "projects.items.ezpass.category": "web",

    "projects.items.portfolio.title": "Portfólio Antigo",
    "projects.items.portfolio.description": "O meu site de portfólio antigo, criado com jQuery e Bootstrap.",
    "projects.items.portfolio.category": "web",

    "projects.items.protocol.title": "Sobre Mim",
    "projects.items.protocol.description": "Uma página que criei para falar sobre mim e minha personalidade.",
    "projects.items.protocol.category": "web",

    "projects.items.memory.title": "Meu Primeiro Site",
    "projects.items.memory.description": "Criado para um projeto escolar, um site simples para explicar sobre hardware, software, servidores e fornecer conteúdo para nossas disciplinas.",
    "projects.items.memory.category": "web",

    "projects.items.engine.title": "Servidor FTP",
    "projects.items.engine.description": "Um FTP simples que configurei para armazenar arquivos no meu servidor pessoal. Possui permissões de arquivo seguras no Linux e controle de utilizadores.",
    "projects.items.engine.category": "server",

    "projects.items.wired.title": "XAMPP/Wordpress",
    "projects.items.wired.description": "Fui responsável por configurar o servidor XAMPP e o Wordpress para um projeto em grupo na minha escola. Também criei uma seção do site para falar sobre Linux.",
    "projects.items.wired.category": "web",

    "projects.items.extension.title": "Extensão EZPass",
    "projects.items.extension.description": "Uma extensão de 'browser' que criei para autocompletar palavras-passe no 'browser', que se conecta ao meu software de gerenciamento de palavras-passe.",
    "projects.items.extension.category": "web",

    "projects.items.server.title": "Servidor Doméstico",
    "projects.items.server.description": "O meu servidor doméstico que roda em um computador antigo. Ele tem o Alpine Linux instalado e configurado com Pi-hole e um servidor de hospedagem de arquivos.",
    "projects.items.server.category": "linux",

    "projects.items.pixel.title": "Programa de Gerenciamento de Loja",
    "projects.items.pixel.description": "Criei um software de gerenciamento para uma loja com C# e WinUI para o sistema operacional Windows.",
    "projects.items.pixel.category": "software",

    "projects.items.artifacts.title": "EZPass",
    "projects.items.artifacts.description": "Um software de gerenciamento de palavras-passe escrito em Rust e Slint. Usa Argon2 e SHA256 para criptografia e hash. Também sincroniza com uma extensão de 'browser' para autocompletar.",
    "projects.items.artifacts.category": "software",

    // Skills Section
    "skills.title": "HABILIDADES",
    "skills.description": "Habilidades técnicas adquiridas por meio das minhas experiências e pesquisas.",
    "skills.technologies": "TECNOLOGIAS",
    "skills.viewDetails": "VER DETALHES",
    "skills.detailedInfo": "INFORMAÇÕES DETALHADAS",
    "skills.noAdditionalInfo": "Nenhuma informação adicional disponível no sistema.",
    "skills.profileLoaded": "Perfil de habilidades carregado",
    "skills.connectionSecure": "Conexão segura",
    "skills.encryptionEnabled": "Criptografia ativada",

    // Skills - Frontend
    "skills.frontend.title": "Desenvolvimento Frontend",
    "skills.frontend.description": "Interfaces responsivas, minimalistas ou detalhadas com tecnologias web modernas.",
    "skills.frontend.details": "A minha experiência com desenvolvimento frontend é um dos meus muitos interesses como entusiasta de cibersegurança. Tenho experiência com várias bibliotecas e tento ser flexível com as que uso. Gosto de poder me adaptar a coisas novas.",

    // Skills - Backend
    "skills.backend.title": "Desenvolvimento de Software",
    "skills.backend.description": "Criação de software multiplataforma",
    "skills.backend.details": "Gosto de desenvolver software, seja para trabalho ou como hobby, simplesmente adoro criar coisas. Tenho mais experiência com Java, C, C# e Python enquanto tento me aventurar em Rust, uma nova linguagem de programação de baixo nível e rápida que está sendo implementada em sistemas Windows e Linux, e também C++ para desenvolvimento de jogos.",

    // Skills - Database
    "skills.database.title": "Gerenciamento de Banco de Dados e Backend",
    "skills.database.description": "Gerenciamento e integração de dados",
    "skills.database.details": "Sou um desenvolvedor fullstack, implemento lógica de dados para meus sites e operações de servidor também para tornar tudo acessível. Também sei trabalhar com MySQL, PostgreSQL e SQLite.",

    // Skills - AI
    "skills.ai.title": "Linux",
    "skills.ai.description": "Configuração do sistema operacional Linux para múltiplos propósitos",
    "skills.ai.details": "Uso computadores desde os 4 anos e tive meu primeiro contato com Linux aos 11, enquanto explorava o YouTube, minha primeira distro foi baseada em Debian. Uso diariamente até hoje e, enquanto ainda testo outras distros, utilizo Void Linux como meu principal. Usei Debian, Arch e Gentoo no passado.",

    // Contact Section
    "contact.title": "CONTACTO",
    "contact.description": "Contacte-me para saber mais.",
    "contact.form.title": "FORMULÁRIO DE CONTATO",
    "contact.form.subtitle": "Envie uma mensagem.",
    "contact.form.name": "NOME",
    "contact.form.email": "EMAIL",
    "contact.form.message": "MENSAGEM",
    "contact.form.send": "Enviar Mensagem",
    "contact.form.sending": "Transmitindo...",
    "contact.form.success": "MENSAGEM TRANSMITIDA",
    "contact.form.successDesc": "Sua mensagem foi recebida. Entrarei em contato em breve.",
    "contact.form.sendAnother": "Enviar Outra Mensagem",

    // Footer
    "footer.copyright": "Diogo Fragoso",
    "footer.presentDay": "From the Void",

    // Terminal
    "terminal.title": "CONEXÃO DE TERMINAL",
    "terminal.connection": "CONEXÃO COM A REDE ESTABELECIDA",
    "terminal.helpPrompt": 'Execute "help" para comandos disponíveis.',
    "terminal.processing": "A processar...",
    "terminal.placeholder": "Execute um comando...",
    "terminal.help": `Comandos disponíveis:
- help: Exibe esta mensagem de ajuda
- about: Saiba mais sobre mim
- contact: As minhas informações de contato
- projects: Os meus projetos
- clear: Limpar o terminal
- exit: Feche esta conexão`,
    "terminal.about": "Por favor, leia a seção Sobre Mim.",
    "terminal.contact": `Email: fragosodiogo245@gmail.com
GitHub: github.com/Ecztassy`,
    "terminal.projects": `Navegue até a seção de Projetos para ver meu trabalho.
Use os filtros.`,
    "terminal.cleared": "Terminal limpo.",
    "terminal.exit": "A terminar conexão...",
    "terminal.notRecognized": `Comando não reconhecido: "{command}". Digite "help" para comandos disponíveis.`,
  },
  fr: {
    // Navigation
    "nav.home": "ACCUEIL",
    "nav.about": "À PROPOS",
    "nav.projects": "PROJETS",
    "nav.skills": "COMPÉTENCES",
    "nav.contact": "CONTACT",

    // Welcome Screen
    "welcome.title": "Vide",
    "welcome.subtitle": "PORTFOLIO",
    "welcome.select": "Sélectionner la langue",
    "welcome.continue": "ENTRER DANS LE RÉSEAU",

    // Hero Section
    "hero.title": "TRAVAUX",
    "hero.subtitle": "PORTFOLIO",
    "hero.description": "Une collection de mes travaux et compétences.",
    "hero.viewProjects": "Voir les projets",
    "hero.aboutMe": "À propos de moi",

    // About Section
    "about.title": "À PROPOS DE MOI",
    "about.p1": "Salut, je m'appelle Diogo, j'ai {{age}} ans et je suis étudiant en programmation avec une passion pour toutes sortes de technologies.",
    "about.p2": "Mon travail se concentre sur le développement web fullstack, le développement de logiciels, les serveurs et les bases de données.",
    "about.p3": "Je vise à sortir de la phase alpha et à devenir une meilleure version de moi-même, en m'améliorant chaque jour, à chaque instant.",
    "about.quote": "Par-dessus tout, rends-toi fier.",
    "about.terminal.identity": "Identité confirmée",
    "about.terminal.connection": "Connexion établie",
    "about.terminal.present": "Propriétaire confirmé",

    // Projects Section
    "projects.title": "PROJETS",
    "projects.description": "Choses que j'ai créées",
    "projects.selectCategory": "SÉLECTIONNER UNE CATÉGORIE DE PROJET :",
    "projects.categorySelected": "CATÉGORIE SÉLECTIONNÉE",
    "projects.loading": "Chargement des projets...",
    "projects.noProjects": "Aucun projet trouvé dans cette catégorie.",
    "projects.terminal.title": "CATÉGORIES_PROJETS.exe",
    "projects.terminal.loading": "Chargement des catégories...",

    // Project Categories
    "projects.categories.all": "TOUS LES PROJETS",
    "projects.categories.web": "Développement Web",
    "projects.categories.software": "Logiciels",
    "projects.categories.server": "Serveurs",
    "projects.categories.linux": "Linux",

    // Project Items
    "projects.items.ezpass.title": "Site Web EZPass",
    "projects.items.ezpass.description": "Un site web que j'ai créé pour promouvoir mon logiciel de gestion de mots de passe.",
    "projects.items.ezpass.category": "web",

    "projects.items.portfolio.title": "Ancien Portfolio",
    "projects.items.portfolio.description": "Mon ancien site de portfolio, créé avec jQuery et Bootstrap.",
    "projects.items.portfolio.category": "web",

    "projects.items.protocol.title": "À Propos de Moi",
    "projects.items.protocol.description": "Une page que j'ai créée pour parler de moi et de ma personnalité.",
    "projects.items.protocol.category": "web",

    "projects.items.memory.title": "Tout Premier Site Web",
    "projects.items.memory.description": "Créé pour l'école, un site web simple pour expliquer le matériel, les logiciels, les serveurs et fournir du contenu pour nos sujets.",
    "projects.items.memory.category": "web",

    "projects.items.engine.title": "Serveur FTP",
    "projects.items.engine.description": "Un simple serveur FTP que j'ai configuré pour stocker des fichiers sur mon serveur personnel. Il dispose de permissions de fichiers Linux sécurisées et d'un contrôle des utilisateurs.",
    "projects.items.engine.category": "serveur",

    "projects.items.wired.title": "XAMPP/Wordpress",
    "projects.items.wired.description": "J'ai été responsable de la configuration du serveur XAMPP et de Wordpress pour mon projet de groupe à l'école. J'ai également créé une section du site pour parler de Linux.",
    "projects.items.wired.category": "web",

    "projects.items.extension.title": "Extension EZPass",
    "projects.items.extension.description": "Une extension de navigateur que j'ai créée pour autocompléter les mots de passe dans le navigateur, liée à mon logiciel de gestion de mots de passe.",
    "projects.items.extension.category": "web",

    "projects.items.server.title": "Serveur Domestique",
    "projects.items.server.description": "Mon serveur domestique qui fonctionne sur un vieil ordinateur. Il utilise Alpine Linux configuré avec Pi-hole pour le blocage des publicités et la sécurité, un serveur Minecraft et un serveur d'hébergement de fichiers.",
    "projects.items.server.category": "linux",

    "projects.items.pixel.title": "Programme de Gestion de Magasin",
    "projects.items.pixel.description": "J'ai créé un logiciel de gestion de magasin avec C# et WinUI pour le système d'exploitation Windows.",
    "projects.items.pixel.category": "logiciel",

    "projects.items.artifacts.title": "EZPass",
    "projects.items.artifacts.description": "Un logiciel de gestion de mots de passe écrit en Rust et Slint. Il utilise Argon2 et SHA256 pour le chiffrement et le hachage. Il se synchronise également avec une extension de navigateur pour l'autocomplétion.",
    "projects.items.artifacts.category": "logiciel",

    // Skills Section
    "skills.title": "COMPÉTENCES",
    "skills.description": "Compétences techniques acquises grâce à mes expériences et recherches.",
    "skills.technologies": "TECHNOLOGIES",
    "skills.viewDetails": "VOIR LES DÉTAILS",
    "skills.detailedInfo": "INFORMATIONS DÉTAILLÉES",
    "skills.noAdditionalInfo": "Aucune information supplémentaire disponible dans le système.",
    "skills.profileLoaded": "Profil de compétences chargé",
    "skills.connectionSecure": "Connexion sécurisée",
    "skills.encryptionEnabled": "Chiffrement activé",

    // Skills - Frontend
    "skills.frontend.title": "Développement Frontend",
    "skills.frontend.description": "Interfaces réactives, minimalistes ou détaillées avec des technologies web modernes.",
    "skills.frontend.details": "Mon expérience en développement frontend est l'un de mes nombreux centres d'intérêt en tant qu'enthousiaste de la cybersécurité. J'ai de l'expérience avec de nombreuses piles technologiques et j'essaie d'être flexible avec celles que j'utilise. J'aime pouvoir m'adapter à de nouvelles choses.",

    // Skills - Backend
    "skills.backend.title": "Développement de Logiciels",
    "skills.backend.description": "Création de logiciels multiplateformes",
    "skills.backend.details": "J'aime construire des logiciels, que ce soit pour le travail ou comme passe-temps, j'adore simplement créer des choses. J'ai plus d'expérience avec Java, C, C# et Python tout en essayant de me salir les mains avec Rust, un nouveau langage de programmation rapide et de bas niveau qui est implémenté dans les systèmes Windows et Linux, ainsi que C++ pour le développement de jeux.",

    // Skills - Database
    "skills.database.title": "Gestion de Bases de Données et Backend",
    "skills.database.description": "Gestion et intégration des données",
    "skills.database.details": "Je suis un développeur fullstack, j'implémente la logique des données pour mes sites web et les opérations serveur afin de tout rendre accessible. Je connais également bien MySQL, PostgreSQL et SQLite.",

    // Skills - AI
    "skills.ai.title": "Linux",
    "skills.ai.description": "Configuration du système d'exploitation Linux pour divers usages",
    "skills.ai.details": "J'utilise des ordinateurs depuis l'âge de 4 ans et j'ai eu mon premier contact avec Linux à 11 ans, en naviguant sur YouTube. Ma première distribution était basée sur Debian. Je l'utilise quotidiennement à ce jour et, tout en continuant à tester différentes distributions, j'utilise actuellement Void Linux comme principale. J'ai utilisé Debian, Arch et Gentoo par le passé.",

    // Contact Section
    "contact.title": "CONTACT",
    "contact.description": "Contactez-moi pour en savoir plus.",
    "contact.form.title": "FORMULAIRE DE CONTACT",
    "contact.form.subtitle": "Envoyer un message.",
    "contact.form.name": "NOM",
    "contact.form.email": "EMAIL",
    "contact.form.message": "MESSAGE",
    "contact.form.send": "Envoyer le message",
    "contact.form.sending": "Transmission...",
    "contact.form.success": "MESSAGE TRANSMIS",
    "contact.form.successDesc": "Votre message a été reçu. Je vous répondrai bientôt.",
    "contact.form.sendAnother": "Envoyer un autre message",

    // Footer
    "footer.copyright": "Diogo Fragoso",
    "footer.presentDay": "Cet la vie",

    // Terminal
    "terminal.title": "CONNEXION TERMINAL",
    "terminal.connection": "CONNEXION RÉSEAU ÉTABLIE",
    "terminal.helpPrompt": 'Tapez "help" pour les commandes disponibles.',
    "terminal.processing": "Traitement...",
    "terminal.placeholder": "Tapez une commande...",
    "terminal.help": `Commandes disponibles :
- help : Afficher ce message d'aide
- about : En savoir plus sur moi
- contact : Obtenir mes informations de contact
- projects : Voir mes projets
- clear : Effacer le terminal
- exit : Fermer cette connexion`,
    "terminal.about": "Veuillez lire la section À propos de moi, voici mes autres liens",
    "terminal.contact": `Email : fragosodiogo245@gmail.com
GitHub : github.com/Ecztassy`,
    "terminal.projects": `Naviguez vers la section Projets pour voir mon travail.
Utilisez les filtres de sélection pour trier par catégorie.`,
    "terminal.cleared": "Terminal effacé.",
    "terminal.exit": "Fermeture de la connexion...",
    "terminal.notRecognized": `Commande non reconnue : "{command}". Tapez "help" pour les commandes disponibles.`,
  },
};

// Provider component
export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language;
    if (savedLanguage && ["en", "es", "jp", "pt", "fr"].includes(savedLanguage)) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>;
};

// Custom hook to use the language context
export const useLanguage = () => useContext(LanguageContext);
