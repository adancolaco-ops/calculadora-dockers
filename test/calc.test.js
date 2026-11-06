const test = require('node:test'), assert = require('node:assert');
const { calcular, formatar } = require('../public/calc.js');

test('soma', () => assert.strictEqual(calcular(2, '+', 3), 5));
test('subtração', () => assert.strictEqual(calcular(10, '-', 4), 6));
test('multiplicação', () => assert.strictEqual(calcular(6, '*', 7), 42));
test('divisão', () => assert.strictEqual(calcular(9, '/', 3), 3));
test('divisão por zero gera erro', () => assert.throws(() => calcular(1, '/', 0), /zero/));
test('operação inválida gera erro', () => assert.throws(() => calcular(1, '^', 2), /inválida/));
test('0,1 + 0,2 formata como 0,3', () => assert.strictEqual(formatar(calcular(0.1, '+', 0.2)), '0.3'));
