# taskd

Live site: [taskd](https://taskd.herokuapp.com/)

taskd, a Remember The Milk  clone, is a todo-list application that allows users to create todo-lists and tasks in order to stay productive. 

## Technologies Used:

  * Express 
  * Sequelize 
  * HTML 
  * CSS  
  * Javascript
  * AJAX  
  * Bcryptjs for authorization
  * Pug for initial page generation

## Features and Functionality

User Authentication - Users are able to securely sign-up and log-in.
 
Lists - Authenticated users are able to create, name, rename, and add due dates to any list of their choosing. 

Tasks - Authenticated users have the ability to create and add tasks to any list that they've previously created. Users are also able to edit any task, and also mark any task they've finished as completed.
 
Search - Authenticated users will be able to search through all of their lists and tasks to find a specific list or task whenever they need to. 

 Backend search for task snippet:
 
 ```js
     const foundListsWithTasks = await List.findAll({
      where: { userId },
      include: [
        { model: Task, where: { description: { [Op.iLike]: `%${input}%` } } },
      ],
    });
``` 
 
List Summary - Authenticated users will be able to view the currently selected lists statitistics including the amount of tasks that are in that list, the number of completed tasks in that list, and the optional due date. 
 
![logged in users homepage](https://i.gyazo.com/b3a20e64be7d88f72781a4ec9dc8f7f2.gif)

## Future Features

* Users will be able to keep track of a 'productivity score' which tracks the amount of tasks they completed that day. The user will also be able to view a live leaderboard of all of their added friends productivity score.
* Users will be able to add/remove friends from a friends list. 
