// Función principal que procesa el QR al hacer clic en el botón
function procesarReservaQR(){
    let contenedor = document.getElementById("resultado-contenedor");
    
    // Limpiar contenedor existente usando métodos del DOM
    while(contenedor.firstChild){
        contenedor.removeChild(contenedor.firstChild);
    }

    // Simular la lectura del QR pidiendo la URL mediante un prompt
    let urlQR = prompt("Introduzca la URL del código QR escaneado:", "http://gympa.upo/reserva?actividad=spinning&duracion=45&id_participante=15");

    if(urlQR === null){
        return; // Si el usuario pulsa Cancelar en el prompt
    }

    let actividad = "";
    let duracion = 0;
    let idParticipante = 0;
    let esValido = true;

    let validacionActividad = "Correcta";
    let validacionDuracion = "Correcta";
    let validacionParticipante = "Correcta";

    if(urlQR.trim() === ""){
        esValido = false;
    }else{
        try{
            let urlObj = new URL(urlQR);
            let params = urlObj.searchParams;

            actividad = params.get("actividad") ? params.get("actividad").toLowerCase().trim() : "";
            duracion = parseInt(params.get("duracion"));
            idParticipante = parseInt(params.get("id_participante"));
        }catch (e){
            esValido = false;
        }
    }

    // Validar datos según los criterios
    let actividadesPermitidas = ["spinning", "yoga", "pilates", "zumba", "crossfit", "aqua", "bodycombat", "trx"];
    if(!actividadesPermitidas.includes(actividad)){
        esValido = false;
        validacionActividad = "Incorrecto - Actividad no reconocida";
    }

    if(isNaN(duracion) || duracion < 30 || duracion > 120){
        esValido = false;
        if(isNaN(duracion)){
            validacionDuracion = "Incorrecto - No es un número";
        }else if (duracion < 30){
            validacionDuracion = "Incorrecto - Duración mínima no alcanzada";
        }else{
            validacionDuracion = "Incorrecto - Duración máxima excedida";
        }
    }

    if(isNaN(idParticipante) || idParticipante < 1 || idParticipante > 50){
        esValido = false;
        validacionParticipante = "Incorrecto";
    }

    // Calcular el coste total de la reserva
    let costeTotalTexto = "";
    let estadoReserva = "";

    if(esValido){
        let costeBase = 1.50;
        
        if(duracion > 30){
            costeBase += 0.50;
        }
        
        if(idParticipante >= 1 && idParticipante <= 15){
            costeBase = costeBase * 0.90; // 10% de descuento
        }
        
        costeTotalTexto = costeBase.toFixed(2) + " €";
        estadoReserva = "RESERVA REALIZADA";
    }else{
        costeTotalTexto = "RESERVA RECHAZADA";
        estadoReserva = "RESERVA RECHAZADA";
    }

    // Mostrar los resultados en forma de tabla usando únicamente los métodos del DOM
    let tabla = document.createElement("table");

    let filaHeader = tabla.insertRow(0);
    let titulos = ["Parámetro", "Valor", "Validación"];
    for(let i = 0; i < titulos.length; i++){
        let th = document.createElement("th");
        let txtTh = document.createTextNode(titulos[i]);
        th.appendChild(txtTh);
        filaHeader.appendChild(th);
    }

    let datosFilas = [
        ["Actividad", actividad || "Desconocido", validacionActividad],
        ["Duración", isNaN(duracion) ? "Desconocido" : duracion, validacionDuracion],
        ["Identificador del participante", isNaN(idParticipante) ? "Desconocido" : idParticipante, validacionParticipante],
        ["Coste total", costeTotalTexto, estadoReserva]
    ];

    for(let j = 0; j < datosFilas.length; j++){
        let fila = tabla.insertRow();
        for(let k = 0; k < datosFilas[j].length; k++){
            let celda = fila.insertCell();
            let txtCelda = document.createTextNode(datosFilas[j][k]);
            celda.appendChild(txtCelda);
            
            if(j === datosFilas.length - 1){
                celda.style.fontWeight = "bold";
            }
            
            if(k === 2){
                let valTexto = datosFilas[j][k];
                if(valTexto === "Correcta" || valTexto === "RESERVA REALIZADA"){
                    celda.style.color = "#27ae60";
                    celda.style.fontWeight = "bold";
                }else{
                    celda.style.color = "#c0392b";
                    celda.style.fontWeight = "bold";
                }
            }
        }
    }

    contenedor.appendChild(tabla);
}

// Registro del evento mediante addEventListener
document.getElementById("btnEscanear").addEventListener("click", procesarReservaQR);