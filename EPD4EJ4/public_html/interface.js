/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */

document.addEventListener("DOMContentLoaded", iniciarInterfaz);
let contadorOrganismos = 1;
let organismoArrastrado = null;
let desplazamientoX = 0;
let desplazamientoY = 0;
function iniciarInterfaz() {
    const botones = document.querySelectorAll("[data-especie]");

    for (const boton of botones) {
        boton.addEventListener("click", seleccionarEspecie);
    }
    const ecosistema = document.getElementById("ecosistema");

    ecosistema.addEventListener("dragover", permitirSoltar);
    ecosistema.addEventListener("drop", soltarOrganismo);
}

function seleccionarEspecie(event) {
    const boton = event.currentTarget;
    const tipo = boton.dataset.especie;
    anadirEspecie(tipo);
}

function anadirEspecie(tipo) {
    const ecosistema = document.getElementById("ecosistema");
    //?
    const x = Math.random() * Math.max(0, ecosistema.clientWidth - 30);
    const y = Math.random() * Math.max(0, ecosistema.clientHeight - 30);

    crearOrganismo(tipo, x, y);
}

function crearOrganismo(tipo, x, y) {
    const organismo = document.createElement("div");

    organismo.className = "organismo " + tipo;
    organismo.dataset.tipo = tipo;

    organismo.dataset.id = "organismo-" + contadorOrganismos;
    contadorOrganismos++;

    organismo.dataset.edad = "0";

    if (tipo === "planta") {
        organismo.dataset.energia = "40";
        organismo.dataset.tamano = "1";
        organismo.dataset.rebrota = "true";
    } else {
        organismo.dataset.energia = "100";
        organismo.dataset.velocidad = "2";
    }

    organismo.style.left = x + "px";
    organismo.style.top = y + "px";

    organismo.addEventListener("click", mostrarInfoOrganismo);
    organismo.addEventListener("mouseover", mostrarInfoOrganismo);
    organismo.addEventListener("mouseout", ocultarInfoOrganismo);
    organismo.addEventListener("dblclick", eliminarPorDobleClic);

    organismo.draggable = true;
    organismo.addEventListener("dragstart", iniciarArrastre);
    organismo.addEventListener("dragend", finalizarArrastre);
    document.getElementById("ecosistema").appendChild(organismo);
    registrarEvento("Nuevo organismo: " + tipo);

    return organismo;
}

function mostrarInfoOrganismo(event) {
    const organismo = event.currentTarget;
    const info = document.getElementById("info-organismo");

    info.textContent =
            "Tipo: " + organismo.dataset.tipo +
            " | ID: " + organismo.dataset.id +
            " | Edad: " + organismo.dataset.edad +
            " | Energia: " + organismo.dataset.energia;

    info.hidden = false;
}
function ocultarInfoOrganismo() {
    const info = document.getElementById("info-organismo");
    info.hidden = true;
}

function eliminarPorDobleClic(event) {
    const organismo = event.currentTarget;
    eliminarOrganismo(organismo);
}

function eliminarOrganismo(organismo) {
    if (organismo.dataset.eliminando === "true") {
        return;
    }

    organismo.dataset.eliminando = "true";
    organismo.classList.add("desapareciendo");

    ocultarInfoOrganismo();

    registrarEvento(
            "Organismo eliminado: " + organismo.dataset.tipo
            );

    setTimeout(function () {
        if (organismo.parentNode) {
            organismo.parentNode.removeChild(organismo);
        }
    }, 300);
}

function iniciarArrastre(event) {
    organismoArrastrado = event.currentTarget;

    const limites = organismoArrastrado.getBoundingClientRect();

    desplazamientoX = event.clientX - limites.left;
    desplazamientoY = event.clientY - limites.top;

    event.dataTransfer.setData(
            "text/plain",
            organismoArrastrado.dataset.id
            );

    event.dataTransfer.effectAllowed = "move";
    ocultarInfoOrganismo();
}

function permitirSoltar(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
}

function soltarOrganismo(event) {
    event.preventDefault();

    if (organismoArrastrado === null) {
        return;
    }

    const ecosistema = event.currentTarget;
    const limites = ecosistema.getBoundingClientRect();

    let x = event.clientX - limites.left
            - ecosistema.clientLeft - desplazamientoX;

    let y = event.clientY - limites.top
            - ecosistema.clientTop - desplazamientoY;

    const maxX = Math.max(
            0,
            ecosistema.clientWidth - organismoArrastrado.offsetWidth
            );

    const maxY = Math.max(
            0,
            ecosistema.clientHeight - organismoArrastrado.offsetHeight
            );

    x = Math.max(0, Math.min(x, maxX));
    y = Math.max(0, Math.min(y, maxY));

    organismoArrastrado.style.left = x + "px";
    organismoArrastrado.style.top = y + "px";

    registrarEvento(
            "Organismo desplazado: " + organismoArrastrado.dataset.tipo
            );
}

function finalizarArrastre() {
    organismoArrastrado = null;
}

function registrarEvento(mensaje) {
    const lista = document.getElementById("eventos-lista");
    const entrada = document.createElement("p");
    const hora = new Date().toLocaleTimeString();

    entrada.textContent = hora + " - " + mensaje;
    lista.insertBefore(entrada, lista.firstChild);
    if (lista.children.length > 10) {
        lista.removeChild(lista.lastElementChild);
    }
}

