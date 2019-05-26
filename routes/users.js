const express = require('express')
const router = express.Router()
const User= require('../models/Users')
const bcrypt =require('bcryptjs')
const passport=require('passport')

router.get('/users/login',(req,res)=>{
    res.status(201).render("login")

})

router.get('/users/register',(req,res)=>{
    res.render('register')
})

router.post('/users/register',async (req,res)=>{
    const {name,email,password,password2}=req.body
    let errors = []

    //check required
    if(!name || !email || !password || !password2)
    {
        errors.push({msg:'Please fill in all feilds'})
    }

    //Check password match
    if(password!==password2)
    {
        errors.push({msg:'Passwords do not match'})
    }

    //check password length
    if(password.length<6){
        errors.push({msg:'Password should be atleast 6 characters'})
    }

    if(errors.length>0)
    {
      res.render('register',{
          errors,
          name,
          email,
          password,
          password2
      })
    }
    else{
        //validated
        try{
      const user= await User.findOne({email:email})
      if(user)
      {
          //user exists
          errors.push({msg:'Email already registered'})
          res.render('register',{
              errors,
              name,
              email,
              password,
              password2
          })
      }
      else{
          const newUser=User({
              name,
              email,
              password
          })
          bcrypt.genSalt(10,(error,salt)=>
          bcrypt.hash(newUser.password,salt,async (error,hash)=>{
              if (error)
              {
                  console.log(error)
                  throw error
              }
              newUser.password=hash
              try{
              const user =await newUser.save()
                  req.flash('success_msg','You are now registered LOGIN to continue')
                  res.redirect('/users/login')
              
              }
              catch(error)
              {
                  console.log(erro)
              }
          })
          )

      }
        }
        catch(error){
         console.log(error)
        }
        
    }
})

router.post('/users/login',(req,res,next)=>{
    console.log('here')
    passport.authenticate('local',{
        successRedirect : '/dashboard',
        failureRedirect : '/users/login',
        failureFlash : true
    })(req,res,next)
})

router.get('/users/logout',(req,res)=>{
    req.logout()
    req.flash('success_msg','You are logged out')
    res.redirect('/users/login')
})

module.exports =router