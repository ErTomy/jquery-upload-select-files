# ErTomyUpload y ErTomySelect #
================================

Estos son dos plugins personales que uso habitualmente para subir y seleccionar ficheros al servidor. La idea al hacerlos es que fueran lo más sencillos posibles de integrar.


## ErTomyUpload ##

Se integra en cualquier elemento del DOM y permite llamarlo con los siguientes parámetros:

* uploader: ruta a la que se manda el fichero seleccionado 
* folder: carpeta a la que se subirá el fichero
* name: por si queremos asignarle un nombre al fichero al subirlo al servidor, aquí ponemos un selector de jquery que contendrá el nombre
* validate: función a la que llamaremos antes de la subida del fichero. Debe devolver un true si queremos que realice la subida o false y la queremos cancelar
* callback: función a la que llama después de realizar la subida, devolviendo el resultado de la llamada

Ejemplo:

```html

    <script src="js/jquery.js"></script>
    <script src="js/jquery.ErTomyUpload.js"></script>
    <script>
        $(function() {
            $('#upload-button').ErTomyUpload({
                uploader: '/upload-example.php',
                folder:'aaa', 
                name:'#name',
                validate:function(){
                    if($('#name').val().length == 0){
                        alert('Debe indicar el nombre de la imagen');
                        return false;
                    }else{
                        return true;
                    }
                },
                callback:function(result){
                    if(result.result){
                        alert('Fichero subido' + result.path);
                    }else{
                        alert(result.error);
                    }
                }
            });  
        });    

    </script>

    <input type="text" name="nombre" id="name">
    <button id="upload-button">Subir imagen</button>
```

Como ejemplo de ficheros para realizar la subida de ficheros he dejado el componente example.cfc y el upload-example.php, ambos toman como carpeta raíz para las subidas la carpeta images

## ErTomySelect ##

Se integra en cualquier elemento del DOM y permite llamarlo con los siguientes parámetros:

* json: ruta de donde obtendrá un array en JSON con las imágenes a mostrar
* folder: valor que se mandará a la ruta de json y uploader como parámetro "folder"
* recursive: valor que mandará a la ruta json como parámetro "recursive". Esta pensado por si queremos que el listado de ficheros incluya subcarpetas
* uploader: si incluimos una ruta encargada de subir ficheros, incluirá un botón para subirlos
* columns: número de columnas por fila en las que se mostrará el listado
* callback: función a la que llama después de seleccionar un fichero, devolviendo la url de la imagen

```html
    <script src="js/jquery.js"></script>
    <script src="js/jquery.ErTomySelect.js"></script>
    <link rel="stylesheet" href="css/jquery.ErTomySelect.css">
    <script>
        $(function() {
            $('#select-button').ErTomySelect({
                json: '/getImages-example.php',
                folder:'aaa',
                recursive:true,
                columns:3,
                uploader:'/upload-example.php',
                callback:function(path){                   
                    alert(path);                                     
                }
            });
        });    
    </script>


    <button id="select-button">Seleccionar imagen</button>
```    

Como ejemplo de ficheros para realizar la subida de ficheros sirven los mismos que para el otro plugin, y para la selección he dejado el componente example.cfc y el getImages-example.php, ambos toman como carpeta raíz para la selección y subidas la carpeta images

A parte tenemos el fichero css/jquery.ErTomySelect.css que nos permite poner más o menos bonito el modal que se muestra para seleccionar las imágenes
