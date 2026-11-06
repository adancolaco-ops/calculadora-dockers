const { calcular, formatar } = Calc;
const SIM = { '+': '+', '-': '−', '*': '×', '/': '÷' };
const TECLAS = [
  ['C', 'limpar', 'fn'], ['⌫', 'apagar', 'fn'], ['%', 'pct', 'fn'], ['÷', '/', 'op'],
  ['7', '7'], ['8', '8'], ['9', '9'], ['×', '*', 'op'],
  ['4', '4'], ['5', '5'], ['6', '6'], ['−', '-', 'op'],
  ['1', '1'], ['2', '2'], ['3', '3'], ['+', '+', 'op'],
  ['0', '0', 'zero'], [',', '.'], ['=', 'igual', 'eq'],
];
const tela = document.getElementById('tela'), expr = document.getElementById('expr');
let atual = '0', anterior = null, op = null, novo = true;

const mostrar = () => {
  tela.textContent = atual.replace('.', ',');
  expr.textContent = anterior !== null ? `${formatar(anterior).replace('.', ',')} ${SIM[op]}` : '';
};
function erro(msg) { atual = 'Erro'; anterior = null; op = null; novo = true; mostrar(); expr.textContent = msg; }
function digito(d) {
  if (novo || atual === '0' || atual === 'Erro') { atual = d; novo = false; }
  else if (atual.length < 14) atual += d;
  mostrar();
}
function ponto() {
  if (novo || atual === 'Erro') { atual = '0.'; novo = false; }
  else if (!atual.includes('.')) atual += '.';
  mostrar();
}
function operador(o) {
  if (atual === 'Erro') return;
  try {
    if (op && !novo) atual = formatar(calcular(anterior, op, atual)); // encadeia: 2 + 3 × ...
    anterior = Number(atual); op = o; novo = true;
  } catch (e) { return erro(e.message); }
  mostrar();
}
function igual() {
  if (!op || atual === 'Erro') return;
  const conta = `${formatar(anterior).replace('.', ',')} ${SIM[op]} ${atual.replace('.', ',')} =`;
  try {
    const r = formatar(calcular(anterior, op, atual));
    anterior = null; op = null; atual = r; novo = true; mostrar(); expr.textContent = conta;
  } catch (e) { erro(e.message); }
}
function limpar() { atual = '0'; anterior = null; op = null; novo = true; mostrar(); }
function apagar() { if (novo) return; atual = atual.length > 1 ? atual.slice(0, -1) : '0'; mostrar(); }
function pct() { if (atual === 'Erro') return; atual = formatar(Number(atual) / 100); novo = true; mostrar(); }

const acao = (v) =>
  v === 'limpar' ? limpar() : v === 'apagar' ? apagar() : v === 'pct' ? pct() : v === 'igual' ? igual()
  : v === '.' ? ponto() : '+-*/'.includes(v) ? operador(v) : digito(v);

const teclas = document.getElementById('teclas');
TECLAS.forEach(([rotulo, valor, classe]) => {
  const b = document.createElement('button');
  b.textContent = rotulo; b.className = classe || ''; b.onclick = () => acao(valor);
  teclas.appendChild(b);
});
document.addEventListener('keydown', (e) => {
  const mapa = { Enter: 'igual', '=': 'igual', ',': '.', Backspace: 'apagar', Escape: 'limpar' };
  const v = mapa[e.key] || (/^[\d+\-*/.]$/.test(e.key) ? e.key : null);
  if (v) { e.preventDefault(); acao(v); }
});
fetch('/health').then((r) => r.json()).then((j) => { document.getElementById('versao').textContent = 'versão ' + j.versao; }).catch(() => {});
