$("#demoForm").validator().on("submit", function (event) 
{
    // console.info(event);
    
    // if (event.isDefaultPrevented()) 
    // {
    //     formError();
    //     submitMSG(false, "Por favor complete todos los datos del formulario");
    // }
    // else 
    // {
    //     event.preventDefault();
    //     submitForm();
    // }
    RequestLicense();
});



function RequestLicense() {
    
    var name = $("#txtname").val();
    var lastname = $("#txtlastname").val();
    var company = $("#txtcompany").val();
    var email = $("#txtemail").val();

    if (!name || !lastname || !company || !email)
    { 
        Swal.fire(
            'Incompleto',
            'Por favor complete todos los datos obligatorios.',
            'warning'
        );
        return;        
    }

    const tk = "S1pNX1dTQVVUSF9QU1dTXzE5MThfWlVNVVBHUg==";

    var data = {
        name: name,
        lastname: lastname,
        company: company,
        email: email,
        token_ap: tk
    };

    showLoading('loading', true);
    $.ajax({
        type: "POST",
        url: "api/portal/demo",
        headers: {
            "token_ap": tk
        },
        data: data,
        success: function (r) 
        {
            cleaDemoControls();
            let lic = r.Lic;
            let client = r.ClientId;
            let token = r.Token;
            let msj = "Licencia : " + lic + " Cliente : " + client;
            showResult(lic, client, token);
        },
        complete: function () 
        {
        },
        error: function (error) 
        {
            showLoading('loading', false);
            
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error.responseText,
            });                
        },
    });
}

function cleaDemoControls()
{ 
    $("#txtname").value = '';    
    $("#txtlastname").value = '';    
    $("#txtcompany").value = '';    
    $("#txtemail").value = '';        
};

// function formSuccess() {
//     // $("#demoForm")[0].reset();
//     submitMSG(true, "Su solicitud ha sido recibida, por favor revise el correo proporcionado");
// }

// function formError() {
//     $("#demoForm").removeClass().addClass('shake animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
//         $(this).removeClass();
//     });
// }

function showResult(lic, clientId, token) 
{
    
    showLoading('loading', false);
    var modalForm = $("#getDemo");
    if (modalForm) {
        $('#getDemo').modal('hide');
    }

    $('#divLic').html("Licencia : " + lic);
    $('#divClient').html("Cliente : " + clientId);
    $('#demoLicResult').modal('show');
};

function showLoading(id, value) {
    document.getElementById(id).style.display = value ? 'block' : 'none';
}

// function onReady(callback) {
//     var intervalID = window.setInterval(checkReady, 1000);

//     function checkReady() {
//         if (document.getElementsByTagName('body')[0] !== undefined) {
//             window.clearInterval(intervalID);
//             callback.call(this);
//         }
//     }
// }