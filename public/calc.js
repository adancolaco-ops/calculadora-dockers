// Lógica da calculadora. Usada no navegador (window.Calc) e nos testes (require).
(function (root) {
  function calcular(a, op, b) {
    a = Number(a); b = Number(b);
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '*': return a * b;
      case '/':
        if (b === 0) throw new Error('Divisão por zero');
        return a / b;
      default: throw new Error('Operação inválida');
    }
  }
  // Evita 0.1 + 0.2 = 0.30000000000000004
  const formatar = (n) => String(Number(Number(n).toPrecision(12)));
  const api = { calcular, formatar };
  if (typeof module !== 'undefined') module.exports = api; else root.Calc = api;
})(this);
