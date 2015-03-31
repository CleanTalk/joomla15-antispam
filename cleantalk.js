jQuery(document).ready(function(){
	jQuery('#cleantalk_manual_key').attr('href', 'https://cleantalk.org/register?platform=joomla15&email=' + cleantalk_mail + '&website=' + cleantalk_domain);
	var ct_auth_key=jQuery('#paramsapikey').prop('value');
	setTimeout(function(){jQuery('#reg_notice').html(ct_register_notice);},500);
	jQuery('#paramsapikey').prop('size',25);
	if(ct_auth_key!=''&&ct_auth_key!='enter key')
	{
		jQuery('.cleantalk_auto_key').parent().parent().hide();
		jQuery('#ct_license_notice').parent().parent().hide();
		jQuery('#reg_notice').parent().parent().hide();
		jQuery('#cleantalk_manual_key').attr('href', 'https://cleantalk.org/my?user_token='+ct_user_token);
		jQuery('#cleantalk_manual_key').html(ct_stat_link);
	}
	
	
	jQuery('.cleantalk_auto_key').click(function(){
		var data = {
			'get_auto_key': 'yes'
		};
		jQuery('#ct_preloader').show();
		jQuery.ajax({
			type: "POST",
			url: location.href,
			data: data,
			//dataType: 'json',
			success: function(msg){
				//alert(msg);
				msg=jQuery.parseJSON(msg);
				//alert(msg.auth_key);
				if(msg.error_message)
				{
					jQuery('#system-message').prepend('<dd class="error message fade"><ul><li>'+msg.error_message+'</li><li>'+ct_register_error+'</li></ul></dd>');
					jQuery('#ct_preloader').hide();
				}
				else if(msg.auth_key)
				{
					jQuery('#paramsapikey').val(msg.auth_key);
					jQuery('#system-message').prepend('<dd class="info message fade"><ul><li>'+ct_register_message+'</li></ul></dd>');
					if(msg.user_token)
					{
						jQuery('#paramsuser_token').val(msg.user_token);
					}
					setTimeout(function(){submitbutton('apply');},1000);
					jQuery('#ct_preloader').hide();
				}
			}
		});
		jQuery(this).blur();
	});
});