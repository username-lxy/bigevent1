$(function() {
    // 初始化富文本编辑器
    initEditor();

    getInitArtCate();
    // 获取选择文章类别的数据
    function getInitArtCate() {
        $.ajax({
            type: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                console.log(res);
                if (res.status !== 0) return layui.layer.msg('文章列表获取失败');
                const artList = template('select-artCate', res);
                $('[name=cate_id]').html(artList);
                layui.form.render();
            }
        })
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 监听点击更换图片事件
    $('#select-image').on('click', function(e) {
        e.preventDefault();
        $('#select-file').click();
    })

    // 监听图片的上传
    $('#select-file').on('change', function(e) {
        console.log(e);
        console.log(e.target.files.length);
        if (e.target.files.length !== 0) {
            // 拿到用户选择的文件
            var file = e.target.files[0];
            // 根据选择的文件，创建一个对应的 URL 地址：
            var newImgURL = URL.createObjectURL(file);
            // 先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域：
            $image
                .cropper('destroy') // 销毁旧的裁剪区域
                .attr('src', newImgURL) // 重新设置图片路径
                .cropper(options) // 重新初始化裁剪区域
        } else {
            layui.layer.msg('请选择图片');
        }
    })

    // 设置发布状态
    var state = '已发布';
    $('#draft').on('click', function() {
        state = '草稿';
    })

    // 监听发送数据的事件
    $('#form-addData').on('submit', function(e) {
        e.preventDefault();
        // 使用formData对象时，必须是一个dom对象
        var fd = new FormData($('#form-addData')[0]);

        // 向fd对象中追加信息
        fd.append('state', state);
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob);
                sendFormData(fd);
            })
    })

    function sendFormData(fd) {
        $.ajax({
            type: 'POST',
            url: '/my/article/add',
            contentType: false,
            processData: false,
            data: fd,
            success: function(res) {
                console.log(res);
                if (res.status !== 0) return layui.layer.msg('发表文章失败');
                layer.msg('文章发表成功', {
                    icon: 1,
                    time: 2000 //2秒关闭（如果不配置，默认是3秒）
                }, function() {
                    location.href = '/artical/art_list.html';
                    document.getElementById('form-addData').reset();
                    window.parent.toggleClass();
                });
            }
        })
    }
})