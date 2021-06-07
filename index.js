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

    if (github.context.payload.pull_request) {
        console.log('pull_request', github.context.payload.pull_request)
        prNumber = github.context.payload.pull_request.number
    } else {
        console.log('workflow_run', github.context.payload.workflow_run.pull_requests)
        prNumber = github.context.payload.workflow_run.pull_requests.shift().number
    }
    console.log('PR Number: ', prNumber);

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
      pull_number: prNumber,
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
