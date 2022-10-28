//Funcion generada para que podamos cambiar de manera directa y que se pueda aplicar en todas
let carrito = [];

//revisamos primero que el carrito este cargado
//caso contrario doy mensaje para indicar a la persona que empieze a comprar
function verificar_carrito(carro) {
  if (localStorage.getItem("carrito")) {
    let auxCarro = JSON.parse(localStorage.getItem("carrito"));
    auxCarro.forEach((element) => {
      carro.push(element);
    });
  } else {
    Swal.fire({
      icon: "success",
      text: "Para comprar o eliminar seleccione sobre los botones, para revisar el carrito haga click el carrito verde y confime",
      title: "Empiece a comprar",
    });
  }
}

let btn_confirmar = document.getElementById("boton_confirmar");
//Aviso del mail completo con la compra
btn_confirmar.addEventListener("click", () => {
  Swal.fire({
    icon: "success",
    title: "Se confirma la venta",
    timer: 3000,
  });
});

let total = 0;
function cargarCarrito(carro) {
  let rellenarCarro = document.getElementById("cuerpo_tabla");
  let precioFinal = document.getElementById("subtitulo");
  let total = 0;

  rellenarCarro.innerHTML = "";
  carro.forEach((p) => {
    const { id, nombreP, marca, precio } = p;
    rellenarCarro.innerHTML += `
      <tr>
      <th scope="row">${id}</th>
      <td>${nombreP}</td>
      <td>${marca}</td>
      <td>$${precio}</td>
      
      <tr>
      `;

    total += precio;
  });
  precioFinal.innerText = `Total:$${total}`;
}

//Iniciamos todo desde el DOM
function comenzar() {
  verificar_carrito(carrito);

  cargarCarrito(carrito);
}

//Iniciamos la  accion dejando solo un metodo para que empieze en el DOM

document.addEventListener("DOMContentLoaded", () => {
  comenzar();
});
