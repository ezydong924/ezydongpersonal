param(
    [switch]$Yes
)

Write-Host "Deploying to Cloudflare + GitHub..." -ForegroundColor Cyan

try {
    # 1. Build static export.
    Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
    npm.cmd run build
    if ($LASTEXITCODE -ne 0) { throw "Build failed" }

    # 2. Commit and push to GitHub if there are changes.
    Write-Host "GitHub..." -ForegroundColor Cyan
    $pending = git status --porcelain
    if ($pending) {
        git status --short
        if (-not $Yes) {
            $confirmation = Read-Host "Commit and deploy all listed changes? [y/N]"
            if ($confirmation -notmatch "^[Yy]$") { throw "Deployment cancelled before staging changes" }
        }
        git add -A
        $stamp = Get-Date -Format "yyyy-MM-dd HH:mm"
        git commit -m "deploy: $stamp"
        if ($LASTEXITCODE -ne 0) { throw "Git commit failed" }
        git push
        if ($LASTEXITCODE -ne 0) { throw "Git push failed" }
    } else {
        Write-Host "   No changes to commit." -ForegroundColor Yellow
    }

    # 3. Deploy to Cloudflare Pages.
    Write-Host "Cloudflare..." -ForegroundColor Cyan
    npx.cmd wrangler pages deploy out --branch main
    if ($LASTEXITCODE -ne 0) { throw "Cloudflare deploy failed" }

    Write-Host "Done!" -ForegroundColor Green
    Write-Host "   Cloudflare: https://shadow-memory.pages.dev" -ForegroundColor Green
} catch {
    Write-Host "ERROR: $_" -ForegroundColor Red
    exit 1
}
