/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react"
import axios from 'axios';
import ReactPaginate from "react-paginate";
import Print from "./Print";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MoTorOn from "../assets/img/On.png";
import MoTorOff from "../assets/img/Off.png";

const TankPump = () => {
    let limit = 12;
    const url = 'https://100.100.100.156';
    const [tankPump, setTankPump] = useState([]);
    const [pumpValue, setpumpValue] = useState(0);
    const [pageNumber, setPageNumber] = useState(0);
    const [getDataInput, setDataInput] = useState([{
        id: 0,
        ordinalNumber: 0,
        carNumber: "",
        customer: "",
        documents: "",
        product: "",
        sourceOfGoods: "",
        requestedVolume: "",
        pumpVolume: "",
        startTimePump: "",
        endTimePump: "",
        processing: 0
    }]);
    const [changeColor, setChangeColor] = useState(-1);
    const [isCheckbox, setCheckbox] = useState(false);
    const [isCheckValue, setCheckValue] = useState(null);
    const [isMotor, setIsMotor] = useState(false);
    const [animation, setAnimation] = useState(0);
    const pagesVisited = pageNumber * limit;

    const colorChangeBox = async (selected) => {
        if (selected != undefined) {
            setChangeColor(selected)
        }
    }
    useEffect(() => {
        getList();
        let interval = null;
        let intervalTimeOut = null;
        if (getDataInput.pumpVolume <= getDataInput.requestedVolume) {
            isMotorOn();
            if (isMotor == true) {
                interval = setInterval(async () => {
                    await updateTankPump();
                    setAnimation((getDataInput.pumpVolume / getDataInput.requestedVolume) * 100);
                }, 1500);
                if (getDataInput.processing == 2) { refreshData(); toast.success('Đã bơm xong'); }
            }
            else {
                intervalTimeOut = setTimeout(async () => {
                    await updateTankPump();
                }, 2000)
            }
        }
        else {
            isMotorOn();
        }
        return () => { clearInterval(interval); clearTimeout(intervalTimeOut); }
    }, [getDataInput])

    const getList = async () => {
        await axios(url + ':7007/api/TankPump/GetList').then(x => { setTankPump(x.data) }).catch(error => console.log(error));
    }
    const pageCount = Math.ceil(tankPump.length / limit);
    const handlePageClick = async (data) => {
        let currentPage = data.selected + 1
        setPageNumber(currentPage - 1);
    }
    const setValueItem = async (data) => {
        if (isCheckValue === data?.struckID) {
            if (isMotor == true && getDataInput.processing == 1 && getDataInput.pumpVolume < getDataInput.requestedVolume) {
                if (confirm('Bạn có muốn thay đổi')) {
                    refreshData();
                }
            }
            else {
                refreshData();
            }
        }
        else {
            setCheckValue(data?.struckID);
            setDataInput({
                id: data?.struckID,
                ordinalNumber: data?.ordinalNumber,
                carNumber: data?.carNumber,
                customer: data?.customer,
                documents: data?.documents,
                product: data?.product,
                sourceOfGoods: data?.sourceOfGoods,
                requestedVolume: data?.requestedVolume,
                pumpVolume: data?.pumpVolume,
                notes: data?.notes,
                startTimePump: data.startTimePump,
                endTimePump: data.endTimePump,
                createDate: data?.createDate,
                processing: data?.processing
            });
        }
        isMotorOn();
    }
    const handleOnChange = (event) => {
        const { name, value } = event.currentTarget;
        setDataInput((prev) => {
            return {
                ...prev,
                [name]: value,
            }
        })
    }
    const handleCheckbox = async (e) => {
        setCheckbox(e.target.checked);
        if (e.target.checked === true) {
            setTimeout(() => {
                updateTankPump();
                setCheckbox(false);
            }, 500)
        }
        else {
            return toast.error("Lỗi")
        }
    }
    const updateTankPump = async () => {
        await tankpumpvalue();
        const response = await axios.put(url + ':7007/api/TankPump/' + getDataInput.id, getDataInput)
            .then(res => {
                getList();
            })
            .catch(error => { console.log(error) })
    }
    const isMotorOn = async () => {
        try {
            const request = await axios(url + ':39320/iotgateway/read?ids=Channel1.Device1.DongCo').then(res => {
                setIsMotor(res.data.readResults[0].v)
            })
        } catch (e) {
            console.error('Error fetching motor status:', e);
        }
    }
    const tankpumpvalue = async () => {
        if (isMotor == true && getDataInput.pumpVolume <= getDataInput.requestedVolume) {
            const response = await axios(url + ':39320/iotgateway/read?ids=Channel1.Device1.khoiluongbomxe', {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": 'Content-Type, X-Auth-Token, Origin, Authorization'
                },
            }).then(res => {
                setpumpValue(res.data.readResults[0].v);
                setDataInput((prev) => ({ ...prev, pumpVolume: res.data.readResults[0].v }))
            }
            ).catch(error => { toast.error(error) })
        }
    }
    const handleUpdateMotor = async () => {
        await isMotorOn();
        if (isMotor == false) {
            refreshData();
        }
    }
    const refreshData = () => {
        setCheckValue(null);
        setDataInput([]);
        setAnimation(0);
        setChangeColor(-1);
        setpumpValue(0);
    }

    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="glass">
                            <div style={{ display: 'flex', alignItems: 'center', height: '100%', justifyContent: 'center' }}>
                                <span style={{ zIndex: '1' }}>{getDataInput.id != null ? ((getDataInput.pumpVolume / getDataInput.requestedVolume) * 100).toFixed(2) : '0'} %</span>
                            </div>
                            <div className="water" style={{ height: animation + '%', maxHeight: '100%' }}></div>
                        </div>
                        <div className="d-flex flex-column">
                            {isMotor ? <img src={MoTorOn} style={{ maxWidth: '100%', height: '500px', zIndex: '1', imageRendering: 'pixelated' }} /> : <img src={MoTorOff} style={{ maxWidth: '100%', height: '500px', zIndex: '1', imageRendering: 'pixelated' }} />}
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="check-scale">
                    <div className="col-md-12">
                        <div className="input-group">
                            <div className="col-md-2 px-2">
                                <div className="form-check">
                                    <span className="input-group-addon primary px-2" style={{ color: 'blue', fontWeight: 'bold' }}>Khách hàng</span>
                                    <input type="text" className="form-control" id="customer" name="customer" placeholder="#######" value={getDataInput.customer} onChange={(e) => handleOnChange(e)}
                                        style={{ textAlign: 'center', fontSize: '30px' }} />
                                </div>
                            </div>
                            <div className="col-md-2 px-2">
                                <div className="form-check">
                                    <span className="input-group-addon primary px-2" style={{ color: 'blue', fontWeight: 'bold' }}>Nguồn hàng</span>
                                    <input type="text" className="form-control" id="sourceOfGoods" name="sourceOfGoods" placeholder="#######" value={getDataInput.sourceOfGoods} onChange={(e) => handleOnChange(e)}
                                        style={{ textAlign: 'center', fontSize: '30px' }} />
                                </div>
                            </div>
                            <div className="col-md-2 px-2">
                                <div className="form-check">
                                    <span className="input-group-addon primary px-2" style={{ color: 'blue', fontWeight: 'bold' }}>Số xe</span>
                                    <input type="text" className="form-control" id="carNumber" name="carNumber" placeholder="#######" value={getDataInput.carNumber} onChange={(e) => handleOnChange(e)}
                                        style={{ textAlign: 'center', fontSize: '30px' }} />
                                </div>
                            </div>
                            <div className="col-md-2 px-2">
                                <div className="form-check">
                                    <span className="input-group-addon primary px-2" style={{ color: 'blue', fontWeight: 'bold' }}>Khối lượng yêu cầu</span>
                                    <input type="text" className="form-control" id="requestedVolume" name="requestedVolume" placeholder="#######" value={getDataInput.requestedVolume} onChange={(e) => handleOnChange(e)}
                                        style={{ textAlign: 'center', fontSize: '30px' }} />
                                </div>
                            </div>
                            <div className="col-md-2 px-2">
                                <div className="form-check">
                                    <span className="input-group-addon primary px-2" style={{ color: 'blue', fontWeight: 'bold' }}>Lưu</span>
                                    <div className="d-flex justify-content-center align-items-center pt-3">
                                        <input className="form-check-input" type="checkbox" id="isCheckScale" onChange={handleCheckbox} checked={isCheckbox} style={{ border: '1px solid' }} />
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-2 px-2">
                                <div className="form-check">
                                    <span className="input-group-addon primary px-2" style={{ color: 'blue', fontWeight: 'bold' }}>Cập nhật Motor</span>
                                    <div className="d-flex justify-content-center align-items-center pt-3">
                                        <button type="button" className="btn btn-light" onClick={handleUpdateMotor}> Cập nhật
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <ToastContainer
                    position="top-right"
                    autoClose={2000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                />
            </div>
            <div className="row pt-3">
                <div className="col-sm-12">
                    <div className="table-responsive">
                        <table id="scale-table" className="table table-striped table-bordered table-hover">
                            <thead className="thead-light">
                                <tr>
                                    <th></th>
                                    <th>STT</th>
                                    <th>Ngày</th>
                                    <th>Khách hàng</th>
                                    <th>Nguồn hàng</th>
                                    <th>Số xe</th>
                                    <th>Khối lượng yêu cầu (Kg)</th>
                                    <th>Khối lượng bơm (Kg)</th>
                                    <th>Giờ bắt đầu</th>
                                    <th>Giờ kết thúc</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tankPump.slice(pagesVisited, pagesVisited + limit)
                                    .map((item, i) => (
                                        <tr key={item.id} onClick={() => {
                                            setValueItem(item);
                                            colorChangeBox(i)
                                        }}
                                            className={`${changeColor === i ? 'selected' : ''} ${isCheckValue !== item.struckID && isCheckValue != null ? 'disabled-row' : ''}`}
                                        >
                                            <td className="text-center">
                                                <input type="checkbox"
                                                    id={`checkbox-${item.struckID}`}
                                                    checked={isCheckValue === item.struckID}
                                                />
                                            </td>
                                            <td>{item.ordinalNumber}</td>
                                            <td>{item.startTimePump ? (new Date(item.createDate).toLocaleDateString("en-IN")) : ''}</td>
                                            <td>{item.customer}</td>
                                            <td>{item.sourceOfGoods}</td>
                                            <td>{item.carNumber}</td>
                                            <td>{item.requestedVolume}</td>
                                            <td>{item.pumpVolume}</td>
                                            <td>{item.startTimePump ? (new Date(item.startTimePump).toLocaleTimeString("en-US", { hour12: false })) : ''}</td>
                                            <td>{item.endTimePump ? (new Date(item.endTimePump).toLocaleTimeString("en-US", { hour12: false })) : ''}</td>
                                            <td>{(() => {
                                                switch (item.processing) {
                                                    case 0: return "Chưa có thông số";
                                                    case 1: return "Đang bơm";
                                                    case 2: return "Hoàn thành";
                                                }
                                            })()}</td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                    <nav aria-label="Page navigation example">
                        <ReactPaginate
                            previousLabel={'<'}
                            nextLabel={'>'}
                            breakLabel={'...'}
                            pageCount={pageCount}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={3}
                            onPageChange={handlePageClick}
                            containerClassName={'pagination justify-content-end'}
                            pageClassName={'page-item'}
                            pageLinkClassName={'page-link'}
                            previousClassName={'page-item'}
                            previousLinkClassName={'page-link'}
                            nextClassName={'page-item'}
                            nextLinkClassName={'page-link'}
                            activeClassName={'active'} />
                    </nav>
                </div>
            </div>
        </>
    )
}
export default TankPump;