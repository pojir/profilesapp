# Amplify Hosting CloudFormation

This template creates an AWS Amplify Hosting app named `profilesapp`, connects it to `https://github.com/pojir/profilesapp`, and enables automatic builds for the `main` branch.

Deploy it in `eu-west-1`:

```sh
aws cloudformation deploy \
  --region eu-west-1 \
  --stack-name profilesapp-amplify-hosting \
  --template-file infra/amplify-hosting.yaml \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameter-overrides GitHubAccessToken=YOUR_GITHUB_TOKEN
```

The GitHub token is passed as a `NoEcho` CloudFormation parameter and is used by Amplify to authorize repository access.

To use a different branch:

```sh
aws cloudformation deploy \
  --region eu-west-1 \
  --stack-name profilesapp-amplify-hosting \
  --template-file infra/amplify-hosting.yaml \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameter-overrides GitHubAccessToken=YOUR_GITHUB_TOKEN BranchName=develop
```
