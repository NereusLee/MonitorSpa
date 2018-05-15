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
    return {
        chart: {
            borderWidth: 1,
            type: chartType,
            zoomType: 'x'
        },
        title: {
            text: title //图表名称
        },
        credits: {
            enabled: false //highcharts图标
        },
        xAxis: {
            showfirstlabl: true,
            // tickInterval: nums,
            categories: categories,
            labels: {
                rotation: 0//调节倾斜角度偏移
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: ytitle
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            crosshairs: true,
            shared: true,
            valueSuffix: suffix
        },
        plotOptions: {
            line: {
                marker: {
                    enabled: false
                }
            },
            series: {
                cursor: 'pointer',
                point: {
                    itemStyle: {
                        normal: {
                            lineStyle: {
                                color: '#fff',
                                width: 10
                            }
                        }
                    },
                    events: {
                        click: function () {

                            var time = this.category;
                            if (title !== '') {//汇总
                                var sdate = $('#access_date').val();

                                clickcallback(sdate, time);
                            } else {

                                var sdate = this.series.name;
                                clickcallback(sdate, time);
                            }

                        }
                    }
                }
            }
        },
        series: series
    }

    // return {
    //
    //     chart: {
    //         scrollablePlotArea: {
    //             minWidth: 700
    //         },
    //         type: chartType,
    //         zoomType: 'x'
    //     },
    //
    //     // data: {
    //     //     csvURL: 'https://cdn.rawgit.com/highcharts/highcharts/' +
    //     //     '057b672172ccc6c08fe7dbb27fc17ebca3f5b770/samples/data/analytics.csv',
    //     //     beforeParse: function (csv) {
    //     //         return csv.replace(/\n\n/g, '\n');
    //     //     }
    //     // },
    //
    //     title: {
    //         text: 'Daily sessions at www.highcharts.com'
    //     },
    //
    //     subtitle: {
    //         text: 'Source: Google Analytics'
    //     },
    //
    //     xAxis: {
    //         tickInterval: 7 * 24 * 3600 * 1000, // one week
    //         tickWidth: 0,
    //         gridLineWidth: 1,
    //         labels: {
    //             align: 'left',
    //             x: 3,
    //             y: -3
    //         }
    //     },
    //
    //     yAxis: [{ // left y axis
    //         title: {
    //             text: null
    //         },
    //         labels: {
    //             align: 'left',
    //             x: 3,
    //             y: 16,
    //             format: '{value:.,0f}'
    //         },
    //         showFirstLabel: false
    //     }, { // right y axis
    //         linkedTo: 0,
    //         gridLineWidth: 0,
    //         opposite: true,
    //         title: {
    //             text: null
    //         },
    //         labels: {
    //             align: 'right',
    //             x: -3,
    //             y: 16,
    //             format: '{value:.,0f}'
    //         },
    //         showFirstLabel: false
    //     }],
    //
    //     legend: {
    //         align: 'left',
    //         verticalAlign: 'top',
    //         borderWidth: 0
    //     },
    //
    //     tooltip: {
    //         shared: true,
    //         crosshairs: true,
    //         valueSuffix:suffix
    //     },
    //
    //     plotOptions: {
    //         series: {
    //             cursor: 'pointer',
    //             point: {
    //                 events: {
    //                     click: function (e) {
    //                         hs.htmlExpand(null, {
    //                             pageOrigin: {
    //                                 x: e.pageX || e.clientX,
    //                                 y: e.pageY || e.clientY
    //                             },
    //                             headingText: this.series.name,
    //                             maincontentText: Highcharts.dateFormat('%A, %b %e, %Y', this.x) + ':<br/> ' +
    //                             this.y + ' sessions',
    //                             width: 200
    //                         });
    //                     }
    //                 }
    //             },
    //             marker: {
    //                 lineWidth: 1
    //             }
    //         }
    //     },
    //
    //     series: series
    // }
}


