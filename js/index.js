//Cambiar el modo de la pantalla a modo oscuro o no
let btnOscuro = document.getElementById("boton_oscuro");
let btnClaro = document.getElementById("boton_claro");

//Dejamos agregado en la configuracion si tiene o no
//el modo oscuro
let modo;
function cambioColor() {
  if (localStorage.getItem("modoOscuro")) {
    modo = localStorage.getItem("modoOscuro");
  } else {
    localStorage.setItem("modoOscuro", false);
  }
  if (modo === "true") {
    document.body.classList.remove("modo_claro");
    document.body.classList.add("modo_oscuro");
  } else {
    document.body.classList.remove("modo_oscuro");
    document.body.classList.add("modo_claro");
  }
}

btnOscuro.addEventListener("click", () => {
  localStorage.setItem("modoOscuro", true);

  cambioColor();
});

btnClaro.addEventListener("click", () => {
  localStorage.setItem("modoOscuro", false);

  cambioColor();
});

//Indico los cambios para que quede instanciado directamente en el principio de cada pagina
document.addEventListener("DOMContentLoaded", () => {
  cambioColor();
});
