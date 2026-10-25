import test from "node:test";
import assert from "node:assert/strict";

const platformRate = 0.10;
const processingRate = 0.029;
const processingFlat = 0.30;
const net = (price) => price - (price * platformRate) - ((price * processingRate) + processingFlat);
const fees = (price) => price * platformRate + (price * processingRate) + processingFlat;
const equalMoney = (actual, expected) => assert.equal(Math.round(actual * 1000) / 1000, expected);

test("Patreon sprint worked dollar figures reproduce from the stated Standard US PayPal assumptions", () => {
  equalMoney(fees(5), 0.945);
  equalMoney(net(5), 4.055);
  equalMoney(fees(10), 1.59);
  equalMoney(net(10), 8.41);
  equalMoney(fees(25), 3.525);
  equalMoney(net(25), 21.475);
  assert.equal(Math.ceil(1000 / net(5)), 247);
  assert.equal(Math.ceil(3000 / net(5)), 740);
  assert.equal(Math.ceil(5000 / net(5)), 1234);
  assert.equal(Math.ceil(1000 / net(10)), 119);
  assert.equal(Math.ceil(3000 / net(10)), 357);
  assert.equal(Math.ceil(5000 / net(10)), 595);
  assert.equal(Math.ceil(1000 / net(25)), 47);
  assert.equal(Math.ceil(3000 / net(25)), 140);
  assert.equal(Math.ceil(5000 / net(25)), 233);
  assert.equal(50 * fees(10), 79.5);
  assert.equal(500 - (50 * fees(10)), 420.5);
  assert.equal(200 * fees(10), 318);
  assert.equal(2000 - (200 * fees(10)), 1682);
  assert.equal(1000 - 100 - 35 - 2.5 - 10 - 25, 827.5);
});
