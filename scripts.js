$(document).ready(function () {

    /**
     * Variable para almacenar la gramática
     */
    var gfc = [];

    /**
     * Función de JQuery utilizada para añadir una nueva producción a una variable No-Terminal
     */
    $(document).on('click', '.btn-add-production', function () {
        var id = $(this).data('production');
        var newproduction = $('.noterminal-' + id).children().last().prev().data('production') + 1;
        $('<input type="text" class="production ml-2" data-production="' + newproduction + '" style="width: 5%;">').insertBefore('#addProductions' + id);
    });

    /**
     * Función de JQuery utilizada para añadir una nueva variable No-Terminal
     */
    $(document).on('click', '.btn-add-noterminal', function () {
        var id = $(this).data('noterminal');
        $(this).data('noterminal', (id + 1));
        $('<div class="mt-1 inp noterminal-' + id + ' style="margin-top: 1.8rem;"> <input type="text" class="text-center production noterminalindex" style="width: 2.5%; margin-right: 1.8rem;"><button style="margin-left: 1.2rem;" class="btn-add-production" id="addProductions' + id + '" data-production="' + id + '">+</button></div>').insertBefore('.btn-add-noterminal');
    });

    /**
     * Función de JQuery utilizada enteramente para ejecutar el algoritmo CYK con bucles
     */
    $('#btn-startCYK').click(function () {
        var chainArr = $('#chain').val().split("");
        for (var c = 1; c <= document.getElementsByClassName("inp").length; c++) {
            var produccionesTemp = $(".noterminal-" + c).find(".production");
            var tempArrProductions = [];
            for (var i = 0; i < produccionesTemp.length; i++) {
                tempArrProductions.push(produccionesTemp[i].value);
            }
            gfc.push(tempArrProductions);
        }
        var matrix = [];
        for (var c = 0; c < chainArr.length; c++) {
            matrix.push([]);
        }
        console.log(gfc);
        for (var j = 0; j < chainArr.length; j++) {
            console.log("J: " + j);
            var k = chainArr.length - j;
            for (var i = 0; i < k; i++) {
                if (j == 0) {
                    matrix[i][j] = searchP(chainArr[i]);
                }
                else {
                    console.log("I: " + i);
                    var z = j - 1;
                    var arrTempZ = "";
                    for (var v = 0; v <= z; v++) {
                        console.log("K: " + v);
                        if (matrix[i][v] != null && matrix[i][v] != undefined) {
                            v += 1;
                            if (matrix[i + v][j - v] != null && matrix[i + v][j - v] != undefined) {
                                v -= 1;
                                var arr1 = matrix[i][v].split("");
                                v += 1;
                                var arr2 = matrix[i + v][j - v].split("");
                                for (var g = 0; g < arr1.length; g++) {
                                    for (var b = 0; b < arr2.length; b++) {
                                        var tempSearch = "";
                                        tempSearch += arr1[g] + arr2[b];
                                        console.log("Searching: " + tempSearch);
                                        var res = searchP(tempSearch);
                                        console.log("Conjunto encontrado con b = " + b + " es: " + res);
                                        if (res != null) {
                                            arrTempZ += res;
                                        }
                                    }
                                }
                                v -= 1;
                            } else {
                                console.log("Alguno no comparable, index: " + i + " " + v + " - " + (i + v) + " " + (j - v));
                            }
                        } else {
                            console.log("Alguno no comparable, index: " + i + " " + v + " - " + (i + v) + " " + (j - v));
                        }
                    }
                    arrTempX = arrTempZ.split("");
                    arrTempY = "";
                    for (var c = 0; c < arrTempX.length; c++) {
                        if (!arrTempY.includes(arrTempX[c])) {
                            arrTempY += arrTempX[c];
                        }
                    }
                    matrix[i][j] = arrTempY;
                }
            }
        }

        /**
         * Variable para almacenar la tabla informativa con el resultado final
         */
        var table = "";

        /**
         * Comienza la creación de la tabla para ser insertada en la página
         */
        table += ('<div class="container text-center mt-5"><table class="table table-striped table-bordered table-dark"><thead class="text-light"><tr>');
        table += ('<th></th>');
        for (var j = 0; j < chainArr.length; j++) {
            table += ('<th scope="col">J=' + (j + 1) + '</th>');
            if (j == chainArr.length - 1) {
                table += ('</tr></thead><tbody>');
            }
        }
        for (var j = 0; j < chainArr.length; j++) {
            table += ('<tr>');
            for (var i = 0; i < chainArr.length - j; i++) {
                if (i == 0) {
                    table += ('<th scope="row">I=' + (chainArr.length - j) + '</th>');
                }
                table += ('<th>' + matrix[j][i] + '</th>');
            }
            table += ('</tr>');
        }
        table += ('</tbody></table>');
        if (arrTempY.includes('S')) {
            table += ('<span class="badge badge-info"style="font-size:20px;">La cadena: ' + chainArr + ' Si puede ser generada ya que S pertenece al último conjunto</span>');
        } else {
            table += ('<span class="badge badge-danger"style="font-size:20px;">La cadena: ' + chainArr + ' No puede ser generada ya que S no pertenece al último conjunto</span>');
        }
        $('.body').append(table);
        console.log(matrix);
    });

    /**
     * Método para buscar una cadena en toda la gramática y retorna en qué producciones se encuentra
     * @param {Cadena a buscar en las producciones} s 
     * @returns Variable No-Terminal donde se encuentra la cadena o coincidencia
     */
    function searchP(s) {
        var arrCoincidences = "";
        for (var c = 0; c < gfc.length; c++) {
            for (var i = 1; i < gfc[c].length; i++) {
                if (s == "AC") {
                    console.log(gfc[c][i]);
                }
                if (gfc[c][i].includes(s)) {
                    if (!arrCoincidences.includes(gfc[c][0])) {
                        arrCoincidences += gfc[c][0];
                    }
                    break;
                }
            }
        }
        if (arrCoincidences.length == 0) {
            return null;
        }
        return arrCoincidences;
    }

});