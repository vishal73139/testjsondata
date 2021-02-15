import React from "react";
import ReactDOM from "react-dom";
import Graph from "react-graph-vis";
import {SideNavigation} from "./SideNavigation" 
var network;
const addNode = (label,color,fontcolor,type,condition='') => {
	var nodeData = {
		id:"xxxxx"+Math.random(),
		x:-100,
		y:-300,
		label:label
	};
	nodeData.id=(network.body.data.nodes.max('id') == null)? 1:network.body.data.nodes.max('id').id+1;
	nodeData = getNodeData(nodeData,'box',color,type,'','','',condition,label,fontcolor);
	nodeData.margin = 15;
	network.body.data.nodes.getDataSet().add(nodeData);
}
 
const setNetWork = (nw) => {
	network = nw;
} 

const getNodeData = (nodeData,shape,color,type,entity,attribute,operator,condition,label,fontcolor) => {
	nodeData.shape = shape;
	nodeData.color = color;
	nodeData.type = type;
	nodeData.entity = entity;
	nodeData.attribute = attribute;
	nodeData.operator = operator;
	nodeData.condition = condition;
	nodeData.label = label;
	nodeData.font = {color:fontcolor}
	return nodeData;
}

const addEdge = () => {
	network.addEdgeNode();
}

export function CreateRules() {
  const graph = {
    nodes: [
      { id: 1, label: "Node 1", title: "node 1 tootip text" },
      { id: 2, label: "Node 2", title: "node 2 tootip text" },
      { id: 3, label: "Node 3", title: "node 3 tootip text" },
      { id: 4, label: "Node 4", title: "node 4 tootip text" },
      { id: 5, label: "Node 5", title: "node 5 tootip text" }
    ],
    edges: [
      { from: 1, to: 2 },
      { from: 1, to: 3 },
      { from: 2, to: 4 },
      { from: 2, to: 5 }
    ]
  };
 
  const options = {
    layout: {
      hierarchical: true
    },
    edges: {
      color: "#000000"
    },
    height: "500px"
  };
 
  const events = {
    select: function(event) {
      var { nodes, edges } = event;
    }
  };

  return (
  	 <div className="card card-custom">
  	 <SideNavigation 
  	 network={network}
  	 addNode={addNode}
  	 addEdge={addEdge}
  	 />
  	   <div className="card-body">
	    <Graph
	      graph={graph}
	      options={options}
	      events={events}
	      getNetwork={network => {
	        //  if you want access to vis.js network api you can set the state in a parent component using this property
	        setNetWork(network)
	      }}
	    />
	    </div>
    </div>
  );
}
 