import React, {Component} from "react";
import {getRules,executeRules,reApplyAdj,getProcessDateAndVersion} from '../../redux/Httpcalls';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import _ from 'underscore';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
import PlayCircleFilledWhiteOutlinedIcon from '@material-ui/icons/PlayCircleFilledWhiteOutlined';
import {Modal,Button,Form,InputGroup, Col, Badge} from 'react-bootstrap';
import swal from 'sweetalert';
import moment from 'moment';

const StyledTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles(theme => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  },
}))(TableRow);


export default class ViewRules extends Component{
	constructor(props){
		super(props);
		this.state = {
			ruleData:[],
			showExecuteModal:false,
			executedRuleDetails:{},
			finalSelectedProcessId:'',
			finalSelectedVersion:'',
			showViewModal:false,
			processDateArray:[],
			versionDataArray:[],
			allProcessDateApidata:[]
		}
	}

	getRuleData = () => {
		//alert('test');
		getRules().then((response) => {
				  this.setState({ruleData:[...response.data]});
				  console.log(response);
				}, (error) => {
				  console.log(" API- ERROR - "+error);
				});
	}

	componentDidMount(){
			this.getRuleData();
	}


	handleExcuateRule = () => {
		let selectedRules = this.state.executedRuleDetails; 
		let reAdjuctObject = {
				  "processDate": moment(this.state.finalSelectedProcessId).format("DD-MMM-YYYY").toUpperCase(),
				  "version": this.state.finalSelectedVersion
				};

		reApplyAdj(reAdjuctObject).then((response) => {
			this.setState({showExecuteModal:false},()=>{
				executeRules(this.state.finalSelectedProcessId,selectedRules.ruleId,this.state.finalSelectedVersion).then((response) => {
						 swal("Rule Successfully Executed and Found "+response.data+" Exceptions.", {icon:"success"});
						}, (error) => { 
						 swal("Something went wrong.!", {icon:"error"}); 
						});
			});
		}, (error) => { 
					 swal("Something went wrong.!", {icon:"error"}); 
					});
	}

	getProcessDates = (rowData) => {
		let tableName = rowData.exceptionTablename;
		getProcessDateAndVersion(tableName).then((response) => {
				  let apiData = response.data;
				  let allProcessDate = [];
				  _.map(apiData,(comingData)=>{
				  	if(!allProcessDate.includes(comingData.process_date)){
				  		allProcessDate.push(comingData.process_date);
				  	}
				  })

				  this.setState({
				  	executedRuleDetails:rowData,
				  	showExecuteModal:true,
				  	processDateArray:allProcessDate,
					versionDataArray:[],
					allProcessDateApidata:apiData
				  })

				  
				}, (error) => {
				  console.log(" API- ERROR - "+error);
				}); 

	}

	render(){
		return(
			<div>
			<div className="row" style={{padding:'0px'}}>
			 	<div className="col-lg-10 col-md-10">
                        
                 </div>
			 	 <div className="col-lg-2 col-md-2" style={{textAlign:'right',padding:'0px'}}>
                        <button class="btn btn-primary" onClick={()=>{
                        	this.getRuleData();
                        }} style={{marginRight:'10px',marginBottom:'10px'}}>Refresh Rules </button>
                 </div>
			 	
			 </div>
			<Paper>
			 
		      <Table>
		        <TableHead>
		          <TableRow>
		            <StyledTableCell align="left">Rule Name</StyledTableCell> 
		            <StyledTableCell align="center">Exception Type</StyledTableCell>
		            <StyledTableCell align="center">Entity Name</StyledTableCell>
		            <StyledTableCell align="center">Attribute Name</StyledTableCell>
		            <StyledTableCell align="center">Created Date</StyledTableCell>
		            <StyledTableCell align="center">Action</StyledTableCell>
		          </TableRow>
		        </TableHead>
		        <TableBody>
		        {
		        	(this.state.ruleData.length > 0)?_.map(this.state.ruleData,(row)=>{
 					  return (<StyledTableRow key={row.ruleName}>
		              <StyledTableCell component="th" scope="row">
		                {row.ruleName}
		              </StyledTableCell> 
		              <StyledTableCell align="center">{
		              	(row.exceptionType == 'Business Validation')?<Badge pill variant="warning">{row.exceptionType}</Badge>:<Badge pill variant="info">{row.exceptionType}</Badge>}</StyledTableCell>
		              <StyledTableCell align="center">{row.exceptionTablename}</StyledTableCell>
		              <StyledTableCell align="center">{row.exceptionAttribute}</StyledTableCell>
		              <StyledTableCell align="center">{(row.createdDate != null)?row.createdDate.split('T')[0]:''}</StyledTableCell>
		              <StyledTableCell align="center"><VisibilityOutlinedIcon style={{cursor:'pointer'}} onClick={()=>{
		              	
		              	this.setState({showViewModal:true,executedRuleDetails:row});
		              }}/>&nbsp;&nbsp;&nbsp;<PlayCircleFilledWhiteOutlinedIcon onClick={()=>{
		              	
						this.getProcessDates(row);
		              	/*this.setState({executedRuleDetails:row,showExecuteModal:true});*/
		              }} style={{cursor:'pointer'}}/></StyledTableCell>
		            </StyledTableRow>)
		        	}):<StyledTableRow>No Record Found</StyledTableRow>
		        }
		         

		        </TableBody>
		      </Table>

		      <Modal show={this.state.showExecuteModal}>
		          <Modal.Header closeButton>
		            <Modal.Title>Execute Rules</Modal.Title>
		          </Modal.Header>
		          <Modal.Body>
		          <Form.Row>
		          <Form.Group as={Col} controlId="formGridState">
				      <Form.Label>Process Date</Form.Label>
				      <Form.Control as="select" 
				      	value={this.state.finalSelectedProcessId}
						onChange={(event)=>{
						          		
						          		let selectedValue = event.target.value;

						          		let allVersionIds = [];
						          		_.map(this.state.allProcessDateApidata,(getApiData)=>{

						          			if(getApiData.process_date === selectedValue && !allVersionIds.includes(getApiData.version)){
												allVersionIds.push(getApiData.version);
						          			}

						          		});

						          		this.setState({finalSelectedProcessId:selectedValue,versionDataArray:allVersionIds});
						          	}} 
				      	>
				        <option>Choose...</option>
				        {
				        	_.map(this.state.processDateArray,(comingProcessId)=>{
				        		return <option value={comingProcessId}> {moment(comingProcessId).format("DD-MMM-YYYY").toUpperCase() }</option>
				        	})
				        } 
				      </Form.Control>
				    </Form.Group> 

				    <Form.Group as={Col} controlId="formGridState">
				      <Form.Label>Version</Form.Label>
				      <Form.Control as="select" 
				      	value={this.state.finalSelectedVersion}
						onChange={(event)=>{
						          		
						          		let selectedValue = event.target.value;
						          		this.setState({finalSelectedVersion:selectedValue});
						          	}} 
				      	>
				        <option>Choose...</option>
				          {
				        	_.map(this.state.versionDataArray,(comingVersionId)=>{
				        		return <option value={comingVersionId}> {comingVersionId}</option>
				        	})
				          }  
				      </Form.Control>
				    </Form.Group> 

					</Form.Row> 
		          </Modal.Body>
		          <Modal.Footer>
		            <Button variant="secondary" onClick={()=>{this.setState({finalSelectedProcessId:'',finalSelectedVersion:1,showExecuteModal:false})}}>
		              Close
		            </Button>
		            <Button variant="primary" onClick={()=>{this.handleExcuateRule()}}>
		              Execute
		            </Button>
		          </Modal.Footer>
		        </Modal>

		        <Modal show={this.state.showViewModal}>
		          <Modal.Header closeButton>
		            <Modal.Title>Rule Details</Modal.Title>
		          </Modal.Header>
		          <Modal.Body>
		           <Form.Row>
		          <Form.Group as={Col} controlId="formGridState">
				      <Form.Label>Rule Id</Form.Label>
				      <Form.Control as="input" 
				      	value={(this.state.executedRuleDetails.ruleId)?this.state.executedRuleDetails.ruleId:''} >
				      </Form.Control>
				  </Form.Group>  
				  <Form.Group as={Col} controlId="formGridState">
				      <Form.Label>Rule Name</Form.Label>
				      <Form.Control as="input" 
				      	value={(this.state.executedRuleDetails.ruleName)?this.state.executedRuleDetails.ruleName:''} >
				      </Form.Control>
				  </Form.Group> 
				  </Form.Row> 
				    <Form.Row>
				   <Form.Group as={Col} controlId="formGridState">
				      <Form.Label>Exception Type</Form.Label>
				      <Form.Control as="input" 
				      	value={(this.state.executedRuleDetails.exceptionType)?this.state.executedRuleDetails.exceptionType:''} >
				      </Form.Control>
				  </Form.Group>   
		          <Form.Group as={Col} controlId="formGridState">
				      <Form.Label>Entity Name</Form.Label>
				      <Form.Control as="input" 
				      	value={(this.state.executedRuleDetails.exceptionTablename)?this.state.executedRuleDetails.exceptionTablename:''} >
				      </Form.Control>
				  </Form.Group>  
				  <Form.Group as={Col} controlId="formGridState">
				      <Form.Label>Attribute Name</Form.Label>
				      <Form.Control as="input" 
				      	value={(this.state.executedRuleDetails.exceptionAttribute)?this.state.executedRuleDetails.exceptionAttribute:''} >
				      </Form.Control>
				  </Form.Group> 
				  </Form.Row> 
		          <Form.Row>
		          <Form.Group as={Col} controlId="formGridState">
				      <Form.Label>Rule Query</Form.Label>
				      <Form.Control as="textarea" 
				      	value={(this.state.executedRuleDetails.ruleQuery)?this.state.executedRuleDetails.ruleQuery:''} >
				      </Form.Control>
				  </Form.Group>  
				  </Form.Row> 
		          </Modal.Body>
		          <Modal.Footer>
		            <Button variant="secondary" onClick={()=>{this.setState({showViewModal:false})}}>
		              Close
		            </Button> 
		          </Modal.Footer>
		        </Modal>
		        
		    </Paper>
		    </div>
			);
	}
}