$(function() {   
 
    $.fn.ErTomySelect = function(options) {

        /* usando los ejemplos de subida y selección con Coldfusion
        json : '/example.cfc?method=getImages',
        uploader : '/example.cfc?method=upload',
        */

        
        this.s = $.extend({
            json: '/getImages-example.php',
            folder: '', 
            recursive: true, 
            uploader:'/upload-example.php', 
            columns: 4,           
            callback: function(msg){}
        }, options);
        var _self = this;


        this.click(function(event){
            event.preventDefault();
            
            if($('#ErTomyModal').length) $('#ErTomyModal, #ErTomyOverlay').remove(); 

            $('body').append($('<div>', {'id':'ErTomyOverlay'}).click(function(){
                $('#ErTomyModal, #ErTomyOverlay').remove(); 
            }));

            
            var $modal = $('<div>', {'id':'ErTomyModal'}).html('Loading......');
            $('body').append($modal);

            $.ajax({
                type: 'POST',
                url: _self.s.json,
                data: { recursive:_self.s.recursive, folder:_self.s.folder},
                async: false,
                cache: false,       
                dataType: "json"     
            }).done(function(obj){    

                var $row = $('<div>').addClass('row');
                $('#ErTomyModal').html($('<div>', {'id':'ErTomyGalery'}));
                $.each(obj, function( index, value ) {

                    if((index % _self.s.columns) == 0){
                        if(index > 0) $('#ErTomyGalery').append($row); 
                        $row = $('<div>').addClass('row');
                    } 
                    $row.append($('<div>').addClass('column')
                                          .css('width', ( ($('#ErTomyGalery').width() - 10) / _self.s.columns) - 25 )  
                                          .append($('<img>', {src:value}).click(function(){
                                                $('#ErTomyGalery .column img').removeClass('selected');
                                                $(this).addClass('selected');
                                          }))  
                                );
                });

                $('#ErTomyGalery').append($row);


                if(_self.s.uploader.length > 0){
                    // si puede subir ficheros, metemos la funcionalidad del otro plugin
                    $('#ErTomyModal').append($('<button>').text('Subir imagen').addClass('upload').click(function(){

                        $input = $('<input>', {'type':'file', 'name':'fileInput'}).change(function(){            
                            var $form = $('<form>');
                            $form.append(this);
                            var formData = new FormData($form[0]);                  
                            if(_self.s.folder.length > 0){
                                formData.append('folder', _self.s.folder);
                            }                                              
                            $.ajax({
                                type: 'POST',
                                url: _self.s.uploader,
                                data: formData,
                                async: false,
                                cache: false,
                                contentType: false,
                                enctype: 'multipart/form-data',
                                processData: false,
                                dataType: "json" 
                            }).done(function(obj){    
                                if(obj.hasOwnProperty('path')){
                                    $('#ErTomyGalery .column img').removeClass('selected');
                                    
                                    $img = $('<div>').addClass('column')
                                                    .css('width', ( ($('#ErTomyGalery').width() - 10) / _self.s.columns) - 25 )  
                                                    .append($('<img>', {src:obj.path})
                                                                .addClass('selected')
                                                                .click(function(){
                                                                    $('#ErTomyGalery .column img').removeClass('selected');
                                                                    $(this).addClass('selected');
                                                                })
                                                            );

                                    $row = $('#ErTomyGalery div.row:last');
                                    if($row.find('div').length == _self.s.columns){ // fila completada, añadimos una nueva
                                        $('#ErTomyGalery').append($('<div>').addClass('row'));
                                        $row = $('#ErTomyGalery div.row:last');
                                    }

                                    $row.append($img);
                                    $('#ErTomyGalery').animate({ scrollTop: $('#ErTomyGalery').prop("scrollHeight")}, 1000);                            
                                }                                                
                            }).fail(function(jqXHR, textStatus, errorThrown){ 
                                alert(errorThrown);
                            });
                        }).click();                                              
                    }));     
                }


                
                $('#ErTomyModal').append($('<button>').text('Cancelar').click(function(){
                    $('#ErTomyOverlay').click();
                })); 
                $('#ErTomyModal').append($('<button>').text('Aceptar').click(function(){
                    if($('#ErTomyGalery .column img.selected').length){
                        _self.s.callback($('#ErTomyGalery .column img.selected').attr('src'));
                        $('#ErTomyOverlay').click();   
                    }
                })); 
    
            }).fail(function(jqXHR, textStatus, errorThrown){ 
                alert(errorThrown);
            });

        });


    };
});     