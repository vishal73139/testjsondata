import React, { Component, Fragment } from "react";
import { Select, InputLabel, MenuItem, FormControl, ButtonGroup, Button } from '@material-ui/core';
import CountUp from "react-countup";

export default class ExceptionSummary extends Component {
    render() {
        return (
            <div className="exception-summary-class">
                <div className="row bg-white">
                    <div className="col-lg-8 col-md-8 exception-summary-form-class">
                        <FormControl className="exception-summary-form-control">
                            <InputLabel id="es-application-date">Application Date</InputLabel>
                            <Select
                                labelId="es-application-date"
                                id="es-application-date-select"
                            >
                                <MenuItem value="31-JAN-2021">31-JAN-2021</MenuItem>
                                <MenuItem value="31-DEC-2020">31-DEC-2020</MenuItem>
                                <MenuItem value="30-NOV-2020">30-NOV-2020</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl className="exception-summary-form-control">
                            <InputLabel id="es-trading-platform">Trading Platform</InputLabel>
                            <Select
                                labelId="es-trading-platform"
                                id="es-trading-platform-select"
                            >
                                <MenuItem value="BSE">BSE</MenuItem>
                                <MenuItem value="NASDAQ">NASDAQ</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    <div className="col-lg-4 col-md-4">
                        <FormControl className="exception-summary-form-control float-right mt-5">
                            <ButtonGroup color="primary" aria-label="outlined primary button group">
                                <Button>Search</Button>
                                <Button>Reset</Button>
                            </ButtonGroup>
                        </FormControl>
                    </div>
                </div>
                <div className="row bg-white mt-2 card">
                    <div className="card-header p-3">Exception Type</div>
                    <div className="card-body p-0 pr-3">
                        <div className="col-lg-6 col-md-6 counter-section">
                            <div className="counter-section-head">
                                <CountUp
                                    duration={3}
                                    end={1600}
                                    suffix={" " + "K"}
                                />
                            </div>
                            <div className="counter-section-body">Business Validation</div>
                        </div>
                        <div className="col-lg-6 col-md-6 counter-section">
                            <div className="counter-section-head">
                                <CountUp
                                    duration={3}
                                    end={1000}
                                    suffix={" " + "K"}
                                />
                            </div>
                            <div className="counter-section-body">Conformity Check</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}