/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */

function registrarCalificaciones(){
    
    const calificaciones = [];
    let N;
    
    while(true){
        
        const entradaN = prompt("Introduce el numero de calificaciones a registrar: ");
        if(entradaN === null){
            return;
        }
        
        N = parseInt(entradaN);
        
        if(!isNaN(N) && N>0 && Number.isInteger(N)){
            break;
        }
        
        alert("Tiene que ser un numero positivo sin decimales");
        
    }
    
    for(let i = 0; i<N; i++){
        
        let nota;
        while(true){
            
            const entradaNota = prompt(`Introduce la calificacion ${i+1}: `);
            
            if(entradaNota === null){
                return;
            }
            
            nota = parseFloat(entradaNota);
            
            if(!isNaN(nota) && nota >= 0 && nota <=10){
                calificaciones.push(nota);
                break;
            }
            
            alert("Error: las calificaciones deben estar entre 0 y 10");
            
        }
        
    }
    
    let sobresalientes = 0;
    let notables = 0;
    let aprobados = 0;
    let suspensos = 0;

    for(nota of calificaciones){
        if(nota>=8.0){
            sobresalientes++;
        }
        else if (nota>=6.0){
            notables++;
        }
        else if (nota>=4.0){
            aprobados++;
        }
        else{
            suspensos++;
        }
    }
    
    const suma = calificaciones.reduce((acum, n) => acum+n, 0);
    const mediaSinRedondear= suma/N;
    const media = Math.round(mediaSinRedondear*100)/100;
    const maximo = Math.max(...calificaciones);
    const minimo = Math.min(...calificaciones);
    const porcentajeSobresaliente = (Math.round((sobresalientes / N) * 10000) / 100);
    const porcentajeNotables = (Math.round((notables / N) * 10000) / 100);
    const porcentajeAprobados = (Math.round((aprobados / N) * 10000) / 100);
    const porcentajeSuspensos = (Math.round((suspensos / N) * 10000) / 100);
    
    const ordenAscendente = [...calificaciones].sort((a,b) => a - b);
    const ordenDescendente = [...calificaciones].sort((a,b) => b - a);
    
    const informe= `
=== INFORME ESTADÍSTICO DEL RENDIMIENTO ACADÉMICO ===

• Total de alumnos evaluados: ${N}
• Calificación media de la clase: ${media}
• Calificación máxima: ${maximo}
• Calificación mínima: ${minimo}

--- DESGLOSE POR NIVELES DE RENDIMIENTO ---
• Sobresaliente (8.0 - 10.0): ${sobresalientes} estudiante(s) (${porcentajeSobresaliente}%)
• Notable (6.0 - 7.99): ${notables} estudiante(s) (${porcentajeNotables}%)
• Aprobado (4.0 - 5.99): ${aprobados} estudiante(s) (${porcentajeAprobados}%)
• Suspenso (< 4.0): ${suspensos} estudiante(s) (${porcentajeSuspensos}%)

--- ORDENACIÓN DE CALIFICACIONES ---
• Ascendente (menor a mayor): [ ${ordenAscendente.join(", ")} ]
• Descendente (mayor a menor): [ ${ordenDescendente.join(", ")} ]
===================================================
    `;
    
    console.log(informe);
    alert(informe);
    
}

registrarCalificaciones();

