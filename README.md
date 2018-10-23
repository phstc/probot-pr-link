# probot-pr-link

PR Link adds the PR link back to all closable issues for helping to navigate back-forth in between issues and pull requests.

Add `Fixes #issue-number` (or [any other closable keyword](https://help.github.com/articles/closing-issues-using-keywords/)) to a pull request:

![](https://raw.githubusercontent.com/phstc/probot-pr-link/master/pr-link-1.png)

Then PR link will automatically add :pushpin: #pr-number back to the respective issue(s).

![](https://raw.githubusercontent.com/phstc/probot-pr-link/master/pr-link-1.png)

## Setup

```sh
# Install dependencies
yarn install

# Run typescript
yarn run build

# Run the bot
yarn start
```

## Contributing

If you have suggestions for how probot-pr-link could be improved, or want to report a bug, open an issue! We'd love all and any contributions.

For more, check out the [Contributing Guide](CONTRIBUTING.md).

## License

[ISC](LICENSE) © 2018 Pablo Cantero <pablohstc@gmail.com> (https://github.com/phstc/probot-pr-link)
