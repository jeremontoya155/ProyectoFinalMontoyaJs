//Definimos los retornos constantes
const completar = document.getElementById("completar_tarjetas");
//Defino la clase que va a tener el retorno correspondiente
class Producto {
  constructor(id, nombreP, marca, precio, imagen) {
    this.id = id;
    this.nombreP = nombreP;
    this.marca = marca;
    this.precio = precio;
    this.imagen = imagen;
  }
  compa() {
    return `${this.nombreP}${this.marca}`;
  }
  muestreo() {
    Swal.fire({
      title: "Producto",
      text: `${this.id}
          ${this.nombreP}
          ${this.marca}
          ${this.precio}`,
    });
  }
}

let carrito = [];
let productos = [];

document.addEventListener("DOMContentLoaded", () => {
  //Cargar mediante un fetch
  cargar();
});

//Funcion que usamos al iniciar la pagina para cargar un carrito de compras a partir del stock en el json
const retornarStock = async () => {
  const resp = await fetch("../stock.json");
  const data = await resp.json();
  cargarTarjetas(data);
};

function cargarTarjetas(arr) {
  arr.forEach((p) => {
    //Aprovecho la desestructuracion para ahorrar codigo
    const { imagen, nombreP, marca, precio, id } = p;
    let tarjetas = document.createElement("div");
    tarjetas.className = "col-12 mb-2 col-md-4 ";
    tarjetas.innerHTML = ` <div class="card border-secondary card-border-radius centrar">
        <div class="card-body centrar ">
          <img src="${imagen}" alt="${nombreP}" class="card-img-top ajustar " />
          
          <h5 >${nombreP}</h5>
          <h6>${marca}</h6>
          <p>$${precio}</p>
          
          <button class="btn btn-dark btn_compra" id="btnC${id}">Comprar</button>
          <button class="btn btn-danger btn_compra" id="btnE${id}">Eliminar</button>
        </div>
      </div>
      `;
    completar.append(tarjetas);

    let btnEliminar = document.getElementById(`btnE${id}`);
    let btnComprar = document.getElementById(`btnC${id}`);

    btnEliminar.addEventListener("click", () => {
      let valor = carrito.findIndex((element) => element.id == id);
      if (valor != -1) {
        carrito.splice(valor, 1);
        cargarCarrito(carrito);
        localStorage.setItem("carrito", JSON.stringify(carrito));
        eliminarCompra();
      }
    });
    btnComprar.addEventListener("click", () => {
      let auxAgregar = new Producto(id, nombreP, marca, precio, imagen);
      carrito.push(auxAgregar);
      localStorage.setItem("carrito", JSON.stringify(carrito));
      cargarCarrito(carrito);
      agregarCompra();
    });
  });
}

function cargar() {
  verificar_carrito(carrito);

  cargarCarrito(carrito);

  retornarStock();
}

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

//Toastify de aviso para la carga y eliminacion de productos
function agregarCompra() {
  Toastify({
    //Esto nos indica la posicion el tiempo y el color que tendra nuestra emergente
    text: "Compro el producto seleccionado",
    className: "info",
    duration: 2000,
    gravity: "bottom",
    position: "center",
    style: {
      background:
        "linear-gradient(to right, rgb(25, 24, 24),rgb(83, 79, 79),rgb(157, 150, 150),rgb(160, 160, 160))",
    },
  }).showToast();
}
function eliminarCompra() {
  Toastify({
    text: "Eliminamos el producto seleccionado",
    className: "info",
    duration: 2000,
    gravity: "bottom",
    position: "center",
    style: {
      background: ` linear-gradient(
          to right,
          rgb(13, 209, 29),
          rgb(16, 185, 49),
          rgb(19, 140, 69),
          rgb(25, 100, 80)
        );`,
    },
  }).showToast();
}

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
