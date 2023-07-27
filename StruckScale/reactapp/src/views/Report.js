import React from 'react';
import { useEffect, useState } from "react"
import ReactPaginate from 'react-paginate';
import '@mobiscroll/react/dist/css/mobiscroll.min.css';
import { Datepicker, setOptions } from '@mobiscroll/react';
import { ExportToExcel } from '../components/ExportToExcel';
import '../assets/style.css'
setOptions({
    theme: 'ios',
    themeVariant: 'light'
});
const Report = () => {
    const [struckScale, setStruckScale] = useState([])
    const [dataExcel, setdataExcel] = useState([])
    const [pageCount, setPageCount] = useState(1)
    const [searchInput, setSearchInput] = useState('');
    const fileName = "Report"
    let limit = 10;
    useEffect(() => {
        const getList = async () => {
            //const res = await fetch('https://100.100.100.132:7007/api/Home/get?pg=1&pageSize=' + limit);
            const res = await fetch('https://localhost:7007/api/Home/get?pg=1&pageSize=' + limit);
            const data = await res.json();
            const total = data.totalPages;
            setPageCount(Math.ceil(total / limit));
            setStruckScale(data.data)
        };
        getList();
    }, []);
    const fetchData = async (currentPage) => {
        const res = await fetch('https://localhost:7007/api/Home/get?pg=' + currentPage + '&pageSize=' + limit);
        const data = await res.json();
        return data.data;
    };
    const getValueDateTime = async (data) => {
        let rangeDateValue = data.valueText
        const res = await fetch('https://localhost:7007/api/Home/GetDataByDate/' + rangeDateValue)
        const datafetch = await res.json();
        setdataExcel(datafetch);
        return data;
    }
    const handlePageClick = async (data) => {
        let currentPage = data.selected + 1
        const getlistinfo = await fetchData(currentPage)
        setStruckScale(getlistinfo)
    }

    return (
        <>
            <div className="text">
                <h2>Thông Tin Cân Xe</h2>
            </div>
            <div className="tablebox">
                <div className="searchbox">
                    <div className="input-group">
                        <input type="text" className="form-control" placeholder="Search" onChange={(e) => setSearchInput(e.target.value)} onInput={(e) => setSearchInput(e.target.value)} aria-label="Search"
                            aria-describedby="button-addon2" />
                        <button className="btn btn-outline-secondary" type="button" id="button-addon2">
                            <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512">
                                <path d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z" />
                            </svg>
                            <i className="fa fa-search" aria-hidden="true"></i>
                        </button>
                    </div>
                </div>
                <div className="calendar">
                    <Datepicker onChange={getValueDateTime}
                        name="getDate"
                        controls={['calendar']}
                        select="range"
                        calendarType="month"
                        pages={2}
                        dateFormat='DD-MM-YYYY'
                        inputProps={{
                            placeholder: 'Please Select Range Date...'
                        }}
                    />
                    <ExportToExcel apiData={dataExcel} fileName={fileName} />
                </div>
            </div>
            <div className="row">
                <div className="col-sm-12">
                    <table className="table table-striped table-bordered table-hover table-responsive">
                        <thead className="thead-light">
                            <tr>
                                <th>Số xe</th>
                                <th>Khách Hàng</th>
                                <th>Chứng Từ</th>
                                <th>Số lần cân 1</th>
                                <th>Số lần cân 2</th>
                                <th>Kết quả</th>
                                <th>Ngày giờ cân lần 1</th>
                                <th>Ngày giờ cân lần 2</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                struckScale.filter((item) => {
                                    return searchInput.toLowerCase() === '' ? item : item.customer.toLowerCase().includes(searchInput.toLowerCase()) || item.carNumber.toLowerCase().includes(searchInput.toLowerCase());
                                }).map((item) => (
                                    <tr key={item.id}>
                                        <td>{item.carNumber}</td>
                                        <td>{item.customer}</td>
                                        <td>{item.document}</td>
                                        <td>{item.firstScale}</td>
                                        <td>{item.secondScale}</td>
                                        <td>{item.result}</td>
                                        <td>{item.firstScaleDate}</td>
                                        <td>{item.secondScaleDate}</td>
                                    </tr>
                                ))
                            }
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
                            activeClassName={'active'}
                        />
                    </nav>
                </div>
            </div>
        </>
    )
}
export default Report;