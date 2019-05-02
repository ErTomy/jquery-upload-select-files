<?php

if(isset($_FILES['fileInput'])){

    $path = __DIR__ . DIRECTORY_SEPARATOR . 'images';
    $urlpath = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://{$_SERVER['HTTP_HOST']}/images/";
    
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

    if(isset($_POST['name']) && strlen($_POST['name']) > 0){
        $path .= DIRECTORY_SEPARATOR . $_POST['name'];
        $urlpath .=  $_POST['name'];
        if(file_exists($path)){
            echo json_encode([
                'result'=>false,
                'error'=>'Ya existe un fichero con este nombre'        
            ]);
            die();            
        }
    }else{
        $random = (file_exists($path . DIRECTORY_SEPARATOR . basename($_FILES['fileInput']['name'])))?substr(md5(time()), 0, 10):''; 

        $path .= DIRECTORY_SEPARATOR . $random . basename($_FILES['fileInput']['name']);
        $urlpath .=  $random . basename($_FILES['fileInput']['name']);
    }

    if (move_uploaded_file($_FILES['fileInput']['tmp_name'], $path)) {
        echo json_encode([
            'result'=>true,
            'path'=>$urlpath        
        ]);        
    } else {
        echo json_encode([
            'result'=>false,
            'error'=>'Se ha produccido un error'        
        ]);
    }


    
}





