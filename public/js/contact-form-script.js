// $("#contactForm").validator().on("submit", function (event) {
//     console.info(event);
//     SendMessage(event);
// });

// function SendMessage()
// { 
//     submitMessage();
//     // if (event.isDefaultPrevented()) {
//     //     formError();
//     //     submitMSG(false, "Por favor complete todos los datos del formulario");
//     // } else {
//     //     event.preventDefault();
//     //     submitForm();
//     // }
// }

function SendMessage() 
{
    var contact = $("#txtcontact_message").val();
    var company = $("#txtcompany_message").val();
    var email = $("#txtemail_message").val();
    var phone = $("#txtphone_message").val();
    var message = $("#txtmessage_message").val();

    if (!contact || !company || !email || !message)
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
        contact: contact,
        company: company,
        email: email,
        phone: phone,
        message: message,
        token_ap: tk
    };

    $.ajax({
        type: "POST",
        url: "/api/contact/message",
        headers: {
            "token_ap": tk
        },
        data: data,
        success: function (result) 
        {
            clearMessageControls();
            Swal.fire(
                'Muchas gracias!',
                result,
                'success'
              )            
        },
        complete: function () {},
        error: function (error) 
        {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error.responseText,
            });    
        },
    });
};

function clearMessageControls()
{ 
    $("#txtcontact_message").value = '';    
    $("#txtcompany_message").value = '';    
    $("#txtemail_message").value = '';    
    $("#txtphone_message").value = '';    
    $("#txtmessage_message").value = '';    
};

// function formError_message() {
//     $("#contactForm").removeClass().addClass('shake animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
//         $(this).removeClass();
//     });
// };

// function showResult(response) {
//     // $('#msgSubmit').html(response);
//     var msgClasses = "h3 text-center tada animated text-success";
//     $("#msgSubmit").removeClass().addClass(msgClasses).text(response);
// };

// function submit_response(valid, msg) {
//     if (valid) {
//         var msgClasses = "h3 text-center tada animated text-success";
//     } else {
//         var msgClasses = "h3 text-center text-danger";
//     }
//     $("#msgSubmit").removeClass().addClass(msgClasses).text(msg);
// }