//Constructors para las clases utilizadas
//const Swal = require("sweetalert2");
//Probe con la instruccion tanto el import y el require ambas me daban el mismo error
//En proxima entrega dejo desglose con module de cualquier forma con el live server puede verse
//el uso del Swal asi como tambien una vez que hace el deplor el github
class Turno {
  constructor(dia, nombre, horario) {
    this.dia = dia;
    this.nombre = nombre;
    this.horario = horario;
  }

  comp() {
    return `${this.dia}${this.horario}`;
  }
}

//Variables iniciales que van a ser usadas para carga o como banderas
let turnos = [];
let aux;

document.addEventListener("DOMContentLoaded", () => {
  inicial();
});

function inicial() {
  //Comprobamos que si ya tenemos algun turno cargado
  if (localStorage.getItem("Turnos")) {
    aux = JSON.parse(localStorage.getItem("Turnos"));

    //realizamos la carga de manera que pueda verse reflejado en la tabla para el usuario si es que ya cargase algun turno
    for (let i = 0; i < aux.length; i++) {
      auxCarga(aux[i], false);
    }
  }
}

//Carga de los turnos de manera dinamica
function cargarTurnos() {
  let nombre = document.getElementById("nombre");
  let dia = document.getElementById("dia");
  let hora = document.getElementById("hora");

  let turn;
  if (nombre.value != "" && dia.value != "" && hora.value != "") {
    turn = new Turno(dia.value, nombre.value, hora.value);
  } else {
    //Caso expecional para verificar que la persona no cargue un turno vacio
    turn = new Turno("nan", "nan", "nan");
  }
  return turn;
}

function agregar_tabla(turno) {
  //funcion para modificar el html
  let espacio = document.getElementById("agregar_contenido");
  //realizo desestructuracion
  const { dia, horario, nombre } = turno;
  let agregado = `<tr id="${dia}-${horario}">
      <td >${nombre}</td>
      <td>${dia}</td>
      <td>${horario}</td>
      </tr>`;
  espacio.innerHTML += agregado;
}

let auxInicial = 0;

//funcion principal que  hace llamada del agregado a la tabla y termina de evaluar si el turno recibido es o no nulo
function auxCarga(turno, banAux) {
  let ban = true;
  //Realizo desestructuracion de las variables que ingresa
  const { dia, horario, nombre } = turno;
  let comparador = `${dia}${horario}`;
  for (let t of turnos) {
    let comparadorAux = `${t.dia}${t.horario}`;
    //agregue la condicion aqui para evitar que la persona ingrese sin nombre
    //ni con ningun espacio en blanco
    //tambien solucionado el aviso para el caso de que una persona tenga este error no deja cargar
    if (
      comparadorAux == comparador ||
      nombre == "nan" ||
      dia == "nan" ||
      horario == "nan"
    ) {
      ban = false;
    }
  }

  if (ban) {
    turnos.push(turno);

    localStorage.setItem("Turnos", JSON.stringify(turnos));
    agregar_tabla(turno);
    auxInicial++;

    //Optimizo con operador ternario
    if (auxInicial >= turnos.length) {
      banAux ? confirmo() : confirmoInicio();
    }
  } else {
    let condicion = nombre == "nan";
    //Deje condicion para verificar si el turno no se cargo por estar ocupado o porque hizo un ingreso vacio
    condicion ? auxEliminar() : ocupado();
  }
}

//botones con muestras para el usuario en caso de confirmacion o de ocupacion
let btnCarga = document.getElementById("btn_cargar");
function confirmoInicio() {
  //Cambio el swal del inicio por un toastify para hacerlo mas sutil
  Swal.fire({
    title: "Inicio cargue su turno",
    text: "Recuerde completar todos los campos",
    icon: "success",
  });
}

//Funcion para avisar la confirmacion de turno usando Toastify
function confirmo() {
  Toastify({
    text: "Revise el turno en la tabla",
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

/*Aqui se presentan en el codigo las opciones que usamos para los distintos casos con la libreria del swetalert2*/

//Caso de que el turno ya este ocupado
function ocupado() {
  Swal.fire({
    title: "Aviso",
    text: "Turno ocupado o realizo cancelacion",
    icon: "warning",
  });
}

function noAsignado() {
  Swal.fire({
    title: "Aviso",
    text: "No hay reserva de turno",
    icon: "error",
  });
}

function auxEliminar() {
  Swal.fire({
    title: "Error",
    text: "Caso fallido",
    icon: "error",
  });
}

//agregamos la accion para cuando estemos presionando sobre el agregar turnos
btnCarga.addEventListener("click", () => {
  let turno = cargarTurnos();
  auxCarga(turno, true);
});

//Funcion que nos permite encontrar un nombre que traemos desde el form
function buscar(nom) {
  let resultado = turnos.find((tur) => tur.nombre === nom);
  return resultado;
}

//Buscamos el boton que da pie a la accion de una busqueda por nombre
let busqueda_nombre = document.getElementById("btn_nombre");

//auxiliar que permite dar una salida por swetalert2 a los campos del turno
function avisoNombre(valor, valorDos, valorTres) {
  Swal.fire({
    title: "Turno",
    text: `La persona:
    ${valor}
    tiene el siguiente turno 
    Dia:${valorDos}
    Hora:${valorTres}`,
    icon: "success",
  });
}

//agregamos al boton las acciones creadas
busqueda_nombre.addEventListener("click", () => {
  let n = document.getElementById("nombre");

  let devolucion = buscar(n.value);
  const { nombre, dia, horario } = devolucion;

  devolucion != null ? avisoNombre(nombre, dia, horario) : noAsignado();
});

function eliminar(salida) {
  if (salida.nombre != null) {
    let indice = turnos.indexOf(salida);
    turnos.splice(indice, 1);
    localStorage.removeItem("Turnos");
    localStorage.setItem("Turnos", JSON.stringify(turnos));
    Swal.fire({
      title: "Eliminado correctamente",
      text: "Se encontro el turno buscado(recuerde que solo se cancela el ultimo cargado)",
      icon: "success",
    });
    //desesctructuracion
    const { dia, horario } = salida;
    let id_eliminar = dia + "-" + horario;
    let espacio_eliminado = document.getElementById(id_eliminar);
    espacio_eliminado.outerHTML = "";
    inicial();
  } else {
    Swal.fire({
      text: "No se encontro el turno ingresado",
      icon: "error",
    });
  }
}

//agregamos la accion que nos permite eliminar
//recibe los datos desde el formulario como esta aclarado en el principal
let btn_eliminar = document.getElementById("btn_eliminar");
btn_eliminar.addEventListener("click", () => {
  let n = document.getElementById("nombre");

  let salida = buscar(n.value);

  //Optimizo con operador ternario
  salida != null ? eliminar(salida) : auxEliminar();
});
