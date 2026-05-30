Write-Host "🚀 Deploying to Cloudflare + GitHub..." -ForegroundColor Cyan

# 1. Backup config and add export for static build
$configPath = "next.config.ts"
$backupPath = "next.config.ts.bak"
Copy-Item $configPath $backupPath -Force

try {
    $content = Get-Content $configPath -Raw
    # Robust: replace whole config object content, handling any nesting
    $idx = $content.IndexOf("NextConfig = {")
    if ($idx -ge 0) {
        $prefix = $content.Substring(0, $idx + "NextConfig = ".Length)
        $rest = $content.Substring($idx + "NextConfig = ".Length)
        # Find matching closing brace
        $depth = 0; $closeIdx = -1
        for ($i = 0; $i -lt $rest.Length; $i++) {
            if ($rest[$i] -eq '{') { $depth++ }
            elseif ($rest[$i] -eq '}') { $depth--; if ($depth -eq 0) { $closeIdx = $i; break } }
        }
        if ($closeIdx -ge 0) {
            $inner = $rest.Substring(1, $closeIdx - 1).Trim()
            if ($inner.Length -gt 0) { $inner = "output: `"export`", $inner" } else { $inner = "output: `"export`"" }
            $newContent = $prefix + "{ $inner }" + $rest.Substring($closeIdx + 1)
            Set-Content $configPath $newContent -NoNewline
        }
    }

    # 2. Build for Cloudflare
    Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
    npm run build
    if ($LASTEXITCODE -ne 0) { throw "Build failed" }

    # 3. Deploy to Cloudflare
    Write-Host "📤 Cloudflare..." -Cyan
    npx wrangler pages deploy out --branch main --commit-dirty=true

    # 4. Push to GitHub → Vercel
    Write-Host "📤 GitHub → Vercel..." -Cyan
    git add -A; git commit -m "deploy: update"; git push

    Write-Host "✅ Done!" -Green
    Write-Host "   Cloudflare: https://shadow-memory.pages.dev" -Green
    Write-Host "   Vercel: https://ezydongpersonal.vercel.app" -Green
} catch {
    Write-Host "❌ $_" -Red
} finally {
    # Always restore original config
    if (Test-Path $backupPath) {
        Copy-Item $backupPath $configPath -Force
        Remove-Item $backupPath -Force
    }
}
