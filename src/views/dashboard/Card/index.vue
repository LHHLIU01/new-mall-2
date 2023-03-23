<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="6">
        <Detail title="总销售额" count='8320'>
          <template slot="charts">
            <span>周同比&nbsp;&nbsp;79%</span>
            <span>日同比&nbsp;&nbsp;9%</span>
          </template>
          <template slot="footer">
            <span>周同比&nbsp;64%</span>
          </template>
        </Detail>
      </el-col>
      <el-col :span="6">
        <Detail title="访问量" count='15232'>
          <template slot="charts">
            <lineChatr> </lineChatr>
          </template>
          <template slot="footer">
            <span>访问量79%</span>
          </template>
        </Detail>
      </el-col>
      <el-col :span="6">
        <Detail title="支付笔数" count='7953'>
          <template slot="charts">
            <barChart></barChart>
          </template>
          <template slot="footer">
            <span>转化率89%</span>
          </template>
        </Detail>
      </el-col>
      <el-col :span="6">
        <Detail title="运营活动效果" count='9764'>
          <template slot="charts">
            <progressChart></progressChart>
          </template>
          <template slot="footer">
            <span>周同比&nbsp;76%</span>
          </template>
          </Detail>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Detail from "./Detail";
import lineChatr from './lineChart';
import barChart from './barChart'
import progressChart from './progressChart'
export default {
  name: "card",
  components: {
    Detail,
    lineChatr,
    barChart,
    progressChart
  },
};
</script>

<style>
</style>