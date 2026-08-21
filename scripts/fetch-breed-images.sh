#!/usr/bin/env bash
# 从 Wikimedia Commons 下载品种照片到 docs/public/breeds/，并抓取作者/许可元数据。
# 用途：GitHub Actions runner 网络可直连 wikimedia；本地受限网络跑不了就交给 runner。
# 规范：遵守 Wikimedia UA 政策（附带站点与联系方式的自述 UA）；图片直链由文件名 md5 哈希推导。
# 本脚本刻意不因单文件失败而中断：结果写入 fetch-log.txt 供人工核查。
set -uo pipefail

UA="rabbits-wiki-image-fetch/1.0 (https://www.rabbits.wiki; contact: https://github.com/harry7988)"
OUT_DIR="docs/public/breeds"
LOG="$OUT_DIR/fetch-log.txt"
mkdir -p "$OUT_DIR"
: > "$LOG"

log() { echo "$*" | tee -a "$LOG"; }

# breed|首选文件|备选文件  （文件名与 Commons File: 页一致，空格原样）
ENTRIES=(
  "holland-lop|Holland lop rabbit.jpg|Holland Lop.jpg"
  "mini-lop|Mini lop.jpg|Miniature Lop - Side View.jpg"
  "netherland-dwarf|Netherland Dwarf On Brick.jpg|Netherlands dwarf rabbit.jpg"
  "lionhead|Lionhead rabbit Dobby.jpg|Lionhead bunny.jpg"
  "mini-rex|Mini rex bunny.jpg|Daisy the Mini Rex Rabbit.jpg"
  "rex|Lapin rex castor.jpg|45-rex-castor.jpg"
  "angora|Angora rabbit.jpg|EnglishAngoraRabbit.jpg"
  "dutch|American Grand Champion Dutch Rabbit.jpg|Dutch rabbit.jpg"
  "hotot|Blanc De Hotot.jpg|Blanc De Hotot Rabbit.jpg"
  "flemish-giant|Sandy Flemish Giant.jpg|A white Flemish Giant rabbit.jpg"
)

fetch_one() { # $1=文件名 $2=输出路径 -> 0 成功
  local fn="$1" out="$2"
  local enc="${fn// /_}"
  local h
  h=$(printf '%s' "$enc" | md5sum | cut -d' ' -f1)
  # 文件名内 ! ( ) 等子分隔符在 wikimedia URL 中原样保留，仅空格换下划线
  # 缩略图宽度必须是 Wikimedia 档位（20/40/60/120/250/330/500/960/1280/…），否则 400
  local url="https://upload.wikimedia.org/wikipedia/commons/thumb/${h:0:1}/${h:0:2}/${enc}/960px-${enc}"
  log "  GET $url"
  curl -sSL --max-time 60 -A "$UA" -w "  HTTP %{http_code} %{size_download}B\n" -o "$out" "$url" | tee -a "$LOG" || return 1
  local mime size
  mime=$(file -b --mime-type "$out" 2>/dev/null || echo "?")
  size=$(stat -c%s "$out" 2>/dev/null || echo 0)
  log "  mime=$mime size=$size"
  [ "$mime" = "image/jpeg" ] && [ "$size" -gt 10000 ]
}

fetch_meta() { # $1=文件名 -> 输出 JSON 对象
  local fn="$1"
  curl -sS --max-time 60 -A "$UA" -G "https://commons.wikimedia.org/w/api.php" \
    --data-urlencode "action=query" \
    --data-urlencode "format=json" \
    --data-urlencode "prop=imageinfo" \
    --data-urlencode "iiprop=extmetadata|url" \
    --data-urlencode "titles=File:${fn}" \
  | jq -c '.query.pages | to_entries | .[0].value.imageinfo[0]' \
    | jq -c --arg fn "$fn" '{
        file: $fn,
        filePage: ("https://commons.wikimedia.org/wiki/File:" + ($fn | gsub(" "; "_"))),
        artist: (.extmetadata.Artist.value // "?" | gsub("<[^>]*>"; "") | gsub("[\\t\\r\\n]+"; " ") | gsub("^ +| +$"; "")),
        license: (.extmetadata.LicenseShortName.value // "?"),
        licenseUrl: (.extmetadata.LicenseUrl.value // ""),
        credit: (.extmetadata.Credit.value // "" | gsub("<[^>]*>"; "") | gsub("[\\t\\r\\n]+"; " ") | gsub("^ +| +$"; "")),
        origUrl: .url
      }'
}

: > /tmp/credits.ndjson
FAIL=""
for entry in "${ENTRIES[@]}"; do
  IFS='|' read -r breed primary fallback <<< "$entry"
  used=""
  for fn in "$primary" "$fallback"; do
    [ -z "$fn" ] && continue
    log ">> [$breed] 下载 $fn"
    if fetch_one "$fn" "$OUT_DIR/${breed}.jpg"; then
      used="$fn"
      break
    fi
    log "   失败，尝试备选"
  done
  if [ -z "$used" ]; then
    log "!! [$breed] 两个候选均失败"
    FAIL="$FAIL $breed"
    continue
  fi
  if meta=$(fetch_meta "$used"); then
    printf '%s\n' "$meta" | jq -c --arg breed "$breed" '. + {breed: $breed}' >> /tmp/credits.ndjson
    log "   元数据 OK"
  else
    log "!! [$breed] 元数据抓取失败"
    FAIL="$FAIL $breed(meta)"
  fi
done

jq -s '.' /tmp/credits.ndjson > "$OUT_DIR/credits.json"
log "=== 完成。失败:${FAIL:-无} ==="

# 有失败也退出 0：日志与部分成果要提交回来；失败信息在 fetch-log.txt 里看
exit 0
