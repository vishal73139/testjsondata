import React, {Component} from "react"; 
import {
    Select, InputLabel, MenuItem, FormControl, ButtonGroup, Button,
    Table, TableHead, TableBody, TableCell, TableContainer, TableFooter, TablePagination, TableRow,
    Paper, Input, Tooltip, CircularProgress
} from '@material-ui/core';
import _ from 'underscore';
import moment from 'moment';
import {getProcessDateAndVersion,getTableStageData,saveCustomerbaseDataApi} from '../../redux/Httpcalls';
import {Modal,Form, Col, Badge,Spinner} from 'react-bootstrap';
import CSVReader from 'react-csv-reader';
import swal from 'sweetalert';

export default class InjectionPage extends Component{

	constructor(props){
		super(props); 
		this.state={
			selectedTableName:'customer_base',
			selectedProcessDate:'',
			selectedVersion:'',
			allTableName:[
			'customer_base',
			'ipo_applications'
			],
			processDatesArray:[],
			versionDataArray:[],
			allProcessDateApidata:[],
			tableHeaderData:[],
			tableRowData:[],
			page: 0,
            rowsPerPage: 20,
            showCounter: true,
            loadingTabledata:false,
            showUploadDataModalPopup:false,
            uploadedFileData:[],
            enableSubmit:false,
            showuploaddataLoading:false
		}
	}

	componentDidMount(){
		let tableName = this.state.selectedTableName; 
		this.getProcessDatesApiData();
		this.getActualTableValues();
	}

	getActualTableValues = () => {
		this.setState({loadingTabledata:false},()=>{
		let tableName = this.state.selectedTableName;
		let process_date = this.state.selectedProcessDate;
		let version = this.state.selectedVersion

		
		getTableStageData(tableName,process_date,version).then((response) => {
			if(_.size(response.data) > 0){
				let allHeaderKeys = _.keys(response.data[0]);
				console.log(allHeaderKeys);
				this.setState({
					tableHeaderData:allHeaderKeys,
					tableRowData:response.data,
					loadingTabledata:true
				});
			}
			console.log(response.data);
		}, (error) => {
				  console.log(" API- ERROR - "+error);
				}); 
	});
	}

	getProcessDatesApiData = () => {

		let tableName = this.state.selectedTableName; 
		getProcessDateAndVersion(tableName).then((response) => {
				  let apiData = response.data;
				  let allProcessDate = [];
				  _.map(apiData,(comingData)=>{
				  	if(!allProcessDate.includes(comingData.process_date)){
				  		allProcessDate.push(comingData.process_date);
				  	}
				  });

				  this.setState({  
				  	processDatesArray:allProcessDate,
					versionDataArray:[],
					allProcessDateApidata:apiData
				  })

				  
				}, (error) => {
				  console.log(" API- ERROR - "+error);
				}); 
	}

	getAllVersionNumber = () => {
		let allVersionIds = [];
		let process_date = this.state.selectedProcessDate;
  		_.map(this.state.allProcessDateApidata,(getApiData)=>{

  			if(getApiData.process_date === process_date && !allVersionIds.includes(getApiData.version)){
				allVersionIds.push(getApiData.version);
  			}

  		});
  		this.setState({versionDataArray:[...allVersionIds]});
	}

	onHandlePageChange(e, newPage) {
	        this.setState({
	            page: Number(newPage)
	        });
	}

	onHandleChangeRowsPerPage(e, rowsPerPage) {
        this.setState({
            rowsPerPage: Number(rowsPerPage)
        });
    }    

    showUploadDataPopup = () => {
    	this.setState({showUploadDataModalPopup:true,enableSubmit:false,uploadedFileData:[],showuploaddataLoading:false});
    }

    saveUploadData = () => {
    	this.setState({showuploaddataLoading:true,enableSubmit:false},()=>{
    	saveCustomerbaseDataApi(this.state.uploadedFileData).then((response) => {

    			this.setState({uploadedFileData:[],enableSubmit:false,showUploadDataModalPopup:false,showuploaddataLoading:false},()=>{
    				swal("Data Successfully Inserted!", {icon:"success"});
    			});

    		}, (error) => {
    				this.setState({uploadedFileData:[],enableSubmit:false,showUploadDataModalPopup:false,showuploaddataLoading:false});
				    swal("Wrong Datatype found!", {icon:"error"});
				}); 
    	});
    }

    handleForce = (data, fileInfo) => {
    	console.log(data);
    	this.setState({uploadedFileData:data,enableSubmit:true});
    }

     

	render(){
		const { page, rowsPerPage } = this.state;
		const papaparseOptions = {
			    header: true,
			    dynamicTyping: true,
			    skipEmptyLines: true,
			    transformHeader: header =>
			      header
			        .toLowerCase()
			        .replace(/\W/g, '_')
			  }
		return(
			 <div className="injection-page-class">
			 <div className="row">
			 	<div className="col-lg-10 col-md-10">
                        
                 </div>
			 	 <div className="col-lg-2 col-md-2" stylr={{textAlign:'right'}}>
                        <button class="btn btn-primary" onClick={()=>{
                        	this.showUploadDataPopup();
                        }}>Insert Data</button>
                 </div>
			 	
			 </div>
                <div className="row bg-white" style={{marginTop:'10px',padding:'5px'}}>
                 <div className="col-lg-8 col-md-8 exception-summary-form-class">
					      <FormControl className="exception-summary-form-control">
                            <InputLabel id="es-process-date">Entity Name</InputLabel>
                            <Select
                                labelId="es-process-date"
                                id="es-process-date-select"
                                onChange={(event)=>{
							      	let selectedValue = event.target.value;
							      	this.setState({selectedTableName:selectedValue,selectedProcessDate:'',selectedVersion:'',processDatesArray:[],versionDataArray:[]},()=>{
							      		this.getProcessDatesApiData();
							      		this.getActualTableValues();
							      	});
							      }}
                                value={this.state.selectedTableName}
                            >
                                {
						         	_.map(this.state.allTableName,(tableName)=>{
						         		return <option value={tableName}>{tableName}</option>
						         	})
						         }
                            </Select>
                        </FormControl>
                         <FormControl className="exception-summary-form-control">
                            <InputLabel id="es-version">Process Dates</InputLabel>
                            <Select
                                labelId="es-version"
                                id="es-version-select"
                                onChange={(event)=>{
							      	let selectedValue = event.target.value;
							      	this.setState({selectedProcessDate:selectedValue},()=>{
							      		this.getAllVersionNumber();
							      		this.getActualTableValues();
							      	});
							      }}
                                value={this.state.selectedProcessDate}
                            >
                                 {
						         	_.map(this.state.processDatesArray,(processDates)=>{
						         		return <option value={processDates}>{processDates}</option>
						         	})
						         }
                            </Select>
                        </FormControl>

                        <FormControl className="exception-summary-form-control">
                            <InputLabel id="es-version">Version</InputLabel>
                            <Select
                                labelId="es-version"
                                id="es-version-select"
                                onChange={(event)=>{
							      	let selectedValue = event.target.value;
							      	this.setState({selectedVersion:selectedValue},()=>{
							      		this.getActualTableValues();
							      	});
							      }}
                                value={this.state.selectedVersion}
                            >
                                 {
						         	_.map(this.state.versionDataArray,(versionId)=>{
						         		return <option value={versionId}>{versionId}</option>
						         	})
						         }
                            </Select>
                        </FormControl>
                        
 
				</div>
				 <div className="col-lg-4 col-md-4">
                        
                 </div>
				</div>

				 {
                    this.state.loadingTabledata && <div className="row mt-2">
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        {_.map(this.state.tableHeaderData,(column) => (
                                            <TableCell
                                            align="left"
                                            >
                                                {column}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                  {
                                    	this.state.tableRowData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => (
							            <TableRow>
							            {
							            	 _.map(this.state.tableHeaderData,(keyColumn)=>{
							            		return (<TableCell align="left">
							            			{row[keyColumn]}
							            		</TableCell>)
							            	})
							            }
							              
							            </TableRow>
							          ))
							      }
                                </TableBody>

                            </Table>
                        </TableContainer>
                        <div style={{ width: "100%" }}>
                            <TablePagination
                                rowsPerPageOptions={[20, 40, 60, 80, 100]}
                                component="div"
                                count={_.size(this.state.tableRowData)}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onChangePage={(e, newPage) => this.onHandlePageChange(e, newPage)}
                                onChangeRowsPerPage={(e, rowsPerPage) => this.onHandleChangeRowsPerPage(e, rowsPerPage)}
                            />
                        </div>
                    </div>
                }


                <Modal show={this.state.showUploadDataModalPopup}>
		          <Modal.Header closeButton>
		            <Modal.Title>Upload Data</Modal.Title>
		          </Modal.Header>
		          <Modal.Body>
		          	<Form.Row>
			          	<Form.Group as={Col} controlId="formGridState">
					      <Form.Label>Entity Name</Form.Label>
					      <Form.Control as="input" 
					      	value={this.state.selectedTableName}>
					      </Form.Control>
					    </Form.Group>
					   
					</Form.Row>
					<Form.Row> 
						 <Form.Group>
				          <CSVReader
					        cssClass="csv-reader-input"
					        label="Upload Data CSV file"
      						onFileLoaded={(d,e)=>this.handleForce(d,e)}
      						parserOptions={papaparseOptions}
					      /> 
				          </Form.Group>
			        </Form.Row>    
		          </Modal.Body>
		          <Modal.Footer>
		            <Button variant="secondary" onClick={()=>{this.setState({showUploadDataModalPopup:false})}}>
		              Close
		            </Button>
		            {
		            	(this.state.enableSubmit)?<Button class="btn btn-primary" variant="primary" onClick={()=>{this.saveUploadData()}}>
		              Save
		            </Button>:null
		            }
		            {
		            	(this.state.showuploaddataLoading)?<Spinner animation="border" style={{marginLeft:'10px'}} variant="primary" />:null
		            }
		            
		          </Modal.Footer>
		        </Modal>
				</div>	


			);
	}
}