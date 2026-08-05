#!/usr/bin/env bash
# Generate watermarked PDF packs for Daniel Noel Mcgarry and Brooke Caroline Hunt
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TEMPLATE="$ROOT/docs/business-legal/templates/partner-complete-pack.html"
ASSETS="$ROOT/docs/business-legal/assets"
BUILD="$ROOT/docs/business-legal/.pdf-build"
CHROME="${CHROME_BIN:-google-chrome}"

mkdir -p "$BUILD" "$ROOT/pdf-deliverables/daniel-noel-mcgarry" "$ROOT/pdf-deliverables/brooke-caroline-hunt"
cp -r "$ASSETS" "$BUILD/assets"

generate_pdf() {
  local partner_name="$1"
  local slug="$2"
  local out_dir="$ROOT/pdf-deliverables/$slug"
  local html="$BUILD/pack-$slug.html"
  local pdf="$out_dir/Resync-AI-Complete-Package-${slug}.pdf"

  sed "s/PARTNER_NAME/$partner_name/g" "$TEMPLATE" > "$html"
  # Fix asset paths for build dir
  sed -i 's|src="assets/|src="./assets/|g' "$html"

  if ! command -v "$CHROME" >/dev/null 2>&1; then
    echo "Chrome not found. Open manually: $html → Print to PDF → $pdf"
    cp "$html" "$out_dir/"
    return
  fi

  "$CHROME" --headless=new --disable-gpu --no-sandbox \
    --user-data-dir="/tmp/chrome-pdf-$slug" \
    --print-to-pdf="$pdf" "file://$html" 2>/dev/null || \
  "$CHROME" --headless --disable-gpu --no-sandbox \
    --user-data-dir="/tmp/chrome-pdf-$slug" \
    --print-to-pdf="$pdf" "file://$html"

  echo "Created: $pdf"
  cp "$html" "$out_dir/Resync-AI-Complete-Package-${slug}.html"
}

generate_pdf "Daniel Noel Mcgarry" "daniel-noel-mcgarry"
generate_pdf "Brooke Caroline Hunt" "brooke-caroline-hunt"

# Copy source markdown index into each folder for reference
cp "$ROOT/docs/business-legal/01-MASTER-INDEX.md" "$ROOT/pdf-deliverables/daniel-noel-mcgarry/"
cp "$ROOT/docs/business-legal/01-MASTER-INDEX.md" "$ROOT/pdf-deliverables/brooke-caroline-hunt/"
cp "$ROOT/docs/business-legal/03-PARTNERSHIP-AND-OWNERSHIP-AGREEMENT.md" "$ROOT/pdf-deliverables/daniel-noel-mcgarry/"
cp "$ROOT/docs/business-legal/03-PARTNERSHIP-AND-OWNERSHIP-AGREEMENT.md" "$ROOT/pdf-deliverables/brooke-caroline-hunt/"
cp "$ROOT/docs/business-legal/partner-packages/DANIEL-NOEL-MCGARRY-EXECUTIVE-PACKAGE.md" "$ROOT/pdf-deliverables/daniel-noel-mcgarry/"
cp "$ROOT/docs/business-legal/partner-packages/BROOKE-CAROLINE-HUNT-EXECUTIVE-PACKAGE.md" "$ROOT/pdf-deliverables/brooke-caroline-hunt/"
cp "$ROOT/docs/business-legal/assets/resync-ai-logo-primary.png" "$ROOT/pdf-deliverables/daniel-noel-mcgarry/"
cp "$ROOT/docs/business-legal/assets/resync-ai-logo-primary.png" "$ROOT/pdf-deliverables/brooke-caroline-hunt/"

echo "Done. Review PDFs with qualified legal counsel before signing."
