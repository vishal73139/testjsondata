import React, { Component, Fragment } from "react";
import {
    Select, InputLabel, MenuItem, FormControl, ButtonGroup, Button,
    Table, TableHead, TableBody, TableCell, TableContainer, TableFooter, TablePagination, TableRow,
    Paper, Input
} from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';
import { Modal } from 'react-bootstrap';
import CountUp from "react-countup";
import { getExceptionType } from '../../redux/Httpcalls';
import moment from 'moment';

const columns = [
    { id: 'ruleId', label: 'Rule ID' },
    { id: 'tableName', label: 'Table Name' },
    { id: 'exceptionType', label: 'Exception Type' },
    { id: 'attribute', label: 'Attribute' },
    {
        id: 'primaryKey',
        label: 'Primary Key'
    },
    {
        id: 'primaryKeyValue',
        label: 'Primary Key Value'
    },
    {
        id: 'count',
        label: 'Count',
        showLink: true
    },
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
        flex: 1
    },
    {
        field: "primaryKeyValue",
        headerName: "Primary Key Value",
        flex: 1
    },
    {
        field: "attribute",
        headerName: "Attribute Name",
        flex: 1
    },
    {
        field: "attributeOldValue",
        headerName: "Attribute Old Value",
        flex: 1
    },
    {
        field: "attributeNewValue",
        headerName: "Attribute New Value",
        flex: 1,
        renderCell: (params) => {
            const onAdjustmentEdit = (e) => {
                let obj = {
                    tableName: params.row.tableName,
                    priCols: params.row.primaryKey,
                    priVals: params.row.primaryKeyValue,
                    oldVal: params.row.attributeOldValue,
                    newVal: e.target.value,
                    adjustedTime: moment(new Date()).format("YY-MM-DD hh:mm:ss.SSS"),
                    expiryDate: moment(new Date()).add(30, 'day').format("YY-MM-DD hh:mm:ss.SSS")
                };
                this.setState({
                    payload: [
                        ...this.state.payload || [],
                        obj
                    ]
                });
            }
            return <Input placeholder="Suggestions" onChange={(e) => onAdjustmentEdit(e)} />
        }
    }
]

export default class ExceptionSummary extends Component {

    constructor(props) {
        super(props);

        this.state = {
            page: 0,
            rowsPerPage: 20,
            showCounter: false,
            showExceptionSummaryGrid: false,
            counterData: [],
            exceptionData: []
        }
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
        if (this.state.tableName) {
            getExceptionType({ tableName: this.state.tableName }).then((response) => {
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
        let adjustableRows = [];
        "a$$b$$c$$d$$e$$f".split("$$").forEach((item) => {
            adjustableRows.push({
                id: item,
                tableName: rowData.tableName,
                attribute: rowData.attribute,
                primaryKey: rowData.primaryKey,
                primaryKeyValue: item,
                attributeOldValue: 123
            });
        });
        this.setState({
            openModal: true,
            adjustableRows
        });
    }

    handleClose = () => {
        this.setState({ openModal: false });
    }

    render() {
        const { page, rowsPerPage } = this.state;
        return (
            <div className="exception-summary-class">
                <div className="row bg-white">
                    <div className="col-lg-8 col-md-8 exception-summary-form-class">
                        <FormControl className="exception-summary-form-control">
                            <InputLabel id="es-table-name">Table Name</InputLabel>
                            <Select
                                labelId="es-table-name"
                                id="es-table-name-select"
                                onChange={(e) => this.onSelectChange(e, "tableName")}
                                value={this.state.tableName}
                            >
                                <MenuItem value="customer_base">Customer Base</MenuItem>
                                <MenuItem value="ipo_application">IPO Application</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    <div className="col-lg-4 col-md-4">
                        <FormControl className="exception-summary-form-control float-right mt-5">
                            <ButtonGroup color="primary" aria-label="outlined primary button group">
                                <Button onClick={() => this.onSearchClick()} disabled={!this.state.tableName}>Search</Button>
                                {/* <Button onClick={() => this.onResetClick()}>Reset</Button> */}
                            </ButtonGroup>
                        </FormControl>
                    </div>
                </div>

                {this.state.showCounter &&
                    <div className="row bg-white mt-2 card">
                        <div className="card-header p-3">Exception Type</div>
                        <div className="card-body p-0">
                            {this.state.counterData.map((counter) => (
                                <div className={"col-lg-" + 12 / this.state.counterData.length + " col-md-" + 12 / this.state.counterData.length + " counter-section"}
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
                            <div style={{ height: 400, width: '100%' }}>
                                <DataGrid rows={this.state.adjustableRows} columns={adjustmentColumns} pageSize={5} checkboxSelection />
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <div style={{display: "flex", justifyContent: "flex-end"}}>
                                <Button variant="contained" className="mr-3" onClick={this.handleClose}>
                                    Close
                            </Button>
                                <Button variant="contained" color="primary" onClick={this.handleSave}>
                                    Save
                            </Button>
                            </div>
                            <p style={{textAlign: "center"}}><strong>Note <sup>:</sup></strong> Expiry of Adjustments is set to default by 30 days from the day it is adjusted.</p>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>
        );
    }
}