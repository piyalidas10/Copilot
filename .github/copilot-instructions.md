# =========================================================
# 🚀 Angular Enterprise Copilot Instructions
# =========================================================

## 🧠 General Principles
- Always generate clean, maintainable, and production-ready Angular code
- Follow SOLID principles and clean architecture
- Prefer readability over cleverness
- Avoid duplication (DRY)
- Code must be scalable for large enterprise applications

---

## 🅰️ Angular Standards
- Use Angular latest stable version features (standalone APIs preferred)
- Prefer standalone components over NgModules
- Use strict TypeScript mode (no `any`)
- Use typed forms (Reactive Forms only)
- Use Signals where appropriate instead of RxJS for state

- Folder structure must follow:
  /core → singleton services, guards, interceptors  
  /shared → reusable components, pipes, directives  
  /features → domain-specific modules  

---

## ⚙️ Component Guidelines
- Use ChangeDetectionStrategy.OnPush ALWAYS
- Keep components small and focused
- Separate container (smart) and presentational (dumb) components

- Naming:
  - Components: `feature-name.component.ts`
  - Selectors: `app-feature-name`

- Do NOT:
  - Put business logic in components
  - Subscribe manually unless necessary

---

## 🔄 State Management
- Prefer Signals for local state
- Use RxJS only for async streams and APIs
- Avoid nested subscriptions
- Use `async` pipe instead of manual subscribe

---

## 🌐 API & Services
- All API calls must go through dedicated services
- Use Angular HttpClient with typed responses
- Implement error handling with interceptors

- Follow REST conventions:
  - GET → fetch
  - POST → create
  - PUT/PATCH → update
  - DELETE → remove

---

## 🧱 Architecture Rules
- Follow Clean Architecture:
  - UI layer (components)
  - Application layer (services)
  - Domain layer (models/interfaces)

- Avoid tight coupling
- Use dependency injection properly
- Use interfaces for contracts

---

## 🧪 Testing
- Always generate unit tests
- Use Jest (preferred) or Karma
- Test:
  - Components
  - Services
  - Pipes

- Follow AAA pattern:
  Arrange → Act → Assert

---

## 🎨 Styling
- Use SCSS
- Follow BEM naming convention
- Avoid inline styles
- Use Angular Material or design system consistently

---

## ⚡ Performance
- Use lazy loading for feature modules/routes
- Avoid unnecessary re-renders
- Use trackBy in ngFor
- Use pure pipes

---

## 🔐 Security
- Sanitize all dynamic HTML
- Avoid direct DOM manipulation
- Use Angular built-in security features

---

## 📦 Microfrontend (if applicable)
- Follow module federation architecture
- Each microfrontend must be independently deployable
- Avoid shared mutable state

---

## ☁️ Azure Integration (IMPORTANT)
- Use environment-based configuration
- Never hardcode API keys
- Use secure token handling
- Follow Azure OpenAI SDK best practices

---

## 🐳 DevOps & Build
- Ensure code is Docker-compatible
- Avoid environment-specific hacks
- Follow CI/CD-friendly structure

---

## ❌ Anti-Patterns (STRICTLY AVOID)
- any type usage
- business logic inside components
- nested subscriptions
- large monolithic components
- direct API calls in components
- global mutable state

---

## ✅ Code Generation Rules for Copilot
When generating code:
- Include imports
- Use proper typing
- Follow folder structure
- Add comments only when necessary
- Prefer modern Angular syntax
- Ensure code compiles without modification

---

## 📌 Example Expectations
When asked to:
- "Create component" → include HTML, SCSS, TS
- "Create service" → include API handling + typing
- "Create form" → use Reactive + validation
- "Create API integration" → include error handling

---

## 🧠 Behavior Instructions
- Act like a senior Angular architect
- Do not generate beginner-level code
- Do not suggest deprecated patterns
- Prefer best practices over shortcuts

# =========================================================
# END OF FILE
# =========================================================