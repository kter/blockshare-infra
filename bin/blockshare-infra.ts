#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { BlockshareInfraStack } from '../lib/blockshare-infra-stack';

const app = new cdk.App();
new BlockshareInfraStack(app, 'BlockshareInfraStack');
