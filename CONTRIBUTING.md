# Contributing to CryptoCritters

We love your input! We want to make contributing to CryptoCritters as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Development Process

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

### Pull Requests

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Pull Request Process

1. Update the README.md or documentation with details of changes if applicable
2. Update the tests for any code changes
3. The PR should work for all supported environments
4. PRs require approval from at least one maintainer before merging

## Project Structure

Please maintain the existing project structure:

```
/crypto-critters
├── packages/
│   ├── hardhat/        # Smart contract development
│   └── nextjs/         # Frontend application
```

## Development Setup

1. Install dependencies:
   ```bash
   yarn install
   ```

2. Run the local development environment:
   ```bash
   # In one terminal, run the local blockchain
   yarn hardhat:node

   # In another terminal, deploy the contract
   yarn hardhat:deploy

   # Then start the frontend
   yarn nextjs:dev
   ```

## Code Style

For JavaScript and TypeScript code:
- Use Prettier for code formatting
- Follow ESLint rules defined in the project

For Solidity code:
- Follow the [Solidity Style Guide](https://docs.soliditylang.org/en/latest/style-guide.html)
- Use NatSpec comments for all public functions

## Testing

Before submitting a PR, make sure all tests pass:

```bash
# Run smart contract tests
yarn hardhat:test

# Run frontend tests (when applicable)
yarn nextjs:test
```

## License

By contributing, you agree that your contributions will be licensed under the project's [MIT License](LICENSE).

## Questions?

Feel free to open an issue or contact the maintainers if you have any questions about contributing.
