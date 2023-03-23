<template>
  <el-card class="box-card" style="margin: 10px 0px">
    <div slot="header" class="clearfix">
      <el-tabs class="tab" v-model="activeName">
        <el-tab-pane label="销售额" name="sale"></el-tab-pane>
        <el-tab-pane label="访问量" name="visite"></el-tab-pane>
      </el-tabs>
      <div class="right">
        <span @click="setDay">今日</span>
        <span @click="setWeek">本周</span>
        <span @click="setMonth">本月</span>
        <span @click="setYear">本年</span>
        <el-date-picker
          v-model="date"
          class="date"
          size="mini"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </div>
    </div>
    <div>
      <div>
        <el-row :gutter="10">
            <el-col :span="19">
              <div class="charts" ref="charts"></div>
            </el-col>
            <el-col :span="5">
              <h4>门店{{title}}排名</h4>
              <ul>
                <li><span class="rindex">1</span><span>肯德基</span><span class="rvalue">12735</span></li>
                <li><span class="rindex">2</span><span>麦当劳</span><span class="rvalue">10435</span></li>
                <li><span class="rindex">3</span><span>汉堡王</span><span class="rvalue">10234</span></li>
                <li><span>4</span><span>老乡鸡</span><span class="rvalue">09284</span></li>
                <li><span>5</span><span>沙县小吃</span><span class="rvalue">09004</span></li>
                <li><span>6</span><span>兰州拉面</span><span class="rvalue">08975</span></li>
                <li><span>7</span><span>必胜客</span><span class="rvalue">08653</span></li>
                <li><span>8</span><span>德克士</span><span class="rvalue">08432</span></li>
                <li><span>9</span><span>奈雪</span><span class="rvalue">08001</span></li>
              </ul>
            </el-col>
        </el-row>
      </div>
    </div>
  </el-card>
</template>

<script>
import echarts from 'echarts'
import dayjs from 'dayjs'
import { mapState } from 'vuex';
export default {
  name: "",
  data() {
    return {
        activeName:'sale',
        mycharts:null,
        date:[]
    }
  },
  mounted() {
    this.mycharts = echarts.init(this.$refs.charts)
    this.mycharts.setOption({
      title:{
        text:'销售额趋势'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: [],
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: 'Direct',
          type: 'bar',
          barWidth: '60%',
          data: [],
          color:'skyblue'
        }
      ]
    })
  },
  computed:{
    title(){
     return this.activeName=='sale'?'销售额':'访问量'
    },
    ...mapState({
      listState:state=>state.home.list
    })
  },
  watch:{
    title(){
      this.mycharts.setOption({
        title:{
          text:this.title
        },
        xAxis:{
          data: this.title == "销售额"? this.listState.orderFullYearAxis:this.listState.userFullYearAxis
        },
        series:[
          {
            name:'Direct',
            type:'bar',
            barWidth:'60%',
            data:this.title=='销售额'?this.listState.orderFullYear:this.listState.userFullYear,
            color:'skyblue'
          }
        ]
      })
    },
    listState(){
      this.mycharts.setOption({
        title:{
          text:'销售额趋势'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: this.listState.orderFullYearAxis,
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: 'Direct',
            type: 'bar',
            barWidth: '60%',
            data: this.listState.orderFullYear,
            color:'skyblue'
          }
        ]
      })
    }
  },
  methods: {
    setDay(){
      const day = dayjs().format('YYYY-MM-DD')
      this.date=[day,day]
    },
    setWeek(){
      const start = dayjs().day(1).format('YYYY-MM-DD');
      const end = dayjs().day(7).format('YYYY-MM-DD');
      this.date=[start,end]
    },
    setMonth(){
      const start = dayjs().startOf('month').format('YYYY-MM-DD');
      const end = dayjs().endOf('month').format('YYYY-MM-DD');
      this.date=[start,end]
    },
    setYear(){
      const start = dayjs().startOf('year').format('YYYY-MM-DD');
      const end = dayjs().endOf('year').format('YYYY-MM-DD');
      this.date=[start,end]
    }
  },
};
</script>

<style scoped>
.clearfix {
  position: relative;
  display: flex;
  justify-content: space-between;
}
.tab {
  width: 100%;
}
.right {
  position: absolute;
  right: 0;
}
.date {
  width: 200px;
  margin: 0px 20px;
}
.right span{
    margin: 0 10px;
}
.charts{
  width: 100%;
  height: 300px;
}
ul{
  list-style: none;
  width: 100%;
  height: 300px;
  padding: 0;
}
ul li{
  height: 8%;
  margin: 5px 0px;
}
.rindex{
 width: 20px;
 height: 20px; 
 border-radius: 50%;
 background: black;
 color: white;
 text-align: center;
 float: left;
}
.rvalue{
  float: right;
}
li :nth-child(2){
  margin: 0 10px;
}
</style>