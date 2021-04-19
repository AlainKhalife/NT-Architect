<?php

session_start();


function connectServer($servername,$username,$password)
{
$connection = new mysqli($servername, $username, $password);
if ($connection->connect_error)
{
throw new Exception("Connection Error");
}
else {
    return $connection;
}
}

function connectDb($servername,$username,$password,$dbname)
{
$connection = new mysqli($servername, $username, $password,$dbname);
if ($connection->connect_error)
{
throw new Exception("Connection Error");
}
else {
    return $connection;
}
}

function selectQuery($connection, $query)
{
    $result= $connection->query($query);

    $multiArray=array();
    While($row = $result->fetch_assoc()) {
        array_push($multiArray,$row);
        }
    return $multiArray;
}

function executeQuery($connection, $query)
{
    $result= $connection->query($query);
    return $result;
}

function userExists($connection, $tablename, $username)
{
    $result= selectQuery($connection,"select * from $tablename where username='$username'");
    return count($result)>0;
}
function checkPasswordMatch($password,$ccpassword)
{
    return ($password==$ccpassword);
}
function addUser($connection, $tablename, $password, $ccpassword, $username)
{
    if(userExists($connection,$tablename,$username))
    {
        return -1;
    }
    if(!checkPasswordMatch($password,$ccpassword))
    {
        return -2;
    }
    $hashedPassword= md5($password);
    
    $address = $_POST['address'];
    $phonenumber = $_POST['phonenumber'];
    $email = $_POST['email'];
    executeQuery($connection,"Insert into $tablename (username,password) values ('$username','$hashedPassword')");
    $loginid = selectQuery($connection,"select id from $tablename where username='$username'");
    $loginidnbr = $loginid[0]['id'];
    executeQuery($connection, "Insert into customer (Name,Address,phone_number,email,Login_id) values ('$username','$address','$phonenumber','$email', $loginidnbr)");
    return 1;
}

function passwordMatches($connection,$tablename,$username,$password)
{
    $result= selectQuery($connection,"Select password from $tablename where username='$username'");
    return $result[0]["password"]==md5($password);
    
}

function signInUser($connection,$tablename,$username,$password)
{
    if(userExists($connection,$tablename,$username) )
    {
        if(passwordMatches($connection,$tablename,$username,$password))
        {
            return 1;  
        }
      return -1;
    }
    return -2;
}


function alert($msg) {
    echo "<script type='text/javascript'>alert('$msg');</script>";
}

    header("Access-Control-Allow-Origin: *");
    header('Access-Control-Allow-Credentials: true');    
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

    if($_SERVER['REQUEST_METHOD']=='GET' && isset($_GET['getprojects'])){
        header('Content-type:application/json;charset=utf-8');
        $connection = connectDb("localhost","root","","nt_projects");
        $result = selectQuery($connection, "select name from project");
        $ans = json_encode($result);
        echo $ans;
    }

    if($_SERVER['REQUEST_METHOD']=='GET' && isset($_GET['viewproject'])){
        header('Content-type:application/json;charset=utf-8');
        $connection = connectDb("localhost","root","","nt_projects");
        $name = $_GET["name"];
        $result = selectQuery($connection, "select * from project where name='$name'");
        $ans = json_encode($result);
        echo $ans;
    }

    if($_SERVER['REQUEST_METHOD']=='POST' && isset($_POST['txt_username'])){
        header('Content-Type: text/plain');
        
        $username = $_POST['txt_username'];
        $password = $_POST['txt_password'];

        $connection = connectDb("localhost","root","","nt_projects");
        $result = signInUser($connection, "admin", $username, $password);

        if($result==1){
            $_SESSION["logedin"] = "true";
            header("Location: ./Admin page/index.html");
            alert("Successfuly signed in");
            exit();
        } else if ($result==-1) {
            alert("Incorrect Password");
            header("Location: admin.html?incpass=\"true\"");
        } else {
            alert("Incorrect Username");
            header("Location: admin.html?incuser=\"true\"");
        }
    }

    if($_SERVER['REQUEST_METHOD']=='GET' && isset($_GET['checklogin'])){
        header('Content-Type: text/plain');
        
        if(isset($_SESSION['logedin'])){
            echo 1;
        } else {
            echo -1;
        }
    }

    if($_SERVER['REQUEST_METHOD']=='GET' && isset($_GET['signout'])){
        header('Content-Type: text/plain');
        
        session_destroy();
        echo 1;
    }

    //getting all projects
    if($_SERVER['REQUEST_METHOD']=='GET' && isset($_GET['viewallprojects'])){
        header('Content-type:application/json;charset=utf-8');
        $connection = connectDb("localhost","root","","nt_projects");
        $result = selectQuery($connection, "select * from project");
        $ans = json_encode($result);
        echo $ans;
    }

    // Adding a project to the database
    if($_SERVER['REQUEST_METHOD']=='POST' && isset($_POST['txt_project_name'])){
        header('Content-type:application/json;charset=utf-8');
        $connection = connectDb("localhost","root","","nt_projects");
        
        $project_name = $_POST['txt_project_name'];
        $location = $_POST['txt_location'];
        $district = $_POST['txt_district'];
        $function = $_POST['txt_function'];
        $lot_number = $_POST['txt_lot_number'];
        $site_area = $_POST['txt_site_area'];
        $building_height = $_POST['txt_building_height'];
        $floor_area = $_POST['txt_floor_area'];
        $build_area = $_POST['txt_total_build_area'];
        $household_number = $_POST['txt_household_number'];
        $owner = $_POST['txt_owner'];
        $status = $_POST['txt_status'];
        $year = $_POST['txt_year'];

        // Get latest id from db
        $result = selectQuery($connection, "select MAX(idProject)+1 from project");
        $id = $result[0]['MAX(idProject)+1'];


        executeQuery($connection, "insert into `project` (`name`, `location`, `disctrict`, `function`, `lot_number`, `site_area`, `building_height`, `floor_area`, `total_build_area`, `household_number`, `owner`, `status`, `year`) VALUES ('$project_name', '$location', '$district', '$function', '$lot_number', '$site_area', '$building_height', '$floor_area', '$build_area', '$household_number', '$owner', '$status', '$year')");
        executeQuery($connection, "insert into `images` (`src`, `Project_idProject`) values ('./images/project_images/', '$id')");
        move_uploaded_file($_FILES["project_image"]["tmp_name"], "images/projects_images/" . $id . ".jpg");
        header("Location: ./Admin page/add-project.html?success=$id");

    }

    // Deleting project from the database:
    if($_SERVER['REQUEST_METHOD']=='POST' && isset($_POST['deleteproject'])){
        header('Content-Type: text/plain');
        $connection = connectDb("localhost","root","","nt_projects");
        $name = $_POST['name'];

        $result = executeQuery($connection, "delete from project where name='$name'");
        if($result){
            echo 1;
        } else {
            echo -1;
        }
        
    }

    // editing project
    if($_SERVER['REQUEST_METHOD']=='POST' && isset($_POST['editproject'])){
        header('Content-Type: text/plain');
        $connection = connectDb("localhost","root","","nt_projects");
        $oldName = $_POST['oldName'];
        $name = $_POST['name'];
        $location = $_POST['location'];
        $disctrict = $_POST['disctrict'];
        $function = $_POST['function'];
        $lotNumber = $_POST['lotNumber'];
        $siteArea = $_POST['siteArea'];
        $buildingHeight = $_POST['buildingHeight'];
        $floorArea = $_POST['floorArea'];
        $totalBuildArea = $_POST['totalBuildArea'];
        $householdNumber = $_POST['householdNumber'];
        $owner = $_POST['owner'];
        $status = $_POST['status'];
        $year = $_POST['year'];

        $result = executeQuery($connection, "update `project` set `name` = '$name', `location` = '$location', `disctrict` = '$disctrict', `function` = '$function', `lot_number` = '$lotNumber', `site_area` = '$siteArea', `building_height` = '$buildingHeight', `floor_area` = '$floorArea', `total_build_area` = '$totalBuildArea', `household_number` = '$householdNumber', `owner` = '$owner', `status` = '$status', `year` = '$year' WHERE `project`.`name` = '$oldName'");
        if($result){
            echo 1;
        } else {
            echo -1;
        }
        
    }

?>