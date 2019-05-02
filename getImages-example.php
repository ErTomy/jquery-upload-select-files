<?php

function getDirContents($dir, $urlpath,  &$results = array()){
    $files = scandir($dir);
    foreach($files as $key => $value){
        $path = realpath($dir.DIRECTORY_SEPARATOR.$value);
        if(!is_dir($path)) {
            $results[] = str_replace(__DIR__, $urlpath, str_replace(DIRECTORY_SEPARATOR, '/', $path));
        } else if($value != "." && $value != "..") {
            getDirContents($path, $urlpath, $results);           
        }
    }
    return $results;
}


$path = __DIR__ . DIRECTORY_SEPARATOR . 'images';
$urlpath = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://{$_SERVER['HTTP_HOST']}/images/";
$result = [];                

if(isset($_POST['folder']) && strlen($_POST['folder']) > 0){
    $path .= DIRECTORY_SEPARATOR . $_POST['folder'];
    $urlpath .= $_POST['folder'] . '/';
}

if(!is_dir($path) ){
    echo json_encode([
        'result'=>false,
        'error'=>'No existe el directorio especificado'        
    ]);
    die();
}

$result = [];
if(isset($_POST['recursive']) && $_POST['recursive'] == 'true'){
    $result = getDirContents($path, str_replace('/images/', '', $urlpath));
}else{
    foreach(scandir($path) as $key => $value){
        if(is_file($path.DIRECTORY_SEPARATOR.$value)) {
            $result[] = $urlpath . $value;
        }
    }
}    



echo json_encode($result);