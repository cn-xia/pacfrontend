<template>
  <div class="top-step-bar">
      <div class="top-step-box" @click="changeRoute(1)" style="margin-left:80px;"> 
        <img id="treeimg" class="top-step-img" src="static/image/step1.png">
        <span class="top-step-text">特征树管理</span>
      </div>
      <div class="top-step-line"></div>
      <div class="top-step-box" @click="changeRoute(2)">
        <img id="ruleimg" class="top-step-img" src="static/image/step2.png">
        <span class="top-step-text">规则库管理</span>
      </div>
      <div class="top-step-line"></div>
      <div class="top-step-box" @click="changeRoute(3)">
        <img id="projectimg" class="top-step-img" src="static/image/step3.png">
        <span class="top-step-text">选择项目</span>
      </div>
      <div class="top-step-line"></div>
      <div class="top-step-box" @click="changeRoute(4)">
        <img id="modelimg" class="top-step-img" src="static/image/step4.png">
        <span class="top-step-text">业务建模</span>
      </div>
  </div>
</template>

<script>
import {changeTopStep} from '../assets/js/step-bar.js'

export default {
    name:'TopStepBar',
    watch:{
        "$route":"getPath"
    },
    methods:{
        changeRoute(val){
            if(val==1){
                this.$router.push("/treemanage");
            }
            if(val==2){
                this.$router.push("/rulemanage");
            }
            if(val==3){
                this.$router.push("/choseproject");
            }
            if(val==4){
                this.$router.push("/businessmodel/treecut")
            }
            
        },
        getPath(){    //后期需要单写成公共函数文件，各界面初始化时使用
            let path = this.$route.path;
            //console.log(path);
            changeTopStep(path);
        }
        
    },
    mounted(){
        this.getPath();
    }    
}
</script>

<style>

</style>
