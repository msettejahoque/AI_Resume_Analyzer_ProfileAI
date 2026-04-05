import { analyzeResume } from './analyze';

const resume = `
John Doe
Frontend Developer
Skills: React, TypeScript, Node.js, CSS
Experience: 3 years at startup building web apps
Education: BS Computer Science
`;

const jobDescription = `
We are looking for a Senior Frontend Developer at Stripe.
Requirements:
- 3+ years React experience
- TypeScript required
- Experience with REST APIs
- Agile methodology
- Must be US authorized to work
- No visa sponsorship available
`;

analyzeResume(resume, jobDescription)
  .then((result) => console.log(JSON.stringify(result, null, 2)))
  .catch((err) => console.error(err));


