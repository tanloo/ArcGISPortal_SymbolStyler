function showSymbolEditDiv(self) {
    //获取点击的SVG
    const originSVG = $(self).children(':first');
    let slider;
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

        //将点击的图形显示到弹出层预图形中
        $('#symbolPreview_line').html($(self).html());
        //重新加载设置线滑块的调节范围及初始值
        let symbolSize = originSVG.children(':first').attr('stroke-width');
        symbolSize = Number(symbolSize);
        $('#sliderVal_shape').text(symbolSize);
        slider = $('#slider_shape').slider({
            min: 0,
            max: 18,
            value: symbolSize
        });

    } else {
        $('#symbolPreview_line').addClass('hidden');
        $('#lineImg').addClass('hidden');
        $('#lineSelect').addClass('hidden');

        $('#outlineTab').removeClass('hidden');
        $('#symbolPreview').removeClass('hidden');
        $('.shapeItem').removeClass('hidden');

        $('#symbolPreview').html($(self).html());
        //重新加载设置线滑块的调节范围及初始值
        let symbolSize = originSVG.children(':first').attr('r');
        if (symbolSize === undefined) {
            symbolSize = Number(Math.abs(originSVG.children(':first').attr('d').split(" ")[1])) * 2;
        }
        symbolSize = Number(symbolSize);
        $('#sliderVal_shape').text(symbolSize);
        slider = $('#slider_shape').slider({
            min: 0,
            max: 120,
            value: symbolSize
        });
    }
    slider.on("slide", sliderChange_shape);
    $('#slider_outline').slider();
    $("#slider_outline").on("slide", sliderChange_line);

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
                let originColor = $('#symbolPreview > svg').children(':first').attr("fill");
                $('#cp_fill').attr('data-color', originColor);
            } else if ($(self).attr('id') === 'symbol_line') {
                let originColor = $('#symbolPreview_line > svg').children(':first').attr("stroke");
                $('#cp_fill').attr('data-color', originColor);
            }

            //清空所有色带选中背景色
            $('.linearGradientItem').css('background-color', '#FFFFFF');
            //清空符号形状选择的背景色，并默认选中所属形状
            $('.shapeItem').css('background-color', '#FFFFFF');
            if ($('#symbolPreview > svg').children(':first').attr('r')) {
                $('#circleShape').css('background-color', '#CEE7F8');
            } else if ($('#symbolPreview > svg').children(':first').attr('d').split(" ")[2] === '0') {
                $('#diamondShape').css('background-color', '#CEE7F8');
            } else if ($('#symbolPreview > svg').children(':first').attr('d').split(" ")[2] !== '0') {
                $('#rectShape').css('background-color', '#CEE7F8');
            }

        },
        yes: function (index, layero) {
            //用弹出层中调节好的图形替换页面中图形
            if ($(self).attr('id') === 'symbol') {
                let previewSymbol = $('#symbolPreview');
                $('#symbol').html(previewSymbol.html());
            } else {
                let previewSymbol = $('#symbolPreview_line');
                $('#symbol_line').html(previewSymbol.html());
            }
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
        let selectedItemColor = $(
            '#selectedlinearGradientItem > svg > defs > linearGradient stop:nth-child(1)'
        ).attr('stop-color');
        $('#symbolPreview > svg').children(':first').attr("fill", selectedItemColor);
        $('#symbolPreview_line > svg').children(':first').attr("stroke", selectedItemColor);
    })

    $('.shapeItem').on('click', function (a) {

        switch ($(this).attr("id")) {
            case 'circleShape': {
                let svg = $('#symbolPreview > svg');
                //判断是否从矩形菱形更改过来
                if (svg.children(':first').prop("tagName") === "path") {
                    //添加圆心坐标属性
                    svg.children(':first').attr('cx', "0");
                    svg.children(':first').attr('cy', "0");
                    //用矩形菱形边长设置圆半径
                    let d = svg.children(':first').attr('d');
                    svg.children(':first').attr('r', Math.abs(d.split(" ")[1]));
                    //移除不属于圆的属性
                    svg.children(':first').removeAttr('path');
                    svg.children(':first').removeAttr('d');
                    //替换标签名
                    let circleNode = svg.children(':first');
                    let html = svg.html().trim();
                    html = html.replace(/^<path/, "<circle");
                    html = html.replace(/\/path>$/, "/circle>");

                    svg.html(html);
                } else {
                    break;
                }
                break;
            }

            case 'rectShape': {
                let svg = $('#symbolPreview > svg');
                //直接取r属性，若r属性不存在则来自于菱形
                let r = svg.children(':first').attr('r');
                if (r === undefined) {
                    r = Math.abs(svg.children(':first').attr("d").split(" ")[1]);
                }
                //构造d属性结构，并替换至展示图形中
                let d = "M -" + r + " " + r + " L -" + r + " -" + r + " L " + r + " -" + r + " L " + r + " " + r + " L -" + r + " " + r + " Z";
                svg.children(':first').attr('d', d);
                //移除不属于矩形图形的属性
                svg.children(':first').removeAttr('cx');
                svg.children(':first').removeAttr('cy');
                svg.children(':first').removeAttr('r');
                //替换标签名
                let circleNode = svg.children(':first');
                let html = svg.html();
                html = html.trim().replace(/^<circle/, "<path");
                html = html.replace(/\/circle>$/, "/path>");

                svg.html(html);
                break;
            }

            case 'diamondShape': {
                let svg = $('#symbolPreview > svg');
                let r = svg.children(':first').attr('r');
                if (r === undefined) {
                    r = Math.abs(svg.children(':first').attr("d").split(" ")[1]);
                }
                let d = "M -" + r + " " + 0 + " L -" + 0 + " -" + r + " L " + r + " -" + 0 + " L " + 0 + " " + r + " L -" + r + " " + 0 + " Z";
                svg.children(':first').attr('d', d);
                svg.children(':first').removeAttr('cx');
                svg.children(':first').removeAttr('cy');
                svg.children(':first').removeAttr('r');
                let circleNode = svg.children(':first');
                let html = svg.html();
                html = html.trim().replace(/^<circle/, "<path");
                html = html.replace(/\/circle>$/, "/path>");
                svg.html(html);
                break;
            }

        }
        //用背景色模拟选中效果
        $('.shapeItem').css('background-color', '#FFFFFF');
        $(this).css('background-color', '#CEE7F8');
    });

    //初始化两个颜色选择器
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
            let colors = e.color.toString();
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
            let colors = e.color.toString();
            //设置轮廓颜色
            $('#symbolPreview > svg').children(':first').attr("stroke", colors);
        });
    });

}

//解析字符串matrix(a,b,c,d,e,f)，以数组返回
function getmatrix(a, b, c, d, e, f) {
    return new Array(a, b, c, d, e, f);
}

//将数组还原为matrix字符串
function setMatrix(a, b, c, d, e, f) {
    return "matrix(" + a + "," + b + "," + c + "," + d + "," + e + "," + f + ")";
}

//根据比例增减path中的d属性，模式如"M -50 -50 L 50 -50 L 50 50 L -50 50 L -50 -50"
function getPath_d(origin, ratio) {
    let tempArr = origin.split(" ");
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
    const shapeType = $('#symbolPreview > svg').children(':first').prop('tagName');
    //从span标签中取出滑块改变前的值
    const currentSliderValue = Number($("#sliderVal_shape").text());
    //改变后值 减去 改变前的值得到变化量，绝对值以适应增减
    const sliderChangedValue = Math.abs(slideEvt.value - currentSliderValue);
    const originHeight = Number($('#symbolPreview > svg').attr('height'));
    const originWidth = Number($('#symbolPreview > svg').attr('width'));
    const originMatrix = eval("get" + $('#symbolPreview > svg').children(':first').attr("transform"));
    //判断为矩形菱形或圆
    if (shapeType === "path") {
        //获取图形当前path绘制路径量
        const d = $('#symbolPreview > svg').children(':first').attr("d");
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
        const r = Number($('#symbolPreview > svg').children(':first').attr('r'));
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
        const lineType = $('#lineSelect').val();
        //改变预图形中的线型
        switch (lineType) {
            //实线
            case 'solid':
                break;
            //点线
            case 'dot':
                $('#symbolPreview_line > svg > path').attr('stroke-dasharray', slideEvt.value + "," + (slideEvt.value * 3));
                break;
            //虚线
            case 'dash':
                $('#symbolPreview_line > svg > path').attr('stroke-dasharray', (slideEvt.value * 4) + "," + (slideEvt.value * 3));
                break;
            //点划线
            case 'dash-dot':
                $('#symbolPreview_line > svg > path').attr('stroke-dasharray', (slideEvt.value * 4) + "," + (slideEvt.value * 3) + "," + (slideEvt.value) + "," + (slideEvt.value * 3));
                break;
            //双点划线
            case 'short-dash-dot-dot':
                $('#symbolPreview_line > svg > path').attr('stroke-dasharray', (slideEvt.value * 8) + "," + (slideEvt.value * 3) + "," + (slideEvt.value) + "," + (slideEvt.value * 3) + "," + (slideEvt.value) + "," + (slideEvt.value * 3));
                break;
        }
    }

    $("#sliderVal_shape").text(slideEvt.value);

}

function sliderChange_line(slideEvt) {
    $('#symbolPreview > svg').children(':first').attr("stroke-width", slideEvt.value);
    const originHeight = Number($('#symbolPreview > svg').attr('height'));
    const originWidth = Number($('#symbolPreview > svg').attr('width'));
    const currentSliderValue = Number($("#sliderVal_outline").text());
    const sliderChangedValue = Math.abs(slideEvt.value - currentSliderValue);
    const originMatrix = eval("get" + $('#symbolPreview > svg').children(':first').attr("transform"));

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

    //请求色带信息
    (() => {
        let xmlhttp = new window.XMLHttpRequest();
        xmlhttp.open("GET", "./assets/svg.xml", false);
        xmlhttp.send(null);
        if (xmlhttp.readyState == 4) {
            xmlDoc = xmlhttp.responseXML.documentElement
        }
        const svgs = xmlDoc.getElementsByTagName("svg");
        let svgsHTML = "";
        for (let svg of svgs) {
            let h = '<div class="linearGradientItem">' + $(svg).get(0).outerHTML + '</div>';
            svgsHTML += h;
        }
        $('#linearGradientItems').html(svgsHTML);
    })();


    //更改线型显示
    $('#lineSelect').change(function () {
        const lineType = $(this).val();
        $('#lineImg').css('background-position', '0px -' + ($('#lineSelect').get(0).selectedIndex * 15) + 'px');

        const lineWidth = $('#sliderVal_shape').text();
        switch (lineType) {
            case 'solid':
                break;
            case 'dot':
                $('#symbolPreview_line > svg > path').attr('stroke-dasharray', lineWidth + "," + (lineWidth * 3));
                break;
            case 'dash':
                $('#symbolPreview_line > svg > path').attr('stroke-dasharray', (lineWidth * 4) + "," + (lineWidth * 3));
                break;
            case 'dash-dot':
                $('#symbolPreview_line > svg > path').attr('stroke-dasharray', (lineWidth * 4) + "," + (lineWidth * 3) + "," + (lineWidth) + "," + (lineWidth * 3));
                break;
            case 'short-dash-dot-dot':
                $('#symbolPreview_line > svg > path').attr('stroke-dasharray', (lineWidth * 8) + "," + (lineWidth * 3) + "," + (lineWidth) + "," + (lineWidth * 3) + "," + (lineWidth) + "," + (lineWidth * 3));
                break;
        }
    })
})