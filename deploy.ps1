Write-Host "🚀 Deploying to Cloudflare + GitHub..." -ForegroundColor Cyan

try {
    # 1. Build (static export)
    Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
    npm run build
    if ($LASTEXITCODE -ne 0) { throw "Build failed" }

    # 2. Commit and push to GitHub
    Write-Host "📤 GitHub..." -Cyan
    git add -A; git commit -m "deploy: update"; git push

    # 3. Deploy to Cloudflare Pages
    Write-Host "📤 Cloudflare..." -Cyan
    npx wrangler pages deploy out --branch main

    Write-Host "✅ Done!" -Green
    Write-Host "   Cloudflare: https://shadow-memory.pages.dev" -Green
} catch {
    Write-Host "❌ $_" -Red
}
