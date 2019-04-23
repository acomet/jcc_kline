import echarts from 'echarts/lib/echarts';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/chart/candlestick';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/dataZoom';
import merge from 'lodash.merge';
import { saveCandle } from './linkageCharts';
import { getLanguage, getDefaultChartSize } from './utils';

var config;
var toolTipIndex;
var oldKlineData;
var oldDataZoom;

class KLineSetChartController {
    constructor(configs) {
        this.klineConfig = configs;
    }

    resizeECharts(DOM, isFullScreen, isCloseIndicator, resizeSize) {
        let size = getDefaultChartSize();
        let csale = isCloseIndicator === false ? 0.6 : 0.7;
        if (!isFullScreen) {
            if (!this.klineConfig.defaultSize) {
                let resizeContainer = () => {
                    if (DOM) {
                        DOM.style.height = resizeSize.height * csale + 'px';
                        DOM.style.width = resizeSize.width + 'px';
                    }
                };
                resizeContainer(this);
                this.kline.resize();
            } else {
                let resizeContainer = () => {
                    if (DOM) {
                        DOM.style.height = size.height * csale + 'px';
                        DOM.style.width = size.width + 'px';
                    }
                };
                resizeContainer(this);
                this.kline.resize();
            }
        } else {
            let resizeContainer = () => {
                DOM.style.height = size.clientHeight * csale + 'px';
                DOM.style.width = size.clientWidth + 'px';
            };
            resizeContainer(this);
            this.kline.resize();
        }
        if (oldKlineData) {
            this.updateOption(oldKlineData.oldData, oldKlineData.oldCycle);
        }
    }

    initECharts(DOM, clear, type) {
        if (type === 'update') {
            oldDataZoom = this.kline.getOption().dataZoom;
        }
        if (this.kline && clear) {
            toolTipIndex = 0;
            oldKlineData = null;
            this.kline.dispose();
        }
        if (!this.kline || this.kline.isDisposed()) {
            this.kline = echarts.init(DOM);
            this.showLoading();
        }
    }

    showLoading() {
        let message = getLanguage();
        this.kline.showLoading(
            {
                text: message.loading,
                color: '#fff',
                textColor: '#fff',
                maskColor: 'rgba(22, 27, 33, 0.5)',
                zlevel: 1
            }
        );
    }

    disposeEChart() {
        if (this.kline) {
            this.kline.dispose();
        }
    }

    /* 绘制kline开始 */

    setOption(data, cycle) {
        oldKlineData = {
            oldData: data,
            oldCycle: cycle
        };
        config = JSON.parse(JSON.stringify(this.klineConfig));
        if (data) {
            oldDataZoom = null;
            let length = data.values.length - 1;
            toolTipIndex = length;
            this.kline.hideLoading();
            let klineOption = {
                tooltip: this.getToolTip(),
                xAxis: this.getXAxis(data, cycle),
                series: this.getSeries(data),
                dataZoom: this.getDataZoom(data)
            };
            merge(config, klineOption);
            this.kline.setOption(config, true);
            saveCandle(this.kline);
            return toolTipIndex;
        }
    }

    updateOption(data, cycle) {
        oldKlineData = {
            oldData: data,
            oldCycle: cycle
        };
        if (data) {
            let klineOption = {
                tooltip: this.getToolTip(),
                xAxis: this.getXAxis(data, cycle),
                series: this.getSeries(data)
            };
            merge(config, klineOption);
            config.dataZoom = oldDataZoom;
            this.kline.hideLoading();
            this.kline.setOption(config);
            saveCandle(this.kline);
        }
    }

    getToolTipIndex() {
        return toolTipIndex;
    }

    getToolTip() {
        return {
            formatter: function (param) {
                param = param[0];
                if (param) {
                    var index = param.data[0];
                    toolTipIndex = index;
                }
            }
        };
    }

    getXAxis(data, cycle) {
        var x = [{
            gridIndex: 0,
            data: data.categoryData,
            axisLabel: {
                formatter(value) {
                    if (cycle.indexOf('minute') !== -1) {
                        return value.substring(5);
                    }
                    if (cycle.indexOf('hour') !== -1) {
                        return value.substring(5);
                    }
                    if (cycle === 'day') {
                        return value.substring(0, 12);
                    }
                    if (cycle === 'week') {
                        return value.substring(0, 12);
                    }
                    if (cycle === 'month') {
                        return value.substring(0, 7);
                    }
                }
            }
        }];
        return x;
    }

    getSeries(data) {
        var s = [{
            type: 'candlestick',
            data: data.values,
        }];
        for (var i = 0; i < data.MAData.length; i++) {
            s[i + 1] = {
                name: data.MAData[i].name,
                data: data.MAData[i].data
            };
        }
        if (data.indicatorType === 'Boll') {
            let MB = {
                name: 'MB',
                type: 'line',
                data: data.BollData.MB,
                symbol: 'none',
                smooth: true,
                showSymbol: false,
                lineStyle: {
                    normal: {
                        color: '#e6e6e6',
                        opacity: 1,
                        width: 1
                    }
                }
            };
            let LB = {
                name: 'LB',
                type: 'line',
                data: data.BollData.LB,
                symbol: 'none',
                smooth: true,
                showSymbol: false,
                lineStyle: {
                    normal: {
                        color: '#e03bfa',
                        opacity: 1,
                        width: 1
                    }
                }
            };
            let UB = {
                name: 'UB',
                type: 'line',
                data: data.BollData.UB,
                symbol: 'none',
                smooth: true,
                showSymbol: false,
                lineStyle: {
                    normal: {
                        color: '#f6d026',
                        opacity: 1,
                        width: 1
                    }
                }
            };
            s.push(MB);
            s.push(LB);
            s.push(UB);
        }
        return s;
    }

    getDataZoom(data) {
        let start = 0;
        if (data.values.length > 80) {
            start = 20;
        }
        if (data.values.length > 120) {
            start = 30;
        }
        if (data.values.length > 160) {
            start = 50;
        }
        if (data.values.length > 200) {
            start = 60;
        }
        var dataZoom = [
            {
                id: 'dataZoomX',
                type: 'inside',
                filterMode: 'filter',
                start: start,
                end: 100,
                minSpan: 5
            }
        ];
        this.klineConfig.dataZoom = dataZoom;
        return dataZoom;
    }

    changeDataZoom(type) {
        let dataZoom = JSON.parse(JSON.stringify(this.kline.getOption().dataZoom));
        if (type === 'leftShift' && dataZoom[0].start >= 2) {
            dataZoom[0].start = dataZoom[0].start - 2;
            dataZoom[0].end = dataZoom[0].end - 2;
        } else if (type === 'enlarge' && dataZoom[0].start < 95) {
            dataZoom[0].start = dataZoom[0].start + 5;
        } else if (type === 'refresh') {
            dataZoom[0].start = this.klineConfig.dataZoom[0].start;
            dataZoom[0].end = this.klineConfig.dataZoom[0].end;
        } else if (type === 'narrow' && dataZoom[0].start >= 5) {
            dataZoom[0].start = dataZoom[0].start - 5;
        } else if (type === 'rightShift' && dataZoom[0].end <= 98) {
            dataZoom[0].start = dataZoom[0].start + 2;
            dataZoom[0].end = dataZoom[0].end + 2;
        }
        config.dataZoom = dataZoom;
        this.kline.setOption(config);
    }
}

export default KLineSetChartController;
