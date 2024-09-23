const socket = io();

let products = [];
socket.on("productsActualizados", (updatedProducts) => {
  products = updatedProducts; // Actualiza el array local con los productos actualizados
  renderProductList();
});

function renderProductList() {
  const productList = document.getElementById("product-list");
  productList.innerHTML = ""; // Limpia la lista actual
  products.forEach((product) => {
    productList.innerHTML += `
      <li>
        <h2>Nombre: ${product.name}</h2> <br>
        <h2>Descripción: ${product.description}</h2> <br>
        <h2>Código: ${product.code}</h2> <br>
        <h2>Precio: ${product.price}</h2> <br>
        <h2>Stock: ${product.stock}</h2> <br>
        <h2>Categoría: ${product.category}</h2> <br>
      </li>
      <hr>
    `;
  });
}

const agregar = document.getElementById("agregar");
agregar.addEventListener("click", () => {
  Swal.fire({
    title: "Realizado",
    text: "Has agregado un producto",
    icon: "success",
  });
  const newProduct = {
    name: "Nuevo Producto",
    description: "Descripción del nuevo producto",
    code: "COD123",
    price: 100,
    stock: 10,
    category: "General",
  };
  socket.emit("nuevoProducto", newProduct);
});

const eliminar = document.getElementById("eliminar");
eliminar.addEventListener("click", () => {
  Swal.fire({
    title: "Eliminar producto",
    input: "text",
    text: "Escribe el nombre del producto que deseas eliminar",
    inputValidator: (value) => {
      return !value && "Tienes que escribir el nombre de un producto";
    },
    allowOutsideClick: false,
  }).then((result) => {
    if (result) {
      const productName = result.value;
      socket.emit("eliminarProducto", productName);
    }
  });
});
socket.on("productoEliminado", (productName) => {
  products = products.filter((product) => product.name !== productName); // Elimina el producto del array
  renderProductList();
  Swal.fire({
    title: "Producto eliminado",
    text: "Has eliminado el producto",
    icon: "success",
  });
});
socket.on("productoNoEncontrado", (productName) => {
  Swal.fire({
    title: "Error",
    text: `El producto "${productName}" no fue encontrado`,
    icon: "error",
  });
});
