$(function() {
    var index = null; // 定义添加分类的弹出框的index
    var edit_index = null; // 定义编辑分类的弹出框的index
    getInitCate();

    // 监听添加文章分类的事件
    $('#btn-cate').on('click', function(e) {
        e.preventDefault();
        index = layer.open({
            type: 1,
            title: '添加文章分类',
            area: ['500px', '250px'],
            content: $('#add-cate').html()
        });
    })

    // 添加文章分类时，监听表单的提交事件
    $('body').on('submit', '#add-cateForm', function(e) {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) return layui.layer.msg('文章分类添加失败');
                layui.layer.msg('文章分类添加成功');
                getInitCate();
                layer.close(index);
            }
        })
    })

    // 编辑功能：监听表单的编辑事件,动态渲染出来的按钮，需要用代理的形式
    $('body').on('click', '#btn-edit', function(e) {
        e.preventDefault();
        var id = $(this).attr('data-Id');
        edit_index = layer.open({
            type: 1,
            title: '修改文章分类',
            area: ['500px', '250px'],
            content: $('#edit-cate').html(),
            success: function() {
                $.ajax({
                    typr: 'GET',
                    url: '/my/article/cates/' + id,
                    success: function(res) {
                        if (res.status !== 0) return layui.layer.msg('当前文章分类获取失败');
                        layui.form.val("edit-layerForm", res.data);
                    }
                })
            }
        });
    })

    // 修改文章分类功能，监听表单提交事件，用事件代理
    $('body').on('submit', '#edit-cateForm', function(e) {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) return layui.layer.msg('修改文章列表失败');
                layui.layer.msg('修改文章列表成功');
                getInitCate();
                layer.close(edit_index);
            }
        })
    })

    // 删除文章分类，用事件代理的方式
    $('body').on('click', '#delete', function(e) {
        e.preventDefault();
        const id = $(this).siblings('button').attr('data-Id');
        layer.confirm('你真的要删除嘛?', function(index) {
            $.ajax({
                type: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) return layui.layer.msg(res.message);
                    layui.layer.msg('恭喜您，文章分类删除成功');
                    getInitCate();
                }
            })
            layer.close(index);
        });
    })
})

// 获取文章类别，渲染数据
function getInitCate() {
    $.ajax({
        type: 'GET',
        url: '/my/article/cates',
        success: function(res) {
            if (res.status !== 0) return layui.layer.msg('获取文章分类失败');
            const artCate = template('artCate', res);
            $('tbody').html(artCate);
        }
    })
}