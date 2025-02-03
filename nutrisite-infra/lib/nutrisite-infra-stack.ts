import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as dotenv from 'dotenv';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
dotenv.config();

export class NutrisiteInfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const websiteBucket = new s3.Bucket(this, 'NutrisiteWebsiteBucket', {
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'index.html',
      publicReadAccess: true,
      blockPublicAccess: new s3.BlockPublicAccess({
        blockPublicAcls: false,
        blockPublicPolicy: false,
        ignorePublicAcls: false,
        restrictPublicBuckets: false
      }),
      cors: [{
        allowedMethods: [s3.HttpMethods.GET],
        allowedOrigins: ['*'],
        allowedHeaders: ['*']
      }]
    });

    const bucketPolicy = new iam.PolicyStatement({
      actions: ['s3:GetObject'],
      resources: [websiteBucket.arnForObjects('*')],
      principals: [new iam.AnyPrincipal()]
    });
    websiteBucket.addToResourcePolicy(bucketPolicy);

    const distribution = new cloudfront.Distribution(this, 'NutrisiteDistribution', {
      defaultBehavior: {
        origin: new origins.S3StaticWebsiteOrigin(websiteBucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      defaultRootObject: 'index.html',
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html'
        }
      ]
    });

    new s3deploy.BucketDeployment(this, 'DeployWebsite', {
      sources: [s3deploy.Source.asset('../nutrisite-www/dist')],
      destinationBucket: websiteBucket,
      distribution,
      distributionPaths: ['/*']
    });

    const dietagramApiKey = process.env.DIETAGRAM_API_KEY;

    const nutritionLambda = new lambda.Function(this, 'NutritionHandler', {
      runtime: lambda.Runtime.NODEJS_22_X,
      code: lambda.Code.fromAsset('../nutrisite-engine/lambda.zip'),
      handler: 'dist/nutrition.handler',
      environment: {
        DIETAGRAM_API_KEY: dietagramApiKey || '',
      },
    });

    const userPool = new cognito.UserPool(this, 'NutriSiteUserPool', {
      selfSignUpEnabled: true,
      userVerification: {
        emailStyle: cognito.VerificationEmailStyle.LINK,
      },
      signInAliases: { email: true },
      autoVerify: { email: true },
      standardAttributes: {
        email: { required: true, mutable: false },
      },
    });

    const domain = userPool.addDomain('NutriSiteDomain', {
      cognitoDomain: {
        domainPrefix: 'nutrisite-auth'
      }
    });

    const userPoolClient = new cognito.UserPoolClient(this, 'NutriSiteUserPoolClient', {
      userPool,
      oAuth: {
        flows: {
          implicitCodeGrant: true
        },
        callbackUrls: [
          'http://localhost:5173',
          `https://${distribution.distributionDomainName}`
        ],
        logoutUrls: [
          'http://localhost:5173',
          `https://${distribution.distributionDomainName}`
        ]
      }
    });

    const authorizer = new apigateway.CognitoUserPoolsAuthorizer(this, 'NutriSiteAuthorizer', {
      cognitoUserPools: [userPool]
    });

    const api = new apigateway.RestApi(this, 'NutriSiteApi', {
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: ['POST', 'OPTIONS'],
        allowHeaders: ['Content-Type', 'Authorization']
      }
    });

    const apiGateway = api.root.addResource('api')
    const nutrition = apiGateway.addResource('nutrition');

    nutrition.addMethod('POST',
      new apigateway.LambdaIntegration(nutritionLambda),
      {
        authorizer: authorizer,
        authorizationType: apigateway.AuthorizationType.COGNITO
      }
    );

    new cdk.CfnOutput(this, 'WebsiteURL', { value: `https://${distribution.distributionDomainName}` });
    new cdk.CfnOutput(this, 'UserPoolId', { value: userPool.userPoolId });
    new cdk.CfnOutput(this, 'ClientId', { value: userPoolClient.userPoolClientId });
    new cdk.CfnOutput(this, 'ApiEndpoint', { value: api.url });
    new cdk.CfnOutput(this, 'CognitoDomain', { value: domain.domainName });
  }
}