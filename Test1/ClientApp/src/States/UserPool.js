import { CognitoUserPool } from "amazon-cognito-identity-js"

const poolData = {
    region: "us-east-1",
    UserPoolId: "us-east-1_6mbGNdUnk",
    ClientId: "4pi4fp7t6mrkfr81fr7k8v60jl",
   
    
    
}

export default new CognitoUserPool(poolData);
