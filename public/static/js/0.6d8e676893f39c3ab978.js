webpackJsonp([0],{"62SD":function(e,t){},bBUo:function(e,t,a){"use strict";var n=a("Xxa5"),r=a.n(n),s=a("exGp"),o=a.n(s),m=a("Dd8w"),c=a.n(m),d=a("1h8J"),i=a("uaSg"),u=a("NYxO"),l={data:function(){return{baseImgPath:i.a}},created:function(){this.adminInfo.id||this.getAdminData()},mounted:function(){console.log(this.$route)},computed:c()({},Object(u.c)(["adminInfo"])),methods:c()({},Object(u.b)(["getAdminData"]),{handleCommand:function(e){var t=this;return o()(r.a.mark(function a(){var n;return r.a.wrap(function(a){for(;;)switch(a.prev=a.next){case 0:if("home"!=e){a.next=4;break}t.$router.push("/manage"),a.next=9;break;case 4:if("signout"!=e){a.next=9;break}return a.next=7,Object(d.A)();case 7:1==(n=a.sent).status?(t.$message({type:"success",message:"退出成功"}),t.$router.push("/")):t.$message({type:"error",message:n.message});case 9:case"end":return a.stop()}},a,t)}))()}})},p={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"header_container"},[a("el-breadcrumb",{attrs:{separator:"/"}},[a("el-breadcrumb-item",{attrs:{to:{path:"/manage"}}},[e._v("首页")]),e._v(" "),e._l(e.$route.meta,function(t,n){return a("el-breadcrumb-item",{key:n},[e._v(e._s(t))])})],2),e._v(" "),a("el-dropdown",{attrs:{"menu-align":"start"},on:{command:e.handleCommand}},[a("img",{staticClass:"avator",attrs:{src:e.baseImgPath+e.adminInfo.avatar}}),e._v(" "),a("el-dropdown-menu",{attrs:{slot:"dropdown"},slot:"dropdown"},[a("el-dropdown-item",{attrs:{command:"home"}},[e._v("首页")]),e._v(" "),a("el-dropdown-item",{attrs:{command:"signout"}},[e._v("退出")])],1)],1)],1)},staticRenderFns:[]};var f=a("VU/8")(l,p,!1,function(e){a("62SD")},null,null);t.a=f.exports}});
//# sourceMappingURL=0.6d8e676893f39c3ab978.js.map