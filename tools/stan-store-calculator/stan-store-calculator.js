// Fee model verified against Stan Help Center articles 83 and 31 on 2026-10-24.
export const STAN_STORE_URL = 'https://stan.store';

// Keep every plan and sale fee used by the calculator in this one source-backed location.
export const FEE_CONFIG = {
  stanCreator: { label: 'Stan Creator', plan: 29, rate: 0.029, flat: 0.30, payoutRate: 0.0025, payoutFlat: 0.25, payoutMinimum: 1 },
  stanCreatorPro: { label: 'Stan Creator Pro', plan: 99, rate: 0.029, flat: 0.30, payoutRate: 0.0025, payoutFlat: 0.25, payoutMinimum: 1 },
  gumroad: { label: 'Gumroad (direct sale)', plan: 0, rate: 0.10, flat: 0.50 },
  stripe: { label: 'Direct Stripe', plan: 0, rate: 0.029, flat: 0.30 }
};

export function calculateOption(price, sales, option) {
  const gross = price * sales;
  const saleFee = (price * option.rate + option.flat) * sales;
  const net = gross - option.plan - saleFee;
  const netPerSale = price - (price * option.rate + option.flat);
  return {
    gross,
    saleFee,
    plan: option.plan,
    totalTake: net,
    net,
    keepPercent: gross ? net / gross * 100 : 0,
    coverPlanSales: option.plan === 0 ? 0 : Math.ceil(option.plan / netPerSale),
    payoutFee: option.payoutRate ? Math.max(option.payoutMinimum, net * option.payoutRate + option.payoutFlat) : null
  };
}

function mountCalculator() {
  const form = document.getElementById('stanCalculatorForm');
  if (!form) return;
  const priceInput = document.getElementById('productPrice');
  const salesInput = document.getElementById('monthlySales');
  const status = document.getElementById('stanCalculatorStatus');
  const results = document.getElementById('stanResults');
  const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
  const money = value => formatter.format(value);

  function calculate(focus) {
    const price = Number(priceInput.value);
    const sales = Number(salesInput.value);
    const valid = Number.isFinite(price) && price > 0 && price <= 100000 && Number.isInteger(sales) && sales > 0 && sales <= 100000;
    priceInput.toggleAttribute('aria-invalid', !(Number.isFinite(price) && price > 0 && price <= 100000));
    salesInput.toggleAttribute('aria-invalid', !(Number.isInteger(sales) && sales > 0 && sales <= 100000));
    if (!valid) {
      status.textContent = 'Enter a product price from $0.01 to $100,000 and whole monthly sales from 1 to 100,000.';
      return false;
    }
    status.textContent = '';
    for (const [key, option] of Object.entries(FEE_CONFIG)) {
      const result = calculateOption(price, sales, option);
      document.getElementById(`${key}Gross`).textContent = money(result.gross);
      document.getElementById(`${key}SaleFees`).textContent = `-${money(result.saleFee)}`;
      document.getElementById(`${key}Plan`).textContent = `-${money(result.plan)}`;
      document.getElementById(`${key}Net`).textContent = money(result.net);
      document.getElementById(`${key}Keep`).textContent = `${result.keepPercent.toFixed(1)}%`;
      document.getElementById(`${key}Cover`).textContent = result.coverPlanSales.toLocaleString('en-US');
      if (result.payoutFee !== null) document.getElementById(`${key}Payout`).textContent = `Estimated one payout: -${money(result.payoutFee)}`;
    }
    if (focus) {
      results.focus();
      if (typeof window.crcTrackEvent === 'function') window.crcTrackEvent('calculator_completed');
    }
    return true;
  }

  form.addEventListener('submit', event => { event.preventDefault(); calculate(true); });
  for (const input of [priceInput, salesInput]) input.addEventListener('input', () => calculate(false));
  calculate(false);
}

if (typeof document !== 'undefined') document.addEventListener('DOMContentLoaded', mountCalculator);
