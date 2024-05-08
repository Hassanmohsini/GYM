## User Endpoints:

### 1. User Registration (Signup):

`Endpoint`: /users/signup
`Method:` POST
`Description:` Allows users to create a new account.
`Security:` Use bcrypt to securely hash passwords. Validate input data to prevent injection attacks.

## 2. User Authentication (Login):

`Endpoint`: /users/login
`Method:` POST
`Description:` Allows users to authenticate.
`Security:` Implement JWT-based authentication. Use bcrypt to securely hash and compare passwords.

## Admin Endpoints:

### Admin Authentication:

`Endpoint`: /admin/login
`Method:` POST
`Description:` Allows admin users to authenticate.
`Security:` Implement JWT-based authentication. Use bcrypt to securely hash and compare passwords.

## Create Trainer Account:

`Endpoint`: /admin/trainers
`Method:` POST
`Description:` Allows admin users to create a new trainer account.
`Security:` Ensure only authenticated admin users can access this endpoint. Validate input data to prevent injection attacks.

## Update Trainer Account:

`Endpoint`: /admin/trainers/:id
`Method:` PUT
`Description:` Allows admin users to update an existing trainer's account details.
`Security:` Authenticate the admin user. Authorize only admin users with appropriate permissions to perform updates.

## Delete Trainer Account:

`Endpoint`: /admin/trainers/:id
`Method:` DELETE
`Description:` Allows admin users to delete a trainer's account.
`Security:` Authenticate the admin user. Authorize only admin users with appropriate permissions to perform deletions.

## User Endpoints:

### 1. User Registration:

`Endpoint`: /users/signup
`Method:` POST
`Description:` Allows users to create a new account.
`Security:` Use bcrypt to securely hash passwords. Validate input data to prevent injection attacks.

### 2. User Authentication:

`Endpoint`: /users/login
`Method:` POST
`Description:` Allows users to authenticate.
`Security:` Implement JWT-based authentication. Use bcrypt to securely hash and compare passwords.

### 3. Get User Profile:

`Endpoint`: /users/profile
`Method:` GET
`Description:` Retrieves the profile of the authenticated user.
`Security:` Require authentication via JWT. Ensure users can only access their own profiles.

### 4. Update User Profile:

`Endpoint`: /users/profile
`Method:` PUT
`Description:` Allows users to update their profile information.
`Security:` Require authentication via JWT. Ensure users can only update their own profiles.

## Trainer Endpoints:

### 1. Get Trainer Profile:

`Endpoint`: /trainers/profile
`Method:` GET
`Description:` Retrieves the profile of the authenticated trainer.
`Security:` Require authentication via JWT. Ensure trainers can only access their own profiles.

### 2. Update Trainer Profile:

`Endpoint`: /trainers/profile
`Method:` PUT
`Description:` Allows trainers to update their profile information.
`Security:` Require authentication via JWT. Ensure trainers can only update their own profiles.

### 3. Get User Info

`Endpoint:` /user/infor
`Method:` Get
`Description:` The trainer should be allowed to get some of users info like: name, lastname, email, phone, age, height, weight, goal`{gain or losse}`
`Security:` the trainer should not be allowed to get users' bank account and address.# GYM

# signup with veryfication

- /singup
- creat a new hashed password
- Generate a verification token
- save the user with eamil, hashed password, verifcation token to the database
- add another field to the users to specify if verified or not
  - for example, isVerified: false
- send an email to the user with the url localhost:9000/verfiy/<verification-token>

# verfication

- the user receives the verification email
- clicks on the verfy link - localhost:9000/verify/<verification-token>
- inside the endpoint you find the user by the token
- you change the isVerified field to true
# GYM





try {
    // Create a new instance of the Image model
const user = await User.findById(req.body.id)
console.log(user);

const picture = req.file.filename;
console.log(picture);
  
  } catch (error) {
    res.status(500).json({
      success: 0,
      message: "Error uploading profile picture.",
    });
  }