

$(function(){

    $("#register").on('click', function(event){
        event.preventDefault();
        //fetching values inputted by user
        var username   = $("#username").val();
        var password   = $("#password").val();
        var cpassword  = $("#cpassword").val();
        
        
        //front end validation
        if(!username || !password || !cpassword){ 
            $("#msgDiv").show().html("All fields are required.");
        } else if(cpassword != password){
            $("#msgDiv").show().html("Passwords should match.");
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
                }
            });
        }
    });

    $("#login").on('click', function(event){
        event.preventDefault();
        var username   = $("#rusername").val();
        var password   = $("#rpassword").val();

        if(!username){ 
            $("#msgDiv").show().html("Username is required.");
        } 
        else if (!password) {
            $("#msgDiv").show().html("Password is required.");
        }
        else if (!username && !password) {
            $("#msgDiv").show().html("Username and password are required.");
        }
        else{ 
            const myObject = JSON.stringify({
                "username" : username,
                "password" : password
            });
            $.ajax({
                url: "/login",
                method: "GET",
                dataType: 'json',
                data: myObject,
                contentType: "application/json; charset=utf-8"

            }).done(function( data ) {
                if ( data ) {
                    if(data.status == 'error'){
                        var errors = '<ul>';
                        $.each( data.message, function( key, value ) {
                            errors = errors +'<li>'+value.msg+'</li>';
                        });
                        errors = errors+ '</ul>';
                        $("#msgDiv").removeClass('alert-sucess').addClass('alert-danger').html(errors).show();
                    }else{
                        $("#msgDiv").removeClass('alert-danger').addClass('alert-success').html(data.message).show(); 
                    }
                }
            });
        }
    });
});