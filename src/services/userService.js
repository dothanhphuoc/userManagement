import axios from "./customize_axios ";

const fetchAllUser = (page) => {
  return axios.get(`/api/users?page=${page}`);
};

const postCreateUser = (name, job) => {
  return axios.post(`/api/users`, { name, job });
};

const putUpdateUser = (name, job, id) => {
  return axios.put(`/api/user/${id}`, { name, job });
};

const deleteUser = (id) => {
  return axios.delete(`/api/user/${id}`);
};

const loginApi = (email, password) => {
  return axios.post("/api/login", {email, password});
};

export { fetchAllUser, postCreateUser, putUpdateUser, deleteUser, loginApi };
