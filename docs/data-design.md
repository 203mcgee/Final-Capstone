# Data Design

This write-up covers my Skills feature (Option C): a searchable list of my skills, where logged-in visitors can endorse a skill once and only the admin can create, edit, or delete.

## 1. Why a document database?

A skill is one self-contained record: its name, category, level, years of experience, and the list of users who endorsed it. I always read and write it as a whole, so MongoDB can store it as a single document and I never need a join. The shape can also grow later (for example, adding a `notes` field) without a migration. I would choose SQL instead for data with many linked records that must stay consistent together, such as bank transfers or orders and inventory.

## 2. The same data in SQL

```sql
CREATE TABLE skills (
  id               TEXT PRIMARY KEY CHECK (id ~ '^SKL-[0-9]{4,}$'),
  name             TEXT NOT NULL UNIQUE,
  category         TEXT NOT NULL
                   CHECK (category IN ('frontend', 'backend', 'database', 'tools', 'design')),
  level            TEXT NOT NULL
                   CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  years_experience NUMERIC(4, 2) NOT NULL DEFAULT 0 CHECK (years_experience >= 0),
  endorsements     INTEGER NOT NULL DEFAULT 0 CHECK (endorsements >= 0)
);
```

## 3. Arrays and relationships

My document stores `endorsedBy` as an array of user IDs. SQL has no good way to store a list inside one column, so I would make a join table, `skill_endorsements`, with `skill_id` (a foreign key to `skills.id`) and `user_id` (a foreign key to `users.id`). Its primary key would be the pair `(skill_id, user_id)`, which also guarantees that one user can endorse a skill only once.

```sql
CREATE TABLE skill_endorsements (
  skill_id TEXT NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  user_id  UUID NOT NULL REFERENCES users(id)  ON DELETE CASCADE,
  PRIMARY KEY (skill_id, user_id)
);
```

## 4. Who enforces the rules?

| Rule | Enforced by |
|---|---|
| Body has the right shape, unknown fields stripped, `name` not empty, `level` and `category` in the allowed lists | **Zod**, before the route runs |
| `required`, `enum`, `trim`, `min: 0` on the schema | **Mongoose**, when a document is saved or updated |
| `name` is unique, `_id` is unique | **MongoDB**, through its indexes (duplicate key error 11000) |
| One endorsement per user | **MongoDB**, through the atomic update in my endorse route |

MongoDB itself does very little checking, so the rules above Mongoose can be skipped by anyone writing to the database directly. In PostgreSQL the database would enforce NOT NULL, CHECK (the level, category, and non-negative values), UNIQUE, the primary key, and the foreign keys.

## 5. Custom IDs

A readable, sequential ID like `SKL-0009` is fine for skills because they are public, created only by me, and easy to reference in Postman and in my demo. It would be a bad choice for user accounts, because sequential IDs are easy to guess and let someone loop through every account number and learn how many users exist. User IDs should be random-looking (like MongoDB's ObjectId or a UUID), since they also end up inside login tokens.

## 6. Atomic updates

The race condition is two requests from the same user arriving at the same moment. With "read, check in JavaScript, then save," both requests read the skill before either one saves, both see that the user has not endorsed it, and both add one, so the count goes up by 2 and the user appears endorsed twice. My route avoids this by putting the check in the filter (`endorsedBy: { $ne: userId }`) and doing `$inc` and `$addToSet` in the same `findOneAndUpdate`. MongoDB applies that single update to the document atomically, so the second request matches nothing and gets a 409.

## 7. Transactions

Merging two duplicate skills (for example "React" and "React.js") would need a transaction. I would move the endorsements from one skill to the other, update the count, and delete the old skill, and these changes touch several documents. If the server crashed halfway, I could end up with endorsements copied but the old skill still there, or the old skill deleted without the endorsements moved. A single `findOneAndUpdate` only changes one document, so it cannot make all of those steps succeed or fail together.

## 8. Deactivate, don't delete

If a visitor who endorsed skills deleted their account, their user ID would stay in `endorsedBy` arrays, pointing at a user that no longer exists. The count would still include them, which might be unwanted if they were truly removed. It is better to deactivate the account (`isActive: false`) and remove their personal details, so the endorsement stays valid and the count stays consistent. If a real delete were required, the app should remove the ID from every `endorsedBy` array and lower each count in one transaction.
