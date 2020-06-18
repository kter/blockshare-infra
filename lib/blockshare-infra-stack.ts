// https://qiita.com/yacchin/items/e2c48984a3a68e77c3c5
// https://dev.classmethod.jp/articles/ecs-deploy-using-cdk/
// Ref: https://github.com/aws-samples/aws-cdk-examples/blob/master/typescript/ecs/fargate-application-load-balanced-service/index.ts
import ec2 = require('@aws-cdk/aws-ec2');
import ecs = require('@aws-cdk/aws-ecs');
import ecr = require('@aws-cdk/aws-ecr');
import ecs_patterns = require('@aws-cdk/aws-ecs-patterns');
import cdk = require('@aws-cdk/core');
import iam = require('@aws-cdk/aws-iam');

export class BlockshareInfraStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create VPC and Fargate Cluster
    // NOTE: Limit AZs to avoid reaching resource quotas
    const vpc = new ec2.Vpc(this, 'MyVpc', { maxAzs: 2 });
    const cluster = new ecs.Cluster(this, 'Cluster', {
      vpc: vpc,
      clusterName: 'blockshare'
    });
    const execution_role = new iam.Role(this, 'executionRole', {
      roleName: 'blockshare-task-role',
      assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonECSTaskExecutionRolePolicy')
      ],
    });
    const task_role = new iam.Role(this, 'taskRole', {
      roleName: 'blockshare-task-execution-role',
      assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
    });
    const taskDefinition = new ecs.FargateTaskDefinition(this, 'blockshare-task-definition', {
      executionRole: execution_role,
      taskRole: task_role,
      memoryLimitMiB: 512,
      cpu: 256
    });
    const repository = new ecr.Repository(this, 'blockshare-repository', {repositoryName: 'blockshare', removalPolicy: cdk.RemovalPolicy.DESTROY});
    taskDefinition.addContainer('app', {
      image: ecs.ContainerImage.fromEcrRepository(repository, 'latest'),
      logging: new ecs.AwsLogDriver({ streamPrefix: 'blockshare-web' })
    }).addPortMappings({
      containerPort: 80,
      hostPort: 80,
    })

    // Instantiate Fargate Service with just cluster and image
    new ecs_patterns.ApplicationLoadBalancedFargateService(this, "FargateService", {
      cluster,
      taskDefinition: taskDefinition,
      serviceName: 'web',
    });
  }
}
