const socket = io();

let mensaje = document.getElementById('mensaje');
let nombre = document.getElementById('nombre');
let enviar = document.getElementById('enviar');
let salida = document.getElementById('salida');
let acciones = document.getElementById('acciones');
let btnLocalisacion = document.getElementById('btnLocalisacion');
var time;

/* **************************** Web Worckers ******************************** */
worker = new Worker("/js/time_worker.js");
worker.onmessage = function (evt) {
    time = evt.data;
    document.getElementById("time").innerHTML = evt.data;
}

/*  ************************Web Sockets ********************************* */
enviar.addEventListener('click', function () {
    salida.innerHTML += `<p>
    <strong>${nombre.value} hora: ${time}</strong>: ${mensaje.value}
</p>`
    socket.emit('msgj', {
        type: 'text',
        nombre: nombre.value,
        mensaje: mensaje.value,
        time: time
    });
    mensaje.value = "";
});

btnLocalisacion.addEventListener('click', () => {
    getGeolocalisacion();
});

mensaje.addEventListener('keypress', function () {
    socket.emit('typing', nombre.value);
});

socket.on('msgj', function(data) {
    if (data.type == 'text') {
        mostrarNotificacion(data.nombre,data.mensaje);
        acciones.innerHTML = "";
        salida.innerHTML += `<p>
        <strong>${data.nombre} hora: ${data.time}</strong>: ${data.mensaje}
    </p>`
    } else if (data.type == 'geolocalisacion') {
        mostrarNotificacion(data.nombre,"Envio una ubicacion");
        var img_url = "https://maps.googleapis.com/maps/api/staticmap" +
            "?center=" + data.lat + "," + data.long +
            "&zoom=15" +
            "&size=400x300" +
            "&key=AIzaSyCv9VAsM4KzjDdvuV2CzFAMuazqOfqFlgM";

        salida.innerHTML += `<strong>${data.nombre} hora: ${data.time}</strong><img src='${img_url}'>`;
    }
});

socket.on('typing', function (data) {
    acciones.innerHTML = `<p><em>${data} esta escribiendo</em></p>`;
});


/* *******************Uso de Geolocalisacion********************************* */
function getGeolocalisacion(){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(mostrarPos, errorLoc);
    }
}

function errorLoc(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            txtLocalizacion.innerText = "No tienes permisos de acceder a la Geolocalización";
            break;
        case error.POSITION_UNAVAILABLE:
            txtLocalizacion.innerText = "No se pudo acceder a la localización";
            break;
        case error.TIMEOUT:
            txtLocalizacion.innerText = "El tiempo de respuesta para obtener la localización se agoto";
            break;
        case error.UKNOWN_ERROR:
            txtLocalizacion.innerText = "A ocurrudo un error";
        default:
            txtLocalizacion.innerText = "A ocurrudo un error";
            break;
    }
}


/*  *****************Uso de Google Maps************************ */
function mostrarPos(pos) {

    var img_url = "https://maps.googleapis.com/maps/api/staticmap" +
        "?center=" + pos.coords.latitude + "," + pos.coords.longitude +
        "&zoom=15" +
        "&size=400x300" +
        "&key=AIzaSyCv9VAsM4KzjDdvuV2CzFAMuazqOfqFlgM";
    salida.innerHTML += `<strong>${nombre.value} hora: ${time}</strong><img src='${img_url}'>`;
    socket.emit('msgj', {
        type: 'geolocalisacion',
        nombre: nombre.value,
        lat: pos.coords.latitude,
        long: pos.coords.longitude,
        time: time
    });

}

/* ************************ Notificaciones ******************* */
function mostrarNotificacion(name,msg) {
    var txtMensaje = document.getElementById("txtMensaje");
    if (!window.Notification) {
        txtMensaje.innerText = "No es compatible tu navegador";
    }
    Notification.requestPermission(function (status) {
        if (Notification.permission !== status) {
            Notification.permission = status;
        }

        if (Notification.permission == "granted") {
            var n = new Notification(name +" envio un nuevo mensaje", {
                body: ""+msg,
                icon: "https://e7.pngegg.com/pngimages/915/586/png-clipart-computer-icons-user-profile-icon-design-ico-profile-silhouette-profile-thumbnail.png",
                image: "https://ecosistemas.ovacen.com/wp-content/uploads/2018/01/bosque-1280x720.jpg",
                vibrate: [200, 100],
                data: { userId: 1235, mensaje: name +" a escrito un mensaje" },
            });

            n.onclick = (args) => {
                alert("Se le dio click");
                console.log(args.currentTarget.data);
            }
        } else {
            txtMensaje.innerText = "No tienes permiso para mandar notifiaciones";
        }
    });
}
