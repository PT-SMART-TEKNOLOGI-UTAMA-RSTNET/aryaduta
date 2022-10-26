import React from "react";

class Guest extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            current_user : JSON.parse(localStorage.getItem('_user'))
        }
    }
    render() {
        return (
            <>
                <div className="col-6 col-sm-12 col-md-6 col-lg-3">
                    <div className="card">
                        <div className="card-body px-4 py-4-5">
                            <div className="row">
                                <div
                                    className="col-md-4 col-lg-12 col-xl-12 col-xxl-5 d-flex justify-content-start ">
                                    <div className="stats-icon green mb-2">
                                        <i className="fa fa-bed"/>
                                    </div>
                                </div>
                                <div className="col-md-8 col-lg-12 col-xl-12 col-xxl-7">
                                    <h6 className="text-muted font-semibold">Room Number</h6>
                                    <h6 className="font-extrabold mb-0">80.000</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-6 col-sm-12 col-md-6 col-lg-3">
                    <div className="card">
                        <div className="card-body px-4 py-4-5">
                            <div className="row">
                                <div className="col-md-4 col-lg-12 col-xl-12 col-xxl-5 d-flex justify-content-start ">
                                    <div className="stats-icon purple mb-2">
                                        <i className="fa fa-user-tie"/>
                                    </div>
                                </div>
                                <div className="col-md-8 col-lg-12 col-xl-12 col-xxl-7">
                                    <h6 className="text-muted font-semibold">Guests</h6>
                                    <h6 className="font-extrabold mb-0">112.000</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-6 col-sm-12 col-md-6 col-lg-3">
                    <div className="card">
                        <div className="card-body px-4 py-4-5">
                            <div className="row">
                                <div
                                    className="col-md-4 col-lg-12 col-xl-12 col-xxl-5 d-flex justify-content-start ">
                                    <div className="stats-icon red mb-2">
                                        <i className="fa fa-calendar"/>
                                    </div>
                                </div>
                                <div className="col-md-8 col-lg-12 col-xl-12 col-xxl-7">
                                    <h6 className="text-muted font-semibold">Last Visit</h6>
                                    <h6 className="font-extrabold mb-0">183.000</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-6 col-sm-12 col-md-6 col-lg-3">
                    <div className="card">
                        <div className="card-body px-4 py-4-5">
                            <div className="row">
                                <div
                                    className="col-md-4 col-lg-12 col-xl-12 col-xxl-5 d-flex justify-content-start ">
                                    <div className="stats-icon green mb-2">
                                        <i className="fa fa-money-bill"></i>
                                    </div>
                                </div>
                                <div className="col-md-8 col-lg-12 col-xl-12 col-xxl-7">
                                    <h6 className="text-muted font-semibold">Billing</h6>
                                    <h6 className="font-extrabold mb-0">112</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default Guest;
