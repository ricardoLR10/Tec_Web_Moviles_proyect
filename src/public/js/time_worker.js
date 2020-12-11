var insular = false;

function reloj(timeoutDisable) {
    timeoutDisable = typeof timeoutDisable !== 'undefined' ? timeoutDisable : false;

    var h = new Date().getHours(); // Horas
    var m = new Date().getMinutes(); // Minutos
    var s = new Date().getSeconds(); // Segundos

    h = (insular ? h - 1 : h);

    var formatH = (h < 10 ? "0" + h : h);
    var formatM = (m < 10 ? "0" + m : m);
    var formatS = (s < 10 ? "0" + s : s);

    self.postMessage(formatH + ":" + formatM + ":" + formatS);

    if (!timeoutDisable)
        setTimeout("reloj()", 1000);
}

self.onmessage = function (evt) {

    if (evt.data === "cambiarHora")
        insular = !insular;
    reloj(true);
}



reloj();