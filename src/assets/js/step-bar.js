function changeTopStep(path){
    if(path=='/treemanage'){
        document.getElementById('ruleimg').src = "static/image/step2.png";
        document.getElementById('projectimg').src = "static/image/step3.png";
        document.getElementById('modelimg').src = "static/image/step4.png";
        document.getElementById('treeimg').src = "static/image/step11.png";
    }
    if(path=='/rulemanage'){
        document.getElementById('projectimg').src = "static/image/step3.png";
        document.getElementById('modelimg').src = "static/image/step4.png";
        document.getElementById('treeimg').src = "static/image/step11.png";
        document.getElementById('ruleimg').src = "static/image/step22.png";
    }
    if(path=='/choseproject'){
        document.getElementById('modelimg').src = "static/image/step4.png";
        document.getElementById('treeimg').src = "static/image/step11.png";
        document.getElementById('ruleimg').src = "static/image/step22.png";
        document.getElementById('projectimg').src = "static/image/step33.png";
    }
    if(path.indexOf('/businessmodel')>=0){
        document.getElementById('treeimg').src = "static/image/step11.png";
        document.getElementById('ruleimg').src = "static/image/step22.png";
        document.getElementById('projectimg').src = "static/image/step33.png";
        document.getElementById('modelimg').src = "static/image/step44.png";
    }
}

export{changeTopStep}