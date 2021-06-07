const core = require('@actions/core');
const github = require('@actions/github');

// Toolkit docs: https://github.com/actions/toolkit
async function run() {
  try {

    const inputs = {
      token: core.getInput('github-token', {required: true}),
      replaceLastMessage: core.getInput('replace-last-message', {required: false}),
      message: core.getInput('message', {required: true}),
    };

    console.log(github)
    console.log(github.context)
    console.log(github.context.payload)

    // Pull-request format: https://developer.github.com/v3/pulls/#response

    const variables = {
      prNumber: github.context.payload.pull_request.number
    };

    const body = github.context.payload.pull_request.body;

    console.log('Original description: ', body);

    if (!body) return;

    const separator = "\r\r---------------------------------------------\r\r"
    const dateTime = "\r\r> Generated at " + Date()

    let newBody;
    if (inputs.replaceLastMessage) {
      newBody = body.split(separator).shift() + separator + inputs.message + dateTime;
    } else {
      newBody = body + separator + inputs.message + dateTime;
    }

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
