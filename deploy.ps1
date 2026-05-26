Write-Host "🚀 Deploying to Cloudflare + GitHub..." -ForegroundColor Cyan

# 1. Temp: add export
$c = Get-Content next.config.ts -Raw
$c -replace 'const nextConfig: NextConfig = \{[^}]*\}', 'const nextConfig: NextConfig = { output: "export" }' | Set-Content next.config.ts

# 2. Build for Cloudflare
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
npm run build
if ($LASTEXITCODE -ne 0) { Write-Host "❌ Build failed" -Red; $c | Set-Content next.config.ts; exit 1 }

# 3. Deploy to Cloudflare
Write-Host "📤 Cloudflare..." -Cyan
npx wrangler pages deploy out --branch main --commit-dirty=true

# 4. Restore config
$c | Set-Content next.config.ts

# 5. Push to GitHub → Vercel
Write-Host "📤 GitHub → Vercel..." -Cyan
git add -A; git commit -m "deploy: update"; git push

Write-Host "✅ Done!" -Green
Write-Host "   Cloudflare: https://shadow-memory.pages.dev" -Green
Write-Host "   Vercel: https://ezydongpersonal.vercel.app" -Green
