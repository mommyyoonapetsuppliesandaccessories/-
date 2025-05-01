function filterProducts(category) {
  const allProducts = document.querySelectorAll('.product-card');
  allProducts.forEach((product) => {
    if (category === 'all' || product.classList.contains(category)) {
      product.style.display = 'flex';
    } else {
      product.style.display = 'none';
    }
  });
}

const filterButtons = document.querySelectorAll('.filter-buttons button');

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
  });
});

document.querySelectorAll('.filter-buttons button').forEach(button => {
  button.addEventListener('click', () => {
    const category = button.getAttribute('onclick').match(/'([^']+)'/)[1];
    filterProducts(category);
  });
});

const popup = document.getElementById('popup-notification');
const confirmBtn = document.getElementById('confirm-btn');

function showPopup() {
  popup.classList.remove('hidden');
}

confirmBtn.addEventListener('click', () => {
  popup.classList.add('hidden');
});

const checkoutForm = document.getElementById("checkout-form");
const confirmCheckoutButton = document.getElementById("confirm-checkout");
const requiredInputs = checkoutForm.querySelectorAll("input[required], textarea[required]");

const checkFormValidity = () => {
  let isValid = true;

  requiredInputs.forEach((input) => {
    if (!input.value.trim()) {
      isValid = false;
    }
  });

  confirmCheckoutButton.disabled = !isValid;
};

requiredInputs.forEach((input) => {
  input.addEventListener("input", checkFormValidity);
});

checkFormValidity();

const checkoutInputs = checkoutForm.querySelectorAll('input');
const checkoutModal = document.getElementById('checkout-modal');
const checkoutButton = document.querySelector('.checkOut');
const cancelCheckoutButton = document.getElementById('cancel-checkout');

function showThankYouNotification() {
  checkoutModal.classList.add('hidden');
  const thankYouPopup = document.createElement('div');
  thankYouPopup.classList.add('popup');
  thankYouPopup.innerHTML = `
    <div class="popup-content">
      <p>Your order has been placed, kindly wait for our reply at your phone number. Thank you!</p>
      <button id="close-thank-you">OK</button>
    </div>
  `;
  document.body.appendChild(thankYouPopup);
  const closeThankYouButton = document.getElementById('close-thank-you');
  closeThankYouButton.addEventListener('click', () => {
    thankYouPopup.remove();
  });
}

checkoutForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Disable the confirm button to prevent multiple clicks
  confirmCheckoutButton.disabled = true;

  const formData = new FormData(checkoutForm);

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      showThankYouNotification();
      checkoutForm.reset();
      cart = [];
      renderCart();
    } else {
      console.error('Error: Response not OK', response.statusText);
      alert('There was an issue submitting your order. Please try again.');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred while submitting your order. Please check your internet connection and try again.');
  } finally {
    // Re-enable the confirm button after the process is complete
    confirmCheckoutButton.disabled = false;
  }
});

document.addEventListener('DOMContentLoaded', () => {
  if (!localStorage.getItem('productsNotificationShown')) {
    const notificationPopup = document.createElement('div');
    notificationPopup.classList.add('popup');
    notificationPopup.innerHTML = `
      <div class="popup-content">
        <p>ORDERS ONLY AVAILABLE FOR PICK UP, CURRENTLY NO DELIVERY</p>
        <button id="close-notification">OK</button>
      </div>
    `;
    document.body.appendChild(notificationPopup);
    const closeNotificationButton = document.getElementById('close-notification');
    closeNotificationButton.addEventListener('click', () => {
      notificationPopup.remove();
      localStorage.setItem('productsNotificationShown', 'true');
    });
  }
});

let cart = [];

function renderCart() {
  const cartList = document.querySelector('.listCart');
  const totalPriceElement = document.querySelector('.total-price');

  cartList.innerHTML = '';

  let totalPrice = 0;

  cart.forEach(item => {
    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-item');
    cartItem.innerHTML = `
      <p>${item.name} - ₱${item.price}</p>
      <button class="remove-btn" data-id="${item.id}">Remove</button>
    `;
    cartList.appendChild(cartItem);
    totalPrice += parseFloat(item.price);
  });

  totalPriceElement.textContent = `Total Price: ₱${totalPrice.toFixed(2)}`;

  document.querySelectorAll('.remove-btn').forEach(button => {
    button.addEventListener('click', () => {
      const productId = button.getAttribute('data-id');
      removeFromCart(productId);
    });
  });
}

function addToCart(product) {
  cart.push(product);
  renderCart();
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  renderCart();
}

document.querySelectorAll('.add-to-cart-btn').forEach(button => {
  button.addEventListener('click', () => {
    const productId = button.getAttribute('data-id');
    const productName = button.getAttribute('data-name');
    const productPrice = button.getAttribute('data-price');

    const product = {
      id: productId,
      name: productName,
      price: productPrice,
    };

    addToCart(product);

    alert(`${productName} has been added to the cart!`);
  });
});

function populateCartItems() {
  const cartSummary = document.getElementById('cart-summary');
  const cartItemsField = document.getElementById('cart-items');
  cartSummary.innerHTML = '';
  let cartItemsText = '';

  cart.forEach((item) => {
    const itemInput = document.createElement('input');
    itemInput.type = 'text';
    itemInput.value = `${item.name} - ${item.quantity} x ₱${item.price.toFixed(2)}`;
    itemInput.readOnly = true;
    itemInput.classList.add('cart-item-input');
    cartSummary.appendChild(itemInput);
    cartItemsText += `${item.name} - ${item.quantity} x ₱${item.price.toFixed(2)}\n`;
  });

  cartItemsField.value = cartItemsText;
}

checkoutButton.addEventListener('click', () => {
  populateCartItems();
  checkoutModal.classList.remove('hidden');
});

cancelCheckoutButton.addEventListener('click', () => {
  checkoutModal.classList.add('hidden');
});

document.querySelectorAll('.details-btn').forEach(button => {
  button.addEventListener('click', () => {
    const detailsList = button.parentElement.nextElementSibling;

    if (detailsList.classList.contains('visible')) {
      detailsList.style.height = '0';
      detailsList.classList.remove('visible');
      button.textContent = 'Details';
    } else {
      detailsList.style.height = `${detailsList.scrollHeight}px`;
      detailsList.classList.add('visible');
      button.textContent = 'Hide Details';
    }
  });
});






