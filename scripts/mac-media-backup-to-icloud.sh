#!/usr/bin/env bash
# mac-media-backup-to-icloud.sh
# Run this ON YOUR MAC (Terminal). Scans Pictures / Movies / Desktop / Downloads /
# Documents and the rest of your home folder (including hidden paths) for images
# and videos, copies them to a staging folder, then into iCloud Drive for iPhone.
#
# Usage (on Mac):
#   chmod +x scripts/mac-media-backup-to-icloud.sh
#   ./scripts/mac-media-backup-to-icloud.sh --dry-run
#   ./scripts/mac-media-backup-to-icloud.sh
#
# Safety: does NOT upload to GitHub. Personal media stays under your Apple ID (iCloud).

set -euo pipefail

DRY_RUN=0
if [ "${1:-}" = "--dry-run" ]; then
  DRY_RUN=1
fi

SCAN_HOME="${SCAN_HOME:-$HOME}"
STAGING="${STAGING:-$HOME/Desktop/Resync-Media-Staging}"
ICLOUD_ROOT="${ICLOUD_ROOT:-$HOME/Library/Mobile Documents/com~apple~CloudDocs}"
DEST="${DEST:-$ICLOUD_ROOT/Resync-Media-Cloud}"

RUN_ID="$(date +"%Y-%m-%d_%H%M%S")"
STAGE_DIR="$STAGING/$RUN_ID"
SEEN_DIR="$STAGE_DIR/logs/.seen"
MANIFEST="$STAGE_DIR/logs/manifest.tsv"

log() { printf '%s\n' "$*"; }

should_skip() {
  case "$1" in
    */Library/Caches/*|*/System/*|*/private/*|*/.Trash/*|*/node_modules/*|*/.git/*|*/Library/Application\ Support/*|*/Library/Containers/*|*/Library/Group\ Containers/*|*/Library/Developer/*|*/.npm/*|*/.cache/*|*/Library/Mobile\ Documents/*|*/Resync-Media-Staging/*|*/Resync-Media-Cloud/*|*/cloud-media-pack/*)
      return 0
      ;;
  esac
  return 1
}

ext_lower() {
  printf '%s' "${1##*.}" | tr '[:upper:]' '[:lower:]'
}

media_kind() {
  case "$(ext_lower "$1")" in
    jpg|jpeg|png|gif|webp|heic|heif|bmp|tiff|tif|ico) echo images ;;
    mp4|mov|m4v|avi|mkv|webm|3gp) echo videos ;;
    *) echo "" ;;
  esac
}

is_hidden_path() {
  case "$1" in
    */.*) return 0 ;;
  esac
  return 1
}

log "=== Resync Media → iCloud (iPhone) ==="
log "Scan root  : $SCAN_HOME"
log "Staging    : $STAGE_DIR"
log "iCloud dest: $DEST/$RUN_ID"
log "Dry run    : $DRY_RUN"
log ""

if [ ! -d "$SCAN_HOME" ]; then
  log "ERROR: SCAN_HOME does not exist: $SCAN_HOME"
  exit 1
fi

mkdir -p "$STAGE_DIR/images" "$STAGE_DIR/videos" \
  "$STAGE_DIR/hidden-source/images" "$STAGE_DIR/hidden-source/videos" \
  "$STAGE_DIR/logs" "$SEEN_DIR"

printf 'kind\thidden\tsource\tdest\n' > "$MANIFEST"

FOUND=0
COPIED=0
SKIPPED=0

# Prefer user media folders; also scan full home (includes hidden dirs; .Trash skipped)
# Collect candidate paths once into a list file (macOS bash 3.2 friendly)
LIST="$STAGE_DIR/logs/candidates.txt"
: > "$LIST"

for root in \
  "$SCAN_HOME/Pictures" \
  "$SCAN_HOME/Movies" \
  "$SCAN_HOME/Desktop" \
  "$SCAN_HOME/Downloads" \
  "$SCAN_HOME/Documents" \
  "$SCAN_HOME"
do
  [ -d "$root" ] || continue
  log "Indexing: $root ..."
  find "$root" -type f \( \
      -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' -o -iname '*.gif' -o \
      -iname '*.webp' -o -iname '*.heic' -o -iname '*.heif' -o -iname '*.bmp' -o \
      -iname '*.tiff' -o -iname '*.tif' -o -iname '*.ico' -o \
      -iname '*.mp4' -o -iname '*.mov' -o -iname '*.m4v' -o -iname '*.avi' -o \
      -iname '*.mkv' -o -iname '*.webm' -o -iname '*.3gp' \
    \) 2>/dev/null >> "$LIST" || true
done

# Sort | uniq paths
SORTLIST="$STAGE_DIR/logs/candidates.uniq.txt"
sort -u "$LIST" > "$SORTLIST"

while IFS= read -r file; do
  [ -n "$file" ] || continue
  [ -f "$file" ] || continue

  if should_skip "$file"; then
    SKIPPED=$((SKIPPED + 1))
    continue
  fi

  kind="$(media_kind "$file")"
  [ -n "$kind" ] || continue

  # Dedup by inode-size when available
  if key="$(stat -f '%i-%z' "$file" 2>/dev/null)"; then
    :
  elif key="$(stat -c '%i-%s' "$file" 2>/dev/null)"; then
    :
  else
    key="$(printf '%s' "$file" | shasum 2>/dev/null | awk '{print $1}')"
  fi
  if [ -e "$SEEN_DIR/$key" ]; then
    SKIPPED=$((SKIPPED + 1))
    continue
  fi
  : > "$SEEN_DIR/$key"

  FOUND=$((FOUND + 1))
  base="$(basename "$file")"
  parent="$(basename "$(dirname "$file")")"
  dest_name="${parent}__${base}"

  hidden=0
  dest_dir="$STAGE_DIR/$kind"
  if is_hidden_path "$file"; then
    hidden=1
    dest_dir="$STAGE_DIR/hidden-source/$kind"
  fi

  dest="$dest_dir/$dest_name"
  if [ -e "$dest" ]; then
    dest="$dest_dir/${RUN_ID}_${FOUND}_$dest_name"
  fi

  printf '%s\t%s\t%s\t%s\n' "$kind" "$hidden" "$file" "$dest" >> "$MANIFEST"

  if [ "$DRY_RUN" -eq 1 ]; then
    log "[dry-run] $file"
  else
    cp -p "$file" "$dest" 2>/dev/null || cp "$file" "$dest"
    COPIED=$((COPIED + 1))
    # Progress every 25 files
    if [ $((COPIED % 25)) -eq 0 ]; then
      log "Copied $COPIED files..."
    fi
  fi
done < "$SORTLIST"

{
  echo "Run ID: $RUN_ID"
  echo "Found unique media: $FOUND"
  echo "Copied: $COPIED"
  echo "Skipped (dup/system): $SKIPPED"
  echo "Dry run: $DRY_RUN"
  echo "Staging: $STAGE_DIR"
} | tee "$STAGE_DIR/logs/SUMMARY.txt"

if [ "$DRY_RUN" -eq 1 ]; then
  log ""
  log "Dry run complete. Re-run without --dry-run to copy."
  exit 0
fi

if [ -d "$ICLOUD_ROOT" ]; then
  mkdir -p "$DEST"
  log ""
  log "Copying staging folder into iCloud Drive..."
  # Prefer rsync; fall back to cp -R
  if command -v rsync >/dev/null 2>&1; then
    rsync -a "$STAGE_DIR/" "$DEST/$RUN_ID/"
  else
    mkdir -p "$DEST/$RUN_ID"
    cp -R "$STAGE_DIR/." "$DEST/$RUN_ID/"
  fi
  log "iCloud copy done: $DEST/$RUN_ID"
  log ""
  log "On iPhone:"
  log "  1. Open Files → Browse → iCloud Drive → Resync-Media-Cloud → $RUN_ID"
  log "  2. Open images/ or videos/ (or hidden-source/)"
  log "  3. Optional: Share → Save Image / Save Video into Photos"
else
  log ""
  log "WARNING: iCloud Drive not found at:"
  log "  $ICLOUD_ROOT"
  log "Enable iCloud Drive on this Mac, then drag:"
  log "  $STAGE_DIR"
  log "into Finder → iCloud Drive → create folder Resync-Media-Cloud"
fi

log ""
log "Done."
