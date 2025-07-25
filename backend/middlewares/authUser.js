import jwt from 'jsonwebtoken'

//user authentication middleware

const authUser=async(req,res,next)=>{

let token;

  // 1. Check if the Authorization header exists and starts with "Bearer"
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    try {
        console.log('SECRET USED FOR VERIFYING TOKEN:', process.env.JWT_SECRET)
      // 2. Extract the token from the header (remove "Bearer ")
      token = req.headers.authorization.split(' ')[1];

      // 3. Verify the token using your secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4. Attach the user's ID to the request object for the next function
      req.user = { id: decoded.id };

      // 5. Move to the next function (e.g., the updateprofile controller)
      next();

    } catch (error) {
      // This will catch errors like an invalid or expired token
      console.error("Token verification failed:", error.message);
      res.status(401).json({ success: false, message: "Authorization failed, token is invalid." });
    }
  } else {
    // This runs if no token is found in the header
    res.status(401).json({ success: false, message: "No token provided, authorization denied." });
  }

}

export default authUser

