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
                        <p>2021 &copy; Hotel Aryaduta </p>
                    </div>
                    <div className="float-end">
                        <p> <a href="https://www.rst.net.id">Versi {process.env.MIX_APP_VER}</a> </p>
                    </div>
                </div>
            </footer>
        );
    }
}

export default Footer;
