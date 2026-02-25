# CLAUDE.md - SimplifyQL

## Project Overview

SimplifyQL is a web application for visually designing ER (Entity-Relationship) diagrams and generating PostgreSQL DDL (CREATE TABLE) SQL from them. Users draw tables, attributes, and relationships on an interactive canvas, then export the result as a `.sql` file.

The project is a monorepo with two main parts:
- **`backend/`** — Django 4.1 REST API using Django Ninja
- **`frontend/`** — React 18 SPA using React Flow for the diagram canvas

## Repository Structure

```
simplifyql/
├── backend/
│   ├── manage.py                      # Django management entry point
│   ├── requirements.txt               # Python deps (django-ninja, environs, cors, psycopg2)
│   ├── build.sh                       # Vercel build script (pip install, migrate)
│   ├── .env.example                   # Environment variable template
│   ├── mock_data.json                 # Sample node data for testing
│   ├── vercel.json                    # Vercel deployment config (Python 3.9)
│   ├── simplifyql/                    # Django project package
│   │   ├── settings.py                # Django settings (PostgreSQL, CORS, etc.)
│   │   ├── config.py                  # Env var loading via environs
│   │   ├── api.py                     # Root NinjaAPI instance, router registration
│   │   ├── urls.py                    # URL routing (/admin, /api)
│   │   ├── wsgi.py / asgi.py          # WSGI/ASGI entry points
│   │   └── __init__.py
│   ├── apps/
│   │   ├── core/                      # Abstract base model (CoreModel)
│   │   │   └── models.py              # created_at, updated_at, is_active, data (JSONField)
│   │   ├── users/                     # Custom user model & auth
│   │   │   ├── models.py              # CustomUser (UUID PK, email-based auth, auth_token)
│   │   │   ├── managers.py            # CustomUserManager
│   │   │   ├── authentication.py      # AuthBearer (HttpBearer token auth)
│   │   │   ├── api.py                 # /register, /login endpoints
│   │   │   └── schema.py              # RegisterSchema, UserSchema, ErrorSchema
│   │   └── sql/                       # ER diagram & SQL generation logic
│   │       ├── models.py              # ErDiagram model (name, user FK, inherits CoreModel)
│   │       ├── api.py                 # /create-tables, /get-er-diagrams, /restore, /update
│   │       ├── schema.py              # NodeSchema, EdgeSchema, SqlSchema, TableSchema, etc.
│   │       ├── enums.py               # NodeType, AttributeType, RelationshipType enums
│   │       └── utils/
│   │           ├── initialization.py  # Node parsing, table/attribute assembly, validation
│   │           ├── relationships.py   # Edge→relationship mapping, SQL ALTER/CREATE for FKs
│   │           ├── generate_sql.py    # CREATE TABLE DDL generation with constraints/indexes
│   │           ├── check_constraints.py # Primary key & table name validation
│   │           └── get_er_diagrams.py # Helper to list user's diagrams
│   └── staticfiles_build/            # Vercel static build output
│
├── frontend/
│   ├── package.json                   # React scripts, Mantine, React Flow, Yjs deps
│   ├── tsconfig.json                  # TypeScript config (baseUrl: src, strict: false)
│   ├── .prettierrc.json               # Prettier with import sorting
│   ├── .env.example                   # Environment variable template
│   ├── public/                        # Static public assets
│   └── src/
│       ├── index.tsx                   # Entry point (React Router, Mantine/Notification providers)
│       ├── App.jsx                    # Root component (auth gate, route switching)
│       ├── index.css                  # Global styles
│       ├── constants.js               # Layout dimension constants (TABLE_WIDTH, etc.)
│       ├── ydoc.js                    # Yjs document + WebRTC provider for collaboration
│       ├── Flow/
│       │   ├── index.js               # Main canvas: ReactFlow setup, SQL export, save
│       │   ├── Flow.css               # Flow-specific styles
│       │   └── markers.js             # SVG markers for relationship edges
│       ├── nodes/
│       │   ├── index.jsx              # Re-exports all node types
│       │   ├── TableNode.jsx          # Table node (collapsible, lockable, editable name)
│       │   ├── AttributeNode.jsx      # Attribute node (editable name)
│       │   ├── AttributeTypeNode.jsx  # Attribute type display node
│       │   └── AttributeConstraintNode.jsx  # Constraint checkbox node
│       ├── edges/
│       │   ├── SimpleFloatingEdge.js  # Custom edge rendering
│       │   ├── CustomConnectionLine.js # Connection line while dragging
│       │   └── utils.js               # Edge geometry helpers
│       ├── components/
│       │   ├── index.js               # Re-exports (Header)
│       │   ├── Header/Header.jsx      # App header with nav links and user menu
│       │   ├── ContextMenuReact.jsx   # Right-click context menu (add table/attribute)
│       │   └── RelationshipMenu.jsx   # Edge relationship type selector
│       ├── pages/
│       │   ├── LoginPage.jsx          # Login form
│       │   ├── RegisterPage.jsx       # Registration form
│       │   ├── ErDiagrams.jsx         # List/restore saved diagrams
│       │   ├── DiagramNotFound.jsx    # Empty state component
│       │   └── NotFoundPage.jsx       # 404 page
│       ├── store/
│       │   └── store.js               # Zustand store (nodes, edges, auto-save state)
│       ├── utils/
│       │   ├── request.jsx            # Axios instance (baseURL from env, auth header)
│       │   └── calculateNodePosition.jsx  # Node position calculation helpers
│       └── static/                    # Images (logo, GitHub logo SVG)
│
├── .gitignore
├── LICENSE
└── README.md
```

## Tech Stack

### Backend
- **Framework**: Django 4.1 with Django Ninja (Pydantic-based API framework)
- **Database**: PostgreSQL (via psycopg2)
- **Auth**: Custom token-based auth (UUID tokens stored on user model, passed via `Authorization` header)
- **Config**: `environs` library for environment variable loading
- **Dependencies** (from `requirements.txt`): `django-ninja==0.19.1`, `environs==9.5.0`, `django-cors-headers==3.13.0`, `psycopg2-binary==2.9.5`
- **Deployment**: Vercel (Python 3.9 serverless, `build.sh` runs pip install + migrations)

### Frontend
- **Framework**: React 18 (Create React App / react-scripts 5.0.1)
- **Language**: JavaScript (.js/.jsx) with TypeScript config present but `strict: false`
- **UI Library**: Mantine v5.7 (components, forms, notifications, hooks, modals)
- **Canvas/Diagram**: React Flow v11 (node-based graph editor)
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Collaboration**: Yjs + y-webrtc (real-time P2P sync)
- **Icons**: @tabler/icons
- **Formatting**: Prettier with `@trivago/prettier-plugin-sort-imports`

## Development Setup

### Environment Variables

Copy `.env.example` to `.env` in each directory and fill in values.

The backend requires a `.env` file in `backend/` (see `backend/.env.example`):
```
DEBUG=True
SECRET_KEY=<django-secret-key>
POSTGRES_SERVER=localhost
POSTGRES_USER=postgres
POSTGRES_PASSWORD=<password>
POSTGRES_DB=simplifyql
POSTGRES_PORT=5432
```

The frontend requires a `.env` file in `frontend/` (see `frontend/.env.example`):
```
REACT_APP_API_URL=http://localhost:8000/api
```

### Backend Commands

Run from the `backend/` directory:
```bash
# Install dependencies (ensure you have a virtualenv active)
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Start development server
python manage.py runserver

# Create superuser
python manage.py createsuperuser
```

### Frontend Commands

Run from the `frontend/` directory:
```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Format code
npm run format
```

## API Endpoints

All API endpoints are under `/api/`:

### Users (`/api/users/`)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/register` | Register new user (email + password) |
| POST | `/login` | Login, returns auth_token |

### SQL (`/api/sql/`)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/create-tables` | Generate SQL from nodes/edges, save diagram |
| GET | `/get-er-diagrams` | List user's saved diagrams |
| GET | `/restore-er-diagram/{id}` | Get diagram data by ID |
| POST | `/update-er-diagram/{id}` | Update saved diagram data |

All `/sql/` endpoints require an `Authorization` header with the user's `auth_token`.

## Architecture & Data Flow

1. **Canvas interaction**: Users create tables and attributes as React Flow nodes on the canvas. Relationships are edges between table nodes.
2. **Node types** (defined in `backend/apps/sql/enums.py`):
   - `TableNode` — A database table
   - `AttributeNode` — A column within a table (child of TableNode)
   - `AttributeConstraintNode` — Constraint flags (PK, unique, nullable, index)
   - `AttributeTypeNode` — Data type selector
3. **Relationship types**: `one-one`, `one-many`, `many-many`
4. **SQL generation flow** (`backend/apps/sql/utils/`):
   - `initialization.py`: Parse frontend nodes into `TableSchema`/`AttributeSchema` objects, validate primary keys and table names
   - `relationships.py`: Map edges to relationship data on tables
   - `generate_sql.py`: Build `CREATE TABLE` statements with columns, constraints, and indexes, then `ALTER TABLE` for FK relationships and junction tables for many-to-many
5. **State sync**: Zustand store manages local state; Yjs + WebRTC provides real-time collaboration between browsers

## Key Conventions

### Backend
- **App structure**: Each Django app is in `backend/apps/` and registered by short name in `INSTALLED_APPS` (e.g., `"sql"`, `"users"`, `"core"`)
- **App path**: `sys.path` includes `backend/apps/`, so imports use short names: `from sql.models import ErDiagram`
- **API framework**: Django Ninja — define routes with `@router.post(...)` / `@router.get(...)`, use Pydantic `Schema` classes for request/response validation
- **Base model**: All models inherit from `CoreModel` which provides `created_at`, `updated_at`, `is_active`, and a `data` JSONField
- **Auth pattern**: `AuthBearer` (Django Ninja's `HttpBearer`) applied at the router level via `Router(auth=AuthBearer())`; authenticated user available as `request.auth`
- **Error handling**: Raise `HttpError(status, message)` for business logic errors; Pydantic `ValidationError` is caught globally and returns 422
- **User model**: Custom user with UUID primary key, email as username (no `username` field), auth token generated on creation

### Frontend
- **Import paths**: `tsconfig.json` sets `baseUrl: "src"`, so imports are absolute from `src/` (e.g., `import useStore from "store/store"`)
- **Component patterns**: Functional components with hooks; Zustand selectors with `shallow` comparison
- **File naming**: PascalCase for React components (`.jsx`), camelCase for utilities (`.js`)
- **Styling**: Mantine's `sx` prop and `createStyles` for component styling; CSS modules for `TableNode`
- **Auth storage**: Token and email stored in `localStorage` under keys `"token"` and `"email"`
- **Routing**: React Router v6 (`createBrowserRouter` in `index.tsx`) handles top-level routes (`/`, `/login`, `/register`, `/canvas`, `/er-diagrams`); `App.jsx` uses `window.location.pathname` to conditionally render `<Flow>` or `<ErDiagrams>`
- **Formatting**: Run `npm run format` to apply Prettier with import sorting (react first, then third-party, then local)

### General
- Commit messages are short and descriptive (e.g., "Fix table name check error message", "Add node check & loading overlay while generating sql")
- `.sql` files are gitignored (generated output)
- No CI/CD pipeline is configured in the repository
- No dedicated test files with actual test cases exist yet (only default Django/React test stubs)

## Database Schema

### CustomUser
- `id`: UUID (primary key)
- `email`: unique email (used as username)
- `auth_token`: CharField (UUID token for API auth)
- Standard Django AbstractUser fields (password, is_staff, etc.)

### ErDiagram (inherits CoreModel)
- `name`: CharField (max 255)
- `user`: ForeignKey to CustomUser
- `data`: JSONField (stores full React Flow state: nodes + edges)
- `created_at`, `updated_at`, `is_active` (from CoreModel)
- Unique together: (`name`, `user`)

## Supported SQL Features

- Column types: `text`, `integer`, `varchar`, `boolean`, `date`, `time`, `timestamp`, `UUID`
- Constraints: `PRIMARY KEY`, `UNIQUE`, `NOT NULL`, `NULL`
- Indexes: `CREATE INDEX` statements
- Relationships: One-to-one (ALTER TABLE + UNIQUE FK), One-to-many (ALTER TABLE + FK), Many-to-many (junction table with composite PK)
