 <template>
  <div class="charts" ref="charts" style="height:50px;width: 297px;">
    <el-progress :percentage="70"></el-progress>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
    name:'',
    mounted() {
        let lineCharts = echarts.init(this.$refs.charts)

        lineCharts.setOption({
            xAxis:{
                show:false,
                mini:0,
                max:100
            },
            yAxis:{
                show:false,
                type:'category'
            },
            series:[
                {
                    type:'bar',
                    data:[60],
                    color:'skyblue',
                    barWidth:10,//柱子宽度
                    color:'yellowgreen',
                    showBackground:true,
                    showBackgroundStyle:{
                        color:"#eee"
                    },
                    label:{
                        show:true,
                        formatter:'|',
                        position:'right'
                    }
                }
            ],
            grid:{
                left:0,
                top:0,
                right:0,
                bottom:0
            },
            tooltip:{}
        })
    },
}
</script>

<style>
</style>