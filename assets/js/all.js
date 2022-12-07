"use strict";

// 預設 JS，請同學不要修改此處
document.addEventListener("DOMContentLoaded", function () {
  var ele = document.querySelector(".recommendation-wall");
  ele.style.cursor = "grab";
  var pos = {
    top: 0,
    left: 0,
    x: 0,
    y: 0
  };

  var mouseDownHandler = function mouseDownHandler(e) {
    ele.style.cursor = "grabbing";
    ele.style.userSelect = "none";
    pos = {
      left: ele.scrollLeft,
      top: ele.scrollTop,
      // Get the current mouse position
      x: e.clientX,
      y: e.clientY
    };
    document.addEventListener("mousemove", mouseMoveHandler);
    document.addEventListener("mouseup", mouseUpHandler);
  };

  var mouseMoveHandler = function mouseMoveHandler(e) {
    // How far the mouse has been moved
    var dx = e.clientX - pos.x;
    var dy = e.clientY - pos.y; // Scroll the element

    ele.scrollTop = pos.top - dy;
    ele.scrollLeft = pos.left - dx;
  };

  var mouseUpHandler = function mouseUpHandler() {
    ele.style.cursor = "grab";
    ele.style.removeProperty("user-select");
    document.removeEventListener("mousemove", mouseMoveHandler);
    document.removeEventListener("mouseup", mouseUpHandler);
  }; // Attach the handler


  ele.addEventListener("mousedown", mouseDownHandler);
}); // menu 切換

var menuOpenBtn = document.querySelector(".menuToggle");
var linkBtn = document.querySelectorAll(".topBar-menu a");
var menu = document.querySelector(".topBar-menu");
menuOpenBtn.addEventListener("click", menuToggle);
linkBtn.forEach(function (item) {
  item.addEventListener("click", closeMenu);
});

function menuToggle() {
  if (menu.classList.contains("openMenu")) {
    menu.classList.remove("openMenu");
  } else {
    menu.classList.add("openMenu");
  }
}

function closeMenu() {
  menu.classList.remove("openMenu");
} // 自己寫的------------------------------------------------------------------


console.clear();
var path = "jiji"; // const UID = "BIjsJ95UFOcuAi0s85Yq6IlkDsB3";

var base = "https://livejs-api.hexschool.io";
var pdlist = document.querySelector(".productWrap");
var data = []; // 取得商品列表

var productList = function productList() {
  axios.get("".concat(base, "/api/livejs/v1/customer/").concat(path, "/products")).then(function (response) {
    data = response.data.products;
    renderCard(data);
  })["catch"](function (error) {
    console.log(error.response.data);
  });
};

productList(); // 篩選條件

var filter = document.querySelector(".productSelect");
filter.addEventListener("click", function (e) {
  data.forEach(function (item) {
    if (e.target.value == "全部") {
      renderCard(data);
    } else if (e.target.value == item.category) {
      var tempData = [];
      data.forEach(function (item) {
        if (e.target.value == item.category) tempData.push(item);
      });
      renderCard(tempData);
    }
  });
}); // 渲染商品列表

var renderCard = function renderCard(renderData) {
  var str = "";
  renderData.forEach(function (item) {
    str += "<li class=\"productCard\"><h4 class=\"productType\">\u65B0\u54C1</h4><img\n    src=".concat(item.images, " alt=\"#\"/><a data-content=").concat(item.id, " class=\"addCardBtn\">\u52A0\u5165\u8CFC\u7269\u8ECA</a><h3>").concat(item.title, "</h3><del class=\"originPrice\">NT$").concat(item.origin_price.toLocaleString(), "</del><p class=\"nowPrice\">NT$").concat(item.price.toLocaleString(), "</p></li>");
  });
  pdlist.innerHTML = str;
}; // 加入購物車


pdlist.addEventListener("click", function (e) {
  if (e.target.nodeName == "A") {
    var qt = 0;
    var pdid = e.target.dataset.content;
    ctData.forEach(function (item) {
      if (item.product.id == pdid) {
        qt = item.quantity;
      }
    });
    qt++;
    addCart(e.target.dataset.content, qt);
  }
});

var addCart = function addCart(pdid, qt) {
  axios.post("".concat(base, "/api/livejs/v1/customer/").concat(path, "/carts"), {
    data: {
      productId: pdid,
      quantity: qt
    }
  }).then(function (response) {
    // console.log(response.data);
    cartList();
  })["catch"](function (error) {
    console.log(error.response.data);
  });
}; // 取得購物車


var ctList = document.querySelector(".shoppingCart-table");
var ctData = [];

var cartList = function cartList() {
  axios.get("".concat(base, "/api/livejs/v1/customer/").concat(path, "/carts")).then(function (response) {
    ctData = response.data.carts;
    var str = "<tr>\n        <th width=\"40%\">\u54C1\u9805</th>\n        <th width=\"15%\">\u55AE\u50F9</th>\n        <th width=\"15%\">\u6578\u91CF</th>\n        <th width=\"15%\">\u91D1\u984D</th>\n        <th width=\"15%\"></th>\n      </tr>";
    ctData.forEach(function (item) {
      str += "<tr>\n          <td>\n            <div class=\"cardItem-title\">\n              <img src=".concat(item.product.images, " alt=\"#\" />\n              <p>").concat(item.product.title, "</p>\n            </div>\n          </td>\n          <td>NT$").concat(item.product.price.toLocaleString(), "</td>\n          <td>").concat(item.quantity, "</td>\n          <td>NT$").concat((item.product.price * item.quantity).toLocaleString(), "</td>\n          <td class=\"discardBtn\">\n            <a data-did=").concat(item.id, " class=\"material-icons\"> clear </a>\n          </td>\n        </tr>");
    });
    str += "<tr>\n        <td>\n          <a class=\"discardAllBtn\">\u522A\u9664\u6240\u6709\u54C1\u9805</a>\n        </td>\n        <td></td>\n        <td></td>\n        <td>\n          <p>\u7E3D\u91D1\u984D</p>\n        </td>\n        <td>NT$".concat(response.data.finalTotal.toLocaleString(), "</td>\n      </tr>");
    ctList.innerHTML = str;
  })["catch"](function (error) {
    console.log(error.response.data);
  });
};

cartList();
ctList.addEventListener("click", function (e) {
  var done = "";
  var dall = "";

  if (e.target.classList.value == "material-icons") {
    done = e.target.dataset.did;
    deleteOne(done);
  }

  if (e.target.classList.value == "discardAllBtn") {
    dall = e.target.dataset.did;
    deleteAll();
  }
}); // 刪除購物車部分產品

var deleteOne = function deleteOne(cartid) {
  axios["delete"]("".concat(base, "/api/livejs/v1/customer/").concat(path, "/carts/").concat(cartid)).then(function (response) {
    cartList();
  })["catch"](function (error) {
    console.log(error.response.data);
  });
}; // 刪除全部購物車


var deleteAll = function deleteAll() {
  axios["delete"]("".concat(base, "/api/livejs/v1/customer/").concat(path, "/carts")).then(function (response) {
    cartList();
  })["catch"](function (error) {
    console.log(error.response.data);
  });
}; // 送出購買訂單


var orderForm = document.querySelector(".orderInfo-form");
var fname = document.querySelector("#customerName");
var ftel = document.querySelector("#customerPhone");
var fmail = document.querySelector("#customerEmail");
var fadr = document.querySelector("#customerAddress");
var fpay = document.querySelector("#tradeWay");
var fbtn = document.querySelector(".orderInfo-btn");
fbtn.addEventListener('click', function (e) {
  if (fname.value.length < 1) {
    alert("請填寫姓名");
  } else if (ftel.value.length < 1) {
    alert("請填寫電話");
  } else if (fmail.value < 1) {
    alert("請輸入Email");
  } else if (fadr.value < 1) {
    alert("請輸入寄送地址");
  } else {
    var sname = fname.value;
    var stel = ftel.value;
    var smail = fmail.value;
    var sadr = fadr.value;
    var spay = fpay.value;
    sendOrder(sname, stel, smail, sadr, spay);
  }
});

var sendOrder = function sendOrder(fname, ftel, femail, faddress, fpayment) {
  axios.post("".concat(base, "/api/livejs/v1/customer/").concat(path, "/orders"), {
    data: {
      user: {
        name: fname,
        tel: ftel,
        email: femail,
        address: faddress,
        payment: fpayment
      }
    }
  }).then(function (response) {
    console.log(response.data);
    cartList();
    orderForm.reset();
    alert("寄送成功!");
  })["catch"](function (error) {
    alert(error.response.data.message);
  });
};
//# sourceMappingURL=all.js.map
