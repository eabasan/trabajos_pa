<?php

/**
 * Recibe un vector asociativo de frecuencias (clave, cantidad)
 * y devuelve todas las claves que comparten el valor maximo (soporta empates).
 */
function obtenerElementosMaximos($conteo){
    $claves = array_keys($conteo);
    $maximo = 0;
    $elementosMaximos = array();

    for($i = 0; $i < count($claves); $i++){
        $clave = $claves[$i];
        $valor = $conteo[$clave];

        if($valor > $maximo){
            $maximo = $valor;
            $elementosMaximos = array($clave);
        }elseif($valor === $maximo && $maximo > 0){
            $elementosMaximos[] = $clave;
        }
    }

    return array(
        'elementos' => $elementosMaximos,
        'valor' => $maximo
    );
}

/**
 * Procesa la cadena de registros linea por linea, agrupa los datos por socio
 * y calcula las estadisticas individuales y globales.
 */
function procesarRegistrosActividades($cadenaEntrada){
    // Normalizamos los saltos de linea (Windows/Linux/Mac) y dividimos por lineas
    $cadenaLimpia = str_replace(array("\r\n", "\r"), "\n", trim($cadenaEntrada));
    $lineas = explode("\n", $cadenaLimpia);

    $datosSocios = array();
    $actividadesGlobales = array();
    $instructoresGlobales = array();
    $totalSesionesGlobales = 0;
    $totalMinutosGlobales = 0;

    foreach($lineas as $linea){
        $linea = trim($linea);
        if($linea === ''){
            continue;
        }

        // Dividimos cada registro usando el separador "@@"
        $partes = explode('@@', $linea);
        if(count($partes) !== 6){
            continue;
        }

        $idSocio = trim($partes[0]);
        $actividad = trim($partes[1]);
        $duracion = (int) trim($partes[2]);
        $fechaTexto = trim($partes[3]);
        $instructor = trim($partes[4]);
        $pista = trim($partes[5]);

        // Convertimos la fecha usando estilo procedural (! reinicia hora a 00:00:00)
        $fechaObj = date_create_from_format('!d/m/Y', $fechaTexto);
        if($fechaObj === false){
            continue;
        }

        // Inicializamos la estructura del socio si es su primer registro
        if(!isset($datosSocios[$idSocio])){
            $datosSocios[$idSocio] = array(
                'total_minutos' => 0,
                'num_sesiones' => 0,
                'actividades' => array(),
                'instructores' => array(),
                'pistas' => array(),
                'primera_fecha' => $fechaObj,
                'ultima_fecha' => $fechaObj
            );
        }

        // Actualizamos acumuladores del socio
        $datosSocios[$idSocio]['total_minutos'] += $duracion;
        $datosSocios[$idSocio]['num_sesiones']++;

        if(!isset($datosSocios[$idSocio]['actividades'][$actividad])){
            $datosSocios[$idSocio]['actividades'][$actividad] = 0;
        }
        $datosSocios[$idSocio]['actividades'][$actividad]++;

        if(!isset($datosSocios[$idSocio]['instructores'][$instructor])){
            $datosSocios[$idSocio]['instructores'][$instructor] = 0;
        }
        $datosSocios[$idSocio]['instructores'][$instructor]++;

        if(!isset($datosSocios[$idSocio]['pistas'][$pista])){
            $datosSocios[$idSocio]['pistas'][$pista] = 0;
        }
        $datosSocios[$idSocio]['pistas'][$pista]++;

        // Actualizamos fecha mas antigua y fecha mas reciente del socio
        if($fechaObj < $datosSocios[$idSocio]['primera_fecha']){
            $datosSocios[$idSocio]['primera_fecha'] = $fechaObj;
        }
        if($fechaObj > $datosSocios[$idSocio]['ultima_fecha']){
            $datosSocios[$idSocio]['ultima_fecha'] = $fechaObj;
        }

        // Actualizamos acumuladores globales
        $totalSesionesGlobales++;
        $totalMinutosGlobales += $duracion;

        if(!isset($actividadesGlobales[$actividad])){
            $actividadesGlobales[$actividad] = 0;
        }
        $actividadesGlobales[$actividad]++;

        if(!isset($instructoresGlobales[$instructor])){
            $instructoresGlobales[$instructor] = 0;
        }
        $instructoresGlobales[$instructor]++;
    }

    // Ordenamos los socios por su ID (SOC001, SOC002, ...)
    ksort($datosSocios);

    // Calculamos las estadisticas derivadas para cada socio
    $resumenSocios = array();
    $minutosPorSocio = array();

    foreach($datosSocios as $idSocio => $info){
        $actFavorita = obtenerElementosMaximos($info['actividades']);
        $instPrincipal = obtenerElementosMaximos($info['instructores']);

        // Calculo de dias transcurridos usando exclusivamente estilo procedural
        $diferencia = date_diff($info['primera_fecha'], $info['ultima_fecha']);
        $diasActivo = (int) date_interval_format($diferencia, '%a');

        $resumenSocios[$idSocio] = array(
            'total_minutos' => $info['total_minutos'],
            'num_sesiones' => $info['num_sesiones'],
            'actividad_favorita' => $actFavorita['elementos'],
            'actividad_favorita_sesiones' => $actFavorita['valor'],
            'primera_fecha' => date_format($info['primera_fecha'], 'd/m/Y'),
            'ultima_fecha' => date_format($info['ultima_fecha'], 'd/m/Y'),
            'dias_activo' => $diasActivo,
            'instructor_principal' => $instPrincipal['elementos'],
            'instructor_principal_sesiones' => $instPrincipal['valor']
        );

        $minutosPorSocio[$idSocio] = $info['total_minutos'];
    }

    // Calculamos las estadisticas globales
    $socioMasActivo = obtenerElementosMaximos($minutosPorSocio);
    $actividadMasPopular = obtenerElementosMaximos($actividadesGlobales);
    $instructorMasSolicitado = obtenerElementosMaximos($instructoresGlobales);

    $promedioMinutos = 0;
    if($totalSesionesGlobales > 0){
        $promedioMinutos = $totalMinutosGlobales / $totalSesionesGlobales;
    }

    $estadisticasGlobales = array(
        'total_registros' => $totalSesionesGlobales,
        'total_socios' => count($resumenSocios),
        'total_minutos' => $totalMinutosGlobales,
        'socio_mas_activo' => $socioMasActivo['elementos'],
        'socio_mas_activo_minutos' => $socioMasActivo['valor'],
        'actividad_mas_popular' => $actividadMasPopular['elementos'],
        'actividad_mas_popular_sesiones' => $actividadMasPopular['valor'],
        'instructor_mas_solicitado' => $instructorMasSolicitado['elementos'],
        'instructor_mas_solicitado_sesiones' => $instructorMasSolicitado['valor'],
        'promedio_minutos_sesion' => $promedioMinutos
    );

    return array(
        'socios' => $resumenSocios,
        'globales' => $estadisticasGlobales
    );
}

/**
 * Genera e imprime el informe HTML completo: tabla de socios y estadisticas globales.
 */
function imprimirInformeHTML($resultados){
    $socios = $resultados['socios'];
    $globales = $resultados['globales'];

    if(count($socios) === 0){
        echo '<p class="aviso">No se encontraron registros v&aacute;lidos para procesar.</p>';
        return;
    }

    echo '<section class="bloque">';
    echo '<h2>Resumen de Actividades por Socio</h2>';
    echo '<table class="tabla-informe">';
    echo '<thead>';
    echo '<tr>';
    echo '<th>ID del socio</th>';
    echo '<th>Total de minutos</th>';
    echo '<th>N&uacute;mero de actividades</th>';
    echo '<th>Actividad favorita</th>';
    echo '<th>Per&iacute;odo de actividad</th>';
    echo '<th>D&iacute;as activo</th>';
    echo '<th>Instructor principal</th>';
    echo '</tr>';
    echo '</thead>';
    echo '<tbody>';

    foreach($socios as $idSocio => $datos){
        $textoActividades = implode(', ', $datos['actividad_favorita']);
        $textoInstructores = implode(', ', $datos['instructor_principal']);
        $periodo = $datos['primera_fecha'] . ' - ' . $datos['ultima_fecha'];

        echo '<tr>';
        echo '<td><strong>' . htmlspecialchars($idSocio, ENT_QUOTES, 'UTF-8') . '</strong></td>';
        echo '<td>' . $datos['total_minutos'] . ' min</td>';
        echo '<td>' . $datos['num_sesiones'] . '</td>';
        echo '<td>' . htmlspecialchars($textoActividades, ENT_QUOTES, 'UTF-8') . ' (' . $datos['actividad_favorita_sesiones'] . ')</td>';
        echo '<td>' . htmlspecialchars($periodo, ENT_QUOTES, 'UTF-8') . '</td>';
        echo '<td>' . $datos['dias_activo'] . ' d&iacute;as</td>';
        echo '<td>' . htmlspecialchars($textoInstructores, ENT_QUOTES, 'UTF-8') . ' (' . $datos['instructor_principal_sesiones'] . ')</td>';
        echo '</tr>';
    }

    echo '</tbody>';
    echo '</table>';
    echo '</section>';

    // Bloque de estadisticas globales
    $sociosTopTexto = implode(', ', $globales['socio_mas_activo']);
    $actividadesTopTexto = implode(', ', $globales['actividad_mas_popular']);
    $instructoresTopTexto = implode(', ', $globales['instructor_mas_solicitado']);
    $promedioFormateado = number_format($globales['promedio_minutos_sesion'], 1, '.', '');

    echo '<section class="bloque estadisticas-globales">';
    echo '<h2>Estad&iacute;sticas Globales de la Instalaci&oacute;n</h2>';
    echo '<ul>';
    echo '<li><strong>Socio m&aacute;s activo:</strong> ' . htmlspecialchars($sociosTopTexto, ENT_QUOTES, 'UTF-8') . ' (' . $globales['socio_mas_activo_minutos'] . ' minutos)</li>';
    echo '<li><strong>Actividad m&aacute;s popular:</strong> ' . htmlspecialchars($actividadesTopTexto, ENT_QUOTES, 'UTF-8') . ' (' . $globales['actividad_mas_popular_sesiones'] . ' sesiones)</li>';
    echo '<li><strong>Instructor m&aacute;s solicitado:</strong> ' . htmlspecialchars($instructoresTopTexto, ENT_QUOTES, 'UTF-8') . ' (' . $globales['instructor_mas_solicitado_sesiones'] . ' sesiones)</li>';
    echo '<li><strong>Promedio de minutos por sesi&oacute;n:</strong> ' . $promedioFormateado . ' minutos</li>';
    echo '<li><strong>Resumen del conjunto de datos:</strong> ' . $globales['total_registros'] . ' registros procesados de ' . $globales['total_socios'] . ' socios diferentes (' . $globales['total_minutos'] . ' minutos totales).</li>';
    echo '</ul>';
    echo '</section>';
}