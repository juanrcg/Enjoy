import { CognitoUserPool } from "amazon-cognito-identity-js"

const poolData = {
    region: "us-east-1",
    UserPoolId: "us-east-1_E4tHXcNqJ",
    ClientId: "2bbfea4ceslu5avrju1vc0d3e2",
   
    
    
}


export default new CognitoUserPool(poolData);
