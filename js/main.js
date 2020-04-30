document.getElementById("menubar").addEventListener("click", function () {
    sizingmenu();
});
window.addEventListener("DOMContentLoaded", (oEvent) => {
    displayContent(oEvent);
})

function sizingmenu() {
    var listclass = document.getElementById("sidebar").classList;
    var ul = document.querySelector(".listamenu").children;
   
    listclass.forEach(element => {
        if (element === "siderwidth") {
            listclass.remove("siderwidth");
            listclass.add("menuajustado");
            for (let i = 0; i < ul.length; i++) {
                ul[i].children[0].classList.add("itemsMenuAjustado");
                ul[i].children[0].classList.remove("d-block");
                ul[i].children[0].classList.remove("nwrap");
                // debugger
            }

        }
        if (element === "menuajustado") {

            listclass.remove("menuajustado");
            listclass.add("siderwidth")
            for (let i = 0; i < ul.length; i++) {
                ul[i].children[0].classList.remove("itemsMenuAjustado");
                ul[i].children[0].classList.add("d-block");
                ul[i].children[0].classList.add("nwrap");

                // debugger
            }
        }
    })
}

document.getElementById("listamenu").addEventListener("click", (oEvent) => {
    displayContent(oEvent);
})
// window.addEventListener("", (oEvent) => {
//     displayContent(oEvent);
// })

// document.getElementById("profile").addEventListener("click", (oEvent) => {
// });


// document.getElementById("bankAccount").addEventListener("click", () => {
// });
document.getElementById("idprofile").addEventListener("click", () => {
    displayContent(null, "PERFIL")
    // console.log("se hizo click");
})

function displayContent(oEvent, text) {
    var tag;
    if (text == null) {
        if (oEvent.path) {
            oEvent.path.map(element => {
                if (element.tagName === "LI") {
                    tag = element.innerText.trim();
                }
            })
        }
    } else {
        tag = text
    }


    // console.log(tag)
    // var tag = oEvent.target.innerText;

    switch (tag) {
        case "PERFIL":
            document.getElementById("contentProfile").style.display = "block";

            document.getElementById("contentNewOperation").style.display = "none";
            document.getElementById("contentBankAccount").style.display = "none";
            document.getElementById("contentBussiness").style.display = "none";
            document.getElementById("contentHelper").style.display = "none";
            sizingmenu();

            break;
        case "NUEVA OPERACION":
            document.getElementById("contentNewOperation").style.display = "block";

            document.getElementById("contentProfile").style.display = "none";
            document.getElementById("contentBankAccount").style.display = "none";
            document.getElementById("contentBussiness").style.display = "none";
            document.getElementById("contentHelper").style.display = "none";
            sizingmenu();
            break;
        case "CUENTAS BANCARIAS":

            document.getElementById("contentBankAccount").style.display = "block";

            document.getElementById("contentProfile").style.display = "none";
            document.getElementById("contentNewOperation").style.display = "none";
            document.getElementById("contentBussiness").style.display = "none";
            document.getElementById("contentHelper").style.display = "none";
            sizingmenu();
            break;
        case "EMPRESAS":

            document.getElementById("contentBussiness").style.display = "block";

            document.getElementById("contentProfile").style.display = "none";
            document.getElementById("contentNewOperation").style.display = "none";
            document.getElementById("contentBankAccount").style.display = "none";
            document.getElementById("contentHelper").style.display = "none";
            sizingmenu();
            break;
        case "AYUDA":

            document.getElementById("contentHelper").style.display = "block";

            document.getElementById("contentProfile").style.display = "none";
            document.getElementById("contentNewOperation").style.display = "none";
            document.getElementById("contentBankAccount").style.display = "none";
            document.getElementById("contentBussiness").style.display = "none";
            sizingmenu();
            break;
        default:
            document.getElementById("contentNewOperation").style.display = "block";

            document.getElementById("contentProfile").style.display = "none";
            document.getElementById("contentBankAccount").style.display = "none";
            document.getElementById("contentBussiness").style.display = "none";
            document.getElementById("contentHelper").style.display = "none";


    }
    
}

// $( document ).ready(function() {
//     console.log( "ready!" );
//     this.displayContent();
//  });