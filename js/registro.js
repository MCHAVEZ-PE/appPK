 var regmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
 var numero = /^[0-9]*$/;
 var regpass = /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/;

 var btnchangeRadio = null;

 $(document).ready(function () {

     var URLORIGIN = "http://localhost/webapi";
     if (window.location.pathname == "/vistas/Registro.html") {
         document.getElementById("registro").addEventListener("click", function (e) {
             document.getElementById("bg-spinner").style.visibility = 'visible';
             console.log("estas aquiiii")
             e.preventDefault();
             var tipoPers = document.getElementsByName("typePerson");

             var tipoPersSelect;
             for (var i = 0; i < tipoPers.length; i++) {
                 if (tipoPers[i].checked) {
                     tipoPersSelect = tipoPers[i].value;
                 }
             }
             console.log(tipoPersSelect);


             var doc = document.getElementById("nrdoc").value;
             var nombre = document.getElementById("nombres").value;
             var apppat = document.getElementById("apPat").value;
             var appmat = document.getElementById("apMat").value;
             var email = document.getElementById("email").value;
             var tele = document.getElementById("telefono").value;
             var uploadDni = document.getElementById("updocument");
             var password = document.getElementById("password").value;
             var validarpassword = document.getElementById("validarpassword").value;

             if (nombre == "" ||
                 doc == "" ||
                 apppat == "" ||
                 appmat == "" ||
                 email == "" ||
                 tele == "" ||
                 password == "" ||
                 validarpassword == ""
             ) {
                 alert("Falta completar campos")
                 document.getElementById("bg-spinner").style.visibility = 'hidden';
             } else {
                 if (nombre.length > 30) {
                     alert("nombre muy largo");
                 }
                 if (tipoPersSelect == "PersonaNatural" && doc.length == 9) {

                 }
                 if (!numero.test(tele)) {
                     alert("Agrege un telefono valido")
                 }
                 if (!regmail.test(email)) {
                     alert("Agrege un correo valido")
                 }
                 if (!regpass.test(password)) {
                     alert("Las contraseñas deben tener mas de 6 digitos Mayusculas, minusculas y alguno signo .#$%&/()")
                     document.getElementById("bg-spinner").style.visibility = 'hidden';
                 }
                 var data = new FormData();
                 data.append("find", email);

                 obj = {
                     method: 'POST',
                     // headers:header,
                     body: data
                 }
                 post(URLORIGIN + "/usuario", obj)
                     .then(function (response) {
                         if (response.mensaje === "Intente con otra cuenta") {
                             alert(response.mensaje);
                         } else {
                             if (document.getElementById("chkTerminos").checked) {
                                 data = null;
                                 var i = document.getElementById("tipoDoc");
                                 var tselect = i.options[i.selectedIndex].value;
                                 data = new FormData();
                                 obj = null;

                                 switch (true) {
                                     case (tipoPersSelect === "PersonaNatural"):
                                         data.append("tipo", "1");
                                         break;
                                     case (tipoPersSelect === "PersonaJuridica"):
                                         data.append("tipo", "2");
                                         break;
                                     case ((tipoPersSelect === "Extranjero") && (tselect === "CARNETEXTRANJERO")):
                                         data.append("tipo", "3");
                                         break;
                                     case ((tipoPersSelect === "Extranjero") && (tselect === "PASAPORTE")):
                                         data.append("tipo", "4");
                                         break;
                                     case ((tipoPersSelect === "Extranjero") && (tselect === "PTP")):
                                         data.append("tipo", "5");
                                         break;
                                     case ((tipoPersSelect === "Extranjero") && (tselect === "CEDUIDENT")):
                                         data.append("tipo", "6");
                                         break;
                                 }
                                 data.append("nombre", nombre);
                                 data.append("primerApellido", apppat);
                                 data.append("segundoApellido", appmat);
                                 data.append("correo", email);
                                 data.append("feNacimiento", "00000000");
                                 data.append("telefono", tele);
                                 data.append("clave", password);
                                 data.append("dni", doc);
                                 if (uploadDni.files >= 1) {
                                     data.append("imagen", uploadDni.files[0], uploadDni.values);
                                 } else {
                                     data.append("imagen", " ");
                                 }
                                 obj = {
                                     method: 'POST',
                                     body: data
                                 }

                                 if (regpass.test(password) && regpass.test(validarpassword)) {
                                     if (password === validarpassword) {
                                         post(URLORIGIN + "/Usuario", obj)
                                             .then(function (response) {
                                                 console.log("respuesta", response);
                                                 //  debugger;
                                                 document.getElementById("bg-spinner").style.visibility = 'hidden';
                                                 if (response.mensajeCorreo === "El correo se envio correctamente" &&
                                                     response.mensajeUsuario === "Usuario registrado") {
                                                     window.location.href = window.origin + "/vistas/Login.html";
                                                 } else {
                                                     alert(response.mensaje)
                                                     document.getElementById("bg-spinner").style.visibility = 'hidden';
                                                 }
                                             })
                                             .catch((e) => {
                                                 alert(e.mensajeCorreo)
                                             })
                                     } else {
                                         alert("Las claves no coinciden");
                                         document.getElementById("bg-spinner").style.visibility = 'hidden';
                                     }
                                 } else {
                                     alert("Las contraseñas deben tener mas de 6 digitos Mayusculas, minusculas y alguno signo .#$%&/()")
                                     document.getElementById("bg-spinner").style.visibility = 'hidden';
                                 }
                             } else {
                                 alert("Maque la opcion de Terminos y condiciones")
                                 document.getElementById("bg-spinner").style.visibility = 'hidden';
                             }
                         }

                     })
             }
         })

         btnchangeRadio = function (e) {
             console.log(e.value);

             switch (e.value) {
                 case "PersonaJuridica":
                     document.getElementById("textRepresentanteLeg").style.display = "block";
                     document.getElementById("DatosPersonales").style.display = "block";
                     document.getElementById("tipodoc").style.display = "none";
                     document.getElementById("textPersonaNat").style.display = "none";
                     document.getElementById("textPersonaExt").style.display = "none";
                     break;
                 case "Extranjero":
                     document.getElementById("tipodoc").style.display = "block";
                     document.getElementById("DatosPersonales").style.display = "block";
                     document.getElementById("textPersonaNat").style.display = "none";
                     document.getElementById("textRepresentanteLeg").style.display = "none";
                     document.getElementById("textPersonaExt").style.display = "block";

                     break;

                 default:

                     document.getElementById("DatosPersonales").style.display = "block";
                     document.getElementById("tipodoc").style.display = "none";
                     document.getElementById("textPersonaNat").style.display = "block";
                     document.getElementById("textPersonaExt").style.display = "none";
                     document.getElementById("textRepresentanteLeg").style.display = "none";
                     break;
             }
         };
     }
 })