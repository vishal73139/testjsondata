import React, { Component, Fragment } from "react";
import {
    Select, InputLabel, MenuItem, FormControl, ButtonGroup, Button,
    Table, TableHead, TableBody, TableCell, TableContainer, TableFooter, TablePagination, TableRow,
    Paper, Input, Tooltip, CircularProgress, Typography
} from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';
import { Modal } from 'react-bootstrap';
import CountUp from "react-countup";
import {
    getExceptionType, applyAdj, getMetadata, getStgApi,
    getAdjSuggestionsForCustomerBase, getAdjSuggestionsForIpoApplication
} from '../../redux/Httpcalls';
import moment from 'moment';
import swal from 'sweetalert';

let gridPayload;

const columns = [
    { id: 'ruleId', label: 'Rule ID' },
    { id: 'tableName', label: 'Table Name' },
    { id: 'exceptionType', label: 'Exception Type' },
    { id: 'attribute', label: 'Attribute' },
    { id: 'count', label: 'Count', showLink: true }
];

const adjustmentColumns = [
    {
        field: "id",
        headerName: "ID",
        hide: true,
        flex: 1
    },
    {
        field: "tableName",
        headerName: "Table Name",
        flex: 1
    },
    {
        field: "primaryKey",
        headerName: "Primary Key",
        flex: 1,
        hide: true
    },
    {
        field: "primaryKeyValue",
        headerName: "Customer Value",
        flex: 1
    },
    {
        field: "attribute",
        headerName: "Attribute Name",
        flex: 1
    },
    {
        field: "attributeOldValue",
        headerName: "Old Value",
        flex: 1
    },
    {
        field: "attributeValueSuggestion",
        headerName: "AI Suggestion",
        description: "Values are suggested by AI / ML Algorithm",
        flex: 1,
        renderCell: (params) => {
            const suggestList = aiMlColumns.find(a => params.row.tableName === a.tableName).attributeListForSuggestion;
            return (
                <Tooltip title={<React.Fragment>
                    <Typography>Suggestion based on columns </Typography>
                    {
                        suggestList.map(s => <Typography><b>{s}: </b>{params.row[s]}</Typography>)
                    }
                </React.Fragment>}>
                    <Typography className="ai-suggestion">{params.row.attributeValueSuggestion}</Typography>
                </Tooltip>
            )
        }
    },
    {
        field: "attributeNewValue",
        headerName: "New Value",
        flex: 1,
        renderCell: (params) => {
            const onAdjustmentEdit = (e) => {
                let obj = {
                    tableName: params.row.tableName,
                    attribute: params.row.attribute,
                    priCols: params.row.primaryKey,
                    priVals: params.row.primaryKeyValue,
                    oldVal: params.row.attributeOldValue,
                    newVal: e.target.value,
                    expiryDate: moment(new Date()).add(30, 'day').format("DD-MMM-YYYY").toUpperCase(),
                    processDate: params.row.processDate,
                    version: params.row.version
                };
                gridPayload.length === 0 && gridPayload.push(obj);
                for (let i = 0, len = gridPayload.length || 0; i < len; i++) {
                    if (gridPayload[i].priVals === params.row.primaryKeyValue) {
                        gridPayload.splice(i, i + 1);
                        break;
                    }
                }
                gridPayload.push(obj);
            }
            return <Input placeholder="Enter New Value" onBlur={(e) => onAdjustmentEdit(e)} />
        }
    }
];

const aiMlColumns = [{
    tableName: "v_ipo_applications",
    attributeValueMap: {
        1: "INDIGO PAINTS",
        2: "IRFC",
        3: "NERCO",
        4: "STONECRAFT"
    },
    attributeListForSuggestion: ["cutoffprice_perlot", "numberOf_lots", "bid_amount_perlot"],
    excepAttribute: "ipo_name"
}, {
    tableName: "v_customer_base",
    attributeValueMap: {
        1: "silver",
        2: "gold",
        3: "platinum"
    },
    attributeListForSuggestion: ["cust_acct_age", "credit_score", "yearly_trans_amt"],
    excepAttribute: "cust_classification"
}];

export default class ExceptionSummary extends Component {

    constructor(props) {
        super(props);

        gridPayload = [];
        this.state = {
            page: 0,
            rowsPerPage: 20,
            showCounter: false,
            showExceptionSummaryGrid: false,
            counterData: [],
            exceptionData: [],
            metaData: [],
            showLoading: false
        }
    }

    componentDidMount() {
        getMetadata().then(res => {
            this.setState({
                metaData: res.data
            });
        });
    }

    getNearestInteger(value, roundToPlace) {
        const num = Number(value);
        const roundPlace = Number(roundToPlace);
        const nearestInteger = num / Math.pow(10, ((roundPlace || num).toString().length - 1));
        const multiplyFactor = Math.pow(10, ((roundPlace || num).toString().length - 1));
        return {
            nearestRoundedValue: Math.round(nearestInteger) * multiplyFactor,
            minValue: Math.floor(nearestInteger) * multiplyFactor,
            maxValue: Math.ceil(nearestInteger) * multiplyFactor
        }
    }
    formatNumber(num) {
        let roundedValue;
        if (num >= 1000000000) {
            roundedValue = this.getNearestInteger(num, 1000000000);
            return [parseInt((roundedValue.nearestRoundedValue / 1000000000).toFixed(1).replace(/\.0$/, "")), "B"];
        }
        if (num >= 1000000) {
            roundedValue = this.getNearestInteger(num, 1000000);
            return [parseInt((roundedValue.nearestRoundedValue / 1000000).toFixed(1).replace(/\.0$/, "")), "M"];
        }
        if (num >= 1000) {
            roundedValue = this.getNearestInteger(num, 1000);
            return [parseInt((roundedValue.nearestRoundedValue / 1000).toFixed(1).replace(/\.0$/, "")), "K"];
        }
        return [num, ""];
    }

    onSelectChange(e, type) {
        gridPayload = [];
        const value = e.target.value;
        if (value) {
            this.setState({
                [type]: value,
                showCounter: false,
                showExceptionSummaryGrid: false
            });
        } else {
            this.setState({
                [type]: value,
                showCounter: false,
                showExceptionSummaryGrid: false
            });
        }
    }

    onSearchClick() {
        if (this.state.processDate && this.state.version) {
            gridPayload = [];
            getExceptionType({ processDate: this.state.processDate, version: this.state.version }).then((response) => {
                const res = response.data.reduce((acc, item) => {
                    acc = {
                        ...acc,
                        [item["exceptionType"]]: Number(item.count) + ((acc[item["exceptionType"]]) ? Number(acc[item["exceptionType"]]) : 0)
                    };
                    return acc;
                }, {});
                const counterData = [];
                Object.keys(res).forEach((key) => {
                    counterData.push({
                        exceptionType: key,
                        count: res[key]
                    });
                });
                this.setState({
                    counterData,
                    showCounter: true,
                    exceptionData: response.data
                });
            });
        }
    }

    onResetClick() {
        gridPayload = [];
        this.setState({
            showCounter: false,
            showExceptionSummaryGrid: false,
            tableName: "",
            page: 0,
            rowsPerPage: 20,
            counterData: [],
            exceptionData: [],
            openModal: false
        });
    }

    onCounterClick(exceptionType) {
        gridPayload = [];
        this.setState({
            selectedRuleType: exceptionType.exceptionType,
            showExceptionSummaryGrid: true
        });
    }

    onHandlePageChange(e, newPage) {
        this.setState({
            page: Number(newPage.key)
        });
    }

    onHandleChangeRowsPerPage(e, rowsPerPage) {
        this.setState({
            rowsPerPage: Number(rowsPerPage.key)
        });
    }

    onGridCount(rowData) {
        this.setState({
            showLoading: true
        });
        gridPayload = [];
        let adjustableRows = [];
        let pkValues = rowData.primaryKeyValue.replace("]", "").replace("[", "");
        let count = Number(rowData.count);
        pkValues.split(",").forEach((item) => {
            let filterColumn;
            if (rowData.tableName === "v_customer_base") {
                getStgApi({
                    primaryKey: rowData.primaryKey,
                    primaryKeyValue: item.trim().split("&&")[0],
                    processDate: moment(rowData.processDate).format("M/DD/YYYY"),
                    tableName: rowData.tableName,
                    versionId: Number(rowData.version)
                }).then(res => {
                    filterColumn = aiMlColumns.find(a => a.tableName === rowData.tableName);
                    let aiPayload = [];
                    let adjRow = {};
                    filterColumn.attributeListForSuggestion.forEach(e => {
                        aiPayload.push(res.data[0][e]);
                        adjRow[e] = res.data[0][e];
                    });
                    getAdjSuggestionsForCustomerBase({ data: [aiPayload] }).then(res => {
                        console.log("AI response", res.data);
                        const aiSuggestion = filterColumn.attributeValueMap[res.data[0]];
                        adjRow = {
                            ...adjRow,
                            id: item.trim().split("&&")[0],
                            tableName: rowData.tableName,
                            attribute: rowData.attribute,
                            primaryKey: rowData.primaryKey,
                            primaryKeyValue: item.trim().split("&&")[0],
                            attributeOldValue: item.trim().split("&&")[1],
                            processDate: moment(rowData.processDate).format("DD-MMM-YYYY").toUpperCase(),
                            version: rowData.version,
                            attributeValueSuggestion: aiSuggestion
                        };

                        adjustableRows.push(adjRow);

                        if (count === adjustableRows.length) {
                            this.setState({
                                openModal: true,
                                adjustableRows,
                                showLoading: false
                            });
                        }

                    });
                });
            } else {
                getStgApi({
                    primaryKey: rowData.primaryKey,
                    primaryKeyValue: item.trim().split("&&")[0],
                    processDate: moment(rowData.processDate).format("M/DD/YYYY"),
                    tableName: rowData.tableName,
                    versionId: Number(rowData.version)
                }).then(res => {
                    filterColumn = aiMlColumns.find(a => a.tableName === rowData.tableName);
                    let aiPayload = [];
                    filterColumn.attributeListForSuggestion.forEach(e => {
                        aiPayload.push(res.data[0][e]);
                    });
                    getAdjSuggestionsForIpoApplication({ data: [aiPayload] }).then(res => {
                        const aiSuggestion = filterColumn.attributeValueMap[res.data[0]];
                        adjustableRows.push({
                            id: item.trim().split("&&")[0],
                            tableName: rowData.tableName,
                            attribute: rowData.attribute,
                            primaryKey: rowData.primaryKey,
                            primaryKeyValue: item.trim().split("&&")[0],
                            attributeOldValue: item.trim().split("&&")[1],
                            processDate: moment(rowData.processDate).format("DD-MMM-YYYY").toUpperCase(),
                            version: rowData.version,
                            attributeValueSuggestion: aiSuggestion
                        });

                        if (count === adjustableRows.length) {
                            this.setState({
                                openModal: true,
                                adjustableRows
                            });
                        }
                    });
                });
            }
        });
    }

    handleClose = () => {
        this.setState({ openModal: false });
    }

    handleSave = () => {
        applyAdj(this.state.applyAdjPayload).then(res => {
            swal("Saved Successfully.", { icon: "success" });
        }).catch(err => {
            swal("Failed to Save.", { icon: "error" });
            console.log(err);
        });
    }

    setSelectionModel = (newSelection) => {
        console.log(newSelection, gridPayload);
        const g = gridPayload.filter(g => {
            return newSelection.selectionModel.indexOf(g.priVals) > -1;
        });
        this.setState({
            applyAdjPayload: g
        });
    }

    render() {
        const { page, rowsPerPage } = this.state;
        return (
            <div className="exception-summary-class">
                <div className="row bg-white">
                    <div className="col-lg-8 col-md-8 exception-summary-form-class">
                        <FormControl className="exception-summary-form-control">
                            <InputLabel id="es-process-date">Process Date</InputLabel>
                            <Select
                                labelId="es-process-date"
                                id="es-process-date-select"
                                onChange={(e) => this.onSelectChange(e, "processDate")}
                                value={this.state.processDate}
                            >
                                {
                                    [...new Set(this.state.metaData.map(item => item.processDate))].map(m => (
                                        <MenuItem value={m}>{moment(m).format("DD-MMM-YYYY").toUpperCase()}</MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>
                        <FormControl className="exception-summary-form-control">
                            <InputLabel id="es-version">Version</InputLabel>
                            <Select
                                labelId="es-version"
                                id="es-version-select"
                                onChange={(e) => this.onSelectChange(e, "version")}
                                value={this.state.version}
                            >
                                {
                                    [...new Set(this.state.metaData.filter(f =>
                                        f.processDate === this.state.processDate)
                                        .map(item => item.version))].map(m => (
                                            <MenuItem value={m}>{m}</MenuItem>
                                        ))
                                }
                            </Select>
                        </FormControl>
                    </div>
                    <div className="col-lg-4 col-md-4">
                        <FormControl className="exception-summary-form-control float-right mt-5">
                            <ButtonGroup color="primary" aria-label="outlined primary button group">
                                <Button onClick={() => this.onSearchClick()}
                                    disabled={!(this.state.processDate && this.state.version)}>Search</Button>
                                {/* <Button onClick={() => this.onResetClick()}>Reset</Button> */}
                            </ButtonGroup>
                        </FormControl>
                    </div>
                </div>

                {this.state.showCounter && this.state.counterData.length ?
                    <div className="row bg-white mt-2 card">
                        <div className="card-header p-3">Exception Type</div>
                        <div className="card-body p-0">
                            {this.state.counterData.map((counter) => (
                                <div className={"col-lg-" + 12 / this.state.counterData.length +
                                    " col-md-" + 12 / this.state.counterData.length + " counter-section" +
                                    (counter.exceptionType === this.state.selectedRuleType ? " counter-active" : " ")}
                                    onClick={() => this.onCounterClick(counter)}>
                                    <div className="counter-section-head">
                                        <CountUp
                                            duration={3}
                                            end={this.formatNumber(counter.count)[0]}
                                            suffix={" " + this.formatNumber(counter.count)[1]}
                                        />
                                    </div>
                                    <div className="counter-section-body">{counter.exceptionType}</div>
                                </div>
                            ))
                            }
                        </div>
                    </div>
                    : this.state.showCounter && <p className="text-primary text-center mt-4">No Exceptions are availble.</p>
                }
                {this.state.showCounter && this.state.showExceptionSummaryGrid &&
                    <div className="row mt-2">
                        <TableContainer component={Paper}>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        {columns.map((column) => (
                                            <TableCell
                                                key={column.id}
                                                align={column.align}
                                                style={{ minWidth: column.minWidth }}
                                            >
                                                {column.label}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {this.state.exceptionData.filter(item => item["exceptionType"] === this.state.selectedRuleType).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                        return (
                                            <TableRow hover role="checkbox" tabIndex={-1}>
                                                {columns.map((column) => {
                                                    const value = row[column.id];
                                                    return (
                                                        <TableCell key={column.id}>
                                                            { column.showLink ? <a style={{
                                                                color: "#0078d4",
                                                                textDecoration: "underline",
                                                                cursor: "pointer"
                                                            }} onClick={() => this.onGridCount(row)}>{value}</a> : value}
                                                        </TableCell>
                                                    );
                                                })}
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>

                            </Table>
                        </TableContainer>
                        <div style={{ width: "100%" }}>
                            <TablePagination
                                rowsPerPageOptions={[20, 40, 60, 80, 100]}
                                component="div"
                                count={this.state.exceptionData.filter(item => item["exceptionType"] === this.state.selectedRuleType).length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onChangePage={(e, newPage) => this.onHandlePageChange(e, newPage)}
                                onChangeRowsPerPage={(e, rowsPerPage) => this.onHandleChangeRowsPerPage(e, rowsPerPage)}
                            />
                        </div>
                    </div>
                }
                <div>
                    <Modal
                        show={this.state.openModal}
                        dialogClassName="adjustments-modal"
                    >
                        <Modal.Header closeButton>
                            <Modal.Title>Adjustments</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div style={{ height: 350, width: '100%' }}>
                                <DataGrid
                                    rows={this.state.adjustableRows}
                                    columns={adjustmentColumns.map((column) => ({
                                        ...column,
                                        disableClickEventBubbling: true
                                    }))}
                                    pageSize={5}
                                    checkboxSelection
                                    onSelectionModelChange={(newSelection) => this.setSelectionModel(newSelection)}
                                />
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                <Button variant="contained" className="mr-3" onClick={this.handleClose}>
                                    Close
                            </Button>
                                <Button variant="contained" color="primary" onClick={this.handleSave}>
                                    Save
                            </Button>
                            </div>
                            <p style={{ textAlign: "center" }}><strong>Note: </strong> Expiry of Adjustments is set to default by 30 days from the day it is adjusted.</p>
                        </Modal.Footer>
                    </Modal>
                </div>
                <div className={"loading " + (this.state.showLoading ? "loading-show" : "loading-hide")}>
                    <CircularProgress />
                </div>
            </div>
        );
    }
}