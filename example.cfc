component output="false" {

    remote any function upload (  required string fileInput, string folder='', string name='' ) returnFormat="JSON"{

        if( structKeyExists( form, "fileInput" )) {
            try {
                var path = "./images";
                var urlpath = getPageContext().getRequest().getScheme() & '://' & cgi.server_name & '/images/';

                if(len(folder) > 0){
                    path = path & '/' & folder;
                    urlpath = urlpath & folder & '/';
                }
                if(!directoryExists(ExpandPath(path))){
                    return {
                        result=false,
                        error='No existe el directorio especificado'
                    }                    
                }

                if(len(name) > 0){
                    path = path & '/' & name;
                    if(fileExists(ExpandPath(path))){
                        return {
                            result=false,
                            error='Ya existe un fichero con este nombre'
                        }
                    }
                }

                uploadedFile = fileUpload( ExpandPath(path), "fileInput", "image/jpeg,image/pjpeg,image/png,image/gif,image/svg+xml", "MakeUnique" );
                urlpath = urlpath & uploadedFile.serverFile;

                return {
                    result=true,
                    path=urlpath
                } 
             
                
            } catch ( coldfusion.tagext.io.FileUtils$InvalidUploadTypeException e ) {
                return {
                    result=false,
                    error='El fichero subido no es una imagen'
                }
                
            }
            catch (any e) {
                return {
                    result=false,
                    error='Se ha produccido un error #e.message#'
                }                
            }
          }

    }

    remote any function getImages (  string folder='', boolean recursive=true ) returnFormat="JSON"{
        
        var path = "./images";
        var urlpath = getPageContext().getRequest().getScheme() & '://' & cgi.server_name & '/';
        var result = [];                
                

        if(len(folder) > 0){
            path = path & '/' & folder;            
        }
        if(!directoryExists(ExpandPath(path))){
            return {
                result=false,
                error='No existe el directorio especificado'
            }                    
        }

        for (path in DirectoryList(ExpandPath(path),recursive,'path')) {
            if(fileExists(path)){
                arrayAppend(result, urlpath & replace(replace(path, ExpandPath('./'), ''), '\', '/', 'all'));             
            }               
        }

        return result;       

    }


}