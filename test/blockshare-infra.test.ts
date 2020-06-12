import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import BlockshareInfra = require('../lib/blockshare-infra-stack');

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new BlockshareInfra.BlockshareInfraStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
