const PRICES = {
  basic:   500,
  pro:     800,
  premium: 1200,
};

const OPTION_PRICES = {
  none:    0,
  express: 200,
  gift:    150,
};

const PROPERTY_PRICE = 300;

const qtyInput      = document.getElementById('qty');
const serviceRadios = document.querySelectorAll('input[name="service"]');
const optionRow     = document.getElementById('optionRow');
const optionSelect  = document.getElementById('option');
const propertyRow   = document.getElementById('propertyRow');
const propertyCheck = document.getElementById('property');
const totalEl       = document.getElementById('total');

function getServiceType() {
  for (const r of serviceRadios) {
    if (r.checked) return r.value;
  }
  return 'basic';
}

function updateVisibility(type) {
  optionRow.classList.toggle('hidden', type !== 'pro');
  propertyRow.classList.toggle('hidden', type !== 'premium');
}

function sanitizeQty() {
  let value = qtyInput.value.replace(/\D/g, '');
  if (value === '' || value === '0') value = '1';
  qtyInput.value = value;
}

function recalc() {
  const type = getServiceType();
  const qty  = Math.max(1, parseInt(qtyInput.value, 10) || 1);

  let unitPrice = PRICES[type] ?? 0;

  if (type === 'pro') {
    unitPrice += OPTION_PRICES[optionSelect.value] ?? 0;
  }

  if (type === 'premium' && propertyCheck.checked) {
    unitPrice += PROPERTY_PRICE;
  }

  const total = unitPrice * qty;
  totalEl.textContent = total.toLocaleString('ru-RU') + ' ₽';
}

qtyInput.addEventListener('keydown', (e) => {
  if (['-', '+', 'e', 'E', '.', ','].includes(e.key)) {
    e.preventDefault();
  }
});

qtyInput.addEventListener('input', () => {
  sanitizeQty();
  recalc();
});

qtyInput.addEventListener('paste', (e) => {
  const text = (e.clipboardData || window.clipboardData).getData('text');
  if (!/^\d+$/.test(text.trim())) {
    e.preventDefault();
  }
});

serviceRadios.forEach(r => {
  r.addEventListener('change', () => {
    updateVisibility(getServiceType());
    recalc();
  });
});

optionSelect.addEventListener('change', recalc);
propertyCheck.addEventListener('change', recalc);

sanitizeQty();
updateVisibility(getServiceType());
recalc();