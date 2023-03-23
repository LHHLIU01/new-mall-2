<template>
  <div class="charts" ref="charts" style="height:50px;width: 297px;">
    
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
                type:'category'
            },
            yAxis:{
                show:false
            },
            series:[
                {
                    type:'line',
                    data:[10,20,10,60,30,50],
                    smooth:true,
                    itemStyle:{
                        opacity:0
                    },
                    lineStyle:{
                        color:'purple'
                    },
                    
                    areaStyle:{
                        color:{
                            type:'linear',
                            x:0,
                            y:0,
                            x2:0,
                            y2:1,
                            colorStops:[
                                {
                                    offset:0,
                                    color:'purple'
                                },
                                {
                                    offset:1,
                                    color:'#fff',
                                }
                            ],
                            global:false
                        }
                    }
                }
            ],
            grid:{
                left:0,
                top:0,
                right:0,
                bottom:0
            },
        })
    },
}
</script>

<style>

</style>