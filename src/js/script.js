const product = { products: [] };
const error = [];
$(document).ready(function () {
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
    if (confirm("Are you sure?")) {
      const prod = product.products.filter((element, idx) => {
        return element.Id !== String($(this).data("pid"));
      });
      product.products = prod;
      displayInTable(product.products);
    }
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
  var name = `<table>
    <tr><th>SKU</th><th>Name</th><th>Price</th><th>Quantity</th><th>Action</th></tr>`;
  for (let i = 0; i < pr.length; i++) {
    name += `<tr><td>${pr[i].Id}</td><td>${pr[i].P_Name}</td><td>${pr[i].Price}</td><td>${pr[i].Qty}</td>
    <td><a href="#" data-pid="${pr[i].Id}" id="editBtn">Edit</a>
    <a href="#" data-pid="${pr[i].Id}" id="deleteBtn">Delete</a></td></tr>`;
  }
  name += `</table>`;
  $("#productList").html(name);
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
  } else if (pName.val().length == "") {
    error.push({ type: "error", msg: "Name filed is empty." });
    pName.css("border-color", "red");
    flag = false;
  } else if (pPrice.val().length == 0) {
    error.push({ type: "error", msg: "Price field is empty" });
    pPrice.css("border-color", "red");
    flag = false;
  } else if (qty.val().length == 0) {
    error.push({ type: "error", msg: "Quantity field is empty" });
    qty.css("border-color", "red");
    flag = false;
  } else if (isNaN(pid.val())) {
    error.push({ type: "error", msg: "SKU field should be integer." });
    pid.css("border-color", "red");
    flag = false;
  } else if (!isNaN(pName.val())) {
    error.push({ type: "error", msg: "Name filed should be string." });
    pName.css("border-color", "red");
    flag = false;
  } else if (isNaN(pPrice.val())) {
    error.push({ type: "error", msg: "Price field should be integer" });
    pPrice.css("border-color", "red");
    flag = false;
  } else if (isNaN(qty.val())) {
    error.push({ type: "error", msg: "Quantity field should be integer" });
    qty.css("border-color", "red");
    flag = false;
  } else {
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
