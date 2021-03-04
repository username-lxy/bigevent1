$(function() {
    $('.resgiter').hide();
    $('#go_reg').on('click', function() {
        $('.resgiter').show();
        $('.login_form').hide();
    })
    $('#go_login').on('click', function() {
        $('.resgiter').hide();
        $('.login_form').show();
    })

    // 对表单填入得数据进行校验
    var form = layui.form;
    form.verify({
        username: function(value, item) { //value：表单的值、item：表单的DOM对象
            if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
                return '用户名不能有特殊字符';
            }
            if (/(^\_)|(\__)|(\_+$)/.test(value)) {
                return '用户名首尾不能出现下划线\'_\'';
            }
            if (/^\d+\d+\d$/.test(value)) {
                return '用户名不能全为数字';
            }
        },
        pass: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        repwd: function(value) {
            if (value !== $('#subRegFrom [name=password]').val()) {
                return '两次输入的密码不一样';
            }
        }
    });

    // 监听注册事件
    $('#subRegFrom').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/api/reguser',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) return layui.layer.msg(res.message);
                // console.log(res);
                layui.layer.msg('注册成功请登录');
                $('#go_login').click();
                // 将用户注册的账号密码填入到登陆框里
                const uname = $('#subRegFrom [name=username]').val();
                const pwd = $('#subRegFrom [name=password]').val();
                $('#subLogForm [name=username]').val(uname);
                $('#subLogForm [name=password]').val(pwd);
            }
        })
    })

    // 监听登陆事件
    $('#subLogForm').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/api/login',
            data: $(this).serialize(),
            success: function(res) {
                console.log(res);
                if (res.status !== 0) return layui.layer.msg(res.message);
                layui.layer.msg(res.message, {
                    icon: 1,
                    time: 2000
                }, function() {
                    location.href = '/index.html';
                    localStorage.setItem('token', res.token);
                });

            }
        })
    })

})