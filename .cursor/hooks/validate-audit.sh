#!/bin/bash
# Hook: valida JSONs canónicos de auditoría tras cada edición con Write tool.
# Sólo actúa sobre archivos dentro de data/claude-audits/ que terminen en .json

input=$(cat)
file_path=$(echo "$input" | python3 -c "
import sys, json
try:
    d = json.load(sys.stdin)
    # El payload de postToolUse/Write tiene 'path' en los params del tool
    path = d.get('path', d.get('file_path', d.get('tool_input', {}).get('path', '')))
    print(path)
except Exception:
    print('')
" 2>/dev/null || echo "")

# Sólo ejecutar para JSONs de auditoría
if [[ "$file_path" =~ data/claude-audits/.*\.json$ ]]; then
  repo_root=$(git rev-parse --show-toplevel 2>/dev/null || pwd)
  cd "$repo_root"

  output=$(bun run validate:claude-audits 2>&1)
  exit_code=$?

  if [ $exit_code -ne 0 ]; then
    echo "{\"additional_context\": \"⚠️ validate:claude-audits FALLÓ — revisa el JSON antes de commitear:\\n$output\"}"
  else
    echo "{\"additional_context\": \"✅ validate:claude-audits OK: $output\"}"
  fi
  exit 0
fi

echo '{}'
exit 0