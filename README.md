# Concat pull-request body github action

This action will concatenate a certain text, to the original body of the pull request.
## Inputs

### `github-token`

**Required** `${{ secrets.GITHUB_TOKEN }}`

### `message`

**Required** 

## Example usage

```
name: Edit pull-request body
on: [pull_request]

uses: chiaretto/github-action-concat-pr-body@v1
with:
  github-token: "${{ secrets.GITHUB_TOKEN }}"
  message: "This pull request generated the following artifacts."
```
