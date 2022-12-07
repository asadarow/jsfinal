// 預設 JS，請同學不要修改此處
document.addEventListener("DOMContentLoaded", function () {
  const ele = document.querySelector(".recommendation-wall");
  ele.style.cursor = "grab";
  let pos = { top: 0, left: 0, x: 0, y: 0 };
  const mouseDownHandler = function (e) {
    ele.style.cursor = "grabbing";
    ele.style.userSelect = "none";

    pos = {
      left: ele.scrollLeft,
      top: ele.scrollTop,
      // Get the current mouse position
      x: e.clientX,
      y: e.clientY,
    };

    document.addEventListener("mousemove", mouseMoveHandler);
    document.addEventListener("mouseup", mouseUpHandler);
  };
  const mouseMoveHandler = function (e) {
    // How far the mouse has been moved
    const dx = e.clientX - pos.x;
    const dy = e.clientY - pos.y;

    // Scroll the element
    ele.scrollTop = pos.top - dy;
    ele.scrollLeft = pos.left - dx;
  };
  const mouseUpHandler = function () {
    ele.style.cursor = "grab";
    ele.style.removeProperty("user-select");

    document.removeEventListener("mousemove", mouseMoveHandler);
    document.removeEventListener("mouseup", mouseUpHandler);
  };
  // Attach the handler
  ele.addEventListener("mousedown", mouseDownHandler);
});
// menu 切換
let menuOpenBtn = document.querySelector(".menuToggle");
let linkBtn = document.querySelectorAll(".topBar-menu a");
let menu = document.querySelector(".topBar-menu");
menuOpenBtn.addEventListener("click", menuToggle);

linkBtn.forEach((item) => {
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
}

// 自己寫的------------------------------------------------------------------
console.clear();
const path = "jiji";
// const UID = "BIjsJ95UFOcuAi0s85Yq6IlkDsB3";
const base = "https://livejs-api.hexschool.io";

const pdlist = document.querySelector(".productWrap");
let data = [];
// 取得商品列表
const productList = () => {
  axios
    .get(`${base}/api/livejs/v1/customer/${path}/products`)
    .then((response) => {
      data = response.data.products;
      renderCard(data);
    })
    .catch((error) => {
      console.log(error.response.data);
    });
};
productList();
// 篩選條件
const filter = document.querySelector(".productSelect");
filter.addEventListener("click", function (e) {
  data.forEach((item) => {
    if (e.target.value == "全部") {
      renderCard(data);
    } else if (e.target.value == item.category) {
      let tempData = [];
      data.forEach((item) => {
        if (e.target.value == item.category) tempData.push(item);
      });
      renderCard(tempData);
    }
  });
});
// 渲染商品列表
const renderCard = (renderData) => {
  let str = "";
  renderData.forEach((item) => {
    str += `<li class="productCard"><h4 class="productType">新品</h4><img
    src=${item.images} alt="#"/><a data-content=${
      item.id
    } class="addCardBtn">加入購物車</a><h3>${
      item.title
    }</h3><del class="originPrice">NT$${item.origin_price.toLocaleString()}</del><p class="nowPrice">NT$${item.price.toLocaleString()}</p></li>`;
  });
  pdlist.innerHTML = str;
};
// 加入購物車
pdlist.addEventListener("click", function (e) {
  if (e.target.nodeName == "A") {
    let qt = 0;
    let pdid = e.target.dataset.content;
    ctData.forEach((item) => {
      if (item.product.id == pdid) {
        qt = item.quantity;
      }
    });
    qt++;
    addCart(e.target.dataset.content, qt);
  }
});
const addCart = (pdid, qt) => {
  axios
    .post(`${base}/api/livejs/v1/customer/${path}/carts`, {
      data: {
        productId: pdid,
        quantity: qt,
      },
    })
    .then(function (response) {
      // console.log(response.data);
      cartList();
    })
    .catch(function (error) {
      console.log(error.response.data);
    });
};
// 取得購物車
const ctList = document.querySelector(".shoppingCart-table");
let ctData = [];
const cartList = () => {
  axios
    .get(`${base}/api/livejs/v1/customer/${path}/carts`)
    .then((response) => {
      ctData = response.data.carts;
      let str = `<tr>
        <th width="40%">品項</th>
        <th width="15%">單價</th>
        <th width="15%">數量</th>
        <th width="15%">金額</th>
        <th width="15%"></th>
      </tr>`;
      ctData.forEach((item) => {
        str += `<tr>
          <td>
            <div class="cardItem-title">
              <img src=${item.product.images} alt="#" />
              <p>${item.product.title}</p>
            </div>
          </td>
          <td>NT$${item.product.price.toLocaleString()}</td>
          <td>${item.quantity}</td>
          <td>NT$${(item.product.price * item.quantity).toLocaleString()}</td>
          <td class="discardBtn">
            <a data-did=${item.id} class="material-icons"> clear </a>
          </td>
        </tr>`;
      });
      str += `<tr>
        <td>
          <a class="discardAllBtn">刪除所有品項</a>
        </td>
        <td></td>
        <td></td>
        <td>
          <p>總金額</p>
        </td>
        <td>NT$${response.data.finalTotal.toLocaleString()}</td>
      </tr>`;
      ctList.innerHTML = str;
    })
    .catch((error) => {
      console.log(error.response.data);
    });
};
cartList();

ctList.addEventListener("click", function (e) {
  let done = "";
  let dall = "";
  if (e.target.classList.value == "material-icons") {
    done = e.target.dataset.did;
    deleteOne(done);
  }
  if (e.target.classList.value == "discardAllBtn") {
    dall = e.target.dataset.did;
    deleteAll();
  }
});
// 刪除購物車部分產品
const deleteOne = (cartid) => {
  axios
    .delete(`${base}/api/livejs/v1/customer/${path}/carts/${cartid}`)
    .then(function (response) {
      cartList();
    })
    .catch(function (error) {
      console.log(error.response.data);
    });
};
// 刪除全部購物車
const deleteAll = () => {
  axios
    .delete(`${base}/api/livejs/v1/customer/${path}/carts`)
    .then(function (response) {
      cartList();
    })
    .catch(function (error) {
      console.log(error.response.data);
    });
};

// 送出購買訂單
const orderForm = document.querySelector(".orderInfo-form");
const fname =document.querySelector("#customerName");
const ftel =document.querySelector("#customerPhone");
const fmail = document.querySelector("#customerEmail");
const fadr = document.querySelector("#customerAddress");
const fpay= document.querySelector("#tradeWay");
const fbtn = document.querySelector(".orderInfo-btn");
fbtn.addEventListener('click',function(e){
  if(fname.value.length<1){
    alert("請填寫姓名");
  }else if(ftel.value.length<1){
    alert("請填寫電話");
  }else if(fmail.value<1){
    alert("請輸入Email");
  }else if(fadr.value<1){
    alert("請輸入寄送地址");
  }else{
    let sname=fname.value;
    let stel=ftel.value;
    let smail=fmail.value;
    let sadr=fadr.value;
    let spay=fpay.value;
    sendOrder(sname,stel,smail,sadr,spay);
  }
})
const sendOrder = (fname,ftel,femail,faddress,fpayment) => {
  axios
    .post(`${base}/api/livejs/v1/customer/${path}/orders`, {
      data: {
        user: {
          name: fname,
          tel: ftel,
          email: femail,
          address: faddress,
          payment: fpayment,
        },
      },
    })
    .then(function (response) {
      console.log(response.data);
      cartList();
      orderForm.reset();  
      alert("寄送成功!");
    })
    .catch(function (error) {
      alert(error.response.data.message);
    });
};
