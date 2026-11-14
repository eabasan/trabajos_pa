<!DOCTYPE html>
<!--
Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
Click nbfs://nbhost/SystemFileSystem/Templates/Project/PHP/PHPProject.php to edit this template
-->
<html>
    <head>
        <meta charset="UTF-8">
        <title></title>
    </head>
    <body>
        <?php

        function generarCodigoActividad($actividad, $longitud) {
            if ($longitud < 6 || $longitud > 10) {
                return "Error: la longitud debe estar entre 6 y 10";
            }

            $actividadLimpia = preg_replace('/[^A-Za-z0-9]/', '', $actividad);
            $prefijo = strtoupper(substr($actividadLimpia, 0, 3));

            static $codigosGenerados = array();

            do {
                $sufijo = uniqid();
                $codigo = substr($prefijo . $sufijo, 0, $longitud);
            } while (in_array($codigo, $codigosGenerados));

            $codigosGenerados[] = $codigo;

            return $codigo;
        }

        echo generarCodigoActividad("yoga", 8) . "<br>";
        echo generarCodigoActividad("spinning", 10) . "<br>";
        echo generarCodigoActividad("natacion", 6) . "<br>";
        ?>
    </body>
</html>
