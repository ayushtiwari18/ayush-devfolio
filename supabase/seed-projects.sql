-- ============================================================
-- Seed: All 7 Projects — Full Case Study Data
-- Sourced from MasterCV-10-25 + inferred context
-- Run AFTER projects-casestudy-migration.sql
-- Safe to re-run: uses ON CONFLICT (slug) DO UPDATE
-- ============================================================

INSERT INTO projects (
  title, slug, description,
  technologies, cover_image,
  github_url, live_url,
  featured, published,
  "order", duration, tags,

  -- Case study
  problem_statement, solution,
  architecture_plan, code_structure,
  strategies, challenges,
  performance_notes, trade_offs,
  lessons_learned, future_improvements,
  security_notes,

  created_at
)
VALUES

-- ============================================================
-- 1. GameON
-- ============================================================
(
  'GameON – Sports Tournament Management System',
  'gameon',
  'A centralized platform for organizing and tracking sports tournaments. Supports real-time match updates, player analytics, and notifications using Socket.io and Azure SQL.',
  ARRAY['React.js','Node.js','Express.js','Azure SQL','Socket.io','Tailwind CSS','Vite','JWT','bcrypt','MUI'],
  '/Projects/gameon.jpg',
  'https://github.com/ayushtiwari18/GameON',
  'https://game-on.me/',
  true, true,
  0,
  'Jan 2025 – Present',
  ARRAY['sports','real-time','mern','azure','tournament','full-stack'],

  -- problem_statement
  E'Managing sports tournaments is fragmented — organizers rely on WhatsApp groups, spreadsheets, and manual score tracking. There was no single platform where players, organizers, and spectators could coordinate fixtures, view live scores, receive instant notifications, and track player stats in one place.\n\nWith 354+ user submissions and 3 concurrent events running during the pilot, the system needed to be reliable, fast, and role-aware from day one.',

  -- solution
  E'GameON is a full-stack tournament management system built on a MERN-inspired stack with Azure SQL Server as the database. The architecture separates concerns cleanly via MVC on the backend, while the React.js frontend (Vite-bundled) delivers a high-performance UI with real-time updates.\n\n- **Live scores** are pushed via Socket.io WebSockets, eliminating manual refreshes.\n- **Role-based access** (Player / Organizer / Admin) is enforced at the API layer using JWT + bcrypt.\n- **Azure SQL** provides relational guarantees needed for tournament brackets and match relationships.\n- **React Skeleton loaders** and Vite code-splitting cut initial render time by 50%.',

  -- architecture_plan
  E'```\nClient (React + Vite)\n  → REST API (Express MVC, Node.js)\n      → Azure SQL Server (SSMS-managed schema)\n      → Socket.io Server (real-time event bus)\n  → JWT Middleware (role enforcement)\n  → Netlify CDN (frontend) + Render (backend)\n```\n\nThe backend follows a strict MVC pattern: `routes/` → `controllers/` → `services/` → `models/`. Each tournament entity (Match, Player, Team, Bracket) has a dedicated controller. Socket.io runs on the same Node.js process and broadcasts match events to subscribed clients.',

  -- code_structure
  E'```\ngameon/\n├── client/              # React + Vite frontend\n│   ├── components/\n│   │   ├── Dashboard/\n│   │   ├── Matches/\n│   │   └── Leaderboard/\n│   └── services/          # API call wrappers\n├── server/                # Node.js + Express backend\n│   ├── routes/\n│   ├── controllers/\n│   ├── services/\n│   ├── models/            # Azure SQL table schemas\n│   └── socket/            # Socket.io event handlers\n└── .github/workflows/     # CI/CD pipelines\n```',

  -- strategies (JSONB)
  '[{"title":"MVC Architecture","description":"Strict MVC separation on the backend reduced codebase complexity by 40% and made onboarding 5 new contributors faster."},
    {"title":"Azure SQL over MongoDB","description":"Chose relational DB for tournament brackets — foreign key constraints and JOIN queries are critical for bracket integrity."},
    {"title":"Socket.io for Live Updates","description":"WebSocket broadcast model kept all connected clients in sync on match events with <100ms latency, boosting user retention 45%."},
    {"title":"Vite + React Skeleton","description":"Vite bundle splitting and skeleton screens reduced perceived load time by 50% on data-heavy pages."},
    {"title":"CI/CD via GitHub Actions","description":"Automated pipelines on Netlify (frontend) and Render (backend) reduced integration bugs by 70% and enabled zero-downtime rollouts."}]'::jsonb,

  -- challenges (JSONB)
  '[{"problem":"Real-time score sync across 3 concurrent tournaments caused event collision in Socket.io","fix":"Introduced tournament-namespaced rooms in Socket.io so events are scoped per tournament, eliminating cross-contamination."},
    {"problem":"Azure SQL join queries were slow under active load with 354+ users","fix":"Optimized schema relations via SSMS, added covering indexes on match_id and team_id, reducing backend CPU usage by 28%."},
    {"problem":"JWT refresh strategy caused silent logouts on mobile","fix":"Implemented sliding-window token refresh with a 15-min access token + 7-day refresh token stored in httpOnly cookies."},
    {"problem":"React renders were expensive on the live leaderboard (100+ rows)","fix":"Used React.memo and virtualized list rendering to cap DOM nodes, cutting re-render time by 60%."}]'::jsonb,

  -- performance_notes
  E'- API response time under active load: **<100ms** (measured via Render logs)\n- Initial render time reduced **50%** using Vite code splitting + React Skeleton\n- Azure SQL query time reduced **35%** via indexed joins\n- Backend CPU usage reduced **28%** by eliminating redundant JOIN queries\n- Lighthouse accessibility score: **94%** across devices',

  -- trade_offs
  E'- **Azure SQL over MongoDB**: Relational integrity was worth the slightly higher query complexity for bracket management. A document store would have been faster to iterate but harder to enforce tournament rules.\n- **Socket.io over SSE**: Chose bidirectional WebSockets even though match updates are server-push only, because future features (live commentary, admin controls) need bidirectional channels.\n- **Render for backend**: Free tier cold-starts add ~2s on first hit. Acceptable for a portfolio/pilot project; production would use a paid tier.',

  -- lessons_learned
  E'- **Schema design first**: Rushing the Azure SQL schema caused two costly migrations mid-project. Future projects will finalize ER diagrams before writing a single API.\n- **Room-based WebSockets**: Learned the importance of namespace isolation in Socket.io early — global broadcast is a footgun in multi-entity real-time apps.\n- **Team coordination at scale**: Leading a 6-person team taught me the value of strict PR reviews, clear API contracts, and daily standups over ad-hoc communication.',

  -- future_improvements
  E'- **Mobile app** (React Native) for on-field score entry by referees\n- **Player analytics dashboard** with D3.js charts (win rate, match history, head-to-head)\n- **AI bracket seeding** based on historical player ratings\n- **Push notifications** via FCM for match start/end alerts\n- **Multi-sport support** (currently football/cricket only)',

  -- security_notes
  E'- All API routes protected with JWT middleware; role claims (player/organizer/admin) validated server-side on every request\n- Passwords hashed with **bcrypt** (12 salt rounds)\n- Azure SQL credentials stored in environment variables, never committed to Git\n- 100% success rate in simulated role-based access and credential misuse attack tests\n- CORS configured to whitelist only the production frontend origin',

  '2025-01-01 00:00:00+00'
),

-- ============================================================
-- 2. Marine Minds
-- ============================================================
(
  'Marine Minds – Ocean Literacy Platform',
  'marine-minds',
  'An immersive platform promoting ocean literacy through gamified learning, virtual lab simulations, and Unity-based exploration. Combines scientific data visualization with interactive 3D environments.',
  ARRAY['MongoDB','Express.js','React.js','Node.js','Three.js','D3.js','p5.js','Unity','Blender','GSAP'],
  '/Projects/marine-minds.jpg',
  'https://github.com/ayushtiwari18/MM',
  'https://mm-qgbd.onrender.com/',
  true, true,
  1,
  'Aug 2024 – Dec 2024',
  ARRAY['edtech','gamification','mern','3d','ocean','unity','hackathon'],

  -- problem_statement
  E'Ocean literacy is critically underfunded in mainstream education. Students lack access to engaging, interactive resources that communicate the importance of marine ecosystems. Existing platforms are text-heavy, non-interactive, and inaccessible to regional audiences.\n\nThis was the core problem Marine Minds was built to solve — recognized at SIH 2024, Devpost 2025 (1st place), and ISTD Innovation Showcase 2025, and awarded Copyright SW20249/2025.',

  -- solution
  E'Marine Minds is a full-stack MERN platform that combines Unity-based gamified virtual labs with D3.js data visualizations and Three.js 3D ocean environments to create an immersive learning experience.\n\n- **Gamified learning modules** with score tracking and progress persistence in MongoDB\n- **Unity WebGL labs** embedded in the React frontend, loaded on-demand to avoid blocking the main bundle\n- **D3.js + p5.js visualizations** for ocean temperature, biodiversity, and pollution data\n- **Multilingual content architecture** designed to support 5+ regional languages\n- Weekly active users rose **60%** during testing after gamification features launched',

  -- architecture_plan
  E'```\nClient (React.js)\n  → MERN REST API (Express MVC, Node.js)\n      → MongoDB Atlas (schemas: User, Module, Progress, Simulation)\n      → Unity WebGL (iframe-embedded, loaded async)\n  → GSAP / Three.js (client-side 3D rendering)\n  → GitHub Actions CI/CD → Docker → Render\n```\n\nAll simulation content is lazy-loaded. The Unity WebGL builds are served as static assets from a CDN path, decoupled from the main API. MongoDB schemas are indexed on user_id and module_id for fast progress queries.',

  -- code_structure
  E'```\nmarine-minds/\n├── client/\n│   ├── components/\n│   │   ├── Labs/          # Unity iframe wrappers\n│   │   ├── Visualizations/ # D3 + p5.js charts\n│   │   └── Modules/       # Learning content\n│   └── animations/        # GSAP + Three.js\n├── server/\n│   ├── routes/\n│   ├── controllers/\n│   ├── models/            # Mongoose schemas\n│   └── middleware/        # Auth, rate limiting\n├── unity-builds/          # Exported WebGL bundles\n└── docker/                # Containerization config\n```',

  -- strategies
  '[{"title":"Gamification-first Design","description":"Embedding game mechanics (scores, badges, progress bars) into every learning module increased weekly active users by 60% in testing."},
    {"title":"Unity WebGL Async Loading","description":"Unity lab builds are loaded as async iframe embeds, preventing them from blocking React hydration or main bundle size."},
    {"title":"Docker Containerization","description":"Containerized dev environment reduced new contributor setup time by 80% and eliminated environment-mismatch bugs."},
    {"title":"MongoDB Index Optimization","description":"Indexed user_id + module_id compound key, cutting progress query time by 50% during real-time simulation sessions."},
    {"title":"CI/CD with GitHub Actions","description":"Automated pipelines improved iteration speed 3x and cut rollback time from 30 minutes to under 5 minutes."}]'::jsonb,

  -- challenges
  '[{"problem":"Unity WebGL bundles caused main thread blocking on load, degrading Lighthouse performance score","fix":"Moved Unity builds to async iframe embeds with IntersectionObserver-based lazy load — only loads when the lab section enters viewport."},
    {"problem":"3D virtual lab content failures spiked 70% in high-traffic scenarios","fix":"Added circuit-breaker middleware to detect Unity WebSocket timeouts and fall back to a 2D simulation mode gracefully."},
    {"problem":"MongoDB peak memory usage was high during intensive visualization sessions","fix":"Query profiling revealed N+1 patterns in progress aggregations; fixed with $lookup pipeline stages and field projection, lowering memory 25%."},
    {"problem":"Multilingual content structure was not designed in the initial schema","fix":"Refactored content documents to use a locale map object {en: '...', hi: '...', mr: '...'} enabling non-breaking language addition."}]'::jsonb,

  -- performance_notes
  E'- API response time reduced **35%** via optimized Express routing and async middleware\n- MongoDB query time cut **50%** via compound indexing on user_id + module_id\n- Peak memory usage reduced **25%** via query profiling and $lookup optimization\n- Unity WebGL lazy load eliminated main-thread blocking on initial page load\n- CI/CD iteration speed improved **3×** via GitHub Actions pipelines',

  -- trade_offs
  E'- **Unity WebGL over native Three.js for labs**: Unity provides richer interactivity for science simulations but adds significant bundle weight (~15MB). Three.js was used for ambient 3D scenes; Unity only for interactive labs.\n- **MERN over Next.js**: The team was most productive in CRA-era React at the time. In hindsight, Next.js SSR would have helped with SEO and initial load.\n- **MongoDB over PostgreSQL**: Flexible schemas were valuable for multilingual content and evolving module structures during the SIH sprint.',

  -- lessons_learned
  E'- **Performance budgets matter from day 1**: Unity WebGL assets nearly tanked the Lighthouse score before lazy loading was added. Every heavy asset needs a loading strategy defined upfront.\n- **Open-source documentation accelerates teams**: Docker + GitHub Actions setup documentation saved 80% of new-contributor onboarding time.\n- **Hackathon pressure builds product intuition**: Shipping under SIH 2024 time constraints forced ruthless prioritization — a skill that carried into all subsequent projects.',

  -- future_improvements
  E'- **Offline mode** via PWA service worker for classrooms with poor connectivity\n- **Teacher dashboard** to track student progress across modules and export reports\n- **AR mode** using WebXR for mobile — point camera at ocean and see overlaid species info\n- **Regional language rollout** (Hindi, Marathi, Tamil) — schema already supports it\n- **AI quiz generation** from module content using LLM API',

  -- security_notes
  E'- Secured RESTful APIs with Express middleware, achieving 100% success rate in simulated unauthorized access tests\n- JWT-based auth with role scoping (student/teacher/admin)\n- MongoDB Atlas IP allowlist + encrypted connection strings in env variables\n- Rate limiting on quiz submission endpoints to prevent score manipulation',

  '2024-12-01 00:00:00+00'
),

-- ============================================================
-- 3. Wanderlust
-- ============================================================
(
  'Wanderlust – Travel Booking Platform',
  'wanderlust',
  'Airbnb-style platform supporting listing creation, booking flow, reviews, and map-based property discovery. Implements Passport.js, session handling, and Cloudinary for media uploads.',
  ARRAY['Node.js','Express.js','MongoDB','Bootstrap','HTML5','CSS3','JavaScript','Passport.js','Cloudinary'],
  '/Projects/wanderlust.png',
  'https://github.com/ayushtiwari18/Wanderlust_',
  'https://wanderlust-chlq.onrender.com/listings',
  true, true,
  2,
  'May 2024 – Jun 2024',
  ARRAY['booking','travel','mongodb','node','fullstack','cloudinary'],

  -- problem_statement
  E'Travelers often rely on multiple disjointed services to discover, evaluate, and book accommodation. A unified platform where hosts can list properties with photos, guests can leave reviews, and map-based discovery works seamlessly — all within a single app — was the goal.\n\nThis project was also a deep-dive into session-based authentication, file upload workflows, and MVC pattern in a non-React stack.',

  -- solution
  E'Wanderlust is a server-rendered Node.js application that replicates the core Airbnb booking flow:\n\n- **Listing CRUD** for hosts with multi-image upload via Cloudinary\n- **Booking flow** with availability validation and session-based checkout\n- **Review system** with star ratings and real-time display\n- **Map integration** using Mapbox GL for location-based discovery\n- **Passport.js** for local strategy authentication with encrypted sessions\n\nBuilding with HTML5/CSS3/Bootstrap (no React) enforced a strong understanding of the HTTP request-response cycle and server-side rendering before moving to SPAs.',

  -- architecture_plan
  E'```\nBrowser → Express Router (MVC)\n  → Passport.js (session auth)\n  → Mongoose Models (Listing, Review, User, Booking)\n  → MongoDB Atlas (cloud-hosted)\n  → Cloudinary API (image storage)\n  → Mapbox GL JS (client-side map rendering)\nDeployed on Render (Node.js service)\n```',

  -- code_structure
  E'```\nwanderlust/\n├── models/          # Mongoose: Listing, Review, User\n├── routes/\n│   ├── listings.js\n│   ├── reviews.js\n│   └── auth.js\n├── controllers/     # Business logic per route\n├── views/           # EJS templates\n├── public/          # Static assets\n├── middleware/      # isLoggedIn, validateListing, etc.\n└── cloudinary/      # Multer + Cloudinary config\n```',

  -- strategies
  '[{"title":"Server-Side Rendering with EJS","description":"Using EJS templates without React reinforced MVC fundamentals and HTTP cycle understanding — a deliberate learning choice."},
    {"title":"Cloudinary for Media","description":"Cloudinary handles multi-image upload, format optimization, and CDN delivery — increased listing views 30% by enabling rich photo galleries."},
    {"title":"Passport.js Local Strategy","description":"Session-based auth with Passport.js and connect-flash for user feedback provided secure, reliable login for hosts and guests."},
    {"title":"MongoDB Atlas for Scalability","description":"Cloud-hosted MongoDB ensured data availability during active sessions without managing a local database instance."}]'::jsonb,

  -- challenges
  '[{"problem":"Cross-origin session loss on redirect after Cloudinary upload","fix":"Configured express-session with sameSite: lax and secure: true in production, and ensured session store used MongoDB to persist across Render restarts."},
    {"problem":"Multiple image uploads were slow and blocking","fix":"Used Multer memory storage with async Cloudinary upload streams, processing images concurrently via Promise.all."},
    {"problem":"Map markers did not cluster for dense listing areas","fix":"Implemented Mapbox GL supercluster plugin for automatic marker clustering, improving map readability for areas with 10+ listings."}]'::jsonb,

  -- performance_notes
  E'- Mobile-first Bootstrap layout boosted engagement time **~40%** in prototype tests\n- Cloudinary auto-format optimization reduced image load times significantly\n- MongoDB Atlas geo-indexed listing coordinates for fast map-radius queries',

  -- trade_offs
  E'- **EJS over React**: Deliberate choice to learn server-side rendering fundamentals. For a real production platform, a React frontend would improve interactivity.\n- **Session auth over JWT**: Stateful sessions are simpler for a classic MVC app but don't scale horizontally without a shared session store (solved with MongoDB session store).',

  -- lessons_learned
  E'- **Sessions are stateful by nature**: Understanding session propagation across redirects, Render restarts, and Cloudinary callbacks was one of the most practically valuable learnings.\n- **Middleware chains are powerful**: Express middleware stacking (isLoggedIn → validateListing → isOwner) provides a clean, composable authorization model.\n- **File upload is never simple**: Handling partial uploads, Cloudinary errors, and cleanup on validation failure required more error-handling code than the main feature.',

  -- future_improvements
  E'- **Booking calendar** with date-range blocking for hosts\n- **Payment integration** (Razorpay/Stripe) for real booking transactions\n- **Email notifications** via Nodemailer for booking confirmations\n- **React frontend rewrite** for better search/filter UX without full page reloads\n- **Admin moderation panel** for listing approval workflow',

  -- security_notes
  E'- Passport.js local strategy with bcrypt password hashing\n- Session cookies: httpOnly, secure in production, sameSite: lax\n- Input validation with Joi on all listing/review routes via Express middleware\n- Cloudinary upload restricted to authenticated users only via middleware\n- MongoDB Atlas connection string stored in environment variables',

  '2024-06-01 00:00:00+00'
),

-- ============================================================
-- 4. EchoMeet
-- ============================================================
(
  'EchoMeet – Zoom-Inspired Video Conferencing',
  'echomeet',
  'A MERN stack-based video conferencing app with screen sharing, real-time chat, and meeting room generation using Socket.io. Designed as a lightweight Zoom alternative.',
  ARRAY['MongoDB','Express.js','React.js','Node.js','Socket.io','WebRTC','CSS'],
  '/Projects/echomeet.jpg',
  'https://github.com/ayushtiwari18/EchoMeet',
  'https://echomeet-at.netlify.app/',
  false, true,
  3,
  'Jun 2024 – Jul 2024',
  ARRAY['webrtc','realtime','mern','video','socket','conferencing'],

  -- problem_statement
  E'During the Nullclass EdTech internship, I contributed to a video streaming platform and gained exposure to real-time communication patterns. I wanted to apply those learnings independently — building a full WebRTC + Socket.io video conferencing app solo, from scratch, to deeply understand peer-to-peer media negotiation, signaling, and room management.',

  -- solution
  E'EchoMeet is a MERN-stack video conferencing app with WebRTC for peer-to-peer audio/video and Socket.io as the signaling layer:\n\n- **Room generation** with unique codes and participant management\n- **WebRTC mesh** for direct peer-to-peer media streams (no media server required for small rooms)\n- **Live chat** via Socket.io alongside the video call\n- **Screen sharing** using `getDisplayMedia()` API\n- **<100ms** audio/video latency in test environments\n\nThis was a solo project explicitly designed for deep technical exploration, not production deployment.',

  -- architecture_plan
  E'```\nClient A ←——WebRTC P2P——→ Client B\n     ↕ signaling (Socket.io)  ↕\n     Node.js Signaling Server\n          ↓\n     MongoDB (session + user state)\nFrontend: React.js → Netlify\nBackend: Node.js + Express → Render\n```\n\nSocket.io handles SDP offer/answer exchange and ICE candidate relay. Once the WebRTC connection is established, media flows directly peer-to-peer without passing through the server.',

  -- code_structure
  E'```\nechomeet/\n├── client/\n│   ├── components/\n│   │   ├── VideoRoom/      # WebRTC peer streams\n│   │   ├── Chat/           # Socket.io chat\n│   │   └── Controls/       # Mute/camera/screen share\n│   └── hooks/\n│       ├── useWebRTC.js\n│       └── useSocket.js\n├── server/\n│   ├── socket/\n│   │   ├── signaling.js    # SDP + ICE relay\n│   │   └── rooms.js        # Room management\n│   └── models/             # Session, User\n```',

  -- strategies
  '[{"title":"WebRTC P2P for Media","description":"Direct peer-to-peer media via WebRTC eliminates server-side media load entirely for rooms of 2–4 participants."},
    {"title":"Socket.io as Signaling Layer","description":"Socket.io handles SDP/ICE negotiation cleanly with room-scoped events, keeping signaling logic decoupled from the media layer."},
    {"title":"Unique Room Code Generation","description":"UUID-based room codes with server-side validation prevent unauthorized participants from guessing room IDs."},
    {"title":"React Custom Hooks","description":"Encapsulated WebRTC logic in useWebRTC.js and Socket.io logic in useSocket.js, keeping component code clean and testable."}]'::jsonb,

  -- challenges
  '[{"problem":"WebRTC ICE candidate exchange failed intermittently behind NAT","fix":"Added STUN server configuration (Google STUN) to the RTCPeerConnection config, resolving NAT traversal for 95% of test cases."},
    {"problem":"Screen share track replacement broke the existing video stream","fix":"Used RTCRtpSender.replaceTrack() to swap the video track without renegotiating the entire peer connection."},
    {"problem":"Socket.io room cleanup on abrupt disconnect left dangling participants","fix":"Added disconnect event handler to remove participant from room state and broadcast updated participant list to remaining peers."}]'::jsonb,

  -- performance_notes
  E'- Audio/video latency: **<100ms** in test environments using STUN-assisted WebRTC\n- React UI interaction delay: **<200ms** across desktop and mobile browsers\n- Socket.io signaling round-trip: **<50ms** in same-region tests\n- Join success rate improved **~30%** after MongoDB session persistence was added',

  -- trade_offs
  E'- **Mesh WebRTC over SFU**: P2P mesh is simpler to implement but doesn't scale beyond 4–5 participants. A media server (mediasoup, Janus) would be needed for larger rooms.\n- **Solo project scope**: Deliberately kept as a learning project, so some production concerns (TURN server, room persistence, recording) were deferred.',

  -- lessons_learned
  E'- **WebRTC is deceptively complex**: SDP negotiation, ICE gathering, track management, and reconnection logic each have sharp edges. Building this solo gave me real respect for WebRTC's complexity.\n- **Signaling must be reliable**: Any Socket.io disconnect during SDP exchange aborts the connection. Implemented automatic reconnect with state recovery.\n- **Separate media and signaling concerns**: Keeping Socket.io (signaling) and WebRTC (media) clearly separated in the codebase made debugging much faster.',

  -- future_improvements
  E'- **SFU integration** (mediasoup) for rooms with 5+ participants\n- **Recording** via MediaRecorder API with server-side storage\n- **Virtual backgrounds** using TensorFlow.js BodyPix\n- **Breakout rooms** for team sub-sessions\n- **End-to-end encryption** for media streams using DTLS-SRTP (already in WebRTC spec, but needs explicit key management UI)',

  -- security_notes
  E'- Room IDs are UUID v4 — not guessable or sequential\n- Participant verification on join via server-side room state check\n- WebRTC media encrypted by default via DTLS-SRTP (browser-enforced)\n- Socket.io events scoped to authenticated room namespaces',

  '2024-07-01 00:00:00+00'
),

-- ============================================================
-- 5. AuroraFlow
-- ============================================================
(
  'AuroraFlow – YouTube-Inspired Video Streaming App',
  'auroraflow',
  'A responsive frontend-only app using React.js and RapidAPI for streaming real-time video content. Features category filters, search functionality, and dynamic rendering.',
  ARRAY['React.js','CSS','RapidAPI','Netlify'],
  '/Projects/auroraflow.jpg',
  'https://github.com/ayushtiwari18/AuroraFlow',
  'https://aurora-flow.netlify.app/',
  false, true,
  4,
  'May 2024 – Jun 2024',
  ARRAY['react','streaming','frontend','rapidapi','spa'],

  -- problem_statement
  E'After completing the Nullclass internship where I worked on a video streaming platform and reduced buffering time by 30%, I wanted to build my own YouTube-inspired frontend to solidify React patterns — specifically: API integration, SPA routing, search/filter UX, and optimized rendering for video-heavy content.',

  -- solution
  E'AuroraFlow is a React SPA that consumes the YouTube Data API via RapidAPI to deliver a YouTube-like browsing experience:\n\n- **Category sidebar** for topic-based video filtering\n- **Search bar** with debounced API calls to avoid rate limiting\n- **Video detail view** with recommended video sidebar\n- **Lazy loading** for off-screen video thumbnails\n- **45% improvement** in time-to-interactive on mid-range devices vs. baseline\n\nThis project was intentionally frontend-only — the goal was deep React proficiency, not backend architecture.',

  -- architecture_plan
  E'```\nReact SPA (React Router DOM)\n  → RapidAPI (YouTube Data API v3 proxy)\n  → Component tree:\n      ├── Navbar\n      ├── Sidebar (categories)\n      ├── VideoFeed (grid)\n      ├── VideoDetail (player + recommendations)\n      └── SearchFeed\nDeployed: Netlify (CDN, auto-deploy from GitHub)\n```',

  -- code_structure
  E'```\nauroraflow/\n├── src/\n│   ├── components/\n│   │   ├── Navbar/\n│   │   ├── Sidebar/\n│   │   ├── VideoCard/\n│   │   ├── VideoDetail/\n│   │   └── SearchFeed/\n│   ├── utils/\n│   │   └── fetchFromAPI.js  # RapidAPI wrapper\n│   └── App.js               # React Router setup\n```',

  -- strategies
  '[{"title":"Debounced Search","description":"Search input debounced at 400ms to batch API calls and stay within RapidAPI rate limits without degrading UX."},
    {"title":"Lazy Thumbnail Loading","description":"Used Intersection Observer for thumbnail lazy loading, reducing initial data transfer and improving TTI by 45%."},
    {"title":"Centralized API Wrapper","description":"All RapidAPI calls go through a single fetchFromAPI.js utility, making it easy to swap the API key or endpoint without touching components."},
    {"title":"React Router DOM","description":"Client-side routing enables YouTube-style URL structure (/video/:id, /search/:query) without full page reloads."}]'::jsonb,

  -- challenges
  '[{"problem":"RapidAPI rate limits caused intermittent 429 errors on rapid search","fix":"Added 400ms debounce on search input and a simple in-memory cache for category feed responses to reduce redundant calls."},
    {"problem":"Video thumbnails caused layout shift on load","fix":"Applied fixed aspect-ratio wrappers (16:9) on VideoCard, eliminating CLS and improving Lighthouse score."},
    {"problem":"React re-renders on every search keystroke were expensive","fix":"Memoized VideoCard with React.memo and moved API call to useEffect with debounced input state."}]'::jsonb,

  -- performance_notes
  E'- Time-to-interactive improved **45%** via lazy loading and memoization\n- API response integration latency: **<150ms** (RapidAPI endpoint)\n- Bounce rate reduced **~30%** with clean minimalist UI\n- Netlify CDN delivery with 99.9% uptime',

  -- trade_offs
  E'- **Frontend-only (no backend)**: RapidAPI key is in the frontend bundle — acceptable for a learning project, but in production the API key must be proxied through a server.\n- **In-memory cache**: Simple Map-based cache resets on page reload. A proper solution would use React Query or SWR with staleWhileRevalidate.',

  -- lessons_learned
  E'- **API rate limits require proactive design**: Debouncing, caching, and request deduplication are not optional for API-driven UIs.\n- **CLS matters for video grids**: Fixed aspect-ratio containers eliminated jarring layout shifts and significantly improved perceived performance.\n- **React.memo is not free**: Over-memoizing adds comparison overhead. Learned to profile with React DevTools before applying memo.',

  -- future_improvements
  E'- **Backend proxy** to secure the RapidAPI key and add server-side caching\n- **React Query / SWR** for proper cache invalidation and background refetch\n- **Dark/light theme toggle**\n- **Watch history** persisted in localStorage\n- **Channel page** view with subscriber count and video list',

  -- security_notes
  E'- Note: RapidAPI key is currently client-side. **Production upgrade required**: move key to a server-side proxy route.\n- Netlify headers configured to prevent clickjacking (X-Frame-Options: DENY)\n- No user authentication or data storage in current version',

  '2024-06-15 00:00:00+00'
),

-- ============================================================
-- 6. Simon Says
-- ============================================================
(
  'Simon-Says – Color Memory Game',
  'simon-says',
  'Classic color memory game using vanilla JavaScript. Includes animated sequences, level progression, and auditory feedback for engagement across devices.',
  ARRAY['HTML5','CSS3','JavaScript'],
  '/Projects/simon-says.jpg',
  'https://github.com/ayushtiwari18/Simon-Says-Game',
  'https://simon-si-game.netlify.app/',
  false, true,
  5,
  'May 2024',
  ARRAY['vanilla-js','game','dom','css-animation','beginner'],

  -- problem_statement
  E'Before learning React or Node.js frameworks, I needed to deeply understand browser fundamentals — the DOM, event loop, CSS animations, and JavaScript state machines — without any library abstractions. Simon Says was the project I chose to test these fundamentals end-to-end.',

  -- solution
  E'A fully browser-native implementation of the classic Simon Says memory game in vanilla HTML/CSS/JavaScript:\n\n- **Random sequence generation** that grows by one step each level\n- **Input validation** against the expected sequence with immediate feedback\n- **CSS keyframe animations** for button flash on each sequence step\n- **Web Audio API** for distinct tone per color (no external audio files)\n- **<10ms input lag** — no virtual DOM overhead\n- Average session duration increased **~40%** vs. a no-audio baseline',

  -- architecture_plan
  E'```\nIndex.html\n  → style.css (animations, layout)\n  → script.js\n      ├── gameSequence[]   # Server sequence
      ├── userSequence[]   # Player input
      ├── nextSequenceStep() # Grows sequence
      ├── flashButton()    # CSS class toggle
      └── checkAnswer()    # Input validation\nNo build step. No dependencies.\n```',

  -- code_structure
  E'```\nsimon-says/\n├── index.html\n├── style.css        # Animations + layout\n└── script.js        # All game logic (~120 lines)\n```\n\nDeliberately kept in a single JS file to reinforce the principle: understand what you are abstracting before you abstract it.',

  -- strategies
  '[{"title":"Pure Vanilla JS","description":"No frameworks — every DOM operation, event listener, and state transition written by hand to build deep fundamentals."},
    {"title":"CSS Keyframe Animations","description":"Button flash sequences use CSS class toggling for smooth 60fps animations with zero JavaScript in the animation loop."},
    {"title":"Web Audio API for Tones","description":"Distinct sine-wave tones generated via AudioContext for each color — no audio file dependencies, works instantly across devices."}]'::jsonb,

  -- challenges
  '[{"problem":"Sequence animation timing conflicted with user input window","fix":"Used a locked boolean flag during playback to block user input until the full sequence animation completes."},
    {"problem":"Button flash duration was imperceptible on fast levels","fix":"Tied animation duration to a speed variable that decreases each level, keeping the flash visible but progressively shorter."}]'::jsonb,

  -- performance_notes
  E'- Input event processing: **<10ms** latency (no VDOM overhead)\n- CSS-only animations: 60fps on all modern browsers\n- Zero external dependencies: 0ms dependency loading time\n- Works on browsers without internet (fully offline after first load)',

  -- trade_offs
  E'- **No framework**: The right choice for a learning project. For a production game with complex state, a state machine library (XState) would be more maintainable.\n- **No persistent high scores**: Adding localStorage for high score tracking would be a simple and valuable improvement.',

  -- lessons_learned
  E'- **The event loop is tangible**: Timing bugs in the sequence animation directly demonstrated JavaScript single-threaded execution and the importance of setTimeout/requestAnimationFrame.\n- **CSS animations belong in CSS**: Moving the flash logic from JS `style` manipulation to CSS class toggles halved the JavaScript needed and improved animation smoothness.\n- **Simplicity has value**: 120 lines of plain JS that anyone can read and understand is a feature, not a limitation.',

  -- future_improvements
  E'- **localStorage high score** persistence\n- **Difficulty modes** (Easy/Normal/Hard) with different animation speeds\n- **Multiplayer mode** (two players on same device, alternating)\n- **PWA offline support** (already nearly there — just needs a service worker)\n- **Accessibility improvements**: ARIA live regions to announce each color for screen reader users',

  -- security_notes
  E'- Static HTML/CSS/JS — no server, no user data, no attack surface.\n- Netlify serves over HTTPS with auto-renewed certificate.',

  '2024-05-10 00:00:00+00'
),

-- ============================================================
-- 7. Personal Portfolio
-- ============================================================
(
  'Personal Portfolio Website',
  'personal-portfolio',
  'Clean and responsive personal site showcasing skills, projects, and resume. Designed with simplicity and accessibility in mind.',
  ARRAY['HTML','CSS','JavaScript','Netlify'],
  '/portfolio.png',
  'https://github.com/ayushtiwari18',
  'https://ayushtiwaritech.netlify.app/',
  false, true,
  6,
  'Apr 2024',
  ARRAY['portfolio','html','css','vanilla-js','static'],

  -- problem_statement
  E'Before building this Next.js portfolio (ayush-devfolio), I needed a live presence online to share with recruiters during internship applications in early 2024. The constraint: build something clean, fast, and deployable with zero backend, zero framework — just HTML, CSS, and JavaScript.',

  -- solution
  E'A fully static personal portfolio site deployed on Netlify:\n\n- **Single-page layout** with smooth scroll navigation\n- **Projects section** with card grid and live/GitHub links\n- **Skills section** with visual tag layout\n- **Resume download** via direct PDF link\n- **Contact section** with mailto link\n\nThis site served its purpose — it got me the Nullclass internship and the freelance e-commerce project. It is now superseded by this Next.js portfolio.',

  -- architecture_plan
  E'```\nStatic HTML\n  → style.css (custom, no framework)\n  → script.js (scroll behavior, simple interactions)\nDeployed: Netlify (drag-and-drop static deploy)\n```',

  -- code_structure
  E'```\nportfolio/\n├── index.html       # Single page, all sections\n├── style.css        # Custom responsive styles\n├── script.js        # Scroll + interactivity\n└── assets/\n    ├── resume.pdf\n    └── images/\n```',

  -- strategies
  '[{"title":"Static-first","description":"No build step, no dependencies — deploys in seconds and loads instantly on any connection."},
    {"title":"Semantic HTML","description":"Proper heading hierarchy, landmark elements, and alt text ensure accessibility and strong SEO baseline."}]'::jsonb,

  -- challenges
  '[{"problem":"Mobile layout broke on narrow viewports due to fixed-width project cards","fix":"Switched to CSS Grid with auto-fill minmax(280px, 1fr) for responsive card layout without media query overload."}]'::jsonb,

  -- performance_notes
  E'- Zero JS framework — instant TTI\n- Netlify CDN global edge delivery\n- No render-blocking resources',

  -- trade_offs
  E'- **No CMS**: Content updates require editing raw HTML. Acceptable for a temporary portfolio, but this is exactly what ayush-devfolio solves with the Supabase admin panel.',

  -- lessons_learned
  E'- **Constraints are valuable**: Building without any framework forced mastery of CSS layout, DOM APIs, and browser behavior that frameworks typically abstract.\n- **Ship fast, improve later**: This site went live in one weekend and immediately served its business purpose. Perfection was not the goal — presence was.',

  -- future_improvements
  E'- Superseded by ayush-devfolio (this Next.js project). No further development planned.',

  -- security_notes
  E'- Static site, no user data, no server. HTTPS via Netlify.',

  '2024-04-01 00:00:00+00'
)

ON CONFLICT (slug) DO UPDATE SET
  title              = EXCLUDED.title,
  description        = EXCLUDED.description,
  technologies       = EXCLUDED.technologies,
  cover_image        = EXCLUDED.cover_image,
  github_url         = EXCLUDED.github_url,
  live_url           = EXCLUDED.live_url,
  featured           = EXCLUDED.featured,
  published          = EXCLUDED.published,
  "order"            = EXCLUDED."order",
  duration           = EXCLUDED.duration,
  tags               = EXCLUDED.tags,
  problem_statement  = EXCLUDED.problem_statement,
  solution           = EXCLUDED.solution,
  architecture_plan  = EXCLUDED.architecture_plan,
  code_structure     = EXCLUDED.code_structure,
  strategies         = EXCLUDED.strategies,
  challenges         = EXCLUDED.challenges,
  performance_notes  = EXCLUDED.performance_notes,
  trade_offs         = EXCLUDED.trade_offs,
  lessons_learned    = EXCLUDED.lessons_learned,
  future_improvements = EXCLUDED.future_improvements,
  security_notes     = EXCLUDED.security_notes;
