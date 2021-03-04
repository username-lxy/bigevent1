$.ajaxPrefilter(function(option) {
    // 将url进行拼接
    option.url = 'http://ajax.frontend.itheima.net' + option.url;

    // 判断请求的url中是否含有my，如果有就需要传递一个headers
    const url = option.url;
    if (url.indexOf('my') != -1) {
        // console.log(url.indexOf('my'));
        option.headers = {
            Authorization: localStorage.getItem('token'),
        }
    }

    // 当token验证失败的时候，强制跳转到登陆页面
    option.complete = function(res) {
        // console.log(res.responseJSON);
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            location.href = '/login.html';
            localStorage.removeItem('token');
        }
    }
})