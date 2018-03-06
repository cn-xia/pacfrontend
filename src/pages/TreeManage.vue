<template>
  <div>
    <div class="treemng-main">
      <el-row :gutter="10">
        <el-col :span="4">
          <el-row>
            <div class="table-heading">
              <span>特征树库</span>
            </div>
          </el-row>
          <el-row>
            <div class="table-searchbox">
              <el-input
                placeholder="搜索"
                prefix-icon="el-icon-search"
                size="mini"
                v-model="searchTree">
              </el-input>
            </div>
          </el-row>
          <el-row>
            <el-table
              ref="treeList"
              :show-header = false
              :data="treeListData"
              style="width:100%"
              height="435px"
              border
              size="medium"
              highlight-current-row
              @current-change="handleCurrentChange">
              <!-- <el-table-column
                type="index"
                align="center"
                width="50">
              </el-table-column> -->
              <el-table-column
                prop="name"
                label="特征树"
                align="center">
              </el-table-column>
            </el-table>
          </el-row>
          <el-row>
            <div class="treemng-table-btn">
              <el-button type="primary" size="small">删除</el-button>
              <el-button type="primary" size="small">添加</el-button>
            </div>
          </el-row>
        </el-col>
        <el-col :span="20">
          <TreeGenerate></TreeGenerate>
        </el-col>
      </el-row>
    </div>
  </div>   
</template>

<script>
import TreeGenerate from '../components/TreeGenerate.vue';
export default {
  data(){
    return {
      currentRow: null,
      searchTree:'',
      treeListData:[{
        name:"商家实体树"
      },{
        name:"商品实体树"
      },{
        name:"订单实体树"
      }]
    }
  },
  components:{
    TreeGenerate
  },
  methods:{
    initTable(){
      this.$refs.treeList.setCurrentRow(this.treeListData[0]);
    },
    handleCurrentChange(val){
      this.currentRow=val;
      //console.log(this.currentRow);
    }
  },
  mounted(){
    this.initTable();
  }
}
</script>

<style>

</style>
