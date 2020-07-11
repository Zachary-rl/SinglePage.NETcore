

var currentList = {};



$(document).ready(function () {
    console.log("Ready");

    hideShoppingList();


    var pageUrl = window.location.href
    var idIndex = pageUrl.indexOf("?id=");
    if (idIndex != -1) {
        getShoppingListById(pageUrl.substring(idIndex + 4));
    }
    $("#shoppingListName").focus();
    $("#shoppingListName").keyup(function (event) {
        if (event.keyCode == 13) {
            createList();
        }
    });


    window.onpopstate = function (event) {
        if (event.state == null) {
            // hide shopping list 
            hideShoppingList();
        }
        else {
            getShoppingListById(event.state.id);
        }
    };
  
});

function createList() {

    currentList.name = $("#shoppingListName").val();
    currentList.items = new Array();
    
    // Web Service Call
    $.ajax({
        type: "POST",
        dataType: "json",
        url: "api/ShoppingEFLists/",
        data: currentList,
        success: function (result) {
            currentList = result;
            showShoppingList();
            history.pushState({id: result.id}, result.name, "?id=" + result.id);
        }
    })
}

function addItem() {
    var newItem = {};
    newItem.name = $("#newItemName").val();
    newItem.shoppingListId = currentList.id;

    $.ajax({
        type: "POST",
        dataType: "json",
        url: "api/Item/",
        data: newItem,
        success: function (result) {
            currentList = result;
            drawItems();
            $("#newItemName").val(" ");
        }
    })

}

function drawItems() {
    var $list = $("#shoppingListItems").empty();

    for (var i = 0; i < currentList.items.length; i++) {
        var currentItem = currentList.items[i];
        var $li = $("<li>").html(currentItem.name).attr("id", "item_" + i);
        var $deleteBtn = $("<button onclick='deleteItem(" + currentItem.id +")'>Delete</button>").appendTo($li);
        var $checkBtn = $("<button onclick='checkItem(" + currentItem.id + ")'>Check</button>").appendTo($li);


        if (currentItem.checked) {
            $li.addClass("checked");
        }



        $li.appendTo($list);

    }
}

function deleteItem(itemId) {
    $.ajax({
        type: "DELETE",
        dataType: "json",
        url: "api/Item/" + itemId,
        success: function (result) {
            currentList = result;
            drawItems();
        }
    })
}

function checkItem(itemId){
    var changedItem = {};

    for (var i = 0; i < currentList.items.length; i++) {
        if (currentList.items[i].id == itemId) {
            changedItem = currentList.items[i];
        }
    }
    changedItem.checked = !changedItem.checked;

    $.ajax({
        type: "PUT",
        dataType: "json",
        url: "api/Item/" + itemId,
        data: changedItem,
        success: function (result) {
            currentList = result;
            drawItems();
        }
    })
   
}
function getShoppingListById(id) {
    $.ajax({
        type: "GET",
        dataType: "json",
        url: "api/ShoppingEFLists/" + id,
        success: function (result) {
            currentList = result;
            showShoppingList();
            drawItems();
        }
    })

}

function showShoppingList() {
    $("#shoppingListTitle").html(currentList.name);
    $("#shoppingListItems").empty();
    $("#createListDiv").hide();
    $("#shoppingListDiv").show();


    $("#newItemName").val("");
    $("#newItemName").focus();
    $("#newItemName").unbind("keyup");
    $("#newItemName").keyup(function (event) {
        if (event.keyCode == 13) {
            addItem();
        }
    });
}

function hideShoppingList() {

    $("#createListDiv").show();
    $("#shoppingListDiv").hide();
    $("#shoppingListName").val("");


    $("#shoppingListName").focus();
    $("#shoppingListName").unbind("keyup");
    $("#shoppingListName").keyup(function (event) {
        if (event.keyCode == 13) {
            createList();
        }
    });
}
