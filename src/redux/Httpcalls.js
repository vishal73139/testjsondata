import axios from "axios";

const newAxiosInstance = axios.create();

export const getRules = newAxiosInstance.get('https://datapurereposervicenew.azurewebsites.net/getRules');

export const saveRules = (postdata) => newAxiosInstance.post('https://datapurereposervicenew.azurewebsites.net/saveRule',postdata,{"Access-Control-Allow-Origin":"*"});

export const executeRules = (processDate,ruleId,versionId) => newAxiosInstance.get('https://datapurereposervicenew.azurewebsites.net/executeRule?injectionDate='+processDate+'&ruleId='+ruleId+'&versionId='+versionId);

export const getExceptionType = (postData) => newAxiosInstance.post('https://datapurereposervicenew.azurewebsites.net/getExceptionType',postData,{"Access-Control-Allow-Origin":"*"});
