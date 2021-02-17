import React, {Component} from "react";
import ReactDOM from "react-dom";
import Graph from "react-graph-vis";
import {SideNavigation} from "./SideNavigation";
import swal from 'sweetalert';
import {Modal,Button} from 'react-bootstrap';
import _ from 'underscore';

const pushStartNode = (inputNodes,inputEdges) =>{
	let root_id;
	for(let node in inputNodes){
		if(inputNodes[node].type === 'Conjunction'){
			for(let edge in inputEdges){
				if(inputEdges[edge].to !== inputNodes[node].id){
					root_id = inputNodes[node].id;
				}else{
					root_id = '';
					break;
				}
			}
			if(root_id !== ''){
				break;
			}
		}
	}
	return root_id;
}


const findXAndYMinPostion = (inputNodes,root_id,axis) => {
	let xPreviousVal = 0, yPreviousVal = 0;
	for(let node in inputNodes){
		if(inputNodes[node].x < xPreviousVal)
			xPreviousVal = inputNodes[node].x;
		if(inputNodes[node].y < yPreviousVal)
			yPreviousVal = inputNodes[node].y;
	}
	if(axis === 'y'){
		return yPreviousVal;
	} else{
		return xPreviousVal;
	}


}

var network;
var staticGraphEdges = [
	{
		from:0,
		id:"0%"+0,
		to:pushStartNode([],[]),
		color:"#03a9f4"
	}
];
var staticGraphNodes = [
	{
		id:0,
		x:findXAndYMinPostion([],pushStartNode([],[]),'x'),
		y:findXAndYMinPostion([],pushStartNode([],[]),'y')-200,
		label:'Start',
		title:'Start with a conjunction',
		shape:'circle',
		color:'#03a9f4',
		font:{
			color:'#ffffff',
		},
		type:'Start',
		conjunction:'START',
		margin:15
	}
]; 

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

const addEdge = () => {
	network.addEdgeMode();
}
 
const deleteSelected = () => {
	network.deleteSelected();
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



const edgeValidation = (data,network) => {
	var callback_status = false;
	var status;
	var nodeEdges = network.body.data.edges.getDataSet().get();

	nodeEdges.map(function(element){
		if(element.from === 0 && element.to != "" && element.to != undefined){
			status = 'YES';
		}
		if(element.to === data.to) {
			status = 'MULTIPLECNNECT';
		}
	});
	
	if(status === 'YES' && data.from === 0)
		swal("Edge already present from Start node.!", {icon:"error"});
	else if(status === 'MULTIPLECNNECT')
		swal("Edge already present from other node. Please remove it first!", {icon:"error"});
	else if(network.body.data.nodes.getDataSet().get(data.to).type == 'Start')
		swal("Edge cannot be added to start node", {icon:"error"});
	else if(data.from == data.to)
		swal("Self loop edge is not allowed", {icon:"error"});
	else if(network.body.data.edges.getDataSet().get(data.to) != null)
		swal("Edge already present", {icon:"error"});
	else if(network.body.data.nodes.getDataSet().get(data.from).type !== 'Conjunction' && network.body.data.nodes.getDataSet().get(data.from).type !== 'Start')
		swal("Edge can be added from Conjunction or Start node only", {icon:"error"});
	else
		callback_status = true;

	return callback_status;
}


const editComplexConditionModal = () => {

}

const deleteNodeValidation = (data,network) => {
	let callback_status = false;
	let nodeNodes = network.body.data.nodes.getDataSet();
	let root_id="";

	for(let i=0;i<network.body.data.nodes.getDataSet().length;i++){
		if(typeof nodeNodes._data[i] !== 'undefined'){
			if(nodeNodes._data[i].type === 'Start'){
				root_id = nodeNodes._data[i].id;
			}
		}
	}

	if(typeof root_id !== 'undefined'){
		if(root_id === data.nodes[0]){
			swal("Start node cannot be deleted",{icon:"error"});
		}
		else
			callback_status = true;
	}
	else
		callback_status = true;

	return callback_status;
}




export default class CreateRules extends Component {

constructor(props){
	super(props);
	this.state = {
		showCreateRuleModal:false,
		rulesTables:[
			'customer_base',
			'ipo_application'
		],
		attributeForRule:
			{
				customer_base:[
					'state',
					'city',
					'pin'
				],
				ipo_application:[
					'cutoffprice_perlot',
					'bid_amount_perlot',
					'total_bid_amount',
					'is_cutoff_price'
				]
			},
		conditionOperators:[
			'!=',
			'==',
			'>',
			'<',
			'>=',
			'<='
		],	
		selectedTablesAttributes:[],
		finalSelectedTable:'',
		finalSelectedAttribute:'',
		finalSelectedOperator:'',
		finalConditionValue:''

	}
}	

addCondition = () => {
	this.setState({showCreateRuleModal:true});
}

handleClose = () => {
	this.setState({showCreateRuleModal:false});
}

handleSave = () => { 

	let conditionName = this.state.finalSelectedTable+'.'+this.state.finalSelectedAttribute+' '+this.state.finalSelectedOperator+' '+this.state.finalConditionValue;

	addNode(conditionName,'green','white','Conjunction');

	this.setState({showCreateRuleModal:false});
}

render(){	
  const graph = {
    nodes: [
      { id: 1, label: "Node 1", title: "node 1 tootip text" },
      { id: 2, label: "Node 2", title: "node 2 tootip text" },
      { id: 3, label: "Node 3", title: "node 3 tootip text" },
      { id: 4, label: "Node 4", title: "node 4 tootip text" },
      { id: 5, label: "Node 5", title: "node 5 tootip text" }
    ],
    edges: [
      { from: 1, to: 1 },
      { from: 1, to: 3 },
      { from: 2, to: 4 },
      { from: 2, to: 5 }
    ]
  };
 
  const newGraph = {
  	key:Math.random(),
  	nodes:staticGraphNodes,
  	edges:staticGraphEdges
  }

  const options = {
  	autoResize:true,
    layout: {
      hierarchical: false
    },
    nodes:{shadow:true},
    physics:{
    	enabled:false,
    	minVelocity:0.75
    },
    edges: {
      color: "#1bc6a9",
      width:2,
      labelHighlightBold:true,
      smooth:{
      	type:"cubicBezier",
      	forceDirection:"none",
      	roundness:0.3
      },
      arrow:{
    	to:true
      }
    },
    manipulation:{
    	enabled:true,
    	addNode:function (data,callback){
    		let addData = addNode.bind(this,data,network);
    		addData(data,callback);
    	},
    	addEdge:function (data,callback){
    		data.id = data.from+"%"+data.to;
    		data.color = (data.from == 0)?{color:"#0090f7"}:{color:"#1bc6a9"};
    		let callback_status = edgeValidation(data,network);
    		if(callback_status){callback(data);}
    		else callback();
    	},
    	deleteNode:function (data,callback){
    		let callback_status = deleteNodeValidation(data,network);
    		if(callback_status){callback(data);}
    		else callback();
    	},
    	deleteEdge:function (data,callback){
    		callback(data);
    	}
    },
    interaction:{
    	multiselect:true
    },
    height: "500px"

  };
 
  const events = {
  	doubleClick:(props) => {
  		var id = props.nodes;
  		let node_details = network.body.data.nodes.get(id);
  		let is_edit = true;


  	},
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
	  	 editComplexConditionModal={editComplexConditionModal}
	  	 deleteSelected={deleteSelected}
	  	 addCondition={this.addCondition}
  	 />
  	   <div className="card-body">
	    <Graph
	      graph={newGraph}
	      options={options}
	      events={events}
	      getNetwork={network => {
	        //  if you want access to vis.js network api you can set the state in a parent component using this property
	        setNetWork(network)
	      }}
	    />
	    <Modal show={this.state.showCreateRuleModal}>
          <Modal.Header closeButton>
            <Modal.Title>Add Condition</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          	<select className="select" onChange={(event)=>{
          		let selectedValue = event.target.value;
          		let allAttributeValues = this.state.attributeForRule[selectedValue];
          		this.setState({selectedTablesAttributes:allAttributeValues,finalSelectedTable:selectedValue});
          	}}>
          		<option>-- Select Table --</option>
          		{
          			_.map(this.state.rulesTables,(value)=>{
          				return(<option>{value}</option>);
          			})
          		} 
          	</select>

          	<select className="select" onChange={(event)=>{
          		let selectedValue = event.target.value;
          		this.setState({finalSelectedAttribute:selectedValue});
          	}}>
          		<option>-- Select Attribute --</option>
          		{
          			_.map(this.state.selectedTablesAttributes,(value)=>{
          				return(<option>{value}</option>);
          			})
          		}
          	</select>

          	<select className="select" onChange={(event)=>{
          		let selectedValue = event.target.value;
          		this.setState({finalSelectedOperator:selectedValue});
          	}}>
          		<option>-- Select Operator --</option> 
          		{
          			_.map(this.state.conditionOperators,(value)=>{
          				return(<option>{value}</option>);
          			})
          		}
          	</select>
          	<input type="text" onChange={(event)=>{
          		
          		let selectedValue = event.target.value;
          		this.setState({finalConditionValue:selectedValue});
          	}} />
          	
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={this.handleSave}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>
	    </div>
    </div>
  );
}
}
 