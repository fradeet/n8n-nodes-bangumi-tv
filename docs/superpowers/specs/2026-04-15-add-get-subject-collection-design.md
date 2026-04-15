# Add Get Subject Collection Operation

## Summary

Add a "Get Subject Collection" operation to the Collection resource, corresponding to the Bangumi API endpoint `GET /v0/users/{username}/collections/{subject_id}`.

## API Endpoint

- **Method**: GET
- **Path**: `/v0/users/{username}/collections/{subject_id}`
- **Auth**: OptionalHTTPBearer
- **Response**: `UserSubjectCollection` schema
- **Operation ID**: `getUserCollection`

## Changes

### New file

`nodes/BangumiTv/actions/collection/getSubjectCollection.operation.ts`

Properties:

| Property | Type | Required | Display Name |
|----------|------|----------|--------------|
| `username` | string | Yes | Username |
| `subjectId` | string | Yes | Subject ID |

The `username` property carries the routing config:

```
GET /v0/users/{{$value}}/collections/{{$parameter["subjectId"]}}
```

### Modified file

`nodes/BangumiTv/actions/collection/Collection.resource.ts`

- Import properties from `getSubjectCollection.operation.ts`
- Add option to the operations dropdown (alphabetically after "Get Character Collection"):

| Field | Value |
|-------|-------|
| name | `getSubjectCollection` |
| displayName | `Get Subject Collection` |
| action | `Get subject collection` |
| description | `View a user's subject collection` |

- Spread the new properties into the description array

## Pattern Consistency

This follows the exact same pattern as `getCharacterCollection.operation.ts` and `getPersonCollection.operation.ts` — two required properties (entity ID + username), URL routing on the username property.
