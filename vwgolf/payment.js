const paymentState = {
  item: null,
  selectedOption: null,
  options: []
};

function getQueryValue(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function getItemsUrl() {
  return new URL('items.json', window.location.href).href;
}

function sanitizeImage(path) {
  return path ? new URL(path, getItemsUrl()).href : '';
}

function showError(message) {
  const error = document.getElementById('formError');
  if (!error) return;
  error.textContent = message;
  error.hidden = false;
}

function hideError() {
  const error = document.getElementById('formError');
  if (!error) return;
  error.hidden = true;
}

function buildPaymentUrl(itemId, optionId) {
  const url = new URL('payment.html', window.location.href);
  url.searchParams.set('item', itemId);
  if (optionId) url.searchParams.set('option', optionId);
  return url.href;
}

function loadProduct() {
  const itemId = getQueryValue('item');
  if (!itemId) {
    showError('Produto não encontrado. Verifique o link e tente novamente.');
    return;
  }

  fetch(getItemsUrl())
    .then(response => {
      if (!response.ok) throw new Error('Não foi possível carregar os produtos.');
      return response.json();
    })
    .then(items => {
      const item = items.find(entry => String(entry.id) === String(itemId));
      if (!item) {
        showError('Produto inválido.');
        return;
      }
      paymentState.item = item;
      paymentState.options = item.select?.options || [];
      renderPaymentPage(item);
    })
    .catch(error => {
      console.error(error);
      showError('Erro ao carregar o produto.');
    });
}

function renderPaymentPage(item) {
  hideError();

  document.getElementById('productName').textContent = item.name || 'Produto sem nome';
  document.getElementById('productDescription').textContent = item.description || 'Descrição não disponível.';
  document.getElementById('productPrice').textContent = item.price || '—';
  document.getElementById('detailTotal').textContent = item.price || '—';

  const imageUrl = sanitizeImage(item.image);
  const imageBlock = document.getElementById('productImage');
  if (imageBlock) {
    imageBlock.style.backgroundImage = imageUrl ? `url('${imageUrl}')` : 'none';
  }

  const optionsGrid = document.getElementById('optionsGrid');
  if (!optionsGrid) return;
  optionsGrid.innerHTML = '';

  if (paymentState.options.length === 0) {
    document.getElementById('optionsSection').style.display = 'none';
    paymentState.selectedOption = null;
    return;
  }

  document.getElementById('optionsSection').style.display = 'block';
  const selectedOptionParam = getQueryValue('option');
  const defaultOption = paymentState.options.find(opt => String(opt.id) === String(selectedOptionParam)) || paymentState.options[0];
  paymentState.selectedOption = defaultOption;

  paymentState.options.forEach(option => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'option-pill' + (option === defaultOption ? ' selected' : '');
    button.textContent = option.name || `Opção ${option.id}`;
    button.addEventListener('click', () => {
      paymentState.selectedOption = option;
      updateOptionSelection();
    });
    optionsGrid.appendChild(button);
  });
}

function updateOptionSelection() {
  const buttons = document.querySelectorAll('.option-pill');
  buttons.forEach((btn, index) => {
    btn.classList.toggle('selected', paymentState.options[index] === paymentState.selectedOption);
  });
}

function validateForm(formData) {
  const required = ['fullName', 'email', 'phone', 'address', 'postal', 'city', 'country'];
  for (const field of required) {
    if (!formData.get(field)?.trim()) {
      return `Preencha o campo ${field}.`;
    }
  }
  return '';
}

function handleSubmit(event) {
  event.preventDefault();
  hideError();

  const form = event.target;
  const formData = new FormData(form);
  const error = validateForm(formData);
  if (error) {
    showError(error);
    return;
  }

  if (!paymentState.item) {
    showError('Produto não carregado.');
    return;
  }

  const buyUrl = paymentState.selectedOption?.url || paymentState.item.buy;
  if (!buyUrl) {
    showError('Link de pagamento não disponível para este produto.');
    return;
  }

  window.location.href = buyUrl;
}

function init() {
  const form = document.getElementById('paymentForm');
  if (form) {
    form.addEventListener('submit', handleSubmit);
  }
  loadProduct();
}

window.addEventListener('DOMContentLoaded', init);
