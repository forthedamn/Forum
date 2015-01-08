$(function(){
	$(".form-control").focus(function(){
			$(this).next().next().html($(this).attr("tips")).css("display","inline");
			$(this).next().css("display","none");
			$(this).next().removeClass("display-block");
	});	
		/**页面控件初始化*/
	var init={
			initUsername:function(){
				$(".reg-name").blur(function(){
					$(this).next().next().css("display","none");
					if($(this).val().length>=2&&$(this).val().length<=14){
						$(this).next().css("display","none");	
					}else{
						$(this).next().css("display","inline");
					}
				});	
			},
			initPassWord:function(){
				$(".reg-password").blur(function(){
					$(this).next().next().css("display","none");
					if($(this).val().length>=6&&$(this).val().length<=16){
						$(this).next().css("display","none");
					}else{
						$(this).next().css("display","inline");
					}	
				});	
			},
			initPWConfirm:function(){
				$(".password-confirm").blur(function(){
					if($(".reg-password:eq(0)").val()!=$(".reg-password:eq(1)").val()){
						$(this).next().css("display","inline");
					}else{
				}
			});		
		}
	};

	/**页面表单验证*/
	var checkForm={
		chechUsername:function(){
			if($(".reg-name").val().length>=2&&$(".reg-name").val().length<=14){
				return true;
				}
			},
		checkPassWord:function(){
			if($(".reg-password").val().length>=6&&$(".reg-password").val().length<=16&&$(".reg-password:eq(0)").val()==$(".reg-password:eq(1)").val()){
				return true;
				}
			}
		};
	/**初始页面方法*/
	function initPage(){
		init.initUsername();
		init.initPassWord();
		init.initPWConfirm();
	$("button").click(function(){
		var username=$('#username').val();
		var password=$("#password").val();
		if(checkForm.chechUsername()&&checkForm.checkPassWord()&&$("#checkbox").is(":checked")){
				return true;
			}else{
				return false;
			}
		});	
	};

	initPage();//调用初始页面方法
	
});