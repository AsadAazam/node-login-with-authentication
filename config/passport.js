const LocalStrategy=require('passport-local').Strategy
//const mongoose=require('mongoose')
const bcrypt =require('bcryptjs')
const User=require('../models/Users')


module.exports=  function (passport) {
        passport.use(
        new LocalStrategy({usernameField:'email'},async(email,password,done)=>{
            //Match user
            try{
                const user=await   User.findOne({email:email})
           if(!user)
           {
               return(done(null,false,{message:'That email is not registered'}))
           }
           //match password
           console.log(password)
           console.log(user.password)
         const isMatch=await  bcrypt.compare(password,user.password)
             console.log(isMatch)
               if (!isMatch)
               return done(null,false,{message:'password is incorrect'})
                          
              return done(null,user)
               
                    
               

           }           
            catch(error)
            {
                 console.log(error)
            }
        })
    )


    passport.serializeUser((user, done)=> {
        done(null, user.id);
      });
      
      passport.deserializeUser((id, done)=> {
        User.findById(id, (err, user)=> {
          done(err, user);
        });
      });
    
}