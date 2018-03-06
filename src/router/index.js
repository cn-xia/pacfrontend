import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import TreeManage from '@/pages/TreeManage'
import RuleManage from '@/pages/RuleManage'
import ChoseProject from '@/pages/ChoseProject'

import BusinessModel from '@/pages/BusinessModel'
import TreeCut from '@/pages/businessmodel/TreeCut'
import MakeChildTree from '@/pages/businessmodel/MakeChildTree'
import MetaModel from '@/pages/businessmodel/MetaModel'
import BasicModel from '@/pages/businessmodel/BasicModel'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect:'/treemanage'
    },
    {
      path: '/treemanage',
      name: 'treemanage',
      component: TreeManage
    },
    {
      path: '/rulemanage',
      name: 'rulemanage',
      component: RuleManage
    },
    {
      path: '/choseproject',
      name: 'choseproject',
      component: ChoseProject
    },
    {
      path:'/businessmodel',
      name:'businessmodel',
      component:BusinessModel,
      children:[
        {
          path:'treecut',
          component:TreeCut
        },
        {
          path:'metamodel',
          component:MetaModel
        },
        {
          path:'basicmodel',
          component:BasicModel
        },
        {
          path:'makechildtree',
          component:MakeChildTree
        }
      ]
    }
  ]
})
