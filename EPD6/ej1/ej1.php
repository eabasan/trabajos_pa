<?php
/**
 * EPD 6 - Ejercicio 1: Asignación aleatoria de turnos de trabajo
 */

// Paso 1: Vector asociativo de empleados y especialidades (mínimo 6)
$empleados = array(
    'Ana Lopez'     => 'Entrenadora Personal',
    'Miguel Torres' => 'Socorrista',
    'Carmen Ruiz'   => 'Recepcionista',
    'David Garcia'  => 'Monitor de Piscina',
    'Laura Martin'  => 'Instructora de Spinning',
    'Javier Moreno' => 'Mantenimiento'
);

// Paso 2: Vector asociativo de turnos y sus horarios
$turnos = array(
    'Manana' => '07:00-15:00',
    'Tarde'  => '15:00-23:00',
    'Noche'  => '23:00-07:00'
);

// Paso 3: Número aleatorio de empleados que trabajarán hoy (entre 3 y el total)
$totalEmpleados = count($empleados);
$numTrabajadoresHoy = rand(3, $totalEmpleados);

// Paso 4: Selección aleatoria de empleados y reparto en turnos
// Obtenemos todos los nombres disponibles con array_keys
$nombresDisponibles = array_keys($empleados);

// Barajamos los nombres para asegurar selección aleatoria sin repetición
shuffle($nombresDisponibles);

// Nos quedamos con los N empleados elegidos para hoy
$empleadosHoy = array_slice($nombresDisponibles, 0, $numTrabajadoresHoy);

// Estructura para almacenar las asignaciones de cada turno
$asignaciones = array();
$nombresTurnos = array_keys($turnos);

// Inicializamos cada turno con un array vacío
foreach ($nombresTurnos as $t) {
    $asignaciones[$t] = array();
}

// 1. Garantizar que ningún turno quede sin cubrir: asignamos un empleado a cada uno
for ($i = 0; $i < count($nombresTurnos); $i++) {
    $turno = $nombresTurnos[$i];
    $asignaciones[$turno][] = $empleadosHoy[$i];
}

// 2. Si hay más de 3 empleados seleccionados, repartimos el resto aleatoriamente
for ($i = count($nombresTurnos); $i < count($empleadosHoy); $i++) {
    $indiceTurnoAleatorio = rand(0, count($nombresTurnos) - 1);
    $turnoAleatorio = $nombresTurnos[$indiceTurnoAleatorio];
    $asignaciones[$turnoAleatorio][] = $empleadosHoy[$i];
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EPD 6 - Ejercicio 1: Asignacion de Turnos</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f6f8;
            color: #333;
            padding: 20px;
        }
        h1 {
            color: #1e3a8a;
        }
        table {
            border-collapse: collapse;
            width: 100%;
            max-width: 850px;
            background-color: #ffffff;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
            margin-top: 15px;
        }
        th, td {
            border: 1px solid #cbd5e1;
            padding: 12px 16px;
            text-align: left;
            vertical-align: top;
        }
        th {
            background-color: #1e293b;
            color: #ffffff;
        }
        tr:nth-child(even) {
            background-color: #f8fafc;
        }
        .empleado-item {
            margin-bottom: 6px;
        }
        .empleado-item:last-child {
            margin-bottom: 0;
        }
        .resumen {
            margin-top: 15px;
            font-weight: bold;
            color: #475569;
        }
    </style>
</head>
<body>
    <h1>Gestion de Turnos de Instalaciones Deportivas</h1>
    <p>Asignacion automatica y aleatoria de la jornada laboral.</p>

    <!-- Paso 5: Tabla HTML generada dinamicamente -->
    <table>
        <thead>
            <tr>
                <th>Turno</th>
                <th>Horario</th>
                <th>Empleados Asignados</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($turnos as $nombreTurno => $horario): ?>
                <tr>
                    <td><strong><?php echo $nombreTurno; ?></strong></td>
                    <td><?php echo $horario; ?></td>
                    <td>
                        <?php 
                        foreach ($asignaciones[$nombreTurno] as $empleado) {
                            $especialidad = $empleados[$empleado];
                            echo '<div class="empleado-item">' . $empleado . ' (' . $especialidad . ')</div>';
                        }
                        ?>
                    </td>
                </tr>
            <?php endforeach; ?>
        </tbody>
    </table>

    <p class="resumen">
        Total de empleados trabajando hoy: <?php echo $numTrabajadoresHoy; ?> de <?php echo $totalEmpleados; ?> disponibles.
    </p>
</body>
</html>