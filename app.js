//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/todolistDB", {useNewUrlParser: true});

const itemsSchema = {
  name: String
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item ({
  name: "welcome to your todolist"
});

const item2 = new Item ({
  name: "Hit the + button to add a new item"
});

const item3 = new Item ({
  name: "<-- Hit this to delete an item"
});

const defaultItems = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);

app.get("/", function(req, res){


Item.find({}).then(function(foundItems){
  if (foundItems.length == 0){
   console.log("empty")
  }else {
    res.render("list", {listTitle: "Today", newListItems: foundItems})
  }});
  
});

app.get("/:customListName", function(req,res) {                 // This step still needs some work
  const customListName = req.params.customListName;

  List.findOne({name: customListName}).then(function(err,foundList) {
    if (!err) {
      if (!foundList) {
        const list = new List({
          name: customListName,
          items: defaultItems
        });
      
        list.save();
        res.redirect("/" + customListName);
      }
      else {
        res.render("list", {listTitle: foundList.name, newListItems: foundList.items})
      }
    }
  })

});

app.post("/", function(req, res){

  const itemName = req.body.newItem;

  const item = new Item({
    name: itemName
  });

  item.save();

  res.redirect("/");
});

app.post("/delete", function(req,res) {
  const checkeditemID = req.body.checkbox;
  Item.findByIdAndRemove(checkeditemID).then(function(err) {
    if (!err) {
      console.log("deleted checked item");
    }
  })
  res.redirect("/");

});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
