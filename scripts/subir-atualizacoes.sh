#!/usr/bin/env bash
# Uso: ./scripts/subir-atualizacoes.sh [versao1 versao2 ...]   (padrão: 1.1.0 1.2.0)
# Cada versão vira um commit + push, e cada push dispara uma execução do GitHub Actions.
set -e
git rev-parse --git-dir >/dev/null 2>&1 || { echo "Execute dentro do repositório git."; exit 1; }
VERSOES=("$@"); [ ${#VERSOES[@]} -eq 0 ] && VERSOES=(1.1.0 1.2.0)
for V in "${VERSOES[@]}"; do
  echo "$V" > VERSION
  printf '\n## %s (%s)\n- Atualização publicada pelo pipeline\n' "$V" "$(date +%F)" >> CHANGELOG.md
  git add -A && git commit -m "release: v$V" && git push origin HEAD
  echo "v$V enviada. Aguardando 60s para a próxima execução ficar separada..."; sleep 60
done
