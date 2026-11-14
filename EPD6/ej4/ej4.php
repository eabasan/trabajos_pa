<!DOCTYPE html>
<!--
Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
Click nbfs://nbhost/SystemFileSystem/Templates/Project/PHP/PHPProject.php to edit this template
-->
<html>
    <head>
        <meta charset="UTF-8">
        <title>Ejercicio 4: Inventario de Almacen</title>
    </head>
    <body>
        <h1>Búsqueda de Stock en Almacén</h1>

        <?php
        // vector
        $tabla = array(
            1 => array(
                'a' => array(
                    array('CCFWT-000500', 7),
                    array('CCFWT-005000', 5),
                    array('CCT-025000', 8)
                ),
                'b' => array(
                    array('COS-025000', 5)
                ),
                'c' => array(
                    array('COS-025000', 9),
                    array('CCT-025000', 1),
                    array('CCT-025000', 8)
                )
            ),
            2 => array(
                'a' => array(
                    array('CCT-025000', 8),
                    array('CCT-025000', 9)
                )
            )
        );

        function buscarProducto($almacen, $skuBuscado) {
            $totalUnidades = 0;

            echo "<h3>Resultados para el SKU: " . $skuBuscado . "</h3>";

            foreach ($almacen as $idPasillo => $estantes) {

                foreach ($estantes as $idEstante => $productos) {
                    $unidadesEnEstante = 0;

                    foreach ($productos as $item) {
                        $sku = $item[0];
                        $cantidad = $item[1];

                        if ($sku === $skuBuscado) {
                            $unidadesEnEstante += $cantidad;
                        }
                    }

                    if ($unidadesEnEstante > 0) {
                        echo "Pasillo " . $idPasillo . " - Estante " . $idEstante . " - " . $unidadesEnEstante . " unidades<br/>";
                        $totalUnidades += $unidadesEnEstante;
                    }
                }
            }

            if ($totalUnidades === 0) {
                echo "No se ha encontrado stock para el producto indicado.<br/>";
            } else {
                echo "<strong>Total: " . $totalUnidades . " unidades de " . $skuBuscado . "</strong><br/>";
            }

            return $totalUnidades;
        }

        //Prueba con el ejemplo de la epd
        buscarProducto($tabla, "CCT-025000");

        echo "<hr/>";

        // Otra prueba con otro SKU
        buscarProducto($tabla, "COS-025000");
        ?>
    </body>
</html>
