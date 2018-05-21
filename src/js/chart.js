// import $ from 'jquery'
// import Highcharts from 'highcharts';

export function showChart(series, categories, ytitle, suffix, title, chartType, clickcallback, small) {
    Highcharts.setOptions({
        // 所有语言文字相关配置都设置在 lang 里
        lang: {
            resetZoom: '重置',
            resetZoomTitle: '重置缩放比例'
        }
    });

    return {
        title:title,
        option:{
            chart: {
                type: 'line', //指定图表的类型，默认是折线图（line）
                zoomType:'x'
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
                }
            },
            yAxis: {
                title: {
                    text: title, //指定y轴的标题

                },
            },
            plotOptions: {
                column: {
                    colorByPoint: true
                },
            },
            series: series
        }
    }
}


