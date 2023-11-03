/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import ReactPaginate from "react-paginate";
import Clock from "../components/Clock";
import Print from "../components/Print";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faFloppyDisk, faCircleStop, faEdit, faPlusSquare } from "@fortawesome/free-regular-svg-icons";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import PopUpCenter from "../components/popupcustomer";
import url from '../components/url'
const ScaleStruck = () => {
    let limit = 12;
    const [loading, setLoading] = useState(false)
    //Lấy dữ liệu từ danh sách cân
    const [struckScale, setStruckScale] = useState([])
    //Lấy dữ liệu lên input text
    const [getDataInput, setDataInput] = useState([{
        id: 0,
        ordinalNumber: 0,
        carNumber: "",
        customer: "",
        documents: "",
        product: "",
        firstScale: 0,
        secondScale: 0,
        notes: "",
        firstScaleDate: "",
        secondScaleDate: "",
        results: 0,
        styleScale: "",
        isDel: "",
        isDone: false,
        sourceOfGoods: "",
        requestedVolume: 0,
        pumpVolume: 0,
        startTimePump: null,
        endTimePump: null,
        processing: 0
    }]);
    //Nhập số cân bằng checkbox
    const [isCheckbox, setCheckbox] = useState(false);
    //Lấy số trang
    const [pageNumber, setPageNumber] = useState(0);
    //Lấy dữ liệu khách hàng
    const [selectCustomer, setSelectCustomer] = useState([""]);
    //Lấy dữ liệu sản phẩm
    const [selectProduct, setSelectProduct] = useState([""]);
    //button hiển thị popup khách hàng
    const [buttonPopupCustomer, setButtonPopupCustomer] = useState(false);
    //button hiển thị popup sản phẩm
    const [buttonPopupProduct, setButtonPopupProduct] = useState(false);
    const [getDataPopup, setDataPopup] = useState([{
        id: 0,
        shortcutName: "",
        name: "",
        status: "",
    }]);
    //set cờ cân lần 1 lần 2
    const [isFirstScale, setIsFirstScale] = useState(false);
    const [isSecondScale, setIsSecondScale] = useState(false);
    const [changeColor, setChangeColor] = useState(-1);
    const [roles, setRoles] = useState(false);
    const pagesVisited = pageNumber * limit;
    const pageCount = Math.ceil(struckScale.length / limit);
    const navigate = useNavigate();
    let token = JSON.parse(localStorage.getItem("token"));
    let header;
    if (token) {
        header = {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Authorization": `Bearer ${(token.accessToken).replace(/"/g, '')}`
        }
    }
    else {
        navigate('/')
    }
    useEffect(() => {
        getList();
        getListProduct();
        getListCustomer();
        let interval = null;
        if (isFirstScale) {
            interval = setInterval(() => {
                getNumScale();
            }, 2000);
        }
        if (isSecondScale) {
            interval = setInterval(() => {
                getNumScale();
            }, 2000);
        }
        return () => clearInterval(interval);

    }, [isFirstScale, isSecondScale]);
    //Lấy api số cân
    const getNumScale = async () => {
        try {
            if (isFirstScale == true) {
                //await axios.get('https://127.0.0.1:39320/iotgateway/read?ids=Channel2.USR.ScaleValue')
                await axios.get(url + ':39320/iotgateway/read?ids=Channel1.Device1.tag1', {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        "Access-Control-Allow-Origin": "*",
                    },
                })
                    .then(res => setDataInput((prev) => ({ ...prev, firstScale: res.data.readResults[0].v })))
                    .catch(err => { return toast.error(err) })
            }
            if (isFirstScale == false && isSecondScale == true) {
                //await axios.get('https://127.0.0.1:39320/iotgateway/read?ids=Channel2.USR.ScaleValue')
                await axios.get(url + ':39320/iotgateway/read?ids=Channel1.Device1.tag1', {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        "Access-Control-Allow-Origin": "*",
                    },
                })
                    .then(res => setDataInput((prev) => ({ ...prev, secondScale: res.data.readResults[0].v })))
                    .catch(err => { return toast.error(err) })
            }
        } catch (e) {
            return toast.error(e)
        }
    }
    //Lấy danh sách cân
    const getList = async () => {
        try {
            setLoading(true);
            await axios.get(url + ':7007/api/scale/get', {
                headers: header
            }).then(res => {
                setStruckScale(res.data);
            })
        } catch (e) {
            if (e.response) {
                if (e.response.status === "403") {
                    setRoles(true)
                }
            }
        }
        finally {
            setLoading(false);
        }
    };
    const handlePageClick = async (data) => {
        let selectPage = data.selected + 1;
        setPageNumber(selectPage - 1);
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
    const setValueItem = async (data) => {
        setDataInput({
            id: data?.struckId,
            ordinalNumber: data?.ordinalNumber,
            carNumber: data?.carNumber,
            customer: data?.customer,
            documents: data?.documents,
            product: data?.product,
            firstScale: data?.firstScale,
            secondScale: data?.secondScale,
            notes: data?.notes,
            firstScaleDate: data.firstScaleDate,
            secondScaleDate: data.secondScaleDate,
            results: data?.results,
            isDel: data?.isDel,
            styleScale: data?.styleScale,
            isDone: data?.isDone,
            sourceOfGoods: data?.sourceOfGoods,
            requestedVolume: data?.requestedVolume,
            pumpVolume: data?.pumpVolume,
            startTimePump: data.startTimePump,
            endTimePump: data.endTimePump,
            processing: data?.processing
        });
        if (isFirstScale == false && isSecondScale == false || isSecondScale == true && data.firstScale <= 0 && data.secondScale <= 0) {
            setIsFirstScale(true);
            setIsSecondScale(false);
        }
        if (data.firstScale > 0 && data.secondScale <= 0) {
            setIsFirstScale(false);
            setIsSecondScale(true);
        }
        if (data.firstScale > 0 && data.secondScale > 0) {
            setIsFirstScale(false);
            setIsSecondScale(false);
        }
    }
    const colorChangeBox = async (selected) => {
        if (selected != undefined) {
            setChangeColor(selected)
        }
    }
    const handleRefresh = async () => {
        setCheckbox(false);
        setIsFirstScale(false);
        setIsSecondScale(false);
        setChangeColor(-1);
        setDataInput({
            id: 0,
            ordinalNumber: 0,
            carNumber: "",
            customer: "",
            documents: "",
            product: "",
            firstScale: 0,
            secondScale: 0,
            notes: "",
            firstScaleDate: "",
            secondScaleDate: "",
            results: 0,
            styleScale: "",
            isDel: true
        });
    }
    //Thêm Thông tin khách hàng
    const handleAdd = async (e) => {
        e.preventDefault();
        const input = {
            ordinalNumber: getDataInput.ordinalNumber,
            carNumber: getDataInput.carNumber,
            customer: getDataInput.customer,
            documents: getDataInput.documents,
            product: getDataInput.product,
            firstScale: getDataInput.firstScale,
            secondScale: getDataInput.secondScale,
            notes: getDataInput.notes,
            firstDateScale: getDataInput.firstDateScale,
            secondDateScale: getDataInput.secondDateScale,
            results: getDataInput.results,
            isDel: getDataInput.isDel,
            styleScale: getDataInput.styleScale,
            isDone: getDataInput.isDone
        }
        await axios.post(url + ':7007/api/Scale/post', input, { headers: header })
            .then(res => { return toast.success("Thêm thành công"), getList(), handleRefresh() })
            .catch(error => { return toast.error("Lỗi", error) })
    }
    //Xóa thông tin khách hàng
    const onDeleteScale = async (id) => {
        try {
            if (id == null) {
                getList();
            }
            await axios.delete(url + ':7007/api/Scale/' + id, { headers: header })
                .then(res => { return toast.success("Xóa thành công"), handleRefresh() })
            setStruckScale(struckScale.filter(struckScale => struckScale.id !== id || struckScale.isDel == false));
        } catch (error) {
            toast.error(error.response.data)
        }
    }
    // Cập nhật cân 1,2
    const handleCheckbox = async (e) => {
        setCheckbox(e.target.checked);
        if (e.target.checked === true) {
            setTimeout(() => {
                updateScale();
                setCheckbox(false);
            }, 500)
        }
        else {
            return toast.error("Lỗi")
        }
    }
    // Checkbox status product
    const handleCheckboxProduct = async (e, productID) => {
        const updatedProducts = selectProduct.map(item => {
            if (item.id === productID) {
                return { ...item, status: e.target.checked };
            }
            return item;
        });
        setDataPopup(prev => { return { ...prev, selectProduct: updatedProducts } })
    }
    //Cập nhật số cân lần 1, lần 2
    const updateScale = async () => {
        await axios.put(url + ':7007/api/Scale/' + getDataInput.id, getDataInput, { headers: header })
            .then(res => {
                toast.success("Cập nhật cân thành công");
                if (isFirstScale == true && isSecondScale == false) {
                    setIsFirstScale(false);
                    setIsSecondScale(true);
                }
                if (isFirstScale == false && isSecondScale == true) {
                    setIsFirstScale(false);
                    setIsSecondScale(false);
                }
            })
            .catch(error => { toast.error(`Error: ${error.message}`) })
    }
    //Lấy danh sách khách hàng
    const getListCustomer = async () => {
        const customer = await axios.get(url + ':7007/api/Customer/get', { headers: header })
            .then(res => setSelectCustomer(res.data))
            .catch(err => { return toast.error(err) })
    }
    //Lấy danh sách sản phẩm
    const getListProduct = async () => {
        const product = await axios.get(url + ':7007/api/Product/get', { headers: header })
            .then(res => setSelectProduct(res.data))
            .catch(err => { return toast.error(err) })
    }
    //Lấy dữ liệu trong pop up customer
    const setValueData = async (data) => {
        setDataPopup({
            id: data?.id,
            shortcutName: data?.shortcutName,
            name: data?.name,
            status: data?.status
        });
    }
    const handleAddPopup = async (e) => {
        e.preventDefault();
        const input = {
            shortcutName: getDataPopup.shortcutName,
            name: getDataPopup.name,
        }
        await axios.post(url + ':7007/api/Customer/add-customer', input, { headers: header })
            .then(res => { return toast.success("Thêm thành công"), getListCustomer(), handleRefresh() })
            .catch(error => { return toast.error("Lỗi", error) })
    }
    const onDeleteCustomer = async (id) => {
        try {
            const response = await axios.delete(url + ':7007/api/Customer/delete?id=' + id, { headers: header })
                .then(res => { return toast.success("Xóa thành công"), getListCustomer(), handleRefresh() })
                .catch(error => { return toast.error("Không thể xóa trường này") });
            setSelectCustomer(selectCustomer.filter(selectCustomer => selectCustomer.id !== id));
        } catch (error) {
            return toast.error(error)
        }
    }
    const handleOnChangePopup = (event) => {
        const { name, value, checked, type } = event.currentTarget;
        if (type === 'checkbox') {
            setDataPopup((prev) => ({
                ...prev,
                [name]: checked,
            }));
        }
        else {
            setDataPopup((prev) => {
                return {
                    ...prev,
                    [name]: value,
                }
            })
        }
    }
    const handleRefreshPopup = async () => {
        setDataPopup({
            id: "",
            shortcutName: "",
            name: "",
            status: ""
        })
    }
    const updatePopup = async () => {
        const response = axios.put(url + ':7007/api/Customer/' + getDataPopup.id, getDataPopup, { headers: header })
            .then(res => { toast.success("Cập nhật cân thành công"), getListCustomer(), handleRefreshPopup() })
            .catch(error => { toast.error(`Error: ${error.message}`) })
    }
    //Lấy dữ liệu trong pop up product
    const handleAddPopupProduct = async (e) => {
        e.preventDefault();
        await axios.post(url + ':7007/api/Product/add-product', getDataPopup, { headers: header })
            .then(res => { return toast.success("Thêm thành công"), getListProduct(), handleRefresh() })
            .catch(error => { return toast.error("Lỗi", error) })
    }
    const onDeleteProduct = async (id) => {
        try {
            const response = await axios.delete(url + ':7007/api/Product/delete?id=' + id, { headers: header })
                .then(res => { return toast.success("Xóa thành công"), getListProduct(), handleRefresh() })
                .catch(error => { return toast.error("Không thể xóa trường này") });
            setSelectProduct(selectProduct.filter(selectProduct => selectProduct.id !== id));
        } catch (error) {
            return toast.error(error)
        }
    }
    const updatePopupProduct = async () => {
        const response = axios.put(url + ':7007/api/Product/' + getDataPopup.id, getDataPopup, { headers: header })
            .then(res => { toast.success("Cập nhật cân thành công"), getListProduct(), handleRefreshPopup() })
            .catch(error => { toast.error(`Error: ${error.message}`) })
    }
    return (
        <>
            {roles ? "Bạn không có quyền truy cập" :
                <>
                    <div className="check-scale">
                        <div className="form-check">
                            <span className="input-group-addon primary px-2" style={{ color: 'blue', fontWeight: 'bold' }}>STT</span>
                            <input className="form-control" value={getDataInput.ordinalNumber} id="ordinalNumber" name="ordinalNumber" onChange={(e) => handleOnChange(e)}
                                style={{ textAlign: 'center', width: '76% !important', fontSize: '50px' }} placeholder="ID" />
                            <div className="d-flex justify-content-center align-items-center">
                                <input className="form-check-input" type="checkbox" id="isCheckScale" onChange={handleCheckbox} checked={isCheckbox} style={{ border: '1px solid' }} />
                                <label className="form-check-label" htmlFor="isCheckScale" style={{ fontSize: 'initial', margin: '0!important', color: 'blue', fontWeight: 'bold', padding: '5px 0 0 10px' }}>
                                    Nhận số cân
                                </label>
                            </div>
                        </div>
                        <div className="col-md-10">
                            <div className="input-group">
                                <div className="col-md-3 px-2">
                                    <div className="form-check">
                                        <span className="input-group-addon primary px-2" style={{ color: 'blue', fontWeight: 'bold' }}>Số Xe</span>
                                        <input type="text" className="form-control" id="carNumber" name="carNumber" placeholder="#######" value={getDataInput.carNumber} onChange={(e) => handleOnChange(e)}
                                            style={{ textAlign: 'center', fontSize: '50px' }} />
                                    </div>
                                </div>
                                <div className="col-md-3 px-2">
                                    <div className="form-check">
                                        <span className="input-group-addon primary px-2" style={{ color: 'blue', fontWeight: 'bold' }}>Trọng lượng lần 1</span>
                                        <input type="text" className="form-control" id="firstScale" name="firstScale" placeholder="#######" value={getDataInput.firstScale ? (getDataInput.firstScale).toLocaleString('en-US') : ''} onChange={(e) => handleOnChange(e)}
                                            style={{ textAlign: 'center', fontSize: '50px' }} disabled />
                                        <div className="w-100 text-center">
                                            <span>{getDataInput.firstScaleDate ? new Date(getDataInput.firstScaleDate).toLocaleString() : ''}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-3 px-2">
                                    <div className="form-check">
                                        <span className="input-group-addon primary px-2" style={{ color: 'blue', fontWeight: 'bold' }}>Trọng lượng lần 2</span>
                                        <input type="text" className="form-control" id="secondScale" name="secondScale" placeholder="#######" value={getDataInput.secondScale ? (getDataInput.secondScale).toLocaleString('en-US') : ''} onChange={(e) => handleOnChange(e)}
                                            style={{ textAlign: 'center', fontSize: '50px' }} disabled />
                                        <div className="w-100 text-center">
                                            <span>{getDataInput.secondScaleDate ? new Date(getDataInput.secondScaleDate).toLocaleString() : ''}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-3 px-2">
                                    <div className="form-check">
                                        <span className="input-group-addon primary px-2" style={{ color: 'blue', fontWeight: 'bold' }}>Trọng lượng hàng</span>
                                        <input type="text" className="form-control" placeholder="#######" value={Math.abs(getDataInput.firstScale - getDataInput.secondScale) ? (Math.abs(getDataInput.firstScale - getDataInput.secondScale)).toLocaleString('en-US') : ''} onChange={(e) => handleOnChange(e)}
                                            style={{ textAlign: 'center', fontSize: '50px' }} disabled />
                                        <div className="w-100 text-center">
                                            <span>{getDataInput.styleScale}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="group-item pt-3">
                        <div className="row">
                            <div className="col-md-6">
                                <div className="info-Scale">
                                    <div className="w-100">
                                        <div className="d-flex align-items-center">
                                            <div className="w-25">
                                                <label style={{ color: 'blue', fontWeight: 'bold' }}>Số Xe</label>
                                            </div>
                                            <div className="w-75">
                                                <input type="text" style={{ width: '85%' }} className="form-control" id="carNumber" name="carNumber" value={getDataInput.carNumber} onChange={(e) => handleOnChange(e)} placeholder="Nhập số xe" required />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="info-Document">
                                    <div className="w-100">
                                        <div className="d-flex align-items-center">
                                            <div className="w-25">
                                                <label style={{ color: 'blue', fontWeight: 'bold' }}>Chứng Từ</label>
                                            </div>
                                            <div className="w-75">
                                                <input type="text" style={{ width: '85%' }} className="form-control" id="documents" name="documents" value={getDataInput.documents} onChange={(e) => handleOnChange(e)} placeholder="Nhập chứng từ" required />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="info-Product">
                                    <div className="input-group">
                                        <div className="w-100">
                                            <div className="d-flex align-items-center">
                                                <div className="w-25">
                                                    <label style={{ color: 'blue', fontWeight: 'bold' }}>Tên Hàng Hóa</label>
                                                </div>
                                                <div className="w-75">
                                                    <div className="d-flex">
                                                        <div className="w-25">
                                                            <select className="form-select" value={getDataInput.product} onChange={(e) => setDataInput({ ...getDataInput, product: e.target.value })}>
                                                                <option key="" value="">...</option>
                                                                {
                                                                    selectProduct.filter(x => x.status == 1).map((item) => <option key={item.id} value={item.name}>{item.shortcutName}</option>)
                                                                }
                                                            </select>
                                                        </div>
                                                        <div className="w-75 d-flex z-0">
                                                            <input type="text" className="form-control" id="product" name="product" value={getDataInput.product} onChange={(e) => handleOnChange(e)} placeholder="Nhập hàng hóa" required />
                                                            <button type="button" className="btn btn-light" onClick={() => setButtonPopupProduct(true)}>
                                                                <FontAwesomeIcon icon={faPlusSquare} style={{ color: "blue" }} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="info-Customer">
                                    <div className="input-group">
                                        <div className="w-100">
                                            <div className="d-flex align-items-center">
                                                <div className="w-25">
                                                    <label style={{ color: 'blue', fontWeight: 'bold' }}>Tên Khách Hàng</label>
                                                </div>
                                                <div className="w-75">
                                                    <div className="d-flex">
                                                        <div className="w-25">
                                                            <select className="form-select" value={getDataInput.customer} onChange={(e) => setDataInput({ ...getDataInput, customer: e.target.value })}>
                                                                <option key="" value="">...</option>
                                                                {
                                                                    selectCustomer.map((item) => <option key={item.id} value={item.name}>{item.shortcutName}</option>)
                                                                }
                                                            </select>
                                                        </div>
                                                        <div className="w-75 d-flex z-0">
                                                            <input type="text" className="form-control" id="customer" name="customer" value={getDataInput.customer} onChange={(e) => handleOnChange(e)} placeholder="Nhập tên khách hàng" required />
                                                            <button type="button" className="btn btn-light" onClick={() => setButtonPopupCustomer(true)} >
                                                                <FontAwesomeIcon icon={faPlusSquare} style={{ color: "blue" }} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="info-Notes">
                                    <div className="w-100">
                                        <div className="d-flex align-items-center">
                                            <div className="w-25">
                                                <label style={{ color: 'blue', fontWeight: 'bold' }}>Ghi chú</label>
                                            </div>
                                            <div className="w-75">
                                                <textarea className="form-control" aria-label="With textarea" id="notes" name="notes" value={getDataInput.notes} onChange={(e) => handleOnChange(e)}
                                                    placeholder="Nhập ghi chú" required></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex align-items-center pt-2">
                            <div className="buttons me-auto">
                                <button type="button" className="btn btn-light" onClick={handleRefresh}>
                                    <FontAwesomeIcon icon={faFile} style={{ fontSize: "30px" }} />
                                </button>
                                <button type="submit" className="btn btn-light" onClick={(e) => handleAdd(e)}>
                                    <FontAwesomeIcon icon={faFloppyDisk} style={{ color: "#001DFF", fontSize: "30px" }} />
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
                                    documents={getDataInput.documents}
                                    notes={getDataInput.notes}
                                    styleScale={getDataInput.styleScale}
                                    isDone={getDataInput.isDone}
                                />
                                <button type="button" className="btn btn-light" onClick={() => onDeleteScale(getDataInput.id)} >
                                    <FontAwesomeIcon icon={faCircleStop} style={{ color: "#ff0000", fontSize: "30px" }} />
                                </button>
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
                            <div className="ms-auto">
                                <Clock />
                            </div>
                        </div>
                    </div>
                    <div className="row pt-3">
                        <div className="col-sm-12">
                            {loading ? (
                                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "120px" }}>
                                    <FontAwesomeIcon icon={faSpinner} spin style={{ width: "100px", height: "100px" }} />
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table id="scale-table" className="table table-striped table-bordered table-hover">
                                        <thead className="thead-light">
                                            <tr>
                                                <th>STT</th>
                                                <th>Số xe</th>
                                                <th>Chứng Từ</th>
                                                <th>Khách Hàng</th>
                                                <th>Hàng Hóa</th>
                                                <th>Số lần cân 1 (Kg)</th>
                                                <th>Số lần cân 2 (Kg)</th>
                                                <th>Kết quả</th>
                                                <th>Ngày giờ cân lần 1</th>
                                                <th>Ngày giờ cân lần 2</th>
                                                <th>Kiểu cân</th>
                                                <th>Ghi chú</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {struckScale.slice(pagesVisited, pagesVisited + limit).map((item, i) => (
                                                <tr key={item.struckId} onClick={() => {
                                                    setValueItem(item);
                                                    colorChangeBox(i)
                                                }} className={changeColor === i ? "selected" : ""} >
                                                    <td>{item.ordinalNumber}</td>
                                                    <td>{item.carNumber}</td>
                                                    <td>{item.documents}</td>
                                                    <td>{item.customer}</td>
                                                    <td>{item.product}</td>
                                                    <td>{item.firstScale.toLocaleString('en-US')} Kg</td>
                                                    <td>{item.secondScale.toLocaleString('en-US')} Kg</td>
                                                    <td>{item.results != null ? item.results.toLocaleString('en-US') : 0} Kg</td>
                                                    <td>{item.firstScaleDate ? (new Date(item.firstScaleDate).toLocaleString("en-IN")) : ''}</td>
                                                    <td>{item.secondScaleDate ? (new Date(item.secondScaleDate).toLocaleString("en-IN")) : ''}</td>
                                                    <td>{item.styleScale}</td>
                                                    <td style={{ wordBreak: 'break-all' }}>{item.notes}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
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
                    <div>
                        <PopUpCenter trigger={buttonPopupCustomer} setTrigger={setButtonPopupCustomer}>
                            <h3>Thông Tin Khách Hàng</h3>
                            <div className="d-flex justify-content-center pd-10">
                                <div className="w-25">
                                    <div className="d-flex justify-content-center align-items-center flex-wrap">
                                        <label style={{ color: 'blue', fontWeight: 'bold', paddingRight: '10px' }}>ID</label>
                                        <input type="text" style={{ width: '30%' }} className="form-control" id="id" name="id" value={getDataPopup.id} onChange={(e) => handleOnChangePopup(e)} placeholder="Nhập Id" />
                                    </div>
                                </div>
                                <div className="w-35">
                                    <div className="d-flex justify-content-center align-items-center flex-wrap">
                                        <label style={{ color: 'blue', fontWeight: 'bold', paddingRight: '10px' }}>Shortcut Name</label>
                                        <input type="text" style={{ width: '60%' }} className="form-control" id="shortcutName" name="shortcutName" value={getDataPopup.shortcutName} onChange={(e) => handleOnChangePopup(e)} placeholder="Nhập Shortcut Name" required />
                                    </div>
                                </div>
                                <div className="w-35">
                                    <div className="d-flex justify-content-center align-items-center flex-wrap">
                                        <label style={{ color: 'blue', fontWeight: 'bold', paddingRight: '10px' }}>Name</label>
                                        <input type="text" style={{ width: '60%' }} className="form-control" id="name" name="name" value={getDataPopup.name} onChange={(e) => handleOnChangePopup(e)} placeholder="Nhập Tên" required />
                                    </div>
                                </div>
                            </div>
                            <div className="p-2 d-flex align-items-center">
                                <button type="button" className="btn btn-light" onClick={handleRefreshPopup}>
                                    <FontAwesomeIcon icon={faFile} style={{ fontSize: "30px" }} />
                                </button>
                                <button type="submit" className="btn btn-light" onClick={(e) => handleAddPopup(e)}>
                                    <FontAwesomeIcon icon={faFloppyDisk} style={{ color: "#001DFF", fontSize: "30px" }} />
                                </button>
                                <button type="button" className="btn btn-light" onClick={() => updatePopup(getDataPopup.id)}>
                                    <FontAwesomeIcon icon={faEdit} style={{ color: "#000000", fontSize: "30px" }} />
                                </button>
                            </div>
                            <div className="pt-10 d-flex justify-content-center">
                                <div className="table-popup d-flex">
                                    <div className="table table-bordered table-hover">
                                        <thead>
                                            <tr>
                                                <th scope="col" style={{ width: '50px' }}>#</th>
                                                <th scope="col" style={{ width: '150px' }}>Shortcut Name</th>
                                                <th scope="col" style={{ width: '180px' }}>Full Name</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectCustomer.map((item, i) => (
                                                <tr key={item.id} onClick={() => setValueData(item)}>
                                                    <td>{i + 1}</td>
                                                    <td>{item.shortcutName}</td>
                                                    <td>{item.name}</td>
                                                    <td>
                                                        <button type="button" className="btn btn-light" onClick={() => onDeleteCustomer(item.id)}>
                                                            <FontAwesomeIcon icon={faCircleStop} style={{ color: "#ff0000" }} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </div>
                                </div>
                            </div>
                        </PopUpCenter>
                    </div>
                    <div>
                        <PopUpCenter trigger={buttonPopupProduct} setTrigger={setButtonPopupProduct}>
                            <h3>Thông Tin Sản Phẩm</h3>
                            <div className="d-flex justify-content-center pd-10">
                                <div className="w-25">
                                    <div className="d-flex justify-content-center align-items-center flex-wrap">
                                        <label style={{ color: 'blue', fontWeight: 'bold', paddingRight: '10px' }}>ID</label>
                                        <input type="text" style={{ width: '30%' }} className="form-control" id="id" name="id" value={getDataPopup.id} onChange={(e) => handleOnChangePopup(e)} placeholder="Nhập Id" />
                                    </div>
                                </div>
                                <div className="w-35">
                                    <div className="d-flex justify-content-center align-items-center flex-wrap">
                                        <label style={{ color: 'blue', fontWeight: 'bold', paddingRight: '10px' }}>Shortcut Name</label>
                                        <input type="text" style={{ width: '60%' }} className="form-control" id="shortcutName" name="shortcutName" value={getDataPopup.shortcutName} onChange={(e) => handleOnChangePopup(e)} placeholder="Nhập Shortcut Name" required />
                                    </div>
                                </div>
                                <div className="w-35">
                                    <div className="d-flex justify-content-center align-items-center flex-wrap">
                                        <label style={{ color: 'blue', fontWeight: 'bold', paddingRight: '10px' }}>Name</label>
                                        <input type="text" style={{ width: '60%' }} className="form-control" id="name" name="name" value={getDataPopup.name} onChange={(e) => handleOnChangePopup(e)} placeholder="Nhập Tên" required />
                                    </div>
                                </div>
                                <div className="w-35 d-flex justify-content-center align-items-center flex-wrap">
                                    <label style={{ color: 'blue', fontWeight: 'bold', paddingRight: '10px' }}>Status</label>
                                    <input type="checkbox" id="status" name="status" checked={getDataPopup.status} onChange={(e) => handleOnChangePopup(e)} />
                                </div>
                            </div>
                            <div className="p-2 d-flex align-items-center">
                                <button type="button" className="btn btn-light" onClick={handleRefreshPopup}>
                                    <FontAwesomeIcon icon={faFile} style={{ fontSize: "30px" }} />
                                </button>
                                <button type="submit" className="btn btn-light" onClick={(e) => handleAddPopupProduct(e)}>
                                    <FontAwesomeIcon icon={faFloppyDisk} style={{ color: "#001DFF", fontSize: "30px" }} />
                                </button>
                                <button type="button" className="btn btn-light" onClick={() => updatePopupProduct(getDataPopup.id)}>
                                    <FontAwesomeIcon icon={faEdit} style={{ color: "#000000", fontSize: "30px" }} />
                                </button>
                            </div>
                            <div className="pt-10 d-flex justify-content-center">
                                <div className="table-popup d-flex">
                                    <div className="table table-bordered table-hover">
                                        <thead>
                                            <tr>
                                                <th scope="col" style={{ width: '50px' }}>#</th>
                                                <th scope="col" style={{ width: '150px' }}>Tên viết tắt</th>
                                                <th scope="col" style={{ width: '180px' }}>Tên sản phẩm</th>
                                                <th scope="col" style={{ width: '180px' }}>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectProduct.map((item, i) => (
                                                <tr key={item.id} onClick={() => setValueData(item)}>
                                                    <td>{i + 1}</td>
                                                    <td>{item.shortcutName}</td>
                                                    <td>{item.name}</td>
                                                    <td>
                                                        <input type="checkbox" onChange={(e) => handleCheckboxProduct(e, item.id)} checked={item.status} />
                                                    </td>
                                                    <td>
                                                        <button type="button" className="btn btn-light" onClick={() => onDeleteProduct(item.id)}>
                                                            <FontAwesomeIcon icon={faCircleStop} style={{ color: "#ff0000" }} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </div>
                                </div>
                            </div>
                        </PopUpCenter>
                    </div>
                </>
            }
        </>
    )
}
export default ScaleStruck;