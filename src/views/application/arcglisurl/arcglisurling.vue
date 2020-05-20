<template>
  <div class="iframe-con sapGeiDe acgiseding">
    <div id="map22" class="map"></div>
    <el-button type="primary" size="small" class="acgiseding-btn1" @click="dialogVisible = true">搜索</el-button>
    <el-button type="primary" size="small" class="acgiseding-btn2" v-popover:popover4>楼层</el-button>
    <el-button type="primary" size="small" class="acgiseding-btn3" @click="drawPointing()">绘制点</el-button>
    <el-button type="primary" size="small" class="acgiseding-btn4" @click="drawPointing_stop()">停止绘制</el-button>
    <div class="ZBarcgis" ref="ZBarcgis" id="ZBarcgis1"></div>
    <!-- 楼层弹窗 -->
    <el-popover ref="popover4" placement="right" width="400" trigger="click">
      <el-tabs tab-position="left">
        <el-tab-pane label="服务大厦">
          <el-button type="text" @click="switchLayer('FWDSF1')">FWDSF1</el-button>
          <el-button type="text" @click="switchLayer('FWDSF2')">FWDSF2</el-button>
          <el-button type="text" @click="switchLayer('FWDSF3')">FWDSF3</el-button>
          <el-button type="text" @click="switchLayer('FWDSF4')">FWDSF4</el-button>
          <el-button type="text" @click="switchLayer('FWDSF5')">FWDSF5</el-button>
          <el-button type="text" @click="switchLayer('FWDSF5')">FWDSF6</el-button>
          <el-button type="text" @click="switchLayer('FWDSF5')">FWDSF7</el-button>
        </el-tab-pane>
        <el-tab-pane label="大场景">
          <!-- <el-button type="text" @click="switchLayer('DCJ')">DCJ</el-button>
            <el-button type="text" @click="switchLayer('DCJJK')">DCJJK</el-button> -->
        </el-tab-pane>
        <el-tab-pane label="GTC">
          <!-- <el-button type="text" @click="switchLayer('GTCB1')">GTCB1</el-button>
            <el-button type="text" @click="switchLayer('GTCB2')">GTCB2</el-button>
            <el-button type="text" @click="switchLayer('GTCB3')">GTCB3</el-button>
            <el-button type="text" @click="switchLayer('GTCF1')">GTCF1</el-button>
            <el-button type="text" @click="switchLayer('GTCF2')">GTCF2</el-button> -->
        </el-tab-pane>
        <el-tab-pane label="2号停车场">
          <!-- <el-button type="text" @click="switchLayer('P2B1')">P2B1</el-button>
            <el-button type="text" @click="switchLayer('P2B2')">P2B2</el-button>
            <el-button type="text" @click="switchLayer('P2B3')">P2B3</el-button>
            <el-button type="text" @click="switchLayer('P2B4')">P2B4</el-button>
            <el-button type="text" @click="switchLayer('P2F1')">P2F1</el-button>
            <el-button type="text" @click="switchLayer('P2F1')">P2F2</el-button> -->
        </el-tab-pane>
        <el-tab-pane label="T1"></el-tab-pane>
        <el-tab-pane label="T2"></el-tab-pane>
        <el-tab-pane label="T3">
          <!-- <el-button type="text" @click="switchLayer('T3CB1')">T3CB1</el-button>
            <el-button type="text" @click="switchLayer('T3CB2')">T3CB2</el-button>
            <el-button type="text" @click="switchLayer('T3CF1')">T3CF1</el-button>
            <el-button type="text" @click="switchLayer('T3CF2')">T3CF2</el-button>
            <el-button type="text" @click="switchLayer('T3CF3')">T3CF3</el-button>
            <el-button type="text" @click="switchLayer('T3CF4')">T3CF4</el-button>
            <el-button type="text" @click="switchLayer('T3CF4J')">T3CF4J</el-button>
            <el-button type="text" @click="switchLayer('T3DB1')">T3DB1</el-button>
            <el-button type="text" @click="switchLayer('T3DF1')">T3DF1</el-button>
            <el-button type="text" @click="switchLayer('T3DF2')">T3DF2</el-button>
            <el-button type="text" @click="switchLayer('T3DF3')">T3DF3</el-button>
            <el-button type="text" @click="switchLayer('T3EB1')">T3EB1</el-button>
            <el-button type="text" @click="switchLayer('T3EB2')">T3EB2</el-button>
            <el-button type="text" @click="switchLayer('T3EB3')">T3EB3</el-button> -->
          <!-- <el-button type="text" @click="switchLayer('T3EF1')">T3EF1</el-button>
          <el-button type="text" @click="switchLayer('T3EF2')">T3EF2</el-button>
          <el-button type="text" @click="switchLayer('T3EF3')">T3EF3</el-button> -->
        </el-tab-pane>
      </el-tabs>
    </el-popover>

    <!-- 查询弹窗组件 -->
    <el-dialog title="筛选设备" top="1vh" :visible.sync="dialogVisible" width="70%">
      <div class="seal-query">
        <el-form>
          <el-row>
            <el-col :span="8">
              <el-form-item label="设备名称" label-width="80px">
                <el-input class="addWidthinged" v-model="postParams.equipName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="设备编码" label-width="80px">
                <el-input class="addWidthinged" v-model="postParams.equipNum"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="所属系统" label-width="80px">
                <el-input class="addWidthinged" v-model="postParams.belongSystem"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="ABC分类" label-width="80px">
                <el-select filterable v-model="postParams.abcFlag" placeholder="请选择">
                  <el-option v-for="(item, index) in ABC" :key="index" :label="item.name" :value="item.name">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="部门" label-width="80px">
                <el-input class="addWidthinged" v-model="postParams.usingDept" :disabled="this.adminUser !== 1" @focus="dialogParticipation=true">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="使用人" label-width="80px">
                <el-input class="addWidthinged" v-model="postParams.usingMan" :disabled="this.adminUser !== 1"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="设备类别" label-width="80px">
                <el-input class="addWidthinged" v-model="postParams.equipType"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="1" :offset="14">
              <el-button type="primary" size="mini" icon="el-icon-search" @click="getSearchChick()">搜索</el-button>
            </el-col>
          </el-row>
        </el-form>
        <div class="seal-query-decompose">
          <span>设备列表</span>
          <div class="seal-query-decompose-right">
            <!-- <el-button type="primary" size="mini">查看全部位置</el-button> -->
            <el-button type="primary" size="mini" @click="zoomToPoint()">查看图中位置</el-button>
          </div>
        </div>
        <el-table :data="tableData.slice((popCurrentPage-1)*popPageSize,popCurrentPage*popPageSize)" border
          :header-cell-style="{
            'font-size':'14px',
            'padding': '8px 0',
            'font-family':'Microsoft YaHei'}" :cell-style="{
            'height': '45px',
            'line-height':'45px',
            'overflow':'hidden',
            'text-overflow':'ellipsis',
            'white-space':'nowrap',
            'padding':'0',
            'font-family':'Microsoft YaHei',
            'font-size':'12px'}" @selection-change="handleSelectionChange" :row-key="sealRowKey">
          <!-- <el-table-column
              :show-overflow-tooltip="true"
              type="selection"
              :reserve-selection="true"
              width="55"
            ></el-table-column> -->
          <el-table-column width="55" align="center">
            <template slot-scope="scope">
              <el-radio v-model="radio" :label="scope.$index" @change.native="getTemplateRow(scope.$index,scope.row)">
                &nbsp</el-radio>
            </template>
          </el-table-column>
          <el-table-column width="140" property="equipNum" label="设备编码" :show-overflow-tooltip='true'></el-table-column>
          <el-table-column property="equipName" label="设备名称" :show-overflow-tooltip='true'></el-table-column>
          <el-table-column property="equipStatus" label="设备状态" :show-overflow-tooltip='true'></el-table-column>
          <el-table-column property="locationDesc" label="安装地点" :show-overflow-tooltip='true'></el-table-column>
          <el-table-column property="usingMan" label="使用人" :show-overflow-tooltip='true'></el-table-column>
          <el-table-column property="usingDept" label="使用人部门" :show-overflow-tooltip='true'></el-table-column>
          <el-table-column property="locationCode" label="位置编码" :show-overflow-tooltip='true'></el-table-column>
          <el-table-column property="locationName" label="位置描述" :show-overflow-tooltip='true'></el-table-column>
        </el-table>
      </div>
      <!-- 分页 -->
      <div class="common-pagination">
        <el-pagination background layout="total, prev, pager, next, jumper" :total="tableData.length"
          :page-size="popPageSize" :current-page.sync="popCurrentPage" @current-change="handlePaginationChange">
        </el-pagination>
        <div class="have-choice">已选择：{{radioingOk.length}}</div>
      </div>
    </el-dialog>

    <!-- 参与人员popup    show-checkbox -->
    <el-dialog top="1vh" title="选择部门" width="50%" :visible.sync="dialogParticipation">
      <el-row>
        <el-col :span="12"><b>部门架构</b></el-col>
        <el-col :span="12" class="pl10"><b>当前选中部门</b></el-col>
      </el-row>
      <el-row>
        <el-col :span="12" class="sb-el-tree">
          <el-tree :data="participantList" :default-expand-all="defaultExpandAll" :default-expanded-keys="[2]"
            highlight-current node-key="id" :props="defaultProps" ref="tree" @node-click="handleNodeClick"
            :filter-node-method="filterNode"></el-tree>
        </el-col>
        <el-col :span="12">
          <div class="pl10">&emsp;{{currentDepartment.name}}</div>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogParticipation=false">取 消</el-button>
        <el-button type="primary" @click="getCheckedDept()" size="small">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { loadModules } from 'esri-loader';
  import { serviceUrls } from './serviceUrls';
  import { axiosPost, axiosGet } from "@/api/index.js";
  var FWDSB1, FWDSF1, FWDSF2, FWDSF3, FWDSF4, FWDSF5, FWDSF6, FWDSF7;
  var T3CB1, T3CB2, T3CF1, T3CF2, T3CF3, T3CF4, T3CF4J, T3DB1, T3DF1, T3DF2, T3DF3, T3EB1, T3EB2, T3EB3, T3EF1, T3EF2, T3EF3;

  export default {
    name: 'home-button',
    data: function () {
      return {
        postParams: {
          equipName: "",  //设备名称
          equipNum: "",   //设备编码
          equipType: "",  //设备类型
          belongSystem: "",  //所属系统
          abcFlag: "",  //ABC 类型    A-关键设备，B-主要设备，C-一般设备
          usingDept: "",  //使用部门
          usingMan: "",  //使用人
        },
        radio: '',  // 单选的初始值
        radioingOk: [],   // 单选选中的值
        activeName: '1',  // 手风琴默认展开
        ABC: [{ 'name': 'A' }, { "name": "B" }, { "name": "C" }],
        dialogParticipation: false, //调入部门弹窗
        dialogVisible: false,  // 搜索弹窗状态
        popCurrentPage: 1,  // table分页
        popPageSize: 5,  // table分页5条
        tableData: [],  // table获取的数据
        multipleSelection: [], //选择得checkbox--list
        selectNum: 0, //选择删除
        currentPage: 1,  // 默认当前分页
        defaultExpandAll: true, // 部门结构树-默认展开所有节点
        defaultProps: {  // 部门结构树
          children: "children",
          label: "name"
        },
        participantList: [],  // 调入部门结构数据
        currentDepartment: {},  // 部门结构树点击选择的部门
        gisDeptNum: '',  // 点击选中的部门
        map: null,  // 底图
        layer: null,  // 底图操作层
        ctr_draw: null, //绘制控件
        mapName: {},
        adminUser:'',  // 是否为设备管理员
        tuceng: [
          {
            name: 'fuWuDaSha',
            data: [
              {
                name: 'FWDSF2',
                url: 'http://10.40.12.23:6080/arcgis/rest/services/BASEMAP/FWDSF2_BASE_ZBAA/MapServer',
                id: '15'
              },
              {
                name: 'FWDSF1',
                url: 'http://10.40.12.23:6080/arcgis/rest/services/BASEMAP/FWDSF1_BASE_ZBAA/MapServer',
                id: '16'
              }
            ],
            zuoBiao: [500888.7694325621, 496766.95946690295, 501120.121561933, 496831.94126353326]
          }
        ]
      }
    },
    created() {
      // 获取当前登陆人
      let user = JSON.parse(localStorage.getItem('user'));
      // 当前登陆人所在得模块
      this.adminUser = user.sbgly;
      this.postParams.usingDept = user.deptName;  // 部门
      this.gisDeptNum = user.deptNum;  // 部门编码
      this.postParams.usingMan = user.usrId;  // 使用人
      console.log(user, '路由');
      this.getDeptTree();
    },
    methods: {
      /**
        * 设置地图可见范围
      */
      zoomToInit() {
        // var ext = new esri.geometry.Extent(499921.6269831981, 499249.0823320091, 500455.0280500002, 499397.77846273466,  this.map.spatialReference)
        // var ext = new esri.geometry.Extent(500888.7694325621, 496766.95946690295, 501120.121561933, 496831.94126353326, this.map.spatialReference)
        var ext = new esri.geometry.Extent(this.tuceng[0].zuoBiao[0], this.tuceng[0].zuoBiao[1], this.tuceng[0].zuoBiao[2], this.tuceng[0].zuoBiao[3], this.map.spatialReference)
        this.map.setExtent(ext, true)
      },
      /**
       * 初始化地图控件
      */
      initCtr() {
        var that = this;
        var reding = document.getElementById("ZBarcgis1");
        this.ctr_draw = new esri.toolbars.Draw(this.map);
        this.ctr_draw.on("draw-complete",function (evt) {
          reding.innerHTML = "<span>X："+evt.geometry.x+" Y："+evt.geometry.y+"</span>";
          var eleSymbol = new esri.symbol.SimpleMarkerSymbol();
          eleSymbol.setColor("#ff0000"); 
          eleSymbol.setSize("8");
          var g=new esri.Graphic(evt.geometry,eleSymbol);
          that.layer.add(g);
        });
      },
      /**
        * arcgis地图初始化
      */
      init() {
        var that = this
        loadModules(['esri/map', 'esri/toolbars/draw'])
          .then(([Map]) => {
            this.map = new esri.Map("map22", {
              slider: false,
              logo: false,
              autoResize: true,
              isKeyboardNavigation: false,
              backgroundColor: '#eee',
              showLabels: true,
              // setLevel: 1
            })
            this.map.on('load', function (evt) {
              console.log('map load')
              // 地图范围
              that.zoomToInit();
              that.initCtr();
            })
            // 初始化图层
            that.startArcgis();
          })
          .catch(err => {
            console.error(err);
          });
      },
      /**
       * 底图绘制点
      */
      drawPointing() {
        this.ctr_draw.activate(esri.toolbars.Draw.POINT);
      },
      /**
       * 停止绘制点
      */
      drawPointing_stop() {
          this.ctr_draw.deactivate();
      },
      /**
       * 缩放地图到点
      */
      zoomToPoint: function () {
        if(this.radioingOk.length <= 0) {
          this.$message({
            type: 'warning',
            message: '请选择设备'
          });
          return
        }
        this.dialogVisible = false;
        // 假坐标
        // var arr = [{X:500242.44, Y:499222.11, equipName:'台式机', equipNum:'1000030702020371'}, {X:500242.22601811873, Y:499230.07395648124, equipName:'洗衣机', equipNum:'1000030702020371'}]
        var len = this.radioingOk.length;
        for (var i = 0; i < len; i++) {
          var cur = this.radioingOk[i];
          var point = new esri.geometry.Point(cur.coordinate[0].X, cur.coordinate[0].Y, this.map.spatialReference);
          this.map.setLevel(3);
          this.map.centerAt(point);
          var eleSymbol = new esri.symbol.SimpleMarkerSymbol();
          eleSymbol.setColor("#00ff00");
          eleSymbol.setSize("8");
          var g = new esri.Graphic(point, eleSymbol, { equipName: cur.equipName, equipNum: cur.equipNum });
          this.layer.add(g);
        }
      },
      /**
       * 显示要素信息
      */
      showFeatureInfo(evt) {
        var that = this;
        this.map.infoWindow.setFeatures(evt.graphic);
        this.map.infoWindow.show(evt.mapPoint);
        // this.map.infoWindow.setTitle("Coordinates坐标");
        //设置弹出框内容
        this.map.infoWindow.setContent("<div><p>设备名称:&nbsp;" + evt.graphic.attributes.equipName + "</p><p>设备编号:&nbsp;" + evt.graphic.attributes.equipNum + "</p></div>");
      },
      /**
       * 初始化加载图层
      */
      startArcgis(val) {
        var that = this;
        // for (var i = 0; i < this.tuceng.length; i++) {
        //   for (var a = 0; a < this.tuceng[i].data.length; a++) {
        //     let name = this.tuceng[i].data[a].name;
        //     console.log(name, 'name');
            
        //     name = new esri.layers.ArcGISTiledMapServiceLayer(this.tuceng[i].data[a].url, { id: this.tuceng[i].data[a].id })
        //     // name.setVisibility(false)
            
        //     // this.mapName = new esri.layers.ArcGISTiledMapServiceLayer(this.tuceng[i].data[a].url, { id: this.tuceng[i].data[a].id })
        //     // this.mapName.setVisibility(false)
        //     // console.log(val+this.tuceng[i].data[a].name)
        //     // if (val == this.tuceng[i].data[a].name) {
        //     //   this.mapName.setVisibility(true)
        //     // }
        //       // if (val != this.tuceng[i].data[a].name && i == 0 && a == 0) {
        //       //   this.mapName.setVisibility(true)
        //       // }
        //       console.log(name)
        //     this.map.addLayer(name);
        //     if (val == this.tuceng[i].data[a].name) {
        //       name.setVisibility(true)
        //       break;
        //       console.log(name)
        //     }
        //   }
        // }
        // for(var i = 0; i< serviceUrls.length; i++) {
        //   var cur = serviceUrls[i];
        //   if(cur.name == val) {
        //     T3EF1 = new esri.layers.ArcGISTiledMapServiceLayer(cur.url, {id: cur.name});
        //     // T3EF1.setVisibility(false);
        //     this.map.addLayer(T3EF1);
        //     break;
        // }
        // T3系列
        // T3CB1 = new esri.layers.ArcGISTiledMapServiceLayer(serviceUrls.T3CB1_jc.url, {id: 'T3CB1_jc'});
        // T3CB2 = new esri.layers.ArcGISTiledMapServiceLayer(serviceUrls.T3CB2_jc.url, {id: 'T3CB2_jc'});
        // T3CF1 = new esri.layers.ArcGISTiledMapServiceLayer(serviceUrls.T3CF1_jc.url, {id: 'T3CF1_jc'});
        // T3CF2 = new esri.layers.ArcGISTiledMapServiceLayer(serviceUrls.T3CF2_jc.url, {id: 'T3CF2_jc'});
        // T3CF3 = new esri.layers.ArcGISTiledMapServiceLayer(serviceUrls.T3CF3_jc.url, {id: 'T3CF3_jc'});
        // T3CF4 = new esri.layers.ArcGISTiledMapServiceLayer(serviceUrls.T3CF4_jc.url, {id: 'T3CF4_jc'});
        // T3CF4J = new esri.layers.ArcGISTiledMapServiceLayer(serviceUrls.T3CF4J_jc.url, {id: 'T3CF4J_jc'});
        // T3DB1 = new esri.layers.ArcGISTiledMapServiceLayer(serviceUrls.T3DB1_jc.url, {id: 'T3DB1_jc'});
        // T3DF1 = new esri.layers.ArcGISTiledMapServiceLayer(serviceUrls.T3DF1_jc.url, {id: 'T3DF1_jc'});
        // T3DF2 = new esri.layers.ArcGISTiledMapServiceLayer(serviceUrls.T3DF2_jc.url, {id: 'T3DF2_jc'});
        // T3DF3 = new esri.layers.ArcGISTiledMapServiceLayer(serviceUrls.T3DF3_jc.url, {id: 'T3DF3_jc'});
        // T3EB1 = new esri.layers.ArcGISTiledMapServiceLayer(serviceUrls.T3EB1_jc.url, {id: 'T3EB1_jc'});
        // T3EB2 = new esri.layers.ArcGISTiledMapServiceLayer(serviceUrls.T3EB2_jc.url, {id: 'T3EB2_jc'});
        // T3EB3 = new esri.layers.ArcGISTiledMapServiceLayer(serviceUrls.T3EB3_jc.url, {id: 'T3EB3_jc'});
        // 服务大厦
        FWDSB1 = new esri.layers.ArcGISTiledMapServiceLayer(serviceUrls.FWDSB1_jc.url, { id: 'FWDSB1' });
        FWDSF1 = new esri.layers.ArcGISTiledMapServiceLayer(serviceUrls.FWDSF1_jc.url, { id: 'FWDSF1' });
        FWDSF2 = new esri.layers.ArcGISTiledMapServiceLayer(serviceUrls.FWDSF2_jc.url, { id: 'FWDSF2' });
        FWDSF3 = new esri.layers.ArcGISTiledMapServiceLayer(serviceUrls.FWDSF3_jc.url, { id: 'FWDSF3' });
        FWDSF4 = new esri.layers.ArcGISTiledMapServiceLayer(serviceUrls.FWDSF4_jc.url, { id: 'FWDSF4' });
        FWDSF5 = new esri.layers.ArcGISTiledMapServiceLayer(serviceUrls.FWDSF5_jc.url, { id: 'FWDSF5' });
        FWDSF6 = new esri.layers.ArcGISTiledMapServiceLayer(serviceUrls.FWDSF6_jc.url, { id: 'FWDSF6' });
        FWDSF7 = new esri.layers.ArcGISTiledMapServiceLayer(serviceUrls.FWDSF7_jc.url, { id: 'FWDSF7' });
        // // T3
        // T3EF1 = new esri.layers.ArcGISTiledMapServiceLayer(serviceUrls.T3EF1_jc.url, { id: 'T3EF1_jc' });
        // T3EF2 = new esri.layers.ArcGISTiledMapServiceLayer(serviceUrls.T3EF2_jc.url, { id: 'T3EF2_jc' });
        // T3EF3 = new esri.layers.ArcGISTiledMapServiceLayer(serviceUrls.T3EF3_jc.url, { id: 'T3EF3_jc' });
        // T3CB1.setVisibility(false);
        // T3CB2.setVisibility(false);
        // T3CF1.setVisibility(false);
        // T3CF2.setVisibility(false);
        // T3CF3.setVisibility(false);
        // T3CF4.setVisibility(false);
        // T3CF4J.setVisibility(false);
        // T3DB1.setVisibility(false);
        // T3DF1.setVisibility(false);
        // T3DF2.setVisibility(false);
        // T3DF3.setVisibility(false);
        // T3EB1.setVisibility(false);
        // T3EB2.setVisibility(false);
        // T3EB3.setVisibility(false);
        // T3EF1.setVisibility(false);
        // T3EF2.setVisibility(false);
        // T3EF3.setVisibility(false);

        // FWDSB1.setVisibility(false);
        FWDSF1.setVisibility(false);
        FWDSF2.setVisibility(false);
        FWDSF3.setVisibility(false);
        FWDSF4.setVisibility(false);
        FWDSF5.setVisibility(false);
        FWDSF6.setVisibility(false);
        FWDSF7.setVisibility(false);
        // this.map.addLayer(T3CB1);
        // this.map.addLayer(T3CB2);
        // this.map.addLayer(T3CF1);
        // this.map.addLayer(T3CF2);
        // this.map.addLayer(T3CF3);
        // this.map.addLayer(T3CF4);
        // this.map.addLayer(T3CF4J);
        // this.map.addLayer(T3DB1);
        // this.map.addLayer(T3DF1);
        // this.map.addLayer(T3DF2);
        // this.map.addLayer(T3DF3);                        
        // this.map.addLayer(T3EB1);
        // this.map.addLayer(T3EB2);
        // this.map.addLayer(T3EB3);
        // this.map.addLayer(T3EF1);
        // this.map.addLayer(T3EF2);
        // this.map.addLayer(T3EF3);

        this.map.addLayer(FWDSB1);
        this.map.addLayer(FWDSF1);
        this.map.addLayer(FWDSF2);
        this.map.addLayer(FWDSF3);
        this.map.addLayer(FWDSF4);
        this.map.addLayer(FWDSF5);
        this.map.addLayer(FWDSF6);
        this.map.addLayer(FWDSF7);
        this.layer = new esri.layers.GraphicsLayer({ id: "layer" });
        this.map.addLayer(this.layer);
        this.layer.on("click", function (evt) {
          that.showFeatureInfo(evt);
        });
      },
      /**
       * 切换底图
      */
      switchLayer(val) {
        // this.startArcgis(val)
        // T3CB1.setVisibility(false);
        // T3CB2.setVisibility(false);
        // T3CF1.setVisibility(false);
        // T3CF2.setVisibility(false);
        // T3CF3.setVisibility(false);
        // T3CF4.setVisibility(false);
        // T3CF4J.setVisibility(false);
        // T3DB1.setVisibility(false);
        // T3DF1.setVisibility(false);
        // T3DF2.setVisibility(false);
        // T3DF3.setVisibility(false);
        // T3EB1.setVisibility(false);
        // T3EB2.setVisibility(false);
        // T3EB3.setVisibility(false);
        // T3EF2.setVisibility(false);
        // T3EF3.setVisibility(false);
        // T3EF1.setVisibility(false);
        FWDSB1.setVisibility(false);
        FWDSF1.setVisibility(false);
        FWDSF2.setVisibility(false);
        FWDSF3.setVisibility(false);
        FWDSF4.setVisibility(false);
        FWDSF5.setVisibility(false);
        FWDSF6.setVisibility(false);
        FWDSF7.setVisibility(false);
        switch (val) {
        // case "T3CB1":
        //   T3CB1.setVisibility(true);
        //   break;
        // case "T3CB2":
        //   T3CB2.setVisibility(true);
        //   break;
        // case "T3CF1":
        //   T3CF1.setVisibility(true);
        //   break;
        // case "T3CF2":
        //   T3CF2.setVisibility(true);
        //   break;
        // case "T3CF3":
        //   T3CF3.setVisibility(true);
        //   break;
        // case "T3CF4":
        //   T3CF4.setVisibility(true);
        //   break;
        // case "T3CF4J":
        //   T3CF4J.setVisibility(true);
        //   break;
        // case "T3DB1":
        //   T3DB1.setVisibility(true);
        //   break;
        // case "T3DF1":
        //   T3DF1.setVisibility(true);
        //   break;
        // case "T3DF2":
        //   T3DF2.setVisibility(true);
        //   break;
        // case "T3DF3":
        //   T3DF3.setVisibility(true);
        //   break;
        // case "T3EB1":
        //   T3EB1.setVisibility(true);
        //   break;
        // case "T3EB2":
        //   T3EB2.setVisibility(true);
        //   break;
        // case "T3EB3":
        //   T3EB3.setVisibility(true);
        // break;

        // case "T3EF1":
        //   T3EF1.setVisibility(true);
        //   break;
        // case "T3EF2":
        //   T3EF2.setVisibility(true);
        //   break;
        // case "T3EF3":
        //   T3EF3.setVisibility(true);
        //   break;
        case "FWDSB1":
          FWDSB1.setVisibility(true);
          break;
        case "FWDSF1":
          FWDSF1.setVisibility(true);
          break;
        case "FWDSF2":
          FWDSF2.setVisibility(true);
          break;
        case "FWDSF3":
          FWDSF2.setVisibility(true);
          break;
        case "FWDSF4":
          FWDSF4.setVisibility(true);
          break;
        case "FWDSF5":
          FWDSF5.setVisibility(true);
          break;
        case "FWDSF6":
          FWDSF6.setVisibility(true);
          break;
        case "FWDSF7":
          FWDSF7.setVisibility(true);
          break;
      }
    },
    // 表单搜索点击事件
    getSearchChick() {
      let parmas = {
        "equipName": this.postParams.equipName == "" ? "" : this.postParams.equipName,
        "equipNum": this.postParams.equipNum == "" ? "" : this.postParams.equipNum,
        "equipType": this.postParams.equipType == "" ? "030702" : this.postParams.equipType,
        "belongSystem": this.postParams.belongSystem == "" ? "办公系统" : this.postParams.belongSystem,
        "abcFlag": this.postParams.abcFlag == "" ? "B" : this.postParams.abcFlag,
        "usingDept": this.gisDeptNum == "" ? "1909" : this.gisDeptNum,
        "usingMan": this.postParams.usingMan == "" ? "LIUZHAN" : this.postParams.usingMan,
      }
      const loading = this.$loading({
        lock: true,
        text: '正在加载...',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      axiosPost("archive/gis-equipment/list", parmas).then(result => {
        if (result.code == 200 && result.data && result.data.length > 0) {
          loading.close();
          this.tableData = result.data;
        } else {
          loading.close();
          this.tableData = [];
          this.$message({
            type: 'info',
            message: result.message
          });
        }
      });
    },
    //保存选中的数据equipNum,row-key就是要指定一个key标识这一行的数据
    sealRowKey(row) {
      return row.equipNum;
    },
    // 设备
    handleSelectionChange(val) {
      console.log(val, 'frrrr');
      this.multipleSelection = val;
      this.selectNum = this.multipleSelection.length;
    },
    // 分页
    handlePaginationChange(val) {
      this.currentPage = val;
    },
    //获取部门树结构
    getDeptTree() {
      axiosGet("exdept/dept-tree?dept=true").then(result => {
        if (result.code == 200) {
          this.participantList = result.data[0].children;
        } else {
        }
      });
    },
    //点击最左侧树结构
    handleNodeClick(data) {
      this.currentDepartment = {
        name: data.name,
        deptNum: data.deptNum
      }
    },
    // 部门选择确定
    getCheckedDept() {
      this.gisDeptNum = this.currentDepartment.deptNum;
      this.postParams.usingDept = this.currentDepartment.name;
      this.dialogParticipation = false;
    },
    // 树形结构节点过滤
    filterNode: function (value, data) {
      if (value) return true;
    },
    // 单选
    getTemplateRow(index, row) {     //获取选中数据
      this.radioingOk = [];
      this.radioingOk.push(row);
    },
  },
  mounted() {
    this.init();
  }
  }
</script>

<style lang="scss" scoped>
  .map {
    height: 100%;
    width: 100%;
  }

  .seal-query-decompose {
    background: #eff2f9;
    border-radius: 4px;
    margin: 10px 0;
    padding-right: 20px;
    padding-left: 20px;
    line-height: 38px;
    overflow: hidden;
    span {
      font-weight: 500;
    }

    .seal-query-decompose-right {
      float: right;
    }
  }

  .acgiseding-btn1 {
    position: absolute;
    top: 4px;
    left: 20px;
  }
  .acgiseding-btn2 {
    position: absolute;
    top: 4px;
    left: 140px;
  }
  .acgiseding-btn3 {
    position: absolute;
    top: 50px;
    left: 10px;
  }
  .acgiseding-btn4 {
    position: absolute;
    top: 100px;
    left: 10px;
  }
  .ZBarcgis {
    position: absolute;
    bottom: 10px;
    left: 20px;
    width: 400px;
    height: 10px;
    /* border: 1px solid red; */
  }

  .sb-el-tree {
    /* min-width: 300px; */
    height: 445px;
    overflow: auto;
  }
</style>