/* eslint-disable no-unused-vars */
/* eslint-disable no-constant-condition */
import React, { useEffect, useState } from "react"
import ReactPaginate from "react-paginate";
import Clock from "./Clock";
import Print from "./Print";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faFloppyDisk, faCircleStop, faEdit, faPlusSquare } from "@fortawesome/free-regular-svg-icons";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import Loading from "../components/Loading";
import PopUpCenter from "../components/popupcustomer";

const ScaleStruck = () => {

    let limit = 12;
    const [loading, setLoading] = useState(true)
    //Lấy dữ liệu từ danh sách cân
    const [struckScale, setStruckScale] = useState([])
    //Đếm trang
    const [pageCount, setPageCount] = useState(1)
    //Lấy dữ liệu lên input
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
    }]);
    const [isCheckbox, setCheckbox] = useState(false);
    const [currentPageClick, setCurrentPageClick] = useState(1);
    //Lấy dữ liệu khách hàng
    const [selectCustomer, setSelectCustomer] = useState([]);
    //Lấy dữ liệu sản phẩm
    const [selectProduct, setSelectProduct] = useState([]);
    //button hiển thị popup khách hàng
    const [buttonPopupCustomer, setButtonPopupCustomer] = useState(false);
    //button hiển thị popup sản phẩm
    const [buttonPopupProduct, setButtonPopupProduct] = useState(false);
    const [getDataPopup, setDataPopup] = useState([{
        id: 0,
        shortcutName: "",
        name: "",
    }]);


    useEffect(() => {
        getList();
        getListProduct();
        getListCustomer();
        //loadOptions();
    }, []);
    //Lấy danh sách cân
    const getList = async () => {
        await axios.get('https://localhost:7007/api/Home/get?pg=1&pageSize=' + limit)
            .then(res => {
                const total = res.data.totalPages;
                setPageCount(Math.ceil(total / limit));
                setStruckScale(res.data.data);
                setLoading(false);
            });
    };
    const fetchData = async (currentPageClick) => {
        //const res = await fetch('https://localhost:7007/api/Home/get?pg=' + currentPage + '&pageSize=' + limit);
        //const data = await res.json();
        //return data.data;
        const response = await axios.get('https://localhost:7007/api/Home/get?pg=' + currentPageClick + '&pageSize=' + limit)
        setStruckScale(response.data.data)
    };

    //const loadOptions = inputValue =>
    //    new Promise(resolve => {
    //        console.log('on load options function')
    //        axios.get('https://localhost:7007/api/Product/get')
    //            .then((response) => {
    //                const options = []
    //                console.log(response.data)
    //                response.data.forEach((e) => {
    //                    options.push({
    //                        label: e.shortName,
    //                        value: e.name
    //                    })
    //                })
    //                resolve(options);
    //            })
    //    });
    const handlePageClick = async (data) => {
        let selectPage = data.selected + 1;
        setCurrentPageClick(selectPage);
        const getlistinfo = await fetchData(selectPage)
        //setStruckScale(getlistinfo)
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
            id: data?.id,
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
            styleScale: data?.styleScale
        });
    }
    const handleRefresh = async () => {
        setCheckbox(false);
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
        let headers = {
            'Content-Type': 'application/json;charset=UTF-8',
        };
        await axios.post('https://localhost:7007/api/Home/post', input, headers)
            .then(res => { return toast.success("Thêm thành công"), getList(), handleRefresh() })
            .catch(error => { return toast.error("Lỗi", error) })
    }
    const onDeleteScale = async (id) => {
        try {
            const response = await axios.delete('https://localhost:7007/api/Home?id=' + id)
                .then(res => { return toast.success("Xóa thành công"), fetchData(currentPageClick), handleRefresh() })
                .catch(error => { return toast.error("Không thể xóa trường này") });
            setStruckScale(struckScale.filter(struckScale => struckScale.id !== id || struckScale.isDel == false));
        } catch (error) {
            console.log(error);
        }
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        handleRefresh();
        getList();
    }
    const handleCheckbox = async (e) => {
        setCheckbox(e.target.checked);
        if (e.target.checked === true) {
            setTimeout(() => {
                updateScale();
                setCheckbox(false);
            }, 500)
        }
        else {
            toast.error("Lỗi")
        }
    }
    const updateScale = async () => {
        const response = axios.put('https://localhost:7007/api/Home/' + getDataInput.id, getDataInput)
            .then(res => { toast.success("Cập nhật cân thành công"), fetchData(currentPageClick), handleRefresh() })
            .catch(error => { toast.error(`Error: ${error.message}`) })
        console.log(response);
    }

    //Lấy danh sách khách hàng
    const getListCustomer = async () => {
        const customer = await axios.get('https://localhost:7007/api/Customer/get')
            .then(res => setSelectCustomer(res.data))
    }
    //Lấy danh sách sản phẩm
    const getListProduct = async () => {
        const product = await axios.get('https://localhost:7007/api/Product/get')
            .then(res => setSelectProduct(res.data))
    }
    //Lấy dữ liệu trong pop up customer
    const setValueData = async (data) => {
        setDataPopup({
            id: data?.id,
            shortcutName: data?.shortcutName,
            name: data?.name,
        });
    }
    const handleAddPopup = async (e) => {
        e.preventDefault();
        const input = {
            shortcutName: getDataPopup.shortcutName,
            name: getDataPopup.name
        }
        let headers = {
            'Content-Type': 'application/json;charset=UTF-8',
        };
        await axios.post('https://localhost:7007/api/Customer/add-customer', input, headers)
            .then(res => { return toast.success("Thêm thành công"), getListCustomer(), handleRefresh() })
            .catch(error => { return toast.error("Lỗi", error) })
    }
    const onDeleteCustomer = async (id) => {
        try {
            const response = await axios.delete('https://localhost:7007/api/Customer/delete?id=' + id)
                .then(res => { return toast.success("Xóa thành công"), getListCustomer(), handleRefresh() })
                .catch(error => { return toast.error("Không thể xóa trường này") });
            setSelectCustomer(selectCustomer.filter(selectCustomer => selectCustomer.id !== id));
        } catch (error) {
            console.log(error);
        }
    }
    const handleOnChangePopup = (event) => {
        const { name, value } = event.currentTarget;
        setDataPopup((prev) => {
            return {
                ...prev,
                [name]: value,
            }
        })
    }
    const handleRefreshPopup = async () => {
        setDataPopup({
            id: "",
            shortcutName: "",
            name: ""
        })
    }
    const updatePopup = async () => {
        const response = axios.put('https://localhost:7007/api/Customer/' + getDataPopup.id, getDataPopup)
            .then(res => { toast.success("Cập nhật cân thành công"), getListCustomer(), handleRefreshPopup() })
            .catch(error => { toast.error(`Error: ${error.message}`) })
        console.log(response);
    }
    //Lấy dữ liệu trong pop up product
 
    const handleAddPopupProduct = async (e) => {
        e.preventDefault();
        const input = {
            shortcutName: getDataPopup.shortcutName,
            name: getDataPopup.name
        }
        let headers = {
            'Content-Type': 'application/json;charset=UTF-8',
        };
        await axios.post('https://localhost:7007/api/Product/add-product', input, headers)
            .then(res => { return toast.success("Thêm thành công"), getListProduct(), handleRefresh() })
            .catch(error => { return toast.error("Lỗi", error) })
    }
    const onDeleteProduct = async (id) => {
        try {
            const response = await axios.delete('https://localhost:7007/api/Product/delete?id=' + id)
                .then(res => { return toast.success("Xóa thành công"), getListProduct(), handleRefresh() })
                .catch(error => { return toast.error("Không thể xóa trường này") });
            setSelectProduct(selectProduct.filter(selectProduct => selectProduct.id !== id));
        } catch (error) {
            console.log(error);
        }
    }
    const updatePopupProduct = async () => {
        const response = axios.put('https://localhost:7007/api/Product/' + getDataPopup.id, getDataPopup)
            .then(res => { toast.success("Cập nhật cân thành công"), getListProduct(), handleRefreshPopup() })
            .catch(error => { toast.error(`Error: ${error.message}`) })
        console.log(response);
    }

    return (
        <>
            <form method="post" onSubmit={handleSubmit}>
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
                                <div className="input-group align-items-center">
                                    <span className="input-group-addon primary px-2" style={{ color: 'blue', fontWeight: 'bold' }}>Số Xe</span>
                                    <input type="text" className="form-control" id="carNumber" name="carNumber" placeholder="#######" value={getDataInput.carNumber} onChange={(e) => handleOnChange(e)}
                                        style={{ textAlign: 'center', width: '76% !important', fontSize: '50px' }} />
                                </div>
                            </div>
                            <div className="col-md-3 px-2">
                                <div className="input-group align-items-center">
                                    <span className="input-group-addon primary px-2" style={{ color: 'blue', fontWeight: 'bold' }}>Trọng lượng lần 1</span>
                                    <input type="text" className="form-control" id="firstScale" name="firstScale" placeholder="#######" value={getDataInput.firstScale ? (getDataInput.firstScale).toLocaleString('en-US') : ''} onChange={(e) => handleOnChange(e)}
                                        style={{ textAlign: 'center', width: '76% !important', fontSize: '50px' }} />
                                    <div className="w-100 text-center">
                                        <span>{getDataInput.firstScaleDate ? new Date(getDataInput.firstScaleDate).toLocaleString() : ''}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3 px-2">
                                <div className="input-group align-items-center">
                                    <span className="input-group-addon primary px-2" style={{ color: 'blue', fontWeight: 'bold' }}>Trọng lượng lần 2</span>
                                    <input type="text" className="form-control" id="secondScale" name="secondScale" placeholder="#######" value={getDataInput.secondScale ? (getDataInput.secondScale).toLocaleString('en-US') : ''} onChange={(e) => handleOnChange(e)}
                                        style={{ textAlign: 'center', width: '76% !important', fontSize: '50px' }} />
                                    <div className="w-100 text-center">
                                        <span>{getDataInput.secondScaleDate ? new Date(getDataInput.secondScaleDate).toLocaleString() : ''}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3 px-2">
                                <div className="input-group align-items-center">
                                    <span className="input-group-addon primary px-2" style={{ color: 'blue', fontWeight: 'bold' }}>Trọng lượng hàng</span>
                                    <input type="text" className="form-control" placeholder="#######" value={getDataInput.results ? (getDataInput.results).toLocaleString('en-US') : ''} onChange={(e) => handleOnChange(e)}
                                        style={{ textAlign: 'center', width: '76% !important', fontSize: '50px' }} disabled />
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
                                                            <option value="">...</option>
                                                            {
                                                                selectProduct.map((item, i) => <option onChange={(e) => handleOnChange(e)} key={item.id} value={item.name}>{item.shortcutName}</option>)
                                                            }

                                                        </select>
                                                    </div>
                                                    <div className="w-75 d-flex z-0">
                                                        <input type="text" className="form-control" id="product" name="product" value={getDataInput.product} onChange={(e) => handleOnChange(e)} placeholder="Nhập hàng hóa" required />
                                                        <button type="button" className="btn btn-light">
                                                            <FontAwesomeIcon icon={faPlusSquare} style={{ color: "blue" }} onClick={() => setButtonPopupProduct(true)} />
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
                                                            <option value="">...</option>
                                                            {
                                                                selectCustomer.map((item, i) => <option onChange={(e) => handleOnChange(e)} key={item.id} value={item.name}>{item.shortcutName}</option>)
                                                            }
                                                        </select>
                                                    </div>
                                                    <div className="w-75 d-flex z-0">
                                                        <input type="text" className="form-control" id="customer" name="customer" value={getDataInput.customer} onChange={(e) => handleOnChange(e)} placeholder="Nhập tên khách hàng" required />
                                                        <button type="button" className="btn btn-light">
                                                            <FontAwesomeIcon icon={faPlusSquare} style={{ color: "blue" }} onClick={() => setButtonPopupCustomer(true)} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
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
                            <button type="submit" className="btn btn-light">
                                <FontAwesomeIcon icon={faFloppyDisk} style={{ color: "#001DFF", fontSize: "30px" }} onClick={(e) => handleAdd(e)} />
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
                            />
                            <button type="button" className="btn btn-light">
                                <FontAwesomeIcon icon={faCircleStop} style={{ color: "#ff0000", fontSize: "30px" }} onClick={() => onDeleteScale(getDataInput.id)} />
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
            </form>
            <div className="row pt-3">
                <div className="col-sm-12">
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
                                {struckScale.map((item) => (
                                    <tr key={item.id} onClick={() => setValueItem(item)}>
                                        <td>{item.ordinalNumber}</td>
                                        <td>{item.carNumber}</td>
                                        <td>{item.documents}</td>
                                        <td>{item.customer}</td>
                                        <td>{item.product}</td>
                                        <td>{item.firstScale.toLocaleString('en-US')} Kg</td>
                                        <td>{item.secondScale.toLocaleString('en-US')} Kg</td>
                                        <td>{item.results.toLocaleString('en-US')} Kg</td>
                                        <td>{item.firstScaleDate ? (new Date(item.firstScaleDate).toLocaleString()) : ''}</td>
                                        <td>{item.secondScaleDate ? (new Date(item.secondScaleDate).toLocaleString()) : ''}</td>
                                        <td>{item.styleScale}</td>
                                        <td style={{wordBreak:'break-all'}}>{item.notes}</td>
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
            <div>
                <PopUpCenter trigger={buttonPopupCustomer} setTrigger={setButtonPopupCustomer}>
                    <h3>Hello Nè</h3>
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
                        <button type="submit" className="btn btn-light">
                            <FontAwesomeIcon icon={faFloppyDisk} style={{ color: "#001DFF", fontSize: "30px" }} onClick={(e) => handleAddPopup(e)} />
                        </button>
                        <button type="button" className="btn btn-light">
                            <FontAwesomeIcon icon={faEdit} style={{ color: "#000000", fontSize: "30px" }} onClick={() => updatePopup(getDataPopup.id)} />
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
                                                <button type="button" className="btn btn-light">
                                                    <FontAwesomeIcon icon={faCircleStop} style={{ color: "#ff0000" }} onClick={() => onDeleteCustomer(item.id)} />
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
                    <h3>Hello Nè</h3>
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
                        <button type="submit" className="btn btn-light">
                            <FontAwesomeIcon icon={faFloppyDisk} style={{ color: "#001DFF", fontSize: "30px" }} onClick={(e) => handleAddPopupProduct(e)} />
                        </button>
                        <button type="button" className="btn btn-light">
                            <FontAwesomeIcon icon={faEdit} style={{ color: "#000000", fontSize: "30px" }} onClick={() => updatePopupProduct(getDataPopup.id)} />
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
                                    {selectProduct.map((item, i) => (
                                        <tr key={item.id} onClick={() => setValueData(item)}>
                                            <td>{i + 1}</td>
                                            <td>{item.shortcutName}</td>
                                            <td>{item.name}</td>
                                            <td>
                                                <button type="button" className="btn btn-light">
                                                    <FontAwesomeIcon icon={faCircleStop} style={{ color: "#ff0000" }} onClick={() => onDeleteProduct(item.id)} />
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
    )
}
export default ScaleStruck;