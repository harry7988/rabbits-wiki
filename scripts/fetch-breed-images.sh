#!/usr/bin/env bash
# 从 Wikimedia Commons 下载品种照片到 docs/public/breeds/，并抓取作者/许可元数据。
# 用途：GitHub Actions runner 网络可直连 wikimedia；本地受限网络跑不了就交给 runner。
# 规范：遵守 Wikimedia UA 政策（附带站点与联系方式的自述 UA）；图片直链由文件名 md5 哈希推导。
set -euo pipefail

UA="rabbits-wiki-image-fetch/1.0 (https://www.rabbits.wiki; contact: https://github.com/harry7988)"
OUT_DIR="docs/public/breeds"
mkdir -p "$OUT_DIR"

# breed|首选文件|备选文件  （文件名与 Commons File: 页一致，空格原样）
ENTRIES=(
  "holland-lop|Holland lop rabbit.jpg|Holland Lop.jpg"
  "mini-lop|Mini lop.jpg|Miniature Lop - Side View.jpg"
  "netherland-dwarf|Netherland Dwarf On Brick.jpg|Netherlands dwarf rabbit.jpg"
  "lionhead|Lionhead rabbit Dobby.jpg|Lionhead bunny.jpg"
  "mini-rex|Daisy the Mini Rex Rabbit.jpg|Mini rex bunny.jpg"
  "rex|Lapin rex castor.jpg|45-rex-castor.jpg"
  "angora|EnglishAngoraRabbit.jpg|White Satin Angora Rabbit.jpg"
  "dutch|American Grand Champion Dutch Rabbit.jpg|Dutch rabbit.jpg"
  "hotot|Hotot Rabbit!.jpg|Blanc De Hotot.jpg"
  "flemish-giant|Flemish Giant.jpg|Sandy Flemish Giant.jpg"
)

fetch_one() { # $1=文件名 $2=输出路径 -> 0 成功
  local fn="$1" out="$2"
  local enc="${fn// /_}"
  local h
  h=$(printf '%s' "$enc" | md5sum | cut -d' ' -f1)
  # 文件名内 ! ( ) 等子分隔符在 wikimedia URL 中原样保留，仅空格换下划线
  local url="https://upload.wikimedia.org/wikipedia/commons/thumb/${h:0:1}/${h:0:2}/${enc}/800px-${enc}"
  curl -sfL --max-time 60 -A "$UA" "$url" -o "$out" || return 1
  # 校验：JPEG 魔数 + 体积 > 10KB
  local mime size
  mime=$(file -b --mime-type "$out")
  size=$(stat -c%s "$out" || stat -f%z "$out")
  [ "$mime" = "image/jpeg" ] && [ "$size" -gt 10000 ]
}

fetch_meta() { # $1=文件名 -> 输出 JSON 对象（artist/license/licenseUrl/filePage/origUrl）
  local fn="$1"
  curl -sfL --max-time 60 -A "$UA" -G "https://commons.wikimedia.org/w/api.php" \
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

# 汇总 credits.json
: > /tmp/credits.ndjson
FAIL=""
for entry in "${ENTRIES[@]}"; do
  IFS='|' read -r breed primary fallback <<< "$entry"
  used=""
  for fn in "$primary" "$fallback"; do
    [ -z "$fn" ] && continue
    echo ">> [$breed] 下载 $fn ..."
    if fetch_one "$fn" "$OUT_DIR/${breed}.jpg"; then
      used="$fn"
      break
    fi
    echo "   失败，尝试备选"
  done
  if [ -z "$used" ]; then
    echo "!! [$breed] 两个候选均失败"
    FAIL="$FAIL $breed"
    continue
  fi
  fetch_meta "$used" | jq -c --arg breed "$breed" '. + {breed: $breed}' >> /tmp/credits.ndjson
done

jq -s '.' /tmp/credits.ndjson > "$OUT_DIR/credits.json"
echo "=== 完成。失败品种:${FAIL:-无} ==="
cat "$OUT_DIR/credits.json"
[ -z "$FAIL" ]
