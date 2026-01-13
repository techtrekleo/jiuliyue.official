#!/usr/bin/env bash
set -euo pipefail

# Sync new gallery images to Cloudflare R2.
#
# What it does:
# - Looks at ./public/galley
# - Finds files whose name does NOT match: jiuliyue_###.(png|jpg|jpeg|webp)
# - Renames them to the next available jiuliyue_###.*
# - Optionally uploads ONLY the newly-renamed files to Cloudflare R2 using AWS CLI
#
# Requirements for upload:
# - aws CLI installed
# - env vars:
#   R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET
# Optional:
#   R2_PREFIX (default: galley/)
#
# Usage:
#   ./scripts/gallery_r2_sync.sh rename
#   ./scripts/gallery_r2_sync.sh upload
#   ./scripts/gallery_r2_sync.sh rename+upload

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
GALLEY_DIR="${ROOT_DIR}/public/galley"

MODE="${1:-rename+upload}"

if [[ ! -d "${GALLEY_DIR}" ]]; then
  echo "ERROR: ${GALLEY_DIR} not found"
  exit 1
fi

shopt -s nullglob
FILES=("${GALLEY_DIR}"/*.{png,jpg,jpeg,webp})
shopt -u nullglob

if [[ ${#FILES[@]} -eq 0 ]]; then
  echo "No images found in public/galley"
  exit 0
fi

pattern='^jiuliyue_[0-9]{3}\.(png|jpg|jpeg|webp)$'

next_index() {
  local max=0
  local f base num
  for f in "${GALLEY_DIR}"/jiuliyue_*.{png,jpg,jpeg,webp}; do
    [[ -e "$f" ]] || continue
    base="$(basename "$f")"
    num="${base#jiuliyue_}"
    num="${num%%.*}"
    if [[ "$num" =~ ^[0-9]{3}$ ]]; then
      ((10#$num > max)) && max=$((10#$num))
    fi
  done
  echo $((max + 1))
}

RENAMED_LIST=()
idx="$(next_index)"

for f in "${FILES[@]}"; do
  base="$(basename "$f")"
  if [[ "$base" =~ $pattern ]]; then
    continue
  fi

  ext="${base##*.}"
  new_name
  new_name="$(printf "jiuliyue_%03d.%s" "$idx" "$ext")"
  echo "rename: ${base} -> ${new_name}"
  mv -n "$f" "${GALLEY_DIR}/${new_name}"
  RENAMED_LIST+=("${GALLEY_DIR}/${new_name}")
  idx=$((idx + 1))
done

if [[ "${MODE}" == "rename" ]]; then
  echo "Done (rename only)."
  exit 0
fi

if [[ "${MODE}" != "upload" && "${MODE}" != "rename+upload" ]]; then
  echo "Unknown mode: ${MODE}"
  echo "Use: rename | upload | rename+upload"
  exit 1
fi

if [[ "${MODE}" == "upload" ]]; then
  # In upload-only mode, upload all jiuliyue_### files
  RENAMED_LIST=()
  for f in "${GALLEY_DIR}"/jiuliyue_*.{png,jpg,jpeg,webp}; do
    [[ -e "$f" ]] || continue
    RENAMED_LIST+=("$f")
  done
fi

if [[ ${#RENAMED_LIST[@]} -eq 0 ]]; then
  echo "Nothing to upload."
  exit 0
fi

: "${R2_ACCOUNT_ID:?Missing R2_ACCOUNT_ID}"
: "${R2_ACCESS_KEY_ID:?Missing R2_ACCESS_KEY_ID}"
: "${R2_SECRET_ACCESS_KEY:?Missing R2_SECRET_ACCESS_KEY}"
: "${R2_BUCKET:?Missing R2_BUCKET}"

R2_PREFIX="${R2_PREFIX:-galley/}"
R2_ENDPOINT="https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com"

export AWS_ACCESS_KEY_ID="${R2_ACCESS_KEY_ID}"
export AWS_SECRET_ACCESS_KEY="${R2_SECRET_ACCESS_KEY}"
export AWS_DEFAULT_REGION="auto"

echo "Uploading ${#RENAMED_LIST[@]} file(s) to R2 bucket: ${R2_BUCKET} (prefix: ${R2_PREFIX})"

for f in "${RENAMED_LIST[@]}"; do
  b="$(basename "$f")"
  key="${R2_PREFIX%/}/${b}"
  echo "upload: ${b} -> s3://${R2_BUCKET}/${key}"
  aws s3 cp "$f" "s3://${R2_BUCKET}/${key}" \
    --endpoint-url "${R2_ENDPOINT}" \
    --cache-control "public, max-age=31536000, immutable" \
    --content-type "image/${b##*.}" \
    --acl public-read \
    >/dev/null
done

echo "Done."

