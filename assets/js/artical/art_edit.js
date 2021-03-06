$(function() {
    // 注意：应该先渲染出来页面，再进行数据的填充

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 获取文章列表信息
    getArtList();

    function getArtList() {
        $.ajax({
            type: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) return layui.layer.msg('获取文章列表数据失败');
                const artList = template('artList', res);
                $('[name=cate_id]').html(artList);
                layui.form.render();
                // 初始化富文本编辑器
                initEditor();
                // 对表格里面的数据进行填充
                initArtInfo();
            }
        })
    }

    // 获取初始化的文章数据
    function initArtInfo() {
        const id = localStorage.getItem('data-id');
        $.ajax({
            type: 'GET',
            url: '/my/article/' + id,
            success: function(res) {
                // console.log(res.data.cover_img);
                // console.log(res);
                if (res.status !== 0) return layui.layer.msg('获取文章数据失败');
                layui.form.val("edit-form", res.data);
                //替换src
                var file = 'http://ajax.frontend.itheima.net' + res.data.cover_img;
                console.log(file);
                $("#image").attr('src', file);
                console.log($("#image").attr('src'));
                $image
                    .cropper('destroy') // 销毁旧的裁剪区域
                    .attr('src', file) // 重新设置图片路径
                    .cropper(options) // 重新初始化裁剪区域
            }
        })
    }

    // 监听更换图片事件
    $('#select-image').on('click', function() {
        $('#select-file').click();
    })

    // 监听file的上传文件事件
    $('#select-file').on('change', function(e) {
        if (e.target.files.length !== 0) {
            var file = e.target.files[0];
            var newImgURL = URL.createObjectURL(file);
            $image
                .cropper('destroy') // 销毁旧的裁剪区域
                .attr('src', newImgURL) // 重新设置图片路径
                .cropper(options) // 重新初始化裁剪区域
        }
    })

    // 设置已发布、草稿状态
    var artState = '已发布';
    $('#draft').on('click', function() {
        artState = '草稿';
    })

    // 监听表单的提价事件
    $('#submit-form').on('submit', function(e) {
        e.preventDefault();
        var fd = new FormData($('#submit-form')[0]);
        fd.append('state', artState);
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob);
                editArt(fd);
            })
    })

    // 根据id修改文章的信息
    function editArt(fd) {
        $.ajax({
            type: 'POST',
            url: '/my/article/edit',
            data: fd,
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) return layui.layer.msg('文章修改失败');
                layer.msg('恭喜您，修改文章成功', {
                    icon: 1,
                    time: 2000
                }, function() {
                    localStorage.removeItem('data-id');
                    location.href = '/artical/art_list.html';
                });
            }
        })
    }
})