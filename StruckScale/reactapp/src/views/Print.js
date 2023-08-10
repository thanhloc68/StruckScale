﻿/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react'
import ReactToPrint from 'react-to-print';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";


class Print extends React.Component {

    newDate = new Date().toLocaleDateString();
    getDate = this.newDate.split('/');
    getDays = this.getDate[1];
    getMonths = this.getDate[0];
    getYears = this.getDate[2];

    render() {
        return (
            <>
                <ReactToPrint
                    trigger={() => {
                        return <button type="button" className="btn btn-light" /*onClick={(e) => window.print(e)}*/>
                            <FontAwesomeIcon icon={faPrint} style={{ color: "#001DFF", fontSize: "30px" }} />
                        </button>
                    }}
                    content={() => this.componentRef}
                    documentTitle=""
                    pageStyle="print"
                />
                <div style={{ display: 'none' }}>
                    <div ref={el => (this.componentRef = el)}>
                        <div style={{ textAlign: 'left', fontSize: '10px' }}> CN CTY CO PHAN TICO</div>
                        <div style={{ textAlign: 'left', fontSize: '10px' }}> 83/2B KP. 1B - P.AN PHU - TX. THUAN AN - BD</div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
                            <div style={{ padding:'0 0 0 80px' ,fontSize: '20px', fontWeight: 'bold' }}>PHIẾU CÂN XE &emsp;&emsp; </div>
                            <div style={{ padding: '0 0 0 20px',fontSize: '10px' }}>STT: {this.props.index} </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', }} >
                            <div style={{ fontSize: '10px' }}>Loại hàng: {this.props.product}</div>
                            <div style={{ fontSize: '10px' }}>Khách hàng: {this.props.customer}</div>
                        </div>
                        <div style={{ display: 'flex', padding: '20px 20px 20px 50px' }}>
                            <table style={{ fontSize: '12px', padding: '20px', width: '100%' }} >
                                <tr>
                                    <td>- Số Xe</td>
                                    <td>: {this.props.carNumber}</td>
                                </tr>
                                <tr>
                                    <td>- Trọng lượng xe & hàng</td>
                                    <td>: {this.props.results ? (this.props.results).toLocaleString('en-US') : ''} Kg</td>
                                    <td>- Ngày giờ: </td>
                                    <td>: {new Date(this.props.firstScaleDate).toLocaleString()}</td>
                                </tr>
                                <tr>
                                    <td>- Trọng lượng xe</td>
                                    <td>: {this.props.firstScale ? (this.props.firstScale).toLocaleString('en-US') : ''} Kg</td>
                                    <td>- Ngày giờ:</td>
                                    <td>: {new Date(this.props.firstScaleDate).toLocaleString()}</td>

                                </tr>
                                <tr>
                                    <td>- Trọng lượng hàng</td>
                                    <td>: {this.props.secondScale ? (this.props.secondScale).toLocaleString('en-US') : ''} Kg</td>
                                </tr>
                                <tr>
                                    <td>- Số chứng từ</td>
                                    <td>: {this.props.documents}</td>
                                </tr>
                                <tr>
                                    <td>- Ghi chú</td>
                                    <td>: {this.props.notes}</td>
                                </tr>
                                <tr>
                                    <td>- Kiểu cân</td>
                                    <td>: {this.props.styleScale}</td>
                                </tr>
                            </table>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px 0 0 0', textAlign: 'center' }}>
                            <div style={{ paddingRight: '10px', fontSize: '12px' }}></div><div style={{ fontSize: '12px' }}>Bảo vệ</div>
                            <div style={{ paddingRight: '10px', fontSize: '12px' }}></div><div style={{ fontSize: '12px' }}>Tài xế <br />(hoặc đại diện đơn vị)</div>
                            <div style={{ paddingRight: '10px', fontSize: '12px' }}></div><div style={{ fontSize: '12px' }}>Ngày {this.getDays} tháng {this.getMonths} năm {this.getYears}<br /> Người cân</div>
                        </div>
                    </div>
                </div>

            </>
        )
    }
}

export default Print;