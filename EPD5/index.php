<?php

/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Scripting/EmptyPHP.php to edit this template
 */

function procesarRegistrosActividades(string $cadenaEntrada): string
{
    $cadenaNormalizada = str_replace(["\r\n", "\r"], "\n", trim($cadenaEntrada));
    $lineas = explode("\n", $cadenaNormalizada);

    $socios = [];
    $actividadesGlobales = [];
    $instructoresGlobales = [];
    $totalMinutosGlobales = 0;
    $totalSesionesGlobales = 0;

    foreach ($lineas as $linea) {
        $linea = trim($linea);
        if ($linea === '') {
            continue;
        }

        $campos = explode('@@', $linea);
        if (count($campos) < 6) {
            continue;
        }

        $idSocio = trim($campos[0]);
        $actividad = trim($campos[1]);
        $duracion = (int) trim($campos[2]);
        $fechaStr = trim($campos[3]);
        $instructor = trim($campos[4]);

        $fechaObj = date_create_from_format('d/m/Y', $fechaStr);
        if ($fechaObj === false) {
            continue;
        }
        date_time_set($fechaObj, 0, 0, 0);

        if (!isset($socios[$idSocio])) {
            $socios[$idSocio] = [
                'minutos' => 0,
                'sesiones' => 0,
                'actividades' => [],
                'instructores' => [],
                'primeraFecha' => $fechaObj,
                'ultimaFecha' => $fechaObj,
            ];
        }

        $socios[$idSocio]['minutos'] += $duracion;
        $socios[$idSocio]['sesiones']++;

        if (!isset($socios[$idSocio]['actividades'][$actividad])) {
            $socios[$idSocio]['actividades'][$actividad] = 0;
        }
        $socios[$idSocio]['actividades'][$actividad]++;

        if (!isset($socios[$idSocio]['instructores'][$instructor])) {
            $socios[$idSocio]['instructores'][$instructor] = 0;
        }
        $socios[$idSocio]['instructores'][$instructor]++;

        if ($fechaObj < $socios[$idSocio]['primeraFecha']) {
            $socios[$idSocio]['primeraFecha'] = $fechaObj;
        }
        if ($fechaObj > $socios[$idSocio]['ultimaFecha']) {
            $socios[$idSocio]['ultimaFecha'] = $fechaObj;
        }

        $totalMinutosGlobales += $duracion;
        $totalSesionesGlobales++;

        if (!isset($actividadesGlobales[$actividad])) {
            $actividadesGlobales[$actividad] = 0;
        }
        $actividadesGlobales[$actividad]++;

        if (!isset($instructoresGlobales[$instructor])) {
            $instructoresGlobales[$instructor] = 0;
        }
        $instructoresGlobales[$instructor]++;
    }

    ksort($socios);

    $html = "<table>\n";
    $html .= "  <thead>\n";
    $html .= "    <tr>\n";
    $html .= "      <th>ID del socio</th>\n";
    $html .= "      <th>Total de minutos</th>\n";
    $html .= "      <th>Número de actividades realizadas</th>\n";
    $html .= "      <th>Actividad favorita (más frecuente)</th>\n";
    $html .= "      <th>Período de actividad (primera - última fecha)</th>\n";
    $html .= "      <th>Días activo</th>\n";
    $html .= "      <th>Instructor principal</th>\n";
    $html .= "    </tr>\n";
    $html .= "  </thead>\n";
    $html .= "  <tbody>\n";

    $maxMinutosSocio = 0;
    $sociosMasActivos = [];

    foreach ($socios as $idSocio => $datos) {
        $maxFrecuenciaAct = max($datos['actividades']);
        $favoritas = array_keys($datos['actividades'], $maxFrecuenciaAct, true);
        $textoActividades = implode(', ', $favoritas);

        $maxFrecuenciaInst = max($datos['instructores']);
        $principales = array_keys($datos['instructores'], $maxFrecuenciaInst, true);
        $textoInstructores = implode(', ', $principales);

        $primeraStr = date_format($datos['primeraFecha'], 'd/m/Y');
        $ultimaStr = date_format($datos['ultimaFecha'], 'd/m/Y');
        $diferencia = date_diff($datos['primeraFecha'], $datos['ultimaFecha']);
        $diasActivo = (int) date_interval_format($diferencia, '%a');

        if ($datos['minutos'] > $maxMinutosSocio) {
            $maxMinutosSocio = $datos['minutos'];
            $sociosMasActivos = [$idSocio];
        } elseif ($datos['minutos'] === $maxMinutosSocio) {
            $sociosMasActivos[] = $idSocio;
        }

        $html .= "    <tr>\n";
        $html .= "      <td>" . htmlspecialchars($idSocio, ENT_QUOTES, 'UTF-8') . "</td>\n";
        $html .= "      <td>{$datos['minutos']} min</td>\n";
        $html .= "      <td>{$datos['sesiones']}</td>\n";
        $html .= "      <td>" . htmlspecialchars($textoActividades, ENT_QUOTES, 'UTF-8') . "</td>\n";
        $html .= "      <td>{$primeraStr} - {$ultimaStr}</td>\n";
        $html .= "      <td>{$diasActivo} días</td>\n";
        $html .= "      <td>" . htmlspecialchars($textoInstructores, ENT_QUOTES, 'UTF-8') . "</td>\n";
        $html .= "    </tr>\n";
    }

    $html .= "  </tbody>\n";
    $html .= "</table>\n";

    $textoSociosActivos = implode(', ', $sociosMasActivos) . " ({$maxMinutosSocio} minutos)";

    $maxSesionesActividad = !empty($actividadesGlobales) ? max($actividadesGlobales) : 0;
    $populares = array_keys($actividadesGlobales, $maxSesionesActividad, true);
    $textoActividadPopular = implode(', ', $populares) . " ({$maxSesionesActividad} sesiones)";

    $maxSesionesInstructor = !empty($instructoresGlobales) ? max($instructoresGlobales) : 0;
    $solicitados = array_keys($instructoresGlobales, $maxSesionesInstructor, true);
    $textoInstructorSolicitado = implode(', ', $solicitados) . " ({$maxSesionesInstructor} sesiones)";

    $promedioMinutos = $totalSesionesGlobales > 0
        ? round($totalMinutosGlobales / $totalSesionesGlobales, 1)
        : 0;

    $html .= "<section class='estadisticas-globales'>\n";
    $html .= "  <h2>Estadísticas Globales de la Instalación</h2>\n";
    $html .= "  <ul>\n";
    $html .= "    <li><strong>Socio más activo:</strong> " . htmlspecialchars($textoSociosActivos, ENT_QUOTES, 'UTF-8') . "</li>\n";
    $html .= "    <li><strong>Actividad más popular:</strong> " . htmlspecialchars($textoActividadPopular, ENT_QUOTES, 'UTF-8') . "</li>\n";
    $html .= "    <li><strong>Instructor más solicitado:</strong> " . htmlspecialchars($textoInstructorSolicitado, ENT_QUOTES, 'UTF-8') . "</li>\n";
    $html .= "    <li><strong>Promedio de minutos por sesión:</strong> {$promedioMinutos} minutos</li>\n";
    $html .= "  </ul>\n";
    $html .= "</section>\n";

    return $html;
}

$datosEntrada = <<<EOD
SOC001@@Spinning@@45@@15/01/2025@@Ana López@@Sala1
SOC001@@Natación@@30@@16/01/2025@@Miguel Torres@@Piscina1
SOC002@@Spinning@@45@@15/01/2025@@Ana López@@Sala1
SOC001@@Yoga@@60@@17/01/2025@@Carmen Ruiz@@Sala2
SOC003@@Natación@@30@@16/01/2025@@Miguel Torres@@Piscina1
SOC002@@Tenis@@90@@18/01/2025@@David García@@Pista1
SOC001@@Spinning@@45@@19/01/2025@@Ana López@@Sala1
SOC004@@Pilates@@50@@15/01/2025@@Laura Martín@@Sala3
SOC003@@Spinning@@45@@17/01/2025@@Ana López@@Sala1
SOC005@@Natación@@40@@16/01/2025@@Miguel Torres@@Piscina1
SOC004@@Yoga@@60@@18/01/2025@@Carmen Ruiz@@Sala2
SOC002@@Natación@@35@@20/01/2025@@Miguel Torres@@Piscina1
SOC006@@Tenis@@120@@17/01/2025@@David García@@Pista1
SOC001@@Pilates@@50@@21/01/2025@@Laura Martín@@Sala3
SOC007@@Spinning@@45@@18/01/2025@@Ana López@@Sala1
SOC003@@Yoga@@60@@20/01/2025@@Carmen Ruiz@@Sala2
SOC005@@Tenis@@90@@19/01/2025@@David García@@Pista1
SOC008@@Natación@@25@@17/01/2025@@Miguel Torres@@Piscina1
SOC006@@Spinning@@45@@21/01/2025@@Ana López@@Sala1
SOC004@@Natación@@40@@22/01/2025@@Miguel Torres@@Piscina1
SOC007@@Pilates@@55@@20/01/2025@@Laura Martín@@Sala3
SOC002@@Yoga@@60@@22/01/2025@@Carmen Ruiz@@Sala2
SOC009@@Spinning@@45@@19/01/2025@@Ana López@@Sala1
SOC008@@Tenis@@75@@21/01/2025@@David García@@Pista1
SOC005@@Pilates@@50@@23/01/2025@@Laura Martín@@Sala3
SOC010@@Natación@@30@@20/01/2025@@Miguel Torres@@Piscina1
SOC003@@Spinning@@45@@24/01/2025@@Ana López@@Sala1
SOC006@@Yoga@@60@@23/01/2025@@Carmen Ruiz@@Sala2
SOC009@@Natación@@35@@22/01/2025@@Miguel Torres@@Piscina1
SOC001@@Tenis@@105@@25/01/2025@@David García@@Pista1
SOC007@@Spinning@@45@@24/01/2025@@Ana López@@Sala1
SOC010@@Pilates@@50@@22/01/2025@@Laura Martín@@Sala3
SOC004@@Spinning@@45@@25/01/2025@@Ana López@@Sala1
SOC008@@Yoga@@60@@25/01/2025@@Carmen Ruiz@@Sala2
SOC002@@Spinning@@45@@26/01/2025@@Ana López@@Sala1
SOC005@@Natación@@40@@26/01/2025@@Miguel Torres@@Piscina1
SOC011@@Tenis@@80@@23/01/2025@@David García@@Pista1
SOC006@@Pilates@@55@@26/01/2025@@Laura Martín@@Sala3
SOC012@@Spinning@@45@@24/01/2025@@Ana López@@Sala1
SOC003@@Natación@@30@@27/01/2025@@Miguel Torres@@Piscina1
SOC009@@Yoga@@60@@26/01/2025@@Carmen Ruiz@@Sala2
SOC011@@Spinning@@45@@27/01/2025@@Ana López@@Sala1
SOC007@@Natación@@40@@28/01/2025@@Miguel Torres@@Piscina1
SOC010@@Tenis@@95@@27/01/2025@@David García@@Pista1
SOC012@@Pilates@@50@@28/01/2025@@Laura Martín@@Sala3
SOC001@@Spinning@@45@@29/01/2025@@Ana López@@Sala1
SOC008@@Natación@@35@@28/01/2025@@Miguel Torres@@Piscina1
SOC004@@Yoga@@60@@29/01/2025@@Carmen Ruiz@@Sala2
SOC005@@Spinning@@45@@30/01/2025@@Ana López@@Sala1
SOC011@@Pilates@@55@@30/01/2025@@Laura Martín@@Sala3
SOC006@@Natación@@40@@30/01/2025@@Miguel Torres@@Piscina1
EOD;
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Informe Consolidado de Actividades Deportivas</title>
    <style>
        body {
            font-family: Arial, Helvetica, sans-serif;
            margin: 2rem;
            background-color: #f4f6f9;
            color: #333;
        }
        h1 {
            color: #1e3a5f;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            background-color: #fff;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
            margin-bottom: 2rem;
        }
        th, td {
            padding: 12px 15px;
            border: 1px solid #dce1e7;
            text-align: left;
        }
        th {
            background-color: #1e3a5f;
            color: #ffffff;
        }
        tr:nth-child(even) {
            background-color: #f9fbfd;
        }
        .estadisticas-globales {
            background-color: #ffffff;
            padding: 1.5rem;
            border-left: 5px solid #1e3a5f;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
        }
        .estadisticas-globales h2 {
            margin-top: 0;
            color: #1e3a5f;
        }
        .estadisticas-globales li {
            margin-bottom: 0.5rem;
        }
    </style>
</head>
<body>
    <h1>Informe Consolidado de Actividades Deportivas</h1>
    <?php echo procesarRegistrosActividades($datosEntrada); ?>
</body>
</html>