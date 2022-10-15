import React from "react";

class Footer extends React.Component{
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <footer>
                <div className="footer clearfix mb-0 text-muted">
                    <div className="float-start">
                        <p>2021 &copy; RSTnet</p>
                    </div>
                    <div className="float-end">
                        <p>
                            Crafted with <span className="text-danger"><i className="bi bi-heart-fill icon-mid"/></span>
                            by <a href="https://www.rst.net.id">RSTnet</a>
                        </p>
                    </div>
                </div>
            </footer>
        );
    }
}

export default Footer;
