<template>
  <div>
    <el-form ref="form" label-width="80px">
      <el-form-item label="SPU名称">
        🤭{{spu.spuName}}
      </el-form-item>
      <el-form-item label="SKU名称">
        <el-input placeholder="sku名称" v-model="skuInfo.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input placeholder="价格(元)" type="number" v-model="skuInfo.price"></el-input>
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input placeholder="重量(千克)" v-model="skuInfo.weight"></el-input>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input type="textarea"  placeholder="规格描述" v-model="skuInfo.skuDesc" rows="4"></el-input>
      </el-form-item>
      <el-form-item label="平台属性"> 
        <el-form :inline="true" ref="form" label-width="80px">
          <el-form-item :label="attr.attrName" v-for="(attr,index) in attrInfoList" :key="attr.id">
            <el-select placeholder="请选择" v-model="attr.attrIdAndValueId">
              <el-option :label="attrValue.valueName" :value="`${attr.id}:${attrValue.id}`" v-for="(attrValue,index) in attr.attrValueList" :key="attrValue.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form :inline="true" ref="form" label-width="80px">
          <el-form-item :label="saleAttr.saleAttrName" v-for="(saleAttr,index) in spuSaleAttrList" :key="saleAttr.id">
            <el-select placeholder="请选择" v-model="saleAttr.attrIdAndValueId">
              <el-option :label="saleAttrValue.saleAttrValueName" :value="`${saleAttr.id}:${saleAttrValue.id}`" v-for="(saleAttrValue,index) in saleAttr.spuSaleAttrValueList" :key="saleAttrValue.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table style="width: 100%" border :data="spuImageList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" prop="prop" label="label" width="80">
          </el-table-column>
          <el-table-column prop="prop" label="图片" width="width">
            <template slot-scope="{row,$index}">
              <img :src="row.imgUrl" style="width:100px;height:100px">
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{row,$index}">
              <el-button type="primary" v-if="row.isDefault==0" @click="changeDefault(row)">设置默认</el-button>
              <el-button v-else>默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import ItemVue from '@/layout/components/Sidebar/Item.vue';
export default {
    name:'',
    data() {
      return {
        spuImageList:[],
        spuSaleAttrList:[],
        attrInfoList:[],
        skuInfo:{
          // 父组件传递的数据
          category3Id:0,
          spuId:0,
          tmId:0,
          // 通过vmodel收集
          price:0,
          skuDesc:'',
          skuName:'',
          weight:'',
          // 自己写逻辑
          skuDefaultImg:'',
          skuAttrValueList:[

          ],
          skuSaleAttrValueList:[],
          skuImageList:[],
        },
        spu:{},
        imageList:[]
      }
    },
    methods: {
      async getData(category1Id,category2Id,spu){
        this.skuInfo.category3Id = spu.category3Id
        this.skuInfo.spuId = spu.id;
        this.skuInfo.tmId = spu.tmId
        this.spu = spu
        // 图片数据
        let result = await this.$API.spu.reqSpuImageList(spu.id);
        // console.log(result);
        if (result.code==200) {
          let list = result.data;
          list.forEach(item => {
            item.isDefault = 0;
          });
          this.spuImageList = list
        }
        // 销售属性数据
        let result1 = await this.$API.spu.reqSpuSaleAttrList(spu.id);
        // console.log(result1);
        if (result.code==200) {
          this.spuSaleAttrList = result1.data
        }
        // 销售属性数据
        let result2 = await this.$API.spu.reqAttrInfoList(category1Id,category2Id,spu.category3Id);
        // console.log(result2);
        if (result.code==200) {
          this.attrInfoList = result2.data
        }
      },
      handleSelectionChange(params){
        this.imageList = params
      },
      changeDefault(row){
        this.spuImageList.forEach(item => {
          item.isDefault = 0;
        });
        row.isDefault = 1;
        this.skuInfo.skuDefaultImg = row.imgUrl;
      },
      cancel(){
        this.$emit('changeScenes',0)
        Object.assign(this._data,this.$options.data())
      },
      async save(){
        // 整理属性
        const {attrInfoList,skuInfo,spuSaleAttrList,imageList} = this
        // 平台属性
        skuInfo.skuAttrValueList = attrInfoList.reduce((prev,item)=>{
          if (item.attrIdAndValueId) {
            const [attrId,valueId] = item.attrIdAndValueId.split(':');
            prev.push({attrId,valueId})
          }
          return prev
        },[])
        // 销售属性
        skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((prev,item)=>{
          if (item.attrIdAndValueId) {
            const [saleAttrId,saleAttrValueId] = item.attrIdAndValueId.split(':');
            prev.push({saleAttrId,saleAttrValueId})
          }
          return prev
        },[])
        skuInfo.skuImageList = imageList.map(item=>{
          return {
            imageName:item.imageName,
            imgUrl:item.imgUrl,
            isDefault:item.isDefault,
            spuImgId:item.id
          }
        })
        let result = await this.$API.spu.reqAddSku(skuInfo)
        console.log(result);
        if (result.code == 200) {
          this.$message({type:'success',message:'添加SKU成功'})
          this.$emit('changeScenes',0)
        }
      }
    },
}
</script>

<style>
 
</style>