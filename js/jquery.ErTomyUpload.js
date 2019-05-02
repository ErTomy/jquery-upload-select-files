$(function() {   
 
    $.fn.ErTomyUpload = function(options) {
        
        /* usando los ejemplos de subida y selección con Coldfusion
            uploader : '/example.cfc?method=upload';
        */


        this.s = $.extend({
            uploader: '/upload-example.php',
            folder: '',
            name: '',
            validate:function(){return true},
            callback: function(msg){}
        }, options);
        var _self = this;

        this.$input = $('<input>', {'type':'file', 'name':'fileInput'}).change(function(){            
            
            if(_self.s.validate()){
                var $form = $('<form>');
                $form.append(this);
                var formData = new FormData($form[0]);                  
                if(_self.s.folder.length > 0){
                    formData.append('folder', _self.s.folder);
                }
                if(_self.s.name.length > 0 && $(_self.s.name).length) {
                    formData.append('name', $(_self.s.name).val());
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
                    _self.s.callback(obj);
                }).fail(function(jqXHR, textStatus, errorThrown){ 
                    alert(errorThrown);
                })
            }            
        });      

        this.click(function(event){
            event.preventDefault();
            _self.$input.click();
        });
    };
});