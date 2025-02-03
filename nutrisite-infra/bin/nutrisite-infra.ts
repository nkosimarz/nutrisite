#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { NutrisiteInfraStack } from '../lib/nutrisite-infra-stack';

const app = new cdk.App();
new NutrisiteInfraStack(app, 'NutrisiteInfraStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION || 'us-east-1'
  }
});