(function($) {
	$.entwine('ss', function($) {
		$('.field.embed').entwine({
		});

		$('.field.embed input.text').entwine({
			onmatch: function() {
				this.data('original-value', this.val());
				this.data('thumbnail-id', this.closest('.middleColumn').find('img').attr('id'));
				this.data('message-el-id', this.closest('.middleColumn').find('em').attr('id'));
			},

            onchange: function(){
                if($(this).val() ) {
                    this.parents('div.field').find('.field.embed button.action').prop('disabled', false).removeClass('ui-state-disabled');
                }else {
                    this.parents('div.field').find('.field.embed button.action').prop('disabled', true).addClass('ui-state-disabled');
                }

                this.parent().parent().find('button.action').removeClass('btn-outline-primary');
                this.parent().parent().find('button.action').removeClass('font-icon-tick');

                this.parent().parent().find('button.action').addClass('btn-primary');
                this.parent().parent().find('button.action').addClass('font-icon-rocket');
            },

			onfocusout: function() {                
				var newVal = this.val();

				if (newVal != '' && newVal.substring(0, 7) != 'http://' && newVal.substring(0, 8) != 'https://') {
					newVal = 'http://'+newVal;
					this.val(newVal);
				}

				if (newVal != this.data('original-value')) {
					if (newVal == '') {
						this.clearData();
						this.data('original-value', this.val());
					}
				}
			},

			clearData: function() {
				var $imageEl = $('#'+this.data('thumbnail-id'));
				$imageEl.attr({
					src: 'framework/images/spacer.gif',
					title: ''
				});
				this.closest('.middleColumn').find('.embed-thumbnail').addClass('empty').removeAttr('href');
				this.val('');
			}            
		});

        $('.field.embed button.action').entwine({
            onmatch: function() {
                this.prop('disabled', true);
            },

            onclick: function() {
                var $field = $(this).siblings('.field.embed input.text');                
                var params = {
                    'SecurityID': $('input[name=SecurityID]').val(),
                    'URL': $field.val()
                };
                
                $field.closest('.form__field-holder').find('input.text').prop('disabled', true);
                $field.closest('.form__field-holder').find('button').html('updating...');

                $.post($field.data('update-url'), params, function (response) {
                    $field.css('background-image', 'none');
                    var $messageEl = $('#'+$field.data('message-el-id'));
                    $messageEl.html(response.message);

                    if (response.status == 'success') {
                        var data = response.data;
                        var $imageEl = $('#'+$field.parent().parent().find('img').attr('id'));
                        $field.closest('.form__field-holder').find('.embed-thumbnail').removeClass('empty').attr('href', $field.val());

                        $field.closest('.form__field-holder').find('button').html('Update URL');

                        $field.closest('.form__field-holder').find('button').removeClass('font-icon-rocket');
                        $field.closest('.form__field-holder').find('button').removeClass('btn-primary');

                        $field.closest('.form__field-holder').find('button').addClass('font-icon-tick');
                        $field.closest('.form__field-holder').find('button').addClass('btn-outline-primary');

                        $field.closest('.form__field-holder').find('input.text').prop('disabled', false);

                        $imageEl.attr({
                            src: data.ThumbnailURL,
                            title: data.Title
                        });
                    } else if (response.status == 'nourl') {
                        $field.clearData();
                    } else if (response.status == 'invalidurl') {
                        $field.val($field.data('original-value'));
                    } else {
                        console.log('@TODO error', response);
                    }

                    $field.data('original-value', $field.val());

                }, 'json');
            }
        });

	});
})(jQuery);
