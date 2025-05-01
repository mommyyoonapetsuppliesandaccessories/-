let iconCart = document.querySelector('.icon-cart');
let closeBtn = document.querySelector('.cartTab .close');
let body = document.querySelector('body');

iconCart.addEventListener('click', () => {
    body.classList.toggle('activeTabCart');
});
closeBtn.addEventListener('click', () => {
    body.classList.toggle('activeTabCart');
});

let cart = [];

function addToCart(productId, productName, productPrice, productImage) {
  const existingProduct = cart.find(item => item.id === productId);

  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.push({
      id: productId,
      name: productName,
      price: productPrice,
      image: productImage,
      quantity: 1
    });
  }

  localStorage.setItem('shoppingCart', JSON.stringify(cart));
  updateCartDisplay();
}

function updateCartDisplay() {
  const cartContainer = document.querySelector('.listCart');
  const cartCount = document.querySelector('.icon-cart span');
  const totalPriceElement = document.querySelector('.total-price');
  cartContainer.innerHTML = '';

  let totalPrice = 0;

  cart.forEach(item => {
    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-item');
    cartItem.innerHTML = `
      <div class="cart-item-details">
        <img src="${item.image}" alt="${item.name}" class="cart-item-image" />
        <span class="cart-item-name">${item.name}</span>
        <span class="cart-item-price">Price: ₱${item.price.toFixed(2)}</span>
        <span class="cart-item-quantity">Quantity: ${item.quantity}</span>
      </div>
      <div class="button-group">
        <button class="decrease-btn" data-id="${item.id}">-</button>
        <button class="increase-btn" data-id="${item.id}">+</button>
      </div>
    `;
    cartContainer.appendChild(cartItem);

    totalPrice += item.price * item.quantity;
  });

  cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
  totalPriceElement.textContent = `Total Price: ₱${totalPrice.toFixed(2)}`;

  document.querySelectorAll('.increase-btn').forEach(button => {
    button.addEventListener('click', () => {
      const productId = button.dataset.id;
      increaseQuantity(productId);
    });
  });

  document.querySelectorAll('.decrease-btn').forEach(button => {
    button.addEventListener('click', () => {
      const productId = button.dataset.id;
      decreaseQuantity(productId);
    });
  });

  localStorage.setItem('shoppingCart', JSON.stringify(cart));
  updateCheckoutButtonState();
}

window.addEventListener('load', () => {
  const savedCart = localStorage.getItem('shoppingCart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
    updateCartDisplay();
  }
});

document.querySelectorAll('.add-to-cart-btn').forEach(button => {
  button.replaceWith(button.cloneNode(true));
  const newButton = document.querySelector(`[data-id="${button.dataset.id}"]`);
  newButton.addEventListener('click', () => {
    const productId = newButton.dataset.id;
    const productName = newButton.dataset.name;
    const productPrice = parseFloat(newButton.dataset.price);
    const productImage = newButton.dataset.image;
    addToCart(productId, productName, productPrice, productImage);
  });
});

function decreaseQuantity(productId) {
  const product = cart.find(item => item.id === productId);
  if (product) {
    product.quantity -= 1;
    if (product.quantity === 0) {
      cart = cart.filter(item => item.id !== productId);
    }
    updateCartDisplay();
  }
}

function increaseQuantity(productId) {
  const product = cart.find(item => item.id === productId);
  if (product) {
    product.quantity += 1;
    updateCartDisplay();
  }
}

const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
const popup = document.getElementById('popup-notification');
const confirmBtn = document.getElementById('confirm-btn');

addToCartButtons.forEach(button => {
  button.addEventListener('click', () => {
    showPopup();
  });
});

function showPopup() {
  popup.classList.remove('hidden');
}

confirmBtn.addEventListener('click', () => {
  popup.classList.add('hidden');
});

const checkoutButton = document.querySelector('.checkOut');
const checkoutModal = document.getElementById('checkout-modal');
const cartSummary = document.getElementById('cart-summary');
const cancelCheckoutButton = document.getElementById('cancel-checkout');

function populateCartSummary() {
  const cartSummary = document.getElementById('cart-summary');
  const orderListTextarea = document.getElementById('order-list');
  cartSummary.innerHTML = '';
  let total = 0;
  let orderText = '';

  cart.forEach(item => {
    const productContainer = document.createElement('div');
    productContainer.classList.add('cart-summary-item');
    productContainer.style.marginBottom = '10px';

    const productInput = document.createElement('input');
    productInput.type = 'text';
    productInput.readOnly = true;
    productInput.value = `${item.name} (x${item.quantity}) - ₱${(item.price * item.quantity).toFixed(2)}`;
    productInput.style.width = '100%';
    productInput.style.marginBottom = '5px';
    productContainer.appendChild(productInput);

    cartSummary.appendChild(productContainer);

    orderText += `${item.name} (x${item.quantity}) - ₱${(item.price * item.quantity).toFixed(2)}\n`;

    total += item.price * item.quantity;
  });

  const totalElement = document.createElement('p');
  totalElement.style.fontWeight = 'bold';
  totalElement.textContent = `Total: ₱${total.toFixed(2)}`;
  cartSummary.appendChild(totalElement);

  orderText += `\nTotal: ₱${total.toFixed(2)}`;
  orderListTextarea.value = orderText;
}

checkoutButton.addEventListener('click', () => {
  if (cart.length === 0) {
    alert('Your cart is empty. Please add items to the cart before checking out.');
    return;
  }
  populateCartSummary();
  checkoutModal.classList.remove('hidden');
});

cancelCheckoutButton.addEventListener('click', () => {
  checkoutModal.classList.add('hidden');
});

function updateCheckoutButtonState() {
  if (cart.length === 0) {
    checkoutButton.disabled = true;
    checkoutButton.style.backgroundColor = '#ccc';
    checkoutButton.style.cursor = 'not-allowed';
  } else {
    checkoutButton.disabled = false;
    checkoutButton.style.backgroundColor = '#4caf50';
    checkoutButton.style.cursor = 'pointer';
  }
}

updateCheckoutButtonState();