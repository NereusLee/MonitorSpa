import $ from 'jquery'
import Highcharts from 'highcharts';

function comparison(num1,num2) {
    let rate = Math.round((num1 - num2)/num2*10000)/100+"%"
    if(num1>num2){
        return {
            color:'green',
            data:rate,
            icon:'arrow-up-a'
        }
    }else {
        return {
            color:'red',
            data:rate,
            icon:'arrow-down-a'
        }
    }
}
export function showChart(series, categories, ytitle, suffix, title, chartType, clickcallback, type) {
    Highcharts.setOptions({
        // 所有语言文字相关配置都设置在 lang 里
        lang: {
            resetZoom: '重置',
            resetZoomTitle: '重置缩放比例'
        }
    });
    let chartOption = {
            chart: {
                type: 'line', //指定图表的类型，默认是折线图（line）
                zoomType: 'x'
            },
            credits: {
                enabled: false
            }, //去掉地址
            title: {
                text: '' //指定图表标题
            },
            xAxis: {
                categories: categories, //指定x轴分组
                labels: {
                    rotation: 0//调节倾斜角度偏移
                },
            },
            yAxis: {
                title: {
                    text: '', //指定y轴的标题

                },
            },
            plotOptions: {
                column: {
                    colorByPoint: true
                },
            },
            series: series,
    }
    let tool = {
        tooltip: {
            shared: true,
            valueSuffix: '分',
            formatter: function () {
                let s = "";
                $.each(this.points, function (i, v) {
                    s += '<span style="font-weight:bold;color:#7a85a2;display: block;">类型:' + v.point.paperType + '&nbsp;&nbsp;&nbsp;成绩:' + v.point.y + '分</span> ';
                });
                // console.log(this.points)
                let arr = [
                    comparison(this.points[0].y,this.points[1].y), //昨天
                    comparison(this.points[0].y,this.points[2].y)  //上周
                ]
                // console.log($(this),$(this).parent('.x-bar'))
                sessionStorage.setItem('comparison',JSON.stringify(arr))
                return s;
            },
            useHTML: true
        }
    }
    if (type == 1) {
        return {
            title:title,
            option:$.extend({}, chartOption, tool)
        }
    } else {
        return {
            title:title,
            option:chartOption
        }
    }

}


