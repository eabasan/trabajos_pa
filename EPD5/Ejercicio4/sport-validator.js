(function($){
    $.fn.SportValidator = function(options){
        var settings = $.extend({}, options);

        return this.each(function(){
            var $form = $(this);
            var $fields = $form.find('[data-sport-type]');

            $fields.each(function(){
                var $field = $(this);
                var sportType = $field.data('sport-type');

                // Función para gestionar los mensajes dinámicamente con jQuery
                var mostrarMensaje = function(texto, claseMensaje){
                    // Eliminar mensaje previo vinculado a este campo
                    $field.next('.sport-message').remove();

                    // Crear contenedor div y aplicar métodos jQuery
                    var $msgDiv = $('<div>')
                        .addClass('sport-message')
                        .addClass(claseMensaje)
                        .text(texto);

                    // Insertar después del campo actual
                    $msgDiv.insertAfter($field);
                };

                // Lógica de validación por tipo de campo deportivo
                var validarCampo = function(){
                    var valor = $field.val().trim();
                    var esValido = false;
                    var mensaje = '';
                    var claseEstiloMensaje = '';
                    var claseEstiloCampo = '';

                    // Uso de código de escape unicode en los elementos con tilde o con ñ
                    switch(sportType){
                        case 'nombre':
                            if(valor.length < 2){
                                mensaje = 'El nombre debe tener al menos 2 caracteres';
                                claseEstiloMensaje = 'sport-error';
                                claseEstiloCampo = 'sport-invalid';
                            }else if (valor.length > 50){
                                mensaje = 'El nombre es demasiado largo para el sistema';
                                claseEstiloMensaje = 'sport-error';
                                claseEstiloCampo = 'sport-invalid';
                            }else{
                                esValido = true;
                                mensaje = 'Nombre v\u00e1lido para inscripci\u00f3n';
                                claseEstiloMensaje = 'sport-success';
                                claseEstiloCampo = 'sport-valid';
                            }
                            break;

                        case 'email':
                            var regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                            if(!regexEmail.test(valor)){
                                mensaje = 'Formato de email incorrecto';
                                claseEstiloMensaje = 'sport-error';
                                claseEstiloCampo = 'sport-invalid';
                            }else{
                                esValido = true;
                                mensaje = 'Email de contacto correcto';
                                claseEstiloMensaje = 'sport-success';
                                claseEstiloCampo = 'sport-valid';
                            }
                            break;

                        case 'edad':
                            var numeroEdad = Number(valor);
                            if(valor === '' || isNaN(numeroEdad) || !Number.isInteger(numeroEdad)){
                                mensaje = 'Introduce un n\u00famero entero v\u00e1lido';
                                claseEstiloMensaje = 'sport-error';
                                claseEstiloCampo = 'sport-invalid';
                            }else if (numeroEdad < 16){
                                mensaje = 'Edad m\u00ednima: 16 a\u00f1os';
                                claseEstiloMensaje = 'sport-error';
                                claseEstiloCampo = 'sport-invalid';
                            }else if (numeroEdad > 65){
                                mensaje = 'Edad m\u00e1xima: 65 a\u00f1os';
                                claseEstiloMensaje = 'sport-error';
                                claseEstiloCampo = 'sport-invalid';
                            }else{
                                esValido = true;
                                mensaje = 'Edad apropiada para actividades';
                                claseEstiloMensaje = 'sport-success';
                                claseEstiloCampo = 'sport-valid';
                            }
                            break;

                        case 'actividad':
                            if(valor === ''){
                                mensaje = 'Debes elegir una actividad deportiva';
                                claseEstiloMensaje = 'sport-error';
                                claseEstiloCampo = 'sport-invalid';
                            }else{
                                esValido = true;
                                mensaje = 'Actividad seleccionada';
                                claseEstiloMensaje = 'sport-success';
                                claseEstiloCampo = 'sport-valid';
                            }
                            break;

                        case 'experiencia':
                            if(valor === ''){
                                mensaje = 'Selecciona tu nivel de experiencia';
                                claseEstiloMensaje = 'sport-warning';
                                claseEstiloCampo = 'sport-invalid';
                            }else{
                                esValido = true;
                                mensaje = 'Nivel de experiencia registrado';
                                claseEstiloMensaje = 'sport-success';
                                claseEstiloCampo = 'sport-valid';
                            }
                            break;
                    }

                    // Actualizar clases visuales del campo
                    $field.removeClass('sport-valid sport-invalid sport-pending')
                          .addClass(claseEstiloCampo);

                    // Mostrar mensaje dinámico
                    mostrarMensaje(mensaje, claseEstiloMensaje);

                    return esValido;
                };

                // Vincular eventos mediante .on() de jQuery (sin usar atributos inline)
                $field.on('focus', function(){
                    $field.removeClass('sport-valid sport-invalid sport-pending')
                          .addClass('sport-pending');
                });

                $field.on('input change', function(){
                    validarCampo();
                });

                $field.on('blur', function(){
                    validarCampo();
                });
            });
        });
    };
})(jQuery);