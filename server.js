const http = require('http'), fs = require('fs'), path = require('path');
const PORT = process.env.PORT || 3000, DIR = path.join(__dirname, 'public');
const TIPOS = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript' };
const versao = () => { try { return fs.readFileSync(path.join(__dirname, 'VERSION'), 'utf8').trim(); } catch { return '0.0.0'; } };

http.createServer((req, res) => {
  const url = req.url.split('?')[0];
  if (url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ status: 'ok', versao: versao() }));
  }
  const arquivo = path.join(DIR, url === '/' ? 'index.html' : path.normalize(url));
  if (!arquivo.startsWith(DIR)) { res.writeHead(403); return res.end('Proibido'); }
  fs.readFile(arquivo, (err, dados) => {
    if (err) { res.writeHead(404); return res.end('Não encontrado'); }
    res.writeHead(200, { 'Content-Type': TIPOS[path.extname(arquivo)] || 'application/octet-stream' });
    res.end(dados);
  });
}).listen(PORT, '0.0.0.0', () => console.log(`Calculadora em http://localhost:${PORT}`));
