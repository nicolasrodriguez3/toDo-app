const formulario = document.getElementById("formulario");
const input = document.getElementById("input");
const listaTareas = document.getElementById("lista-tareas");
const template = document.getElementById("template").content;
const fragment = document.createDocumentFragment();

//* Lista de tareas
let tareas = {};

//* pintar las tareas cuando el contenido del DOM haya cargado
document.addEventListener("DOMContentLoaded", () => {
  // preguntar si hay tareas guardadas en localStorage
  if(localStorage.getItem("tareas"))
    tareas = JSON.parse(localStorage.getItem("tareas"))
    
  pintarTareas()
});

listaTareas.addEventListener("click", (e) => btnAccion(e));

//* Agregar un evento al formulario para detectar el texto
formulario.addEventListener("submit", (e) => {
	e.preventDefault();
	// console.log(input.value);
	// console.log(e.target.querySelector("input").value);

	setTarea(e);
});

const setTarea = (e) => {
	if (input.value.trim() === "") {
		console.log("input vacio");
		formulario.reset();
		input.focus();
		return;
	}

	// generamos el formato de las tareas con un ID
	const tarea = {
		id: Date.now(),
		texto: input.value,
		estado: false,
	};
	// agregamos la tarea a la lista de tareas
	tareas[tarea.id] = tarea;
	// console.log(tareas);

	// reseteamos el formulario y apemos focus al input
	formulario.reset();
	input.focus();

	// pintamos la lista de tareas
	pintarTareas();
};

const pintarTareas = () => {
  // guardamos las tareas en localStorage
  localStorage.setItem("tareas", JSON.stringify(tareas))


  // si no tenemos tareas 
  if (Object.values(tareas).length === 0){
    listaTareas.innerHTML = `<div class="alert alert-dark text-center">No hay tareas pendientes 🙌</div>`
    return
  }
    
	// borramos las tareas que fueron agregadas para que no se dupliquen
	listaTareas.innerHTML = "";

	//* recorremos la lista de tareas
	Object.values(tareas).forEach((tarea) => {
		// crear clon del template
		const clon = template.cloneNode(true);

		// modificamos el clon agregandole la tarea
		clon.querySelector("p").textContent = tarea.texto;

		if (tarea.estado) {
			clon
				.querySelector(".alert")
				.classList.replace("alert-warning", "alert-primary");
			clon
				.querySelectorAll(".fas")[0]
				.classList.replace("fa-check-circle", "fa-undo-alt");
			clon.querySelector("p").style.textDecoration = "line-through";
		}

		// agregamos un data-id a los botones con el id de la tarea
		clon.querySelectorAll(".fas")[0].dataset.id = tarea.id;
		clon.querySelectorAll(".fas")[1].dataset.id = tarea.id;

		// insertamos el clon en el fragment
		fragment.appendChild(clon);
	});
	// insertamos el fragmento con todas las tareas en el DOM
	listaTareas.appendChild(fragment);
};

const btnAccion = (e) => {
	if (e.target.classList.contains("fa-check-circle")) {
		tareas[e.target.dataset.id].estado = true;
		pintarTareas();
	}

	if (e.target.classList.contains("fa-minus-circle")) {
		delete tareas[e.target.dataset.id];
		pintarTareas();
	}

	if (e.target.classList.contains("fa-undo-alt")) {
		tareas[e.target.dataset.id].estado = false;
		pintarTareas();
	}
	e.stopPropagation(); //previene que se activen otros eventos
};
