


var catTemp = (`
<div id="category-container" :class="('map'+mapStatus)">
<ul id="category-list">
  <li v-for="(category,index) in categories" :data-index="index" :data-id="category.id" :key="category.id" >

    <div class="form" v-if="category.id === editing.id && editing.set === 'category'" :data-new="category.new">

      <input placeholder="Category Name" type="text" :value="category.title" />


      <input type="color" :value="category.color" id="color-picker" />
      <br/>
      <button :data-id="category.id" @click.prevent="cancelItem">Cancel</button>
      <button :data-id="category.id" @click.prevent="updateItem">Save</button>
    </div>

    <div v-else class='regular' v-bind:class="{disabled: editing}" :style="{borderColor:category.color}">
      <div class="title">{{category.title}}</div>
      <div class="controls plugins">
        <span v-if="editing">
          &nbsp;
        </span>
        <span v-if="!editing">
          <a  href="#" :data-id="category.id" class="edit" @click.prevent="editItem">Edit</a>
        </span>
        <span v-if="!editing">
          <a  href="#" :data-id="category.id" class="delete" @click.prevent="deleteClick(category.id)">Delete</a>
        </span>
        <span v-if="index !== (categories.length - 1) && !editing">
          <a @click.prevent="moveItem"  :data-id="category.id" href="#" data-dir="down">Move Down</a>
        </span>
        <span v-if="index !== 0 && !editing">
          <a @click.prevent="moveItem"  href="#" :data-id="category.id" data-dir="up">Move Up</a>
        </span>
      </div>


    </div>

  </li>

</ul>
<div class="footer" v-if="!editing">
<a href="#" @click.prevent="addButton" class="taxonomy-add-new">+ Add New Category</a>

</div>


</div>
`)

createBus();

var catApp = new Vue({
  data: dObj,
  template: catTemp,
  beforeUpdate: function() {
    if(!this.editing) {
      $('#color-picker').spectrum('destroy');
    }
  },
  updated: function() {
    $("#color-picker").spectrum({
      color: $('#color-picker').val(),
      showInput: true,
      showAlpha: false,
      preferredFormat: "hex",
    });
  },
  created: function() {
    App.bus.$on('updateData', function(data){
      this.data = data;
    }.bind(this));
  },
  methods: {
    okToDelete: function(id) {
      if(this.categories.length < 2) {
        alert('You need at least one category.');
        return false;
      }
      var key = this.categories.map(function(x){
        return x.id;
      }).indexOf(id);
      if(this.categories[key].points.length) {
        alert('This category has point associated with it.')
        return false;
      }
      return true;
    },
    makePicker: function() {
      console.log('afa');
    },
    deleteClick: function(id) {
      if(this.okToDelete(id)){
        App.bus.$emit('deleteItem', 'category', id)
      }
    },
    cancelItem: function(e) {
      var p = $(e.target).closest('.form');
      var id = +$(p).closest('li').data('id')
      if($(p).data('new')) {
        if(this.okToDelete(id)) {
          App.bus.$emit('deleteItem', 'category', id)
        }
        return false;
      }
      App.bus.$emit('updateItem','editState',false,false);
    },
    editItem: function(e) {

      var id = +$(e.target).data('id');
      App.bus.$emit('updateItem','editState',false,{
        id: id,
        set: 'category'
      });
    },
    updateItem: function(e) {
      var p = $(e.target).closest('.form');
      var title = $(p).find('input[type="text"]').val();
      var color = $(p).find('input[type="color"]').val();
      var id = +$(e.target).data('id');
      if(!title) {
        alert('You need to have a title');
        return false;
      }
      var key = this.categories.map(function(x){
        return x.id;
      }).indexOf(parseInt($(e.target).data('id')));
      var points = this.categories[key].points;
      App.bus.$emit('updateItem','category',key,{
        id: id,
        title: title,
        color: color,
        points: points
      });

    },
    moveItem: function(e) {

      var id = +$(e.target).data('id');
      var dir = $(e.target).data('dir');
      App.bus.$emit('moveItem','categories',id,dir);
      $(e.target).blur();
    },


    addButton: function(e) {
      App.bus.$emit('addItem', 'category');
    }
  }
});



$(document).ready(function(){
catApp.$mount('#map-categories');



  mapInit();
  pointListInt();

})
