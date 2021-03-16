$(function() {
    initInfo();

    // 对用户修改的信息进行校验
    var form = layui.form;
    form.verify({
        nickname: function(value) { //value：表单的值、item：表单的DOM对象
            if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
                return '用户名不能有特殊字符';
            }
            if (/(^\_)|(\__)|(\_+$)/.test(value)) {
                return '用户名首尾不能出现下划线\'_\'';
            }
            if (/^\d+\d+\d$/.test(value)) {
                return '用户名不能全为数字';
            }
        }
    });

    // 监听表单的提交事件,更新用户基本信息
    $('#btnUserInfo').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) return layui.layer.msg('更新用户信息失败');
                layui.layer.msg('用户信息更新成功');
                window.parent.getUserInfo();
                initInfo();
            }
        })
    })

    // 监听充值按钮的事件
    $('#reset').on('click', function(e) {
        e.preventDefault();
        layui.layer.msg('重置用户信息成功');
        initInfo();
    })
})

// 1、获取用户信息，填充到表单中
function initInfo() {
    $.ajax({
        type: 'GET',
        url: '/my/userinfo',
        success: function(res) {
            if (res.status !== 0) layui.layer.msg('用户信息获取失败');
            layui.form.val("user-info", res.data);
        }
    })
}