import React, {Component} from "react";
import {getRules,executeRules} from '../../redux/Httpcalls';
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
			finalSelectedVersion:1

		}
	}

	componentDidMount(){
			getRules.then((response) => {
				  this.setState({ruleData:response.data});
				  console.log(response);
				}, (error) => {
				  console.log(" API- ERROR - "+error);
				});
	}

	handleExcuateRule = () => {
		let selectedRules = this.state.executedRuleDetails; 
		this.setState({showExecuteModal:false},()=>{
			executeRules(this.state.finalSelectedProcessId,selectedRules.ruleId,this.state.finalSelectedVersion).then((response) => {
					 swal("Rule Successfully Executed and Found "+response.data+" Exceptions .!", {icon:"success"});
					}, (error) => { 
					 swal("Something went wrong.!", {icon:"error"}); 
					});
		});
	}

	render(){
		return(
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
		              <StyledTableCell align="center"><VisibilityOutlinedIcon style={{cursor:'pointer'}}/>&nbsp;&nbsp;&nbsp;<PlayCircleFilledWhiteOutlinedIcon onClick={()=>{
		              	

		              	this.setState({executedRuleDetails:row,showExecuteModal:true});
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
						          		this.setState({finalSelectedProcessId:selectedValue});
						          	}} 
				      	>
				        <option>Choose...</option>
				        <option>16-FEB-2021</option>
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
				        <option>1</option>
				        <option>2</option>
				      </Form.Control>
				    </Form.Group> 

					</Form.Row> 
		          </Modal.Body>
		          <Modal.Footer>
		            <Button variant="secondary" onClick={()=>{this.setState({finalSelectedProcessId:'',finalSelectedVersion:1,showExecuteModal:false})}}>
		              Close
		            </Button>
		            <Button variant="primary" onClick={this.handleExcuateRule}>
		              Execute
		            </Button>
		          </Modal.Footer>
		        </Modal>
		    </Paper>
			);
	}
}