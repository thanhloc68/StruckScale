/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import url from '../components/url'
import ReactPaginate from "react-paginate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { faPenToSquare, faTrashCan, faCheckCircle } from "@fortawesome/free-regular-svg-icons";
import PopUpCenter from "../components/popupcustomer";
const Account = () => {
    let limit = 12;
    const [listAccount, setListAccount] = useState([]);
    const [listRole, setListRole] = useState([]);
    const [popupAddAccounts, setPopupAddAccounts] = useState(false);
    const [popupUpdateAccounts, setPopupUpdateAccounts] = useState(false);
    const [getDataInput, setDataInput] = useState([{
        id: 0,
        userName: "",
        status: 0,
        rolesID: 0
    }]);
    const [loading, setLoading] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const [pageNumber, setPageNumber] = useState(0);
    const [roles, setRoles] = useState(false);
    const pagesVisited = pageNumber * limit;
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
        navigate("/")
    }
    useEffect(() => {
        getListAccounts();
        getListRoles();
    }, [])
    const getListAccounts = async () => {
        try {
            setLoading(true)
            await axios(url + ':7007/api/Account', { headers: header }).then(x => { setListAccount(x.data) })
            setLoading(false)
        } catch (e) {
            if (e.response) {
                if (e.response.status == "403") {
                    setRoles(true)
                }
            }
        }
    }
    const addAccount = async (e) => {
        e.preventDefault();
        const input = {
            userName: getDataInput.userName,
            password: getDataInput.password,
            status: getDataInput.status,
            rolesID: getDataInput.rolesID
        }
        axios.post(url + ':7007/api/account/register', input, { headers: header })
            .then(x => { return toast.success("Thêm Thành Công"), getListAccounts(), setPopupAddAccounts(false) })
    }
    const updateAccounts = async (id) => {
        try {
            axios.put(url + ':7007/api/account/UpdateAccount/' + id, getDataInput, { headers: header })
                .then(res => { return toast.success("Cập nhật thành công"), getListAccounts(), setPopupUpdateAccounts(false) })
                .catch(err => toast.error(err.response))
        } catch (e) {
            toast.error(e.response.data)
        }
    }
    const handleOnChangePopup = (event) => {
        const { name, value, checked, type } = event.currentTarget;
        if (type === 'checkbox') {
            setDataInput((prev) => ({
                ...prev,
                [name]: checked,
            }));
        }
        else {
            setDataInput((prev) => {
                return {
                    ...prev,
                    [name]: value,
                }
            })
        }
    }
    const removeAccounts = async (id) => {
        try {
            if (id == null) { getListAccounts() }
            axios.delete(url + ':7007/api/account/DeleteAccount/' + id, { headers: header })
                .then(res => { return toast.success("Xóa thành công") })
                .catch(error => { return toast.error(error.response.data), getListAccounts() })
            setListAccount(listAccount.filter(listAccount => listAccount.id !== id))
        } catch (e) {
            toast.error(e.response.data);
        }
    }
    const getListRoles = async () => {
        axios.get(url + ':7007/api/role', { headers: header }).then(x => setListRole(x.data)).catch((e) => toast.error(e))
    }
    const pageCount = Math.ceil(listAccount.length / limit);
    const handlePageClick = async (data) => {
        let currentPage = data.selected + 1
        setPageNumber(currentPage - 1);
    }
    const setValueItem = async (data) => {
        setDataInput({
            id: data?.id,
            userName: data?.userName,
            password: data?.password,
            status: data?.status,
            rolesID: data?.rolesID,
        });
    }
    const handleRefresh = async () => {
        setDataInput({
            id: 0,
            userName: null,
            status: 0,
            rolesID: 0
        })
    }

    return (
        <>
            {roles ? "Bạn không có quyền truy cập" :
                <>
                    <div className="col-md-12">
                        <div className="text">
                            <h2>Thông Tin Tài Khoản</h2>
                        </div>
                        <div className="row">
                            <div className="col-6 col-md-6">
                                <div className="input-group">
                                    <input type="text" className="form-control" placeholder="Tìm kiếm tên tài khoản" onChange={(e) => setSearchInput(e.target.value)} onInput={(e) => { setSearchInput(e.target.value), handlePageClick({ selected: 0 }) }} aria-label="Search"
                                        aria-describedby="button-addon2" />
                                    <button className="btn btn-outline-secondary" type="button" id="button-addon2">
                                        <svg xmlns="https://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512">
                                            <path d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div className="col-6 col-md-6">
                                <div className="w-100 d-flex justify-content-end">
                                    <button className="btn btn-success btn-block" type="button" onClick={() => { setPopupAddAccounts(true), handleRefresh() }}>
                                        Tạo tài khoản
                                    </button>
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
                                            <thead className="thead-light text-center" >
                                                <tr>
                                                    <th>STT</th>
                                                    <th>Tên Tài Khoản</th>
                                                    <th>Phân Quyền</th>
                                                    <th>Status</th>
                                                    <th></th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-center">
                                                {listAccount.filter((item) => {
                                                    return searchInput.toLowerCase() === '' ? item : item.userName.toLowerCase().includes(searchInput.toLowerCase());
                                                }).slice(pagesVisited, pagesVisited + limit)
                                                    .map((item, i) => (
                                                        <tr key={item.id} onClick={() => {
                                                            setValueItem(item);
                                                        }}>
                                                            <td>{pagesVisited + (i + 1)}</td>
                                                            <td>{item.userName}</td>
                                                            <td>
                                                                {listRole.filter((items) => items.id == item.rolesID).map((item) => item.rolesName)}
                                                            </td>
                                                            <td><input type="checkbox" checked={item.status} /></td>
                                                            <td>
                                                                <button type="button" className="btn btn-light" onClick={() => setPopupUpdateAccounts(true)}>
                                                                    <FontAwesomeIcon icon={faPenToSquare} style={{ color: "blue" }} />
                                                                </button>
                                                            </td>
                                                            <td>
                                                                <button type="button" className="btn btn-light" onClick={() => removeAccounts(item.id)}>
                                                                    <FontAwesomeIcon icon={faTrashCan} style={{ color: "red" }} />
                                                                </button>
                                                            </td>
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
                        <div className="w-100">
                            <PopUpCenter trigger={popupAddAccounts} setTrigger={setPopupAddAccounts}>
                                <div className="col-md-12">
                                    <h3>Thông Tin Khách Hàng</h3>
                                    <div className="pd-10">
                                        <div className="w-35 pb-3">
                                            <label style={{ color: 'blue', fontWeight: 'bold', paddingBottom: '10px' }}>UserName</label>
                                            <input type="text" style={{ width: '100%' }} className="form-control" id="userName" name="userName" value={getDataInput.userName} onChange={(e) => handleOnChangePopup(e)} placeholder="Nhập User Name" />
                                        </div>
                                        <div className="w-35 pb-3">
                                            <label style={{ color: 'blue', fontWeight: 'bold', paddingBottom: '10px' }}>Password</label>
                                            <input type="password" style={{ width: '100%' }} className="form-control" id="password" name="password" value={getDataInput.password} onChange={(e) => handleOnChangePopup(e)} placeholder="Nhập Password" required />
                                        </div>
                                        <div className="d-flex align-items-center w-35 pb-3">
                                            <div className="col-md-6">
                                                <label style={{ color: 'blue', fontWeight: 'bold', paddingBottom: '10px' }}>Roles</label>
                                                <select className="form-select" value={getDataInput.rolesID} onChange={(e) => setDataInput({ ...getDataInput, rolesID: e.target.value })}>
                                                    <option key="" value="">...</option>
                                                    {
                                                        listRole.map((item, i) => <option key={i} value={item.id}>{item.rolesName}</option>)
                                                    }
                                                </select>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="ps-5">
                                                    <label style={{ color: 'blue', fontWeight: 'bold', paddingBottom: '10px' }}>Status</label>
                                                    <div className="form-check form-switch">
                                                        <input className="form-check-input" type="checkbox" id="status" name="status" checked={getDataInput.status} onChange={(e) => handleOnChangePopup(e)} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-35">
                                            <div className="d-flex justify-content-end align-items-center flex-wrap">
                                                <button type="button" className="btn btn-success btn-block" onClick={(e) => addAccount(e)}>
                                                    <FontAwesomeIcon icon={faCheckCircle} /> Thêm
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </PopUpCenter>
                        </div>
                        <div className="w-100">
                            <PopUpCenter trigger={popupUpdateAccounts} setTrigger={setPopupUpdateAccounts}>
                                <h3>Thông Tin Khách Hàng</h3>
                                <div className="pd-10">
                                    <div className="w-35 pb-3">
                                        <label style={{ color: 'blue', fontWeight: 'bold', paddingBottom: '10px' }}>UserName</label>
                                        <input type="text" style={{ width: '100%' }} className="form-control" id="userName" name="userName" value={getDataInput.userName} onChange={(e) => handleOnChangePopup(e)} placeholder="Nhập User Name" disabled />
                                    </div>
                                    <div className="w-35 pb-3">
                                        <label style={{ color: 'blue', fontWeight: 'bold', paddingBottom: '10px' }}>Password</label>
                                        <input type="password" style={{ width: '100%' }} className="form-control" id="password" name="password" value={getDataInput.password} onChange={(e) => handleOnChangePopup(e)} placeholder="Nhập Password" required />
                                    </div>
                                    <div className="d-flex align-items-center w-35 pb-3">
                                        <div className="col-md-6">
                                            <label style={{ color: 'blue', fontWeight: 'bold', paddingBottom: '10px' }}>Roles</label>
                                            <select className="form-select" value={getDataInput.rolesID} onChange={(e) => setDataInput({ ...getDataInput, rolesID: e.target.value })}>
                                                <option key="" value="">...</option>
                                                {
                                                    listRole.map((item, i) => <option key={i} value={item.id}>{item.rolesName}</option>)
                                                }
                                            </select>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="ps-5">
                                                <label style={{ color: 'blue', fontWeight: 'bold', paddingBottom: '10px' }}>Status</label>
                                                <div className="form-check form-switch">
                                                    <input className="form-check-input" type="checkbox" id="status" name="status" checked={getDataInput.status} onChange={(e) => handleOnChangePopup(e)} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-35">
                                        <div className="d-flex justify-content-end align-items-center flex-wrap">
                                            <button type="button" className="btn btn-primary" onClick={() => updateAccounts(getDataInput.id)}>
                                                <FontAwesomeIcon icon={faCheckCircle} /> Cập nhật
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </PopUpCenter>
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
                    <div className="col-md-12">
                    </div>

                </>
            }
        </>
    )
}
export default Account;