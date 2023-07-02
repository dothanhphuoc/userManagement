import { useEffect, useState } from "react";
import "./style.scss";
import { Table } from "react-bootstrap";
import _ from "lodash";
import { debounce } from "lodash";
import { CSVLink } from "react-csv";
import Papa from "papaparse";
import { toast } from "react-toastify";

import { fetchAllUser } from "../../services/userService";
import ReactPaginate from "react-paginate";
import ModelAddNew from "../ModalAddNew";
import ModalEditUser from "../ModalEditUser";
import ModalConfirm from "../ModalConfirm";

const TableUsers = (props) => {
  const [users, setUsers] = useState([]);

  const [totalPages, setTotalPages] = useState(0);

  // eslint-disable-next-line
  const [totalUser, setTotalUser] = useState(0);

  const [isShowModalAddNew, setIsShowModalAddNew] = useState(false);
  const [isShowMadalEdit, setIsShowModalEdit] = useState(false);

  const [dataUserEdit, setDataUserEdit] = useState({});

  const [isShowModalDelete, setIsShowModalDelete] = useState(false);
  const [dataUserDelete, setDataUserDelete] = useState({});

  // eslint-disable-next-line
  const [sortBy, setSortBy] = useState("asc");
  // eslint-disable-next-line
  const [sortField, setSortField] = useState("id");

  // const [search, setSearch] = useState(undefined)

  const [dataExport, setDataExport] = useState([]);

  const handleClose = () => {
    setIsShowModalAddNew(false);
    setIsShowModalEdit(false);
    setIsShowModalDelete(false);
  };

  const handleUpdateTable = (user) => {
    setUsers([user, ...users]);
  };

  const handleSaveBeforeEdit = (user) => {
    let cloneUsers = [...users];

    let index = users.findIndex((item) => item.id === user.id);

    cloneUsers[index].first_name = user.first_name;

    setIsShowModalEdit(false);

    setUsers(cloneUsers);
  };

  useEffect(() => {
    getUsers(1);
  }, []);

  const getUsers = async (page) => {
    let res = await fetchAllUser(page);

    if (res && res.data) {
      setTotalUser(res.total);
      setUsers(res.data);
      setTotalPages(res.total_pages);
    }
  };

  const handlePageClick = (event) => {
    getUsers(event.selected + 1);
  };

  const handleEditUser = (user) => {
    setDataUserEdit(user);
    setIsShowModalEdit(true);
  };

  const handleDeleteUser = (user) => {
    setIsShowModalDelete(true);
    setDataUserDelete(user);
  };

  const handleDeleteUserFromModal = (user) => {
    let cloneUsers = [...users];

    cloneUsers = cloneUsers.filter((item) => item.id !== user.id);
    setUsers(cloneUsers);
  };

  const handleSort = (sortBy, sortField) => {
    setSortBy(sortBy);
    setSortField(sortField);

    let cloneUsers = [...users];

    cloneUsers = _.orderBy(cloneUsers, [sortField], [sortBy]);

    setUsers(cloneUsers);
  };

  const handleSearch = debounce((e) => {
    let search = e.target.value;
    // setSearch(e.target.value);
    if (search) {
      console.log("render");
      let cloneUsers = _.cloneDeep(users);
      cloneUsers = cloneUsers.filter((item) => item.email.includes(search));
      setUsers(cloneUsers);
    } else {
      getUsers(1);
    }
  }, 500);

  // const csvData = [
  //   ["firstname", "lastname", "email"],
  //   ["Ahmed", "Tomi", "ah@smthing.co.com"],
  //   ["Raed", "Labes", "rl@smthing.co.com"],
  //   ["Yezzi", "Min l3b", "ymin@cocococo.com"]
  // ];

  const getUsersExport = (e, done) => {
    let result = [];
    if (users && users.length > 0) {
      result.push(["Id", "Email", "First Name", "Last Name"]);

      // eslint-disable-next-line array-callback-return
      users.map((item, index) => {
        let arr = [];
        arr[0] = item.id;
        arr[1] = item.email;
        arr[2] = item.first_name;
        arr[3] = item.last_name;

        result.push(arr);
      });

      setDataExport(result);
      done();
    }
  };

  const handleImportCSV = (e) => {
    if (e.target && e.target.files && e.target.files[0]) {
      let file = e.target.files[0];

      if (file.type !== "text/csv") {
        toast.error("Chỉ tải được file.csv... Thử lại!!");
        return;
      }

      Papa.parse(file, {
        // header: true,
        complete: function (results) {
          let rawCSV = results.data;
          if (rawCSV.length > 0) {
            if (rawCSV[0] && rawCSV[0].length === 3) {
              if (
                rawCSV[0][0] !== "email" ||
                rawCSV[0][1] !== "first_name" ||
                rawCSV[0][2] !== "last_name"
              ) {
                toast.error("Wrong format Header CSV file!!");
              } else {
                let result = [];

                // eslint-disable-next-line array-callback-return
                rawCSV.map((item, index) => {
                  if(index > 0 && item.length === 3) {
                    let obj = {};
                    obj.email = item[0]
                    obj.first_name = item[1]
                    obj.last_name = item[2]

                    result.push(obj)
                  }
                })

                setUsers(result)

                console.log('>>> check result', result)
              }
            } else {
              toast.error("Not found data on CSV");
            }
          }
        },
      });
    }
  };

  return (
    <>
      <div className="my-3 add-new d-sm-flex">
        <h3 className="">
          <b>User List</b>
        </h3>

        <div className="team-button mt-sm-0 mt-2">
          <label htmlFor="text" className="btn btn-info text-white">
            <i className="fa-solid fa-file-import mr-10"></i>
            Import
          </label>
          <input
            id="text"
            type="file"
            hidden
            onChange={(e) => handleImportCSV(e)}
          />

          <CSVLink
            // data={csvData}
            filename={`data-file-${Math.floor(Math.random() * 10000)}.csv`}
            className="btn btn-info text-white"
            target="_blank"
            data={dataExport}
            asyncOnClick={true}
            onClick={(e, done) => getUsersExport(e, done)}
          >
            <i className="fa-solid fa-file-export mr-10"></i>
            Export
          </CSVLink>

          <button
            className="btn btn-success"
            onClick={() => setIsShowModalAddNew(true)}
          >
            <i className="fa-solid fa-circle-plus mr-10"></i>
            Add new user
          </button>
        </div>
      </div>

      <div className="col-12 col-sm-4 my-3 mx-auto">
        <input
          className="form-control"
          placeholder="Search user by email..."
          // value={search}
          onChange={(e) => handleSearch(e)}
        />
      </div>


      <div className="customize-table">
        <Table striped bordered hover >
          <thead>
            <tr>
              <th className="sort-header">
                <span>ID</span>
                <span>
                  <i
                    className="fa-solid fa-arrow-down"
                    onClick={() => handleSort("desc", "id")}
                  ></i>
                  <i
                    className="fa-solid fa-arrow-up"
                    onClick={() => handleSort("asc", "id")}
                  ></i>
                </span>
              </th>
              <th>Email</th>
              <th className="sort-header">
                <span>First Name</span>
                <span>
                  <i
                    className="fa-solid fa-arrow-down"
                    onClick={() => handleSort("desc", "first_name")}
                  ></i>
                  <i
                    className="fa-solid fa-arrow-up"
                    onClick={() => handleSort("asc", "first_name")}
                  ></i>
                </span>
              </th>
              <th>Last Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users &&
              users.length > 0 &&
              users.map((user) => {
                return (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.email}</td>
                    <td>{user.first_name}</td>
                    <td>{user.last_name}</td>
                    
                    <td>
                      <button
                        className="btn btn-success mx-2"
                        onClick={() => handleEditUser(user)}
                      >
                        Edit
                        <i className="fa-solid fa-file-pen ml-10"></i>
                      </button>
                      <button
                        className="btn btn-warning"
                        onClick={() => handleDeleteUser(user)}
                      >
                        Delete
                        <i className="fa-solid fa-trash ml-10"></i>
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </Table>
      </div>

      <ReactPaginate
        className=""
        breakLabel="..."
        nextLabel="next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={totalPages}
        previousLabel="< previous"
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item"
        previousLinkClassName="page-link"
        nextClassName="page-item"
        nextLinkClassName="page-link"
        breakClassName="page-item"
        breakLinkClassName="page-link"
        containerClassName="pagination"
        activeClassName="active"
      />

      <ModelAddNew
        isShowModalAddNew={isShowModalAddNew}
        handleClose={handleClose}
        handleUpdateTable={handleUpdateTable}
      />

      <ModalEditUser
        isShowMadalEdit={isShowMadalEdit}
        handleClose={handleClose}
        dataUserEdit={dataUserEdit}
        handleSaveBeforeEdit={handleSaveBeforeEdit}
      />

      <ModalConfirm
        isShowModalDelete={isShowModalDelete}
        handleClose={handleClose}
        dataUserDelete={dataUserDelete}
        users={users}
        setUsers={setUsers}
        handleDeleteUserFromModal={handleDeleteUserFromModal}
      />
    </>
  );
};

export default TableUsers;
