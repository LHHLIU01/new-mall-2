<template>
  <div>
    <el-card style="margin: 20px 0px">
      <CategorySelect @getCategoryId="getCategoryId" :show="!isShowTable"></CategorySelect>
    </el-card>
    <el-card>
      <div v-show="isShowTable">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="addAttr"
          >添加属性
        </el-button>
        <!-- 表格,展示平台属性 -->
        <el-table style="width: 100%" border :data="attrList">
          <el-table-column type="index" align="center" label="序号" width="80">
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="150">
          </el-table-column>
          <el-table-column prop="prop" label="属性列表" width="width">
            <template slot-scope="{ row, $index }">
              <el-tag
                type="success"
                v-for="(attrValue, index) in row.attrValueList"
                :key="attrValue.id"
                style="margin: 5px 10px"
                >{{ attrValue.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150">
            <template slot-scope="{ row, $index }">
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                @click="updateArrt(row)"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--添加属性 -->
      <div v-show="!isShowTable">
        <el-form ref="form" :inline="true" label-width="80px" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input
              placeholder="请输入属性名"
              v-model="attrInfo.attrName"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addAttrValue"
          :disabled="!attrInfo.attrName"
          >添加属性值</el-button
        >
        <el-button @click="isShowTable = true">取消</el-button>
        <el-table
          style="width: 100%; margin: 10px 0"
          border
          :data="attrInfo.attrValueList"
        >
          <el-table-column
            prop="prop"
            align="center"
            type="index"
            label="序号"
            width="80"
          >
          </el-table-column>
          <el-table-column prop="prop" label="属性值名称" width="width">
            <template slot-scope="{ row, $index }">
              <el-input
                v-model="row.valueName"
                size="mini"
                placeholder="请输入属性名称"
                v-if="row.flag"
                @blur="toLook(row)"
                @keyup.native.enter="toLook(row)"
                :ref="$index"
              ></el-input>
              <span
                v-else
                @click="toEdit(row, $index)"
                style="display: block"
                >{{ row.valueName }}</span
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <el-popconfirm :title="`确定删除吗？${row.valueName}`" @onConfirm='deteleAttrValue($index)'>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  slot="reference"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="addOrUpdateAttr" :disabled="attrInfo.attrValueList.length<1">保存</el-button>
        <el-button @click="isShowTable = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "Attr",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      attrList: [],
      isShowTable: true,
      // 手机新增属性
      attrInfo: {
        attrName: "", //属性名
        attrValueList: [
          //属性值
          // {
          //   attrId:0,
          //   valueName:'string'
          // }
        ],
        categoryId: 0, //三级分类id
        categoryLevel: 3, //
      },
    };
  },
  methods: {
    // 自定义事件回调
    getCategoryId({ categoryId, level }) {
      // 区分三级分类相应的id,以及父组件进行存储
      // console.log(categoryId);
      if (level == 1) {
        this.category1Id = categoryId;
        this.category2Id = "";
        this.category3Id = "";
      } else if (level == 2) {
        this.category2Id = categoryId;
        this.category3Id = "";
      } else {
        // 代表三级分类的id有了
        this.category3Id = categoryId;
        this.getAttrList();
      }
    },
    async getAttrList() {
      const { category1Id, category2Id, category3Id } = this;
      let result = await this.$API.attr.reqAttrList(
        category1Id,
        category2Id,
        category3Id
      );
      console.log(result);
      if (result.code == 200) {
        this.attrList = result.data;
      }
    },
    addAttrValue() {
      //添加属性值回调
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id,
        valueName: "",
        flag: true,
      });
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus();
      });
    },
    addAttr() {
      //添加属性按钮
      this.isShowTable = false;
      this.attrInfo = {
        attrName: "", //属性名
        attrValueList: [],
        categoryId: this.category3Id, //三级分类id
        categoryLevel: 3, //
      };
    },
    updateArrt(row) {
      //修改某个属性
      this.isShowTable = false;
      // 将选中的数据赋值给arrtinfo
      this.attrInfo = cloneDeep(row);
      this.attrInfo.attrValueList.forEach((item) => {
        this.$set(item, "flag", false);
      });
    },
    toLook(row) { //切换为编辑模式
      if (row.valueName.trim() == "") {
        this.$message("请你输入一个正常的属性值");
        return;
      }
      let isRepat = this.attrInfo.attrValueList.some((item) => {
        if (row !== item) {
          return row.valueName == item.valueName;
        }
      });
      if (isRepat) return;
      row.flag = false;
    },
    toEdit(row, index) {
      //点击span
      row.flag = true;
      this.$nextTick(() => {
        this.$refs[index].focus();
      });
    },
    deteleAttrValue(index){//气泡确认框
      this.attrInfo.attrValueList.splice(index,1)
    },
    async addOrUpdateAttr(){
      // 整理参数：属性为空不提交，flag不提交
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(item=>{
        if (item.valueName!='') {
          delete item.flag
          return true
        }
      })
      console.log(this.attrInfo);
      try {
       await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo)
       this.isShowTable = true;
       this.$message({type:'success',message:'保存成功'});
       this.getAttrList();
      } catch (error) {
        
      }
    }
  },
};
</script>

<style>
</style>