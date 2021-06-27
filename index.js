const core = require('@actions/core');
const github = require('@actions/github');

// Toolkit docs: https://github.com/actions/toolkit
async function run() {
  try {

    const inputs = {
      token: core.getInput('github-token', {required: true}),
      replaceLastMessage: core.getInput('replace-last-message', {required: false}),
      message: core.getInput('message', {required: true}),
      prNumberForced: core.getInput('pr-number', {required: false}),
    };

    const client = new github.GitHub(inputs.token);

    let body;
    let prNumber;

    if (inputs.prNumberForced) {
        prNumber = inputs.prNumberForced
    } else {
        if (github && github.context && github.context.payload && github.context.payload.pull_request && github.context.payload.pull_request.number) {
            prNumber = github.context.payload.pull_request.number
            body = github.context.payload.pull_request.body;
        } else {
            console.log(github.context.payload.workflow_run)
            console.log(github.context.payload.workflow_run.pull_requests[0])
            console.log(github.context.payload.workflow_run.pull_requests[0].number)
            prNumber = github.context.payload.workflow_run.pull_requests.shift().number
            const responsePr = await client.pulls.get({
              owner: github.context.repo.owner,
              repo: github.context.repo.repo,
              pull_number: prNumber,
            })
            body = responsePr.data.body
        }
    }

    console.log('PR Number: ', prNumber);

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

    const response = await client.pulls.update({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      pull_number: prNumber,
      body: newBody
    });

    if (response.status !== 200) {
      core.error('There was an issue while trying to update the pull-request.');
    }
  } catch (error) {
    core.error(error);
    core.setFailed(error.message);
  }
}

run()
