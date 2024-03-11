const _modeloEmpleado = {
    idEmpleado : 0,
    nombreCompleto : "",
    idDepartamento : 0,
    sueldo : 0,
    fechaContrato :""
}

function MostrarEmpleados() {

    fetch("/Home/listaEmpleados")
        .then(response => {
            return response.ok ? response.json() : Promise.reject(response)
        })
        .then(responseJson => {

            if(responseJson.length > 0) {

                $("#tablaEmpleados tbody").html("");

                responseJson.forEach((empleado) => {

                    $("#tablaEmpleados tbody").append(
                        $("<tr>").append(
                            $("<td>").text(empleado.nombreCompleto),
                            $("<td>").text(empleado.refDepartamento.nombre),
                            $("<td>").text(empleado.sueldo),
                            $("<td>").text(empleado.fechaContrato),
                            $("<td>").append(
                                $("<button>").addClass("btn btn-primary btn-sm boton-editar-empleado").text("Editar").data("dataEmpleado",empleado),
                                $("<button>").addClass("btn btn-danger btn-sm ms-2 boton-eliminar-empleado").text("Eliminar").data("dataEmpleado",empleado),
                            )
                        )
                    )
                })
            }
        })
}

document.addEventListener("DOMContentLoaded", function () {

    MostrarEmpleados();

    fetch("/Home/listaDepartamentos")
        .then(response => {

            return response.ok ? response.json() : Promise.reject(response)

        })
        .then(responseJson => {

            if (responseJson.length > 0) {
                responseJson.forEach((item) => {

                    $("#cboDepartamento").append(
                        $("<option>").val(item.idDepartamento).text(item.nombre)
                    )
                })
            }

        })

    $("#txtFechaContrato").datepicker({

        format: "dd/mm/yy",
        autoclose:true,
        todayHighlight:true
    })



}, false)



function MostrarModal() {

    $("#txtNombreCompleto").val(_modeloEmpleado.nombreCompleto);
    $("#cboDepartamento").val(_modeloEmpleado.idDepartamento == 0 ? $("#cboDepartamento option:first").val() : _modeloEmpleado.idDepartamento);
    $("#txtSueldo").val(_modeloEmpleado.sueldo);
    $("#txtFechaContrato").val(_modeloEmpleado.fechaContrato)

    $("#modalEmpleado").modal("show");
}


$(document).on("click", ".boton-nuevo-empleado", function () {

    _modeloEmpleado.idEmpleado = 0;
    _modeloEmpleado.nombreCompleto = "";
    _modeloEmpleado.idDepartamento = 0;
    _modeloEmpleado.sueldo = 0;
    _modeloEmpleado.fechaContrato = "";

    MostrarModal();
})

$(document).on("click", ".boton-editar-empleado", function () {

    const _empleado = $(this).data("dataEmpleado");

    _modeloEmpleado.idEmpleado = _empleado.idEmpleado;
    _modeloEmpleado.nombreCompleto = _empleado.nombreCompleto;
    _modeloEmpleado.idDepartamento = _empleado.refDepartamento.idDepartamento;
    _modeloEmpleado.sueldo = _empleado.sueldo;
    _modeloEmpleado.fechaContrato = _empleado.fechaContrato;

    MostrarModal();
})


$(document).on("click", ".boton-guardar-cambios-empleado", function () {

    const modelo = {
        idEmpleado: _modeloEmpleado.idEmpleado,
        nombreCompleto: $("#txtNombreCompleto").val(),
        refDepartamento: {
            idDepartamento: $("#cboDepartamento").val()
        },
        sueldo: $("#txtSueldo").val(),
        fechaContrato: $("#txtFechaContrato").val()
    }

    if (_modeloEmpleado.idEmpleado == 0) {

        fetch("/Home/GuardarEmpleado", {
            method: "POST",
            headers: { "Content-Type": "application/json; charset=utf-8" },
            body: JSON.stringify(modelo)
        })
            .then(response => {
                return response.ok ? response.json() : Promise.reject(response)
            })
            .then(responseJson => {

                if (responseJson.valor) {
                    $("#modalEmpleado").modal("hide");
                    Swal.fire("Listo!", "Empleado fue Creado", "success");
                    MostrarEmpleados();
                }
                else {
                    Swal.fire("Lo sentimos!", "No se pudo Crear", "error");
                }
            })
    }
    else
    {
        fetch("/Home/EditarEmpleado", {
            method: "PUT",
            headers: { "Content-Type": "application/json; charset=utf-8" },
            body: JSON.stringify(modelo)
        })
            .then(response => {
                return response.ok ? response.json() : Promise.reject(response)
            })
            .then(responseJson => {

                if (responseJson.valor) {
                    $("#modalEmpleado").modal("hide");
                    Swal.fire("Listo!", "Empleado fue Actualizado", "success");
                    MostrarEmpleados();
                }
                else {
                    Swal.fire("Lo sentimos!", "No se pudo Actualizar", "error");
                }
            })
    }
})

$(document).on("click", ".boton-eliminar-empleado", function () {

    const _empleado = $(this).data("dataEmpleado");

    Swal.fire({
        title: "Estas seguro?",
        text: `Emilinar empleado "${_empleado.nombreCompleto}"`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, eliminar",
        cancelButtonText: "No, volver"
    }).then((result) => {

        if (result.isConfirmed) {
            fetch(`/Home/ElimnarEmpleado?idEmpleado=${_empleado.idEmpleado}`, {
                method: "DELETE"
            })
                .then(response => {
                    return response.ok ? response.json() : Promise.reject(response)
                })
                .then(responseJson => {

                    if (responseJson.valor) {
                        Swal.fire("Listo!", "Empleado fue Elimado", "success");
                        MostrarEmpleados();
                    }
                    else {
                        Swal.fire("Lo sentimos!", "No se pudo Eliminar", "error");
                    }
                })
        }
        
    })
})