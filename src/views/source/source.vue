<template>
	<div class="internal-change common-table">

		<el-collapse class="common-collapse" v-model="currentCollapse">
			<el-collapse-item name="1" class="active">
				<div class="pb20">
					<el-button @click="addrouter" type="primary" size="small" :disabled="callFlag || addFlag">新 增
					</el-button>
					<el-button type="danger" size="small" @click="delList" :disabled="callFlag">删 除</el-button>
				</div>
				<el-collapse-item name="2" disabled>
					<template slot="title">
						<div class="collapse-title">批量导入</div>
					</template>
					<el-row>
						<el-col>
							<el-form>
								<el-form-item label="选择文件" class="select-file">
									<el-upload ref="template" class="upload-demo" :before-upload="beforeTemplateUpload" :action="importTemplateUrl"
									 :on-preview="handleTemplatePreview" :on-remove="handleTemplateRemove" :before-remove="templatebeforeRemove"
									 :file-list="formData.file" :on-success="templateImportSuccess" :on-error="templateImportError" :limit="1"
									 :on-exceed="handleTemplateExceed" :on-change="handleTemplatechange" :headers="headers" accept=".xls"
									 :disabled="callFlag" :auto-upload="false">
										<el-button slot="trigger" size="small" height="28px" class="primary-btn" :disabled="callFlag || importFlag">浏览
										</el-button>

										<el-button size="small" height="28px" class="primary-btn template-upload" @click="submitTemplateUpload"
										 :disabled="callFlag || importFlag">导入
										</el-button>
									</el-upload>
								</el-form-item>
							</el-form>
							<!-- :action="importTemplateUrl" -->

							<el-button size="small" @click="dialogVisible=true" :disabled="callFlag" class="download">下载模板
							</el-button>
						</el-col>
					</el-row>
				</el-collapse-item>
				<el-table :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)" style="width: 100%" border class="table-box"
				 row-key="key" v-loading="loading" @selection-change="SelectionChange">
					<el-table-column :show-overflow-tooltip="true" type="selection" width="45"></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="Name" label="姓名"></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="Subject" label="科目"></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="SubjectType" label="科目类型"></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="AchieveDate" label="考试时间">
						<template slot-scope="scope">
							<span>{{scope.row.AchieveDate?scope.row.AchieveDate.split('T')[0]:""}}</span>
						</template>
					</el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="Score" label="得分"></el-table-column>
				</el-table>
				<!-- 分页 -->
				<div class="block pagination">
					<el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize" background
					 layout="total, prev, pager, next, jumper" :total="tableData.length" :current-page.sync="currentPage"></el-pagination>
				</div>
			</el-collapse-item>


			<el-collapse-item v-if="isHistory || isTodo" name="2" disabled>
				<template slot="title">
					<div class="collapse-title">审批历史</div>
				</template>
				<el-table :data="approveHistory" tooltip-effect="dark" style="width: 100%" class="history" v-if="isHistory">
					<el-table-column width="120">
						<template slot-scope="scope">
							<i class="el-icon-success" v-if="scope.row.mapVOS[0].circulationConditions=='Y' && scope.row.endTime"></i>
							<i v-else-if="!scope.row.mapVOS[0].circulationConditions && !scope.row.endTime "></i>
							<i v-else-if="scope.row.mapVOS[0].circulationConditions=='N'" class="el-icon-error"></i>
							<i v-else class="el-icon-s-help"></i>
						</template>
					</el-table-column>
					<el-table-column prop="name" label="节点" width="120"></el-table-column>
					<el-table-column prop="assigneeName" label="操作人" width="120"></el-table-column>
					<el-table-column prop="formKey" label="操作" width="120"></el-table-column>
					<el-table-column prop="endTime" label="操作时间" show-overflow-tooltip></el-table-column>
					<el-table-column label="审批意见" show-overflow-tooltip>
						<!--              <template slot-scope="scope">-->
						<!--                <span>{{scope.row.mapVOS[0] && scope.row.mapVOS[0].approvalOpinion}}</span>-->
						<!--              </template>-->
						<template slot-scope="scope">
							<div v-if="!scope.row.mapVOS[0].approvalOpinion && scope.row.formKey!='待审批'">
								— —
							</div>
							<a v-else :title="scope.row.mapVOS[0] && scope.row.mapVOS[0].approvalOpinion">{{scope.row.mapVOS[0] && scope.row.mapVOS[0].approvalOpinion | ellipsis}}</a>
						</template>
					</el-table-column>
				</el-table>
			</el-collapse-item>
		</el-collapse>
		</el-form>

		<el-dialog title="模板" :visible.sync="dialogVisible" width="30%" @close="getClickedTemplate('cancel')">
			<div class="template-list">
				<el-row>
					<el-radio-group v-model="checkedtemplates" @change="handleCheckedTemplates">
						<el-col :span="24" v-for="(item,index) in templateList" :key="index" style="margin-bottom:15px;">
							<el-radio :label="item.url">{{item.name}}</el-radio>
						</el-col>
					</el-radio-group>
				</el-row>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button @click="getClickedTemplate('cancel')">取 消</el-button>
				<el-button @click="getClickedTemplate('selected')">确 定</el-button>
			</div>
		</el-dialog>

		<!-- 模板下载 -->
		<el-dialog title="添加设备" top="1vh" append-to-body :visible.sync="equipDialog" width="70%" class="add-Equip">
			<add-source ></add-source>
		</el-dialog>
	</div>
</template>
<script>
	import {
		getTime
	} from "../../common/until";
	import addSource from "./addSource";


	export default {
		props: {
			paramList: {
				type: Object
			}
		},
		components: {
			addSource,
		},
		data() {
			return {
				loadingTrue: "", // loading框
				fileList: [], // 选中的模板  是个数组
				mokuaiRen: [], // 选择模块 => 下面的人集合
				data: [], // 选择模块的组织架构
				defaultProp: {
					children: "children",
					label: "displayName"
				},
				isModule: false, // 是否存在模块  初始化给的
				BGJingLi: {}, // 变更经理
				innerVisible: false, // 使用人选择弹出显示
				callFlag: false, // 提交之后 所有按钮不可点
				addFlag: false, // 新增 （新增和导入互斥）
				importFlag: false, // 导入 （新增和导入互斥）
				innerVisible: false, // 使用人选择弹出显示
				department: [], // 使用人
				flag: "", // 是否是管理员 true是 false否
				submitFlag: true,
				submitSuccessId: "",
				currentCollapse: ["1", "2", "3", "4"],
				headers: {
					token: localStorage.getItem("token")
				},
				equipArr: [],
				isHistory: false,
				isTodo: false,
				childId: "",
				approveHistory: [],
				formData: {
					processId: "", //申请编号
					status: "",
					applyDate: "",
					subject: "",
					applicant: "",
					telephone: "",
					order: "",
					file: [],
					uploadFile: [],
					participation: "",
					planTime: "",
					provider: "", //供应商
					projectNum: "", //项目编号
					projectName: "" //项目名称
				},
				fileRefIds: [],
				rules: {
					subject: [{
							required: true,
							message: "主题不能为空",
							trigger: ["blur", "change"]
						},
						{
							min: 6,
							max: 50,
							message: "申请主题长度为 6 - 50 个字符",
							trigger: ["blur", "change"]
						}
					],
					order: {
						required: true,
						message: "项目编号不能为空",
						trigger: ["blur", "change"]
					},
					file: {
						required: true,
						message: "上传文件不能为空",
						trigger: "change"
					},
					participation: {
						required: true,
						message: "验收参与人员不能为空",
						trigger: "change"
					},
					participation: {
						required: true,
						message: "验收参与人员不能为空",
						trigger: "change"
					},
					planTime: {
						required: true,
						message: "计划验收时间不能为空",
						trigger: "change"
					}
				},
				arr: [],
				dialogVisible: false,
				defaultExpandAll: true,
				defaultJoinId: [],
				joinUser: [],
				checkedtemplates: [],
				submitTemplate: [],
				mainTemplatecachedId: "",
				equipDialog: false,
				// pickerOptions: {
				//   disabledDate(time) {
				//     return time.getTime() < Date.now() - 8.64e7;
				//   }
				// },
				purchaseOrder: [],
				templateList: [],
				tableData: [],
				loading: false,
				participantList: [],
				emptyText: "正在加载...",
				defaultProps: {
					children: "children",
					label: "name"
				},
				nowUsingMan: [],
				userData: [],
				selectedUser: [], //当前选中的
				prevSelectedUser: [], //记录上次选中的
				numPrevCode: 0, //记录是不是第一次点击
				allSelectedUser: [], //
				MarkCurrentFlag: true,
				cancelSelectedUser: [],
				// 默认显示第几页
				currentPage: 1,
				// 总条数，根据接口获取数据长度(注意：这里不能为空)
				totalCount: 0,
				// 默认每页显示的条数（可修改）
				pageSize: 10,
				pageCount: 5,
				pages: {}, // 结构树分页数据
				deptNum: 0,
				positionCode: [],
				value: "",
				importTemplateUrl: ""
			};
		},
		methods: {
			list() {
				let data = {
					pid: "",
					subject: "单杠3练习",
					dateBegin: "",
					dateEnd: "",
					Authorization: ""
				};
				this.$api.getScroces(data).then(res => {
					this.tableData = res
					// this.totalCount = res.pageModel.PageCount
				}).catch(err => {
					console.log(err);
				})
			},
			// 点击导入浏览
			getTemplate() {
				this.$refs.template.clearFiles()
				this.tableData = []
				this.formData.file = []
			},

			// 部门结构树分页
			changeYeMa(val) {
				let currt = val;
				var url =
					"base/user/list?deptNum=" +
					this.pages.deptNum +
					"&size=15&current=" +
					currt;
				axiosGet(url).then(result => {
					if (result.code == 200) {
						if (result.data.records.length) {
							this.mokuaiRen = result.data.records;
							this.pages.total = result.data.total;
						}
					}
				});
			},

			// get组织架构数据
			getTreeJingLi() {
				var that = this;
				axiosGet("base/dept/myTree").then(result => {
					if (result.code == 200) {
						that.data = result.data;
						that.data[0].ids = 1;
					} else {}
				});
			},

			// 选择使用人-确定
			// handleNodeClicks(data) {
			//   // '1909'
			//   var url = "base/user/list?deptNum=" + data.deptNum + "&size=15&current=1";
			//   axiosGet(url).then(result => {
			//     if (result.code == 200) {
			//       if (result.data.records.length) {
			//         this.mokuaiRen = result.data.records;
			//         this.pages.total = result.data.total;
			//         this.pages.deptNum = data.deptNum;
			//       } else {
			//         this.$message({
			//           message: "此模块为空！",
			//           type: "warning"
			//         });
			//       }
			//     }
			//   });
			// },

			// 模块选择人
			// searchRen(data) {
			//   this.BGJingLi = data;
			//   this.innerVisible = false;
			//   this.mokuaiRen = [];
			// },

			// 选择使用人-确定
			departmentOk(index) {
				let res = this.$refs.tree.getCheckedNodes();
				this.tableData.forEach(item => {
					if (item.index === index) {
						item.nowUsingMan = res[0].name;
						item.module = res[0].deptName;
					}
				});
				// 关闭部门选择
				this.innerVisible = false;
			},

			// 勾选的表格
			SelectionChange(val) {
				// this.arr = [];
				// val.forEach(item => {
				//   this.arr.push(item.index);
				// });
				this.arr = val
				// this.equipNum = this.arr.join(',')
			},

			// 分页
			handleCurrentChange(val) {
				this.currentPage = val;
			},

			// 选择模板
			handleCheckedTemplates(value) {
				var _this = this;
				_this.checkedtemplates = value;
			},

			// 选择单个模板进行下载
			getClickedTemplate(value) {
				var _this = this;
				if (_this.templateList.length > 0) {
					var url = _this.templateList[0].url;
				}
				var loading = this.$loading({
					lock: true,
					text: "下载中，请稍后...",
					background: "rgba(0, 0, 0, 0.7)"
				});
				axiosGet(url).then(result => {
					if (result.code == 200) {
						window.location.href = _this.constApi + result.data;
						loading.close();
					}
				});
			},

			handleTemplatePreview(file) {

			},

			// 导入模板 点击导入
			submitTemplateUpload() {
				if (this.fileList && this.fileList[0] && this.fileList[0].name) {
					this.$refs.template.submit();
				} else {
					this.$message({
						message: "请选择导入文件！",
						type: "warning"
					});
				}
			},

			// 上传模板之前
			beforeTemplateUpload(file) {
				this.loadingTrue = this.$loading({
					lock: true,
					text: "正在导入，请稍后...",
					background: "rgba(0, 0, 0, 0.7)"
				});
				this.tableData = [];
			},

			// 导入模板成功
			templateImportSuccess(response, file, filelist) {
				this.loadingTrue.close();
				var _this = this;
				if (response.code === 200) {
					_this.$message({
						message: "导入成功",
						type: "success"
					});
					_this.formData.file = filelist;
					_this.mainTemplatecachedId = response.data.cacheId;
					_this.tableData = response.data.data;
					_this.totalCount = _this.tableData.length;
					this.$refs.ruleForm.clearValidate("file");
					this.addFlag = true;
				} else {
					_this.$message.error(response.data);
				}
			},

			templateImportError(response, file, filelist) {
				this.loadingTrue.close();
				this.$message.error(response.message);
			},

			templatebeforeRemove(file, fileList) {
				var _this = this;
				this.addFlag = false;
				return this.$confirm(`确定移除 ${file.name}？`, {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning"
				});
			},

			handleTemplateRemove(file, fileList) {
				this.tableData = [];
			},

			handleTemplateExceed(files, fileList) {
				this.$message.warning(`当前限制选择 1 个文件，本次已选择了 1 个文件`);
			},

			// 你所选中文件的信息
			handleTemplatechange(file, fileList) {
				this.fileList = fileList;
			},

			// 提交表单
			submitForm(ruleForm, flag) {
				// flag == true 提交  or 保存
				var _this = this;
				this.$refs[ruleForm].validate(valid => {
					if (_this.tableData.length > 0) {
						let user = JSON.parse(localStorage.getItem("user"));
						let params = {
							flag: flag,
							applicationNum: _this.formData.applicationNum,
							id: _this.submitSuccessId,
							changeProcess: {
								applicationDate: _this.formData.applyDate,
								subject: _this.formData.subject,
								applicant: user.id,
								applicantName: _this.formData.applyUser,
								applicantPhone: _this.formData.telephone
							},
							assetsList: _this.tableData
						};
						if (_this.isModule && flag) {
							// 提交 => 是模块经理
							if (this.BGJingLi.usrId) {
								params.changeProcess.businessManager = this.BGJingLi.usrId;
								params.changeProcess.businessName = this.BGJingLi.name;
							} else {
								this.$message.error("请您选择模块业务经理！");
								return;
							}
						} else if (_this.isModule) {
							// 是模块经理 => 保存
							if (this.BGJingLi.usrId) {
								params.changeProcess.businessManager = this.BGJingLi.usrId;
								params.changeProcess.businessName = this.BGJingLi.name;
							}
						}
						if (flag) {
							for (var i = 0; i < params.assetsList.length; i++) {
								if (
									!params.assetsList[i].positionCode ||
									!params.assetsList[i].nowUsingMan ||
									!params.assetsList[i].nowInstallLocDesc
								) {
									this.$message.error("请您完善提交数据！");
									return;
								}
							}
						}
						if (_this.submitFlag) {
							axiosPost("process/changeProcess/submit", params).then(result => {
								if (result.code === 200) {
									this.$message({
										message: "操作成功！",
										type: "success"
									});
									_this.submitSuccessId = result.data.id;
									_this.submitFlag = false;
									_this.formData.applicationNum = result.data.applicationNum;
									_this.formData.status = result.data.applicationStatus;
									if (flag) {
										_this.callFlag = true;
									}
								} else {
									this.$message(result.message);
								}
							});
						} else {
							axiosPost("process/changeProcess/submit", params).then(result => {
								if (result.code === 200) {
									this.$message({
										message: "操作成功！",
										type: "success"
									});
									if (flag) {
										_this.callFlag = true;
									}
									_this.formData.applicationNum = result.data.applicationNum;
									_this.formData.status = result.data.applicationStatus;
								} else if (result.code === 400) {
									this.$message(result.message);
								} else {
									this.$message(result.message);
									// 其他问题
								}
							});
						}
					} else {
						this.$message.error("请完善信息！");
						return false;
					}
				});
			},
			// 提交保存确认
			subOrCloses(ruleForm, flag, text) {
				this.$confirm(text, "提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning"
					})
					.then(() => {
						this.submitForm(ruleForm, flag);
					})
					.catch(() => {});
			},
			// 提交撤回确认
			subOrCancel(ruleForm, flag, text) {
				this.$confirm(text, "提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning"
					})
					.then(() => {
						this.reSubmit(ruleForm, flag);
					})
					.catch(() => {});
			},
			reSubmit(ruleForm, flag) {
				var _this = this;
				this.formData.file.length > 0 ?
					this.$refs.ruleForm.clearValidate("file") :
					"";
				this.$refs[ruleForm].validate(valid => {
					if (valid) {
						if (_this.tableData.length > 0) {
							var user = JSON.parse(localStorage.getItem("user"));
							if (flag) {
								// 提交
								let params = {
									taskId: this.$route.query.id,
									changeProcess: {
										applicationNum: _this.formData.applicationNum,
										id: _this.submitSuccessId,
										applicationDate: _this.formData.applyDate,
										subject: _this.formData.subject,
										applicant: user.id,
										applicantName: _this.formData.applyUser,
										applicantPhone: _this.formData.telephone,
										businessManager: _this.BGJingLi.usrId,
										businessName: _this.BGJingLi.name
									},
									assetsList: _this.tableData
								};
								if (_this.isModule && !this.BGJingLi.name) {
									this.$message.error("请您选择模块业务经理！");
									return;
								}
								for (var i = 0; i < params.assetsList.length; i++) {
									if (
										!params.assetsList[i].positionCode ||
										!params.assetsList[i].nowUsingMan
									) {
										this.$message({
											message: "请完善数据!",
											type: 'warning'
										});
										return;
									}
								}
								axiosPost("process/changeProcess/resubmit", params).then(
									result => {
										if (result.code === 200) {
											this.$message.success("操作成功！");
											_this.submitSuccessId = result.data.id;
											// _this.submitFlag = false;
											_this.formData.applicationNum = result.data.applicationNum;
											_this.formData.status = result.data.applicationStatus;
											_this.callFlag = true;
											_this.getHistory();
										} else {
											this.$message({
												message: result.message,
												type: 'warning'
											});
										}
									}
								);
							} else {
								// 撤回
								let params = {
									processInstanceId: this.$route.query.instanceId,
									deleteReason: "",
									id: _this.submitSuccessId,
									applicationNum: _this.formData.applicationNum
								};
								axiosPost("process/changeProcess/closeProcess", params).then(
									result => {
										if (result.code === 200) {
											this.$message.success("操作成功！");
											this.$router.push({
												path: "needdealt"
											});
										} else {
											this.$message(result.message);
										}
									}
								);
							}
						} else {
							this.$message.error("请选择设备信息！");
							return false;
						}
					} else {}
				});
			},
			// 现使用人单选
			handleNodeClick(data, checked, node) {
				if (checked === true) {
					this.checkedId = data.id;
					this.$refs.tree.setCheckedKeys([data.id]);
				} else {
					if (this.checkedId == data.id) {
						this.$refs.tree.setCheckedKeys([data.id]);
					}
				}
			},

			// 表格删除
			delList() {
				if (!this.arr.length) {
					this.$message.warning('请选择删除项！');
					return;
				}
				// selection
				this.arr.forEach((list) => {
					this.tableData.forEach((item, index) => {
						if (item.equipNum == list.equipNum) {
							this.tableData.splice(index, 1)
						}
					})
				})
				if (this.tableData.length == 0) {
					this.addFlag = false;
					this.importFlag = false;
					this.$refs.template.clearFiles();
				}
				this.$refs.multipleSealDetail.clearSelection();
			},
			// delList() {
			//   if (this.arr) {
			//     this.arr.forEach(item => {
			//       if (this.tableData) {
			//         this.tableData.forEach((val, index) => {
			//           if (item === val.index) {
			//             this.tableData.splice(index, 1);
			//             this.formData.file = [];
			//             localStorage.setItem("eqarr", JSON.stringify(this.tableData));
			//             if (this.tableData.length === 0) {
			//               this.$router.push({path: "/sbChange"});
			//               this.addFlag = false;
			//               this.importFlag = false;
			//             }
			//           }
			//         });
			//       }
			//     });
			//   }
			// },

			// 位置编码
			changeSelect(event, index) {
				// locationName
				let obj = {};
				obj = this.positionCode.find(item => {
					return item.locationCode === event;
				});
				this.tableData.forEach(item => {
					if (item.positionCode === index.positionCode) {
						item.locationName = obj.locationDesc;
					}
				});
				for (var i = 0; i < this.tableData.length; i++) {
					if (!this.tableData[i].positionCode) {
						this.tableData[i].positionCode = event;
					}
				}
			},

			// 使用人
			changepeoSelect(event, index) {
				let obj = {};
				obj = this.nowUsingMan.find(item => {
					return item.usrId === event;
				});
				this.tableData.forEach(item => {
					if (item.index === index) {
						item.moduleName = obj.moduleName;
						item.module = obj.moduleId;
					}
				});

				for (var i = 0; i < this.tableData.length; i++) {
					if (!this.tableData[i].module) {
						this.tableData[i].module = obj.moduleId;
						this.tableData[i].moduleName = obj.moduleName;
						this.tableData[i].nowUsingMan = obj.usrId;
						this.tableData[i].nowUsingManName = obj.name;
					}
					if (this.tableData[i].nowUsingMan == event) {
						this.tableData[i].module = obj.moduleId;
						this.tableData[i].moduleName = obj.moduleName;
						this.tableData[i].nowUsingMan = obj.usrId;
						this.tableData[i].nowUsingManName = obj.name;
					}
				}
			},

			// 新增按钮跳转
			addrouter() {
				this.equipDialog = true;
			},
			hideAdd() {
				this.equipDialog = false;
			},
			getInitData() {
				var _this = this;
				const loading = this.$loading({
					lock: true,
					text: "正在加载...",
					background: "rgba(0, 0, 0, 0.7)"
				});

				axiosGet("process/changeProcess/init-form?processId=14031").then(
					result => {
						if (result.code == 200) {
							loading.close();
							let resultData = result.data;
							_this.isModule = resultData.isModule;
							_this.formData.processId = resultData.processId;
							_this.formData.applyUser = resultData.applicantName;
							_this.formData.applyDate = resultData.applicationDate;
							_this.formData.telephone = resultData.applicantPhone;
							_this.flag = resultData.flag;
							if (_this.$route.query.yeWuN) {
								_this.BGJingLi.name = _this.$route.query.yeWuN;
								_this.BGJingLi.usrId = _this.$route.query.yeWuI;
							} else {
								_this.BGJingLi.name = "";
								_this.BGJingLi.usrId = "";
							}
							if (this.$route.query.subject) {
								_this.formData.subject = this.$route.query.subject;
							} else {
								_this.formData.subject = resultData.subject;
							}
						} else {
							loading.close();
						}
					}
				);
			},
			//获取模板
			getTemplateData() {
				axiosGet("common/file/template-ex/list").then(result => {
					if (result.code == 200) {
						this.templateList = result.data;
					}
				});
			},
			//获取位置编码
			getPositionCode() {
				axiosGet("process/changeProcess/getPositionCode").then(result => {
					if (result.code == 200) {
						this.purchaseOrder = result.data;
						this.positionCode = result.data;
					}
				});
			},
			// 使用人
			getDeptTree() {
				var user = JSON.parse(localStorage.getItem("user"));
				axiosGet(
					"base/user/list?deptNum=" + user.deptNum + "&current=0&size=9999"
				).then(res => {
					this.nowUsingMan = res.data.records;
				});
			},
			getSaveData() {
				var _this = this;
				const loading = this.$loading({
					lock: true,
					text: "正在加载...",
					background: "rgba(0, 0, 0, 0.7)"
				});
				_this.applicationNum = _this.paramList.applicationNum;
				axiosGet(
					"process/changeProcess/getApproval?applicationNum=" +
					_this.applicationNum
				).then(result => {
					if (result.code == 200) {
						loading.close();
						let resultData = result.data;
						_this.BGJingLi.name = resultData.changeProcess.businessName;
						_this.BGJingLi.usrId = resultData.changeProcess.businessManager;
						_this.isModule = resultData.isModule;

						_this.formData.processId = resultData.changeProcess.applicationNum;
						_this.formData.applicationNum =
							resultData.changeProcess.applicationNum;
						_this.formData.status = resultData.changeProcess.applicationStatus;
						_this.formData.applyDate = resultData.changeProcess.applicationDate;
						_this.formData.subject = resultData.changeProcess.subject;
						_this.formData.applyUser = resultData.changeProcess.applicantName;
						_this.formData.telephone = resultData.changeProcess.applicantPhone;
						_this.flag = resultData.flag;
						_this.submitSuccessId = resultData.changeProcess.id;
						_this.tableData = resultData.changeProcessAssetsList;

						if (resultData.changeProcessAssetsList.length > 0) {
							_this.importFlag = true;
						} else {
							_this.importFlag = false;
						}
					} else {
						loading.close();
						this.$message.error(resultData.data.message);
					}
				});
			},
			getEquipData() {
				var user = JSON.parse(localStorage.getItem("user"));
				var params = {
					equipNum: this.equipArr, // 设备编号
					equipName: "", // 设备名称
					usingMan: this.$route.query.cgOrderId, // 使用人ID
					flag: this.$route.query.flag, // 是否管理员
					deptNum: user.deptNum // 申请人部门编号
				};
				const loading = this.$loading({
					lock: true,
					text: "正在加载...",
					background: "rgba(0, 0, 0, 0.7)"
				});
				// var params = {"equipNum": [], "usingMan": ["王淑洁"], "flag": "true", "deptNum": "C00", "equipName": ""}
				axiosPost("process/changeProcess/getEquip", params).then(result => {
					if (result.code == 200) {
						this.tableData = result.data;
						this.totalCount = this.tableData.length;
					} else {
						this.$message.error(result.message);
					}
					loading.close();
				});
			},
			getHistory(id) {
				var url =
					"process/changeProcess/history?applicationNum=" +
					this.$route.query.applicationNum;
				axiosGet(url).then(result => {
					if (result.code == 200) {
						this.approveHistory = result.data;
					}
				});
			},
			// get子组件数据
			childByValue: function(childValue) {
				if (childValue !== '0') {
					let name = []
					let id = []
					for (var i = 0; i < childValue.length; i++) {
						name.push(childValue[i].name)
						id.push(childValue[i].usrId)
					}

					this.BGJingLi.usrId = id[0]
					this.BGJingLi.assigneeId = id[0]
					this.BGJingLi.name = name[0]
				}
				this.innerVisible = false
			},
		},

		mounted() {
			this.list();
			// var _this = this;
			// // 获取tableData
			// this.equipArr = this.$route.query.equipArr || [];
			// this.getDeptTree();
			// this.getTreeJingLi();
			// this.getHistory();
			// this.getPositionCode();

			// setTimeout(function () {
			//   if (_this.equipArr.length > 0) {
			//     _this.getEquipData();
			//     _this.importFlag = true;
			//   }
			// }, 500);

			// let formkey = this.$route.query.formKey;
			// // 如果有参数 说明是从草稿或历史进来 历史 history 禁用 草稿 draft 申请页
			// if (this.paramList && this.paramList.type == "history") {
			//   this.childId = this.$route.query.applicationNum;
			//   // this.pageDisabled = true;
			//   this.isHistory = true;
			//   this.callFlag = true;
			//   this.getSaveData();
			// } else if (this.paramList && this.paramList.type == "draft") {
			//   this.childId = this.$route.query.applicationNum;
			//   this.isHistory = false;
			//   this.getSaveData();
			//   this.getTemplateData(); // 获取所有模板地址
			// } else if (formkey && formkey == "formkey_1") {
			//   // 驳回的数据从待办进来
			//   this.childId = this.$route.query.applicationNum;
			//   this.isHistory = true;
			//   this.isTodo = true;
			//   this.getSaveData();
			// } else {
			//   this.getInitData();
			//   this.getTemplateData(); // 获取所有模板地址
			// }

			// // sessionStorage.clear();

			// // 获取所有模板地址
		}
	};
</script>
<style lang="scss">
	// .bgBian:hover {
	//   background: #ccc;
	// }

	// .bgBian {
	//   padding-left: 10px;
	//   cursor: pointer;
	// }

	.internal-change {
		.add-Equip /deep/ .el-input__inner {
			width: 202px;
		}

		.collapse-title {
			flex: 1 0 90%;
			order: 1;
		}

		.el-collapse-item__arrow {
			order: -1;
		}

		.row-list {
			.el-form-item__content {
				width: 180px;
			}

			.el-form--inline .el-form-item__content,
			.el-date-editor.el-input,
			.el-date-editor.el-input__inner {
				width: 100% !important;
			}
		}

		.el-date-editor.el-input {
			width: 180px;
		}

		.el-pagination__editor.el-input .el-input__inner {
			width: 40px !important;
		}

		.btn-group {
			display: block;
			text-align: center;
			padding: 20px 0;

			.el-button.is-disabled {
				opacity: 0.6;
			}
		}

		.el-input__icon {
			height: 30px;
			line-height: 30px !important;
		}

		.primary-btn.el-button {
			background: #3a8eff;
			color: #fff;
			border-color: #fff !important;
		}

		.primary-btn.el-button.is-disabled,
		.download.el-button.is-disabled {
			opacity: 0.6;
		}

		// .primary-btn > span {
		//   pointer-events: none!important;
		// }

		.download.el-button,
		.submit-btn.el-button {
			background: #004ea2;
			color: #fff;
		}

		.upload-btn.el-button {
			background: #df8715;
			color: #fff;
			outline: none;
			border-color: #fff !important;
			margin-left: 20px;
		}

		.save-btn.el-button {
			background: #2fce6a;
			color: #fff;
		}

		.template-upload {
			height: 32px;
			margin-left: 18px;
		}

		.pagination {
			text-align: center;
			margin: 10px 0 10px;
		}

		.pop-participation {
			.el-dialog {
				width: 1000px;
				height: 615px;

				.p-heading {
					.el-col-8 {
						padding-left: 5px;
						box-sizing: border-box;
					}
				}

				.participation-info {
					>div {
						height: 445px;
						box-sizing: border-box;
						border-left: 2px solid #eee;
						overflow: auto;
					}
				}
			}

			.sb-join {
				position: absolute;
				left: 50%;
				bottom: 30px;
				transform: translateX(-50%);
			}
		}

		/deep/ .el-collapse {
			border-bottom-color: #fff;
		}

		.select-file {
			height: 30px;
			margin-right: 20px;

			.el-form--inline {
				.el-form-item__content {
					width: 400px !important;
				}
			}

			.el-upload {
				margin-left: 20px;

				&:focus {
					border-color: #fff;
				}
			}

			.el-upload-list__item.is-success .el-upload-list__item-name:focus {
				border-color: #fff !important;
				outline-width: 0px !important;
			}

			.upload-demo {
				height: 28px;
				line-height: 28px !important;
				display: flex;
				flex-direction: row;

				.el-upload-list {
					order: -1;
					padding-right: 10px;
					border: 1px solid #dcdfe6;
					height: 28px;
					line-height: 28px;
					position: relative;
					border-radius: 4px;
					width: 298px;
					overflow: hidden !important;

					.el-upload-list__item:first-child {
						margin-top: 0px;
						height: 28px !important;
					}

					.el-upload-list__item:hover {
						background: #fff;
					}
				}
			}
		}

		.download.el-button {
			background: #004ea2;
			color: #fff;
		}

		.upload-btn.el-button {
			background: #df8715;
			color: #fff;
			outline: none;
			border-color: #fff !important;
		}

		.impor-file {
			margin-right: 20px;

			.el-input__inner {
				width: 298px !important;
			}

			.el-form--inline .el-form-item__content {
				width: 298px;
			}
		}

		.el-tree__empty-text {
			left: 0;
			top: 0;
			transform: translate(0, 0);
			color: #606266;
		}

		.el-table--fit {
			border: 1px solid #fff;
			width: 100%;
		}

		.import-file {
			border-bottom: 1px solid #eee;
			padding-left: 7px;
			height: 30px;
			position: relative;

			.empty-des {
				padding-top: 40px;
				color: #666;
				text-align: center;

				>div:first-child {
					font-size: 20px;
				}
			}

			.file-header {
				position: absolute;
				left: 0;
				top: 0;
			}

			.el-upload {
				width: 100%;
			}

			.el-form-item {
				width: 100%;
				position: relative;
			}

			.el-form-item__label {
				width: 98%;
				text-align: left;
			}

			.el-form-item__content {
				position: none;
				width: 100%;
			}

			.el-icon-plus {
				position: absolute;
				right: 0;
				top: 8px;
			}

			.el-upload-dragger {
				width: 100%;
				border-color: transparent;
				// display: none;
			}
		}

		.el-table__body-wrapper {
			max-height: 480px;
			overflow-y: auto;
		}

		.ment-input {
			width: 90%;
			height: 30px;
			position: absolute;
			top: 10px;
		}
	}
</style>
