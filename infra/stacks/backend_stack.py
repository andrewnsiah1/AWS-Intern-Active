"""CDK Stack for the AWS Wizard Game backend.

Provisions:
- S3 bucket for AWS documentation (Knowledge Base source)
- Lambda function running FastAPI
- API Gateway HTTP API
- IAM roles with Bedrock access
"""

from aws_cdk import (
    Stack,
    Duration,
    RemovalPolicy,
    CfnOutput,
    aws_s3 as s3,
    aws_lambda as lambda_,
    aws_iam as iam,
    aws_apigatewayv2 as apigwv2,
)
from aws_cdk.aws_apigatewayv2_integrations import HttpLambdaIntegration
from constructs import Construct


class BackendStack(Stack):
    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        # Pull sensitive/environment-specific config from CDK context
        kb_id = self.node.try_get_context("kb_id") or ""
        github_pages_url = self.node.try_get_context("github_pages_url") or "http://localhost:3000"

        # ============================================================
        # S3 Bucket for AWS documentation (Knowledge Base data source)
        # ============================================================
        docs_bucket = s3.Bucket(
            self,
            "DocsDataSource",
            bucket_name=f"aws-wizard-game-docs-{self.account}",
            removal_policy=RemovalPolicy.RETAIN,
            block_public_access=s3.BlockPublicAccess.BLOCK_ALL,
            encryption=s3.BucketEncryption.S3_MANAGED,
        )

        # ============================================================
        # Lambda Function (FastAPI via Mangum)
        # ============================================================
        api_lambda = lambda_.DockerImageFunction(
            self,
            "WizardApiFunction",
            code=lambda_.DockerImageCode.from_image_asset("../backend"),
            timeout=Duration.seconds(60),
            memory_size=512,
            environment={
                "BEDROCK_KNOWLEDGE_BASE_ID": kb_id,
                "BEDROCK_MODEL_ID": "anthropic.claude-3-sonnet-20240229-v1:0",
                "ALLOWED_ORIGINS": github_pages_url,
            },
            description="AWS Wizard Game - FastAPI backend",
        )

        # Grant Bedrock permissions
        api_lambda.add_to_role_policy(
            iam.PolicyStatement(
                effect=iam.Effect.ALLOW,
                actions=[
                    "bedrock:InvokeModel",
                    "bedrock:Retrieve",
                ],
                resources=["*"],  # Scope down to specific model/KB ARNs in production
            )
        )

        # Grant S3 read access (for potential direct doc access)
        docs_bucket.grant_read(api_lambda)

        # ============================================================
        # API Gateway HTTP API
        # ============================================================
        http_api = apigwv2.HttpApi(
            self,
            "WizardHttpApi",
            api_name="aws-wizard-game-api",
            cors_preflight=apigwv2.CorsPreflightOptions(
                allow_origins=[github_pages_url, "http://localhost:3000"],
                allow_methods=[apigwv2.CorsHttpMethod.GET, apigwv2.CorsHttpMethod.POST, apigwv2.CorsHttpMethod.OPTIONS],
                allow_headers=["Content-Type", "Authorization"],
                max_age=Duration.hours(1),
            ),
            description="HTTP API for the AWS Wizard Game",
        )

        # Throttle: 10 requests/sec burst, 5 requests/sec sustained per client
        # This prevents someone from hammering the API and running up your Bedrock bill
        cfn_stage = http_api.default_stage.node.default_child
        cfn_stage.default_route_settings = apigwv2.CfnStage.RouteSettingsProperty(
            throttling_burst_limit=10,
            throttling_rate_limit=5,
        )

        # Lambda integration
        integration = HttpLambdaIntegration("LambdaIntegration", api_lambda)

        # Routes
        http_api.add_routes(
            path="/chat",
            methods=[apigwv2.HttpMethod.POST],
            integration=integration,
        )
        http_api.add_routes(
            path="/health",
            methods=[apigwv2.HttpMethod.GET],
            integration=integration,
        )
        http_api.add_routes(
            path="/quests",
            methods=[apigwv2.HttpMethod.GET],
            integration=integration,
        )
        http_api.add_routes(
            path="/achievements",
            methods=[apigwv2.HttpMethod.GET],
            integration=integration,
        )
        http_api.add_routes(
            path="/levels",
            methods=[apigwv2.HttpMethod.GET],
            integration=integration,
        )

        # ============================================================
        # Outputs
        # ============================================================
        CfnOutput(
            self,
            "ApiUrl",
            value=http_api.url or "",
            description="API Gateway endpoint URL - set this in frontend/js/config.js",
        )
        CfnOutput(
            self,
            "DocsBucketName",
            value=docs_bucket.bucket_name,
            description="S3 bucket for uploading AWS documentation",
        )
