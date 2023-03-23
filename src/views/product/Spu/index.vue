<template>
  <div>
    <!-- 上半 三级联动  全局组件 -->
    <el-card style="margin: 20px 0">
      <CategorySelect
        @getCategoryId="getCategoryId"
        :show="scene != 0"
      ></CategorySelect>
    </el-card>
    <!-- 下半 为三部分进行切换  -->
    <el-card>
      <div v-show="scene == 0">
        <!-- 第一部分 -->
        <!-- spu列表 -->
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="addSpu"
          >添加SPU</el-button
        >
        <el-table style="width: 100%" border :data="records">
          <!-- 序号列 -->
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <!-- SPU名称列 -->
          <el-table-column prop="spuName" label="SPU名称" width="width">
          </el-table-column>
          <!-- spu描述列 -->
          <el-table-column prop="description" label="SPU描述" width="width">
          </el-table-column>
          <!-- 操作列 -->
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <hint-button type="success" icon="el-icon-plus" size="mini" title="添加sku" @click="addSku(row)"></hint-button>
              <hint-button type="warning" icon="el-icon-edit" size="mini" title="修改spu" @click="updateSpu(row)"></hint-button>
              <hint-button type="info" icon="el-icon-info" size="mini" title="查看当前spu全部sku列表" @click="handler(row)"></hint-button>
              <el-popconfirm title="这是一段内容确定删除吗？" @onConfirm ="deleteSpu(row)">
                <hint-button type="danger" icon="el-icon-delete" size="mini" title="删除spu" slot="reference"></hint-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器  
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"-->
        <el-pagination
          style="text-align: center"
          :current-page="page"
          :page-sizes="[3, 5, 10]"
          :page-size="limit"
          layout="prev, pager, next, jumper,->,sizes,total"
          :total="total"
          @current-change="getSpuList"
          @size-change="handleCurrentChange"
        >
        </el-pagination>
      </div>
      <!-- 第二部分 -->
      <SpuForm
        v-show="scene == 1"
        @changeScene="changeScene"
        ref="spu"
      ></SpuForm>
      <!-- 第三部分 -->
      <SkuForm v-show="scene == 2" ref="sku" @changeScenes="changeScenes"></SkuForm>
    </el-card>
    <el-dialog :title="`${spu.spuName}SKU列表`" :visible.sync="dialogTableVisible" :before-close="close">
      <el-table :data="skuList" style="width:100%" border="" v-loading="loading">
        <el-table-column property="skuName" label="名称" width="width"></el-table-column>
        <el-table-column property="price" label="价格" width="width"></el-table-column>
        <el-table-column property="weight" label="重量" width="width"></el-table-column>
        <el-table-column  label="默认图片" width="width">
          <template slot-scope="{row,$index}">
            <img :src="row.skuDefaultImg" style="width:100px;height:100px">
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import SpuForm from "./SpuForm";
import SkuForm from "./SkuForm";
export default {
  name: "Spu",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      // show: true,
      page: 1,
      limit: 3,
      records: [],
      total: 0,
      scene: 0,
      dialogTableVisible:false,
      spu:{},
      skuList:[],
      loading:true
    };
  },
  methods: {
    // 三级联动自定义事件自定义事件 自定义事件
    getCategoryId({ categoryId, level }) {
      if (level == 1) {
        this.category1Id = categoryId;
        this.category2Id = "";
        this.category3Id = "";
      } else if (level == 2) {
        this.category2Id = categoryId;
        this.category3Id = "";
      } else {
        this.category3Id = categoryId;
        this.getSpuList();
      }spu
    },
    // 获取spu列表
    async getSpuList(pages = 1) {
      this.page = pages;
      const { page, limit, category3Id } = this;
      // console.log(page,limit,category3Id);
      let result = await this.$API.spu.reqSpuList(page, limit, category3Id);
      // console.log(result);
      if (result.code == 200) {
        this.total = result.data.total;
        this.records = result.data.records;
      }
    },
    // 每页展示数变化时
    handleCurrentChange(limit) {
      this.limit = limit;
      this.getSpuList();
    },
    // 添加spu
    addSpu() {
      this.scene = 1;
      this.$refs.spu.addSpuData(this.category3Id);
    },
    // 修改一个spu
    updateSpu(row) {
      this.scene = 1;
      this.$refs.spu.initSpuData(row);
    },
    // 自定义事件回调
    changeScene({scene,flag}) {
      this.scene = scene;
      if (flag=="修改") {
        this.getSpuList(this.page)
      } else{
        this.getSpuList();
      }
    },
    // 删除spu
    async deleteSpu(row){
      // console.log(row);
      let result = await this.$API.spu.reqDeleteSpu(row.id)
      if (result.code==200) {
        this.$message({type:'success',message:'删除成功'})
        this.getSpuList(this.records.length>1?this.page:this.page-1);
      }
    },
    // 添加sku
    addSku(row){
      this.scene = 2;
      this.$refs.sku.getData(this.category1Id,this.category2Id,row)
    },
    changeScenes(scene){
      this.scene = scene
    },
    async handler(spu){
      this.dialogTableVisible = true
      this.spu = spu
      let result = await this.$API.spu.reqSkuList(spu.id)
      // console.log(result);
      if (result.code==200) {
        this.skuList = result.data
        this.loading = false
      }
    },
    close(done){
      this.loading = true;
      this.skuList = [];
      done();
    }
  },
  components: {
    SpuForm,
    SkuForm,
  },
};
</script>

<style>
</style>