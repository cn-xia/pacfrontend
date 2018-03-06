<template>
  <div style="padding:15px 15px;">
    <el-row>
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
        <el-row style="border:1px solid #f0f0f0">
          <el-table
            ref="treeList"
            :show-header = false
            :data="treeListData"
            style="width:100%"
            height="440px"
            size="medium"
            highlight-current-row
            @current-change="handleCurrentChange"
            @selection-change="handleSelectionChange"
            >
            <el-table-column
              type="selection"
              width="35">
            </el-table-column>
            <el-table-column
              prop="name"
              label="特征树"
              align="center"
              show-overflow-tooltip>
            </el-table-column>
          </el-table>
        </el-row>
      </el-col>
      <el-col :span="20">
        <div class="treecut-content">
          <div class = "treecut-childtree-header">
            <i class="treecut-childtree-icon-title"></i>
            <span>构造子树</span>
            <!-- <span v-if="pageflag==1">已选子树</span> -->
          </div>
          <div>
            <el-row>
              <el-col :span=6>
                <div class="treecut-item-box treecut-item-box-new">
                  <div class="treecut-item-box-new-img"></div>
                  <p>新建子树</p>
                </div>
              </el-col>
              <component :is="cardComp"  v-for="card in ctreeCards" :key=card.key></component>
            </el-row>
          </div>
        </div>
      </el-col>
    </el-row>
    
  </div>
  
</template>

<script>
import ChildTreeCard from '../../components/ChildTreeCard.vue'
export default {
  data(){
    return{
      cardComp:ChildTreeCard,
      ctreeCards:[{
        key:1
      }],
      currentRow: null,
      searchTree:'',
      treeListData:[{
        name:"商家实体树"
      },{
        name:"商品实体树"
      },{
        name:"订单实体树"
      }],
      mutipleSelection:[]
    }
  },
  components:{
    ChildTreeCard,
  },
  methods:{
    initTable(){
      this.$refs.treeList.setCurrentRow(this.treeListData[0]);
    },
    handleCurrentChange(val){
      this.currentRow=val;
      //console.log(this.currentRow);
    },
    handleSelectionChange(val){
      this.mutipleSelection = val;
      console.log(this.mutipleSelection);
    }
  },
  mounted(){
    console.log("refresh");
    this.initTable();
  }
}
</script>

<style>

</style>
