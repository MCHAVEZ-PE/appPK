var writing = null;
document.getElementById("bg-spinner").style.visibility = 'visible';
$(document).ready(function () {
    document.getElementById("bg-spinner").style.visibility = 'hidden';
    writing = function (text) {
        var arrText = text.split('');
        let i = 0;
        texto = document.getElementById("textoInicio");
        var loopText = setInterval(() => {
            texto.innerHTML += arrText[i];
            i++;

            if (i == arrText.length) {
                text.innerHTML = "";

                writing("Cambia tu dinero de una forma segura.")
                //   clearInterval(loopText)
            }

        }, 200)
    }
})