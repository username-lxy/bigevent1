$(function() {
    getUserInfo();

    // 监听退出事件
    $('#log-out').on('click', function() {
        layer.confirm('你真的要退出吗?', { icon: 3, title: '提示' }, function(index) {
            // 1、清空当前token
            localStorage.removeItem('token');
            // 2、强制跳转页面
            location.href = '/login.html';
            layer.close(index);
        });
    })
})

// 获取信息，渲染头像
function getUserInfo() {
    $.ajax({
        type: 'GET',
        url: '/my/userinfo',
        success: function(res) {
            if (res.status !== 0) layui.layer.msg('用户信息获取失败');
            // 1、设置欢迎xxx用户
            // console.log(res);
            const uname = res.data.nickname == '' ? res.data.username : res.data.nickname;
            $('#welcome').html('欢迎&nbsp;&nbsp;' + uname);
            // 2、设置用户头像
            if (res.data.user_pic) {
                let avatar = res.data.user_pic;
                $('.myImg').attr('src', avatar).show();
                $('.text-avatar').hide();
            } else {
                // 获取名字的第一个字符并转化为大写
                const textAvatar = uname.substr(0, 1).toUpperCase();
                $('.myImg').hide();
                $('.text-avatar').html(textAvatar).show();
            }
        }
    })
}