# Senior Fullstack Skills Guide

Comprehensive guide for the **Senior Fullstack Development Skills** - a collection of 4 skills for building production-grade applications.

---

## Available Skills

| Skill | Description |
|-------|-------------|
| **senior-fullstack** | Fullstack development with React, Next.js, Node.js, GraphQL, PostgreSQL |
| **backend-dev-guidelines** | Node.js/Express/TypeScript microservices standards |
| **frontend-design** | Distinctive, production-grade UI design |
| **browser-automation** | Playwright/Puppeteer testing & scraping |

---

## 1. Senior Fullstack

**Tech Stack:**
- **Languages:** TypeScript, JavaScript, Python, Go, Swift, Kotlin
- **Frontend:** React, Next.js, React Native, Flutter
- **Backend:** Node.js, Express, GraphQL, REST APIs
- **Database:** PostgreSQL, Prisma, NeonDB, Supabase
- **DevOps:** Docker, Kubernetes, Terraform, GitHub Actions, CircleCI
- **Cloud:** AWS, GCP, Azure

**Core Capabilities:**

| Tool | Purpose |
|------|---------|
| `fullstack_scaffolder.py` | Automated project scaffolding with best practices |
| `project_scaffolder.py` | Deep analysis with performance metrics & recommendations |
| `code_quality_analyzer.py` | Expert-level code quality analysis |

**Usage:**
```bash
python scripts/fullstack_scaffolder.py <project-path> [options]
python scripts/project_scaffolder.py <target-path> [--verbose]
python scripts/code_quality_analyzer.py [arguments] [options]
```

**Common Commands:**
```bash
# Development
npm run dev
npm run build
npm run test
npm run lint

# Deployment
docker build -t app:latest .
docker-compose up -d
kubectl apply -f k8s/
```

**When to Use:**
- Setting up a new fullstack project
- Analyzing existing codebase
- Code quality reviews

---

## 2. Backend Development Guidelines

**Stack:** Node.js · Express · TypeScript · Microservices

### Backend Feasibility & Risk Index (BFRI)

Before implementing backend features, assess feasibility:

```
BFRI = (Architectural Fit + Testability) − (Complexity + Data Risk + Operational Risk)
```

| BFRI Score | Meaning | Action |
|------------|---------|--------|
| **6–10** | Safe | Proceed |
| **3–5** | Moderate | Add tests + monitoring |
| **0–2** | Risky | Refactor or isolate |
| **< 0** | Dangerous | Redesign before coding |

### Core Architecture Doctrine

**Layered Architecture (Mandatory):**
```
Routes → Controllers → Services → Repositories → Database
```

**Key Rules:**

| Rule | Do | Don't |
|------|-----|-------|
| Routes | Only route | Put business logic in routes |
| Controllers | Coordinate, call services | Direct database access |
| Services | Contain business logic | Framework-specific code |
| Errors | Send to Sentry | console.log |

**Required Patterns:**

1. **Controllers extend BaseController** - Use `handleSuccess()` and `handleError()`
2. **All input validated with Zod** - Request bodies, query params, route params
3. **unifiedConfig** - Never use `process.env` directly
4. **Dependency Injection** - Services receive dependencies via constructor

**Directory Structure:**
```
src/
├── config/           # unifiedConfig
├── controllers/      # BaseController + controllers
├── services/        # Business logic
├── repositories/    # Prisma access
├── routes/          # Express routes
├── middleware/      # Auth, validation, errors
├── validators/      # Zod schemas
├── types/           # Shared types
├── utils/           # Helpers
├── tests/           # Unit + integration tests
└── server.ts        # HTTP server
```

**When to Use:**
- Building Express/Node.js APIs
- Working with Prisma + PostgreSQL
- Creating microservices

---

## 3. Frontend Design

Create **memorable, high-craft interfaces** that avoid generic "AI UI" patterns.

### Design Feasibility & Impact Index (DFII)

```
DFII = (Impact + Fit + Feasibility + Performance) − Consistency Risk
```

| DFII Score | Meaning | Action |
|-------------|---------|--------|
| **12–15** | Excellent | Execute fully |
| **8–11** | Strong | Proceed with discipline |
| **4–7** | Risky | Reduce scope or effects |
| **≤ 3** | Weak | Rethink aesthetic direction |

### Core Design Mandate

Every output must satisfy **all four**:

1. **Intentional Aesthetic Direction** - Named, explicit design stance
2. **Technical Correctness** - Real, working code
3. **Visual Memorability** - At least one memorable element
4. **Cohesive Restraint** - No random decoration

### Aesthetic Directions (Choose One)

| Style | Best For |
|-------|----------|
| Brutalist / Raw | Design portfolios, artistic |
| Editorial / Magazine | News, blogs |
| Luxury / Refined | Premium brands |
| Retro-Futuristic | Gaming, entertainment |
| Industrial / Utilitarian | Tech products |
| Organic / Natural | Wellness, sustainability |
| Playful / Toy-like | Children's apps |
| Minimalist / Severe | Enterprise |

### Anti-Patterns (Avoid)

- ❌ Inter/Roboto/system fonts
- ❌ Purple-on-white SaaS gradients
- ❌ Default Tailwind/ShadCN layouts
- ❌ Symmetrical, predictable sections
- ❌ Overused AI design tropes

**When to Use:**
- Building UI components
- Creating landing pages
- Designing dashboards
- Any frontend styling task

---

## 4. Browser Automation

**Tools:** Playwright, Puppeteer, Selenium alternatives

### Core Patterns

| Pattern | Description |
|---------|-------------|
| **Test Isolation** | Each test runs in complete isolation with fresh state |
| **User-Facing Locator** | Select elements the way users see them |
| **Auto-Wait** | Let Playwright wait automatically - never add manual waits |

### Anti-Patterns (Avoid)

- ❌ Arbitrary timeouts
- ❌ CSS/XPath selectors first
- ❌ Single browser context for everything

### Sharp Edges & Solutions

| Issue | Severity | Solution |
|-------|----------|----------|
| waitForTimeout calls | critical | REMOVE all waitForTimeout |
| CSS/XPath selectors | high | Use user-facing locators |
| Bot detection | high | Use stealth plugins |
| Test state leakage | high | Each test fully isolated |
| Viewport inconsistencies | medium | Set consistent viewport |
| Rate limiting | high | Add delays between requests |

**When to Use:**
- E2E testing with Playwright
- Web scraping
- Browser automation tasks

---

## Usage Examples

| Task | Skill |
|------|-------|
| "Set up a new Next.js project" | senior-fullstack |
| "Build an Express API endpoint" | backend-dev-guidelines |
| "Design a landing page for my SaaS" | frontend-design |
| "Write Playwright E2E tests" | browser-automation |
| "Create a REST API with Prisma" | backend-dev-guidelines |
| "Style this dashboard beautifully" | frontend-design |

**Activation:** Skills auto-activate based on context. Just describe what you're building.
