#!/usr/bin/env python3
"""CDK app entry point for the AWS Wizard Game infrastructure."""

import aws_cdk as cdk
from stacks.backend_stack import BackendStack

app = cdk.App()

BackendStack(
    app,
    "AwsWizardGameStack",
    description="AWS Wizard Game - Serverless backend with Bedrock RAG",
    env=cdk.Environment(
        region="us-east-1",  # Bedrock availability
    ),
)

app.synth()
