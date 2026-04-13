# How to write specs that make AI build what you actually want

**The single biggest determinant of vibe coding success isn't which tool you pick — it's how well you specify what you want before the AI writes a line of code.** The community consensus across 2025–2026 is unambiguous: developers who invest 15–30 minutes writing a structured specification get dramatically better results — **3× fewer regenerations**, more coherent architecture, and code that actually ships. This report synthesizes guidance from official tool documentation, open-source frameworks, and thousands of community discussions into actionable practices for writing specs that work with Lovable, Bolt.new, v0, Cursor, Claude Code, and similar tools.

The vibe coding ecosystem has matured rapidly. What began as "prompt and pray" in early 2025 has evolved into **spec-driven development (SDD)** — a discipline with named frameworks, CLI tools, and IDE integrations. The core insight: AI coding tools are remarkably capable executors but poor strategists. Your job is strategy; the AI's job is execution.

---

## The anatomy of a spec that actually works

Every effective AI coding spec answers five questions, regardless of tool or framework: **What does the app do?** (one sentence), **Who uses it?**, **What are the key screens?**, **What data does it handle?**, and **What are the constraints?** This "five-question test" from vibecoding.app has become the community's minimum viable spec.

For production projects, the consensus structure expands into a lightweight PRD with these sections:

**Project overview** — A single sentence capturing the core job the app performs, who it's for, and the value proposition. This anchors every AI decision. "A time-tracking dashboard for freelancers that generates weekly invoices from logged hours" beats "Build me a time tracker."

**Tech stack** — Explicitly name every layer: frontend framework, CSS approach, component library, backend/database, auth method, and deployment target. Including **SDK versions** prevents the AI from mixing syntax across versions. Omitting this causes AI tools to make arbitrary choices that conflict later.

**User stories and flows** — Describe journeys as step-by-step sequences: "User signs up with email → receives verification → lands on empty dashboard → clicks 'Create Project' → fills form → gets redirected to project detail." Kiro's EARS notation is gaining traction here: `WHEN a user submits a form with invalid data THE SYSTEM SHALL display validation errors next to the relevant fields.`

**Data model** — List entities, their core fields, relationship types (one-to-many, many-to-many), and constraints. A simple table format works well. **If you skip this, most vibe coding tools will hardcode data in the frontend** — giving the illusion of a functional app that has no actual backend.

**UI/UX requirements** — Use specific design vocabulary rather than vague descriptors. "Clean design with generous whitespace, **#1E40AF** blue accents, Inter font, rounded-lg card borders with subtle drop shadows" produces far better results than "make it look professional." Reference existing designs when possible: "Blog layout similar to Medium's clean reading experience." Include loading states, empty states, and error states explicitly.

**Constraints and boundaries** — What NOT to build is as important as what to build. List non-goals, files/components the AI should never touch, and scope limitations. The most effective format uses emoji markers: ✅ Always do, ⚠️ Ask first, 🚫 Never touch.

**Implementation phases** — Break the build into sequential phases. Phase 1 covers foundation and core data model. Phase 2 adds primary features. Phase 3 handles polish, edge cases, and integrations. This prevents the "everything at once" trap.

---

## Seven mistakes that sabotage vibe coding projects

The community has converged on a remarkably consistent list of failure patterns. Understanding these is as valuable as knowing what to do right.

**The "everything trap" is the #1 killer.** Asking an AI to "build a complete e-commerce site with login, catalog, cart, and payments" in a single prompt overwhelms the model, producing incoherent, mediocre results across every dimension. The fix is disciplined decomposition — one component or feature per prompt after the initial scaffold.

**Vagueness is the #2 killer.** "Make it look professional" gives the AI no direction. Every ambiguity becomes a coin flip. The cure is specificity: name colors, fonts, spacing philosophy, component types, and interaction behaviors.

**Ignoring security is endemic.** Veracode's 2025 report found a **45% vulnerability rate** in AI-generated code. AI tools don't naturally implement input validation, CSRF protection, parameterized queries, or proper secrets management. You must explicitly require these in your spec.

**Context drift in long sessions degrades quality.** Model performance drops measurably in extended chat sessions. The remedy: start a new chat for each distinct task, commit working code between sessions, and use context-clearing commands (`/clear`, `/compact`) proactively. Multiple frameworks now spawn fresh context windows per task for exactly this reason.

**Skipping version control** means you can't recover when a prompt breaks your layout — and it will. Commit after every working feature. In Lovable, pin stable versions. In Bolt, create explicit save points.

Other common mistakes include forgetting mobile responsiveness (always specify "mobile-first"), using unnecessary technical jargon when describing outcomes would suffice, and not testing edge cases because "the code runs." Running code is not correct code.

---

## The hybrid approach: structured spec plus iterative refinement

The research strongly converges on a **two-phase workflow** that outperforms both pure upfront specification and pure iterative prompting.

**Phase 1 is upfront specification.** Before touching any AI tool, write a concise PRD covering the five core questions. Many developers use ChatGPT or Claude to draft this initial spec, then refine it manually. The popular GitHub repo KhazP/vibe-coding-prompt-template (1.9k stars) formalizes this as a five-step workflow: deep research → PRD generation → tech design → implementation → iteration. The PRD anchors the AI's decisions and prevents architectural incoherence.

**Phase 2 is iterative building.** Generate the initial scaffold from your spec, then refine through targeted, surgical prompts — **1–3 changes per prompt, never five stacked requests.** The recommended flow from Layout.dev and the Bolt.new team is: skeleton first (layout structure only) → review and preview → add one layer (a specific component) → polish (hover states, transitions, loading skeletons). Users report 3× fewer total regenerations with this stepwise approach versus monolithic prompts.

**Why pure iterative fails:** Without upfront structure, the AI stacks new logic on incompatible foundations, creating "AI spaghetti" — lots of working parts, none connected cleanly. **Why pure upfront fails:** A 50-page spec in one prompt overwhelms context, producing mediocre results across all dimensions.

A powerful intermediate technique is **planning-first prompting**: "Before writing any code, create a detailed plan listing the main components needed, their responsibilities, data flow, state management approach, and potential edge cases. Then implement step 1 only." This forces the AI to reason before executing.

---

## Six frameworks that formalize spec-driven development

The SDD ecosystem exploded in 2025–2026. These frameworks turn ad-hoc prompting into repeatable engineering workflows.

**BMAD Method** (Breakthrough Method for Agile AI-Driven Development) is the most comprehensive framework, created by Brian Madison and open-sourced at github.com/bmad-code-org/BMAD-METHOD. It uses specialized AI personas defined as Markdown files — Product Manager, Architect, Developer, UX Designer, QA — each with explicit expertise and expected outputs. The workflow moves through Analysis → Planning → Solutioning → Implementation with quality gates between phases. BMAD generates a full artifact chain: PRD → Architecture Document → UX Specification → Epics & Stories. It supports nine platforms including Claude Code, Cursor, and Windsurf via `npx bmad-method install`. Best suited for teams and complex projects.

**Kiro** (AWS) is an AI-native IDE built around spec-driven development as a first-class workflow. It transforms natural language into a three-file spec structure: `requirements.md` (user stories with EARS acceptance criteria), `design.md` (architecture and sequence diagrams), and `tasks.md` (discrete implementation tasks). Kiro also uses "steering files" (`.kiro/steering/`) for persistent project context: `product.md`, `structure.md`, and `tech.md`. Priced at free (50 interactions/month) to $39/month.

**GSD** (Get Shit Done) at gsd.build takes an execution-first approach with **16.7k+ GitHub stars**. Its key innovation is context engineering — each task runs in a fresh Claude instance with a clean 200k-token context window, ensuring task 50 has the same quality as task 1. All state lives on disk, not in memory. GSD decomposes work into atomic plans of 2–3 tasks designed to fit within ~50% of a context window, with wave-based parallel execution for independent tasks.

**GitHub Spec Kit** is GitHub's official SDD toolkit, providing a gated five-phase workflow via slash commands: `/speckit.constitution` → `/speckit.specify` → `/speckit.plan` → `/speckit.tasks` → `/speckit.implement`. It generates `spec.md`, `plan.md`, and `tasks.md` per feature branch and integrates with Copilot, Claude Code, and Gemini CLI.

**Taskmaster AI** (github.com/eyaltoledano/claude-task-master) serves as a persistent task management layer that bridges chat sessions. It parses a detailed PRD into a dependency-mapped task tree with complexity analysis, preventing context rot across sessions. Works with Cursor, Lovable, and Windsurf.

**Addy Osmani's framework** (Google Chrome engineering lead) distills five principles: start high-level and let AI draft details, structure specs like a PRD using six core areas identified from GitHub's analysis of 2,500+ agent configurations (commands, testing, project structure, code style, git workflow, and boundaries), break into modular prompts, use hierarchical summarization for large specs, and iterate continuously using Plan Mode first.

---

## What each tool expects from your spec

Each AI coding tool has distinct configuration mechanisms and sweet spots. Tailoring your spec format to the tool dramatically improves output quality.

**Cursor** uses a sophisticated rules system in `.cursor/rules/*.mdc` files with four activation modes: Always Apply, Auto Attached (triggered by glob patterns), Agent Requested (AI decides based on description), and Manual. The community analysis of 130+ cursor rules files identified key patterns: type safety enforcement, early return patterns, conventional commits, and explicit behavioral constraints like "Don't apologize for errors — fix them." The most effective approach uses a three-tier system: global user rules, project-wide rules, and pattern-specific rules. Keep each rule focused and actionable.

**Lovable** is opinionated about its stack (React, Vite, Tailwind, TypeScript only) and recommends building **by component, not by page**. "A full-page prompt gets you noise. A section-based prompt gets you signal." Its Plan Mode should be used 60–70% of the time. Lovable responds well to aesthetic buzzwords — "minimal," "cinematic," "premium," "playful" — which influence typography, spacing, shadows, and color choices. Upload Figma mockups or screenshots for visual context.

**Bolt.new** provides persistent Project Prompts and Global System Prompts that auto-attach to every interaction. Its official guidance emphasizes starting with architecture before features, using Discussion Mode to explore ideas before building, and leveraging the built-in Prompt Enhancer. File targeting and exclusion let you focus the AI on specific parts of your codebase.

**v0.dev** (Vercel) publishes a specific three-input framework: Product Surface (components, data, actions), Context of Use (who, when, what decision), and Constraints (platform, visual tone, layout). It's strongest with React, Next.js App Router, shadcn/ui, and Tailwind. v0 supports a prompt queue of up to 10 sequential prompts.

**Claude Code** uses `CLAUDE.md` as its primary configuration — a markdown file read at session start. Official guidance says **keep it under 200 lines** because instruction-following degrades exponentially with excess. Structure it as WHAT (tech stack, project structure), WHY (purpose), and HOW (build commands, verification steps). For stronger guarantees, use Hooks (deterministic pre/post scripts) rather than relying on CLAUDE.md alone, which achieves roughly 80% compliance.

**Windsurf** combines developer-authored rules (`.windsurf/rules/*.md`) with auto-captured Memories that persist across sessions. It uses four trigger modes matching Cursor's approach. Its Cascade AI maintains deep codebase understanding through a "shared timeline" architecture. Periodically review stored Memories — incorrect ones can mislead the AI.

---

## Community templates and resources worth bookmarking

The open-source ecosystem offers several high-quality starting points. **KhazP/vibe-coding-prompt-template** (1.9k stars, 248 forks) provides the most popular dedicated workflow with prompts for deep research, PRD generation, tech design, and implementation. **EnzeD/vibe-coding** (4k stars) is the "Ultimate Guide" maintained by Nicolas Zullo, emphasizing that "planning is everything — do NOT let the AI plan autonomously, or your codebase will become an unmanageable mess."

**PatrickJS/awesome-cursorrules** curates 130+ `.cursorrules` files organized by framework. **filipecalegario/awesome-vibe-coding** and **taskade/awesome-vibe-coding** are comprehensive reference lists covering tools, articles, and community channels. A widely-forked Bolt.new Mega Prompt template (GitHub Gist by iamnolanhu, 37 stars) provides a complete one-shot application generator structure based on "38,787 words of Bolt.new expert insights."

Dedicated PRD generators have emerged for AI coding: **TinyPRD** (tinyprd.app) generates implementation-ready specs for Cursor, Claude Code, and Lovable. **CodeGuide** (codeguide.dev) produces PRDs, tech specs, and wireframes while mapping existing GitHub codebases. **ChatPRD** (chatprd.ai) offers tool-specific guidance for Cursor, v0, Bolt, and Lovable. The emerging **AGENTS.md** standard (agent-rules.org) aims to be a cross-tool specification format that works across Cursor, Aider, Claude Code, and others — essentially an EditorConfig for AI coding conventions.

---

## Conclusion

The gap between vibe coding that ships and vibe coding that spirals isn't talent or tool choice — it's specification discipline. Three principles matter most. **First, always write before you prompt**: even 15 minutes spent on a lightweight PRD covering purpose, users, screens, data model, and constraints will save hours of regeneration. **Second, build in layers**: scaffold the skeleton, verify it, add one component, verify, repeat — never attempt everything in a single prompt. **Third, match your spec format to your tool**: use `.cursor/rules/*.mdc` for Cursor, `CLAUDE.md` for Claude Code, steering files for Kiro, and persistent System Prompts for Bolt. The tools are increasingly powerful; the bottleneck is now entirely in how clearly humans can articulate what they want.