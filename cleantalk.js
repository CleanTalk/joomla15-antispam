var close_animate=true;
function ct_getCookie(name) {
  var matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}
function ct_setCookie(name, value)
{
	var domain=location.hostname;
	tmp=domain.split('.');
	if(tmp[0].toLowerCase()=='www')
	{
		tmp[0]='';
	}
	else
	{
		tmp[0]='.'+tmp[0];
	}
	domain=tmp.join('.');
	
	document.cookie = name+" =; expires=Thu, 01 Jan 1970 00:00:01 GMT; path = /";
	document.cookie = name+" =; expires=Thu, 01 Jan 1970 00:00:01 GMT";
	document.cookie = name+" =; expires=Thu, 01 Jan 1970 00:00:01 GMT; path = /; domain = " +  domain;
	
	var date = new Date;
	date.setDate(date.getDate() + 365);
	setTimeout(function() { document.cookie = name+"=" + value + "; expires=" + date.toUTCString() + "; path = /;"}, 200)
}
function animate_banner(to)
{
	if(close_animate)
	{
		if(to==0.3)
		{
			jQuery('#feedback_notice').fadeTo(300,to,function(){
				animate_banner(1)
			});
		}
		else
		{
			jQuery('#feedback_notice').fadeTo(300,to,function(){
				animate_banner(0.3)
			});
		}
	}
}
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
	var ct_notice_cookie=ct_getCookie('ct_notice_cookie');
		
	if(ct_show_feedback&&ct_notice_cookie==undefined)
	{
		if(jQuery('#system-message').length==0)
		{
			jQuery('#element-box').before('<dl id="system-message"></dl>');
		}
		jQuery('#system-message').prepend('<dd class="notice message fade" id="feedback_notice"><a href="#" style="font-size:15px;float:right;margin:6px;text-decoration:none;" id="feedback_notice_close">X</a><ul><li style="text-align:center;">'+ct_show_feedback_mes+'</li></ul></dd>');
	}
	
	jQuery('#feedback_notice_close').click(function(){
		var data = {
			'ct_delete_notice': 'yes'
		};
		ct_setCookie('ct_notice_cookie', '1');
		jQuery.ajax({
			type: "POST",
			url: location.href,
			data: data,
			success: function(msg){
				//alert(msg);
				close_animate=false;
				jQuery('#feedback_notice').hide();
			}
		});
	});
	jQuery('#feedback_notice_close').click(function(){
		ct_setCookie('ct_notice_cookie', '1');
		animate_banner(0.3);
	});
	
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