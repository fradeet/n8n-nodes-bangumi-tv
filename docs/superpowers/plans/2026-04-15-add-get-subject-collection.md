# Add Get Subject Collection Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "Get Subject Collection" operation to the Collection resource, mapping to `GET /v0/users/{username}/collections/{subject_id}`.

**Architecture:** Follow the existing declarative operation pattern — one operation file exporting `properties`, registered in the resource file. No programmatic logic needed.

**Tech Stack:** TypeScript, n8n-workflow (INodeProperties), n8n-node CLI (lint, build)

---

### Task 1: Create the operation file

**Files:**
- Create: `nodes/BangumiTv/actions/collection/getSubjectCollection.operation.ts`

- [ ] **Step 1: Create the operation file**

Create `nodes/BangumiTv/actions/collection/getSubjectCollection.operation.ts` with this exact content:

```typescript
import type { INodeProperties } from 'n8n-workflow';

export const properties: INodeProperties[] = [
	{
		displayName: 'Username',
		name: 'username',
		type: 'string',
		required: true,
		default: '',
		routing: {
			request: {
				method: 'GET',
				url: '=/v0/users/{{$value}}/collections/{{$parameter["subjectId"]}}',
			},
		},
		displayOptions: { show: { resource: ['collection'], operation: ['getSubjectCollection'] } },
	},
	{
		displayName: 'Subject ID',
		name: 'subjectId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['collection'], operation: ['getSubjectCollection'] } },
	},
];
```

### Task 2: Register the operation in the resource file

**Files:**
- Modify: `nodes/BangumiTv/actions/collection/Collection.resource.ts`

- [ ] **Step 1: Add the import**

At the top of `Collection.resource.ts`, add the new import alongside the existing ones:

```typescript
import { properties as getSubjectCollectionProps } from './getSubjectCollection.operation';
```

- [ ] **Step 2: Add the operation option**

In the `options` array inside the operation dropdown, add the new entry after "Get Character Collection" (alphabetical order):

```typescript
{
	name: 'Get Subject Collection',
	value: 'getSubjectCollection',
	action: 'Get subject collection',
	description: "View a user's subject collection",
},
```

- [ ] **Step 3: Spread the properties**

At the bottom of the `description` array, add the spread:

```typescript
...getSubjectCollectionProps,
```

### Task 3: Verify build passes

- [ ] **Step 1: Run lint**

Run: `bunx n8n-node lint`
Expected: No errors

- [ ] **Step 2: Run build**

Run: `bunx n8n-node build`
Expected: Build succeeds without errors

- [ ] **Step 3: Commit**

```bash
git add nodes/BangumiTv/actions/collection/getSubjectCollection.operation.ts nodes/BangumiTv/actions/collection/Collection.resource.ts
git commit -m "feat: add Get Subject Collection operation to Collection resource"
```
