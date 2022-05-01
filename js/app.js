//variables y selectores.
const formulario =document.querySelector('#agregar-gasto')
const gastoListado = document.querySelector('#gastos ul')


//eventos.

eventListeners();
function eventListeners() {
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);

    formulario.addEventListener('submit', agregarGasto)
}

//clases.
class Presupuesto {
    constructor(presupuesto){
    this.presupuesto=Number(presupuesto);
    this.restante =Number(presupuesto)
    this.gastos= [];
    }
    nuevoGasto(gasto){
        this.gastos= [...this.gastos,gasto]
        console.log(this.gastos);
        this.calcularRestante();
    }

    calcularRestante(){
        const gastado = this.gastos.reduce( (total, gasto) => total + gasto.cantidad, 0 );
        this.restante = this.presupuesto-gastado;
        console.log(this.restante);
        console.log(gastado);
    }
eliminarGasto(id){
   this.gastos = this.gastos.filter( gasto => gasto.id !== id);
   console.log(this.gastos)
   this.calcularRestante();
}
}

class UI{
    insertarPresupuesto(cantidad){
        //extrayendo el valor.
        const {presupuesto, restante} =cantidad;
        //agrego al HTML.
        document.querySelector('#total').textContent=presupuesto;
        document.querySelector('#restante').textContent=restante;
    }
   imprimirAlerta(mensaje, tipo){
    const divMensaje =document.createElement('div');    
    divMensaje.classList.add('text-center', 'alert');
    if (tipo==='error') {
        divMensaje.classList.add('alert-danger')
    }else{
        divMensaje.classList.add('alert-success')
    }

    //mensaje de error.
    divMensaje.textContent= mensaje;

    //insertar en el HTML.
    document.querySelector('.primario').insertBefore(divMensaje,formulario)
    setTimeout(() => {
        divMensaje.remove();
    }, 3000);
   }
   mostrarGastos(gastos){
        //elimina el html previo   
         this.limpiarHTML();
       //iterar sobre los gastos.
       gastos.forEach(gasto => {
        
      
        const {cantidad, nombre, id}= gasto;
        //crear un LI.
       const nuevoGasto = document.createElement('li');
       nuevoGasto.className='list-group-item d-flex justify-content-between align-items-center';
       nuevoGasto.dataset.id=id;
     
       //agregar el HTML del gasto.
       nuevoGasto.innerHTML = `${nombre} <span class='badge badge-primary badge-pill'> $ ${cantidad}</span>  `;
        //boton para borrar el gasto.
       const btnBorrar = document.createElement('button');
       btnBorrar.classList.add('btn', 'btn-danger','borrar-gasto');
       btnBorrar.innerHTML ='borrar &times' 
       btnBorrar.onclick = ()=>{
           eliminarGasto(id);
       }
       nuevoGasto.appendChild(btnBorrar);

        //agregar el gasto.
        gastoListado.appendChild(nuevoGasto);
    })
    }
    limpiarHTML(){
        while (gastoListado.firstChild) {
            gastoListado.removeChild(gastoListado.firstChild);
        }
    }

    actualizarRestante(restante){
        document.querySelector('#restante').textContent=restante;
    }

    comprobarPresupuesto(presupuestObj){
    const {presupuesto, restante} = presupuestObj;
    const restanteDiv = document.querySelector('.restante');
    //comprobar 25%
    if ((presupuesto /4 )>restante) {
        restanteDiv.classList.remove('alert-success', 'alert-warning');
        restanteDiv.classList.add('alert-danger')
    }else if((presupuesto / 2) > restante){
        restanteDiv.classList.remove('alert-success');
        restanteDiv.classList.add('alert-warning')
    }else{
        restanteDiv.classList.remove('alert-danger', 'alert-warning')
        restanteDiv.classList.add('alert-success')
    }
    //si el total total es menor a 0.
    if (restante<=0) {
        ui.imprimirAlerta('el presupeusto se ha agotado', 'error')
        formulario.querySelector('button[type="submit"]').disabled = true;
    }
    }

    
}

//instanciar
const ui = new UI();
let presupuesto;
//funciones.
function preguntarPresupuesto() {
    const presupuestoUsuario =prompt('cual es tu presupuesto?');
    console.log(Number(presupuestoUsuario));
    
    if (presupuestoUsuario=== '' || presupuestoUsuario=== null || isNaN(presupuestoUsuario) || presupuestoUsuario<=0) {
        window.location.reload();
    }



    presupuesto=  new Presupuesto(presupuestoUsuario);
    console.log(presupuesto)
    ui.insertarPresupuesto(presupuesto);
}



//añadir gastos.
function agregarGasto(e) {
    e.preventDefault();


    //leer los datos del fomrulario.
    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);


    if (nombre ==='' || cantidad==='') {
            ui.imprimirAlerta('ambos campos son obligatorios', 'error');
            return;
    }else if(cantidad<=0 ||isNaN(cantidad)){
        ui.imprimirAlerta('cantidad no valida', 'error')
        return;
    }
   
//generar un objeto con el gasto.
const gasto ={nombre, cantidad, id: Date.now()}
presupuesto.nuevoGasto(gasto)
    //el gasto se agrego sin problema.
    ui.imprimirAlerta('gasto agregado correctamente')

    //imprimir los gatos.
    const {gastos, restante} = presupuesto;
    ui.mostrarGastos(gastos);

    ui.actualizarRestante(restante);

    ui.comprobarPresupuesto(presupuesto);
    //reinicia el formulario.
    formulario.reset();
}


function eliminarGasto(id) {

    //esta los elimina del objeto
   presupuesto.eliminarGasto(id);

   //elimina los gastod del html
  const { gastos, restante} = presupuesto;
   ui.mostrarGastos(gastos);
   ui.actualizarRestante(restante);
   ui.comprobarPresupuesto(presupuesto);
}