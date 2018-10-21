import { Application } from 'probot'
import { updateReferencedIssues } from './pullRequestHandler'

export = (app: Application) => {
  app.on([
    'pull_request.closed',
    'pull_request.opened',
    'pull_request.edited',
    'pull_request.reopened'
  ], async context => updateReferencedIssues(context))
}
