const orderProducts = [
  {
    id: 1,
    productName: "Smart Watch",
    price: 15.15,
  },
  {
    id: 2,
    productName: "Television",
    price: 199,
  },
  {
    id: 3,
    productName: "Mobile Phone",
    price: 100,
  },
];

const orderProductsList = document.querySelector("#order-products");

for (const orderProduct of orderProducts) {
  const row = document.createElement("tr");
  row.innerHTML = `<td>${orderProduct.productName}</td>
              <td>${(orderProduct.quantity = 1)}</td>
              <td>$${orderProduct.price.toFixed(2)}</td>`;
  orderProductsList.appendChild(row);
}
