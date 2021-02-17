import React, { Component, Fragment } from "react";
import {
    Select, InputLabel, MenuItem, FormControl, ButtonGroup, Button,
    Table, TableHead, TableBody, TableCell, TableContainer, TableFooter, TablePagination, TableRow,
    Paper
} from '@material-ui/core';
import CountUp from "react-countup";

const counterData = [
    {
        exceptionType: "Business Validation",
        count: 16000
    },
    {
        exceptionType: "Conformity Check",
        count: 1000
    }
];

const columns = [
    { id: 'ruleId', label: 'Rule ID' },
    { id: 'tableName', label: 'Table Name' },
    { id: 'exceptionType', label: 'Exception Type' },
    {
        id: 'attribute',
        label: 'Attribute'
    },
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

const rows = [
    {
        ruleId: "DQ_BV_001",
        tableName: "Customer Base",
        exceptionType: "Business Validation",
        attribute: "city",
        primaryKey: "PAN",
        primaryKeyValue: "AMEUD3967Z",
        count: 4
    }
];

export default class ExceptionSummary extends Component {

    constructor(props) {
        super(props);

        this.state = {
            page: 0,
            rowsPerPage: 20,
            showCounter: false,
            showExceptionSummaryGrid: false
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
                [type]: value
            });
        } else {
            this.setState({
                [type]: value
            });
        }
    }

    onSearchClick() {
        if (this.state.tableName) {
            this.setState({
                showCounter: true
            });
        }
    }

    onResetClick() {
        this.setState({
            showCounter: false,
            showExceptionSummaryGrid: false,
            tableName: "",
            page: 0,
            rowsPerPage: 20
        });
    }

    onCounterClick(e) {
        this.setState({
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
                                <MenuItem value="Customer Base">Customer Base</MenuItem>
                                <MenuItem value="IPO Application">IPO Application</MenuItem>
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
                        <div className="card-body p-0 pr-3">
                            {counterData.map((e, i) => (
                                <div className={"col-lg-" + 12 / counterData.length + " col-md-" + 12 / counterData.length + " counter-section"} onClick={(e) => this.onCounterClick(e)}>
                                    <div className="counter-section-head">
                                        <CountUp
                                            duration={3}
                                            end={this.formatNumber(e.count)[0]}
                                            suffix={" " + this.formatNumber(e.count)[1]}
                                        />
                                    </div>
                                    <div className="counter-section-body">{e.exceptionType}</div>
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
                                    {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
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
                                                            }}>{value}</a> : value}
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
                                count={rows.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onChangePage={(e, newPage) => this.onHandlePageChange(e, newPage)}
                                onChangeRowsPerPage={(e, rowsPerPage) => this.onHandleChangeRowsPerPage(e, rowsPerPage)}
                            />
                        </div>
                    </div>
                }
            </div>
        );
    }
}