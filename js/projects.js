$("#search_btn").on("click", function(){
    let selectTr = document.getElementById("projects_select");
    selectTr.style.display = "";

    let categoryTxt = $("#search_category").val();

    let selectOptions = document.getElementById("select_project");
    selectOptions.innerHTML = "";

    $.ajax({
        url: "http://localhost/NT%20Architects/database.php",
        type: "GET",
        data: { getprojectswithcategory: "true", 
                category: categoryTxt},
        dataType: 'json',
        success: function (obj) {
            let select_project_dropdown = document.getElementById("select_project");
            for (let i = 0; i < obj.length; i++) {
                let project_option = document.createElement("option");
                project_option.innerText = obj[i].name;
                project_option.value = obj[i].name;
                select_project_dropdown.appendChild(project_option);
            }
    
        },
        error: function (errorObj, txt) {
            alert(errorObj.status + " " + errorObj.statusText);
        }
    });
});

$("#view_projects_btn").on("click", function () {
    let name_of_project = $("#select_project").val();
    $.ajax({
        url: "http://localhost/NT%20Architects/database.php",
        type: "GET",
        data: {
            viewproject: "true",
            name: name_of_project
        },
        dataType: 'json',
        success: function (obj) {
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

            let project_div = document.getElementById("project_detail_container");
            project_div.style.display = "";

            // Changing the image src
            let project_image_src = document.getElementById("project_image_src");
            let src = "images/projects_images/" + project_id + ".jpg";
            project_image_src.src = src;
            project_image_src.alt = project_name;

            // Changing the discription and name texts
            let project_name_text = document.getElementById("project_name_text");
            project_name_text.innerText = project_name;

            let project_year_container = document.getElementById("project_yearfunction_text");
            let project_fun = "Function: " + project_function + "\n";
            project_fun += "Year: " + project_year + "\n";
            project_year_container.innerText = project_fun;

            let project_loc_container = document.getElementById("project_location_text");
            let project_loc = "Location: " + project_location + "\n";
            project_loc += "District: " + project_district + "\n";
            project_loc += "Lot Number: " + project_lot_number + "\n";
            project_loc_container.innerText = project_loc;

            let project_area_container = document.getElementById("project_sitearea_text");
            let project_area = "Site Area: " + project_site_area + "\n";
            project_area += "Floor Area: " + project_floor_area + "\n";
            project_area += "Building Height: " + project_building_height + "\n";
            project_area += "Number of households: " + project_household_nummber + "\n";
            project_area += "Total Build Up Area: " + project_total_build_area + "\n\n";

            project_area_container.innerText = project_area;

            let project_owner_container = document.getElementById("project_owner_text");
            let project_owner_name = "Owner: " + project_owner + "\n";
            project_owner_container.innerText = project_owner_name;

        },
        error: function (errorObj, txt) {
            alert(errorObj.status + " " + errorObj.statusText);
        }
    });
});