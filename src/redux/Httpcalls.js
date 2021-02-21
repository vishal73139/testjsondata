import axios from "axios";

const newAxiosInstance = axios.create();

export const getRules = newAxiosInstance.get('https://datapurereposervicenew.azurewebsites.net/getRules');

export const saveRules = (postdata) => newAxiosInstance.post('https://datapurereposervicenew.azurewebsites.net/saveRule',postdata,{"Access-Control-Allow-Origin":"*"});