<template>
  <div>
    <div class="header">
      <span class="search-header">搜索用户数</span>
      <i class="el-icon-info"></i>
    </div>
    <div class="main">
        <span class="main-title">132</span>
        <span class="main-content">87</span>
    </div>
    <div class="footer">
        <div class="charts" ref="charts">
        </div>
    </div>
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
};
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  color: #d9d9d9;
}
.search-header {
  margin-right: 20px;
}
.main{
    margin: 10px 0px;
}
.main-title{
    margin-right: 20px;

}
.main-content{
    margin-right: 20px;
}
.charts{
    width: 100%;
    height: 50px;
}
</style>