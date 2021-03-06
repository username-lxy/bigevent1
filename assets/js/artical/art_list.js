$(function() {
    var dataList = {
        pagenum: 1, // 页码值
        pagesize: 2, // 每页显示多少条数据
        cate_id: "", // 分类文章的id
        state: "", // 文章的状体，已发布，草稿
    };

    // 获取渲染出来的文章列表数据
    function initDataList() {
        $.ajax({
            type: 'GET',
            url: '/my/article/list',
            data: dataList,
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) return layui.layer.msg('文章列表数据获取失败');
                const dataList = template('dataList', res);
                $('tbody').html(dataList);
                initPage(res.total);
            }
        })
    }
    initDataList();

    // 定义一个时间过滤器
    template.defaults.imports.filterDate = function(time) {
        var t = new Date(time);
        var n = t.getFullYear();
        var m = pubZero(t.getMonth() + 1);
        var d = pubZero(t.getDate());

        var hh = pubZero(t.getHours());
        var mm = pubZero(t.getMinutes());
        var ss = pubZero(t.getSeconds());
        return n + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    }

    // 定义一个补零函数
    function pubZero(o) {
        return o = o > 10 ? o : '0' + o;
    }

    // 获取筛选的文章分类列表
    function getInitArtList() {
        $.ajax({
            type: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) return layui.layer.msg('获取文章分裂列表失败');
                const artList = template('select-artList', res);
                $('[name=artList]').html(artList);
                layui.form.render();
            }
        })
    }
    getInitArtList();


    // 监听表单的筛选事件
    $('#form-select').on('submit', function(e) {
        e.preventDefault();
        dataList.cate_id = $('[name=artList]').val();
        dataList.state = $('[name=state]').val();
        console.log(dataList);
        initDataList();
    })

    // 分页部分
    function initPage(total) {
        layui.use('laypage', function() {
            var laypage = layui.laypage;

            //执行一个laypage实例
            laypage.render({
                elem: 'page',
                count: total, //数据总数，从服务端得到
                limit: dataList.pagesize, // 每页显示的条数
                limits: [2, 3, 5, 10],
                curr: dataList.pagenum, // 起始页
                layout: ['count', 'limit', 'prev', 'page', 'next', 'refresh', 'skip'],
                jump: function(obj, first) {
                    //obj包含了当前分页的所有参数，比如：
                    dataList.pagenum = obj.curr; //得到当前页，以便向服务端请求对应页的数据。
                    dataList.pagesize = obj.limit; //得到每页显示的条数
                    //首次不执行
                    if (!first) {
                        //do something
                        initDataList();
                    }
                }
            });
        });
    }

    // 监听删除事件
    $('body').on('click', '#delete', function(e) {
        e.preventDefault();
        const id = $(this).attr('data-id');
        layer.confirm('你真的要删除嘛?', function(index) {
            $.ajax({
                type: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) return layui.layer.msg('删除失败');
                    layui.layer.msg('删除成功');
                    initDataList();
                }
            })
            layer.close(index);
        });
    })

    // 监听编辑文章的事件
    $('body').on('click', '#edit', function(e) {
        location.href = '/artical/art_edit.html';
        localStorage.setItem('data-id', $(this).attr('data-id'));
    })
})