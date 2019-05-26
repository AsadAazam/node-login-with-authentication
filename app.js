const express = require('express')
const expressLayouts=require('express-ejs-layouts')
const mongoose= require('mongoose')
const flash =require('connect-flash')
const session=require('express-session')
const indexRouter=require('./routes/index')
const userRouter=require('./routes/users')
const passport =require('passport')
const app=express()
// Passport config
require('./config/passport')(passport)

//Db config
const db= require('./config/keys').MongoURI

//connect to mongo
mongoose.connect(db,{useNewUrlParser:true}).then(()=>console.log('mongodb connected...'))
.catch(error=>console.log(error)
)

//EJS
app.use(expressLayouts)
app.set('view engine','ejs')

//body parser
app.use(express.urlencoded({extended:false}))

//express session
app.use(session({
    secret: 'it is a secreat with an a',
    resave: true,
    saveUninitialized: true,
    //cookie: { secure: true }
  }))

  //passport middleware
  app.use(passport.initialize());
  app.use(passport.session());

  // connect flash
  app.use(flash())

  // global variable 
  app.use((req,res,next)=>{
      res.locals.success_msg=req.flash('success_msg')
      res.locals.error_msg=req.flash('error_msg')
      res.locals.error=req.flash('error')
      next()
  })

app.use(indexRouter)
app.use(userRouter)
const PORT=process.env.PORT ||5000

app.listen(PORT,console.log('server Started on port ',PORT))