import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/dataZoom';

export const linkageVolume = (candle, volume) => {
    echarts.connect([candle, volume]);
};