# Get Subject Collection Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the Get Subject Collection operation for the Collection resource, corresponding to the Bangumi API endpoint `GET /v0/users/{username}/collections/{subject_id}`.

**Architecture:** Follow the existing pattern used by other single-item collection operations (getCharacter, getPerson), creating a new operation file and updating the resource file to include it.

**Tech Stack:** TypeScript, n8n-workflow, Bangumi API

---

### Task 1: Create getSubjectCollection.operation.ts

**Files:**
- Create: `nodes/BangumiTv/actions/collection/getSubjectCollection.operation.ts`

- [ ] **Step 1: Create the operation file**

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

- [ ] **Step 2: Verify the file creation**

Run: `ls -la nodes/BangumiTv/actions/collection/`
Expected: `getSubjectCollection.operation.ts` should be listed

- [ ] **Step 3: Commit**

```bash
git add nodes/BangumiTv/actions/collection/getSubjectCollection.operation.ts
git commit -m "feat: add getSubjectCollection operation"
```

### Task 2: Update Collection.resource.ts

**Files:**
- Modify: `nodes/BangumiTv/actions/collection/Collection.resource.ts`

- [ ] **Step 1: Add import for the new operation**

Add the import statement:

```typescript
import { properties as getSubjectCollectionProps } from './getSubjectCollection.operation';
```

- [ ] **Step 2: Add the operation to the options array**

Add the new operation in alphabetical order:

```typescript
{
	name: 'Get Subject Collection',
	value: 'getSubjectCollection',
	action: 'Get subject collection',
	description: 'View a user\'s subject collection',
},
```

- [ ] **Step 3: Add the properties to the description array**

Add the spread for the new properties:

```typescript
...getSubjectCollectionProps,
```

- [ ] **Step 4: Verify the changes**

Run: `cat nodes/BangumiTv/actions/collection/Collection.resource.ts`
Expected: The file should include the new import, operation, and properties

- [ ] **Step 5: Commit**

```bash
git add nodes/BangumiTv/actions/collection/Collection.resource.ts
git commit -m "feat: add getSubjectCollection to Collection resource"
```

### Task 3: Verify the implementation

**Files:**
- All files created/modified in previous tasks

- [ ] **Step 1: Run TypeScript compilation**

Run: `npx tsc --noEmit`
Expected: No errors (only deprecation warnings are acceptable)

- [ ] **Step 2: Verify the operation appears in the collection resource**

Run: `grep -n "getSubjectCollection" nodes/BangumiTv/actions/collection/Collection.resource.ts`
Expected: Multiple matches for the operation name and value

- [ ] **Step 3: Commit final verification**

```bash
git commit -m "chore: verify getSubjectCollection implementation"
```

## Self-Review

**1. Spec coverage:**
- ✅ New file created: `nodes/BangumiTv/actions/collection/getSubjectCollection.operation.ts`
- ✅ Modified file: `nodes/BangumiTv/actions/collection/Collection.resource.ts`
- ✅ Properties added: username (required), subjectId (required)
- ✅ Routing configured: `GET /v0/users/{{$value}}/collections/{{$parameter["subjectId"]}}`
- ✅ Operation added to dropdown: "Get Subject Collection"

**2. Placeholder scan:**
- ✅ No placeholders, all steps have complete code
- ✅ No TODO or TBD items
- ✅ All commands and code are fully specified

**3. Type consistency:**
- ✅ Uses the same pattern as getCharacter and getPerson operations
- ✅ TypeScript types are consistent with existing code
- ✅ Property names and routing syntax match existing patterns
