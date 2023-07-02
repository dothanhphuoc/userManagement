import axios from "axios";

const instance = axios.create({
    baseURL: 'https://reqres.in'
});

// Add a response interceptor
instance.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response.data ? response.data : {statusCode : response.status};

  }, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    let res = {}

    if(error.response) {
      res.data = error.response.data;
      res.status = error.response.status;
      res.headers = error.response.headers;
    }
    
    return res;
    // return Promise.reject(error);
  
});

export default instance;
