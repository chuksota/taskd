const express = require("express");
const router = express.Router();
const db = require("../db/models");
const { asyncHandler, csrfProtection } = require("./utils");
const { check, validationResult } = require("express-validator");

listsValidators = [
  check('name')
    .exists({checkFalsy: true})
    .withMessage('Please provide a list name')
    .isLength({max: 50})
    .withMessage('List name must not be more than 50 characters')
]

router.get('/', asyncHandler(async(req, res)=>{
  const {userId} = req.session.auth
  const lists = await db.List.findAll({where: {userId}})
  res.json({lists})
}))

router.post('/', listsValidators,  asyncHandler(async(req, res)=>{
  const {name, dueDate, completed} = req.body
  const {userId} = req.session.auth
  const newList =  db.List.build({
    name,
    dueDate,
    completed,
    userId
  });
const validatorErrors = validationResult(req)
if(validatorErrors.isEmpty()){
  await newList.save()
  res.json(newList)
} else {
  const errors = validatorErrors.array().map((error)=> error.msg)
  res.json({errors})
}
}));


router.put('/:id(\\d+)', listsValidators, asyncHandler(async(req, res, next)=> {
  const listId = parseInt(req.params.id)
  const list = await db.List.findByPk(listId)
  const {name, dueDate, completed} = req.body
  if(list){
    await list.update({name, dueDate, completed})
    res.json({list})
  } else {
    const errors = validatorErrors.array().map((error)=> error.msg)
    res.json({errors})
  }
}));

router.delete('/:id(\\d+)', asyncHandler(async(req, res, next)=>{
  const listId = parseInt(req.params.id)
  const list = await db.List.findByPk(listId)
  if(list){
    await list.destroy()
    res.status(204).end()
  } else {
    const errors = validatorErrors.array().map((error)=> error.msg)
    res.json({errors})
  }
}))

module.exports = router
