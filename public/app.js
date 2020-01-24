

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
            $("#msgDiv").show().html("Passowrds should match.");
        } 
        else{ 
            $.ajax({//connecting to backend 
                url: '/register',
                method: "POST",
                data: {
                    username: username, 
                    password: password, 
                    cpassword: cpassword
                }
            }).done(function( data ) {

                if ( data ) {
                    if(data.status == 'error'){
                        var errors = '<ul>';
                        $.each( data.message, function( key, value ) {
                            errors = errors +'<li>'+value.msg+'</li>';
                        });
                        errors = errors+ '</ul>';
                        $("#msgDiv").html(errors).show();
                    }else{
                        $("#msgDiv").removeClass('alert-danger').addClass('alert-success').html(data.message).show(); 
                    }
                }
            });
        }
    });

    $("#login").on('click', function(event){
        event.preventDefault();
        var username   = $("#username").val();
        var password   = $("#password").val();

        if(!username || !password){ 
            $("#msgDiv").show().html("All fields are required.");
        } 
        else{ 
            $.ajax({
                url: "/login",
                method: "GET",
                data: { username: username, password: password}
            }).done(function( data ) {

                if ( data ) {
                    if(data.status == 'error'){
                        var errors = '<ul>';
                        $.each( data.message, function( key, value ) {
                            errors = errors +'<li>'+value.msg+'</li>';
                        });
                        errors = errors+ '</ul>';
                        $("#msgDiv").html(errors).show();
                    }else{
                        $("#msgDiv").removeClass('alert-danger').addClass('alert-success').html(data.message).show(); 
                    }
                }
            });
        }
    });
});