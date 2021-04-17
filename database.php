<?php

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

?>