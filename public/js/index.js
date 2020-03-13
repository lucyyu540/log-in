

$(function(){
    /**REGISTER */
    $("#register").on('click', function(event){
        event.preventDefault();
        console.log('clicked register button')
        //fetching values inputted by user
        var username   = $("#username").val();
        var password   = $("#password").val();
        var cpassword  = $("#cpassword").val();
        
        
        //front end validation
        if(!username || !password || !cpassword){ 
            $("#msgDiv").show().removeClass('alert-sucess').addClass('alert-danger').html("All fields are required.");
        } else if(cpassword != password){
            $("#msgDiv").show().removeClass('alert-sucess').addClass('alert-danger').html("Passwords should match.");
        } 
        else{ 
            const myObj = JSON.stringify({
                "username": username,
                "password": password,
                "cpassword": cpassword
            });
            $.ajax({//connecting to backend 
                url: 'register',
                method: 'POST',
                dataType:'json',
                data: myObj,
                contentType: "application/json; charset=utf-8"
            }).done(function( data ) {
                if ( data ) {
                    console.log(data);//debugging
                    if(data.status == 'error'){
                        var errors = '<ul>';
                        $.each( data.message, function( key, value ) {
                            errors = errors +'<li>'+value.msg+'</li>';
                        });
                        errors = errors+ '</ul>';
                        $("#msgDiv").removeClass('alert-sucess').addClass('alert-danger').html(errors).show();
                    }
                    else{//no error
                        $("#msgDiv").removeClass('alert-danger').addClass('alert-success').html(data.message).show(); 
                    }
                    $('#register-form')[0].reset();
                }
            });
        }
    });

    /**LOG IN */
    $("#login").on('click', function(event){
        event.preventDefault();
        console.log('clicked login button');
        var username   = $("#rusername").val();
        var password   = $("#rpassword").val();
        if (!username && !password) {
            $("#msgDiv").show().removeClass('alert-sucess').addClass('alert-danger').html("Username and password are required.");
        }
        else if(!username){ 
            $("#msgDiv").show().removeClass('alert-sucess').addClass('alert-danger').html("Username is required.");
        } 
        else if (!password) {
            $("#msgDiv").show().removeClass('alert-sucess').addClass('alert-danger').html("Password is required.");
        }
       
        else{ 
            const user = JSON.stringify({
                username : username,
                password : password
            });
            $.ajax({
                url: '/login',
                method: 'POST',
                dataType: 'json',
                data: user,
                contentType: "application/json; charset=utf-8",
            }).done(function( data ) {
                if ( data ) {
                    if(data.status == 'error'){
                        $("#msgDiv").removeClass('alert-sucess').addClass('alert-danger').html(data.message).show();
                        $('#login-form')[0].reset();
                    }
                    else{//status == success        
                        window.location = data.redirect;
                    }
                }
            });
        }
    });
});