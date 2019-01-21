function showSymbolEditDiv(self) {
    //获取点击的SVG
    var originSVG = $(self).children(':first');

    //判断是线或非线
    if ($(self).attr('id') === 'symbol_line') {
        //隐藏非线条件面板等
        $('#symbolPreview').addClass('hidden');
        $('#outlineTab').addClass('hidden');
        $('.shapeItem').addClass('hidden');
        //显示线属性调节功能面板
        $('#symbolPreview_line').removeClass('hidden');
        $('#lineImg').removeClass('hidden');
        $('#lineSelect').removeClass('hidden');

        //重新加载设置线滑块的调节范围及初始值
        $('#sliderVal_shape').text(1);
        var s = $('#slider_shape').slider({
            min: 0,
            max: 18,
            value: 1
        });
    } else {
        $('#symbolPreview_line').addClass('hidden');
        $('#lineImg').addClass('hidden');
        $('#lineSelect').addClass('hidden');

        $('#outlineTab').removeClass('hidden');
        $('#symbolPreview').removeClass('hidden');
        $('.shapeItem').removeClass('hidden');

        $('#sliderVal_shape').text(8);
        var s = $('#slider_shape').slider({
            min: 0,
            max: 120,
            value: 8
        });
    }
    s.on("slide", sliderChange_shape);


    layer.open({
        type: 1,
        title: ['符号编辑', 'font-size:18px;'],
        skin: 'layui-layer-demo',
        closeBtn: 1,
        anim: 2,
        shadeClose: true, //开启遮罩关闭
        content: $("#symbolEditDiv"),
        btn: ['确认', '取消'],
        success: function (index, layero) {
            //弹出层打开读取当前符号颜色
            if ($(self).attr('id') === 'symbol') {
                var originColor = originSVG.children(':first').attr('fill');
                $('#symbolPreview > svg').children(':first').attr("fill", originColor);
                $('#cp_fill').attr('data-color', originColor);
            } else {
                var originColor = originSVG.children(':first').attr('stroke');
                $('#symbolPreview_line > svg').children(':first').attr("stroke", originColor);
                $('#cp_fill').attr('data-color', originColor);
            }

        },
        yes: function (index, layero) {
            //用弹出层中调节好的图形替换页面中图形
            if ($(self).attr('id') === 'symbol') {
                var previewSymbol = $('#symbolPreview');
                $('#symbol').html(previewSymbol.html());
            } else {
                var previewSymbol = $('#symbolPreview_line');
                $('#symbol_line').html(previewSymbol.html());
            }
            s.slider('destroy');
            layer.close(index);//需手动关闭弹出层
        }
    });

    $('.linearGradientItem').click(function (a) {
        //清空所有色带选中背景色
        $('.linearGradientItem').css('background-color', '#FFFFFF');
        //添加当前点击色带背景色，达到选中效果
        $(this).css('background-color', '#CEE7F8');
        //让选中的色带在左侧放大显示
        $('#selectedlinearGradientItem').html($(this).html());
        $('#selectedlinearGradientItem > svg').attr('height', "160px");
        $('#selectedlinearGradientItem > svg').attr('width', "30px");
        $('#selectedlinearGradientItem > svg > rect').attr('width', "30px");
        $('#selectedlinearGradientItem > svg > rect').attr('height', "160px");
        $('#selectedlinearGradientItem > svg > defs > linearGradient').attr('y2', "160.000");
        $('#selectedlinearGradientItem > svg > defs > linearGradient').attr('id',
            "previewLinearGradientItem");
        $('#selectedlinearGradientItem > svg > rect').attr('fill',
            "url(#previewLinearGradientItem)");

        //将色带居中的颜色填充至预图形中
        var selectedItemColor = $(
            '#selectedlinearGradientItem > svg > defs > linearGradient stop:nth-child(1)'
        ).attr('stop-color');
        $('#symbolPreview > svg').children(':first').attr("fill", selectedItemColor);
        $('#symbolPreview_line > svg').children(':first').attr("stroke", selectedItemColor);
    })

    $('.shapeItem').click(function (a) {
        switch ($(this).attr("id")) {
            case 'circleShape':
                var svg = $('#symbolPreview > svg');
                //判断是否从矩形菱形更改过来
                if (svg.html().substr(1, 4) === "path") {
                    //添加圆心坐标属性
                    svg.children(':first').attr('cx', "0");
                    svg.children(':first').attr('cy', "0");
                    //用矩形菱形边长设置圆半径
                    var d = svg.children(':first').attr('d');
                    svg.children(':first').attr('r', Math.abs(d.split(" ")[1]));
                    //移除不属于圆的属性
                    svg.children(':first').removeAttr('path');
                    svg.children(':first').removeAttr('d');
                    //替换标签名
                    var circleNode = svg.children(':first');
                    var html = svg.html();
                    html = html.replace(/^<path/, "<circle");
                    html = html.replace(/\/path>$/, "/circle>");

                    svg.html(html);
                } else {
                    break;
                }
                break;
            case 'rectShape':
                var svg = $('#symbolPreview > svg');
                //直接取r属性，若r属性不存在则来自于菱形
                var r = svg.children(':first').attr('r');
                if (r === undefined) {
                    r = Math.abs(svg.children(':first').attr("d").split(" ")[1]);
                }
                //构造d属性结构，并替换至展示图形中
                var d = "M -" + r + " " + r + " L -" + r + " -" + r + " L " + r + " -" + r + " L " + r + " " + r + " L -" + r + " " + r + " Z";
                svg.children(':first').attr('d', d);
                //移除不属于矩形图形的属性
                svg.children(':first').removeAttr('cx');
                svg.children(':first').removeAttr('cy');
                svg.children(':first').removeAttr('r');
                //替换标签名
                var circleNode = svg.children(':first');
                var html = svg.html();
                html = html.trim().replace(/^<circle/, "<path");
                html = html.replace(/\/circle>$/, "/path>");

                svg.html(html);
                break;
            case 'diamondShape':
                var svg = $('#symbolPreview > svg');
                var r = svg.children(':first').attr('r');
                if (r === undefined) {
                    r = Math.abs(svg.children(':first').attr("d").split(" ")[1]);
                }
                var d = "M -" + r + " " + 0 + " L -" + 0 + " -" + r + " L " + r + " -" + 0 + " L " + 0 + " " + r + " L -" + r + " " + 0 + " Z";
                svg.children(':first').attr('d', d);
                svg.children(':first').removeAttr('cx');
                svg.children(':first').removeAttr('cy');
                svg.children(':first').removeAttr('r');
                var circleNode = svg.children(':first');
                var html = svg.html();
                html = html.trim().replace(/^<circle/, "<path");
                html = html.replace(/\/circle>$/, "/path>");
                svg.html(html);
                break;
        }
        //用背景色模拟选中效果
        $('.shapeItem').css('background-color', '#FFFFFF');
        $(this).css('background-color', '#CEE7F8');
    });


    $(function () {
        $('#cp_fill').colorpicker({
            inline: true,
            container: true,
            customClass: 'colorpicker-2x',
            extensions: [{
                name: 'swatches',
                options: {
                    colors: {
                        'tetrad1': '#ED5151',
                        'tetrad2': '#149ECE',
                        'tetrad3': '#A7C636',
                        'tetrad4': '#9E559C',
                        'tetrad5': '#FC921F',
                        'tetrad6': '#FFDE3E',
                        'tetrad7': '#F789D8',
                        'tetrad8': '#B7814A',
                    },
                    namesAsValues: false
                }
            }],
            sliders: {
                saturation: {
                    maxLeft: 200,
                    maxTop: 200
                },
                hue: {
                    maxTop: 200
                },
                alpha: {
                    maxTop: 200
                }
            }
        }).on('colorpickerChange colorpickerCreate', function (e) {
            var colors = e.color.toString();
            //动态显示预图形颜色
            $('#symbolPreview > svg').children(':first').attr("fill", colors);
            $('#symbolPreview_line > svg').children(':first').attr("stroke", colors);
        });

        $('#cp_outline').colorpicker({
            inline: true,
            container: true,
            customClass: 'colorpicker-2x',
            extensions: [{
                name: 'swatches',
                options: {
                    colors: {
                        'tetrad1': '#ED5151',
                        'tetrad2': '#149ECE',
                        'tetrad3': '#A7C636',
                        'tetrad4': '#9E559C',
                        'tetrad5': '#FC921F',
                        'tetrad6': '#FFDE3E',
                        'tetrad7': '#F789D8',
                        'tetrad8': '#B7814A',
                    },
                    namesAsValues: false
                }
            }],
            sliders: {
                saturation: {
                    maxLeft: 200,
                    maxTop: 200
                },
                hue: {
                    maxTop: 200
                },
                alpha: {
                    maxTop: 200
                }
            }
        }).on('colorpickerChange colorpickerCreate', function (e) {
            var colors = e.color.toString();
            //设置轮廓颜色
            $('#symbolPreview > svg').children(':first').attr("stroke", colors);
        });
    });

}

function getmatrix(a, b, c, d, e, f) {
    //解析字符串matrix(a,b,c,d,e,f)，以数组返回
    return new Array(a, b, c, d, e, f);
}

function setMatrix(a, b, c, d, e, f) {
    //将数组还原为matrix字符串
    return "matrix(" + a + "," + b + "," + c + "," + d + "," + e + "," + f + ")";
}

//根据比例增减path中的d属性，模式如"M -50 -50 L 50 -50 L 50 50 L -50 50 L -50 -50"
function getPath_d(origin, ratio) {
    var tempArr = origin.split(" ");
    tempArr[1] = Number(tempArr[1]) - ratio;
    tempArr[5] = Number(tempArr[5]) - ratio;
    tempArr[7] = Number(tempArr[7]) + ratio;
    tempArr[11] = Number(tempArr[11]) + ratio;
    tempArr[13] = Number(tempArr[13]) - ratio;

    //判断是否为菱形
    if ($('#diamondShape').css('background-color').trim() === "rgb(255, 255, 255)") {
        tempArr[2] = Number(tempArr[2]) + ratio;
        tempArr[4] = Number(tempArr[4]) - ratio;
        tempArr[8] = Number(tempArr[8]) - ratio;
        tempArr[10] = Number(tempArr[10]) + ratio;
        tempArr[14] = Number(tempArr[14]) + ratio;
    }
    //用空格隔开还原为d属性模式
    return tempArr.join(" ");
}


/**
 * 该方法之所以繁复累赘
 * 是因为要照顾在图形大小和轮廓大小同时叠加使用时候显示的宽高问题
 */
function sliderChange_shape(slideEvt) {
    //获取图形SVG类型
    var shapeType = $('#symbolPreview > svg').html().trim().substr(1, 4);
    //从span标签中取出滑块改变前的值
    var currentSliderValue = Number($("#sliderVal_shape").text());
    //改变后值 减去 改变前的值得到变化量，绝对值以适应增减
    var sliderChangedValue = Math.abs(slideEvt.value - currentSliderValue);
    var originHeight = Number($('#symbolPreview > svg').attr('height'));
    var originWidth = Number($('#symbolPreview > svg').attr('width'));
    var originMatrix = eval("get" + $('#symbolPreview > svg').children(':first').attr("transform"));
    //判断为矩形菱形或圆
    if (shapeType === "path") {
        //获取图形当前path绘制路径量
        var d = $('#symbolPreview > svg').children(':first').attr("d");
        if (slideEvt.value > currentSliderValue) {
            //滑块增加
            //让图形以0.5的像素单位变化增长
            $('#symbolPreview > svg').children(':first').attr("d", getPath_d(d, sliderChangedValue * 0.5));
            //更新其transform属性，使得图形平移居中显示
            //Matrix(a,b,c,d,e,f)，a与d控制缩放，e与f控制平移量
            $('#symbolPreview > svg').children(':first').attr("transform", setMatrix(originMatrix[0], originMatrix[1], originMatrix[2], originMatrix[3], originMatrix[4] + sliderChangedValue * 0.5, originMatrix[5] + sliderChangedValue * 0.5));
            //更新svg宽高使得有合适的范围展示图形
            $('#symbolPreview > svg').attr('width', originWidth + sliderChangedValue);
            $('#symbolPreview > svg').attr('height', originHeight + sliderChangedValue);
        } else if (slideEvt.value < currentSliderValue) {
            //滑块减少
            $('#symbolPreview > svg').children(':first').attr("d", getPath_d(d, sliderChangedValue * -0.5));
            $('#symbolPreview > svg').children(':first').attr("transform", setMatrix(originMatrix[0], originMatrix[1], originMatrix[2], originMatrix[3], originMatrix[4] - sliderChangedValue * 0.5, originMatrix[5] - sliderChangedValue * 0.5));
            $('#symbolPreview > svg').attr('width', originWidth - sliderChangedValue);
            $('#symbolPreview > svg').attr('height', originHeight - sliderChangedValue);
        }
    } else {
        var r = Number($('#symbolPreview > svg').children(':first').attr('r'));
        if (slideEvt.value > currentSliderValue) {
            $('#symbolPreview > svg').children(':first').attr('r', r + sliderChangedValue * 0.5);
            $('#symbolPreview > svg').children(':first').attr("transform", setMatrix(originMatrix[0], originMatrix[1], originMatrix[2], originMatrix[3], originMatrix[4] + sliderChangedValue * 0.5, originMatrix[5] + sliderChangedValue * 0.5));
            $('#symbolPreview > svg').attr('width', originWidth + sliderChangedValue);
            $('#symbolPreview > svg').attr('height', originHeight + sliderChangedValue);
        } else if (slideEvt.value < currentSliderValue) {
            $('#symbolPreview > svg').children(':first').attr('r', r - sliderChangedValue * 0.5);
            $('#symbolPreview > svg').children(':first').attr("transform", setMatrix(originMatrix[0], originMatrix[1], originMatrix[2], originMatrix[3], originMatrix[4] - sliderChangedValue * 0.5, originMatrix[5] - sliderChangedValue * 0.5));
            $('#symbolPreview > svg').attr('width', originWidth - sliderChangedValue);
            $('#symbolPreview > svg').attr('height', originHeight - sliderChangedValue);
        }
    }

    if (!$('#symbolPreview_line').hasClass('hidden')) {
        //更新线宽度
        $('#symbolPreview_line > svg > path').attr('stroke-width', slideEvt.value);

        //改变预图形中的线型
        switch ($('#lineSelect').val()) {
            //实线
            case '0':
                break;
            //点线
            case '1':
                $('#symbolPreview_line > svg > path').attr('stroke-dasharray', slideEvt.value + "," + (slideEvt.value * 3));
                break;
            //虚线
            case '2':
                $('#symbolPreview_line > svg > path').attr('stroke-dasharray', (slideEvt.value * 4) + "," + (slideEvt.value * 3));
                break;
            //点划线
            case '3':
                $('#symbolPreview_line > svg > path').attr('stroke-dasharray', (slideEvt.value * 4) + "," + (slideEvt.value * 3) + "," + (slideEvt.value) + "," + (slideEvt.value * 3));
                break;
            //双点划线
            case '4':
                $('#symbolPreview_line > svg > path').attr('stroke-dasharray', (slideEvt.value * 8) + "," + (slideEvt.value * 3) + "," + (slideEvt.value) + "," + (slideEvt.value * 3) + "," + (slideEvt.value) + "," + (slideEvt.value * 3));
                break;
        }
    }

    $("#sliderVal_shape").text(slideEvt.value);

}

function sliderChange_line(slideEvt) {
    $('#symbolPreview > svg').children(':first').attr("stroke-width", slideEvt.value);
    var originHeight = Number($('#symbolPreview > svg').attr('height'));
    var originWidth = Number($('#symbolPreview > svg').attr('width'));
    var currentSliderValue = Number($("#sliderVal_outline").text());
    var sliderChangedValue = Math.abs(slideEvt.value - currentSliderValue);
    var originMatrix = eval("get" + $('#symbolPreview > svg').children(':first').attr("transform"));

    if (slideEvt.value > currentSliderValue) {
        $('#symbolPreview > svg').attr('height', originHeight + sliderChangedValue * 1.5);
        $('#symbolPreview > svg').attr('width', originWidth + sliderChangedValue * 1.5);
        $('#symbolPreview > svg').children(':first').attr("transform", setMatrix(originMatrix[0], originMatrix[1], originMatrix[2], originMatrix[3], originMatrix[4] + sliderChangedValue * 0.75, originMatrix[5] + sliderChangedValue * 0.75));

    } else if (slideEvt.value < currentSliderValue) {
        $('#symbolPreview > svg').attr('height', originHeight - sliderChangedValue * 1.5);
        $('#symbolPreview > svg').attr('width', originWidth - sliderChangedValue * 1.5);
        $('#symbolPreview > svg').children(':first').attr("transform", setMatrix(originMatrix[0], originMatrix[1], originMatrix[2], originMatrix[3], originMatrix[4] - sliderChangedValue * 0.75, originMatrix[5] - sliderChangedValue * 0.75));
    } else if (slideEvt.value === currentSliderValue) {
        //滑块在原值点击时不做反应
    }
    $("#sliderVal_outline").text(slideEvt.value);
}

$(document).ready(function () {
    $('#slider_shape').slider();
    $("#slider_shape").on("slide", sliderChange_shape);

    $('#slider_outline').slider();
    $("#slider_outline").on("slide", sliderChange_line);

    //请求色带信息
    var xmlhttp = new window.XMLHttpRequest();
    xmlhttp.open("GET", "./assets/svg.xml", false);
    xmlhttp.send(null);
    if (xmlhttp.readyState == 4) {
        xmlDoc = xmlhttp.responseXML.documentElement
    }
    var svgs = xmlDoc.getElementsByTagName("svg");
    var svgsHTML = "";
    for (var svg of svgs) {
        var h = '<div class="linearGradientItem">' + $(svg).get(0).outerHTML + '</div>';
        svgsHTML += h;
    }
    $('#linearGradientItems').html(svgsHTML);


    //更改线型显示
    $('#lineSelect').change(function () {
        var lineType = $(this).val();
        $('#lineImg').css('background-position', '0px -' + (lineType * 15) + 'px');
        var lineWidth = $('#sliderVal_shape').text();
        switch (lineType) {
            case '0':
                break;
            case '1':
                $('#symbolPreview_line > svg > path').attr('stroke-dasharray', lineWidth + "," + (lineWidth * 3));
                break;
            case '2':
                $('#symbolPreview_line > svg > path').attr('stroke-dasharray', (lineWidth * 4) + "," + (lineWidth * 3));
                break;
            case '3':
                $('#symbolPreview_line > svg > path').attr('stroke-dasharray', (lineWidth * 4) + "," + (lineWidth * 3) + "," + (lineWidth) + "," + (lineWidth * 3));
                break;
            case '4':
                $('#symbolPreview_line > svg > path').attr('stroke-dasharray', (lineWidth * 8) + "," + (lineWidth * 3) + "," + (lineWidth) + "," + (lineWidth * 3) + "," + (lineWidth) + "," + (lineWidth * 3));
                break;
        }
    })
})