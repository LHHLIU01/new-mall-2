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
                    type:'bar',
                    data:[10,20,10,60,30,50,10,20,10,60,30,50],
                    // smooth:true,
                        color:'skyblue'
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