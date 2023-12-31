﻿/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import ReactPaginate from 'react-paginate';
import { ExportToExcel } from '../components/ExportToExcel';
import '../assets/style.css'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import axios from 'axios';
import url from '../components/url'
const Report = () => {
    const [struckScale, setStruckScale] = useState([])
    const [dataExcel, setdataExcel] = useState([])
    const [searchInput, setSearchInput] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [pageNumber, setPageNumber] = useState(0);
    const [getDataInput, setDataInput] = useState([{
        name: ""
    }]);
    const [loading, SetLoadingApi] = useState(false);
    const [roles, setRoles] = useState(false);
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
    const [typeReport] = useState([
        { "name": 'Cân xe' },
        { "name": 'Bơm xe bồn' }
    ]);
    const fileName = "Report";
    let limit = 12;
    const pagesVisited = pageNumber * limit;
    useEffect(() => {
        getListType(getDataInput.name, startDate, endDate, searchInput);
    }, [startDate, endDate, searchInput]);
    const getListType = async (selectValue, newStartDate, newEndDate) => {
        if (selectValue == null) return;
        try {
            SetLoadingApi(true)
            newStartDate = startDate ? startDate.toLocaleDateString("en-CA") : null;
            newEndDate = endDate ? endDate.toLocaleDateString("en-CA") : null;
            await axios(url + ':7007/api/Report/getlist/' + selectValue + '?startDate=' + newStartDate + '&endDate=' + newEndDate + '&search=' + searchInput, { headers: header })
                .then(x => { SetLoadingApi(false), setStruckScale(x?.data ?? []), setdataExcel(x?.data ?? []) })
        } catch (e) {
            if (e.response) {
                if (e.response.status == "403") {
                    setRoles(true);
                    setStruckScale([])
                }
            }
        }

    };
    const handleChangeOn = async (e) => {
        const selectValue = e.target.value;
        setDataInput({ ...getDataInput, name: selectValue })
        getListType(selectValue)
    }
    const pageCount = Math.ceil(
        struckScale.filter((item) => {
            return searchInput.toLowerCase() === '' ? item : item.customer.toLowerCase().includes(searchInput.toLowerCase()) || item.carNumber.toLowerCase().includes(searchInput.toLowerCase());
        }).length / limit
    );
    const getValueDateTime = async ([newStartDate, newEndDate]) => {
        try {
            setStartDate(newStartDate ?? null);
            setEndDate(newEndDate ?? null);
            if (newStartDate != null || newEndDate != null) getListType(getDataInput.name, newStartDate, newEndDate, searchInput);
        } catch (e) {
            console.log(e)
        }
    }
    const handlePageClick = async (data) => {
        let currentPage = data.selected + 1
        setPageNumber(currentPage - 1);
    }
    return (
        <>
            {roles ? "Bạn không có quyền truy cập" :
                <>
                    <div className="col-md-12">
                        <div className="text">
                            <h2>Thông Tin Cân Xe</h2>
                        </div>
                        <div className="row">
                            <div className="col-md-3 w-20">
                                <div className="form-check">
                                    <span>Chọn loại Report: </span>
                                    <br></br>
                                    <select className="form-select" value={getDataInput.name} onChange={(e) => handleChangeOn(e)} aria-label="Default select example" >
                                        <option value=" ">...</option>
                                        {typeReport.map((item) => (
                                            <option key={item.id} value={item.name}>{item.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="col-md-3 w-30">
                                <div className="form-check">
                                    <span>Lọc ngày: </span>
                                    <br></br>
                                    <DatePicker
                                        className="form-control"
                                        selected={startDate}
                                        onChange={getValueDateTime}
                                        selectsRange
                                        startDate={startDate}
                                        endDate={endDate}
                                        isClearable={true}
                                        dateFormat="dd/MM/yyyy"
                                        showMonthDropdown
                                        fixedHeight
                                    />
                                </div>
                            </div>
                            <div className="col-md-3 w-30">
                                <div className="form-check">
                                    <span>Tìm kiếm: </span>
                                    <br></br>
                                    <div className="input-group">
                                        <input type="text" className="form-control"onChange={(e) => setSearchInput(e.target.value)} onInput={(e) => { setSearchInput(e.target.value), handlePageClick({ selected: 0 }) }} aria-label="Search"
                                            aria-describedby="button-addon2" placeholder="Tìm kiếm theo khách hàng hoặc hàng hóa" />
                                        <button className="btn btn-outline-secondary" type="button" id="button-addon2">
                                            <svg xmlns="https://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512">
                                                <path d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z" />
                                            </svg>
                                            <i className="fa fa-search" aria-hidden="true"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3 w-20">
                                <div className="form-check">
                                    <span>Xuất báo cáo: </span>
                                    <br></br>
                                    <ExportToExcel typeReport={getDataInput.name} apiData={dataExcel} fileName={fileName} />
                                </div>
                            </div>
                        </div>
                        <div className="row pt-3">
                            <div className="col-md  -12">
                                {loading ? (
                                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "120px" }}>
                                        <FontAwesomeIcon icon={faSpinner} spin style={{ width: "100px", height: "100px" }} />
                                    </div>
                                ) : (
                                    <div className="table-responsive-scale">
                                        {getDataInput.name === "Cân xe" ?
                                            <table id="scale-table" className="table table-striped table-bordered table-hover">
                                                <thead className="thead-light">
                                                    <>
                                                        < tr >
                                                            <th>STT</th>
                                                            <th>Số xe</th>
                                                            <th>Khách Hàng</th>
                                                            <th>Chứng Từ</th>
                                                            <th>Hàng Hóa</th>
                                                            <th>Cân lần 1</th>
                                                            <th>Cân lần 2</th>
                                                            <th>Kết quả</th>
                                                            <th>Ngày giờ cân lần 1</th>
                                                            <th>Ngày giờ cân lần 2</th>
                                                            <th>Loại nhập</th>
                                                            <th>Ghi chú</th>
                                                        </tr>
                                                    </>
                                                </thead>
                                                <tbody>
                                                    {struckScale.filter((item) => {
                                                        return searchInput.toLowerCase() === '' ? item : item.customer.toLowerCase().includes(searchInput.toLowerCase()) || item.product.toLowerCase().includes(searchInput.toLowerCase());
                                                    }).slice(pagesVisited, pagesVisited + limit)
                                                        .map((item, index) => (
                                                            <tr key={item.id}>
                                                                <td>{pagesVisited + (index + 1)}</td>
                                                                <td>{item.carNumber}</td>
                                                                <td>{item.customer}</td>
                                                                <td>{item.documents}</td>
                                                                <td>{item.product}</td>
                                                                <td>{item.firstScale ? item.firstScale.toLocaleString('en-US') : ''}</td>
                                                                <td>{item.secondScale ? item.secondScale.toLocaleString('en-US') : ''}</td>
                                                                <td>{item.results ? item.results.toLocaleString('en-US') : ''}</td>
                                                                <td>{item.firstScaleDate ? (new Date(item.firstScaleDate).toLocaleString("en-IN")) : ''}</td>
                                                                <td>{item.secondScaleDate ? (new Date(item.secondScaleDate).toLocaleString("en-IN")) : ''}</td>
                                                                <td>{item.styleScale}</td>
                                                                <td>{item.notes}</td>
                                                            </tr>
                                                        ))
                                                    }
                                                </tbody>
                                            </table>
                                            : getDataInput.name === "Bơm xe bồn"
                                                ? <table id="scale-table" className="table table-striped table-bordered table-hover">
                                                    <thead className="thead-light">
                                                        <>
                                                            < tr >
                                                                <th>STT</th>
                                                                <th>Số phiếu</th>
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
                                                        </>
                                                    </thead>
                                                    <tbody>
                                                        {struckScale.filter((item) => {
                                                            return searchInput.toLowerCase() === '' ? item : item.customer.toLowerCase().includes(searchInput.toLowerCase()) || item.product.toLowerCase().includes(searchInput.toLowerCase());
                                                        }).slice(pagesVisited, pagesVisited + limit)
                                                            .map((item, index) => (
                                                                <tr key={item.id}>
                                                                    <td>{pagesVisited + (index + 1)}</td>
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
                                                            ))
                                                        }
                                                    </tbody>
                                                </table>
                                                : null
                                        }
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
                                        activeClassName={'active'}
                                    />
                                </nav>
                            </div>
                        </div>
                    </div>
                </>
            }
        </>
    )
}
export default Report;