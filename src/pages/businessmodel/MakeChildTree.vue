<template>
  <div style="padding:15px 15px;">
    <el-row>
        <el-col :span="15">
        <div class="breadcrumb">
            <span>构造子树 / {{ftreeName}} / {{ctreeName}} </span>
        </div>
        </el-col>
        <el-col :span="9">
        <div class="makectree-top-btn">
            <el-button type="primary" plain size="small" icon="el-icon-back" @click="returnPages()">返回</el-button>
        </div>
        </el-col>
    </el-row>
    <el-row>
        <tree-finished></tree-finished>
    </el-row>
    <el-row>
        <div class="makectree-bottom-btn">
            <el-button type="primary" size="small" style="margin-right:50px;">另存为</el-button>
            <el-button type="primary" size="small">保存</el-button>
        </div>
    </el-row>
  </div>
</template>

<script>
import TreeFinished from '../../components/TreeFinished.vue'
export default {
    data(){
        return{
            ftreeName:'',
            ctreeName:'',
        }
    },
    components:{
        TreeFinished,
    },
    methods:{
        returnPages(){
            this.$router.push('treecut');
        }
    },
    mounted:function(){
        this.ftreeName = this.$route.query.ftree;
        this.ctreeName = this.$route.query.ctree;
    }
}
</script>

<style>

</style>
