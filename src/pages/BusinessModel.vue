<template>
  <div class="busmo-main">
    <el-row>
        <el-col :span="2">
            <div class="busmo-step-bar">
                <el-steps direction="vertical" :active=activeStep process-status="finish">
                    <el-step title="特征树裁剪" @click.native="changeRoute(0)"></el-step>
                    <el-step title="基模型构建" @click.native="changeRoute(1)"></el-step>
                    <el-step title="元模型构建" @click.native="changeRoute(2)"></el-step>
                </el-steps>
            </div>
        </el-col>
        <el-col :span="22">
            <div class="busmo-content">
                <router-view></router-view>
            </div>
        </el-col>
    </el-row>
  </div>    
</template>

<script>
export default {
    data(){
        return{
            activeStep:0,
        }
    },
    watch:{
        "$route":"getPath"
    },
    methods:{
        changeRoute(val){
            this.activeStep=val;
            if(val==0){
                this.$router.push("/businessmodel/treecut");
            }
            if(val==1){
                this.$router.push("/businessmodel/basicmodel");
            }
            if(val==2){
                this.$router.push("/businessmodel/metamodel");
            }
        },
        getPath(){
            let path = this.$route.path;
            if(path=='/businessmodel/treecut'){
                this.activeStep=0;
            }
            if(path=='/businessmodel/basicmodel'){
                this.activeStep=1;
            }
            if(path=='/businessmodel/metamodel'){
                this.activeStep=2;
            }
        }
    },
    mounted(){
        this.getPath();
    } 
}
</script>

<style>
.el-step__head:hover{
    cursor: pointer;
}
.el-step__title:hover{
    cursor: pointer;
}

</style>
