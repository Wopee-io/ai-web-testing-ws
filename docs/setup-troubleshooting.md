# Setup Troubleshooting

Fixes for the issues attendees hit most often while preparing for the workshop. Windows-heavy by popular demand.

## Git is missing (Windows)

Git is not preinstalled on Windows 10/11. Install it and reopen your terminal:

```powershell
winget install --id Git.Git -e --source winget
```

(Alternative: the [git-scm.com installer](https://git-scm.com/install/windows) with default options. GitHub Desktop is not enough - it does not reliably put `git` on the terminal PATH.)

## PowerShell refuses to run npm

Symptom: `npm install` (or even `npm -v`) fails with *"npm.ps1 cannot be loaded because running scripts is disabled on this system."*

This is standard Windows behavior: PowerShell 5.1 (the built-in shell) defaults to the `Restricted` execution policy on Windows clients, which blocks the `npm.ps1` shim. Fix (no admin rights needed, persists for your user):

```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

On locked-down corporate laptops where Group Policy overrides this, use `-Scope Process` (works for the current window only) or run npm from `cmd.exe` instead. Details: [Microsoft docs on execution policies](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_execution_policies).

## Playwright browser install hangs at extraction

Symptom: `npx playwright install` downloads a browser to 100%, then hangs forever while unpacking the archive.

This is a known bug ([playwright#40998](https://github.com/microsoft/playwright/issues/40998), [#41000](https://github.com/microsoft/playwright/issues/41000)): Playwright versions **below 1.60** hit an unzip regression on **Node.js 24.16+ and 26.x**. It affects Windows, macOS, and Linux alike.

- This repo pins Playwright **1.62+**, so a fresh `npm install` here is not affected.
- If you hit it in another project: upgrade Playwright (`npm i -D @playwright/test@latest`), or temporarily use Node 24.15/22 LTS.
- Antivirus exclusions do not fix this particular hang; check your Node version first.

## `npm test` output

Step "Run tests" executes `tests/setup-check.spec.ts`, which opens the workshop demo app ([foodora.lovable.app](https://foodora.lovable.app/)) and checks the homepage renders. Expected result:

```text
✓  1 › tests/setup-check.spec.ts › workshop setup check: Foodora homepage loads
1 passed
```

- **"browser is not installed"** - run `npx playwright install` and re-run `npm test`.
- **Timeout / network errors** - check you can open [foodora.lovable.app](https://foodora.lovable.app/) in your own browser (corporate proxies sometimes block it).
- The full Wopee.io test reporter is used only by the experiment scripts (`npm run e4.1` etc.), not by `npm test`, so a missing or incomplete `.env` does not break the setup check.

## Still stuck?

Ask in the LinkedIn chat or bring the error message to the workshop - broken setups are teaching material too.
