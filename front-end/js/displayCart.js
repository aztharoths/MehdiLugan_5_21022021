const displayMyCart = document.querySelector("#myCart");
const cart = JSON.parse(localStorage.getItem("savedItem"));
let itemsInCart = 0;
cart.forEach((item) => {
  itemsInCart += item.quantity;
});
if (itemsInCart != 0) {
  displayMyCart.innerHTML = "(" + itemsInCart + ")";
}
