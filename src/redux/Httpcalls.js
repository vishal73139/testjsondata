import axios from "axios";

const newAxiosInstance = axios.create();

export const getRules = newAxiosInstance.get('https://datapurereposervicenew.azurewebsites.net/getRules');

export const saveRules = (postdata) => newAxiosInstance.post('https://datapurereposervicenew.azurewebsites.net/saveRule',postdata,{"Access-Control-Allow-Origin":"*"});

export const applyAdj = (postData)  => newAxiosInstance.post('https://datapurereposervicenew.azurewebsites.net/applyAdj',postData,{"Access-Control-Allow-Origin":"*"});

export const executeRules = (processDate,ruleId,versionId) => newAxiosInstance.get('https://datapurereposervicenew.azurewebsites.net/executeRule?injectionDate='+processDate+'&ruleId='+ruleId+'&versionId='+versionId);

export const getExceptionType = (postData) => newAxiosInstance.post('https://datapurereposervicenew.azurewebsites.net/getExceptionType',postData,{"Access-Control-Allow-Origin":"*"});

export const getMetadata = () => newAxiosInstance.get('https://datapurereposervicenew.azurewebsites.net/getMetadata',{"Access-Control-Allow-Origin":"*"});

export const getAdjSuggestionsForCustomerBase = (postData) => newAxiosInstance.post('http://d0021f2c-4ae0-403b-9861-099e377345c4.eastus2.azurecontainer.io/score',postData,{"Access-Control-Allow-Origin":"*"});

export const getAdjSuggestionsForIpoApplication = (postData) => newAxiosInstance.post('http://mlapimgmtsvc.azure-api.net/IPOPredict/score',postData,{"Access-Control-Allow-Origin":"*"});

export const getStgApi = (postData) => newAxiosInstance.post('https://datapurereposervicenew.azurewebsites.net/stageApi',postData,{"Access-Control-Allow-Origin":"*"});

export const reApplyAdj = (postData)  => newAxiosInstance.post('https://datapurereposervicenew.azurewebsites.net/reApplyAdj',postData,{"Access-Control-Allow-Origin":"*"});