var actualizarDatos = null,
    cargardatos = null,
    actualizarDoc = null,
    logoff = null,
    ObtenerPrecio = null,
    iniciarOpe = null,
    btnRetroceder = null,
    btnContinuar = null,
    btnResumen = null,
    getDataBancos = null,
    selectDepartamento = null,
    guardarCuenta = null,
    listarCuentas = null,
    editarCuenta = null,
    activarCuenta = null,
    eliminarCuenta = null,
    anularCuenta = null,
    mejorarPromo = null,
    validarCambio = null,
    listarOperaciones = null,
    formaterFecha = null,
    sort = null,
    opendialog = null,
    infoCliente = null,
    setInputFilter = null,
    tag = false,
    limpiarCampos = null,
    getIdCuenta = null,
    obtenerInformacion = null,
    cambiarContraseña = null,
    copiarCuenta = null,
    iBanner = true,
    cerrarAnuncio = null,
    getMovimientos = null,
    cuentasVisibles = null;
$(document).ready(function () {
    // tag for edit
    var idCuenta;
    var URLORIGIN = "http://localhost/webapi";

    // operation regex -- codigoValidacion
    var r_number = /^[0-9]*$/
    var r_texto = /^[a-zA-Z\s]*$/
    var r_pass = /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/;
    var r_mail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    var code = JSON.parse(sessionStorage.getItem("userData"));

    obtenerInformacion = function (code) {
        console.log("consultando info...")
        get(URLORIGIN + "/Usuario?Id=" + code)
            .then(function (response) {
                var result = response;
                console.log("revisa el log")
            })
            .catch(function (e) {
                console.log(e);
            })

    }

    infoCliente = function (value) {
        document.getElementById("nameUser").innerHTML = '<i class="fa fa-user-circle" aria-hidden="true"></i> ' + value.nombre + " " + value.primerApellido;
    }
    // retunr login
    if (code == null) {
        return window.location.href = window.location.origin + "/vistas/Login.html";
    }
    infoCliente(code)
    if ((code.estado == "1")) {
        infoCliente(code);
    } else if ((code.estado) == "0") {

        validarCodigo();
    }

    function validarCodigo() {
        var cuenta = new FormData();
        var info = JSON.parse(sessionStorage.getItem("userData"))
        cuenta.append("activarCuenta", info.coUsuario)
        var dato = prompt("tienes que activar tu cuenta, ingresa el codigo de verificacion");
        console.log(dato);
        cuenta.append("clave", dato);
        var obj = {
            method: 'POST',
            body: cuenta
        };

        post(URLORIGIN + "/Login", obj)
            .then(function (response) {
                if (response.mensaje === "Confirmar") {
                    validarCodigo();
                    // infoCliente(code);
                }
                if (response.mensaje === "Cuenta activada") {
                    obtenerInformacion(info.coUsuario);
                    info.estado = 1;
                    sessionStorage.setItem("userData", JSON.stringify(info));
                }
            })
    }
    ObtenerPrecio = function () {

        var ObjMoneda = {};
        get(URLORIGIN + "/Promociones")
            .then(function (response) {
                console.log(response)
                ObjMoneda.Compra = response[0].precio;
                ObjMoneda.idCompra = response[0].coPromociones;
                ObjMoneda.Venta = response[1].precio;
                ObjMoneda.idVenta = response[1].coPromociones;
                sessionStorage.setItem("mercado", JSON.stringify(ObjMoneda))
                document.getElementById("boxprecio").innerText = "Compra: " + ObjMoneda.Compra + " | Venta: " + ObjMoneda.Venta;
                document.getElementById("preciodolar").innerHTML = "Compra: " + ObjMoneda.Compra + " || Venta: " + ObjMoneda.Venta
            })

    }

    ObtenerPrecio();

    var moneda = JSON.parse(sessionStorage.getItem("mercado"));

    function listarcuentaEmpresa(value) {
        // debugger;

        var cuentaPeru = document.getElementById("cuentaPeruCambio");

        for (let i = cuentaPeru.length - 1; i == 1; i--) {
            cuentaPeru.remove(i);

        }
        get(URLORIGIN + "/cuentaEmpresa")
            .then(function (response) {
                console.log(response);

                var data = response;

                data.forEach(function (element) {
                    var op = document.createElement("option");
                    if (value == "USD") {
                        if (element.moneda == "USD $") {
                            op.text = element.noCuenta + " " + element.nuCuenta + " (" + element.moneda + ")";
                            op.value = element.coCuentaE;
                            cuentaPeru.appendChild(op);
                        }
                    } else {
                        if (element.moneda == "PEN S/") {
                            op.text = element.noCuenta + " " + element.nuCuenta + " (" + element.moneda + ")";
                            op.value = element.coCuentaE;
                            cuentaPeru.appendChild(op);
                        }
                    }

                })
            })
    }

    function listarTarjetasOperacion(value) {
        var nroCuenta = document.getElementById("nroCuenta");
        nroCuenta.options.length = 1;
        // debugger;
        var form = new FormData();
        form.append("coUsuario", code.coUsuario);
        var obj = {
            method: 'POST',
            body: form
        }

        post(URLORIGIN + "/Tarjeta", obj)
            .then(function (response) {
                var data = response;
                if (response.mensaje == "No hay elementos registrados") {
                    console.log(response.mensaje);
                } else {

                    // do {
                    //     for (var i = nroCuenta.length - 1; i == 1; i--) {
                    //         nroCuenta.remove(i);
                    //     }
                    // } while (nroCuenta.length == 1);

                    data.forEach(function (element) {
                        var option = document.createElement("option");
                        if (value == "USD") {
                            if (element.moneda == "PEN S/") {
                                option.text = element.nombre + ' ' + element.numeroCuenta + ' (' + element.alias + ')';
                                option.value = element.coCuenta;
                                nroCuenta.appendChild(option);
                            }
                        } else {
                            if (element.moneda == "USD $") {
                                option.text = element.nombre + ' ' + element.numeroCuenta + ' (' + element.alias + ')';
                                option.value = element.coCuenta;
                                nroCuenta.appendChild(option);
                            }
                        }
                    })
                }

            })

    }
    // validate input with regex
    setInputFilter = function (textbox, inputFilter) {
        ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function (event) {
            textbox.addEventListener(event, function () {

                if (inputFilter(this.value)) {
                    this.oldValue = this.value;
                } else if (this.hasOwnProperty("oldValue")) {
                    this.value = this.oldValue;
                } else {
                    this.value = "";
                }
            });
        });
    }
    selectDepartamento = function (code) {

        if (code) {

            var selectprovincia = document.getElementById("idprovincias");

            if (selectprovincia.length > 1) {
                for (var i = selectprovincia.length - 1; i >= 1; i--) {
                    selectprovincia.remove(i);
                }
            }
            get(URLORIGIN + "/Ubicacion?Id=" + code)
                .then(function (response) {
                    var data = response;
                    data.forEach(function (element) {
                        var option = document.createElement("option");
                        option.value = element.coProvincia;
                        option.appendChild(document.createTextNode(element.nombre));
                        selectprovincia.appendChild(option);
                    });
                })
        }

    }
    limpiarCampos = function () {
        tag = false;
        document.getElementById("alias").value = "";
        document.getElementById("nCuenta").value = "";
        document.getElementById("CCI").value = "";
        document.getElementById("CCI").value = "";
        document.getElementById("idNroDocumento").value = "";
        document.getElementById("nombreDocumento").value = "";
        document.getElementById("selectBaco").children[0].selected = true;
        document.getElementById("idDepartamento").children[0].selected = true;
        document.getElementById("idprovincias").children[0].selected = true;
        document.getElementById("selectBaco").children[0].selected = true;
        document.getElementById("selectMoneda").children[0].selected = true;
    }
    guardarCuenta = function () {

        var alias = document.getElementById("alias").value;
        var moneda = document.getElementById("selectMoneda");
        var tipomoneda = moneda.options[moneda.selectedIndex].value;
        var banco = document.getElementById("selectBaco");
        var nbanco = banco.options[banco.selectedIndex].value;
        var nCuenta = document.getElementById("nCuenta").value;
        var nCCI = document.getElementById("CCI").value;
        var numDoc = document.getElementById("idNroDocumento").value;
        var nomDoc = document.getElementById("nombreDocumento").value;
        var departamento = document.getElementById("idDepartamento");
        var ndepartamento = departamento.options[departamento.selectedIndex].value;

        var provincia = document.getElementById("idprovincias");
        var nprovincia = provincia.options[provincia.selectedIndex].value;
        var form = new FormData();
        // debugger;

        if ((moneda && tipomoneda && nbanco != "[Seleccione]" && nCuenta &&
                nCCI && numDoc && nomDoc && ndepartamento != "[Seleccione]" && nprovincia != "[Seleccione]")) {

            form.append("alias", alias);
            form.append("nuIdentificacion", numDoc);
            form.append("noIdentificacion", nomDoc);
            form.append("moneda", tipomoneda);
            form.append("coBanco", nbanco);
            form.append("numeroCuenta", nCuenta);
            form.append("cci", nCCI);
            form.append("coDepartamento", ndepartamento);
            form.append("coProvincia", nprovincia);

            if (!tag) {
                // registro de tarjeta
                form.append("Id", code.coUsuario);
            } else {
                // edicion de tarjeta
                console.log(idCuenta);
                form.append("IdCuentaM", idCuenta)
            }
            var obj = {
                method: 'POST',
                body: form
            }
            post(URLORIGIN + "/Tarjeta", obj)
                .then(function (response) {
                    if (response.mensaje) {
                        if ((response.mensaje == "Cuenta registrada" &&
                                !(document.title == "Operaciones")) ||
                            response.mensaje == "Cuenta actualizada") {
                            listarCuentas();
                        } else if (document.title == "Operaciones") {
                            var tipoCambio = document.getElementById("tipoDolares").innerText;
                            listarTarjetasOperacion(tipoCambio);
                        }
                    }
                    alert(response.mensaje)

                    idCuenta = null;
                    tag = false;
                })
            limpiarCampos();

        } else {
            alert("Complete los campos")
        }
    }
    getDataBancos = function () {
        var selectdep = document.getElementById("idDepartamento");
        get(URLORIGIN + "/Ubicacion")
            .then(function (response) {
                var data = response;
                data.forEach(function (element) {
                    var option = document.createElement("option");
                    option.value = element.coDepartamento;
                    option.appendChild(document.createTextNode(element.Nombre));
                    selectdep.appendChild(option);
                });

            })
        var selectBancos = document.getElementById("selectBaco");
        get(URLORIGIN + "/Banco")
            .then(function (response) {
                var data = response;
                data.forEach(function (element) {
                    var option = document.createElement("option");
                    option.value = element.coBanco;
                    option.appendChild(document.createTextNode(element.nombre));
                    selectBancos.appendChild(option);
                })
            })
    }
    opendialog = function () {
        // console.log("click")
        if (document.getElementById("divprecio").style.visibility == 'hidden') {
            document.getElementById("divprecio").style.visibility = "visible";
        } else {
            document.getElementById("divprecio").style.visibility = "hidden";
        }

    }
    eliminarCuenta = function (e) {

        var id = sessionStorage.getItem("codigocuenta", id);
        $('#alertaEliminacion').modal('hide')
        $("#tbody").empty();

        var form = new FormData();
        form.append("DeleteCuenta", id);
        var obj = {
            method: 'POST',
            body: form
        }
        post(URLORIGIN + "/Tarjeta", obj)
            .then(function (response) {
                console.log(response);
                listarCuentas();
                sessionStorage.removeItem("codigocuenta");

            })
    }
    getIdCuenta = function (e) {
        var id = e.parentElement.parentElement.parentElement.getAttribute("id");
        sessionStorage.setItem("codigocuenta", id);
    }
    listarCuentas = function () {

        $("#tbody").empty();
        var form = new FormData();
        form.append("coUsuario", code.coUsuario);
        var obj = {
            method: 'POST',
            body: form
        }
        post(URLORIGIN + "/Tarjeta", obj)
            .then(function (response) {
                var data = response;
                var tbody = document.getElementById("tbody");
                if (response.mensaje == "No hay elementos registrados") {
                    console.log(response.mensaje)
                } else {
                    var showRow = 1;
                    data.forEach(function (element) {
                        // showRow++;
                        var tr = document.createElement("tr");
                        tr.setAttribute("id", element.coCuenta)
                        tr.insertCell(0).innerHTML = element.alias;
                        tr.insertCell(1).innerHTML = element.moneda;
                        tr.insertCell(2).innerHTML = element.nombre;
                        tr.insertCell(3).innerHTML = element.numeroCuenta;
                        tr.insertCell(4).innerHTML = element.cci;
                        tr.insertCell(5).innerHTML = element.ubicacion;
                        var estado = (element.activo == 0) ? "SUSPENDIDO" : "ACTIVO";
                        tr.insertCell(6).innerHTML = `<span class = 'badge badge-${(element.activo == 0 ) ? "danger":"primary"} text-wrap' > ${estado} </span>`;
                        tr.insertCell(7).innerHTML = `<div class='d-flex'>
                            <a title='Activar Cuenta' style='display:${(element.activo ==0)?"block":"none" }' onclick='activarCuenta(this);' class="btn btn-light"><i class="fa fa-retweet" aria-hidden="true"></i></a>
                            <a  title='Editar Cuenta' style='display:${(element.activo ==0)?"none":"block" }' onclick='editarCuenta(this);' class="btn btn-light"><i class=" fa fa-pencil-square-o"
                            aria-hidden="true"></i></a>
                            <a  title='Anular Cuenta' style='display:${(element.activo ==0)?"none":"block" }' onclick='anularCuenta(this);' class="btn btn-light"><i class="fa fa-ban"
                            aria-hidden="true"></i></a>
                            <a  title='Movimientos de Cuenta' onclick='getMovimientos(this);' data-toggle='modal' data-target='#OpenLista'  class="btn btn-light"><i class="fa fa-money" aria-hidden="true"></i></a>
                            <a  title='Eliminar Cuenta' onclick='getIdCuenta(this);' data-toggle='modal' data-target='#alertaEliminacion'  class="btn btn-light"><i class="fa fa-trash-o"
                            aria-hidden="true"></i></a>
                            </div>`;
                        tbody.appendChild(tr);
                    })
                }
            })
    }
    if (window.location.pathname == "/vistas/Intranet/Perfil.html" || document.title == "Perfil") {
        cambiarContraseña = function () {
            var passact = document.getElementById("passtagPerfil").value;
            var newpass = document.getElementById("nuevpasstagPerfil").value;
            var newpassconf = document.getElementById("nuevpasstagPerfilConfi").value;

            var datos = JSON.parse(localStorage.getItem("datosusuario"));
            var data = new FormData();
            if (passact == datos.pass) {
                if (r_pass.test(newpass) && r_pass.test(newpassconf)) {
                    if (newpass === newpassconf) {

                        data.append("cambioClave", code.coUsuario);
                        data.append("clave", newpass);
                        obj = {
                            method: 'POST',
                            body: data
                        }
                        post(URLORIGIN + "/Login", obj)
                            .then(function (response) {
                                console.log(response)
                                alert(response.mensaje)
                            })
                    } else {
                        alert("Ambas contraseñas deben coincidir");
                    }

                } else {
                    alert("PORFAVOR INGRESE LA CONTRASEÑA VALIDA");
                }
            } else {
                alert("La contraseña actual no es la correcta")
            }
        }
        cargardatos = function () {


            get(URLORIGIN + "/Usuario?Id=" + code.coUsuario)
                .then(function (response) {
                    // console.log(response);

                    document.getElementById("nrodni").value = response.dni;
                    document.getElementById("nombres").value = response.nombre;
                    document.getElementById("apPat").value = response.primerApellido;
                    document.getElementById("apMat").value = response.segundoApellido;
                    document.getElementById("email").value = response.correo;
                    document.getElementById("celular").value = response.telefono;

                })
        }
        cargardatos();
        actualizarDatos = function () {


            var data = new FormData();
            var obj = null;
            var nombre = document.getElementById("nombres").value

            var apppat = document.getElementById("apPat").value

            var appmat = document.getElementById("apMat").value

            var correo = document.getElementById("email").value

            var tel = document.getElementById("celular").value
            var dni = document.getElementById("nrodni").value
            if (!r_texto.test(nombre)) {
                alert("Nombre no es valido")
                return false;
            }
            if (!r_texto.test(apppat)) {
                alert(apppat + "no es valido")
                return false;
            }
            if (!r_texto.test(appmat)) {
                alert(appmat + " no es valido")
            }
            if (!r_mail.test(correo)) {
                alert("correo no es valido")
                return false;
            }
            data.append("nombre", nombre);
            data.append("primerApellido", apppat);
            data.append("segundoApellido", appmat);
            data.append("correo", correo);
            data.append("feNacimiento", "00000000");
            data.append("telefono", tel);
            data.append("dni", dni);
            data.append("Id", code.coUsuario);
            obj = {
                method: 'POST',
                body: data
            }
            // debugger;
            post(URLORIGIN + "/Usuario", obj)
                .then(function (response) {
                    console.log("respuesta", response);
                    cargardatos();
                    var obj = JSON.parse(sessionStorage.getItem("userData"))
                    if (response.mensaje == "Usuario Actualizado") {
                        obj.nombre = nombre;
                        obj.primerApellido = apppat;
                        obj.segundoApellido = appmat;

                        sessionStorage.setItem("userData", JSON.stringify(obj))
                        infoCliente(obj)
                        alert(response.mensaje);
                    }
                })
        }
        actualizarDoc = function () {
            var data = new FormData();

            var docActualizado = document.getElementById("docActualizado");
            data.append("updateFoto", code.coUsuario);
            data.append("dni", document.getElementById("nrodni").value);
            data.append("nombre", document.getElementById("nombres").value);
            data.append("imagen", docActualizado.files[0], docActualizado.values);
            var obj = {
                method: 'POST',
                body: data
            }

            post(URLORIGIN + "/Usuario", obj)
                .then(function (response) {
                    console.log("respuesta", response);
                    alert(response.mensaje);

                })
        }
    }

    if (window.location.pathname == "/vistas/Intranet/Operaciones.html" || document.title == "Operaciones") {
        var moneda = JSON.parse(sessionStorage.getItem("mercado"));

        document.getElementById("compraS").classList.add('addfocus');
        document.getElementById("compraS").innerHTML = moneda.Compra;
        document.getElementById("ventaS").innerHTML = moneda.Venta;
        document.getElementById("cambioActual").innerText = `${moneda.Compra}`;
        document.getElementById("cambioActual").setAttribute("codigo", moneda.idCompra);

        getDataBancos();
        cuentasVisibles = function (params) {
            // debugger;
            listarTarjetasOperacion(params);
            listarcuentaEmpresa(params);
        }
        document.getElementById('b1').style.background = "#7CC62A";
        document.getElementById('b1').style.color = "#fff";
        document.getElementById("idDepartamento").addEventListener("change", function (e) {
            var id = e.srcElement.value;
            selectDepartamento(id);
        })
        setInputFilter(document.getElementById("nCuenta"), function (value) {
            return /^\d*$/.test(value);
        });
        setInputFilter(document.getElementById("CCI"), function (value) {
            return /^\d*$/.test(value);
        });
        setInputFilter(document.getElementById("idNroDocumento"), function (value) {
            return /^\d*$/.test(value);
        });
        setInputFilter(document.getElementById("nombreDocumento"), function (value) {
            return /^[a-zA-Z\s]*$/.test(value);
        });

        function cambioPosicionPrecio() {
            var monedasoles = document.getElementById("monedaSoles").value;
            var monedadolares = document.getElementById("moendaDolares").value;
            var tipoSoles = document.getElementById("tipoSoles").innerHTML;
            var tipoDolares = document.getElementById("tipoDolares").innerHTML;
            // document.getElementById("changemoney").style.transform = "rotate(270deg)";
            document.getElementById("changemoney").style.transform = "rotate(270deg)";
            document.getElementById("cambioActual").style.textDecoration = 'none';

            // cambiar las tarjetas

            cuentasVisibles(tipoDolares);
            var promo = document.getElementById("valorPromo");
            if (promo) {
                promo.parentNode.removeChild(promo);
            }
            if (tipoDolares == "USD" && tipoSoles == "PEN") {
                document.getElementById("usd1").style.display = "none";
                document.getElementById("pen1").style.display = "block";

                document.getElementById("usd2").style.display = "block";
                document.getElementById("pen2").style.display = "none";
                $("#monedaSoles").addClass('tamanoinput1');
                $("#monedaSoles").removeClass('tamanoinput2');
                $("#moendaDolares").addClass('tamanoinput2');
                $("#moendaDolares").removeClass('tamanoinput1');


                document.getElementById("boxDolares").children[0].children[1].children[1].children[0].innerHTML = "PEN"
                document.getElementById("boxDolares").children[0].children[0].children[2].value = monedasoles;

                document.getElementById("boxSoles").children[0].children[1].children[1].children[0].innerHTML = "USD"
                document.getElementById("boxSoles").children[0].children[0].children[2].value = Number(monedasoles / moneda.Venta).toFixed(2);
                document.getElementById("cambioActual").innerText = moneda.Venta;
                document.getElementById("cambioActual").setAttribute("codigo", moneda.idVenta);
                document.getElementById("compraS").classList.remove('addfocus');
                document.getElementById("ventaS").classList.add('addfocus');

            } else {
                document.getElementById("usd1").style.display = "block";
                document.getElementById("pen1").style.display = "none";

                document.getElementById("pen2").style.display = "block";
                document.getElementById("usd2").style.display = "none";

                $("#moendaDolares").addClass('tamanoinput1');
                $("#moendaDolares").removeClass('tamanoinput2');
                $("#monedaSoles").addClass('tamanoinput2');
                // $("#monedaSoles").removeClass('tamanoinput1');


                document.getElementById("boxSoles").children[0].children[1].children[1].children[0].innerHTML = "PEN"
                document.getElementById("boxDolares").children[0].children[0].children[2].value = monedasoles;
                // debugger;
                
                document.getElementById("boxDolares").children[0].children[1].children[1].children[0].innerHTML = "USD"
                document.getElementById("boxSoles").children[0].children[0].children[2].value = Number(monedadolares * moneda.Compra).toFixed(2);
                document.getElementById("cambioActual").innerText = moneda.Compra;
                document.getElementById("cambioActual").setAttribute("codigo", moneda.idCompra);
                document.getElementById("ventaS").classList.remove('addfocus');
                document.getElementById("compraS").classList.add('addfocus');
            }
        }

        mejorarPromo = function () {
            var data = new FormData();
            var tipo = (document.getElementById("tipoDolares").innerText == 'USD') ? 'Compra' : 'Venta';
            console.log(tipo);
            data.append("mejora", code.coUsuario);
            data.append("tipo", tipo);
            var obj = {
                method: 'POST',
                body: data
            }
            post(URLORIGIN + "/Operacion", obj)
                .then(function (response) {
                    console.log(response);

                    var promo = document.getElementById("valorPromo");
                    if (promo) {
                        promo.parentNode.removeChild(promo);
                    }
                    var s = document.createElement("strong");
                    s.setAttribute("id", "valorPromo");
                    if (response.mensaje) {
                        s.innerText = response.mensaje;
                    } else {
                        s.setAttribute("codigo", response.coPromociones);
                        s.innerText = response.precio;
                        document.getElementById("cambioActual").style.textDecoration = "line-through";
                    }
                    document.getElementById("tipoCambioUsado").appendChild(s);
                    // document.getElementById("btnMejorarPromo").setAttribute("disabled", true);
                    $("")
                })
        }

        document.getElementById("compraS").addEventListener("click", cambioPosicionPrecio)
        document.getElementById("ventaS").addEventListener("click", cambioPosicionPrecio)
        document.getElementById("monedaSoles").addEventListener("keyup", function (e) {

            var soles = e.srcElement.value

            if (soles != 0 && soles >= 1) {
                document.getElementById("inicioOperacion").removeAttribute('disabled')
            } else {
                document.getElementById("inicioOperacion").setAttribute('disabled', '')
            }
            var tipmoneda = document.getElementById("tipoSoles").innerHTML;
            // yo compro dolares
            if (tipmoneda === "PEN") {
                document.getElementById("moendaDolares").value = (Number(soles) / moneda.Compra).toFixed(2);
            }
            // yo compro vendo 
            if (tipmoneda === "USD") {
                document.getElementById("moendaDolares").value = (Number(soles) * moneda.Venta).toFixed(2);
            }
        });
        document.getElementById("moendaDolares").addEventListener("keyup", function (e) {

            var dolares = e.srcElement.value

            if (dolares != 0 && dolares >= 1) {
                document.getElementById("inicioOperacion").removeAttribute('disabled')
            } else {
                document.getElementById("inicioOperacion").setAttribute('disabled', '')
            }
            var tipmoneda = document.getElementById("tipoDolares").innerHTML;

            // console.log(tipmoneda);
            if (tipmoneda === "USD") {
                // console.log("vendes")
                document.getElementById("monedaSoles").value = (Number(dolares) * moneda.Compra).toFixed(2);
            }
            if (tipmoneda === "PEN") {
                document.getElementById("monedaSoles").value = (Number(dolares) / moneda.Venta).toFixed(2);
            }
        }, false);
        document.getElementById("changemoney").addEventListener("click", cambioPosicionPrecio);
        document.getElementById("checkTerminos").addEventListener("change", function (e) {
            if (document.getElementById("checkTerminos").checked) {
                $("#btngrabar").removeAttr("disabled");
            }
        })
    }
    // if(){
    if (window.location.pathname == "/vistas/Intranet/CuentasBancarias.html" || document.title == "Cuentas Bancarias") {
        // console.log("estamos aqui")
        getDataBancos();
        listarCuentas();
        document.getElementById("idDepartamento").addEventListener("change", function (e) {
            var id = e.srcElement.value;
            selectDepartamento(id);
        })
        setInputFilter(document.getElementById("nCuenta"), function (value) {

            return /^\d*$/.test(value);
        });
        setInputFilter(document.getElementById("CCI"), function (value) {

            return /^\d*$/.test(value);
        });
        setInputFilter(document.getElementById("idNroDocumento"), function (value) {

            return /^\d*$/.test(value);
        });
        setInputFilter(document.getElementById("nombreDocumento"), function (value) {

            return /^[a-zA-Z\s\.]*$/.test(value);
        });
        $("#nav-listAccount-tab").on("click", function () {
            document.getElementById("alias").value = "";
            document.getElementById("nCuenta").value = "";
            document.getElementById("CCI").value = "";
            document.getElementById("idNroDocumento").value = "";
            document.getElementById("nombreDocumento").value = "";
            document.getElementById("selectBaco").children[0].selected = true;
            document.getElementById("idDepartamento").children[0].selected = true;
            document.getElementById("idprovincias").children[0].selected = true;
            document.getElementById("selectBaco").children[0].selected = true;
            document.getElementById("selectMoneda").children[0].selected = true;
        })
        editarCuenta = function (e) {
            // tag edit true 
            tag = true;
            var id = e.parentElement.parentElement.parentElement.getAttribute("id");
            idCuenta = id;
            $("#nav-listAccount-tab").removeClass("active");

            $("#nav-listAccount").removeClass("active show");

            $("#nav-profile-tab").addClass("active")

            $("#nav-addnewAccount").addClass("active show");

            var form = new FormData();
            form.append("getId", id);
            var obj = {
                method: 'POST',
                body: form
            }
            post(URLORIGIN + "/Tarjeta", obj)
                .then(function (response) {

                    var data = response;

                    document.getElementById("alias").value = data.alias;
                    document.getElementById("selectMoneda").value = data.moneda;

                    document.getElementById("selectBaco").value = data.coBanco;

                    document.getElementById("nCuenta").value = data.numeroCuenta;
                    document.getElementById("CCI").value = data.cci;
                    document.getElementById("idNroDocumento").value = data.nuIdentificacion;
                    document.getElementById("nombreDocumento").value = data.noIdentificacion;
                    document.getElementById("idDepartamento").value = data.coDepartamento;
                    selectDepartamento(data.coDepartamento);
                    document.getElementById("idprovincias").value = data.coProvincia;
                })
        }
        getMovimientos = function (e) {
            // debugger;
            var id = e.parentElement.parentElement.parentElement.getAttribute("id");
            var formdata = new FormData();
            formdata.append("IdCuenta", id);
            var obj = {
                method: 'POST',
                body: formdata
            }
            post(URLORIGIN + "/Tarjeta", obj)
                .then(function (response) {
                    var tbody = document.getElementById("tbodyModal");
                    if (response.mensaje == "No hay elementos registrados") {
                        console.log(response.mensaje);
                    } else {
                        var data = response;
                        console.log(data)
                        var showRow = 0;

                        data.forEach(function (element) {
                            var tr = document.createElement("tr");
                            showRow++;
                            tr.insertCell(0).innerHTML = formaterFecha(element.feOperacion);
                            tr.insertCell(1).innerHTML = element.montoEnviado;
                            tr.insertCell(2).innerHTML = element.montoRecivido;
                            tr.insertCell(3).innerHTML = element.cuentaEm;
                            tr.insertCell(4).innerHTML = element.tc;
                            tr.insertCell(5).innerHTML = element.tipo;
                            var estado = (element.estado == 0) ? "PENDIENTE" : "FINALIZADO";
                            tr.insertCell(6).innerHTML = `<span class = 'badge badge-${(element.estado == 0 ) ? "danger":"primary"} text-wrap' > ${estado} </span>`;

                            tbody.appendChild(tr);
                        })
                    }

                })

        }
        anularCuenta = function (e) {

            $("#tbody").empty();
            var id = e.parentElement.parentElement.parentElement.getAttribute("id");
            var form = new FormData();
            form.append("AnularCuenta", id);
            form.append("accion", 0);
            var obj = {
                method: 'POST',
                body: form
            }
            post(URLORIGIN + "/Tarjeta", obj)
                .then(function (response) {
                    console.log(response);
                    listarCuentas();
                })
        }
        activarCuenta = function (e) {
            $("#tbody").empty();
            var formdata = new FormData();
            var id = e.parentElement.parentElement.parentElement.getAttribute("id");

            formdata.append("AnularCuenta", id);
            formdata.append("accion", 1);
            var obj = {
                method: 'POST',
                body: formdata
            }
            post(URLORIGIN + "/Tarjeta", obj)
                .then(function (response) {
                    console.log(response);
                    listarCuentas();
                })
        }
    }

    function comparer(idx, asc) {
        return function (a, b) {
            return function (v1, v2) {
                return v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2);
            }(getCellValue(asc ? a : b, idx), getCellValue(asc ? b : a, idx));
        }
    };

    function getCellValue(tr, idx) {
        return tr.children[idx].innerText || tr.children[idx].textContent;
    }

    document.querySelectorAll("th").forEach(function (th) {
        th.addEventListener("click", function () {
            const table = th.closest("table").children[1];
            Array.from(table.querySelectorAll('tr:nth-child(n)'))
                .sort(comparer(Array.from(th.parentNode.children).indexOf(th), this.asc = !this.asc))
                .forEach(tr => table.appendChild(tr));
        })
    })


    formaterFecha = function (date) {
        // 2020-05-16 23:44:55
        var data = date.split(" ");
        var dia = data[0].split("-");
        return dia[0] + "/" + dia[1] + "/" + dia[2] + " " + data[1];
    }
    buscarEnTabla = function () {
        var input, tr, filtro, txtValue, table, cell, td;
        input = document.getElementById("entrada");
        filtro = input.value.toUpperCase();
        table = document.getElementById("dataTable").children[1];
        tr = table.getElementsByTagName("tr");

        for (let i = 0; i < tr.length; i++) {
            tr[i].style.display = "none";
            td = tr[i].getElementsByTagName("td");
            for (let j = 0; j < td.length; j++) {
                cell = tr[i].getElementsByTagName("td")[j];
                if (cell) {
                    // txtValue = cell.textContent || cell.innerText;
                    if (cell.innerText.toUpperCase().indexOf(filtro) > -1) {
                        tr[i].style.display = "";
                        break;
                        // } else {
                    }
                }
            }
        }
    }
    if (window.location.pathname == "/vistas/Intranet/HistorialOperaciones.html" ||
        document.title == "Historial Operaciones") {
        listarOperaciones = function () {
            get(URLORIGIN + "/Operacion?Id=" + code.coUsuario)
                .then(function (response) {

                    var tbody = document.getElementById("tbody");
                    if (response.mensaje == "No hay elementos registrados") {
                        console.log(response.mensaje);
                    } else {
                        var data = response;
                        var showRow = 0;
                        console.log(data)
                        data.forEach(function (element) {
                            var tr = document.createElement("tr");
                            showRow++;
                            tr.insertCell(0).innerHTML = element.idOperaciones;
                            tr.insertCell(1).innerHTML = formaterFecha(element.feOperacion);
                            tr.insertCell(2).innerHTML = element.tipo;
                            tr.insertCell(3).innerHTML = element.tc;
                            tr.insertCell(4).innerHTML = element.montoEnviado;
                            tr.insertCell(5).innerHTML = element.montoRecivido;
                            tr.insertCell(6).innerHTML = element.nuCuenta;
                            tr.insertCell(7).innerHTML = element.numeroCuenta;
                            var estado = (element.estado == 0) ? "PENDIENTE" : "FINALIZADO";

                            tr.insertCell(8).innerHTML = `<span class = 'badge badge-${(element.estado == 0 ) ? "danger":"primary"} text-wrap' > ${estado} </span>`;

                            tbody.appendChild(tr);
                        })
                    }
                })
        }
        var tbody = document.getElementsByTagName("tbody");
        console.log(tbody[0].childNodes)

        listarOperaciones();

        document.querySelectorAll("a.page-link").forEach(function (element) {
            element.addEventListener("click", function () {
                console.log("1")
            })
        })



    }
    logoff = function () {
        console.log("saliste");
        // en observacion

        var data = new FormData();
        data.append("logoff", "1");
        var obj = {
            method: 'POST',
            body: data
        };
        post(URLORIGIN + "/Login", obj)
            .then(function (response) {
                console.log(response);
                if (response.mensaje == "Session Cerrada") {
                    console.log("saliste")
                    window.location.href = window.location.origin + "/vistas/Login.html";
                } else {
                    console.log("sigues en la session ")

                }
            })
    }
    irPerfil = function () {
        window.location.href = window.location.origin + "/vistas/Intranet/Perfil.html";
    }
    iniciarOpe = function () {

        console.log("dadadsa")
        document.getElementById("b1").style.background = "#ffff";
        document.getElementById("b1").style.color = "#000";
        document.getElementById("b2").style.background = "#7CC62A";
        document.getElementById("b2").style.color = "#ffff";

        document.getElementById("OperacionPaso1").style.display = "none";
        document.getElementById("OperacionPaso2").style.display = "block";

        var cuentaVisible = document.getElementById("tipoDolares").innerText;
        cuentasVisibles(cuentaVisible);

    }
    btnRetroceder = function () {
        document.getElementById("b1").style.background = "#7CC62A";
        document.getElementById("b1").style.color = "#fff";

        document.getElementById("b2").style.background = "#ffff ";
        document.getElementById("b2").style.color = "#000 ";

        document.getElementById("OperacionPaso1").style.display = "block";
        document.getElementById("OperacionPaso2").style.display = "none";
        document.getElementById("OperacionPaso2").classList.add("animate__backInRight");


    }
    copiarCuenta = function () {

        var aux = document.createElement("input");
        aux.setAttribute("value", document.getElementById("idOperac").value);
        document.body.appendChild(aux);
        aux.select();
        document.execCommand("copy");
        document.body.removeChild(aux);

    }
    btnContinuar = function () {
        var _option1 = document.getElementById("nroCuenta");
        var _optionSelect1 = _option1.options[_option1.selectedIndex].value;
        var _option2 = document.getElementById("cuentaPeruCambio");
        var _optionSelect2 = _option2.options[_option2.selectedIndex].value;

        if (_optionSelect1 == "Seleccione una cuenta") {
            _option1.classList.add('borderS');
        }
        if (_optionSelect2 == "Seleccione una cuenta") {
            _option2.classList.add('borderS');
        }

        if (_optionSelect1 != "Seleccione una cuenta" && _optionSelect2 != "Seleccione una cuenta") {
            _option1.classList.remove('borderS');
            _option2.classList.remove('borderS');


            document.getElementById("b2").style.background = "#ffff";
            document.getElementById("b2").style.color = "#000";
            document.getElementById("b3").style.background = "#7CC62A";
            document.getElementById("b3").style.color = "#ffff";
            document.getElementById("OperacionPaso1").style.display = "block";
            document.getElementById("OperacionPaso2").style.display = "block";
            // debugger;
            var btnOferta = document.getElementById("btnOferta");
            // var btnCupon = document.getElementById("btnCupon");
            var btnInit = document.getElementById("btnInit");
            var cabeceraPaso2 = document.getElementById("cabeceraPaso2");
            var btnpaso2 = document.getElementById("btnpaso2");
            var paso3terminos = document.getElementById("paso3terminos");
            var btnResumen = document.getElementById("btnResumen");


            btnOferta.classList.add('dnone');
            btnInit.classList.add('dnone');
            cabeceraPaso2.classList.add('dnone');
            btnpaso2.classList.add('dnone');
            paso3terminos.classList.add('dblock');
            btnResumen.classList.add('dblock');
        }

    }
    btnResumen = function () {
        var _option1 = document.getElementById("nroCuenta");
        var _optionSelect1 = _option1.options[_option1.selectedIndex].value;
        var _option2 = document.getElementById("cuentaPeruCambio");
        var _optionSelect2 = _option2.options[_option2.selectedIndex].value;


        //  div, titlebox, focusCircle, price Change,summary change
        var divresumen = document.getElementById("OperacionPaso3");
        var titeBox = document.getElementById("titeBox");
        var boxcircle = document.getElementById("boxTopcircle");
        var precioCambio = document.getElementById("precioCambio");
        var paso3terminos = document.getElementById("paso3terminos");
        var btnResumen = document.getElementById("btnResumen");

        document.getElementById("bg-spinner").style.visibility = "visible"

        // -------------------------------------
        // var moneda = $("#monedaSoles").val();
        var tipoPromocion;
        var envio = $("#monedaSoles").val();
        var tipo = document.getElementById("tipoDolares").innerHTML;
        // var cantidad = $("#moendaDolares").val();
        var ncuenta = document.getElementById("nroCuenta");
        var codcuenta = ncuenta.options[ncuenta.selectedIndex].value;

        var ncuentaOwner = document.getElementById("cuentaPeruCambio");
        var codcuentaOwner = ncuentaOwner.options[ncuentaOwner.selectedIndex].value;
        var notificacion = document.getElementById("recibirNotificacion").checked;
        var noti = (notificacion) ? "1" : "0";
        if (document.getElementById("valorPromo") && document.getElementById("valorPromo").getAttribute("codigo")) {
            tipoPromocion = document.getElementById("valorPromo").getAttribute("codigo");
        } else {
            tipoPromocion = document.getElementById("cambioActual").getAttribute("codigo");

        }
        var tipVenta = (tipo == "USD") ? "Compra" : "Venta";


        var data = new FormData();
        data.append("idPromocion", tipoPromocion);
        data.append("montoEnviado", envio);
        data.append("coCuenta", codcuenta);
        data.append("coCuentaE", codcuentaOwner);
        data.append("tipo", tipVenta);
        data.append("notificacion", noti)
        // debugger;
        var obj = {
            method: 'POST',
            body: data
        }
        var btn = ""
        post(URLORIGIN + "/Operacion", obj)
            .then(function (response) {
                document.getElementById("OperacionPaso1").style.display = "none";
                document.getElementById("OperacionPaso2").style.display = "none";
                titeBox.classList.add('dnone');
                boxcircle.classList.add('dnone');
                precioCambio.classList.add('dnone');
                paso3terminos.classList.toggle('dblock');
                btnResumen.classList.toggle('dblock');
                divresumen.classList.add('dblock');
                // print in summary of transacction
                document.getElementById("bg-spinner").style.visibility = "hidden";
                document.getElementById("setOperacion").innerHTML = `<b>N Operacion</b> ${response.idOperaciones}  
                <button onclick='copiarCuenta();' class='btn copiarCuenta' >Copiar</button> <input id="idOperac" style='visibility:hidden;width:40px' value="${response.idOperaciones}"></input>`

                // document.getElementById("setOperacion").appendChild(document.createTextNode(response.idOperaciones));
                document.getElementById("setAccion").appendChild(document.createTextNode(response.tipo));
                document.getElementById("settipoAccion").appendChild(document.createTextNode(response.tc));
                document.getElementById("setcuentaOwner").appendChild(document.createTextNode(response.noCuenta + " " + response.nuCuenta));
                document.getElementById("setRuc").appendChild(document.createTextNode("11111111111"));
                document.getElementById("setRazon").appendChild(document.createTextNode("PERUCAMBIO EIRL"))
                document.getElementById("setCCI").appendChild(document.createTextNode(response.cciEmpresa));
                document.getElementById("setMonto").appendChild(document.createTextNode(((tipVenta == "Compra") ? "USD $ " : "PEN S/ ") + response.montoEnviado));
                document.getElementById("cuentaCliente").appendChild(document.createTextNode(response.nombre + " " + response.numeroCuenta));
                document.getElementById("montoCliente").appendChild(document.createTextNode(((tipVenta == "Compra") ? "PEN S/ " : "USD $ ") + response.montoRecivido));

            })
    }

});