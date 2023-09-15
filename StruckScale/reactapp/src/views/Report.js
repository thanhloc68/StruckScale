/* eslint-disable no-unused-vars */
import React from 'react';
import { useEffect, useState } from "react"
import ReactPaginate from 'react-paginate';
import { ExportToExcel } from '../components/ExportToExcel';
import '../assets/style.css'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';

const Report = () => {
    const [struckScale, setStruckScale] = useState([])
    const [dataExcel, setdataExcel] = useState([{
        StruckID: "",
        ordinalNumber: "",
        carNumber: "",
        documents: "",
        product: "",
        customer: "",
        firstScale: 0,
        secondScale: 0,
        results: 0,
        firstScaleDate: "",
        secondScaleDate: "",
        createDate:"",
        styleScale: "",
        notes: "",
    }])
    const [searchInput, setSearchInput] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [pageNumber, setPageNumber] = useState(0);
    const fileName = "Report"
    let limit = 12;
    const pagesVisited = pageNumber * limit;
    useEffect(() => {
        getList();
    }, []);
    const getList = async () => {
        const res = await axios('https://localhost:7007/api/Home/getAll').then(x => { setStruckScale(x.data) })
    };
    const pageCount = Math.ceil(
        struckScale.filter((item) => {
            return searchInput.toLowerCase() === '' ? item : item.customer.toLowerCase().includes(searchInput.toLowerCase()) || item.carNumber.toLowerCase().includes(searchInput.toLowerCase());
        }).length / limit
    );
    const getValueDateTime = async ([newStartDate, newEndDate]) => {
        try {
            setStartDate(newStartDate);
            setEndDate(newEndDate);
            let rangeDate = newStartDate.toLocaleDateString("es-CL") + " - " + newEndDate.toLocaleDateString("es-CL");
            const res = await axios.get('https://localhost:7007/api/Home/GetDataByDate/' + rangeDate)
                .then(x => setdataExcel(x.data))
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
            <div className="text">
                <h2>Thông Tin Cân Xe</h2>
            </div>
            <div className="tablebox">
                <div className="searchbox">
                    <div className="input-group">
                        <input type="text" className="form-control" placeholder="Search" onChange={(e) => setSearchInput(e.target.value)} onInput={(e) => { setSearchInput(e.target.value), handlePageClick({ selected: 0 }) }} aria-label="Search"
                            aria-describedby="button-addon2" />
                        <button className="btn btn-outline-secondary" type="button" id="button-addon2">
                            <svg xmlns="https://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512">
                                <path d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z" />
                            </svg>
                            <i className="fa fa-search" aria-hidden="true"></i>
                        </button>
                    </div>
                </div>
                <div className="calendar">
                    <DatePicker
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
                    <ExportToExcel apiData={dataExcel} fileName={fileName} />
                </div>
            </div>
            <div className="row pt-3">
                <div className="col-sm-12">
                    <div className="table-responsive-scale">
                        <table id="scale-table" className="table table-striped table-bordered table-hover">
                            <thead className="thead-light">
                                <tr>
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
                            </thead>
                            <tbody>
                                {struckScale.filter((item) => {
                                    return searchInput.toLowerCase() === '' ? item : item.customer.toLowerCase().includes(searchInput.toLowerCase()) || item.carNumber.toLowerCase().includes(searchInput.toLowerCase());
                                })
                                    .slice(pagesVisited, pagesVisited + limit)
                                    .map((item, index) => (
                                        <tr key={item.id}>
                                            <td>{index + 1}</td>
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
                            activeClassName={'active'}
                        />
                    </nav>
                </div>
            </div>
        </>
    )
}
export default Report;