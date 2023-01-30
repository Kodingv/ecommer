function makeCard(value) {

  let card = `
  <div class="item-card" draggable="true" id="item-card">
    <img src="./img/${value.photo}">
    <h5>${value.title}</h5>
    <h6>${value.brand}</h6>
    <p>가격 : ${value.price}</p>
    <button class="buyBtn" data-id="${value.id}">buy</button>
  </div>
  `

  $('.item-container').append(card);

}

// buy & drag & drop용 function
function cartCard(value) {

  let card = `
    <div class="item-card" draggable="true" style="color:white">
      <img src="./img/${value.photo}">
      <h5>${value.title}</h5>
      <h6>${value.brand}</h6>
      <p>가격 : ${value.price}</p>
      <input type="number" value="${value.count}" class="inputBtn" data-id="${value.id}">
    </div>
    `;
  $('.cart').append(card);

}

let cartArr = [];

$.get('img/store.json').done(function(data){
  
  let products = data.products;
  console.log(products);

  // Ajax , item 가져오기
  products.forEach((value) => {
    makeCard(value);
  });



  // 검색 기능
  // 검색값을 가져온다.
  // 검색값과 products 어레이 값들과 비교한다. 뭘로? includes()로
  // 그래서 트루가 나오면 그 값을 새로운 어레이에 담는다.
  // 화면을 초기화 시키고 새로운 어레이 값들을 화면에 담는다.
  $('.search').on('input', () => {

    let searchValue = $('.search').val();
    let searchProduct = [];
    for(let i = 0; i < products.length; i++){
      if(products[i].title.includes(searchValue) || products[i].brand.includes(searchValue)){
        searchProduct.push(products[i]);
      }
    }

    $('.item-container').html('');

    searchProduct.forEach((value) => {
      makeCard(value);
    });


    // 검색한 단어와 일치하는 글자 노란색으로 바꾸기
    // 검색한 값 가져온다.
    // 일치하면 검색한 값을 스판 씌워서 아이템에 덮어씌운다.
    $('.item-container h5').each(function(index, item){

      let title = item.innerHTML;
      title = title.replace(searchValue, `<span style="background: yellow;">${searchValue}</span>`);
      // console.log(title);
      item.innerHTML = title;  // title 은 대체 단어로 채웠으니 다시 innerHTML에다가 title을 넣는다.
    });

  });


  // buy button 기능
  // 먼저 버튼 누르면 코멘트 삭제
  // 누른 버튼 아이디 값 가져오기
  // 가져온 아이디 값이랑 기존 어레이랑 비교해서 find하기
  // find한 값을 새로운 어레이에 담는데,
  // 새로운 어레이에 find한 값이 있는지 확인
  // 있으면 수량만 늘리고, 없으면 수량 1로 새로운 어레이에 추가
  // 카트 html 초기화 해주고 새로운 어레이에 있는 값들
  // 카트 html에 보여주기.
  $('.buyBtn').on('click', (e) => {
  
    $('.cart-comment').remove();
    
    let cardId = $(e.target).data('id');
    
    let newProduct = products.find(value => {
      return value.id == cardId;
    });

    if(!cartArr.includes(newProduct)){
      newProduct.count = 1;
      cartArr.push(newProduct);
    } else {
      newProduct.count = newProduct.count + 1;
    }

    $('.cart').html('');
    cartArr.forEach(value => {
      cartCard(value);
    });


    // buy button 총 가격표시 기능
    let total = 0;
    cartArr.forEach(value => {
      let qun = value.price * value.count;
      total += qun;
    });
    $('.price-container p').html('');
    $('.price-container p').html(`Total : ${total}$`);


    // input change value in buy button 총가격 표시 기능
    $('.inputBtn').on('input', (e) => {
      let total = 0;
      let target = $(e.target);
      let qun = $(e.target).val();
      qun = parseInt(qun);

      // input value에 따라 수량 변경 및 수량 0일경우 arr, html에서 삭제
      cartArr.forEach((value) => {
        if(e.target.dataset.id == value.id && qun > 0){
          value.count = qun;
        } else if(e.target.dataset.id == value.id && qun <= 0){
          let index = cartArr.findIndex(value => e.target.dataset.id == value.id);
          cartArr.splice(index, 1);
          target.parent().remove();
        }
      });

      // 수정된 arr의 price 값 구하기
      cartArr.forEach(value => {
        total += value.price * value.count;
        $('.price-container p').html('');
        $('.price-container p').html(`Total : ${total}$`);
      });

      // cart html, arr에 아무것도 없을 경우
      if(cartArr.length == 0){
        $('.cart').append(`<span class="cart-comment">drag here</span>`);
        $('.price-container p').html('');
        $('.price-container p').html(`Total : 0$`);
      }
  
    });
    
  });


  // drag & drop 기능
  // dragstart는 드래그 할 아이템에 달아주고,
  // 정보를 담는다
  // drop 과 dragover 은 갖다 놓을 곳에 달아주고,
  // dragover에 preventDefault 달아준다.
  // drop에는 저장한 정보를 가져온다.
  $('.item-card').on('dragstart', e => {
    let getId = $(e.target).children('button').data('id');
    let newProduct = products.find(value => {
      return value.id == getId;
    });

    if(!cartArr.includes(newProduct)){
      newProduct.count = 1;
      cartArr.push(newProduct);
    } else {
      newProduct.count = newProduct.count + 1;
    }
  });

  $('.cart').on('drop', e => {
    e.preventDefault();
    $('.cart').html('');
    cartArr.forEach(value => {
      cartCard(value);
    });

    // drag & drop 총가격 표시 기능
    let total = 0;
    cartArr.forEach(value => {
      let qun = value.price * value.count;
      total += qun;
    });
    $('.price-container p').html('');
    $('.price-container p').html(`Total : ${total}$`);


    // input change value in drag & drop 총가격 표시 기능
    $('.inputBtn').on('input', (e) => {
      let total = 0;
      let target = $(e.target);
      let qun = $(e.target).val();
      qun = parseInt(qun);

      // input value에 따라 수량 변경 및 수량 0일경우 arr, html에서 삭제
      cartArr.forEach((value) => {
        if(e.target.dataset.id == value.id && qun > 0){
          value.count = qun;
        } else if(e.target.dataset.id == value.id && qun <= 0){
          let index = cartArr.findIndex(value => e.target.dataset.id == value.id);
          cartArr.splice(index, 1);
          target.parent().remove();
        }
      });

      // 수정된 arr의 price 값 구하기
      cartArr.forEach(value => {
        total += value.price * value.count;
        $('.price-container p').html('');
        $('.price-container p').html(`Total : ${total}$`);
      });

      // cart html, arr에 아무것도 없을 경우
      if(cartArr.length == 0){
        $('.cart').append(`<span class="cart-comment">drag here</span>`);
        $('.price-container p').html('');
        $('.price-container p').html(`Total : 0$`);
      }
    });
    
  });

  $('.cart').on('dragover', e => {
    e.preventDefault();
  });
  
});


// 총가격에서의 buy버튼 기능
$('.priceBtn').on('click', () => {
  $('.modal-container').css('display', 'block');
});

$('.modal-closeBtn').click(() => {
  $('.modal-container').css('display', 'none');
});

$('.modal-container').click(e => {
  if(e.target == document.querySelector('.modal-container')){
    $('.modal-container').css('display', 'none');
  }
});