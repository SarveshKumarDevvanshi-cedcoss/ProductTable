const product = { products: [] };
const error = [];
$(document).ready(function () {
  displayTableHeader();
  
  
  $("body").on("click", "#addBtn", function () {
      $("#submitBtn").show();
      $("#updateBtn").hide();
      $("#r1").val("");
      $("#r2").val("");
      $("#r3").val("");
      $("#r4").val("");
  });


  $("body").on("click", "#rmSearch", function () {
      $("#search").val("");
  });


  $("body").on("keyup", "#search", function () {
      var key = $("#search").val();
      var prod = product.products.filter((v, i) => {
        return (
          v.P_Name.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
          v.Id.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
          v.Price.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
          v.Qty.toLowerCase().indexOf(key.toLowerCase()) !== -1
        );
      });
      displayInTable(prod);
  });
  $("#submitBtn").on("click", function () {
      var pid = $("#r1");
      var pName = $("#r2");
      var pPrice = $("#r3");
      var qty = $("#r4");


      if (validateFields(pid, pName, pPrice, qty)) {
        $("#notification").fadeOut();

        pid.css("border-color", "black");
        pName.css("border-color", "black");
        pPrice.css("border-color", "black");
        qty.css("border-color", "black");

        if (getProduct(pid.val()).length == 0) {
          //Add to JSON
          addToJSON(pid.val(), pName.val(), pPrice.val(), qty.val());

          displaySuccess("Product added Successfully.");
          console.log(product);
          //displayTableHeader();
          displayInTable(product.products);
        } else {
          displayError(
            "Please Change the Product Id, As it is already exist!",
            0
          );
        }
      } else {
        displayError(error, 1);
      }

  });


  $("#updateBtn").on("click", function () {
    var Pid = $("#r1");
    var pName = $("#r2");
    var pPrice = $("#r3");
    var qty = $("#r4");
    if (validateFields(Pid, pName, pPrice, qty)) {
      var prod = getProduct(Pid.val());
      console.log(prod);
      prod[0].P_Name = pName.val();
      prod[0].Price = pPrice.val();
      prod[0].Qty = qty.val();

      //Display the Product
      //displayTableHeader();
      displayInTable(product.products);
    } else {
      displayError(error, 1);
    }
  });


  $("body").on("click", "#editBtn", function () {
    $("#submitBtn").hide();
    $("#updateBtn").show();
    var prod = getProduct($(this).data("pid"));
    var Pid = $("#r1");
    var pName = $("#r2");
    var pPrice = $("#r3");
    var qty = $("#r4");
    //  console.log( typeof(pid));
    Pid.val(prod[0].Id);
    pName.val(prod[0].P_Name);
    pPrice.val(prod[0].Price);
    qty.val(prod[0].Qty);

    Pid.attr("readonly", true);
  });


  $("body").on("click", "#deleteBtn", function () {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then((willDelete) => {
      if (willDelete) {
        swal("Poof! Record has been deleted!", {
          icon: "success",
        });
        const prod = product.products.filter((element, idx) => {
          return element.Id !== String($(this).data("pid"));
        });
        product.products = prod;
        //displayTableHeader();
        displayInTable(product.products);
      } else {
        swal("Your Record is safe!");
      }
    });
  });


});


function addToJSON(pid, pName, price, qty) {
  product.products.push({ Id: pid, P_Name: pName, Price: price, Qty: qty });
}


function displaySuccess(err) {
  $("#notification").fadeIn();
  $("#notification").removeClass("error-msg");
  $("#notification").addClass("success-msg");
  $("#notification").html(err);
  $("#notification").fadeOut(3000);
}


function displayInTable(pr) {
  var name = `<table>`;
  name +=`<thead><tr><th>SKU</th><th>Name</th><th>Price</th><th>Quantity</th><th>Action</th></tr></thead>`;
  
  
  for (let i = 0; i < pr.length; i++) {
    name += `<tr>`;
    name+=`<td>${pr[i].Id}</td>`;
    name+=`<td>${pr[i].P_Name}</td>`;
    name+=`<td>${pr[i].Price}</td>`;
    name+=`<td>${pr[i].Qty}</td>`;
    name+=`<td>
    <a href="#" data-pid="${pr[i].Id}" id="editBtn" title="Edit">
    <button><i class="fa-solid fa-pencil"></i></button>
    </a>
    <a href="#" data-pid="${pr[i].Id}" id="deleteBtn" title="Delete">
    <button><i class="fa fa-trash"></i></button>
    </a>
    </td>
    </tr>`;
  }


  name += `</table>`;
  $("#productList").html(name);
}


function displayTableHeader() {
  var name = `<div id="headerTable">`
      name += `<label id="searchBar">`;
      name +=`<i class="fa-solid fa-magnifying-glass"></i>`;
      name +=`<input type="text" id="search" placeholder="Search">`;
      name +=`<button id="rmSearch" ><i class="fa-solid fa-xmark"></i></button></label>`;
      name +=`<button id="addBtn">`;
      name +=`<i class="fa-solid fa-square-plus"></i>`;
      name += `</button>`;
      name += `</div>`;

  $("#HeaderTable").html(name);
  $(name).insertAfter("#notification");
}


//display the error
function displayError(error, fl) {
  $("#notification").fadeIn();
  $("#notification").removeClass("success-msg");
  $("#notification").addClass("error-msg");
  var errMsg = "";


  if (fl == 1) {
    //Containes All The Error Messages
    for (let i = 0; i < error.length; i++) {
      errMsg += `${error[i].msg}`;
    }
  } else {
    errMsg = error;
  }


  $("#notification").html(errMsg); // Setting the Error Message to output
  $("#notification").fadeOut(3000);
  error.length = 0; //Making the error free for again checking.
}


function validateFields(pid, pName, pPrice, qty) {
  var flag = true;


  if (pid.val().length == 0) {
    error.push({ type: "error", msg: "SKU field is empty." });
    pid.css("border-color", "red");
    flag = false;
  }
  
  else if (pName.val().length == "") {
    error.push({ type: "error", msg: "Name filed is empty." });
    pName.css("border-color", "red");
    flag = false;
  } 
  
  else if (pPrice.val().length == 0) {
    error.push({ type: "error", msg: "Price field is empty" });
    pPrice.css("border-color", "red");
    flag = false;
  }
  
  else if (qty.val().length == 0) {
    error.push({ type: "error", msg: "Quantity field is empty" });
    qty.css("border-color", "red");
    flag = false;
  } 
  
  else if (isNaN(pid.val())) {
    error.push({ type: "error", msg: "SKU field should be integer." });
    pid.css("border-color", "red");
    flag = false;
  }
  
  else if (!isNaN(pName.val())) {
    error.push({ type: "error", msg: "Name filed should be string." });
    pName.css("border-color", "red");
    flag = false;
  }
  
  else if (isNaN(pPrice.val())) {
    error.push({ type: "error", msg: "Price field should be integer" });
    pPrice.css("border-color", "red");
    flag = false;
  }
  
  else if (isNaN(qty.val())) {
    error.push({ type: "error", msg: "Quantity field should be integer" });
    qty.css("border-color", "red");
    flag = false;
  } 
  
  else {
    error.shift();
  }

  return flag;
}


//Fetch The Product
function getProduct(pid) {
  const pr = product.products.filter((element, idx) => {
    return element.Id === String(pid);
  });
  // console.log(pr);
  return pr;
}
