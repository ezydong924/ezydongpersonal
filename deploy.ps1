Write-Host "🚀 Deploying to Cloudflare + GitHub..." -ForegroundColor Cyan

try {
    # 1. Build (static export)
    Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
    npm run build
    if ($LASTEXITCODE -ne 0) { throw "Build failed" }

    # 2. Commit and push to GitHub (only if there are changes)
    Write-Host "📤 GitHub..." -ForegroundColor Cyan
    git add -A
    $status = git status --porcelain
    if ($status) {
        $stamp = Get-Date -Format "yyyy-MM-dd HH:mm"
        git commit -m "deploy: $stamp"
        git push
    } else {
        Write-Host "   No changes to commit." -ForegroundColor Yellow
    }

    # 3. Deploy to Cloudflare Pages
    Write-Host "📤 Cloudflare..." -ForegroundColor Cyan
    npx wrangler pages deploy out --branch main
    if ($LASTEXITCODE -ne 0) { throw "Cloudflare deploy failed" }

    Write-Host "✅ Done!" -ForegroundColor Green
    Write-Host "   Cloudflare: https://shadow-memory.pages.dev" -ForegroundColor Green
} catch {
    Write-Host "❌ $_" -ForegroundColor Red
    exit 1
}
