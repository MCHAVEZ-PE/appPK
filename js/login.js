var validarIngreso = null;
var resetpass = null;
$(document).ready(function () {

    var URLORIGIN = "http://localhost/webapi";

    if (window.location.pathname == "/vistas/Login.html") {

        if (localStorage.getItem("datosusuario") != undefined || localStorage.getItem("datosusuario") != null) {

            var datosuser = JSON.parse(localStorage.getItem("datosusuario"))
            document.getElementById("usuario").value = datosuser.usuario;
            document.getElementById("password").value = datosuser.pass;
         
        }
    }

    validarIngreso = function () {
        document.getElementById("bg-spinner").style.visibility = 'visible';
        var usuario = document.getElementById("usuario").value;
        var contrasena = document.getElementById("password").value;

        data = new FormData();
        data.append("Correo", usuario);
        data.append("Password", contrasena);
    
        obj = {
            method: 'POST',
            body: data
        };
     
        post(URLORIGIN + "/Login", obj)
            .then(function (response) {
            
                console.log(response);


                if (response.mensaje == "Usario no existe") {
                    alert("Credenciales no son validas");
                    document.getElementById("bg-spinner").style.visibility = 'hidden';
                  
                } else {
                    if (document.getElementById("recordarsession").checked) {
                        localStorage.setItem("datosusuario", JSON.stringify({
                            "usuario": usuario,
                            "pass": contrasena,
                            "guardar": true
                        }))
                    } else {
                        localStorage.setItem("datosusuario", JSON.stringify({
                            "usuario": usuario,
                            "pass": contrasena,
                            "guardar": false
                        }))
                    }
                    sessionStorage.setItem("userData", JSON.stringify(response));

                    document.getElementById("bg-spinner").style.visibility = 'hidden';
                    window.location.href = window.origin + "/vistas/Intranet/Operaciones.html";
                }
             
            })
    }
    resetpass = function () {

        var emailreset = document.getElementById("emailreset").value;
        if (regmail.test(emailreset)) {
            var data = new FormData();
            data.append("userCorreo", emailreset);
            obj = {
                method: 'POST',
                body: data
            }
            post(URLORIGIN + "/Login", obj)
                .then(function (response) {
                    if (response.mensaje == "Usuario no valido") {

                        alert("porfavor ingrese un correo valido")
                    } else {
                        console.log(response);
                        data = null;
                        obj = null;
                        data = new FormData();
                        data.append("restorePass", response.coUsuario);
                        obj = {
                            method: 'POST',
                            body: data
                        }
                        post(URLORIGIN + "/Login", obj)
                            .then(function (response) {
                                alert(response.mensajeCorreo);
                                console.log(response)
                                window.location.href = window.location.origin + "/vistas/Login.html";
                            })
                    }
                })
        } else {
            alert("porfavor ingrese un correo valido")
        }
    }

});