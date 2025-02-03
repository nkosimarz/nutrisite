# Nutrisite Infra

The Nutrisite Infra stack is an AWS CloudFormation stack defined using the AWS CDK. It sets up the necessary infrastructure for the Nutrisite application, including an S3 bucket for hosting the static website, a CloudFront distribution for global content delivery, a Lambda function for nutrition data processing, a Cognito user pool for user authentication, and an API Gateway for the REST API endpoint.

## Prerequisites

Use node 22 or use nvm to switch to the node version used in this project.

## Setup

Create a .env file with a DIETAGRAM_API_KEY, if you dont have this yoo will get a sample response.

## Build www and engine

```sh
cd nutrisite-engine
npm run build
zip -r lambda.zip dist node_modules
cd ../
cd nutrisite-www
npm run build
```

## Deployment

To deploy your application ensure you have you AWS credentials configured and you have the aws cli.

To deploy the code

```sh
export AWS_SDK_LOAD_CONFIG=1
export AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
export AWS_REGION=af-south-1

npx cdk bootstrap aws://$AWS_ACCOUNT_ID/$AWS_REGION
npx cdk deploy
```


## Useful commands

* `npm run build`   compile typescript to js
* `npx cdk deploy`  deploy this stack to your default AWS account/region
* `npx cdk diff`    compare deployed stack with current state
* `npx cdk synth`   emits the synthesized CloudFormation template
