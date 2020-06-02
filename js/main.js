var namex = null;
var dataMoney = null;
var ObjMoneda = {};
var irIntranet = null;
var cerrarAnuncio = null;
var extra = null;
var limpiarCampos = null;
// si se cargo la pagina 

document.getElementById("bg-spinner").style.visibility = 'visible';
$(document).ready(function () {

    document.getElementById("bg-spinner").style.visibility = 'hidden';
    var URLORIGIN = "http://localhost/webapi";

    $(window).scroll(function () {
        var scroll = $(window).scrollTop();

        if (scroll > 15) {
            $("#navmenu").addClass("bg-nav")
        } else {
            $("#navmenu").removeClass("bg-nav");
        }
    })
    cerrarAnuncio = function () {
        console.log("btn")
        if (document.getElementById("capaAnuncio").style.display == "") {
            document.getElementById("capaAnuncio").style.display = "none";
            // document.getElementsByClassName("capaAnuncio")
        } else {
            document.getElementById("boxVideoPromocional").style.display = "none";
        }
    }


    document.getElementById("btnburger").addEventListener("click", function () {
        // console.log("holaa")
        var scroll = $(window).scrollTop();
        var tag = document.getElementById("btnburger").attributes[6].value;
        // console.log(tag)
        if ((scroll >= 0 && scroll <= 14)) {
            // $(window).scrollTop("5");
            // debugger;
            if (tag == "false")
                $("#navmenu").addClass("bg-nav");
            else {
                $("#navmenu").removeClass("bg-nav");

            }
        }
    })

    var ObjMoneda = {};
    if (window.location.pathname == "/index.html" || document.title == "Home") {

        get(URLORIGIN + "/Promociones")
            .then(function (response) {
                // console.log(response)
                ObjMoneda.Compra = response[0].precio;
                ObjMoneda.Venta = response[1].precio;
                sessionStorage.setItem("mercado", JSON.stringify(ObjMoneda))
                document.getElementById("apiUSD").innerHTML =
                    "Compra: " + ObjMoneda.Compra + " || Venta: " + ObjMoneda.Venta;

            })

        document.getElementById("monedasoles").addEventListener("keyup", function (e) {
            var soles = e.srcElement.value;
            var target = e.target;
            var parent = target.parentElement;

            console.log("input 2", parent.children[0].innerText);
            get(URLORIGIN + "/Promociones")
                .then(function (response) {
                    ObjMoneda.Compra = response[0].precio;
                    ObjMoneda.Venta = response[1].precio;
                    // si label
                    // debugger
                    if (e.srcElement.previousElementSibling.innerHTML == "SOLES") {
                        document.getElementById("monedadolares").style.transitionDuration = '0.8s';
                        document.getElementById("monedadolares").value = Number(soles / ObjMoneda.Venta).toFixed(2);
                    } else {
                        document.getElementById("monedadolares").style.transitionDuration = '0.8s';
                        document.getElementById("monedadolares").value = Number(soles * ObjMoneda.Compra).toFixed(2);

                    }
                });

        }, false);
        document.getElementById("monedadolares").addEventListener("keyup", function (e) {
            var dolares = e.srcElement.value
            var target = e.target;
            var parent = target.parentElement;
            console.log("input 2", parent.children[0].innerText);


            get(URLORIGIN + "/Promociones")
                .then(function (response) {
                    ObjMoneda.Compra = response[0].precio;
                    ObjMoneda.Venta = response[1].precio;
                    // debugger;
                    if (parent.children[0].innerText == "DOLARES") {

                        document.getElementById("monedasoles").style.transitionDuration = '0.8s';
                        document.getElementById("monedasoles").value = Number(dolares * ObjMoneda.Venta).toFixed(2);
                    } else {
                        document.getElementById("monedasoles").style.transitionDuration = '0.8s';
                        document.getElementById("monedasoles").value = Number(dolares / ObjMoneda.Compra).toFixed(2);

                    }
                });

        }, false);
        document.getElementById("irIntranet").addEventListener("click", function () {
            document.getElementById("boxVideoPromocional").style.display = 'block';
        })
        document.getElementById("changemoney").addEventListener("click", function () {

            // console.log(ObjMoneda);
            var mercado = JSON.parse(sessionStorage.getItem("mercado"));
            console.log(mercado);
            // YO ENVIO
            var dnd1 = document.getElementById("monedasoles").parentElement;
            var t1 = dnd1.children[0].innerHTML;
            console.log(t1)
            var v1 = (dnd1.children[1].type == "number") ? dnd1.children[1].value : "";
            // YO RECIBO
            var dnd2 = document.getElementById("monedadolares").parentElement;
            var t2 = dnd2.children[0].innerHTML;
            console.log(t1)
            var v2 = (dnd2.children[1].type == "number") ? dnd2.children[1].value : "";

            if (t1 == "SOLES" && t2 == "DOLARES") {
                dnd1.children[0].innerHTML = t2;
                dnd2.children[0].innerHTML = t1;

                dnd1.children[1].value = v2;

                dnd2.children[1].value = Number(v2 * mercado.Compra).toFixed(2);
            } else {

                dnd1.children[0].innerHTML = t2;
                dnd1.children[1].value = v2;

                dnd2.children[0].innerHTML = t1;
                dnd2.children[1].value = Number(v2 / mercado.Venta).toFixed(2);
            }


        });

    }
    if (window.location.pathname == "/Contactenos.html" || document.title == "CONTACTENOS") {
        extra = function () {

            document.getElementById("bg-spinner").style.visibility = 'visible';
            var nombre = document.getElementById("nombres").value;
            var motivo = document.getElementById("motivo").value;
            var comentario = document.getElementById("comentario").value;
            var correo = document.getElementById("correo").value;
            var formdata = new FormData();
            formdata.append("Correo", correo);
            formdata.append("Motivo", motivo);
            formdata.append("NombreCompleto", nombre);
            formdata.append("Mensaje", comentario);
            var obj = {
                method: 'POST',
                body: formdata
            }
            post(URLORIGIN + "/Extra", obj)
                .then(function (response) {
                    console.log(response);
                    document.getElementById("bg-spinner").style.visibility = 'hidden';
                    alert(response.mensaje);

                    limpiarCampos();
                })
        }
        limpiarCampos = function () {
            document.getElementById("nombres").value = "";
            document.getElementById("motivo").value = "";
            document.getElementById("comentario").value = "";
            document.getElementById("correo").value = "";

        }
    }
});