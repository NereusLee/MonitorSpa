// import $ from 'jquery'
import HighCharts from 'highcharts';

export function showChart(series, categories, ytitle, suffix, title, chartType, clickcallback, small) {
    HighCharts.setOptions({
        // 所有语言文字相关配置都设置在 lang 里
        lang: {
            resetZoom: '重置',
            resetZoomTitle: '重置缩放比例'
        }
    });

    if (small == 'small') {
        var nums = Math.floor(categories.length / 5);
    } else {
        var nums = Math.floor(categories.length / 24);
    }

    // HighCharts.chart(id,);
    // return {
    //     chart: {
    //         borderColor:'#fff',
    //         borderWidth:4,
    //         type: chartType,
    //         zoomType: 'x'
    //     },
    //     title: {
    //         text: title //图表名称
    //     },
    //     credits: {
    //         enabled: false //highcharts图标
    //     },
    //     xAxis: {
    //         showfirstlabl: true,
    //         // tickInterval: nums,
    //         categories: categories,
    //         labels: {
    //             rotation: 0//调节倾斜角度偏移
    //         }
    //     },
    //     yAxis: {
    //         min: 0,
    //         title: {
    //             text: ytitle
    //         },
    //         plotLines: [{
    //             value: 0,
    //             width: 1,
    //             color: '#808080'
    //         }]
    //     },
    //     tooltip: {
    //         crosshairs: true,
    //         shared: true,
    //         valueSuffix: suffix
    //     },
    //     plotOptions: {
    //         line: {
    //             marker: {
    //                 enabled: false,
    //                 // symbol:'circle',
    //                 // radius:5,
    //                 // lineWidth:2
    //             }
    //         },
    //         series: {
    //             cursor: 'pointer',
    //             point: {
    //                 itemStyle: {
    //                     normal: {
    //                         lineStyle: {
    //                             color: '#fff',
    //                             width: 10
    //                         }
    //                     }
    //                 },
    //                 events: {
    //                     click: function () {
    //
    //                         var time = this.category;
    //                         if (title !== '') {//汇总
    //                             var sdate = $('#access_date').val();
    //
    //                             clickcallback(sdate, time);
    //                         } else {
    //
    //                             var sdate = this.series.name;
    //                             clickcallback(sdate, time);
    //                         }
    //
    //                     }
    //                 }
    //             }
    //         }
    //     },
    //     series: series
    // }

    return {
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
                text: '', //指定y轴的标题

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


