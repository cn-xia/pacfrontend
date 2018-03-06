<template>
    <div class="treecut-item-box" @click="toMakeChildTree()">
      <h1>ChildTree</h1>
    </div>
</template>

<script>
export default {
    name:"",
    data(){
        return{

        }
    },
    methods:{
        toMakeChildTree(){
            this.$router.push({path: 'makechildtree',query:{ftree:'fathertree',ctree:'childtree'}});
        }
    }

}
</script>

<style>

</style>
