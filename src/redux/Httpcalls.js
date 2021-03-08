import axios from "axios";

const newAxiosInstance = axios.create();

export const getRules = newAxiosInstance.get('https://datapurereposervicenew.azurewebsites.net/getRules');

export const saveRules = (postdata) => newAxiosInstance.post('https://datapurereposervicenew.azurewebsites.net/saveRule',postdata,{"Access-Control-Allow-Origin":"*"});

export const applyAdj = (postData)  => newAxiosInstance.post('https://datapurereposervicenew.azurewebsites.net/applyAdj',postData,{"Access-Control-Allow-Origin":"*"});

export const executeRules = (processDate,ruleId,versionId) => newAxiosInstance.get('https://datapurereposervicenew.azurewebsites.net/executeRule?injectionDate='+processDate+'&ruleId='+ruleId+'&versionId='+versionId);

export const getExceptionType = (postData) => newAxiosInstance.post('https://datapurereposervicenew.azurewebsites.net/getExceptionType',postData,{"Access-Control-Allow-Origin":"*"});

export const getMetadata = () => newAxiosInstance.get('https://datapurereposervicenew.azurewebsites.net/getMetadata',{"Access-Control-Allow-Origin":"*"});

export const getAdjSuggestionsForCustomerBase = (postData) => newAxiosInstance.post('https://mlapimgmtsvc.azure-api.net/CustomerClassPredict/score',postData,{"Access-Control-Allow-Origin":"*"});

export const getAdjSuggestionsForIpoApplication = (postData) => newAxiosInstance.post('https://mlapimgmtsvc.azure-api.net/IPOPredict/score',postData,{"Access-Control-Allow-Origin":"*"});

export const getStgApi = (postData) => newAxiosInstance.post('https://datapurereposervicenew.azurewebsites.net/stageApi',postData,{"Access-Control-Allow-Origin":"*"});

export const reApplyAdj = (postData)  => newAxiosInstance.post('https://datapurereposervicenew.azurewebsites.net/reApplyAdj',postData,{"Access-Control-Allow-Origin":"*"});

export const getProcessDateAndVersion = (tableName) => newAxiosInstance.get('https://datapurereposervicenew.azurewebsites.net/getAllProcessDate?tableName='+tableName);

export const getTableStageData = (tableName,processDate,versionId) => {
	let url = 'https://datapurereposervicenew.azurewebsites.net/getStageData?tableName='+tableName;
	if(processDate != ''){
		url +='&processDate='+processDate;

		if(!isNaN(versionId)){
			console.log("version==="+versionId);
			url +='&version='+versionId;
		}
	}
	return newAxiosInstance.get(url);
}

export const saveCustomerbaseDataApi = (postData) => newAxiosInstance.post('https://datapurereposervicenew.azurewebsites.net/saveCustomerTableData',postData,{"Access-Control-Allow-Origin":"*"});

export const saveIpoApplicationDataApi = (postData) => newAxiosInstance.post('https://datapurereposervicenew.azurewebsites.net/saveIpoTableData',postData,{"Access-Control-Allow-Origin":"*"});

export const savePartyDataApi = (postData) => newAxiosInstance.post('https://datapurereposervicenew.azurewebsites.net/savePartyData',postData,{"Access-Control-Allow-Origin":"*"});

export const getAdjSuggestionsForParty = (postData) => newAxiosInstance.post('https://mlapimgmtsvc.azure-api.net/partygroupcode/score',postData,{"Access-Control-Allow-Origin":"*"});
