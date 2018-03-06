<template>
  <div>
    <el-row :gutter="5">
      <el-col :span="19">
        <el-row>
          <div id="myDiagramDiv" class="treegete-diagram">
          </div>
        </el-row>
        <el-row>
          <div class="treegete-diagram-btn">
              <el-button type="primary" size="small">保存</el-button>
          </div>
        </el-row>
      </el-col>
      <el-col :span="5">
        <el-row>
          <div id = "myInspectorDiv" class="treegete-inspector">
            <el-form style="margin:10px;" ref= "form" :model="form" label-position="left" label-width="70px" size="mini">
              <el-form-item label="key" key="key">
                <el-input v-model="form.key"></el-input>
              </el-form-item>
              <el-form-item label="name" key="name">
                <el-input v-model="form.name"></el-input>
              </el-form-item>
              <el-form-item label="Optional" key="Optional">
                <el-radio-group v-model="form.optional">
                  <el-radio label="true"></el-radio>
                  <el-radio label="false"></el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item
                v-for="(attri,index) in form.attris"
                :label="attri.label"
                :key="attri.label"
                :prop="'attris.'+index+'.value'">
                <el-col :span="21">
                  <el-input v-model="attri.value"></el-input>
                </el-col>
                <el-col :span="2" :offset="1">
                  <i class="el-icon-delete"  @click.prevent="removeAttri(attri)" style="cursor:pointer;"></i> 
                </el-col>
              </el-form-item>
                    <!-- <el-form-item>
                    <el-button size="small" type="primary" icon="plus" @click="dialogFormVisible = true">新增</el-button>
                    </el-form-item> -->
            </el-form>
          </div>
        </el-row>
        <el-row>
          <div class="treegete-inspector-btn">
            <el-button size="small" type="primary" icon="plus" @click="dialogFormVisible = true">新增</el-button>
          </div>
        </el-row>
      </el-col>    
    </el-row>
    <el-dialog title="新增属性" :visible.sync="dialogFormVisible" width="25%">
        <span>
            <el-form :model="addAttriForm" label-width="70px" size="small"> 
                <el-form-item label="属性名">
                    <el-input v-model="addAttriForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="初始值" placeholder="可为空">
                    <el-input v-model="addAttriForm.value" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
        </span>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false" size="small">取 消</el-button>
            <el-button type="primary" @click="addAttri('addAttriForm')" size="small">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>

import treedata from '../assets/data/treedata.json'

var myDiagram;
var ggom;

export default {
  name:'TreeGenerate',
  data(){
      return{
        dialogFormVisible:false,
        form:{
          name:'',
          key:'',
          optional:'',
          attris:[]
        },
        addAttriForm:{
            name:"",
            value:""
        }
      }
  },
  methods:{
    init(){
        ggom = go.GraphObject.make;
        myDiagram =
            ggom(go.Diagram, "myDiagramDiv",
            {
                allowCopy: false,
                initialContentAlignment: go.Spot.Center,
                layout:
                ggom(go.LayeredDigraphLayout,
                    {
                    setsPortSpots: false,  // Links already know their fromSpot and toSpot
                    direction: 90,
                    columnSpacing: 5,
                    isInitial: true,
                    isOngoing: true
                    }),
                validCycle: go.Diagram.CycleNotDirected,
                "undoManager.isEnabled": true
            });
        myDiagram.addDiagramListener("Modified", function(e) {
            var button = document.getElementById("SaveButton");
            if (button) button.disabled = !myDiagram.isModified;
            var idx = document.title.indexOf("*");
            if (myDiagram.isModified) {
            if (idx < 0) document.title += "*";
            } else {
            if (idx >= 0) document.title = document.title.substr(0, idx);
            }
        });
        var graygrad = ggom(go.Brush, "Linear",
                    { 0: "white", 0.1: "whitesmoke", 0.9: "whitesmoke", 1: "lightgray" });
        myDiagram.nodeTemplate =  // the default node template
            ggom(go.Node, "Spot",
            { selectionAdorned: false, textEditable: true, locationObjectName: "BODY" },
            new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
            // the main body consists of a Rectangle surrounding the text
            ggom(go.Panel, "Auto",
                { name: "BODY" },
                ggom(go.Shape, "Rectangle",
                { fill: graygrad, stroke: "gray", minSize: new go.Size(110, 35) },
                new go.Binding("fill", "isSelected", function(s) { return s ? "AliceBlue" : graygrad; }).ofObject()),
                ggom(go.TextBlock,
                { stroke: "black", font: "13px sans-serif", editable: true,
                    margin: new go.Margin(3, 3+4, 3, 3+4), alignment: go.Spot.Center },
                new go.Binding("text").makeTwoWay())
            ),
            // output port
            ggom(go.Panel, "Auto",
                { alignment: go.Spot.Bottom, portId: "from", fromLinkable: true, cursor: "pointer", click: addNodeAndLink },
                ggom(go.Shape, "Circle",
                { width: 18, height: 18, fill: "white", stroke: "#424f63", strokeWidth: 3 }),
                ggom(go.Shape, "PlusLine",
                { width: 11, height: 11, fill: null, stroke: "#424f63", strokeWidth: 3 })
            ),
            // input port
            ggom(go.Panel, "Auto",
                { alignment: go.Spot.Top, portId: "to", toLinkable: true ,cursor: "pointer"},
                ggom(go.Shape, "Circle",
                { width: 8, height: 8, fill: "white", stroke: "gray" }),
                ggom(go.Shape, "Circle",
                { width: 4, height: 4, fill: "#424f63", stroke: null })
            )
            );
        myDiagram.nodeTemplate.contextMenu =
            ggom(go.Adornment, "Vertical",
            ggom("ContextMenuButton",
                ggom(go.TextBlock, "Rename"),
                { click: function(e, obj) { e.diagram.commandHandler.editTextBlock(); } },
                new go.Binding("visible", "", function(o) { return o.diagram && o.diagram.commandHandler.canEditTextBlock(); }).ofObject()),
            // add one for Editing...
            ggom("ContextMenuButton",
                ggom(go.TextBlock, "Delete"),
                { click: function(e, obj) { e.diagram.commandHandler.deleteSelection(); } },
                new go.Binding("visible", "", function(o) { return o.diagram && o.diagram.commandHandler.canDeleteSelection(); }).ofObject())
            );
        
        myDiagram.nodeTemplateMap.add("Loading",
            ggom(go.Node, "Spot",
            { selectionAdorned: false, textEditable: true, locationObjectName: "BODY" },
            new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
            // the main body consists of a Rectangle surrounding the text
            ggom(go.Panel, "Auto",
                { name: "BODY" },
                ggom(go.Shape, "Rectangle",
                { fill: graygrad, stroke: "gray", minSize: new go.Size(110, 35) },
                new go.Binding("fill", "isSelected", function(s) { return s ? "AliceBlue" : graygrad; }).ofObject()),
                ggom(go.TextBlock,
                { stroke: "black", font: "13px sans-serif", editable: true,
                    margin: new go.Margin(3, 3+4, 3, 3+4), alignment: go.Spot.Center },
                new go.Binding("text", "text"))
            ),
            // output port
            ggom(go.Panel, "Auto",
                { alignment: go.Spot.Bottom, portId: "from", fromLinkable: true, click: addNodeAndLink },
                ggom(go.Shape, "Circle",
                { width: 18, height: 18, fill: "white", stroke: "#424f63", strokeWidth: 3 }),
                ggom(go.Shape, "PlusLine",
                { width: 11, height: 11, fill: null, stroke: "#424f63", strokeWidth: 3 })
            )
            ));

        myDiagram.nodeTemplateMap.add("Recycle",
            ggom(go.Node, "Auto",
            { portId: "to", toLinkable: true, deletable: false,
                layerName: "Background", locationSpot: go.Spot.Center },
            new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
            { dragComputation: function(node, pt, gridpt) { return pt; } },
            { mouseDrop: function(e, obj) { myDiagram.commandHandler.deleteSelection(); } },
            ggom(go.Shape,
                { fill: "lightgray", stroke: "gray" ,figure:"Database",width:60}),
            ggom(go.TextBlock, "回收站",
                { margin: 5, textAlign: "center"})
            ));
        
        function addNodeAndLink(e, obj) {
            var fromNode = obj.part;
            var diagram = fromNode.diagram;
            diagram.startTransaction("Add State");
            // get the node data for which the user clicked the button
            var fromData = fromNode.data;
            // create a new "State" data object, positioned off to the right of the fromNode
            var p = fromNode.location.copy();
            p.x += diagram.toolManager.draggingTool.gridSnapCellSize.width;
            var toData = {
            text: "new",
            loc: go.Point.stringify(p)
            };
            // add the new node data to the model
            var model = diagram.model;
            model.addNodeData(toData);
            // create a link data from the old node data to the new node data
            var linkdata = {
            from: model.getKeyForNodeData(fromData),
            to: model.getKeyForNodeData(toData)
            };
            // and add the link data to the model
            model.addLinkData(linkdata);
            // select the new Node
            var newnode = diagram.findNodeForData(toData);
            diagram.select(newnode);
            // snap the new node to a valid location
            newnode.location = diagram.toolManager.draggingTool.computeMove(newnode, p);
            // then account for any overlap
            shiftNodesToEmptySpaces();
            diagram.commitTransaction("Add State");
        }

        function changeFeature(e,obj){
            var featText = obj.findObject("FEAT");
            if(featText.text == "B"){
                featText.text = "C"
            }else{
                featText.text = "B";
            }
        }

        var OldTarget = null;  // remember the last highlit port
        function highlight(port) {
            if (OldTarget !== port) {
            lowlight();  // remove highlight from any old port
            OldTarget = port;
            port.scale = 1.0;  // highlight by enlarging
            }
        }
        function lowlight() {  // remove any highlight
            if (OldTarget) {
            OldTarget.scale = 1.0;
            OldTarget = null;
            }
        }

        myDiagram.addDiagramListener("LinkDrawn", function(e) {
            var link = e.subject;
            if (link.toNode.category === "Recycle") myDiagram.remove(link);
            lowlight();
        });

        myDiagram.addDiagramListener("LinkRelinked", function(e) {
            var link = e.subject;
            if (link.toNode.category === "Recycle") myDiagram.remove(link);
            lowlight();
        });

        myDiagram.linkTemplate =
            ggom(go.Link,
            { selectionAdorned: false, fromPortId: "from", toPortId: "to", relinkableTo: true },
            ggom(go.Shape,
                { stroke: "gray", strokeWidth: 2 },
                { mouseEnter: function(e, obj) { obj.strokeWidth = 3; obj.stroke = "dodgerblue"; },
                mouseLeave: function(e, obj) { obj.strokeWidth = 2; obj.stroke = "gray"; } }),
            /* ggom(go.Panel, "Auto",
                { _isLinkLabel: true,click: changeFeature},  // marks this Panel as being a draggable label
                ggom(go.Shape, "RoundedRectangle",{ fill: "lightblue" ,stroke:null,cursor: "pointer",width:20},
                    { mouseEnter: function(e, obj) { obj.strokeWidth = 2; obj.stroke = "white"; },
                    mouseLeave: function(e, obj) { obj.stroke =null; } }),
                ggom(go.TextBlock, "B", { margin: 0 ,font: "bold 10pt sans-serif",stroke: "red",name:"FEAT"})) */
            );
        
        function commonLinkingToolInit(tool) {
            // the temporary link drawn during a link drawing operation (LinkingTool) is thick and blue
            tool.temporaryLink =
                ggom(go.Link, { layerName: "Tool" },
                ggom(go.Shape, { stroke: "dodgerblue", strokeWidth: 4 }));

            // change the standard proposed ports feedback from blue rectangles to transparent circles
            tool.temporaryFromPort.figure = "Circle";
            tool.temporaryFromPort.stroke = null;
            tool.temporaryFromPort.strokeWidth = 0;
            tool.temporaryToPort.figure = "Circle";
            tool.temporaryToPort.stroke = null;
            tool.temporaryToPort.strokeWidth = 0;

            // provide customized visual feedback as ports are targeted or not
            tool.portTargeted = function(realnode, realport, tempnode, tempport, toend) {
            if (realport === null) {  // no valid port nearby
                lowlight();
            } else if (toend) {
                highlight(realport);
            }
            };
        }

        var ltool = myDiagram.toolManager.linkingTool;
        commonLinkingToolInit(ltool);
        // do not allow links to be drawn starting at the "to" port
        ltool.direction = go.LinkingTool.ForwardsOnly;

        var rtool = myDiagram.toolManager.relinkingTool;
        commonLinkingToolInit(rtool);
        // change the standard relink handle to be a shape that takes the shape of the link
        rtool.toHandleArchetype =
            ggom(go.Shape,
            { isPanelMain: true, fill: null, stroke: "dodgerblue", strokeWidth: 4 });

        // use a special DraggingTool to cause the dragging of a Link to start relinking it
        // myDiagram.toolManager.draggingTool = new DragLinkingTool();

        function DragLinkingTool() {
            go.DraggingTool.call(this);
            this.isGridSnapEnabled = true;                         /*=====problem=======*/
            this.isGridSnapRealtime = false;
            this.gridSnapCellSize = new go.Size(182, 1);
            this.gridSnapOrigin = new go.Point(5.5, 0);
        }
        go.Diagram.inherit(DragLinkingTool, go.DraggingTool);
        /** @override */
        DragLinkingTool.prototype.doActivate = function() {
            var diagram = this.diagram;
            if (diagram === null) return;
            this.standardMouseSelect();
            var main = this.currentPart;  // this is set by the standardMouseSelect
            if (main instanceof go.Link) { // maybe start relinking instead of dragging
                var relinkingtool = diagram.toolManager.relinkingTool;
                // tell the RelinkingTool to work on this Link, not what is under the mouse
                relinkingtool.originalLink = main;
                // start the RelinkingTool
                diagram.currentTool = relinkingtool;
                // can activate it right now, because it already has the originalLink to reconnect
                relinkingtool.doActivate();
                relinkingtool.doMouseMove();
            } else {
                go.DraggingTool.prototype.doActivate.call(this);
            }
        };
        // end DragLinkingTool

        // detect when dropped onto an occupied cell
        myDiagram.addDiagramListener("SelectionMoved", shiftNodesToEmptySpaces);

        function shiftNodesToEmptySpaces() {
            myDiagram.selection.each(function(node) {
            if (!(node instanceof go.Node)) return;
            // look for Parts overlapping the node
            while (true) {
                var exist = myDiagram.findObjectsIn(node.actualBounds,
                // only consider Parts
                function(obj) { return obj.part; },
                // ignore Links and the dropped node itself
                function(part) { return part instanceof go.Node && part !== node; },
                // check for any overlap, not complete containment
                true).first();
                if (exist === null) break;
                // try shifting down beyond the existing node to see if there's empty space
                node.position = new go.Point(node.actualBounds.x, exist.actualBounds.bottom+10);
            }
            });
        }

        

        myDiagram.addDiagramListener("LayoutCompleted", function(e) {
            myDiagram.nodes.each(function(node) {
            if (node.category === "Recycle") return;
            node.minLocation = new go.Point(node.location.x, -Infinity);
            });
        }); 
        

        /* inspector = new Inspector('myInspectorDiv',myDiagram,{
            properties:{
                "text":{},
                "loc":{show:false},
                "category":{show:false},
                
            }

        }); */

        this.load();
        this.layout();
        myDiagram.select(myDiagram.nodes.first());
    },
    load(){
        //console.log(treedata.nodeDataArray)
        var model = ggom(go.GraphLinksModel);
        
        var copydata=Array.from(treedata.nodeDataArray);  //浅拷贝

        copydata.push({"key":-2, "category": "Recycle"});
        model.nodeDataArray = [];
        
        //treedata.nodeDataArray.push()
        model.nodeDataArray=copydata;
        
        //
        /* [
            { "key":1, "text":"Loading Screen", "category":"Loading" },
            
            { "key":-2, "category": "Recycle" }
        ]; */
        
        model.linkDataArray= treedata.linkDataArray;
        /*  [
            
        ]; */
        myDiagram.model = model;
    },
    layout(){
        myDiagram.layoutDiagram(true);
    },
    removeAttri(item){
        var index = this.form.attris.indexOf(item);
        if(index!==-1){
            this.form.attris.splice(index,1);
        }
    },
    addAttri(formName){
        this.dialogFormVisible = false;
        var label = this.addAttriForm.name;
        var value = this.addAttriForm.value;
        this.form.attris.push({value:value,label:label});
        this.addAttriForm.name = "";
        this.addAttriForm.value = "";
    }
  },
  mounted(){
      this.init();
  }
}
</script>

<style>

</style>
