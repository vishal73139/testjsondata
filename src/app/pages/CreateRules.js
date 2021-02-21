import React, {Component} from "react";
import ReactDOM from "react-dom";
import Graph from "react-graph-vis";
import {SideNavigation} from "./SideNavigation";
import swal from 'sweetalert';
import {Modal,Button,Form,InputGroup, Col} from 'react-bootstrap';
import _ from 'underscore';
import { format } from 'sql-formatter';
import {getRules,saveRules} from '../../redux/Httpcalls';

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
		margin:15,
		tableName:'',
		attributeName:'',
		conditionOperator:'',
		attributeValue:''
	}
]; 

const addNode = (label,color,fontcolor,type,condition='',tableName='',attributeName='',conditionOperator='',attributeValue='') => {
	var nodeData = {
		id:"xxxxx"+Math.random(),
		x:-100,
		y:-300,
		label:label,
		tableName:'',
		attributeName:'',
		conditionOperator:'',
		attributeValue:''
	};
	nodeData.id=(network.body.data.nodes.max('id') == null)? 1:network.body.data.nodes.max('id').id+1;
	nodeData.tableName='';
	nodeData.attributeName='';
	nodeData.conditionOperator='';
	nodeData.attributeValue='';
	nodeData = getNodeData(nodeData,'box',color,type,'','','',condition,label,fontcolor,tableName,attributeName,conditionOperator,attributeValue);
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

const getNodeData = (nodeData,shape,color,type,entity,attribute,operator,condition,label,fontcolor,tableName,attributeName,conditionOperator,attributeValue) => {
	nodeData.shape = shape;
	nodeData.color = color;
	nodeData.type = type;
	nodeData.entity = entity;
	nodeData.attribute = attribute;
	nodeData.operator = operator;
	nodeData.condition = condition;
	nodeData.label = label;
	nodeData.font = {color:fontcolor}
	nodeData.tableName=tableName;
	nodeData.attributeName=attributeName;
	nodeData.conditionOperator=conditionOperator;
	nodeData.attributeValue=attributeValue;
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

const removeStart = (networkData) => {
	networkData.nodes.remove(0);
	if(networkData.edges.length !== 0){
		let edgeid = "0%"+0;
		networkData.edges.remove(edgeid);
	}
}

const getPlaceHolderValue = (operator,val) => {
	switch(operator){
		case "Substring":
			return "Substring ("+val+") ";
		case "IS NOT":
		case "IS":
			return operator+" NULL ";
		case "IN":
		case "NOT IN":
			return operator+" ("+'\''+val.split(',').join('\',\'')+'\''+") ";
		case "LENGTH <":
		case "LENGTH <=":
		case "LENGTH >":
		case "LENGTH >=":
		case "<":
		case "<=":
		case ">":
		case ">=":
			return operator+" "+val+" ";
		default:
			return operator+" '"+val+"' ";
	}
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
			'<=',
			'IN',
			'NOT IN',
			'LENGTH <',
			'LENGTH <=',
			'LENGTH >',
			'LENGTH >=',
			'IS',
			'IS NOT'
		],	
		selectedTablesAttributes:[],
		finalSelectedTable:'',
		finalSelectedAttribute:'',
		finalSelectedOperator:'',
		finalConditionValue:'',
		validated:false,
		ruleSqlQuery:'',
		createdRuleName:'',
		createdRuleDescription:'',
		exceptionTableName:'',
		exceptionAttributeName:'',
		exceptionType:''

	}
}	

componentDidMount(){

		getRules.then((response) => {
				  console.log(" API- Success - "+response);
				}, (error) => {
				  console.log(" API- ERROR - "+error);
				});
}

addCondition = () => {
	this.setState({showCreateRuleModal:true});
}

handleClose = () => {
	this.setState({showCreateRuleModal:false});
}

handleSave = () => { 

	let conditionName = this.state.finalSelectedTable+'.'+this.state.finalSelectedAttribute+' '+getPlaceHolderValue(this.state.finalSelectedOperator,this.state.finalConditionValue);

	addNode(
		conditionName,
		'green',
		'white',
		'Conjunction',
		'',
		this.state.finalSelectedTable.toLowerCase(),
		this.state.finalSelectedAttribute.toLowerCase(),
		this.state.finalSelectedOperator,
		this.state.finalConditionValue
		);

	this.setState({showCreateRuleModal:false});
}

submitForm = () => {
	if(this.state.createdRuleName == '' || this.state.createdRuleDescription == '')
		swal("Please Provide Valid Rule name and Description!", {icon:"error"});
	else{
		let getSuccess = this.generateQuery();
	
			if(getSuccess){  
				saveRules({
								attributeName: this.state.exceptionAttributeName,
  								extensionType: this.state.exceptionType,
  								ruleDescription: this.state.createdRuleDescription,
  								ruleName: this.state.createdRuleName,
  								sqlQuery: this.state.ruleSqlQuery,
  								tableName: this.state.exceptionTableName
				})
				.then((response) => {
				  console.log(" API- Success - "+response);
				}, (error) => {
				  console.log(" API- ERROR - "+error);
				});
						

				this.setState({
						selectedTablesAttributes:[],
						finalSelectedTable:'',
						finalSelectedAttribute:'',
						finalSelectedOperator:'',
						finalConditionValue:'',
						validated:false,
						ruleSqlQuery:'',
						createdRuleName:'',
						createdRuleDescription:'',
						exceptionTableName:'',
						exceptionAttributeName:'',
						exceptionType:''
					},()=>{

						let networkData = network.body.data;
						let allNodesValues = networkData.nodes.getDataSet().get();
						let allEdgesValues = networkData.edges.getDataSet().get();

						_.map(allNodesValues,(nodeData)=>{
							if(nodeData.label != 'Start'){
								networkData.nodes.remove(nodeData.id);
							}
							
						});

						_.map(allEdgesValues,(edgeData)=>{
							networkData.edges.remove(edgeData.id);
						});


						

 
						swal("Rule Successfully Created!", {icon:"success"});
					})
				
				//alert('asd');
			}
		}
}

generateQuery = () => {

	network.storePositions();
	let networkData = network.body.data;
	//removeStart(networkData);
	//alert(network.body.data);
	console.log(networkData)

	let rowDetails = [];
	let allNodesValues = networkData.nodes.getDataSet().get();
	let allEdgesValues = networkData.edges.getDataSet().get();

	if(allNodesValues.length == 0 || allEdgesValues == 0)
	{
		swal("Please define relation between nodes and edges", {icon:"error"});
		return false;
	}
	else
	{

		let nodeSequence = [0];
		let nodeIndexs=[0];
		_.map(allNodesValues,(nodeData)=>{
			if(!nodeIndexs.includes(nodeData.id))
				nodeIndexs.push(nodeData.id);
		});

		let allconnectedNodeFromStart = _.filter(allEdgesValues,{from: 0});
		if(allconnectedNodeFromStart.length > -1)
		{
			let nextNode=0;
			for(var inc=0;inc<allNodesValues.length;inc++){
				let allconnectedNodeFromStart = _.filter(allEdgesValues,{from: nextNode});
				let firstValue='';
				_.map(allconnectedNodeFromStart,(edgeDataNew)=>{
					console.log("edgeDataNew",edgeDataNew);
						if(typeof(edgeDataNew.to) !== 'undefined')
						{
							if(!nodeSequence.includes(edgeDataNew.to) && typeof(edgeDataNew.to) !== 'undefined'){
								nodeSequence.push(edgeDataNew.to);
							}
							if(firstValue == ''){
								firstValue = edgeDataNew.to;
							}

						}

				})

				if(firstValue != '')
					nextNode = firstValue;

			}

			if(nodeIndexs.length != nodeSequence.length){
				swal("Please link all nodes with correct edges", {icon:"error"});
				return false;
			}
			else{

				let sqlResult = '';
				let lastConditionOperator='';
				let getNextSeq = 0;
				_.map(nodeSequence,(createSqlQueryDataSql)=>{
					if(createSqlQueryDataSql != 0)
					{
						sqlResult += ' ';

						let tableName = networkData.nodes.getDataSet().get(createSqlQueryDataSql).tableName;
						let lableName = networkData.nodes.getDataSet().get(createSqlQueryDataSql).label;
						if(tableName == '')
							lastConditionOperator = lableName;

						if(getNextSeq > 1){

							let getLastNodeDetailsNodeData = nodeSequence[getNextSeq-1];
							let getLastNodeDetailsTableName = networkData.nodes.getDataSet().get(getLastNodeDetailsNodeData).tableName;
							let getLastNodeDetailsLableName = networkData.nodes.getDataSet().get(getLastNodeDetailsNodeData).label;
							if(tableName != '' && getLastNodeDetailsTableName != ''){
								sqlResult += lastConditionOperator+' ';
							}

						}
						
						
						sqlResult += lableName;
					}
					getNextSeq = getNextSeq+1;
				});

				sqlResult = sqlResult.replace(/ +(?= )/g,'');

				// let removeAllStartingAnd = sqlResult.split("AND");

				// if(removeAllStartingAnd[0]==''){
				// 	removeAllStartingAnd.splice(0,1);
				// }
				// if(removeAllStartingAnd[removeAllStartingAnd.length-1]==''){
				// 	removeAllStartingAnd.splice(removeAllStartingAnd.length-1,1);
				// }

				// removeAllStartingAnd.join("AND");

				// sqlResult = removeAllStartingAnd;

				// let removeAllStartingOr = sqlResult.split("OR");

				// if(removeAllStartingOr[0]==''){
				// 	removeAllStartingOr.splice(0,1);
				// }
				// if(removeAllStartingOr[removeAllStartingOr.length-1]==''){
				// 	removeAllStartingOr.splice(removeAllStartingOr.length-1,1);
				// }

				// removeAllStartingOr.join("AND");

				// sqlResult = removeAllStartingOr;


				console.log("sqlResult",sqlResult);
				let ruleSqlQuery = "SELECT "+this.state.exceptionAttributeName+" FROM "+this.state.exceptionTableName+" WHERE "+sqlResult;
				console.log("fullQuery",format(ruleSqlQuery));
				this.setState({ruleSqlQuery});
				return true;

			}

			console.log("nodeSequence",nodeSequence);
			console.log("nodeIndexs",nodeIndexs);

			// 1. Or Operator Should have multuple Nods
			// 2. Start Node can connect with Direct Condition
			// 3. Start Node can start with And and Or Operator


			// let checkStartNodeIsConnectedCorrectly = false;
			// _.map(allconnectedNodeFromStart,(data)=>{

			// 	let getLabel = networkData.nodes.getDataSet().get(data.to); 
			// 	if(getLabel.label == 'AND' || getLabel.label == 'OR' )
			// 		checkStartNodeIsConnectedCorrectly = true;
			// });

			// if(checkStartNodeIsConnectedCorrectly)
			// {

			// }
			// else{
			// 	swal("Start Node will only connect with AND and OR Operator", {icon:"error"});
			// }
		}
		else
		{
			swal("Please start edges from start Node", {icon:"error"});
			return false;
		}
		
		console.log(allNodesValues);
		console.log(allEdgesValues);
		console.log(allconnectedNodeFromStart);
	}
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

  const getFormattedQuery = () => {

  	
    		return format(this.state.ruleSqlQuery);
    	
  }

  return (
  	 <div>
  	  
  	 <div className="card card-custom" style={{padding:'20px'}}>
  	 	<div>
  	 	
        <Form.Row>
          <Form.Group as={Col} md="6" controlId="validationCustom01">
            <Form.Label>Rule name</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Rule name" 
              value={this.state.createdRuleName}
              onChange={(event)=>{
          		
          		let selectedValue = event.target.value;
          		this.setState({createdRuleName:selectedValue});
          	}} 
            /> 
          </Form.Group>
          <Form.Group as={Col} md="6" controlId="validationCustom02">
            <Form.Label>Rule Description</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Rule Description" 
              value={this.state.createdRuleDescription}
              onChange={(event)=>{
          		
          		let selectedValue = event.target.value;
          		this.setState({createdRuleDescription:selectedValue});
          	}} 
            /> 
          </Form.Group>
           
        </Form.Row>

        <Form.Row>
          <Form.Group as={Col} controlId="validationCustom01a">
            <Form.Label>Exception Type</Form.Label>
            <Form.Control
              required
              as="select"
              placeholder="Exception Type" 
              value={this.state.exceptionType}
              onChange={(event)=>{
          		
          		let selectedValue = event.target.value;
          		this.setState({exceptionType:selectedValue});
          	}} 
            >
            	 <option>Choose...</option>
            	 <option>Business Validation</option>
            	 <option>Conformity Check</option>
		        
            </Form.Control> 
          </Form.Group>
          <Form.Group as={Col} controlId="validationCustom02a">
            <Form.Label>Entity Name</Form.Label>
            <Form.Control
              required
              as="select"
              placeholder="Entity Name" 
              value={this.state.exceptionTableName}
              onChange={(event)=>{
          		let selectedValue = event.target.value;
          		let allAttributeValues = this.state.attributeForRule[selectedValue];
          		this.setState({selectedTablesAttributes:allAttributeValues,finalSelectedTable:selectedValue,exceptionTableName:selectedValue});
          	}}
            >
            	<option>Choose...</option>
            	{
          			_.map(this.state.rulesTables,(value)=>{
          				return(<option>{value}</option>);
          			})
          		} 
            </Form.Control> 
          </Form.Group>
           <Form.Group as={Col} controlId="validationCustom02b">
            <Form.Label>Attribute Name</Form.Label>
            <Form.Control
              required
              as="select"
              placeholder="Attribute Name" 
              value={this.state.exceptionAttributeName}
              onChange={(event)=>{
          		let selectedValue = event.target.value;
          		this.setState({exceptionAttributeName:selectedValue});
          		}}
            >
            	<option>Choose...</option>
            	{
          			_.map(this.state.selectedTablesAttributes,(value)=>{
          				return(<option>{value}</option>);
          				})
          		}
            </Form.Control> 
          </Form.Group>
        </Form.Row>


      
      </div>
  	 </div>

  	 <div className="card card-custom" style={{marginTop:'20px'}}>
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
          <Form.Row>
          <Form.Group as={Col} controlId="formGridState">
		      <Form.Label>Entity Name</Form.Label>
		      <Form.Control as="select" 
		      value={this.state.finalSelectedTable}
		      onChange={(event)=>{
          		let selectedValue = event.target.value;
          		let allAttributeValues = this.state.attributeForRule[selectedValue];
          		this.setState({selectedTablesAttributes:allAttributeValues,finalSelectedTable:selectedValue});
          	}}>
		        <option>Choose...</option>
		       	{
          			_.map(this.state.rulesTables,(value)=>{
          				return(<option>{value}</option>);
          			})
          		} 
		      </Form.Control>
		    </Form.Group>
		     <Form.Group as={Col} controlId="formGridAttribute">
		      <Form.Label>Attribute Name</Form.Label>
		      <Form.Control as="select" 
			  value={this.state.finalSelectedAttribute}
		      onChange={(event)=>{
          		let selectedValue = event.target.value;
          		this.setState({finalSelectedAttribute:selectedValue});
          	}}>
		        <option>Choose...</option>
		       {
          			_.map(this.state.selectedTablesAttributes,(value)=>{
          				return(<option>{value}</option>);
          				})
          		}
          			
		      </Form.Control>
		    </Form.Group>
		   
			</Form.Row>
          	
          	<Form.Row>
          		<Form.Group as={Col} controlId="formGridCondition">
		      <Form.Label>Operator</Form.Label>
		      <Form.Control as="select" onChange={(event)=>{
          		let selectedValue = event.target.value;
          		this.setState({finalSelectedOperator:selectedValue});
          	}}>
		        <option>Choose...</option>
		       	{
          			_.map(this.state.conditionOperators,(value)=>{
          				return(<option>{value}</option>);
          			})
          		}
		      </Form.Control>
		    </Form.Group>
		     <Form.Group as={Col} controlId="formGridTextCondition">
	            <Form.Label>Condition</Form.Label>
	            <Form.Control
	              required
	              type="text"
	              placeholder="Condition" 
	              onChange={(event)=>{
          		
          		let selectedValue = event.target.value;
          		this.setState({finalConditionValue:selectedValue});
          	}} 
	            /> 
	          </Form.Group> 
          	</Form.Row>
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

    <div className="card card-custom" style={{padding:'20px',marginTop:'20px',textAlign:'center'}}>
    <textarea class="form-control" style={{background:"#16212e",marginBottom:'10px',color:'white'}} readonly="" rows="5" value={format(this.state.ruleSqlQuery)}></textarea>
    	 
    	 
  	 	<div>
  	 		<Button variant="primary" type="submit" onClick={()=>{
  	 			this.generateQuery();
  	 		}}>
			    Show Rule Query
			 </Button>
  	 		<Button variant="primary" type="submit" style={{marginLeft:'10px'}} onClick={()=>{
  	 			this.submitForm();
  	 		}}>
			    Create Rule
			 </Button>
      	</div>
  	 </div>
	 
    </div>
  );
}
}
 