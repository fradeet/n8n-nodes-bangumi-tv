# Operation Naming & Structure Refactoring Design

## Overview

Refactor all operation `value`, `name`, `action`, and `description` fields across the Bangumi.tv n8n node to match the updated spec in `temp/RESOURCES.md`. This includes deleting the Me resource (merging into User), deleting Subject's `getCollection` operation, renaming 27 operations, and updating copy for all remaining operations.

## Scope

### Files to Delete (3)

- `nodes/BangumitvApi/actions/me/Me.resource.ts`
- `nodes/BangumitvApi/actions/me/get.operation.ts`
- `nodes/BangumitvApi/actions/subject/getCollection.operation.ts`

### Files to Create (1)

- `nodes/BangumitvApi/actions/user/getMe.operation.ts` — migrated from Me.get, value changed to `getMe`

### Files to Rename & Modify (27 operation files)

Each file rename also requires updating the `operation` value inside `displayOptions`.

#### Character (4 renames)
| Current File | New File | Current Value | New Value |
|---|---|---|---|
| `collect.operation.ts` | `createCollection.operation.ts` | `collect` | `createCollection` |
| `getPersons.operation.ts` | `getManyRelatedPersons.operation.ts` | `getPersons` | `getManyRelatedPersons` |
| `getSubjects.operation.ts` | `getManyRelatedSubjects.operation.ts` | `getSubjects` | `getManyRelatedSubjects` |
| `uncollect.operation.ts` | `deleteCollection.operation.ts` | `uncollect` | `deleteCollection` |

#### Person (4 renames)
| Current File | New File | Current Value | New Value |
|---|---|---|---|
| `collect.operation.ts` | `createCollection.operation.ts` | `collect` | `createCollection` |
| `getCharacters.operation.ts` | `getManyRelatedCharacters.operation.ts` | `getCharacters` | `getManyRelatedCharacters` |
| `getSubjects.operation.ts` | `getManyRelatedSubjects.operation.ts` | `getSubjects` | `getManyRelatedSubjects` |
| `uncollect.operation.ts` | `deleteCollection.operation.ts` | `uncollect` | `deleteCollection` |

#### Index (4 renames)
| Current File | New File | Current Value | New Value |
|---|---|---|---|
| `addSubject.operation.ts` | `addendSubject.operation.ts` | `addSubject` | `addendSubject` |
| `collect.operation.ts` | `createCollection.operation.ts` | `collect` | `createCollection` |
| `getSubjects.operation.ts` | `getManySubjects.operation.ts` | `getSubjects` | `getManySubjects` |
| `uncollect.operation.ts` | `deleteCollection.operation.ts` | `uncollect` | `deleteCollection` |

#### Collection (5 renames)
| Current File | New File | Current Value | New Value |
|---|---|---|---|
| `getCharacterCollection.operation.ts` | `getCharacter.operation.ts` | `getCharacterCollection` | `getCharacter` |
| `getMany.operation.ts` | `getManySubjects.operation.ts` | `getMany` | `getManySubjects` |
| `getCharacterCollections.operation.ts` | `getManyCharacters.operation.ts` | `getCharacterCollections` | `getManyCharacters` |
| `getPersonCollections.operation.ts` | `getManyPersons.operation.ts` | `getPersonCollections` | `getManyPersons` |
| `getPersonCollection.operation.ts` | `getPerson.operation.ts` | `getPersonCollection` | `getPerson` |

#### Episode (2 renames)
| Current File | New File | Current Value | New Value |
|---|---|---|---|
| `getCollections.operation.ts` | `getManyCollection.operation.ts` | `getCollections` | `getManyCollection` |
| `updateCollections.operation.ts` | `updateManyCollections.operation.ts` | `updateCollections` | `updateManyCollections` |

#### Revision (4 renames)
| Current File | New File | Current Value | New Value |
|---|---|---|---|
| `getCharacterRevisions.operation.ts` | `getManyCharacterRevisions.operation.ts` | `getCharacterRevisions` | `getManyCharacterRevisions` |
| `getEpisodeRevisions.operation.ts` | `getManyEpisodeRevisions.operation.ts` | `getEpisodeRevisions` | `getManyEpisodeRevisions` |
| `getPersonRevisions.operation.ts` | `getManyPersonRevisions.operation.ts` | `getPersonRevisions` | `getManyPersonRevisions` |
| `getSubjectRevisions.operation.ts` | `getManySubjectRevisions.operation.ts` | `getSubjectRevisions` | `getManySubjectRevisions` |

#### Subject (3 renames)
| Current File | New File | Current Value | New Value |
|---|---|---|---|
| `getCharacters.operation.ts` | `getManyRelatedCharacters.operation.ts` | `getCharacters` | `getManyRelatedCharacters` |
| `getPersons.operation.ts` | `getManyRelatedPersons.operation.ts` | `getPersons` | `getManyRelatedPersons` |
| `getRelations.operation.ts` | `getManyRelatedSubjects.operation.ts` | `getRelations` | `getManyRelatedSubjects` |

### Resource Files to Update (9 `.resource.ts` files)

Each resource file needs:
1. Import path updates (for renamed operation files)
2. Operation options updates (name, value, action, description per `temp/RESOURCES.md`)
3. For `descriptions.ts`: remove Me import, add User.getMe import

### Unchanged

- All `routing` configurations (URLs, HTTP methods) remain identical
- `BangumitvApi.node.ts` — no changes
- Credentials — no changes

## Implementation Order

1. **Me → User migration**: Delete `me/` directory, create `user/getMe.operation.ts`, update `User.resource.ts`
2. **Subject**: Delete `getCollection.operation.ts`, rename 3 operations, update `Subject.resource.ts`
3. **Character**: Rename 4 operations, update `Character.resource.ts`
4. **Person**: Rename 4 operations, update `Person.resource.ts`
5. **Index**: Rename 4 operations, update `Index.resource.ts`
6. **Collection**: Rename 5 operations, update `Collection.resource.ts`
7. **Episode**: Rename 2 operations, update `Episode.resource.ts`
8. **Revision**: Rename 4 operations, update `Revision.resource.ts`
9. **descriptions.ts**: Remove Me import, update all imports
10. **文案 sweep**: Verify all name/action/description match `temp/RESOURCES.md`

## Constraints

- File renames must also update `displayOptions.operation` values inside the operation file
- Resource `.resource.ts` files must update both import names and spread references
- `temp/RESOURCES.md` is the single source of truth for all copy
