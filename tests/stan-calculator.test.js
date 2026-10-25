import assert from 'node:assert/strict';
import test from 'node:test';
import { FEE_CONFIG, STAN_STORE_URL, calculateOption } from '../tools/stan-store-calculator/stan-store-calculator.js';

test('Stan Creator monthly oracle is exact for $47 x 20', () => {
  const result = calculateOption(47, 20, FEE_CONFIG.stanCreator);
  assert.equal(result.gross, 940);
  assert.equal(result.saleFee, 33.26);
  assert.equal(result.net, 877.74);
  assert.equal(result.keepPercent.toFixed(1), '93.4');
  assert.equal(result.coverPlanSales, 1);
});

test('Stan Creator Pro monthly oracle is exact for $47 x 20', () => {
  const result = calculateOption(47, 20, FEE_CONFIG.stanCreatorPro);
  assert.equal(result.net, 807.74);
  assert.equal(result.coverPlanSales, 3);
});

test('Stan per-sale Stripe processing oracle is exact', () => {
  for (const [price, expected] of [[19, 0.85], [29, 1.14], [97, 3.11]]) {
    assert.equal(Number(calculateOption(price, 1, FEE_CONFIG.stanCreator).saleFee.toFixed(2)), expected);
  }
});

test('Stan direct link has no referral path or parameter', () => {
  assert.equal(STAN_STORE_URL, 'https://stan.store');
});
