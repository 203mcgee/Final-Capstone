Why a document database? Using the "pick by the shape of your data" slide, explain why MongoDB fits your feature. Name one kind of data where you would choose SQL instead.


The same data in SQL. Write the CREATE TABLE statement for your main collection in PostgreSQL. Include a primary key, NOT NULL, and at least one CHECK constraint (for example, likes >= 0). You do not need to run it.


Arrays and relationships. Your document stores arrays (techStack, likedBy, or endorsedBy). How would SQL store the same thing? Name the extra table and its foreign keys.


Who enforces the rules? For each of your schema rules, say whether MongoDB, Mongoose, or Zod enforces it. Which of these would the database itself enforce in PostgreSQL?


Custom IDs. Why is a readable, sequential ID fine for your feature? Why would it be a bad choice for user accounts?


Atomic updates. Explain the race condition your like route prevents, and what would go wrong with the read, check in JavaScript, then save version.


Transactions. Describe one change to your app that would need a transaction (all or nothing), and why a single findOneAndUpdate wouldn't be enough.


Deactivate, don't delete. If a visitor who liked or posted something deletes their account, what happens to their likedBy entries or guestbook posts? What should happen?


