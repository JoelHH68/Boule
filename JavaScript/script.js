/* Init canvas */
const c = document.querySelector("#premierPlan");
const ctx = c.getContext("2d");

/* Taille écran */
let W = window.innerWidth;
let H = window.innerHeight;

/* Définition de la taille du canvas */
c.width = W;
c.height = H;


/*Orientation du téléphone*/
let orientation = {
    beta: 0,  
    gamma: 0   
};


/* EventListener pour voir si on a appuié */
window.addEventListener("mousemove", appui);

/* Initialisation particule */
let P = {
    x: W/2,
    y: H/2,
    vx: 0,
    vy: 0,
    ax: 0,
    ay: 0
}

/* Config */
let vitesse = 1;

/* Durée de la frame */
let temps1 = performance.now();

/*Initialisation de la souris*/
let souris = {
    x: W/2,
    y: H/2
};

/* On démarre la boucle */
boucle();

function appui(event) {
    souris.x = event.clientX;
    souris.y = event.clientY;
}


function handleOrientation(event) {
    orientation.beta = event.beta;
    orientation.gamma = event.gamma;
}

function boucle() {
    moteur();
    afficher();
    window.requestAnimationFrame(boucle);
}

function moteur() {

    /* Calcul de la durée d'une frame */
    let temps2 = performance.now();
    let duree = (temps2 - temps1) / 1000;
    temps1 = temps2;

    //calculAcceleration();
    calculAcceleration2();

    /* Application de l'accélération */
    P.vx += P.ax * duree;
    P.vy += P.ay * duree;

    /* Application de la vitesse */
    P.x += P.vx * duree;
    P.y += P.vy * duree;


    /* Limites pour les bords */
    if(P.x < 15) P.x = 15;                 // Bord gauche
    if(P.x > W - 15) P.x = W -15; // Bord droit
    if(P.y < 15) P.y = 15;                 // Bord haut
    if(P.y > H - 15) P.y = H - 15; // Bord bas
}


function calculAcceleration2() {

    let accelMax = 300;

    // Normaliser les angles (environ -45 à 45 degrés)
    let ax = orientation.gamma / 45;
    let ay = orientation.beta / 45;

    // Limiter entre -1 et 1
    ax = Math.max(-1, Math.min(1, ax));
    ay = Math.max(-1, Math.min(1, ay));

    P.ax = ax * accelMax;
    P.ay = ay * accelMax;
}

function calculAcceleration() {

    /*Mise à 0 de l'accélération */
    P.ax = 0;
    P.ay = 0;


    /*Initialisation de l'acclération */
    let accel = 100;

    // Distance entre souris et centre écran
    let dx = souris.x - W/2;
    let dy = souris.y - H/2;

    // Gauche / Droite
    if (dx > 50) {
        P.ax = accel;        // droite
    } 
    else if (dx < -50) {
        P.ax = -accel;       // gauche
    }

    // Haut / Bas
    if (dy > 50) {
        P.ay = accel;        // bas
    } 
    else if (dy < -50) {
        P.ay = -accel;       // haut
    }
}

function afficher() {
    ctx.clearRect(0,0,W,H);
    ctx.beginPath();
    ctx.arc(P.x, P.y, 15, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = "#09c";
}


function handleClick() {

  if (typeof DeviceMotionEvent.requestPermission === "function") {

    Promise.all([
      DeviceMotionEvent.requestPermission(),
      DeviceOrientationEvent.requestPermission(),
    ]).then(([motionPermission, orientationPermission]) => {

      if (
        motionPermission === "granted" &&
        orientationPermission === "granted"
      ) {
        window.addEventListener("deviceorientation", handleOrientation);
      }

    });

  } else {

    window.addEventListener("deviceorientation", handleOrientation);

  }
}