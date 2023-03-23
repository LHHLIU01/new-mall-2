<template>
  <div>
    <el-form ref="form" label-width="80px" :model="spu">
        <el-form-item label="SPU名称">
            <el-input placeholder="SPU名称" v-model="spu.spuName "></el-input>
        </el-form-item>
        <el-form-item label="品牌">
            <el-select placeholder="请选择品牌" v-model="spu.tmId">
                <el-option :label="tm.tmName" :value="tm.id" v-for="(tm, index) in tradeMarkList" :key="tm.id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="SPU描述">
            <el-input type="textarea" rows="4" placeholder="描述" v-model="spu.description"></el-input>
        </el-form-item>
        <el-form-item label="SPU图片">
            <el-upload
            action="/dev-api/admin/product/fileUpload"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-success="handlerSuccess"
            :file-list="spuImageList">
                <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
        </el-form-item>
        <el-form-item label="销售属性">
            <el-select :placeholder="`还有${unSelectSaleAttr.length}未选择`" v-model="attrIdAndAttrName">
                <el-option :label="unselect.name" :value="`${unselect.id}:${unselect.name}`" v-for="(unselect,index) in unSelectSaleAttr" :key="unselect.id"></el-option>
            </el-select>
            <el-button type="primary" icon="el-icon-plus" :disabled='!attrIdAndAttrName' @click="addSaleAttr">添加销售属性</el-button>
            <el-table style="width: 100%" border :data="spu.spuSaleAttrList">
                <el-table-column type="index" label="序号" width="80px" align="center">
                </el-table-column>
                <el-table-column prop="saleAttrName" label="属性名" width="width">
                </el-table-column>
                <el-table-column prop="prop" label="属性名称列表" width="width">
                  <template slot-scope="{row,$index}">
                      <el-tag :key="tag.id" v-for="(tag,index) in row.spuSaleAttrValueList" 
                        closable :disable-transitions="false" 
                        @close="row.spuSaleAttrValueList.splice(index,1)"> {{tag.saleAttrValueName}}
                      </el-tag>
                      <!-- @keyup.enter.native="handleInputConfirm"
                          @click="showInput"-->
                      <el-input class="input-new-tag" 
                        v-if="row.inputVisible" v-model="row.inputValue" 
                        ref="saveTagInput" size="small"
                        @blur="handleInputConfirm(row)"
                      ></el-input>
                      <el-button v-else class="button-new-tag" size="small" @click="addSaleAttrValue(row)">添加</el-button>
                  </template>
                </el-table-column>
                <el-table-column prop="prop" label="操作" width="width">
                  <template slot-scope="{row,$index}"> 
                      <el-button type="danger" icon="el-icon-delete" size="mini" @click="spu.spuSaleAttrList.splice($index,1)"></el-button>
                  </template>
                </el-table-column>
            </el-table>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
            <el-button @click="cancel">取消</el-button>
        </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
    name:'',
     data() {
      return {
        dialogImageUrl: '',
        dialogVisible: false,
        spu:{
          category3Id:0,
          description:'',
          spuName:'',
          tmId:'',
          spuImageList:[],
          spuSaleAttrList:[
            // {
            //   baseSaleAttrId:0,
            //   id:0,
            //   saleAttrName:'string',
            //   spuId:0,
            //   spuSaleAttrValueList:[
            //     {
            //       baseSaleAttrId:0,
            //       id:0,
            //       isChecked:'string',
            //       saleAttrName:'string',
            //       saleAttrValueName:'string',
            //       spuId:0
            //     }
            //   ]
            // }
          ]
        },//spu信息属性
        tradeMarkList:[], //存储品牌信息
        spuImageList:[],  //存储spu图片的数据
        saleAttrList:[],  //销售属性的数据
        attrIdAndAttrName:''
      };
    },
    methods: {
      // 删除图片
      handleRemove(file, fileList) {
        console.log(file, fileList);
        // 收集照片墙图片数据
        this.spuImageList = fileList
      },
      // 预览图片
      handlePictureCardPreview(file) {
        // 赋值给data
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      // 初始化form数据 显示初始数据
      async initSpuData(spu){
        // 获取spu信息属性
        let spuResult = await this.$API.spu.reqSpu(spu.id)
        if (spuResult.code==200) {
            this.spu = spuResult.data
        }
        // 获取品牌信息属性
        let tradeMarkResult = await this.$API.spu.reqTradeMarkList()
        if (tradeMarkResult.code==200) {
            this.tradeMarkList = tradeMarkResult.data
        }
        // 获取spu图片
        let spuImageResult = await this.$API.spu.reqSpuImageList(spu.id)
        if (spuImageResult.code==200) {
            let listAttr = spuImageResult.data
            listAttr.forEach(item => {
              item.name = item.imgName;
              item.url = item.imgUrl
            });
            this.spuImageList = listAttr
        }
        // 获取平台全部属性
        let saleResult = await this.$API.spu.reqBaseSaleAttrList()
        if (saleResult.code==200) {
            this.saleAttrList = saleResult.data
        }
      },
      handlerSuccess(response,file,fileList){
        console.log(response,file,fileList);
        this.spuImageList = fileList
        console.log(this.spuImageList);
      },
      // 添加销售属性按钮事件
      addSaleAttr(){
        const [baseSaleAttrId,saleAttrName] = this.attrIdAndAttrName.split(':') 
        let newSaleAttr = {baseSaleAttrId,saleAttrName,spuSaleAttrValueList:[]}
        this.spu.spuSaleAttrList.push(newSaleAttr)
        console.log(this.spu.spuSaleAttrList);
        this.attrIdAndAttrName = '';
      },
      // 属性值添加按钮
      addSaleAttrValue(row){
        // 控制标签/输入框的显示与隐藏
        this.$set(row,'inputVisible',true)
        // 通过inputvalue手机新增的销售
        this.$set(row,'inputValue','')
      },
      // 标签输入框失去焦点事件
      handleInputConfirm(row){
        // 解构
        const {baseSaleAttrId,inputValue} = row;
        // 属性中不能为空
        if (inputValue.trim()=='') {
          this.$message('属性值不能为空');
          return
        }
        // 判断是否重复，否则弹出提示
        let result = row.spuSaleAttrValueList.every(item=>item.saleAttrValueName!=inputValue);
        if(!result) return;
        // 新增属性值存储到newSaleAttrValue
        let newSaleAttrValue = {baseSaleAttrId,saleAttrValueName:inputValue}
        // push到list里
        row.spuSaleAttrValueList.push(newSaleAttrValue)
        // 控制按钮或标签的显示与隐藏
        row.inputVisible = false
      },
      // 保存按钮事件
      async addOrUpdateSpu(){
        // 整理参数
        // console.log(this.spu.spuImageList);
        this.spu.spuImageList = this.spuImageList.map((item)=>{
          return {
            imgName: item.name,
            imgUrl: (item.response && item.response.data) || item.url
          };
        });
        // console.log(this.spu.spuImageList);
        let result = await this.$API.spu.reqAddOrUpdateSpu(this.spu)
        // console.log(result);
        if (result.code == 200) {
          // console.log(11111);
          this.$message({type:'success',message:'保存成功'})
          this.$emit('changeScene',{scene:0,flag:this.spu.id?'修改':'添加'})
        }
        // 清除数据
        Object.assign(this._data,this.$options.data())
      },
      // 添加
      async addSpuData(category3Id){
        this.spu.category3Id = category3Id
        // 获取品牌信息属性
        let tradeMarkResult = await this.$API.spu.reqTradeMarkList()
        if (tradeMarkResult.code==200) {
            this.tradeMarkList = tradeMarkResult.data
        }
        // 获取平台全部属性
        let saleResult = await this.$API.spu.reqBaseSaleAttrList()
        if (saleResult.code==200) {
            this.saleAttrList = saleResult.data
        }
      },
      // 取消按钮
      cancel(){
        this.$emit('changeScene',{scene:0,flag:''})
        // 清除数据
        Object.assign(this._data,this.$options.data())
      }
    },
    computed:{
      unSelectSaleAttr(){
        let result = this.saleAttrList.filter(item=>{
          return this.spu.spuSaleAttrList.every(item1=>{
            return item.name!=item1.saleAttrName
          })
        })
        return result
      }
    }
  }

</script>

<style>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>