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

			onfocusout: function() {
				var newVal = this.val();

				if (newVal != '' && newVal.substring(0, 7) != 'http://') {
					newVal = 'http://'+newVal;
					this.val(newVal);
				}

				if (newVal != this.data('original-value')) {
					if (newVal == '') {
						this.clearData();
						this.data('original-value', this.val());
					} else {
						this.update();
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
			},

			update: function() {
				var params = {
					'SecurityID': $('input[name=SecurityID]').val(),
					'URL': this.val()
				};

				var $field = this;
				$field.css({
					'background-image':"url('cms/images/network-save.gif')",
					'background-position':"98% center",
					'background-size':"auto",
					'background-repeat':"no-repeat"
				});
				
				$.post($(this).data('update-url'), params, function (response) {
					$field.css('background-image', 'none');
					var $messageEl = $('#'+$field.data('message-el-id'));
					$messageEl.html(response.message);

					if (response.status == 'success') {

						var data = response.data;
						var $imageEl = $('#'+$field.data('thumbnail-id'));
						$field.closest('.middleColumn').find('.embed-thumbnail').removeClass('empty').attr('href', $field.val());
						
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
