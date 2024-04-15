const bcrypt = require('bcrypt')
const express = require('express')
const app = express()
const port = 3000

let dbUsers = [
    {
      username: "kok",
      password: "123456",
      email:"kok@gmail.com"
  },{
    username: "gg",
    password: "34343",
    email:"wee0@gmail.com"
  }
  ]

for (let i = 0; i < dbUsers.length; i++) {
  const hashedPassword = bcrypt.hashSync(dbUsers[i].password, 12);
  dbUsers[i].password = hashedPassword;
}

app.use(express.json());

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

app.get('/', (req,res)=> {
    res.send('Hello World')
})

app.post('/signup', async (req, res) =>{
    const {username, password, email} = req.body;
    const hash = await bcrypt.hash(password, 12);
    const matched = dbUsers.find(Element=> Element.username === username);
    if(matched){
      res.send("Username exist"); 
      return; 
    }else{
      dbUsers.push({
        username: username,
        password: hash,
        email: email
      })
      res.send("push successfully"); 
      return;
    }
})

app.post('/loginUser', async(req, res)=>{
  const {username, password} = req.body;
  const user = dbUsers.find(Element=> Element.username === username);
  if(user){
    const hashPass = await bcrypt.compare(password, user.password)
    if(hashPass){
      res.send({username: user.username, email: user.email});
    }else{
      res.send("password not match")
      return
    }
  }else{
    res.send("User not found")
    return
  }
})

app.post('/register', (req, res)=>{
  let data = req.body
  res.send(register(data.username, data.password, data.email))
})

function register(newusername, newpassword, newemail){
  let matched = dbUsers.find(element=>element.username == newusername)

  if(matched) {
      return "This user already exists"
  }

  else {
      const hashedpassword = bcrypt.hashSync(newpassword, 12)

      dbUsers.push({
          username: newusername,
          password: hashedpassword,
          email: newemail
      })

      return "new user is added"
  }
}