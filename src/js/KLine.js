import KLineSetChartController from './KLineSetChart';
import KLineMobileSetChartController from './KLineMobileSetChart';
import option from './KLineOption';
import mobileOption from './KLineMobileOption';
import { getCandleOptionByMA } from './ChartOptionUtils';

class KLineController {
    constructor(platform, klineConfig) {
        var merge = require('lodash.merge');
        var config;
        if (platform === 'pc') {
            config = merge(option, klineConfig);
            getCandleOptionByMA(config);
            this.setKLineChart = new KLineSetChartController(config);
        } else {
            config = merge(mobileOption, klineConfig);
            getCandleOptionByMA(config);
            this.setMobileKLineChart = new KLineMobileSetChartController(config);
        }
    }

    initChart(DOM) {
        this.setKLineChart.initECharts(DOM);
    }

    showLoading() {
        this.setKLineChart.showLoading();
    }

    resizeChart(DOM, isFullScreen, isCloseIndicator, size) {
        this.setKLineChart.resizeECharts(DOM, isFullScreen, isCloseIndicator, size);
    }

    setOption(data, cycle) {
        return this.setKLineChart.setOption(data, cycle);
    }

    updateOption(data, cycle) {
        this.setKLineChart.updateOption(data, cycle);
    }

    getEchart() {
        return this.setKLineChart.getEchart();
    }

    getToolTipIndex() {
        return this.setKLineChart.getToolTipIndex();
    }

    changeDataZoom(type) {
        this.setKLineChart.changeDataZoom(type);
    }

    clearChart() {
        this.setKLineChart.clearEcharts();
    }

    disposeChart() {
        this.setKLineChart.disposeEChart();
    }

    initMobileChart(DOM) {
        this.setMobileKLineChart.initMobileECharts(DOM);
    }

    showMobileLoading() {
        this.setMobileKLineChart.showLoading();
    }

    hideMobileLoading() {
        this.setMobileKLineChart.hideLoading();
    }

    getMobileToolTipIndex() {
        return this.setMobileKLineChart.getToolTipIndex();
    }

    setMobileOption(size) {
        this.setMobileKLineChart.setOption(size);
    }

    setTimeDivisionsOption(size) {
        this.setMobileKLineChart.setTimeDivisionsOption(size);
    }

    updateMobileOption(data, cycle) {
        return this.setMobileKLineChart.updateOption(data, cycle);
    }

    getMobileEchart() {
        return this.setMobileKLineChart.getMobileEchart();
    }

    updateTimeDivisionOption(divisionData, precision) {
        return this.setMobileKLineChart.updateTimeDivisionOption(divisionData, precision);
    }

    changeMobileDataZoom(type) {
        this.setMobileKLineChart.changeDataZoom(type);
    }

    disposeMobileChart() {
        this.setMobileKLineChart.disposeMobileEChart();
    }

    clearMobileChart() {
        this.setMobileKLineChart.clearMobileEcharts();
    }
}

export default KLineController;

