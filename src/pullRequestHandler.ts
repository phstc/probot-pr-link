import { findFixableIssues } from './findFixableIssues'

export async function updateReferencedIssues(context: any) {
  const pullRequest = context.payload.pull_request
  await findFixableIssues(pullRequest.body).forEach(async (number: any) => {
    await updateIssue(context, number, pullRequest)
  })
}

const updateIssue = async (context: any, number: any, pullRequest: any) => {
  const github = context.github
  const repo = context.payload.repository.name
  const owner = context.payload.repository.owner.login

  const issue = (await github.issues.get({ owner, repo, number })).data

  const body =
    pullRequest.state == 'closed'
      ? bodyForClosedPR(pullRequest.number, issue.body)
      : bodyForOpenPR(pullRequest.number, issue.body)

  const attributes = { body }

  await github.issues.edit({
    ...attributes,
    owner,
    repo,
    number
  })
}

function bodyForClosedPR(number: any, body: string): string {
  return body
    .split(`:point_right: #${number}`)
    .join(`:point_right: <s>#${number}</s>`)
}

function bodyForOpenPR(number: any, body: string): string {
  body = body
    .split(`:point_right: <s>#${number}</s>`)
    .join(`:point_right: #${number}`)

  if (body.indexOf(`#${number}`) !== -1) {
    return body
  }

  if (!body.endsWith('\n\n') && !body.includes(':point_right: #')) {
    body += '\n\n'
  }

  return (body += `\n:point_right: #${number}`)
}
