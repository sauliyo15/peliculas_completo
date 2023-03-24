'use-strict';

let deferredInstallPrompt = null;

const installButton = document.getElementById('buttonInstall');

installButton.addEventListener('click', installPWA);

window.addEventListener('beforeinstallprompt', saveBeforeInstallPromptEvent);

function saveBeforeInstallPromptEvent(evt) {
    deferredInstallPrompt = evt;
    installButton.removeAttribute('hidden');
}

function installPWA(evt) {
    deferredInstallPrompt.prompt();
    evt.srcElement.setAttribute('hidden', true);
    deferredInstallPrompt.userChoice.then((choice) => {
        if(choice.outcomie === "accepted") {
            console.log("aceptado")
        }
        else {
            console.log("no aceptado")
        }
        deferredInstallPrompt = null;
    });
}

window.addEventListener('appinstalled', logAppInstalled);

function logAppInstalled(evt) {
    console.log("Aplicacion de peliculas instalada");
}