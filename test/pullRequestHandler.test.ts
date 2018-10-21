import { updateReferencedIssues } from '../src/pullRequestHandler'

const owner = 'owner'
const repo = 'repo'
const number = '1234'
const pullRequest = {
  body: `Closes #${number}`,
  merged: true,
  number: '5678',
  state: 'opened',
  user: {
    login: 'phstc'
  }
}

const github = {
  issues: {
    get: jest.fn(),
    edit: jest.fn(),
    addAssigneesToIssue: jest.fn()
  }
}

const context = {
  github: github,
  payload: {
    pull_request: pullRequest,
    repository: {
      name: 'repo',
      owner: {
        login: 'owner'
      }
    }
  }
}

beforeEach(() => {
  github.issues.get.mockReset()
  github.issues.edit.mockReset()
})

test('adds references', async () => {
  const issue = { number: '1234', state: 'open', body: '', labels: [] }
  github.issues.get.mockReturnValue({ data: issue })

  await updateReferencedIssues(context)

  expect(github.issues.get).toBeCalledWith({ owner, repo, number })

  const body = `\n\n\n:pushpin: #${pullRequest.number}`

  expect(github.issues.edit).toBeCalledWith({
    owner,
    repo,
    number,
    body
  })
})

test('closes references', async () => {
  const issue = {
    number: '1234',
    state: 'open',
    body: `\n\n\n:pushpin: #${pullRequest.number}`,
    labels: []
  }
  github.issues.get.mockReturnValue({ data: issue })

  pullRequest.state = 'closed'

  await updateReferencedIssues(context)

  expect(github.issues.get).toBeCalledWith({ owner, repo, number })

  const body = `\n\n\n:pushpin: <s>#${pullRequest.number}</s>`

  expect(github.issues.edit).toBeCalledWith({
    owner,
    repo,
    number,
    body
  })
})
