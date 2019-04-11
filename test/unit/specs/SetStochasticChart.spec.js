import SetStochasticChart from 'js/SetStochasticChart'
import { getKDJData } from 'js/processData'
import { StochasticOption } from 'js/IndicatorsLineOption'
import testData from '../../testData/testData.json'

let KDJData = getKDJData(9, testData.candleData.values)
KDJData.categoryData = testData.candleData.categoryData
KDJData.precision = testData.precision
let size = {
    height: 1080,
    width: 1920
}

describe('test SetStochasticChart', () => {
    it('test SetStochasticChart', () => {
        let stochastic = new SetStochasticChart(StochasticOption);
        expect(stochastic).toBeInstanceOf(SetStochasticChart)
    })
    
    it('test initStochasticECharts', () => {
        const element = document.createElement('div');
        let stochastic = new SetStochasticChart(StochasticOption);
        stochastic.initStochasticECharts(element)
        stochastic.initStochasticECharts(element, true)
        expect(stochastic).not.toBeNull();
    })

    it('test setStochasticOption', () => {
        const element = document.createElement('div');
        let stochastic = new SetStochasticChart(StochasticOption);
        stochastic.initStochasticECharts(element)
        stochastic.setStochasticOption(KDJData, 'hour')
        expect(stochastic.stochastic.getOption()).not.toBeNull();
    })

    it('test setStochasticOption if data is null', () => {
        const element = document.createElement('div');
        let stochastic = new SetStochasticChart(StochasticOption);
        stochastic.initStochasticECharts(element)
        stochastic.setStochasticOption(null, 'hour')
        expect(stochastic.stochastic.getOption()).not.toBeNull();
    })

    it('test updateStochasticOption', () => {
        const element = document.createElement('div');
        let stochastic = new SetStochasticChart(StochasticOption);
        stochastic.initStochasticECharts(element)
        stochastic.setStochasticOption(KDJData, 'day')
        stochastic.updateStochasticOption(KDJData, 'week')
        expect(stochastic.stochastic.getOption()).not.toBeNull();
    })

    it('test getToolTipData', () => {
        const element = document.createElement('div');
        let stochastic = new SetStochasticChart(StochasticOption);
        stochastic.initStochasticECharts(element)
        stochastic.setStochasticOption(KDJData, 'day')
        let tipData = stochastic.getToolTipData()
        expect(tipData).not.toBeNull();
    })

    it('test resizeECharts', () => {
        const element = document.createElement('div');
        let stochastic = new SetStochasticChart(StochasticOption);
        stochastic.initStochasticECharts(element)
        stochastic.setStochasticOption(KDJData, 'hour')
        stochastic.resizeECharts(element, false, size)
        expect(stochastic.stochastic.getOption()).not.toBeNull();
    })

    it('test resizeECharts if DOM is null', () => {
        const element = document.createElement('div');
        let stochastic = new SetStochasticChart(StochasticOption);
        stochastic.initStochasticECharts(element)
        stochastic.setStochasticOption(KDJData, 'aa')
        stochastic.resizeECharts(null, false, size)
        expect(stochastic.stochastic.getOption()).not.toBeNull();
    })

    it('test resizeECharts if isFullScreen is true', () => {
        const element = document.createElement('div');
        let stochastic = new SetStochasticChart(StochasticOption);
        stochastic.initStochasticECharts(element)
        stochastic.setStochasticOption(KDJData, '5minute')
        stochastic.resizeECharts(element, true, size)
        expect(stochastic.stochastic.getOption()).not.toBeNull();
    })

    it('test disposeStochasticEChart', () => {
        const element = document.createElement('div');
        let stochastic = new SetStochasticChart(StochasticOption);
        stochastic.initStochasticECharts(element)
        stochastic.setStochasticOption(KDJData, 'hour')
        stochastic.disposeStochasticEChart()
        expect(stochastic.stochastic.getOption()).not.toBeNull();
    })

    it('test updateStochasticOption if getOption is null', () => {
        const element = document.createElement('div');
        let stochastic = new SetStochasticChart(StochasticOption);
        stochastic.initStochasticECharts(element)
        stochastic.updateStochasticOption(KDJData, 'week')
        expect(stochastic).not.toBeNull();
    })
})