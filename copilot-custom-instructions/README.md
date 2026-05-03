# 🔍 GitHub Copilot repository instructions

**Adding repository custom instructions for GitHub Copilot** : https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/add-custom-instructions/add-repository-instructions

Repository custom instructions in GitHub Copilot let you teach Copilot how to behave for your specific project.

Instead of generic AI suggestions, you define:
+ Coding standards
+ Architecture rules
+ Naming conventions
+ Build/test steps

👉 So Copilot works like a team-aware developer, not just a generic assistant.


## ✅ GitHub Action to Enforce Copilot Instructions (.github/copilot-instructions.md will run automatically ?)
Yes, the .github/copilot-instructions.md file is designed to run automatically. Once you place it in the .github/ folder at the root of your repository, GitHub Copilot will automatically detect it and include its contents as context for every chat request made within that workspace.

## 📁 Types of instruction files
1. Repository-wide (most common)

📍 File:
```
.github/copilot-instructions.md
```
✔ Applies to entire repo

Example:

- Use Angular standalone components only
- Use RxJS best practices
- Always follow clean architecture
- Write unit tests using Jest
2. Path-specific instructions

📍 Folder:
```
.github/instructions/
```
📍 File example:
```
frontend.instructions.md
```
With frontmatter:
```
---
applyTo: "**/*.ts,**/*.tsx"
---
Use strict TypeScript typing
Avoid any keyword
```
✔ Applies only to matching files   
✔ Uses glob patterns (**/*.ts) 

3. Agent instructions (advanced / agentic AI)

📍 Files:
```
AGENTS.md
or CLAUDE.md, GEMINI.md
```
✔ Used by AI agents working across repo    
✔ Closest file in directory wins (priority-based)  

## ⚙️ How it actually works internally

When you:
- Ask Copilot Chat
- Generate code
- Run code review

👉 GitHub automatically:
1. Reads instruction files
2. Adds them to prompt context
3. Generates response aligned with your rules

✔ This happens silently in background

## 🧩 Priority order (VERY IMPORTANT)

From strongest → weakest:
- Path-specific instructions
- Repo-wide instructions
- Global user instructions

✔ Repo rules override personal settings

## 🚀 Real-world example (your use case)

Since you're working with:
```
Angular
Azure AI
Microfrontends
```

You can create:

**.github/copilot-instructions.md**
- Use Angular 17 standalone APIs
- Follow Nx monorepo structure
- Use Azure OpenAI SDK patterns
- All APIs must be RESTful and documented
- Use Docker for deployment

**.github/instructions/frontend.instructions.md**
```
applyTo: "apps/frontend/**/*.ts"
```
- Use Signals instead of RxJS where possible
- Follow OnPush change detection

## 🎯 Why this is powerful (don’t ignore this)

Without instructions:   
❌ Copilot = generic suggestions    
❌ Inconsistent code    
❌ Bad architecture drift   

With instructions:  
✅ Enforces team standards  
✅ Reduces review effort    
✅ Makes Copilot feel like senior dev in your team  

## Generate a production-grade copilot-instructions.md for my Angular application

📁 .github/copilot-instructions.md
```
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
```

**💡 What makes this “production-grade”**

This isn’t just rules — it enforces:
- Architecture discipline
- Performance patterns
- Security practices
- Enterprise scalability

👉 Basically turns GitHub Copilot into a senior Angular engineer