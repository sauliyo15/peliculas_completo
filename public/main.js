// MODELO DE DATOS
// ---------------

//Peliculas iniciales del modelo
let mis_peliculas_iniciales = [
  {
    titulo: "Superlópez",
    director: "Javier Ruiz Caldera",
    miniatura: "files/superlopez.png",
  },
  {
    titulo: "Jurassic Park",
    director: "Steven Spielberg",
    miniatura: "files/jurassicpark.png",
  },
  {
    titulo: "Interstellar",
    director: "Christopher Nolan",
    miniatura: "files/interstellar.png",
  },
];

//Variable auxiliar para almacenar las peliculas
let mis_peliculas = [];

//Esta es la apikey de la cuenta de https://app.jsonstorage.net/items
let apiKey = "5e20568c-79de-4a1f-81ad-7c8ebdf68ab8";


// PRIMITIVAS DE AJAX
// ------------------

// METODO QUE CREA POR PRIMERA VEZ EL RECURSO EN EL SERVIDOR DE JSONSTORAGE
const postAPI = async (peliculas) => {
  try {
    /*Instrucciones en la plataforma: a través de la plataforma y la apikay 
    creamos (POST) el recurso en el servidor con los datos de las peliculas*/
    const res = await fetch(
      `https://api.jsonstorage.net/v1/json?apiKey=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(peliculas),
      }
    );
    const { uri } = await res.json();
    return uri;
  } catch (err) {
    alert("No se ha podido crear el endpoint.");
  }
};

// METODO QUE OBTIENE (GET) DEL SERVIDOR EL RECURSO (URL) ALMACENADO EN LOCALSTORAGE
const getAPI = async () => {
  let response = await fetch(localStorage.URL);
  return await response.json();
};

// METODO QUE ACTUALIZA (PUT) DATOS EN EL SERVIDOR CON LOS PARAMETROS DESEADOS
const updateAPI = async (peliculas) => {
  
  //Instrucciones en la plataforma: en este caso se a de crear así la url para la peticion
  let cadena = localStorage.URL + "?apiKey=" + apiKey;

  try {
    let response = await fetch(cadena, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(peliculas),
    });
    return await response.json();
  } catch {
    alert("No se ha podido actualizar la información");
    return;
  }
};

// VISTAS
// ------

// METODO QUE REPRESENTA VISUALMENTE LAS PELICULAS
const indexView = (peliculas) => {
  let i = 0;
  let view = "";

  while (i < peliculas.length) {
    //Cogemos el array de peliculas y creamos la estructura html y sus datos para cada una de ellas.
    view += `
                <div class="movie">
                   <div class="movie-img">
                        <img data-my-id="${i}" src="${
      peliculas[i].miniatura
    }" onerror="this.src='files/placeholder.png'"/>
                   </div>
                   <div class="title">
                       ${peliculas[i].titulo || "<em>Sin título</em>"}
                   </div>
                   <div class="actions">
                       <button class="show" data-my-id="${i}">ver</button>
                       <button class="edit" data-my-id="${i}">editar</button>
                       <button class="delete" data-my-id="${i}">borrar</button>
                    </div>
                </div>\n`;
    i = i + 1;
  }
  //Añadimos dos botones aparte
  view += `<div class="actions">
                        <button class="new">añadir</button>
                        <button class="reset">reset</button>
                    </div>`;
  return view;
};

// METODO QUE REPRESENTA VISUALMENTE UNA PELICULA
const showView = (pelicula) => {
  //Se recibe una peliula y se crea la estructura html incorporando sus datos
  return `
             <p>La pelicula <strong>${pelicula.titulo}</strong>
                fue dirigida por <strong>${pelicula.director}</strong>!           
             </p>
             <div class="actions">
                <button class="index">Volver</button>
             </div>`;
};

// METODO QUE REPRESENTA VISUALMENTE UNA PELICULA PARA SU EDICION
const editView = (i, pelicula) => {
  /*Se crea la estructura html con los datos de la pelicula y en el boton Actualizar la posicion (i) 
  que ocupa en el array*/
  return `<h2>Editar Película </h2>
                <div class="field">
                Título <br>
                <input  type="text" id="titulo" placeholder="Título" 
                        value="${pelicula.titulo}">
                </div>
                <div class="field">
                Director <br>
                <input  type="text" id="director" placeholder="Director" 
                        value="${pelicula.director}">
                </div>
                <div class="field">
                Miniatura <br>
                <input  type="text" id="miniatura" placeholder="URL de la miniatura" 
                        value="${pelicula.miniatura}">
                </div>
                <div class="actions">
                    <button class="update" data-my-id="${i}">
                        Actualizar
                    </button>
                    <button class="index">
                        Volver
                    </button>
               `;
};

// METODO QUE REPRESENTA VISUALMENTE EL FORMULARIO DE INSERCION DE UNA NUEVA PELICULA
const newView = () => {
  //Estructura html con el formulario (titulos y cajas de texto) y dos botones
  return `<h2>Crear Película</h2>
                <div class="field">
                    Título <br>
                    <input  type="text" id="titulo" placeholder="Título">
                </div>
                <div class="field">
                    Director <br>
                    <input  type="text" id="director" placeholder="Director">
                </div>
                <div class="field">
                    Miniatura <br>
                    <input  type="text" id="miniatura" placeholder="URL de la miniatura">
                </div>

                <div class="actions">
                    <button class="create">Crear</button>
                    <button class="index">Volver</button>
                </div>`;
};

// CONTROLADORES
// -------------

// METODO QUE INICIA LA APLICACION COMPROBANDO SI ES LA PRIMERA VEZ QUE SE USA
const initContr = async () => {
  
  //Se comprueba si ha direccion url con el recurso en localstorage, en caso contrario se crea el recurso y se guarda
  if (!localStorage.URL || localStorage.URL === "undefined") {
    localStorage.URL = await postAPI(mis_peliculas_iniciales);
  }
  indexContr();
};

// METODO OBTIENE LAS PELICULAS Y ASIGNA AL ELEMENTO EL RESULTADO DE LLAMADA A LA VISTA
const indexContr = async () => {

  //Peticion para obtener las peliculas del servidor
  mis_peliculas = (await getAPI()) || [];

  //Obtenemos la referencia al elemento html y le asignamos el resultado retornado por la funcion de la vista
  document.getElementById("main").innerHTML = indexView(mis_peliculas);
};

// METODO QUE RECIBE UN INDICE Y REALIZA LA LLAMADA A LA VISTA
const showContr = (i) => {
  /*Obtenemos la referencia al elemento html y le asignamos el resultado retornado por la funcion de la vista
   (accediendo al array mediante el indice)*/
  document.getElementById("main").innerHTML = showView(mis_peliculas[i]);
};

// METODO QUE RECIBE UN INDICE, Y ASIGAN AL ELEMENTO LA LLAMADA A LA VISTA
const editContr = (i) => {
  //Obtenemos la referencia al elemento html y le asignamos el resultado retornado por la funcion dela vista.
  document.getElementById("main").innerHTML = editView(i, mis_peliculas[i]);
};

// METODO QUE RECIBE UN INDICE, ACCEDE A LAS CAJAS DE TEXTO Y ACTUALIZA LOS DATOS DE LA PELICULA
const updateContr = async (i) => {
  //Accediendo a las propiedades del objeto y asignamos/actualizamos el contenido de las cajas de texto
  mis_peliculas[i].titulo = document.getElementById("titulo").value;
  mis_peliculas[i].director = document.getElementById("director").value;
  mis_peliculas[i].miniatura = document.getElementById("miniatura").value;

  await updateAPI(mis_peliculas);

  //Llamamos al controlador que visualiza las peliculas
  indexContr();
};

// METODO QUE RECIBE UN INDICE PARA ELIMINAR EL OBJETO QUE OCUPA ESA POSICION DEL ARRAY
const deleteContr = async (i) => {
  var opcion = confirm("¿Deseas eliminar la película");
  if (opcion == true) {
    mis_peliculas.splice(i, 1);
    await updateAPI(mis_peliculas);
    indexContr();
  }
};

// METODO QUE ASIGNA AL ELEMENTO EL RESULTADO DE LA LLAMADA A LA VISTA
const newContr = () => {
  document.getElementById("main").innerHTML = newView();
};

// METODO QUE AÑADE UNA PELICULA AL MODELO DE DATOS
const createContr = async () => {
  //Creamos un objeto con los valores obtenidos de las cajas de texto
  let mi_pelicula = {
    titulo: document.getElementById("titulo").value,
    director: document.getElementById("director").value,
    miniatura: document.getElementById("miniatura").value,
  };

  //Añadimos el objeto al array
  mis_peliculas.push(mi_pelicula);

  await updateAPI(mis_peliculas);

  //Llamamos al controlador que visualiza las peliculas
  indexContr();
};

// METODO QUE RESETEA/INICIALIZA LAS PELICULAS CON LOS DATOS INICIALES
const resetContr = async () => {
  mis_peliculas = mis_peliculas_iniciales;
  await updateAPI(mis_peliculas);
  indexContr();
};

// INICIALIZACION DE LA PAGINA Y CAPTURA DE SU EVENTO Y LLAMADA A CONTROLADOR
document.addEventListener("DOMContentLoaded", indexContr);

// ROUTER de eventos
const matchEvent = (ev, sel) => ev.target.matches(sel);
const myId = (ev) => Number(ev.target.dataset.myId);

//Mediante este listener capturamos los diferentes posibles eventos y llamamos a los controladores
document.addEventListener("click", (ev) => {
  if (matchEvent(ev, ".index")) indexContr();
  else if (matchEvent(ev, ".show")) showContr(myId(ev));
  else if (matchEvent(ev, ".edit")) editContr(myId(ev));
  else if (matchEvent(ev, ".update")) updateContr(myId(ev));
  else if (matchEvent(ev, ".delete")) deleteContr(myId(ev));
  else if (matchEvent(ev, ".new")) newContr();
  else if (matchEvent(ev, ".create")) createContr();
  else if (matchEvent(ev, ".reset")) resetContr();
});

// Inicialización
document.addEventListener("DOMContentLoaded", initContr);
