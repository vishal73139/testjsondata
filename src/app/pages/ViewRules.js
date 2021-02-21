import React, {Component} from "react";
import {getRules} from '../../redux/Httpcalls';
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
			ruleData:[]
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

	render(){
		return(
			<Paper>
		      <Table>
		        <TableHead>
		          <TableRow>
		            <StyledTableCell align="center">Rule Name</StyledTableCell>
		            <StyledTableCell align="center">Rule Description</StyledTableCell>
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
		              <StyledTableCell align="center">{row.ruleDescription}</StyledTableCell>
		              <StyledTableCell align="center">{row.exceptionType}</StyledTableCell>
		              <StyledTableCell align="center">{row.exceptionTablename}</StyledTableCell>
		              <StyledTableCell align="center">{row.exceptionAttribute}</StyledTableCell>
		              <StyledTableCell align="center">{(row.createdDate != null)?row.createdDate.split('T')[0]:''}</StyledTableCell>
		              <StyledTableCell align="center"><VisibilityOutlinedIcon style={{cursor:'pointer'}}/>&nbsp;&nbsp;&nbsp;<PlayCircleFilledWhiteOutlinedIcon style={{cursor:'pointer'}}/></StyledTableCell>
		            </StyledTableRow>)
		        	}):<StyledTableRow>No Record Found</StyledTableRow>
		        }
		          
		        </TableBody>
		      </Table>
		    </Paper>
			);
	}
}