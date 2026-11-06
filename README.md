# Calculadora com Docker e GitHub Actions

Calculadora web simples (sem dependências). A cada `git push` na branch `main`, o GitHub roda os testes, constrói a imagem Docker e publica no GitHub Container Registry (e no Docker Hub, se você configurar).

## O que tem no projeto

| Arquivo | Para que serve |
|---|---|
| `server.js` | Servidor Node que entrega o site e a rota `/health` |
| `public/` | A calculadora (`calc.js` tem a lógica, `app.js` a tela) |
| `test/calc.test.js` | 7 testes automáticos da lógica |
| `Dockerfile` | Receita da imagem Docker |
| `.github/workflows/docker.yml` | Pipeline: testa, constrói e publica a imagem |
| `VERSION` | Versão atual (aparece no rodapé da calculadora e vira tag da imagem) |
| `scripts/subir-atualizacoes.sh` | Faz as próximas versões (v1.1.0, v1.2.0...) |

## Passo 1. Instalar o que precisa
- **Node.js 20+** (para rodar sem Docker): `node --version`
- **Git**: `git --version`
- **Docker Desktop**: abra e espere ficar "running". Depois `docker --version`
- Conta no **GitHub** e, se quiser, no **Docker Hub**

Extraia a pasta e abra um terminal dentro dela (no Windows, use o Git Bash).

## Passo 2. Rodar sem Docker
```bash
npm test      # deve mostrar "pass 7"
npm start     # abre em http://localhost:3000
```
Não precisa de `npm install`, o projeto não usa bibliotecas.

## Passo 3. Rodar com Docker
```bash
docker build -t calculadora .
docker run -p 3000:3000 calculadora
```
Abra `http://localhost:3000`. Para parar, Ctrl+C. Se a porta 3000 estiver ocupada, use `-p 3001:3000` e abra a 3001.

Comandos úteis: `docker ps` (lista contêineres), `docker logs ID` (mostra erros), `docker stop ID` (para).

## Passo 4. Criar o repositório no GitHub
1. Em github.com, clique em **New repository** e dê um nome (ex.: `calculadora`).
2. Deixe **sem** README, `.gitignore` e licença.
3. Clique em **Create repository** e copie a URL.
4. Na primeira vez neste computador:
```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu-email@exemplo.com"
```

## Passo 5. Liberar o Actions a publicar
No repositório: **Settings → Actions → General → Workflow permissions → Read and write permissions → Save**.

## Passo 6. Enviar o projeto (execução 1)
```bash
git init -b main
git add .
git commit -m "release: v1.0.0"
git remote add origin https://github.com/SEU_USUARIO/SEU_REPO.git
git push -u origin main
```
O GitHub não aceita mais senha comum. Se pedir login, entre pelo navegador (no Windows abre sozinho) ou use um token em **Settings → Developer settings → Personal access tokens**.

Abra a aba **Actions**. O workflow "CI/CD Docker" tem dois blocos: `testar` e `imagem`. Quando os dois ficarem verdes, a imagem foi publicada.

## Passo 7. Publicar também no Docker Hub (opcional)
1. No Docker Hub: **Account settings → Personal access tokens → Generate new token** com permissão **Read & Write**. Copie o token na hora.
2. No GitHub: **Settings → Secrets and variables → Actions → New repository secret**.
3. Crie `DOCKERHUB_USERNAME` (seu usuário) e `DOCKERHUB_TOKEN` (o token).

No próximo push, a imagem também vai para `seu-usuario/nome-do-repositorio` no Docker Hub, criado automaticamente.

## Passo 8. Fazer as atualizações (execuções 2 e 3)
```bash
./scripts/subir-atualizacoes.sh
```
O script cria a v1.1.0 e a v1.2.0, cada uma com commit e push, esperando 60 segundos entre elas. Para escolher as versões: `./scripts/subir-atualizacoes.sh 2.0.0 2.1.0`.

Sem o script, faça à mão para cada versão:
```bash
echo 1.1.0 > VERSION
git add -A
git commit -m "release: v1.1.0"
git push
```
Para reexecutar sem novo commit: **Actions → CI/CD Docker → Run workflow**.

## Passo 9. Rodar a imagem publicada
- **Docker Hub**: `docker run -p 3000:3000 seu-usuario/nome-do-repositorio:latest`
- **GitHub (ghcr.io)**: `docker run -p 3000:3000 ghcr.io/seu-usuario/seu-repo:latest`, tudo em minúsculas. A imagem nasce privada. Para liberar, abra o pacote em **Packages** (lateral do repositório) e vá em **Package settings → Danger Zone → Change visibility → Public**.

A versão aparece no rodapé da calculadora: depois de cada atualização, a imagem nova mostra o número novo.

## Se algo falhar

| Erro | O que fazer |
|---|---|
| `permission_denied: write_package` | Refaça o Passo 5. Se continuar, no pacote vá em **Package settings → Manage Actions access**, adicione o repositório com papel **Write** e reexecute. |
| `unauthorized` no Docker Hub | Confira os nomes dos secrets e se o token é **Read & Write**. |
| `git push` rejeitado (`non-fast-forward`) | O repositório foi criado com README. Rode `git pull origin main --rebase` e envie de novo. |
| Job `testar` vermelho | Abra a execução na aba Actions e leia o log do passo que falhou. |
| Build verde, mas o site não abre | A porta do `-p` precisa bater com a do contêiner (3000). |
| Contêiner abre e fecha | Rode `docker logs ID` para ver o erro. |
| `./scripts/subir-atualizacoes.sh` não roda | Use o Git Bash. PowerShell e CMD não executam esse script. |
| `docker: command not found` ou erro de daemon | Abra o Docker Desktop e espere ele iniciar. |
