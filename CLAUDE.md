@AGENTS.md

## AGENTS.md Documentation Overview

AGENTS.md and its subdocuments (`.agents/*.md`) provide a comprehensive guide for n8n community node development, covering:

### Core Development Workflow
- **workflow.md**: Project workflow, development guidelines, `n8n-node` CLI command reference

### Node Development
- **nodes.md**: Node fundamentals, description structure, resource and operation patterns
- **nodes-declarative.md**: Declarative-style nodes (for simple HTTP/REST integrations)
- **nodes-programmatic.md**: Programmatic-style nodes (for complex scenarios and multiple API calls)

### Configuration & Authentication
- **credentials.md**: Credential classes, authentication methods (API Key, OAuth2, etc.)
- **properties.md**: Property definitions, expressions, dynamic options, display logic
- **versioning.md**: Node versioning (light versioning and full versioning)

### Development Principles
- Prefer declarative nodes (unless complex control flow is needed)
- Always address lint/typecheck errors
- Use proper type definitions
- Follow n8n UX guidelines
- Ensure credential security (mark sensitive values as `password`)

**Note**: Code examples in documentation are illustrative only. Adapt them to your actual API requirements. Do not copy service-specific names (like WordPress) directly.
