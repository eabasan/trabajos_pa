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

let intervaloSimulacion = null;
let enPausa = false;
let generacionActual = 1;

document.addEventListener("DOMContentLoaded", iniciarEcosistema);

function iniciarEcosistema() {
    const btnPausa = document.getElementById("btn-pausa");
    btnPausa.disabled = false;
    btnPausa.addEventListener("click", alternarPausa);

    intervaloSimulacion = setInterval(simularCicloVida, 2000);
    actualizarEstadisticas();
}

function alternarPausa() {
    const btnPausa = document.getElementById("btn-pausa");
    enPausa = !enPausa;
    
    if (enPausa) {
        clearInterval(intervaloSimulacion);
        btnPausa.innerHTML = "Reanudar simulaci&oacute;n";
        if (typeof registrarEvento === "function") registrarEvento("Simulaci&oacute;n pausada");
    } else {
        intervaloSimulacion = setInterval(simularCicloVida, 2000);
        btnPausa.innerHTML = "Pausar simulaci&oacute;n";
        if (typeof registrarEvento === "function") registrarEvento("Simulaci&oacute;n reanudada");
    }
}

function simularCicloVida() {
    const organismos = Array.from(document.querySelectorAll('.organismo:not(.desapareciendo)'));
    
    organismos.forEach(org => {
        let edad = parseInt(org.dataset.edad) + 1;
        let energia = parseInt(org.dataset.energia);
        
        org.dataset.edad = edad;

        if (org.dataset.tipo !== 'planta') {
            energia -= 10; 
            org.dataset.energia = energia;
            moverOrganismo(org);
        }

        if (energia <= 0 || edad > 20) {
            eliminarOrganismo(org);
        }
    });

    interaccionOrganismos();

    if (Math.random() > 0.5) {
        const ecosistema = document.getElementById("ecosistema");
        const x = Math.random() * Math.max(0, ecosistema.clientWidth - 30);
        const y = Math.random() * Math.max(0, ecosistema.clientHeight - 30);
        crearOrganismo('planta', x, y);
    }

    actualizarEstadisticas();
}

function moverOrganismo(elemento) {
    const ecosistema = document.getElementById("ecosistema");
    const velocidad = parseInt(elemento.dataset.velocidad) * 15;
    
    let xActual = parseFloat(elemento.style.left);
    let yActual = parseFloat(elemento.style.top);
    
    let dx = (Math.random() - 0.5) * velocidad;
    let dy = (Math.random() - 0.5) * velocidad;
    
    let nuevoX = Math.max(0, Math.min(xActual + dx, ecosistema.clientWidth - 30));
    let nuevoY = Math.max(0, Math.min(yActual + dy, ecosistema.clientHeight - 30));
    
    elemento.style.left = nuevoX + "px";
    elemento.style.top = nuevoY + "px";
}

function interaccionOrganismos() {
    const organismos = Array.from(document.querySelectorAll('.organismo:not(.desapareciendo)'));
    const distanciaInteraccion = 40;
    
    for (let i = 0; i < organismos.length; i++) {
        for (let j = i + 1; j < organismos.length; j++) {
            const org1 = organismos[i];
            const org2 = organismos[j];
            
            if (org1.dataset.eliminando === "true" || org2.dataset.eliminando === "true") continue;

            const rect1 = org1.getBoundingClientRect();
            const rect2 = org2.getBoundingClientRect();
            
            const dx = rect1.left - rect2.left;
            const dy = rect1.top - rect2.top;
            const distancia = Math.sqrt(dx * dx + dy * dy);
            
            if (distancia < distanciaInteraccion) {
                manejarEncuentro(org1, org2);
            }
        }
    }
}

function manejarEncuentro(org1, org2) {
    const tipo1 = org1.dataset.tipo;
    const tipo2 = org2.dataset.tipo;

    if (tipo1 === tipo2 && tipo1 !== 'planta') {
        const energia1 = parseInt(org1.dataset.energia);
        const energia2 = parseInt(org2.dataset.energia);
        
        if (energia1 > 60 && energia2 > 60) {
            org1.dataset.energia = energia1 - 30;
            org2.dataset.energia = energia2 - 30;
            reproducirEspecie(org1, org2);
        }
    } else {
        intentarComer(org1, org2);
        intentarComer(org2, org1);
    }
}

function intentarComer(depredador, presa) {
    const tipoDepredador = depredador.dataset.tipo;
    const tipoPresa = presa.dataset.tipo;
    
    let comido = false;
    
    if (tipoDepredador === 'carnivoro' && tipoPresa === 'herbivoro') {
        comido = true;
    } else if (tipoDepredador === 'herbivoro' && tipoPresa === 'planta') {
        comido = true;
    } else if (tipoDepredador === 'omnivoro' && (tipoPresa === 'planta' || tipoPresa === 'herbivoro')) {
        comido = true;
    }
    
    if (comido && presa.dataset.eliminando !== "true") {
        depredador.dataset.energia = Math.min(100, parseInt(depredador.dataset.energia) + 40);
        eliminarOrganismo(presa);
    }
}

function reproducirEspecie(padre1, padre2) {
    const x = (parseFloat(padre1.style.left) + parseFloat(padre2.style.left)) / 2;
    const y = (parseFloat(padre1.style.top) + parseFloat(padre2.style.top)) / 2;
    
    generacionActual++;
    document.getElementById("generacion").innerHTML = generacionActual;
    
    if (typeof registrarEvento === "function") {
        registrarEvento("Reproducci&oacute;n: nuevo " + padre1.dataset.tipo);
    }
    
    crearOrganismo(padre1.dataset.tipo, x, y);
}

function actualizarEstadisticas() {
    const plantas = document.querySelectorAll('.planta:not(.desapareciendo)').length;
    const herbivoros = document.querySelectorAll('.herbivoro:not(.desapareciendo)').length;
    const carnivoros = document.querySelectorAll('.carnivoro:not(.desapareciendo)').length;
    const omnivoros = document.querySelectorAll('.omnivoro:not(.desapareciendo)').length;
    const total = plantas + herbivoros + carnivoros + omnivoros;

    document.getElementById("count-planta").innerHTML = plantas;
    document.getElementById("count-herbivoro").innerHTML = herbivoros;
    document.getElementById("count-carnivoro").innerHTML = carnivoros;
    document.getElementById("count-omnivoro").innerHTML = omnivoros;

    const estadoSpan = document.getElementById("estado-ecosistema");
    if (total === 0) {
        estadoSpan.innerHTML = "Colapso";
    } else if (herbivoros === 0 || carnivoros === 0 || plantas === 0) {
        estadoSpan.innerHTML = "Extinci&oacute;n";
    } else {
        const maxEspecie = Math.max(herbivoros, carnivoros, omnivoros);
        const proporcion = maxEspecie / (total - maxEspecie + 1);
        
        if (proporcion > 1.5) {
            estadoSpan.innerHTML = "Sobrepoblaci&oacute;n";
        } else {
            estadoSpan.innerHTML = "Equilibrado";
        }
    }
}