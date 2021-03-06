# Concat pull-request body github action

This action will concatenate a certain text, to the original body of the pull request.
## Inputs

### `github-token`

**Required** `${{ secrets.GITHUB_TOKEN }}`

### `message`

**Required** 

### `replace-last-message`

### `pr-number`

## Example usage

```
name: Update pull-request body
on: [pull_request]

jobs:
  update-pr:
    runs-on: ubuntu-latest
    steps:
      - name: Update PR Body
        uses: chiaretto/github-action-concat-pr-body@master
        with:
          github-token: "${{ secrets.GITHUB_TOKEN }}"
          message: "This pull request generated the following artifacts."
          replace-last-message: true
```

## Example usage with force PR Number

```
name: Update pull-request body
on: [pull_request]

jobs:
  update-pr:
    runs-on: ubuntu-latest
    steps:
      - name: Update PR Body
        uses: chiaretto/github-action-concat-pr-body@master
        with:
          github-token: "${{ secrets.GITHUB_TOKEN }}"
          message: "This pull request generated the following artifacts."
          replace-last-message: true
          pr-number: 123456
```
