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
                        return <button type="button" className="btn btn-light">
                            <FontAwesomeIcon icon={faPrint} style={{ color: "#001DFF", fontSize: "30px" }} />
                        </button>
                    }}
                    content={() => this.componentRef}
                    documentTitle=""
                    pageStyle="print"
                />
                <div style={{ display: 'none' }}>
                    <div ref={el => (this.componentRef = el)}>
                        <div style={{ textAlign: 'left', fontSize: '16px', fontWeight: 'bold' }}> CN CTY CỔ PHẦN TICO</div>
                        <div style={{ textAlign: 'left', fontSize: '16px', fontWeight: 'bold' }}> 83/2B KP. 1B - P.AN PHÚ - TX. THUẬN AN - BD</div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
                            <div style={{ padding: '0 0 0 80px', fontSize: '22px', fontWeight: 'bold' }}>PHIẾU CÂN XE &emsp;&emsp; </div>
                            <div style={{ padding: '0 0 0 20px', fontSize: '15px' }}>STT: {this.props.index} </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px' }}>
                            <div className="dt">Loại hàng: </div>
                            <span>&emsp;{this.props.product}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px' }}>
                            <div className="dt">Khách hàng: </div>
                            <span>&emsp;{this.props.customer}</span>
                        </div>
                        <div style={{ display: 'flex', padding: '20px 20px 20px 50px' }}>
                            <table style={{ fontSize: '15px', padding: '20px', width: '100%' }} >
                                <tbody>
                                    <tr>
                                        <td>- Số Xe</td>
                                        <td style={{ textTransform: 'uppercase' }}>: {this.props.carNumber}</td>
                                    </tr>
                                    <tr>
                                        <td>- Trọng lượng xe & hàng</td>
                                        <td style={{ fontWeight: 'bold' }}>: {Math.max(this.props.firstScale, this.props.secondScale) ? (Math.max(this.props.firstScale, this.props.secondScale)).toLocaleString('en-US') : 0} Kg</td>
                                        <td>- Ngày giờ: </td>
                                        <td>: {this.props.secondScaleDate != null ? (
                                            this.props.styleScale == "Nhập hàng" ? (new Date(this.props.firstScaleDate).toLocaleString('en-IN')) : (new Date(this.props.secondScaleDate).toLocaleString('en-IN'))
                                        ) : (this.props.secondScaleDate === '' ? '' : '')}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>- Trọng lượng xe</td>
                                        <td style={{ fontWeight: 'bold' }}>: {Math.min(this.props.firstScale, this.props.secondScale) ? (Math.min(this.props.firstScale, this.props.secondScale)).toLocaleString('en-US') : 0} Kg</td>
                                        <td>- Ngày giờ:</td>
                                        <td>: {this.props.secondScaleDate != null ? (
                                            this.props.styleScale == "Nhập hàng" ? (new Date(this.props.secondScaleDate).toLocaleString('en-IN')) : (new Date(this.props.firstScaleDate).toLocaleString('en-IN'))
                                        ) : (this.props.secondScaleDate === '' ? '' : '')}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>- Trọng lượng hàng</td>
                                        <td style={{ fontWeight: 'bold' }}>: {this.props.results ? (this.props.results).toLocaleString('en-US') : 0} Kg</td>
                                    </tr>
                                    {this.props.requestedVolume != null && this.props.pumpVolume != null ?
                                        <>
                                            <tr>
                                                <td>- Khối lượng bơm yêu cầu</td>
                                                <td style={{ fontWeight: 'bold' }}>: {(this.props.requestedVolume)} Kg</td>
                                                <td>- Ngày giờ </td>
                                                <td>: {this.props.startTimePump ? (new Date(this.props.startTimePump)).toLocaleString('en-IN') : ''}</td>
                                            </tr>
                                            <tr>
                                                <td>- Khối lượng bơm</td>
                                                <td style={{ fontWeight: 'bold' }}>: {(this.props.pumpVolume)} Kg</td>
                                                <td>- Ngày giờ</td>
                                                <td>: {this.props.endTimePump ? (new Date(this.props.endTimePump)).toLocaleString('en-IN') : ''}</td>
                                            </tr>
                                        </>
                                        : ''}
                                    <tr>
                                        <td>- Số chứng từ</td>
                                        <td style={{ textTransform: 'uppercase' }}>: {this.props.documents}</td>
                                    </tr>
                                    <tr>
                                        <td>- Ghi chú</td>
                                        <td style={{ textTransform: 'uppercase' }}>: {this.props.notes}</td>
                                    </tr>
                                    <tr>
                                        <td>- Kiểu cân</td>
                                        <td style={{ textTransform: 'uppercase' }}>: {this.props.styleScale}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px 0 0 0', textAlign: 'center' }}>
                            <div style={{ paddingRight: '10px', fontSize: '15px' }}></div><div style={{ fontSize: '15px' }}>Bảo vệ</div>
                            <div style={{ paddingRight: '10px', fontSize: '15px' }}></div><div style={{ fontSize: '15px' }}>Tài xế <br />(hoặc đại diện đơn vị)</div>
                            <div style={{ paddingRight: '10px', fontSize: '15px' }}></div><div style={{ fontSize: '15px' }}>Ngày {this.getDays} tháng {this.getMonths} năm {this.getYears}<br /> Người cân</div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default Print;