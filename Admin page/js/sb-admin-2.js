//check if there was an upload
let urlparam = new URLSearchParams(window.location.search);
if(urlparam.has("success")){
  alert("Project Successfuly Added");
}

// Toggle the side navigation
$("#sidebarToggle, #sidebarToggleTop").on('click', function (e) {
  $("body").toggleClass("sidebar-toggled");
  $(".sidebar").toggleClass("toggled");
  if ($(".sidebar").hasClass("toggled")) {
    $('.sidebar .collapse').collapse('hide');
  };
});

// Close any open menu accordions when window is resized below 768px
$(window).resize(function () {
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
$('body.fixed-nav .sidebar').on('mousewheel DOMMouseScroll wheel', function (e) {
  if ($(window).width() > 768) {
    var e0 = e.originalEvent,
      delta = e0.wheelDelta || -e0.detail;
    this.scrollTop += (delta < 0 ? 1 : -1) * 30;
    e.preventDefault();
  }
});

// Scroll to top button appear
$(document).on('scroll', function () {
  var scrollDistance = $(this).scrollTop();
  if (scrollDistance > 100) {
    $('.scroll-to-top').fadeIn();
  } else {
    $('.scroll-to-top').fadeOut();
  }
});

// Smooth scrolling using jQuery easing
$(document).on('click', 'a.scroll-to-top', function (e) {
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
  success: function (obj) {
    console.log(obj);
    if (obj == -1) {
      alert("You are not logged in, please sign in");
      window.location.replace("../admin.html");
    }
  },
  error: function (errorObj, txt) {
    alert(errorObj.status + " " + errorObj.statusText);
  }
});
// End of check

// Sign Out button click
$("#sign_out_btn").on("click", function () {
  $.ajax({
    url: "http://localhost/NT%20Architects/database.php",
    type: "GET",
    data: { signout: "true" },
    dataType: 'text',
    async: false,
    success: function (obj) {
      if (obj == 1) {
        alert("You have succesfully signed out");
        window.location.replace("../admin.html");
      }
    },
    error: function (errorObj, txt) {
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
  success: function (obj) {
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
  error: function (errorObj, txt) {
    alert(errorObj.status + " " + errorObj.statusText);
  }
});

// Delete Project Page

// Filling the select option to delete
$.ajax({
  url:"http://localhost/NT%20Architects/database.php",
  type:"GET",
  data: {getprojects: "true"},
  dataType:'json',
  success:function(obj){
      let select_project_dropdown = document.getElementById("select_project");
      for(let i=0; i<obj.length; i++){
      let project_option = document.createElement("option");
      project_option.innerText = obj[i].name;
      project_option.value = obj[i].name;
      select_project_dropdown.appendChild(project_option);
      }

  },
  error: function(errorObj,txt){
      alert(errorObj.status+" "+errorObj.statusText);
  }
});

// Filling modal body on delete press
$("#delete_project_btn").on("click", function(){
  let name_of_project = $("#select_project").val();
    $.ajax({
        url:"http://localhost/NT%20Architects/database.php",
        type:"GET",
        data: {viewproject: "true",
               name: name_of_project},
        dataType:'json',
        success:function(obj){
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
        error: function(errorObj,txt){
            alert(errorObj.status+" "+errorObj.statusText);
        }
    });
});

// Confirming and deleting a project
$("#confirm_delete_btn").on("click", function(){
  let name_of_project = $("#select_project").val();
  $.ajax({
    url:"http://localhost/NT%20Architects/database.php",
    type:"POST",
    data: {deleteproject: "true",
           name: name_of_project},
    dataType:'json',
    success:function(obj){
        if(obj==1){
          alert(`Project ${name_of_project} deleted successfuly`);
          window.location.reload();
        } else {
          alert("Error while deleting from database");
        }

    },
    error: function(errorObj,txt){
        alert(errorObj.status+" "+errorObj.statusText);
    }
});
});