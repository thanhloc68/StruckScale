﻿/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from 'axios';
import ReactPaginate from "react-paginate";
import Print from "../components/Print";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile } from "@fortawesome/free-regular-svg-icons";
import MoTorOn from "../assets/img/On.png";
import MoTorOff from "../assets/img/Off.png";
import url from '../components/url'
const TankPump = () => {
    let limit = 12;
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
        results: "",
        firstScale: "",
        firstScaleDate: "",
        secondScale: "",
        secondScaleDate: "",
        styleScale: "",
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
    const [roles, setRoles] = useState(false);
    const pagesVisited = pageNumber * limit;
    const [product, setProduct] = useState([]);
    const [productName, setProductName] = useState("LASP")
    const [activeIndex, setActiveIndex] = useState(0)
    const navigate = useNavigate();
    const token = JSON.parse(localStorage.getItem("token"));
    let header;
    if (token) {
        header = {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Authorization": `Bearer ${(token.accessToken).replace(/"/g, '')}`
        }
    }
    else {
        navigate("/")
    }
    useEffect(() => {
        getList();
        getProduct();
        blockInputPump();
        setAnimation((getDataInput.pumpVolume / getDataInput.requestedVolume) * 100);
        let interval = null;
        let intervalTimeOut = null;
        const getItem = JSON.parse(localStorage.getItem('data-input'));
        const getItemIndex = JSON.parse(localStorage.getItem('data-index'));
        if (getItem && getItemIndex) {
            setCheckValue(getItem.struckId);
            setProductName(getItem.product);
            setActiveIndex(getItemIndex);
        }
        if (getDataInput.pumpVolume <= getDataInput.requestedVolume && getDataInput.processing == 1) {
            isMotorOn();
            if (isMotor == true) {
                interval = setInterval(async () => {
                    await updateTankPump();
                }, 1000);
                if (getDataInput.pumpVolume === getDataInput.requestedVolume) {
                    updateTankPump();
                    localStorage.removeItem('data-input')
                }
            }
            else {
                intervalTimeOut = setTimeout(async () => {
                    await updateTankPump();
                }, 2000)
            }
        }
        else {
            isMotorOn();
            if (isMotorOn === false) {
                localStorage.removeItem('data-input')
            }
            if (getDataInput.processing === 2) {
                toast.success('Đã bơm xong');
            }
        }
        return () => { clearInterval(interval); clearTimeout(intervalTimeOut); }
    }, [getDataInput, roles, isMotor])
    const blockInputPump = async () => {
        if (token.roles !== 4) {
            var inputContent = document.getElementsByTagName("input");
            var exceptButtonUpdateMotor = document.getElementById("updateMotor");
            [...inputContent, exceptButtonUpdateMotor].forEach((input) => {
                input.disabled = true;
            })
        }
    }
    const getProduct = async () => {
        await axios(url + ':7007/api/Product/get', { headers: header }).then(x => { setProduct(x.data) }).catch(error => console.log(error));
    }
    const colorChangeBox = async (selected) => {
        if (selected != undefined) {
            await setChangeColor(selected)
        }
    }
    const getList = async () => {
        try {
            await axios(url + ':7007/api/TankPump/GetList', { headers: header }).then(x => { setTankPump(x.data) })
        } catch (e) {
            if (e.response) {
                if (e.response.status == "403") {
                    setRoles(true)
                }
            }
        }
    }
    const pageCount = Math.ceil(tankPump.length / limit);
    const handlePageClick = async (data) => {
        let currentPage = data.selected + 1
        setPageNumber(currentPage - 1);
    }
    const setValueItem = async (data) => {
        if (isCheckValue === data?.struckId) {
            if (isMotor == true && getDataInput.processing == 1 && getDataInput.pumpVolume < getDataInput.requestedVolume) {
                //if (confirm('Bạn có muốn thay đổi')) {
                //    refreshData();
                //}
            }
            else {
                setDataInput({
                    id: data?.struckId,
                    ordinalNumber: data?.ordinalNumber,
                    carNumber: data?.carNumber,
                    customer: data?.customer,
                    documents: data?.documents,
                    product: data?.product,
                    results: data?.results,
                    firstScale: data?.firstScale,
                    firstScaleDate: data?.firstScaleDate,
                    secondScale: data?.secondScale,
                    secondScaleDate: data?.secondScaleDate,
                    styleScale: data?.styleScale,
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
        }
        else {
            localStorage.setItem('data-input', JSON.stringify(data));
            setCheckValue(data?.struckId);
            setDataInput({
                id: data?.struckId,
                ordinalNumber: data?.ordinalNumber,
                carNumber: data?.carNumber,
                customer: data?.customer,
                documents: data?.documents,
                product: data?.product,
                results: data?.results,
                firstScale: data?.firstScale,
                firstScaleDate: data?.firstScaleDate,
                secondScale: data?.secondScale,
                secondScaleDate: data?.secondScaleDate,
                styleScale: data?.styleScale,
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
    const setValueProduct = async (data, index) => {
        setProductName(data)
        setActiveIndex(index);
        localStorage.setItem('data-index', index);
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
        try {
            if (token.roles == 4 && isMotor == true && getDataInput.pumpVolume <= getDataInput.requestedVolume) {
                if (getDataInput.pumpVolume >= getDataInput.requestedVolume) {
                    setDataInput((prev) => ({ ...prev, processing: 2 }))
                    return;
                }
                const firstResponse = await axios(url + ':39320/iotgateway/read?ids=Channel1.Device1.khoiluongbomxe', {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Headers": 'Content-Type, X-Auth-Token, Origin, Authorization'
                    }
                });
                const pumpVolume = firstResponse.data.readResults[0].v;
                setpumpValue(pumpVolume);
                setDataInput((prev) => ({ ...prev, pumpVolume: pumpVolume }))
                await axios.put(url + ':7007/api/TankPump/' + getDataInput.id, { ...getDataInput, pumpVolume }, {
                    headers: header
                });
                await getList();
            }
        } catch (e) {
            if (getDataInput.processing === 2) {
                toast.success('Đã bơm xong');
            }
        }
    }
    const isMotorOn = async () => {
        try {
            await axios(url + ':39320/iotgateway/read?ids=Channel1.Device1.DongCo', {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": 'Content-Type, X-Auth-Token, Origin, Authorization'
                }
            }).then(res => {
                setIsMotor(res.data.readResults[0].v)
            })
        } catch (e) {
            console.error('Error fetching motor status:', e);
        }
    }
    const handleUpdateMotor = async () => {
        if (token.roles == 4) {
            await isMotorOn();
        }
        //if (isMotor == false) {
        //    refreshData();
        //}
    }
    const refreshData = () => {
        if (getDataInput.processing == 1 && token.roles == 4) {
            toast.error("Đang bơm")
        }
        else {
            setCheckValue(null);
            setDataInput({
                id: 0,
                ordinalNumber: 0,
                carNumber: "",
                customer: "",
                documents: "",
                product: "",
                results: "",
                firstScale: "",
                firstScaleDate: "",
                secondScale: "",
                secondScaleDate: "",
                styleScale: "",
                sourceOfGoods: "",
                requestedVolume: "",
                pumpVolume: "",
                startTimePump: "",
                endTimePump: "",
                processing: 0
            });
            setAnimation(0);
            setChangeColor(-1);
            setpumpValue(0);
            localStorage.removeItem('data-input')
            localStorage.removeItem('data-index')
        }
    }
    return (
        <>
            <div className="col-md-12">
                <ul className="nav nav-tabs" id="myTab" role="tablist">
                    {product.filter(x => x.status == 1).map((item, index) => (
                        <li className="nav-item" role="presentation" key={item.id}>
                            <button className={`nav-link ${index === activeIndex ? 'active' : ''}`}
                                onClick={() => setValueProduct(item.name, index)}
                                id={`${item.name}-tab`}
                                data-bs-toggle="tab"
                                data-bs-target={`#${item.name}-tab-pane`}
                                type="button"
                                role="tab"
                                aria-controls={`${item.name}`}
                                aria-selected={`${index === activeIndex ? 'true' : 'false'}`}>Xe bồn {item.name}</button>
                        </li>
                    ))}
                </ul>
                <div className="tab-content" id="myTabContent">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12 showTankPump">
                                <div className="glass">
                                    <div style={{ display: 'flex', alignItems: 'center', height: '100%', justifyContent: 'center' }}>
                                        <span style={{ zIndex: '1' }}>{getDataInput.id != null ? ((getDataInput.pumpVolume / getDataInput.requestedVolume) * 100).toFixed(2) : '0'} %</span>
                                    </div>
                                    <div className="water" style={{ height: animation + '%' }}></div>
                                </div>
                                <div className="tankpump d-flex flex-column">
                                    {isMotor ? <img src={MoTorOn} style={{ maxWidth: '100%', height: '500px', zIndex: '1', imageRendering: 'pixelated' }} /> : <img src={MoTorOff} style={{ maxWidth: '100%', height: '500px', zIndex: '1', imageRendering: 'pixelated' }} />}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div><span style={{ fontSize: "30px" }}>Khối lượng (Kg): {pumpValue}</span></div>
                        <div className="check-scale">
                            <div className="col-md-12">
                                <div className="input-group">
                                    <div className="col-md-2 px-2">
                                        <div>
                                            <span className="input-group-addon primary px-2" style={{ color: 'blue', fontWeight: 'bold' }}>Khách hàng</span>
                                        </div>
                                        <input type="text" className="form-control" id="customer" name="customer" placeholder="#######" value={getDataInput.customer} onChange={(e) => handleOnChange(e)}
                                            style={{ textAlign: 'center', fontSize: '30px' }} disabled readOnly/>
                                    </div>
                                    <div className="col-md-2 px-2">
                                        <div>
                                            <span className="input-group-addon primary px-2" style={{ color: 'blue', fontWeight: 'bold' }}>Nguồn hàng</span>
                                        </div>
                                        <input type="text" className="form-control" id="sourceOfGoods" name="sourceOfGoods" placeholder="#######" value={getDataInput.sourceOfGoods} onChange={(e) => handleOnChange(e)}
                                            style={{ textAlign: 'center', fontSize: '30px' }} />
                                    </div>
                                    <div className="col-md-2 px-2">
                                        <div>
                                            <span className="input-group-addon primary px-2" style={{ color: 'blue', fontWeight: 'bold' }}>Số xe</span>
                                        </div>
                                        <input type="text" className="form-control" id="carNumber" name="carNumber" placeholder="#######" value={getDataInput.carNumber} onChange={(e) => handleOnChange(e)}
                                            style={{ textAlign: 'center', fontSize: '30px' }} readOnly disabled />
                                    </div>
                                    <div className="col-md-2 px-2">
                                        <div>
                                            <span className="input-group-addon primary px-2" style={{ color: 'blue', fontWeight: 'bold' }}>Khối lượng yêu cầu</span>
                                        </div>
                                        <input type="text" className="form-control" id="requestedVolume" name="requestedVolume" placeholder="#######" value={getDataInput.requestedVolume} onChange={(e) => handleOnChange(e)}
                                            style={{ textAlign: 'center', fontSize: '30px' }} />
                                    </div>
                                    <div className="col-md-2 px-2">
                                        <div>
                                            <span className="input-group-addon primary px-2" style={{ color: 'blue', fontWeight: 'bold' }}>Lưu</span>
                                        </div>
                                        <div className="d-flex justify-content-center align-items-center pt-3">
                                            <input className="form-check-input" type="checkbox" id="isCheckScale" onChange={handleCheckbox} checked={isCheckbox} style={{ border: '1px solid' }} />
                                        </div>
                                    </div>
                                    <div className="col-md-2 px-2">
                                        <div>
                                            <span className="input-group-addon primary px-2" style={{ color: 'blue', fontWeight: 'bold' }}>Cập nhật Motor</span>
                                        </div>
                                        <div className="d-flex justify-content-center align-items-center pt-2">
                                            <button type="button" id="updateMotor" className="btn btn-light" onClick={handleUpdateMotor}> Cập nhật
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex align-items-center pt-2">
                        <div className="buttons me-auto">
                            <button type="button" id="refreshData" className="btn btn-light" onClick={refreshData}>
                                <FontAwesomeIcon icon={faFile} style={{ fontSize: "30px" }} />
                            </button>
                            <Print
                                index={getDataInput.ordinalNumber}
                                product={getDataInput.product}
                                customer={getDataInput.customer}
                                carNumber={getDataInput.carNumber}
                                results={getDataInput.results}
                                firstScale={getDataInput.firstScale}
                                firstScaleDate={getDataInput.firstScaleDate}
                                secondScale={getDataInput.secondScale}
                                secondScaleDate={getDataInput.secondScaleDate}
                                requestedVolume={getDataInput.requestedVolume}
                                pumpVolume={getDataInput.pumpVolume}
                                startTimePump={getDataInput.startTimePump}
                                endTimePump={getDataInput.endTimePump}
                                documents={getDataInput.documents}
                                notes={getDataInput.notes}
                                styleScale={getDataInput.styleScale}
                                isDone={getDataInput.isDone}
                            />
                        </div>
                    </div>
                    <div className="tab-pane fade show active" id={`${productName === activeIndex ? productName : ''}-tab-pane`} role="tabpanel" aria-labelledby={`${productName === activeIndex ? productName : ''}-tab`} tabIndex="0">
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
                                                <th>Sản phẩm</th>
                                                <th>Nguồn hàng</th>
                                                <th>Số xe</th>
                                                <th>Khối lượng yêu cầu (Kg)</th>
                                                <th>Khối lượng bơm (Kg)</th>
                                                <th>Giờ bắt đầu</th>
                                                <th>Giờ kết thúc</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {tankPump.slice(pagesVisited, pagesVisited + limit)
                                                .filter(condition => condition.product == productName)
                                                .map((item, i) => (
                                                    <tr key={item.id} onClick={() => {
                                                        setValueItem(item);
                                                        colorChangeBox(i)
                                                    }}
                                                        className={`${changeColor === i ? 'selected' : ''} ${isCheckValue !== item.struckId && isCheckValue != null ? 'disabled-row' : ''}`}
                                                    >
                                                        <td className="text-center">
                                                            <input type="checkbox"
                                                                id={`checkbox-${item.struckId}`}
                                                                checked={isCheckValue === item.struckId}
                                                            />
                                                        </td>
                                                        <td>{item.ordinalNumber}</td>
                                                        <td>{item.startTimePump ? (new Date(item.createDate).toLocaleDateString("en-IN")) : ''}</td>
                                                        <td>{item.customer}</td>
                                                        <td>{item.product}</td>
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
            </div>
        </>
    )
}
export default TankPump;