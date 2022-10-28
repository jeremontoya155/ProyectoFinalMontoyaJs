class Producto {
  constructor(id, nombreP, marca, precio) {
    this.id = id;
    this.nombreP = nombreP;
    this.marca = marca;
    this.precio = precio;
  }
  compa() {
    return `${this.nombreP}${this.marca}`;
  }
}

//Genero la variable que almacenaran los turnos

let productos = [];

const tabla_productos = document.getElementById("tabla-productos");

let producto_uno = new Producto(1, "Cera", "Gran Bastardo", 700);
let producto_dos = new Producto(2, "Cera", "Mr Blonde", 850);
let producto_tres = new Producto(3, "Texturizador", "Mr Blonde", 1200);
let producto_cuatro = new Producto(4, "Texturizador", "Yilho", 1000);
let producto_cinco = new Producto(5, "Shampoo(bidon)", "Opcion", 1500);
let producto_seis = new Producto(6, "Shampoo(bidon)", "Sulkey", 1900);
let producto_siete = new Producto(7, "Filos", "Gillete", 2700);
let producto_ocho = new Producto(8, "Filos", "ELIOS", 3000);
let producto_nueve = new Producto(9, "Filos", "Super Max", 2450);

//Ejemplo de uso de un reduce y spread
function cargaAuxiliar(arr) {
  arr.forEach((element) => {
    productos.push(element);
  });
}

//Genero la funcion asincronica que va a permitir la carga desde el stock original
//para que si la persona no tiene nada en el localStorage pueda ver cuales son los productos inicialmente disponibles
const auxCargar = async () => {
  const resp = await fetch("../stock.json");
  const data = await resp.json();
  cargaAuxiliar(data);
  cargar_productos();
};

document.addEventListener("DOMContentLoaded", () => {
  inicial();
});

//Genero la funcion inicial para que pueda  hacer el envio hacia documento de manera directa desde
//El localStorage o desde el mismo provedores en caso de ser la primera ocasion que se use

function inicial() {
  if (
    localStorage.getItem("productos") &&
    JSON.parse(localStorage.getItem("productos")).length > 0
  ) {
    let aux = JSON.parse(localStorage.getItem("productos"));

    for (let i = 0; i < aux.length; i++) {
      sumarALista(aux[i], productos, false);
    }
  } else {
    auxCargar();

    localStorage.setItem("productos", JSON.stringify(productos));
  }
}

//Cargar productos es  la encargada de completa el html con el codigo de cada producto
function cargar_productos() {
  tabla_productos.innerHTML = "";
  productos.forEach((element) => {
    //realizo desestructuracion
    const { id, nombreP, marca, precio } = element;
    let contenido = `
            <tr>
                      <th scope="row">${id}</th>
                      <td>${nombreP}</td>
                      <td>${marca}</td>
                      <td>${precio}</td>
                      
                      
             </tr>       


         
      `;
    tabla_productos.innerHTML += contenido;
  });
}

//Definimos la variable del boton que va a permitir cargar los productos
let btn_agregarP = document.getElementById("btn_agregarP");

function sumarALista(prod, productos, ban) {
  //Si el acum es distinto de 1 es que el  producto no estaba cargado
  //No puede ocurrir el error de que el producto sea mayor a 1 debido a que los
  //9 primero productos estan precargados
  let acum = 0;
  productos.forEach((element) => {
    //Aqui no realizo desestructuracion porque tratamos de un solo valor
    if (prod.id === element.id) {
      acum++;
    }
  });
  if (acum !== 1) {
    productos.push(prod);
    cargar_productos();

    //La bandera nos sirve para saber si estamos cargando la pagina por primera vez o si
    //estamos agregando un producto
    //Optimizo con operador ternario
    ban ? cargaDeProducto() : inicioMuestra();
  } else {
    Swal.fire({
      title: "Falla",
      text: "No se puede cargar el producto",
      icon: "warning",
    });
  }
  //Enviamos al localStorage el array nuevo cargado
  localStorage.setItem("productos", JSON.stringify(productos));
}

//Funcion usando el swetalert2 para indicar que empezamos correctamente el programa
function inicioMuestra() {
  Swal.fire({
    title: "Inicio correcto",
    text: "Ya puede cargar  productos",
    icon: "success",
  });
}

//Funcion usando el Tosatify que nos aclara que el producto ya fue cargado
function cargaDeProducto() {
  Toastify({
    //Esto nos indica la posicion el tiempo y el color que tendra nuestra emergente
    text: "Revise el  producto en la tabla",
    className: "info",
    duration: 5000,
    gravity: "bottom",
    position: "center",
    style: {
      background:
        "linear-gradient(to right, rgb(25, 24, 24),rgb(83, 79, 79),rgb(157, 150, 150),rgb(160, 160, 160))",
    },
  }).showToast();
}

btn_agregarP.addEventListener("click", () => {
  let id = document.getElementById("id").value;
  let nombre = document.getElementById("nombre").value;
  let marca = document.getElementById("marca").value;
  let precio = document.getElementById("precio").value;
  let prod = new Producto(id, nombre, marca, precio);

  verificar(prod);
});

//Verificar nos permite ver que no estemos cargando un objeto con valores vacios
function verificar(prod) {
  //realizo desestructuracion
  const { id, nombreP, marca, precio } = prod;
  if (
    //cambie las condiciones para evaluar que los numericos sean mayores a 0
    id > 0 &&
    nombreP != "" &&
    marca != "" &&
    precio > 0
  ) {
    sumarALista(prod, productos, true);
  } else {
    Swal.fire({
      icon: "error",
      title: "Debe completar todos los campos CORRECTAMENTE",
    });
  }
}

//Generales Swal

function muestraProducto(id, nombre, marca, precio) {
  Swal.fire({
    title: "Producto",
    icon: "success",
    text: `
      Id:${id}\n${nombre}\n${marca}\n${precio}\n
      
    `,
  });
}

function noEncontro() {
  Swal.fire({
    title: "No se encontro el producto",
    text: "pruebe cargando nuevamente",
    icon: "error",
  });
}

//La funcion buscar producto nos da el pie para la busqueda de un producto por el nombre
//Siempre se hace referencia a que la persona debe usar el form para poder hacer correctamente la carga
function buscar_producto(nombre_p, marca_p) {
  let aux = `${nombre_p}${marca_p}`;
  let producto = productos.find(
    (p) => `${p.nombreP}${p.marca}`.toLowerCase() === aux.toLowerCase()
  );
  //optimizo con operador ternario
  producto != null
    ? muestraProducto(
        producto.id,
        producto.nombreP,
        producto.marca,
        producto.precio
      )
    : noEncontro();
}

//Añadimos la accion para la busqueda por el nombre
let btn_producto = document.getElementById("btn_producto");

btn_producto.addEventListener("click", () => {
  let n = document.getElementById("nombre").value;
  let m = document.getElementById("marca").value;

  buscar_producto(n, m);
});
