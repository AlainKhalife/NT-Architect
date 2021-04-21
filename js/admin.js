let urlparam = new URLSearchParams(window.location.search);

$.ajax({
    url: "http://localhost/NT%20Architects/database.php",
    type: "GET",
    data: { checklogin: "true" },
    dataType: 'text',
    async: false,
    success: function (obj) {
        if (obj == 1) {
            window.location.replace("./Admin page/index.html");
            alert("You are already loged in");
        }
},
    error: function (errorObj, txt) {
        alert(errorObj.status + " " + errorObj.statusText);
    }
});

if(urlparam.has("incpass")){
    alert("Incorrect Password");
} else if(urlparam.has("incuser")){
    alert("Incorrect Username");
}