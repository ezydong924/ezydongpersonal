Write-Host "🚀 Deploying to Cloudflare + GitHub..." -ForegroundColor Cyan

try {
    # 1. Build for Cloudflare (static export via env var, no file tampering)
    Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
    $env:STATIC_EXPORT = "1"
    npm run build
    if ($LASTEXITCODE -ne 0) { throw "Build failed" }

    # 2. Commit and push to GitHub
    Write-Host "📤 GitHub..." -Cyan
    git add -A; git commit -m "deploy: update"; git push

    # 3. Deploy to Cloudflare Pages
    Write-Host "📤 Cloudflare..." -Cyan
    npx wrangler pages deploy out --branch main --commit-dirty=true

    Write-Host "✅ Done!" -Green
    Write-Host "   Cloudflare: https://shadow-memory.pages.dev" -Green
    Write-Host "   Vercel: https://ezydongpersonal.vercel.app" -Green
} catch {
    Write-Host "❌ $_" -Red
}
