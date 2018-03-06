<template>
  <div id = "myDiagramDiv" class="treefini-diagram">
  </div>
</template>

<script>
import go from "gojs"
import treedata from '../assets/data/treedata.json'
var myDiagram;
export default {
    name:"TreeFinished",
    data(){
        return{

        }
    },
    methods:{
        init(){
            var ggom = go.GraphObject.make;
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
            /* myDiagram.addDiagramListener("Modified", function(e) {
                var button = document.getElementById("SaveButton");
                if (button) button.disabled = !myDiagram.isModified;
                var idx = document.title.indexOf("*");
                if (myDiagram.isModified) {
                if (idx < 0) document.title += "*";
                } else {
                if (idx >= 0) document.title = document.title.substr(0, idx);
                }
            }); */
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
                    /* ggom(go.Shape, "Circle",
                    { width: 18, height: 18, fill: "white", stroke: "dodgerblue", strokeWidth: 3 }),
                    ggom(go.Shape, "PlusLine",
                    { width: 11, height: 11, fill: null, stroke: "dodgerblue", strokeWidth: 3 }) */
                ),
                // input port
                ggom(go.Panel, "Auto",
                    { alignment: go.Spot.Top, portId: "to", toLinkable: true ,cursor: "pointer"},
                    ggom(go.Shape, "Circle",
                    { width: 8, height: 8, fill: "white", stroke: "gray" }),
                    ggom(go.Shape, "Circle",
                    { width: 4, height: 4, fill: "dodgerblue", stroke: null })
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
                    /* ggom(go.Shape, "Circle",
                    { width: 18, height: 18, fill: "white", stroke: "dodgerblue", strokeWidth: 3 }),
                    ggom(go.Shape, "PlusLine",
                    { width: 11, height: 11, fill: null, stroke: "dodgerblue", strokeWidth: 3 }) */
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

            this.load();
            this.layout();
        },
        load(){
            var ggom = go.GraphObject.make;
            var model = ggom(go.GraphLinksModel);

            var copydata=Array.from(treedata.nodeDataArray);  //浅拷贝
            copydata.push({"key":-2, "category": "Recycle"});

            model.nodeDataArray=copydata;
            /* [
                { "key":1, "text":"Loading Screen", "category":"Loading" },
                
                { "key":-2, "category": "Recycle" }
            ]; */
            model.linkDataArray=treedata.linkDataArray;
            myDiagram.model = model;
        },
        layout(){
            myDiagram.layoutDiagram(true);
        }
    },
    mounted:function(){
        this.init();
    }
}
</script>

<style>

</style>
