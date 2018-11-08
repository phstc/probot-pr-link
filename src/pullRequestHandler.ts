import { findFixableIssues } from './findFixableIssues'

export async function updateReferencedIssues (context: any) {
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

  // issue.body can be null
  const originalBody = issue.body || ''

  const body =
    pullRequest.state === 'closed'
      ? bodyForClosedPR(pullRequest.number, originalBody)
      : bodyForOpenPR(pullRequest.number, originalBody)

  if (originalBody === body) {
    // nothing to update
    return
  }

  const attributes = { body }

  await github.issues.edit({
    ...attributes,
    owner,
    repo,
    number
  })
}

function bodyForClosedPR (number: any, body: string): string {
  return body.split(`:pushpin: #${number}`).join(`:pushpin: <s>#${number}</s>`)
}

function bodyForOpenPR (number: any, body: string): string {
  body = body.split(`:pushpin: <s>#${number}</s>`).join(`:pushpin: #${number}`)

  if (body.indexOf(`:pushpin: #${number}`) !== -1) {
    return body
  }

  if (!body.endsWith('\n\n') && !body.includes(':pushpin: #')) {
    body += '\n\n'
  }

  return (body += `\n:pushpin: #${number}`)
}
