/*
 * @Description:
 * @Version:
 * @Autor: louisyi
 * @Date: 2019-08-26 17:56:12
 * @LastEditors: louisyi
 * @LastEditTime: 2019-10-10 10:28:33
 */
import axios from 'axios'
import router from '@/router'
import Vue from 'vue'
// 配置根域名
axios.defaults.headers.post['Content-Type'] = 'application/json,charset=utf-8'

import {
	Message,
	MessageBox
} from 'element-ui'
import request from '@/axios/request'
let Intranet = `/api`;
const api = {
	userList(data) {
		return request({
			url: `${Intranet}/Personalfiles/GetPersonalList`,
			method: 'get',
			params: data
		})
	},
	getUserId(data) {
		return request({
			url: `${Intranet}/Personalfiles/GetById`,
			method: 'get',
			params: data
		})
	},
	saveUser(data) {
		return request({
			url: `${Intranet}/Personalfiles/Save`,
			method: 'post',
			params: data
		})
	},

};
export default api;
