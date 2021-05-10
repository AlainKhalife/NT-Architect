//check if there was an upload
let urlparam = new URLSearchParams(window.location.search);
if (urlparam.has("success")) {
    alert("Project Successfuly Added");
}

// Toggle the side navigation
$("#sidebarToggle, #sidebarToggleTop").on('click', function(e) {
    $("body").toggleClass("sidebar-toggled");
    $(".sidebar").toggleClass("toggled");
    if ($(".sidebar").hasClass("toggled")) {
        $('.sidebar .collapse').collapse('hide');
    };
});

// Close any open menu accordions when window is resized below 768px
$(window).resize(function() {
    if ($(window).width() < 768) {
        $('.sidebar .collapse').collapse('hide');
    };

    // Toggle the side navigation when window is resized below 480px
    if ($(window).width() < 480 && !$(".sidebar").hasClass("toggled")) {
        $("body").addClass("sidebar-toggled");
        $(".sidebar").addClass("toggled");
        $('.sidebar .collapse').collapse('hide');
    };
});

// Prevent the content wrapper from scrolling when the fixed side navigation hovered over
$('body.fixed-nav .sidebar').on('mousewheel DOMMouseScroll wheel', function(e) {
    if ($(window).width() > 768) {
        var e0 = e.originalEvent,
            delta = e0.wheelDelta || -e0.detail;
        this.scrollTop += (delta < 0 ? 1 : -1) * 30;
        e.preventDefault();
    }
});

// Scroll to top button appear
$(document).on('scroll', function() {
    var scrollDistance = $(this).scrollTop();
    if (scrollDistance > 100) {
        $('.scroll-to-top').fadeIn();
    } else {
        $('.scroll-to-top').fadeOut();
    }
});

// Smooth scrolling using jQuery easing
$(document).on('click', 'a.scroll-to-top', function(e) {
    var $anchor = $(this);
    $('html, body').stop().animate({
        scrollTop: ($($anchor.attr('href')).offset().top)
    }, 1000, 'easeInOutExpo');
    e.preventDefault();
});


//Making sure the user is logged in
$.ajax({
    url: "http://localhost/NT%20Architects/database.php",
    type: "GET",
    data: { checklogin: "true" },
    dataType: 'text',
    async: false,
    success: function(obj) {
        console.log(obj);
        if (obj == -1) {
            alert("You are not logged in, please sign in");
            window.location.replace("../admin.html");
        }
    },
    error: function(errorObj, txt) {
        alert(errorObj.status + " " + errorObj.statusText);
    }
});
// End of check

// Sign Out button click
$("#sign_out_btn").on("click", function() {
    $.ajax({
        url: "http://localhost/NT%20Architects/database.php",
        type: "GET",
        data: { signout: "true" },
        dataType: 'text',
        async: false,
        success: function(obj) {
            if (obj == 1) {
                alert("You have succesfully signed out");
                window.location.replace("../admin.html");
            }
        },
        error: function(errorObj, txt) {
            alert(errorObj.status + " " + errorObj.statusText);
        }
    });
});
// End of sign out button click


// Fetching the projects from the database
$.ajax({
    url: "http://localhost/NT%20Architects/database.php",
    type: "GET",
    data: { viewallprojects: "true" },
    dataType: 'json',
    success: function(obj) {
        for (let i = 0; i < obj.length; i++) {
            let project_id = obj[i].idProject;
            let project_name = obj[i].name;
            let project_owner = obj[i].owner;
            let project_location = obj[i].location;
            let project_district = obj[i].disctrict;
            let project_function = obj[i].function;
            let project_lot_number = obj[i].lot_number;
            let project_site_area = obj[i].site_area;
            let project_building_height = obj[i].building_height;
            let project_floor_area = obj[i].floor_area;
            let project_household_nummber = obj[i].household_number;
            let project_total_build_area = obj[i].total_build_area;
            let project_status = obj[i].status;
            let project_year = obj[i].year;

            // filling project desctiption string with the project description
            let project_des = "Location: " + project_location + "\n";
            project_des += "District: " + project_district + "\n";
            project_des += "Function: " + project_function + "\n";
            project_des += "Lot Number: " + project_lot_number + "\n";
            project_des += "Site Area: " + project_site_area + "\n";
            project_des += "Building Height: " + project_building_height + "\n";
            project_des += "Floor Area: " + project_floor_area + "\n";
            project_des += "Number of households: " + project_household_nummber + "\n";
            project_des += "Total Build Up Area: " + project_total_build_area + "\n\n";
            project_des += "Owner: " + project_owner + "\n\n\n";
            project_des += "Status: " + project_status + "\n";
            project_des += "Year: " + project_year;



            let maindiv = document.createElement("div");
            maindiv.className = "card";
            maindiv.style.width = "18rem";
            maindiv.style.display = "inline-block";
            maindiv.style.marginLeft = "15px"

            let projectimage = document.createElement("img");
            projectimage.className = "card-img-top";
            projectimage.src = `../images/projects_images/${project_id}.jpg`;
            projectimage.alt = project_name;
            projectimage.width = "600";
            projectimage.height = "200";
            maindiv.appendChild(projectimage);

            let cardbody = document.createElement("div"); // Card body
            cardbody.className = "card-body";

            let cardtitle = document.createElement("h5");
            cardtitle.className = "card-title";
            cardtitle.innerText = project_name;
            let p = document.createElement("p");
            p.innerText = project_des;

            cardbody.appendChild(cardtitle);
            cardbody.appendChild(p);

            maindiv.appendChild(cardbody);

            document.getElementById("projects").appendChild(maindiv);
        }

    },
    error: function(errorObj, txt) {
        alert(errorObj.status + " " + errorObj.statusText);
    }
});

// Delete Project Page

// Filling the select option to delete
$.ajax({
    url: "http://localhost/NT%20Architects/database.php",
    type: "GET",
    data: { getprojects: "true" },
    dataType: 'json',
    success: function(obj) {
        let select_project_dropdown = document.getElementById("select_project");
        for (let i = 0; i < obj.length; i++) {
            let project_option = document.createElement("option");
            project_option.innerText = obj[i].name;
            project_option.value = obj[i].name;
            select_project_dropdown.appendChild(project_option);
        }

    },
    error: function(errorObj, txt) {
        alert(errorObj.status + " " + errorObj.statusText);
    }
});

// Filling modal body on delete press
$("#delete_project_btn").on("click", function() {
    let name_of_project = $("#select_project").val();
    $.ajax({
        url: "http://localhost/NT%20Architects/database.php",
        type: "GET",
        data: {
            viewproject: "true",
            name: name_of_project
        },
        dataType: 'json',
        success: function(obj) {
            let project_id = obj[0].idProject;
            let project_name = obj[0].name;
            let project_owner = obj[0].owner;
            let project_location = obj[0].location;
            let project_district = obj[0].disctrict;
            let project_function = obj[0].function;
            let project_lot_number = obj[0].lot_number;
            let project_site_area = obj[0].site_area;
            let project_building_height = obj[0].building_height;
            let project_floor_area = obj[0].floor_area;
            let project_household_nummber = obj[0].household_number;
            let project_total_build_area = obj[0].total_build_area;
            let project_status = obj[0].status;
            let project_year = obj[0].year;



            let project_discription_container = document.getElementById("modal_project_description");
            let modal_title_text = document.getElementById("modal_title_text");
            modal_title_text.innerText = project_name;

            let project_des = "Location: " + project_location + "\n";
            project_des += "District: " + project_district + "\n";
            project_des += "Function: " + project_function + "\n";
            project_des += "Lot Number: " + project_lot_number + "\n";
            project_des += "Site Area: " + project_site_area + "\n";
            project_des += "Building Height: " + project_building_height + "\n";
            project_des += "Floor Area: " + project_floor_area + "\n";
            project_des += "Number of households: " + project_household_nummber + "\n";
            project_des += "Total Build Up Area: " + project_total_build_area + "\n\n";
            project_des += "Owner: " + project_owner + "\n\n\n";
            project_des += "Status: " + project_status + "\n";
            project_des += "Year: " + project_year;

            project_discription_container.innerText = project_des;

        },
        error: function(errorObj, txt) {
            alert(errorObj.status + " " + errorObj.statusText);
        }
    });
});

// Confirming and deleting a project
$("#confirm_delete_btn").on("click", function() {
    let name_of_project = $("#select_project").val();
    $.ajax({
        url: "http://localhost/NT%20Architects/database.php",
        type: "POST",
        data: {
            deleteproject: "true",
            name: name_of_project
        },
        dataType: 'json',
        success: function(obj) {
            if (obj == 1) {
                alert(`Project ${name_of_project} deleted successfuly`);
                window.location.reload();
            } else {
                alert("Error while deleting from database");
            }

        },
        error: function(errorObj, txt) {
            alert(errorObj.status + " " + errorObj.statusText);
        }
    });
});

// For edit-project.html
// on edit project button press
// Filling modal body on delete press
$("#edit_project_btn").on("click", function() {
    let form = document.getElementById("edit_form");
    form.style.visibility = "";

    let name_of_project = $("#select_project").val();
    $.ajax({
        url: "http://localhost/NT%20Architects/database.php",
        type: "GET",
        data: {
            viewproject: "true",
            name: name_of_project
        },
        dataType: 'json',
        success: function(obj) {
            let project_id = obj[0].idProject;
            let project_name = obj[0].name;
            let project_owner = obj[0].owner;
            let project_location = obj[0].location;
            let project_district = obj[0].disctrict;
            let project_function = obj[0].function;
            let project_lot_number = obj[0].lot_number;
            let project_site_area = obj[0].site_area;
            let project_building_height = obj[0].building_height;
            let project_floor_area = obj[0].floor_area;
            let project_household_nummber = obj[0].household_number;
            let project_total_build_area = obj[0].total_build_area;
            let project_status = obj[0].status;
            let project_year = obj[0].year;

            $("#txt-project-name").val(project_name);
            $("#txt-location").val(project_location);
            $("#txt-disctrict").val(project_district);
            $("#txt-function").val(project_function);
            $("#txt-lot-number").val(project_lot_number);
            $("#txt-site-area").val(project_site_area);
            $("#txt-building-height").val(project_building_height);
            $("#txt-floor-area").val(project_floor_area);
            $("#txt-total-build-area").val(project_total_build_area);
            $("#txt-household-number").val(project_household_nummber);
            $("#txt-owner").val(project_owner);
            $("#txt-status").val(project_status);
            $("#txt-year").val(project_year);


        },
        error: function(errorObj, txt) {
            alert(errorObj.status + " " + errorObj.statusText);
        }
    });
});

// Applying changes after apply button is pressed
$("#apply_changes_btn").on("click", function() {
    let old_name = $("#select_project").val();

    let project_name = $("#txt-project-name").val();
    let project_location = $("#txt-location").val();
    let project_district = $("#txt-disctrict").val();
    let project_function = $("#txt-function").val();
    let project_lot_number = $("#txt-lot-number").val();
    let project_site_area = $("#txt-site-area").val();
    let project_building_height = $("#txt-building-height").val();
    let project_floor_area = $("#txt-floor-area").val();
    let project_total_build_area = $("#txt-total-build-area").val();
    let project_household_nummber = $("#txt-household-number").val();
    let project_owner = $("#txt-owner").val();
    let project_status = $("#txt-status").val();
    let project_year = $("#txt-year").val();
    $.ajax({
        url: "http://localhost/NT%20Architects/database.php",
        type: "POST",
        data: {
            editproject: "true",
            oldName: old_name,
            name: project_name,
            location: project_location,
            disctrict: project_district,
            function: project_function,
            lotNumber: project_lot_number,
            siteArea: project_site_area,
            buildingHeight: project_building_height,
            floorArea: project_floor_area,
            totalBuildArea: project_total_build_area,
            householdNumber: project_household_nummber,
            owner: project_owner,
            status: project_status,
            year: project_year
        },
        dataType: 'text',
        success: function(obj) {
            if (obj == 1) {
                alert("Project Successfuly Updated");
                window.location.replace("./edit-project.html");
            } else if (obj == -1) {
                alert("Error while updating project");
            }
        },
        error: function(errorObj, txt) {
            alert(errorObj.status + " " + errorObj.statusText);
        }
    });
});

// messages.html
//--------------------------

let hasdeleted = false;

// gettings messages from DB and filling them in cards
function getMessages() {
    $.ajax({
        url: "http://localhost/NT%20Architects/database.php",
        type: "GET",
        async: false,
        data: { viewallmessages: "true" },
        dataType: 'json',
        success: function(obj) {
            for (let i = 0; i < obj.length; i++) {
                // getting the message info
                let id = obj[i].number;
                let firstname = obj[i].first_name;
                let lastname = obj[i].last_name;
                let email = obj[i].email;
                let phone_number = obj[i].phone_number;
                let message = obj[i].message


                // Creating the cards dynamically
                let maindiv = document.createElement("div");
                maindiv.className = "card";
                maindiv.style.width = "50rem";
                maindiv.style.display = "inline-block";
                maindiv.style.marginLeft = "15px";
                maindiv.style.marginTop = "10px";

                let cardbody = document.createElement("div"); // Card body
                cardbody.className = "card-body";

                let cardtitle = document.createElement("h5");
                cardtitle.className = "card-title";
                cardtitle.innerText = "Message " + (i + 1);

                let p = document.createElement("p");
                let text = "Name: " + firstname + " " + lastname + "\n";
                text += "Phone Number: " + phone_number + "\n";
                text += "Email: " + email + "\n";
                text += "Message: \n" + message + "\n";
                p.innerText = text;

                let a = document.createElement("a");
                a.href = "#";
                a.className = "btn btn-primary delete_msg_btn";
                a.style.float = "right";
                a.style.marginBottom = "10px"
                a.innerText = "Delete";
                //a.id = "delete_msg_btn";
                a.setAttribute("project_id", id);

                cardbody.appendChild(cardtitle);
                cardbody.appendChild(p);
                cardbody.appendChild(a);

                maindiv.appendChild(cardbody);

                document.getElementById("messages").appendChild(maindiv);
            }

            // Creating delete all messages btn
            if (obj.length > 0 && !hasdeleted) {
                let div = document.createElement("div");
                let a = document.createElement("a");
                a.href = "#";
                a.className = "btn btn-primary deleteallmsg_btn";
                a.style.width = "fit-content";
                a.style.float = "right";
                a.style.marginRight = "20px"
                a.style.marginTop = "20px"
                a.style.marginBottom = "10px"
                a.style.position = "relative";
                a.id = "delete_all_msg_btn"
                a.innerText = "Delete All Messages";

                div.appendChild(a);
                document.getElementById("content").appendChild(div);
            }

            if (obj.length == 0) {
                let p = document.createElement("h3");
                p.innerText = "There are no messages available"

                document.getElementById("messages").appendChild(p);
            }

        },
        error: function(errorObj, txt) {
            alert(errorObj.status + " " + errorObj.statusText);
        }
    });
}

getMessages();

// deleting one message:
$("body").on("click", ".btn.btn-primary.delete_msg_btn", function(e) {
    e.preventDefault();
    hasdeleted = true;

    let project_id = e.target.getAttribute("project_id");
    $.ajax({
        url: "http://localhost/NT%20Architects/database.php",
        type: "POST",
        data: {
            delete_msg: "true",
            id: project_id
        },
        dataType: 'text',
        success: function(obj) {

            if (obj == 1) {
                document.getElementById("messages").innerHTML = "";
                getMessages();
            } else {
                alert("Error in database")
            }

        },
        error: function(errorObj, txt) {
            alert(errorObj.status + " " + errorObj.statusText);
        }
    });
});

//deleting all messages
$("body").on("click", ".btn.btn-primary.deleteallmsg_btn", function(e) {
    e.preventDefault();
    console.log("Delete All");

    $.ajax({
        url: "http://localhost/NT%20Architects/database.php",
        type: "POST",
        data: {
            deleteAllmsg: "true",
        },
        dataType: 'text',
        success: function(obj) {
            document.getElementById("messages").innerHTML = "";
            document.getElementById("delete_all_msg_btn").remove();
            let p = document.createElement("h3");
            p.innerText = "There are no messages available"

            document.getElementById("messages").appendChild(p);
        },
        error: function(errorObj, txt) {
            alert(errorObj.status + " " + errorObj.statusText);
        }
    });
});