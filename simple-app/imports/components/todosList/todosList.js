import angular from 'angular';
import angularMeteor from 'angular-meteor';
import template from './todosList.html';
import { Tasks } from '../../api/tasks.js';
import { Meteor } from 'meteor/meteor';

class TodosListCtrl {
  constructor($scope) {
  //   this.tasks = [
  //     { text: 'This is task 1' },
  //     { text: 'This is task 2' },
  //     { text: 'This is task 3' }
  //   ];
    $scope.viewModel(this);
    this.subscribe('tasks'); //server publication
    this.hideCompleted = false;
    this.helpers({
      tasks(){
        const selector = {};

        //if hide completed is checked. filter tasks
        if (this.getReactively('hideCompleted')){
          selector.checked = {
            $ne:true
          };
        }

        //return newest tasks at the top
        return Tasks.find(selector, {
          sort:{
            createdAt: -1
          }
        });
      },

      //For incomplete task count
      incompleteCount(){
        return Tasks.find({
          checked: {
            $ne:true
          }
        }).count();
      },

      //know who is logged in
      currentUser(){
        return Meteor.user();
      }

    })
  }

  addTask(newTask) {
    //Insert a task into the collection
    // Tasks.insert({
    //   text: newTask,
    //   createdAt: new Date,
    //   owner: Meteor.userId(),
    //   username: Meteor.user().username
    // });

    //after remove insecure
    Meteor.call('tasks.insert', newTask);
    this.newTask = ''; //clear form
  }

  setChecked(task) {
    // Set the checked property to the opposite of its current value
    // Tasks.update(task._id, {
    //   $set: {
    //     checked: !task.checked
    //   },
    // });

    //after remove insecure
    Meteor.call('tasks.setChecked', task._id, !task.checked);
  }

  removeTask(task){
    // Tasks.remove(task._id);

    //after remove insecure
    Meteor.call('tasks.remove', task._id);
  }

  setPrivate(task){
    Meteor.call('tasks.setPrivate', task._id, !task.private);
  }
}

export default angular.module('todosList', [
  angularMeteor
])
  .component('todosList', {
    templateUrl: 'imports/components/todosList/todosList.html',
    // controller: TodosListCtrl
    controller: ['$scope', TodosListCtrl]
  });
