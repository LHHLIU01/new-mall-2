<template>
  <div>
    <el-card>
    <div class="card-header">
        <span>{{title}}</span>
        <i class="el-icon-info"></i>
    </div>
    <div class="card-content">{{count}}</div>
    <div class="card-charts">
        <slot name='charts'></slot>
    </div>
    <div class="card-footer">
        <slot name='footer'></slot>
    </div>
    </el-card>
  </div>
</template>

<script>
export default {
 name:'',
 props:['title','count']
}
</script>

<style>
 .card-header{
    display: flex;
    justify-content: space-between;
    color: #d9d9d9;
 }
 .card-content{
    font-size: 30px;
    padding: 10 0;
 }
 .card-charts{
    height: 50px;
 }
 .card-footer{
    border-top: 1px solid #eee;
    padding: 10px 0px;
}
</style>