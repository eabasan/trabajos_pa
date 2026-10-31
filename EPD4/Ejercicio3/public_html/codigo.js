// Variables globales de estado del juego
let matrizValores = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""]
];
let filaActiva = 1; // Celda central por defecto al cargar (fila 1, col 1)
let colActiva = 1;
let segundosTranscurridos = 0;
let timerCronometro = null;
let intentosFallidos = 0;
let juegoTerminado = false;
let tableroModificado = false;

// Inicialización al cargar la página
window.onload = function (){
    inicializarInterfaz();
    iniciarCronometro();

    // Asociamos los eventos de control mediante addEventListener
    document.getElementById("btnReiniciar").addEventListener("click", reiniciarJuego);
    document.getElementById("btnResolver").addEventListener("click", resolverJuegoAutomatico);
    document.addEventListener("keydown", validarTecla);
    document.addEventListener("keyup", function(){
    if(tableroModificado && !juegoTerminado){
        tableroModificado = false;
        verificarCuadradoMagico();
    }
    });
};

// Función que construye la tabla 3x3 en el DOM
function inicializarInterfaz(){
    let contenedor = document.getElementById("contenedor-tabla");

    // Limpiamos contenedor existente usando métodos seguros del DOM
    while(contenedor.firstChild){
        contenedor.removeChild(contenedor.firstChild);
    }

    let tabla = document.createElement("table");
    tabla.setAttribute("id", "tablero-magico");

    for(let i = 0; i < 3; i++){
        let fila = tabla.insertRow();
        for(let j = 0; j < 3; j++){
            let celda = fila.insertCell();
            celda.setAttribute("data-fila", i);
            celda.setAttribute("data-col", j);

            // Asignamos el texto inicial o  el valor guardado
            let txtNodo = document.createTextNode(matrizValores[i][j]);
            celda.appendChild(txtNodo);

            // Aplicamos las clases visuales iniciales
            actualizarEstiloCeldaVisual(celda, i, j);

            // Evento click de ratón para seleccionar celda
            celda.addEventListener("click", seleccionarCelda);
        }
    }
    contenedor.appendChild(tabla);
    actualizarContadoresInfo();
}

// Función clic de ratón para cambiar la celda activa
function seleccionarCelda(event){
    if(juegoTerminado){
        return;
    }

    // event.currentTarget siempre apunta al <td> donde pusimos el listener
    let celdaTarget = event.currentTarget;

    filaActiva = parseInt(celdaTarget.getAttribute("data-fila"));
    colActiva = parseInt(celdaTarget.getAttribute("data-col"));

    refrescarTableroVisual();
}

// Función presión de tecla (keydown) con event.key
function validarTecla(event){
    if(juegoTerminado){
        return;
    }

    const avisoDiv = document.getElementById("aviso");
    const tecla = event.key;

    // Comprobamos si la tecla pulsada es un número del 1 al 9
    if(tecla >= "1" && tecla <= "9"){
        const numero = parseInt(tecla);

        // Comprobamos que el número no esté repetido
        if(estaNumeroRepetido(numero, filaActiva, colActiva)){
            avisoDiv.textContent = "No puedes repetir n\u00fameros. Cada cifra del 1 al 9 debe aparecer solo una vez.";
            return;
        }

        avisoDiv.textContent = "";

        if(matrizValores[filaActiva][colActiva] !== numero){
            matrizValores[filaActiva][colActiva] = numero;

            // Indicamos que el tablero ha cambiado
            tableroModificado = true;

            refrescarTableroVisual();

            // Avanzamos automáticamente a la siguiente celda vacía
            encontrarSiguienteCeldaVacia();
        }

    }else if(tecla === "Backspace" || tecla === "Delete"){
        // Permitimos borrar el contenido de la celda activa
        event.preventDefault();

        if(matrizValores[filaActiva][colActiva] !== ""){
            matrizValores[filaActiva][colActiva] = "";
            tableroModificado = true;
        }

        avisoDiv.textContent = "";
        refrescarTableroVisual();

    }else if(tecla.length === 1){
        // Avisamos cuando se introduce una tecla que no es válida
        avisoDiv.textContent = "S\u00f3lo se aceptan n\u00fameros del 1 al 9.";
    }
}

// Función Tecla liberada  (verificación en tiempo real (keyup))
function verificarCuadradoMagico(){
    let celdasRestantes = contarCeldasVacias();
    actualizarContadoresInfo();

    if(celdasRestantes === 0){
        // Cuadrado completo, comprobamos si las sumas de filas, columnas y diagonales son iguales (Suma objetivo = 15)
        let sumaMagica = 15;
        let esMagico = true;

        // Comprobamos filas y columnas
        for(let i = 0; i < 3; i++){
            let sumaFila = parseInt(matrizValores[i][0]) + parseInt(matrizValores[i][1]) + parseInt(matrizValores[i][2]);
            let sumaCol = parseInt(matrizValores[0][i]) + parseInt(matrizValores[1][i]) + parseInt(matrizValores[2][i]);
            if(sumaFila !== sumaMagica || sumaCol !== sumaMagica){
                esMagico = false;
            }
        }

        // Comprobamos diagonales principales
        let diag1 = parseInt(matrizValores[0][0]) + parseInt(matrizValores[1][1]) + parseInt(matrizValores[2][2]);
        let diag2 = parseInt(matrizValores[0][2]) + parseInt(matrizValores[1][1]) + parseInt(matrizValores[2][0]);
        if(diag1 !== sumaMagica || diag2 !== sumaMagica){
            esMagico = false;
        }

        if(esMagico){
            juegoTerminado = true;
            detenerCronometro();
            aplicarEstiloMagicoResuelto();
            document.getElementById("aviso").style.color = "#27ae60";
            document.getElementById("aviso").textContent = "";
            
            alert("\u00a1FELICIDADES!\nHas resuelto el cuadrado m\u00e1gico en " + segundosTranscurridos + " segundos\nSuma m\u00e1gica: 15\n\u00bfQuieres intentar otro?");
            reiniciarJuego();
        }else{
            // Solución incorrecta: incrementamos los intentos fallidos
            intentosFallidos++;
            document.getElementById("txt-intentos").textContent = "Intentos fallidos: " + intentosFallidos;
            document.getElementById("aviso").textContent = "Este no es un cuadrado m\u00e1gico. Las sumas no coinciden. \u00a1Sigue intentando!";

            // Pista automática tras 3 intentos fallidos
            if(intentosFallidos === 3){
                aplicarPistaAutomatica();
            }
        }
    }else{
        // Cuadrado incompleto
        marcarCeldasIncompletas();
    }
}

// Función reiniciar el juego por completo
function reiniciarJuego(){
    matrizValores = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""]
    ];
    filaActiva = 1;
    colActiva = 1;
    segundosTranscurridos = 0;
    intentosFallidos = 0;
    juegoTerminado = false;
    tableroModificado = false;
    document.getElementById("aviso").textContent = "";
    document.getElementById("aviso").style.color = "#c0392b";
    document.getElementById("txt-cronos").textContent = "Tiempo: 0s";
    document.getElementById("txt-intentos").textContent = "Intentos fallidos: 0";

    detenerCronometro();
    iniciarCronometro();
    inicializarInterfaz();
}

// Funciones auxiliares de apoyo y gestión visual
function refrescarTableroVisual(){
    let tabla = document.getElementById("tablero-magico");
    if(!tabla){
        return;
    }

    for(let i = 0; i < 3; i++){
        let fila = tabla.rows[i];
        for(let j = 0; j < 3; j++){
            let celda = fila.cells[j];

            // Actualizamos contenido de texto de forma segura
            celda.firstChild.nodeValue = matrizValores[i][j];

            // Reaplicamos las clases visuales según estado
            actualizarEstiloCeldaVisual(celda, i, j);
        }
    }
}

function actualizarEstiloCeldaVisual(celda, i, j){
    // Limpiamos clases previas
    celda.className = "";

    if(i === filaActiva && j === colActiva && !juegoTerminado){
        celda.classList.add("celda-activa");
    }else if (matrizValores[i][j] === ""){
        celda.classList.add("celda-vacia");
    }else{
        celda.classList.add("celda-completada");
    }
}

function marcarCeldasIncompletas(){
    let tabla = document.getElementById("tablero-magico");
    if(!tabla){
        return;
    }

    for(let i = 0; i < 3; i++){
        for(let j = 0; j < 3; j++){
            let celda = tabla.rows[i].cells[j];
            if(matrizValores[i][j] === "" && !(i === filaActiva && j === colActiva)){
                celda.classList.add("celda-incompleta");
            }
        }
    }
}

function aplicarEstiloMagicoResuelto(){
    let tabla = document.getElementById("tablero-magico");
    if(!tabla){
        return;
    }

    for(let i = 0; i < 3; i++){
        for(let j = 0; j < 3; j++){
            let celda = tabla.rows[i].cells[j];
            celda.className = "celda-magica";
        }
    }
}

function estaNumeroRepetido(num, filaActual, colActual){
    for(let i = 0; i < 3; i++){
        for(let j = 0; j < 3; j++){
            if(i === filaActual && j === colActual){
                continue;
            }
            if(parseInt(matrizValores[i][j]) === num){
                return true;
            }
        }
    }
    return false;
}

function contarCeldasVacias(){
    let vacias = 0;
    for(let i = 0; i < 3; i++){
        for(let j = 0; j < 3; j++){
            if(matrizValores[i][j] === ""){
                vacias++;
            }
        }
    }
    return vacias;
}

function actualizarContadoresInfo(){
    let vacias = contarCeldasVacias();
    document.getElementById("txt-restantes").textContent = "Restantes: " + vacias;
}

function iniciarCronometro(){
    timerCronometro = setInterval(function () {
        segundosTranscurridos++;
        document.getElementById("txt-cronos").textContent = "Tiempo: " + segundosTranscurridos + "s";
    }, 1000);
}

function detenerCronometro(){
    if(timerCronometro){
        clearInterval(timerCronometro);
        timerCronometro = null;
    }
}

function encontrarSiguienteCeldaVacia(){
    for(let i = 0; i < 3; i++){
        for(let j = 0; j < 3; j++){
            if(matrizValores[i][j] === ""){
                filaActiva = i;
                colActiva = j;
                refrescarTableroVisual();
                return;
            }
        }
    }
}

function aplicarPistaAutomatica(){
    // Solución maestra válida de referencia
    let solucionValida = [
        [2, 7, 6],
        [9, 5, 1],
        [4, 3, 8]
    ];

    for(let i = 0; i < 3; i++){
        for(let j = 0; j < 3; j++){
            if(matrizValores[i][j] !== solucionValida[i][j]){
                let numeroAnterior = matrizValores[i][j];
                let numeroCorrecto = solucionValida[i][j];
                // Buscamos dónde se encuentra el número correcto
                for(let f = 0; f < 3; f++){
                    for(let c = 0; c < 3; c++){
                        if(matrizValores[f][c] === numeroCorrecto){
                            // Intercambiamos los dos números
                            matrizValores[f][c] = numeroAnterior;
                            matrizValores[i][j] = numeroCorrecto;
                            document.getElementById("aviso").textContent =
                                "¡Pista aplicada! Se ha corregido una celda.";
                            refrescarTableroVisual();
                            return;
                        }
                    }
                }
            }
        }
    }
}

function resolverJuegoAutomatico(){
    // Botón adicional para mostrar directamente una solución válida de ejemplo
    matrizValores = [
        [2, 7, 6],
        [9, 5, 1],
        [4, 3, 8]
    ];
    juegoTerminado = true;
    detenerCronometro();
    refrescarTableroVisual();
    actualizarContadoresInfo();
    aplicarEstiloMagicoResuelto();
    document.getElementById("aviso").style.color = "#27ae60";
    document.getElementById("aviso").textContent = "\u00a1Soluci\u00f3n cargada correctamente!";
}