const orderProducts = [
  { id: 1, productName: "Smart Watch", price: 15.15, quantity: 1 },
  { id: 2, productName: "Television", price: 199, quantity: 1 },
  { id: 3, productName: "Mobile Phone", price: 100, quantity: 1 },
];

const form = document.getElementById("checkout-form");
const popover = document.getElementById("pop-over");
const promoInput = document.getElementById("promo-code");
const promoFeedback = document.getElementById("promo-feedback");
let promoApplied = false;

function money(amount) {
  return "$" + amount.toFixed(2);
}

const orderProductsList = document.getElementById("order-products");
for (const product of orderProducts) {
  const row = document.createElement("tr");
  const nameCell = document.createElement("td");
  const quantityCell = document.createElement("td");
  const priceCell = document.createElement("td");

  nameCell.textContent = product.productName;
  quantityCell.textContent = product.quantity;
  priceCell.textContent = money(product.price * product.quantity);

  row.appendChild(nameCell);
  row.appendChild(quantityCell);
  row.appendChild(priceCell);
  orderProductsList.appendChild(row);
}

function calculateSubtotal(list) {
  let subtotal = 0;
  for (const product of list) {
    subtotal += product.price * product.quantity;
  }
  return subtotal;
}

function calculateItemCount() {
  let count = 0;
  for (const product of orderProducts) {
    count += product.quantity;
  }
  return count;
}

function calculateDiscount() {
  let discount = 0;
  if (promoApplied) {
    discount = calculateSubtotal(orderProducts) * 0.1;
    discount = Math.round(discount * 100) / 100;
  }
  return discount;
}

function calculateDeliveryFee() {
  if (document.getElementById("express").checked) {
    return 10;
  }
  return 5;
}

function calculateTotal() {
  const subtotal = calculateSubtotal(orderProducts);
  const discount = calculateDiscount();
  const deliveryFee = calculateDeliveryFee();
  return Math.round((subtotal - discount + deliveryFee) * 100) / 100;
}

function displayTotal() {
  document.getElementById("item-count").textContent = calculateItemCount();
  document.getElementById("sub-total").textContent = money(
    calculateSubtotal(orderProducts),
  );
  document.getElementById("discount").textContent =
    "-" + money(calculateDiscount());
  document.getElementById("delivery-fee").textContent = money(
    calculateDeliveryFee(),
  );
  document.getElementById("total").textContent = money(calculateTotal());
}
document
  .getElementById("shipping_radio")
  .addEventListener("change", displayTotal);

function applyPromo() {
  const code = promoInput.value.trim().toUpperCase();
  if (code === "SAVE10") {
    promoApplied = true;
    promoFeedback.textContent = "SAVE10 applied: 10% off the subtotal.";
  } else {
    promoApplied = false;
    promoFeedback.textContent = "Invalid promo code. Enter SAVE10 for 10% off.";
  }
  displayTotal();
}
document.getElementById("apply-promo").addEventListener("click", applyPromo);

function resetPromo() {
  promoApplied = false;
  promoFeedback.textContent = "";
  displayTotal();
}
promoInput.addEventListener("input", resetPromo);

function displayCardInfo() {
  const cardInfo = document.getElementById("card-info");
  const cardInputs = cardInfo.querySelectorAll("input");

  if (document.getElementById("card").checked) {
    cardInfo.style.display = "block";
    for (const input of cardInputs) {
      input.disabled = false;
    }
  } else {
    cardInfo.style.display = "none";
    for (const input of cardInputs) {
      input.disabled = true;
    }
  }
}
document
  .getElementById("payment_radio")
  .addEventListener("change", displayCardInfo);

function updateExpiryMinimum() {
  const today = new Date();
  const year = today.getFullYear();
  let month = String(today.getMonth() + 1);
  if (month.length === 1) {
    month = "0" + month;
  }
  document.getElementById("card-expiry").min = year + "-" + month;
}
form.addEventListener("focusin", updateExpiryMinimum);

function validateText(event) {
  const input = event.target;
  if (input.value.trim() === "") {
    input.setCustomValidity("Please enter a value, not only spaces.");
  } else {
    input.setCustomValidity("");
  }
}
const textInputs = form.querySelectorAll('input[type="text"][required]');
for (const input of textInputs) {
  input.addEventListener("input", validateText);
}

function submitOrder(event) {
  event.preventDefault();
  updateExpiryMinimum();
  if (form.reportValidity()) {
    placeOrder();
    popover.showPopover();
  }
}
form.addEventListener("submit", submitOrder);

function addReceiptLine(receipt, text) {
  const item = document.createElement("li");
  item.textContent = text;
  receipt.appendChild(item);
}

function placeOrder() {
  popover.replaceChildren();

  const heading = document.createElement("h2");
  heading.id = "confirmation-title";
  heading.textContent = "Order placed successfully!";

  const orderNumber = document.createElement("p");
  orderNumber.textContent = "Order number: " + crypto.randomUUID();

  const receipt = document.createElement("ul");
  addReceiptLine(
    receipt,
    "Name: " + document.getElementById("full-name").value,
  );
  addReceiptLine(receipt, "Email: " + document.getElementById("email").value);
  addReceiptLine(
    receipt,
    "Phone number: " + document.getElementById("phone-number").value,
  );
  addReceiptLine(
    receipt,
    "Country: " + document.getElementById("country").value,
  );
  addReceiptLine(receipt, "City: " + document.getElementById("city").value);
  addReceiptLine(
    receipt,
    "Address: " + document.getElementById("address").value,
  );
  addReceiptLine(
    receipt,
    "Note: " + document.getElementById("additional-info").value,
  );

  for (const product of orderProducts) {
    addReceiptLine(
      receipt,
      product.productName +
        " | Quantity: " +
        product.quantity +
        " | Unit price: " +
        money(product.price) +
        " | Subtotal: " +
        money(product.price * product.quantity),
    );
  }

  addReceiptLine(receipt, "Total items: " + calculateItemCount());
  if (document.getElementById("express").checked) {
    addReceiptLine(receipt, "Shipping: Express Delivery");
  } else {
    addReceiptLine(receipt, "Shipping: Standard Delivery");
  }
  if (document.getElementById("card").checked) {
    addReceiptLine(receipt, "Payment: Credit/Debit Card (simulation)");
  } else {
    addReceiptLine(receipt, "Payment: Cash on Delivery");
  }

  addReceiptLine(
    receipt,
    "Subtotal: " + money(calculateSubtotal(orderProducts)),
  );
  addReceiptLine(receipt, "Discount: -" + money(calculateDiscount()));
  addReceiptLine(receipt, "Delivery fee: " + money(calculateDeliveryFee()));
  addReceiptLine(receipt, "Total: " + money(calculateTotal()));

  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.setAttribute("popovertarget", "pop-over");
  closeButton.setAttribute("popovertargetaction", "hide");
  closeButton.textContent = "Close";
  closeButton.style.marginTop = ".7rem";

  popover.appendChild(heading);
  popover.appendChild(orderNumber);
  popover.appendChild(receipt);
  popover.appendChild(closeButton);
}

updateExpiryMinimum();
displayCardInfo();
displayTotal();
