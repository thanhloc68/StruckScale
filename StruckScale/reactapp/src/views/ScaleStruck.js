/* eslint-disable no-unused-vars */
/* eslint-disable no-constant-condition */
import React, { useEffect, useState } from "react"
import ReactPaginate from "react-paginate";
import Clock from "./Clock";
import Print from "./Print";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import { faFile, faFloppyDisk, faCircleStop } from "@fortawesome/free-regular-svg-icons";
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import Loading from "../components/Loading";

const ScaleStruck = () => {
    const [loading, setLoading] = useState(true)
    const [struckScale, setStruckScale] = useState([])
    const [pageCount, setPageCount] = useState(1)

    const [getDataInput, setDataInput] = useState([{
        id: "",
        carNumber: "",
        customer: "",
        document: "",
        product: "",
        firstScale: "",
        secondScale: "",
        notes: "",
        firstDateScale: "",
        secondDateScale: "",
        results: "",
    }]);

    let limit = 12;

    useEffect(() => {
        getList();
    }, []);

    const getList = async () => {
        await axios.get('https://localhost:7007/api/Home/get?pg=1&pageSize=' + limit)
            .then(res => {
                const total = res.data.totalPages;
                setPageCount(Math.ceil(total / limit));
                setStruckScale(res.data.data);
                setLoading(false);
            });
    };

    const fetchData = async (currentPage) => {
        //const res = await fetch('https://localhost:7007/api/Home/get?pg=' + currentPage + '&pageSize=' + limit);
        //const data = await res.json();
        //return data.data;
        const response = await axios.get('https://localhost:7007/api/Home/get?pg=' + currentPage + '&pageSize=' + limit)
        return response.data.data;
    };

    const handlePageClick = async (data) => {
        let currentPage = data.selected + 1
        const getlistinfo = await fetchData(currentPage)
        setStruckScale(getlistinfo)
    }

    const handleOnChange = (event) => {
        const { name, value } = event.target;
        setDataInput([{
            ...getDataInput,
            [name]: value,

            //id: event.target.value,
            //carNumber: event.target.value,
            //customer: event.target.value,
            //documents: event.target.value,
            //product: event.target.value,
            //firstScale: event.target.value,
            //secondScale: event.target.value,
            //notes: event.target.value,
            //firstDateScale: event.target.value,
            //secondDateScale: event.target.value,
            //results: event.target.value
        }])
        event.preventDefault();
    }

    const handleChangeCarNum = (e) => {
        setDataInput([{ ...getDataInput,carNumber: e.target.value }])
    }

    const handleChangeCustomer = (e) => {
        setDataInput([{ ...getDataInput, customer: e.target.value }])
    }
    const handleChangeDocuments = (e) => {
        setDataInput([{ ...getDataInput, documents: e.target.value }])
    }
    const handleChangeProduct = (e) => {
        setDataInput([{ ...getDataInput, product: e.target.value }])
    }
    const handleChangeFirstScale = (e) => {
        setDataInput([{ ...getDataInput, firstScale: e.target.value }])
    }
    const handleChangeSecondScale = (e) => {
        setDataInput([{ ...getDataInput, secondScale: e.target.value }])
    }
    const handleChangeNotes = (e) => {
        setDataInput([{ ...getDataInput, notes: e.target.value }])
    }
    const handleChangeFirstDateScale = (e) => {
        setDataInput([{ ...getDataInput, firstDateScale: e.target.value }])
    }
    const handleChangeSecondDateScale = (e) => {
        setDataInput([{ ...getDataInput, secondDateScale: e.target.value }])
    }
    const handleChangeResult = (e) => {
        setDataInput([{ ...getDataInput, results: e.target.value }])
    }
    const setValueItem = async (data) => {
        setDataInput([{
            id: data?.id,
            carNumber: data?.carNumber,
            customer: data?.customer,
            documents: data?.documents,
            product: data?.product,
            firstScale: data?.firstScale,
            secondScale: data?.secondScale,
            notes: data?.notes,
            firstDateScale: data?.firstDateScale,
            secondDateScale: data?.secondDateScale,
            results: data?.results
        }]);
    }

    const handleRefresh = async () => {
        setDataInput({
            id: "",
            carNumber: "",
            customer: "",
            documents: "",
            product: "",
            firstScale: "",
            secondScale: "",
            notes: "",
            firstDateScale: "",
            secondDateScale: "",
            results: ""
        });
    }

    const handleAdd = async (data) => {
        const response = axios.post('https://localhost:7007/api/Home/post', { handleChangeCustomer })
    }

    const onDeleteScale = async (id) => {
        try {
            const response = axios.delete('https://localhost:7007/api/Home?id=' + id);
            setStruckScale(struckScale.filter((struckScale) => struckScale.id !== id));
            handleRefresh();
        } catch (error) {
            console.log(error);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
    }

    return (
        <>
            {console.log(getDataInput)}
            <form method="post" onSubmit={handleSubmit}>
                <div className="check-scale">
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="isCheckScale" />
                        <label className="form-check-label" htmlFor="isCheckScale" style={{ fontSize: 'initial', margin: '0!important' }}>
                            Nhận số cân
                        </label>
                        <input className="form-control" value={getDataInput.id} id="id" name="id" onChange={(e) => handleOnChange(e)}
                            style={{ textAlign: 'center', width: '76% !important' }} placeholder="ID" disabled />
                    </div>
                    <div className="col-md-10">
                        <div className="input-group">
                            <div className="col-md-4 px-2">
                                <div className="input-group align-items-center">
                                    <span className="input-group-addon primary px-2">Trọng lượng lần 1</span>
                                    <input type="text" className="form-control" placeholder="#######" value={getDataInput.firstScale} onChange={(e) => handleChangeFirstScale(e)}
                                        style={{ textAlign: 'center', width: '76% !important' }} />
                                    <div className="w-100 text-center">
                                        <span>{getDataInput.firstScaleDate}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4 px-2">
                                <div className="input-group align-items-center">
                                    <span className="input-group-addon primary px-2">Trọng lượng lần 2</span>
                                    <input type="text" className="form-control" placeholder="#######" value={getDataInput.secondScale} onChange={(e) => handleChangeSecondScale(e)}
                                        style={{ textAlign: 'center', width: '76% !important' }} />
                                    <div className="w-100 text-center">
                                        <span>{getDataInput.secondScaleDate}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4 px-2">
                                <div className="input-group align-items-center">
                                    <span className="input-group-addon primary px-2">Trọng lượng hàng</span>
                                    <input type="text" className="form-control" placeholder="#######" value={getDataInput.firstScale - getDataInput.secondScale} onChange={(e) => handleChangeResult(e)}
                                        style={{ textAlign: 'center', width: '76% !important' }} disabled />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="group-item pt-3">
                    <div className="info-Scale">
                        <div className="col-md-6">
                            <div className="d-flex align-items-center">
                                <div className="col-md-2">
                                    <label className="">Số Xe</label>
                                </div>
                                <div className="col-md-10">
                                    <input required type="text" className="form-control" id="carNumber" name="carNumber" value={getDataInput.carNumber} onChange={(e) => handleChangeCarNum(e)} placeholder="Nhập số xe" style={{ width: '80%' }} />
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="d-flex align-items-center">
                                <div className="col-md-2">
                                    <label className="">Chứng Từ</label>
                                </div>
                                <div className="col-md-10">
                                    <input required type="text" className="form-control" id="documents" name="documents" value={getDataInput.documents} onChange={(e) => handleChangeDocuments(e)} placeholder="Nhập chứng từ" style={{ width: '80%' }} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="info-Product">
                        <div className="input-group">
                            <div className="col-md-6">
                                <div className="d-flex align-items-center">
                                    <div className="col-md-2">
                                        <label className="">Tên Hàng Hóa</label>
                                    </div>
                                    <div className="col-md-10">
                                        <input required type="text" className="form-control" id="product" name="product" value={getDataInput.product} onChange={(e) => handleChangeProduct(e)} placeholder="Nhập hàng hóa" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="info-Customer">
                        <div className="input-group">
                            <div className="col-md-6">
                                <div className="d-flex align-items-center">
                                    <div className="col-md-2">
                                        <label className="">Tên Khách Hàng</label>
                                    </div>
                                    <div className="col-md-10">
                                        <input required type="text" className="form-control" id="customer" name="customer" value={getDataInput.customer} onChange={(e) => handleChangeCustomer(e)} placeholder="Nhập tên khách hàng" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="info-Notes">
                        <div className="input-group">
                            <div className="col-md-6">
                                <div className="d-flex align-items-center">
                                    <div className="col-md-2">
                                        <label className="">Ghi chú</label>
                                    </div>
                                    <div className="col-md-10">
                                        <textarea className="form-control" aria-label="With textarea" id="notes" name="notes" value={getDataInput.notes} onChange={(e) => handleChangeNotes(e)}
                                            placeholder="Nhập ghi chú"></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex align-items-center">
                        <div className="buttons me-auto">
                            <button type="button" className="btn btn-light" onClick={handleRefresh}>
                                <FontAwesomeIcon icon={faFile} />
                            </button>
                            <button type="submit" className="btn btn-light">
                                <FontAwesomeIcon icon={faFloppyDisk} style={{ color: "#001DFF" }} onClick={(e) => handleAdd(e)} />
                            </button>
                            <button type="button" className="btn btn-light" onClick={(e) => window.print(e)}>
                                <FontAwesomeIcon icon={faPrint} style={{ color: "#001DFF" }} />
                            </button>
                            <button type="button" className="btn btn-light">
                                <FontAwesomeIcon icon={faCircleStop} style={{ color: "#ff0000" }} onClick={() => onDeleteScale(getDataInput.id)} />
                            </button>
                        </div>
                        <div className="ms-auto">
                            <Clock />
                        </div>
                    </div>
                </div>
            </form>
            <div className="row pt-3">
                <div className="col-sm-12">
                    <table id="scale-table" className="table table-striped table-bordered table-hover table-responsive">
                        <thead className="thead-light">
                            <tr>
                                <th>Số xe</th>
                                <th>Khách Hàng</th>
                                <th>Chứng Từ</th>
                                <th>Hàng Hóa</th>
                                <th>Số lần cân 1</th>
                                <th>Ngày giờ cân lần 1</th>
                                <th>Ghi chú</th>
                                <th>Số lần cân 2</th>
                                <th>Ngày giờ cân lần 2</th>
                                <th>Kết quả</th>
                                <th>Ghi chú</th>
                            </tr>
                        </thead>
                        <tbody>
                            {struckScale.map((item) => (
                                <tr key={item.id} onClick={() => setValueItem(item)}>
                                    <td>{item.carNumber}</td>
                                    <td>{item.customer}</td>
                                    <td>{item.documents}</td>
                                    <td>{item.product}</td>
                                    <td>{item.firstScale}</td>
                                    <td>{item.firstScaleDate}</td>
                                    <td>{item.firstNotes}</td>
                                    <td>{item.secondScale}</td>
                                    <td>{item.secondScaleDate}</td>
                                    <td>{item.result}</td>
                                    <td>{item.secondNotes}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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
export default ScaleStruck;