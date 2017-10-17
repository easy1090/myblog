module.exports={
    checkLogin:function(req,res,next){//res.redirect:重定向
       
        if(!req.session.user){
            req.flash('error','未登录');
            return res.redirect('/signin');
        }
        next();
    },
    
    checkNotLogin:function(req,res,next){ /*当用户信息（req.session.user）存在，即认为用户已经登录，则跳转到之前的页面，同时显示 已登录 的通知，如登录、注册页面及登录、注册的接口
        */
        if(req.session.user){
            req.flash('error','已登录');
            return res.redirect('back');
        }
        next();
    }
}