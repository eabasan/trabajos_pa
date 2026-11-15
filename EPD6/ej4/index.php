<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="ISO-8859-1">
    <title>EPD 6 - Ejercicio 4: Inventario de Almac&eacute;n</title>
    <style>
        body {
            font-family: Arial, Helvetica, sans-serif;
            background-color: #f4f6f9;
            color: #333333;
            margin: 20px;
        }
        .contenedor {
            max-width: 750px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 25px;
            border-radius: 6px;
            border: 1px solid #cccccc;
        }
        h1, h2 {
            color: #1a237e;
            margin-top: 0;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        th, td {
            border: 1px solid #cccccc;
            padding: 8px 12px;
            text-align: left;
        }
        th {
            background-color: #e8eaf6;
        }
        .resultado-busqueda {
            background-color: #f9f9f9;
            border-left: 4px solid #1a237e;
            padding: 15px 20px;
            margin-top: 15px;
            line-height: 1.6;
        }
        .total {
            font-weight: bold;
            color: #1a237e;
            margin-top: 8px;
        }
    </style>
</head>
<body>
    <div class="contenedor">
        <h1>Gesti&oacute;n de Inventario de Almac&eacute;n</h1>
        <?php
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
                    array('CCT-025000', 9)
                )
            ),
            2 => array(
                'a' => array(
                    array('CCT-025000', 1),
                    array('CCT-025000', 8),
                    array('CCT-025000', 8)
                )
            )
        );
        function buscarProducto($almacen, $skuBuscado) {
            $localizaciones = array();
            $totalUnidades = 0;
            $pasillos = array_keys($almacen);
            for ($i = 0; $i < count($pasillos); $i++) {
                $idPasillo = $pasillos[$i];
                $estantes = array_keys($almacen[$idPasillo]);
                for ($j = 0; $j < count($estantes); $j++) {
                    $idEstante = $estantes[$j];
                    $productosEstante = $almacen[$idPasillo][$idEstante];
                    $subtotalEstante = 0;
                    for ($k = 0; $k < count($productosEstante); $k++) {
                        $skuActual = $productosEstante[$k][0];
                        $cantidadActual = $productosEstante[$k][1];
                        if ($skuActual === $skuBuscado) {
                            $subtotalEstante += $cantidadActual;
                        }
                    }
                    if ($subtotalEstante > 0) {
                        $localizaciones[] = array(
                            'pasillo' => $idPasillo,
                            'estante' => $idEstante,
                            'unidades' => $subtotalEstante
                        );
                        $totalUnidades += $subtotalEstante;
                    }
                }
            }
            return array(
                'sku' => $skuBuscado,
                'localizaciones' => $localizaciones,
                'total' => $totalUnidades
            );
        }
        function mostrarResultadoBusqueda($resultado) {
            echo '<div class="resultado-busqueda">';
            echo '<strong>B&uacute;squeda de SKU:</strong> ' . $resultado['sku'] . '<br/><br/>';
            if ($resultado['total'] > 0) {
                $locs = $resultado['localizaciones'];
                for ($i = 0; $i < count($locs); $i++) {
                    echo 'Pasillo ' . $locs[$i]['pasillo'] . ' Estante ' . $locs[$i]['estante'] . ' - ' . $locs[$i]['unidades'] . ' unidades<br/>';
                }
                echo '<div class="total">Total: ' . $resultado['total'] . ' unidades de ' . $resultado['sku'] . '</div>';
            } else {
                echo 'No se han encontrado unidades en stock para el producto ' . $resultado['sku'] . '.';
            }
            echo '</div>';
        }
        ?>
        <h2>Contenido Actual del Almac&eacute;n</h2>
        <table>
            <thead>
                <tr>
                    <th>ID del pasillo</th>
                    <th>ID del estante</th>
                    <th>SKU del producto</th>
                    <th>Cantidad en stock</th>
                </tr>
            </thead>
            <tbody>
                <?php
                $pasillos = array_keys($tabla);
                for ($i = 0; $i < count($pasillos); $i++) {
                    $p = $pasillos[$i];
                    $estantes = array_keys($tabla[$p]);
                    for ($j = 0; $j < count($estantes); $j++) {
                        $e = $estantes[$j];
                        $items = $tabla[$p][$e];
                        for ($k = 0; $k < count($items); $k++) {
                            echo '<tr>';
                            echo '<td>' . $p . '</td>';
                            echo '<td>' . $e . '</td>';
                            echo '<td>' . $items[$k][0] . '</td>';
                            echo '<td>' . $items[$k][1] . '</td>';
                            echo '</tr>';
                        }
                    }
                }
                ?>
            </tbody>
        </table>
        <h2>Consulta de Stock por SKU</h2>
        <?php
        $resultado1 = buscarProducto($tabla, 'CCT-025000');
        mostrarResultadoBusqueda($resultado1);
        $resultado2 = buscarProducto($tabla, 'COS-025000');
        mostrarResultadoBusqueda($resultado2);
        $resultado3 = buscarProducto($tabla, 'SKU-INEXISTENTE');
        mostrarResultadoBusqueda($resultado3);
        ?>
    </div>
</body>
</html>