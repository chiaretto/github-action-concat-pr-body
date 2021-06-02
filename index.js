const core = require('@actions/core');
const github = require('@actions/github');

// Toolkit docs: https://github.com/actions/toolkit

async function run() {
  try {
    const inputs = {
      token: core.getInput('github-token', {required: true})
      message: core.getInput('message', {required: true})
    };

    // Pull-request format: https://developer.github.com/v3/pulls/#response
    const variables = {
      prNumber: github.context.payload.pull_request.number
    };

    const body = github.context.payload.pull_request.body;

    console.log('Original description: ', body);

    if (!body) return;

    const separator = "\r\r---------------------------------------------\r\r"

    const newBody = body + separator + inputs.message;

    console.log('Concatenated description: ', newBody);

    const request = {
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      pull_number: github.context.payload.pull_request.number,
      body: newBody
    };

    const client = new github.GitHub(inputs.token);
    const response = await client.pulls.update(request);

    if (response.status !== 200) {
      core.error('There was an issue while trying to update the pull-request.');
    }
  } catch (error) {
    core.error(error);
    core.setFailed(error.message);
  }
}

run()
